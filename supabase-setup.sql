-- ============================================================
-- Setup Supabase: daftar tamu + RSVP, role admin & anggota (PIN)
-- 1) UBAH dua PIN di bagian "PIN AWAL" di bawah (4-8 angka, disarankan 6).
-- 2) Tempel seluruh file ini di Supabase > SQL Editor > Run.
-- Semua tabel terkunci (RLS tanpa policy): hanya bisa diakses lewat fungsi
-- di bawah, yang memeriksa PIN di server. PIN disimpan ter-hash (bcrypt).
-- ============================================================
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.tamu(
  id text primary key, nama text not null, wa text not null default '',
  jml int not null default 1, kat text not null default '',
  status text not null default 'belum' check (status in ('belum','terkirim','hadir','tidak')),
  ucap text not null default '', rsvp_at text not null default '', alias text not null default '',
  deleted boolean not null default false, created_at timestamptz not null default now());
create table if not exists public.rsvp(
  id bigserial primary key,
  waktu text not null default to_char(now() at time zone 'utc','YYYY-MM-DD"T"HH24:MI:SS.US"Z"'),
  nama text not null, hadir text not null check (hadir in ('Ya','Tidak')),
  jml int not null default 1, ucap text not null default '');
create table if not exists public.pins(role text primary key check (role in ('admin','anggota')), hash text not null);
create table if not exists public.pin_gagal(at timestamptz not null default now());
alter table public.tamu enable row level security;
alter table public.rsvp enable row level security;
alter table public.pins enable row level security;
alter table public.pin_gagal enable row level security;
revoke all on public.tamu, public.rsvp, public.pins, public.pin_gagal from anon, authenticated;

-- ===== PIN AWAL (ubah sebelum Run!) =====
insert into public.pins(role,hash) values
 ('admin',   extensions.crypt('111111', extensions.gen_salt('bf'))),
 ('anggota', extensions.crypt('222222', extensions.gen_salt('bf')))
on conflict (role) do nothing;

-- Periksa PIN -> 'admin' | 'anggota' | 'locked' | null. 10 PIN salah dalam 10 menit = terkunci sementara.
create or replace function public.chk(p_pin text) returns text
language plpgsql security definer set search_path=public,extensions as $$
declare r text;
begin
  delete from pin_gagal where at < now() - interval '1 day';
  if (select count(*) from pin_gagal where at > now() - interval '10 minutes') >= 10 then return 'locked'; end if;
  select role into r from pins where hash = crypt(coalesce(p_pin,''), hash) order by role limit 1;
  if r is null then insert into pin_gagal default values; end if;
  return r;
end $$;

-- Sinkron daftar tamu. Anggota: boleh lihat, tambah, ubah. Hanya admin yang boleh menghapus.
create or replace function public.sync(p_pin text, p_changes jsonb default '[]') returns jsonb
language plpgsql security definer set search_path=public,extensions as $$
declare r text := chk(p_pin); c jsonb; g jsonb;
begin
  if r is null or r = 'locked' then
    return jsonb_build_object('ok',false,'error',case when r='locked' then 'locked' else 'unauthorized' end);
  end if;
  for c in select value from jsonb_array_elements(coalesce(p_changes,'[]'::jsonb)) loop
    if c->>'op' = 'up' then
      g := c->'g';
      if coalesce(trim(g->>'nama'),'') <> '' then
        insert into tamu(id,nama,wa,jml,kat,status,ucap,rsvp_at,alias) values (
          left(c->>'id',40), left(g->>'nama',60), left(coalesce(g->>'wa',''),20),
          greatest(1,least(50,coalesce((g->>'jml')::int,1))), left(coalesce(g->>'kat',''),40),
          case when g->>'status' in ('belum','terkirim','hadir','tidak') then g->>'status' else 'belum' end,
          left(coalesce(g->>'ucap',''),300), left(coalesce(g->>'rsvpAt',''),40), left(coalesce(g->>'alias',''),60))
        on conflict (id) do update set nama=excluded.nama, wa=excluded.wa, jml=excluded.jml, kat=excluded.kat,
          status=excluded.status, ucap=excluded.ucap, rsvp_at=excluded.rsvp_at, alias=excluded.alias, deleted=false
          where r = 'admin' or not tamu.deleted;
      end if;
    elsif c->>'op' = 'del' and r = 'admin' then
      update tamu set deleted = true where id = c->>'id';
    end if;
  end loop;
  return jsonb_build_object('ok',true,'role',r,
    'tamu',(select coalesce(jsonb_agg(jsonb_build_object('id',id,'nama',nama,'wa',wa,'jml',jml,'kat',kat,'status',status,
        'ucap',ucap,'rsvpAt',rsvp_at,'alias',alias,'del',deleted) order by created_at desc),'[]'::jsonb) from tamu),
    'rows',(select coalesce(jsonb_agg(jsonb_build_object('waktu',waktu,'nama',nama,'hadir',hadir,'jml',jml,'ucap',ucap) order by waktu),'[]'::jsonb) from rsvp));
end $$;

-- Ganti PIN (hanya admin).
create or replace function public.set_pin(p_pin text, p_role text, p_new text) returns jsonb
language plpgsql security definer set search_path=public,extensions as $$
declare r text := chk(p_pin);
begin
  if r is distinct from 'admin' then
    return jsonb_build_object('ok',false,'error',case when r='locked' then 'locked' else 'unauthorized' end);
  end if;
  if p_role not in ('admin','anggota') or p_new !~ '^[0-9]{4,8}$' then
    return jsonb_build_object('ok',false,'error','invalid');
  end if;
  update pins set hash = crypt(p_new, gen_salt('bf')) where role = p_role;
  return jsonb_build_object('ok',true);
end $$;

-- RSVP dari halaman undangan (tanpa PIN, hanya bisa menambah).
create or replace function public.submit_rsvp(p_nama text, p_hadir text, p_jml int, p_ucap text default '', p_web text default '') returns jsonb
language plpgsql security definer set search_path=public as $$
begin
  if coalesce(p_web,'') <> '' then return jsonb_build_object('ok',true); end if;   -- jebakan bot
  if coalesce(trim(p_nama),'') = '' or p_hadir not in ('Ya','Tidak') or p_jml is null or p_jml not between 1 and 50 then
    return jsonb_build_object('ok',false,'error','invalid');
  end if;
  if (select count(*) from rsvp where waktu > to_char((now() - interval '1 minute') at time zone 'utc','YYYY-MM-DD"T"HH24:MI:SS.US"Z"')) >= 40 then
    return jsonb_build_object('ok',false,'error','busy');
  end if;
  insert into rsvp(nama,hadir,jml,ucap) values (left(trim(p_nama),60), p_hadir, p_jml, left(coalesce(p_ucap,''),300));
  return jsonb_build_object('ok',true);
end $$;

revoke execute on all functions in schema public from public, anon, authenticated;
grant execute on function public.sync(text,jsonb), public.set_pin(text,text,text),
  public.submit_rsvp(text,text,int,text,text) to anon;
