(function () {
  var burger = document.getElementById("burgerBtn");
  var links = document.getElementById("navLinks");
  var nav = document.getElementById("siteNav");

  burger.addEventListener("click", function () {
    var isOpen = links.classList.toggle("open");
    burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      links.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    });
  });

  // Handle navbar appearing on scroll
  if (nav) {
    var isHidden = true;
    function checkNavScroll() {
      if (window.scrollY > 100) {
        if (isHidden) {
          nav.classList.add("scrolled");
          isHidden = false;
        }
      } else {
        if (!isHidden) {
          nav.classList.remove("scrolled");
          isHidden = true;
          /* navbar menghilang di puncak halaman: tutup juga menu HP yang masih terbuka */
          links.classList.remove("open");
          burger.setAttribute("aria-expanded", "false");
        }
      }
    }
    window.addEventListener("scroll", checkNavScroll, { passive: true });
    checkNavScroll(); // init
  }
})();

/* Scroll reveal */
(function () {
  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var items = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) {
      el.classList.add("in-view");
    });
    return;
  }
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
  );
  items.forEach(function (el) {
    io.observe(el);
  });
})();

/* Animated counters */
(function () {
  var nums = document.querySelectorAll(".stat-num[data-count]");
  if (!nums.length || !("IntersectionObserver" in window)) return;
  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function animate(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var valueEl = el.querySelector(".value");
    if (reduce) {
      valueEl.textContent = target;
      return;
    }
    var start = 0,
      duration = 1200,
      startTime = null;
    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      valueEl.textContent = Math.round(start + (target - start) * eased);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 },
  );
  nums.forEach(function (el) {
    io.observe(el);
  });
})();

/* Active nav link on scroll */
(function () {
  var sections = Array.prototype.slice.call(
    document.querySelectorAll("main section[id], section[id], header[id]"),
  );
  var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  if (
    !sections.length ||
    !navAnchors.length ||
    !("IntersectionObserver" in window)
  )
    return;
  var map = {};
  navAnchors.forEach(function (a) {
    map[a.getAttribute("href")] = a;
  });
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        var link = map["#" + entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          navAnchors.forEach(function (a) {
            a.classList.remove("active");
          });
          link.classList.add("active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
  );
  sections.forEach(function (s) {
    io.observe(s);
  });
})();

/* FAQ accordion */
(function () {
  var entries = Array.prototype.map.call(
    document.querySelectorAll(".faq-item"),
    function (item) {
      var q = item.querySelector(".faq-q");
      var a = item.querySelector(".faq-a");
      function setState(open) {
        if (open) {
          a.style.maxHeight = a.scrollHeight + "px";
          item.classList.add("open");
        } else {
          a.style.maxHeight = 0;
          item.classList.remove("open");
        }
        q.setAttribute("aria-expanded", open ? "true" : "false");
      }
      return { item: item, q: q, a: a, setState: setState };
    },
  );
  entries.forEach(function (entry) {
    entry.setState(entry.item.classList.contains("open"));
    entry.q.addEventListener("click", function () {
      var willOpen = !entry.item.classList.contains("open");
      entries.forEach(function (e) {
        e.setState(false);
      });
      entry.setState(willOpen);
    });
  });
  window.addEventListener("resize", function () {
    entries.forEach(function (entry) {
      if (entry.item.classList.contains("open")) {
        entry.a.style.maxHeight = entry.a.scrollHeight + "px";
      }
    });
  });
})();

/* Back to top button */
(function () {
  var btn = document.getElementById("toTopBtn");
  if (!btn) return;
  window.addEventListener(
    "scroll",
    function () {
      if (window.scrollY > 500) btn.classList.add("show");
      else btn.classList.remove("show");
    },
    { passive: true },
  );
  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();


/* Salju Natal (hanya jika tema Natal aktif) */
(function () {
  if (!document.documentElement.classList.contains("natal")) return;
  var box = document.getElementById("snow");
  if (!box) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var count = window.innerWidth < 700 ? 18 : 34;
  var glyphs = ["❄", "❅", "❆"];
  for (var i = 0; i < count; i++) {
    var f = document.createElement("i");
    f.textContent = glyphs[i % glyphs.length];
    f.style.left = Math.random() * 100 + "%";
    f.style.fontSize = 10 + Math.random() * 14 + "px";
    f.style.animationDuration = 9 + Math.random() * 11 + "s";
    f.style.animationDelay = -Math.random() * 20 + "s";
    f.style.opacity = 0.45 + Math.random() * 0.45;
    f.style.setProperty("--drift", Math.round(Math.random() * 80 - 40) + "px");
    box.appendChild(f);
  }
})();


/* Salju khusus hero */
(function () {
  var box = document.getElementById("heroSnow");
  if (!box) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var count = window.innerWidth < 700 ? 16 : 30, g = ["❄", "❅", "❆"];
  for (var i = 0; i < count; i++) {
    var f = document.createElement("i");
    f.textContent = g[i % 3];
    f.style.left = Math.random() * 100 + "%";
    f.style.fontSize = 10 + Math.random() * 14 + "px";
    f.style.animationDuration = 8 + Math.random() * 9 + "s";
    f.style.animationDelay = -Math.random() * 16 + "s";
    f.style.opacity = 0.45 + Math.random() * 0.45;
    f.style.setProperty("--drift", Math.round(Math.random() * 80 - 40) + "px");
    box.appendChild(f);
  }
})();


/* Tombol tata acara: nonaktif jika PDF belum diunggah */
(function () {
  var btn = document.getElementById("tataAcaraBtn");
  if (!btn || !window.fetch) return;
  fetch(btn.getAttribute("href"), { method: "HEAD" }).then(function (r) {
    if (!r.ok) { btn.classList.add("is-disabled"); btn.removeAttribute("download"); btn.innerHTML = '<span>Tata Acara Ibadah Natal</span><span class="soon">Segera hadir</span>'; btn.setAttribute("aria-disabled", "true"); }
  }).catch(function () { /* mis. dibuka lewat file:// — biarkan tombol aktif */ });
})();

/* Lampu hias di hero */
(function () {
  var box = document.getElementById("heroLights");
  if (!box) return;
  var n = Math.max(8, Math.round(window.innerWidth / 56));
  for (var i = 0; i < n; i++) {
    var b = document.createElement("i");
    b.className = "c" + (i % 4);
    b.style.animationDelay = (i % 4) * 0.4 + "s";
    box.appendChild(b);
  }
})();

/* Galeri: 3 foto awal per kategori, tombol untuk menampilkan sisanya bertahap, lightbox,
   dan (untuk kategori ber-data-cloud) daftar foto otomatis dari Cloudinary berdasarkan tag. */
(function () {
  var INITIAL = 3, STEP = 9;
  var groups = Array.prototype.slice.call(document.querySelectorAll(".gal-group"));
  if (!groups.length) return;

  /* ---------- Lightbox ---------- */
  var lb = document.createElement("div");
  lb.className = "lb";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-label", "Pratinjau foto");
  lb.innerHTML = '<button class="lb-x" aria-label="Tutup">\u00d7</button><button class="lb-p" aria-label="Foto sebelumnya">\u2039</button><img alt=""><span class="lb-status" role="status">Memuat foto resolusi penuh</span><button class="lb-n" aria-label="Foto berikutnya">\u203a</button>';
  document.body.appendChild(lb);
  var big = lb.querySelector("img"), list = [], idx = 0, token = 0;
  function show(i) {
    idx = (i + list.length) % list.length;
    var cur = list[idx], full = cur.getAttribute("data-full"), mine = ++token;
    resetZoom();
    big.alt = cur.alt;
    big.src = cur.currentSrc || cur.src; /* thumbnail dulu, langsung tampil */
    if (!full) { lb.classList.remove("loading"); return; }
    lb.classList.add("loading");
    var pre = new Image();
    pre.onload = function () {
      if (mine !== token) return; /* sudah pindah foto */
      big.src = full;
      lb.classList.remove("loading");
    };
    pre.onerror = function () { if (mine === token) lb.classList.remove("loading"); };
    pre.src = full;
  }
  function close() { token++; resetZoom(); lb.classList.remove("open", "loading"); }
  lb.querySelector(".lb-x").addEventListener("click", close);
  lb.querySelector(".lb-p").addEventListener("click", function (e) { e.stopPropagation(); show(idx - 1); });
  lb.querySelector(".lb-n").addEventListener("click", function (e) { e.stopPropagation(); show(idx + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });

  /* ---------- Zoom: roda mouse / cubit dua jari / ketuk dua kali / tombol, geser untuk menggeser foto ---------- */
  var MAXZ = 5, zs = 1, tx = 0, ty = 0, pts = {}, nPts = 0, prevD = 0, prevMx = 0, prevMy = 0;
  var tapT = 0, tapX = 0, tapY = 0, down = null;
  var zctl = document.createElement("div");
  zctl.className = "lb-z";
  zctl.innerHTML = '<button type="button" class="lb-zo" aria-label="Perkecil">\u2212</button><button type="button" class="lb-zr" aria-label="Kembalikan ukuran">100%</button><button type="button" class="lb-zi" aria-label="Perbesar">+</button>';
  lb.appendChild(zctl);
  var bZo = zctl.querySelector(".lb-zo"), bZr = zctl.querySelector(".lb-zr"), bZi = zctl.querySelector(".lb-zi");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function applyZoom() {
    var maxX = Math.max(0, (big.offsetWidth * zs - lb.clientWidth) / 2);
    var maxY = Math.max(0, (big.offsetHeight * zs - lb.clientHeight) / 2);
    tx = Math.max(-maxX, Math.min(maxX, tx));
    ty = Math.max(-maxY, Math.min(maxY, ty));
    big.style.transform = zs === 1 ? "" : "translate(" + tx + "px," + ty + "px) scale(" + zs + ")";
    lb.classList.toggle("zoomed", zs > 1.001);
    bZr.textContent = Math.round(zs * 100) + "%";
    bZo.disabled = zs <= 1.001;
    bZi.disabled = zs >= MAXZ - 0.001;
  }
  function resetZoom() { zs = 1; tx = ty = 0; pts = {}; nPts = 0; down = null; lb.classList.remove("panning"); applyZoom(); }
  function anim() {
    if (reduce) return;
    lb.classList.add("anim");
    clearTimeout(anim.t);
    anim.t = setTimeout(function () { lb.classList.remove("anim"); }, 220);
  }
  /* cx, cy: titik fokus relatif terhadap pusat layar */
  function zoomAt(ns, cx, cy) {
    ns = Math.max(1, Math.min(MAXZ, ns));
    if (ns === zs) return;
    if (ns <= 1.001) { zs = 1; tx = ty = 0; }
    else { tx = cx - (cx - tx) * ns / zs; ty = cy - (cy - ty) * ns / zs; zs = ns; }
    applyZoom();
  }
  function rel(x, y) {
    var r = lb.getBoundingClientRect();
    return { x: x - (r.left + r.width / 2), y: y - (r.top + r.height / 2) };
  }
  bZi.addEventListener("click", function () { anim(); zoomAt(zs * 1.6, 0, 0); });
  bZo.addEventListener("click", function () { anim(); zoomAt(zs / 1.6, 0, 0); });
  bZr.addEventListener("click", function () { anim(); zoomAt(1, 0, 0); });

  lb.addEventListener("wheel", function (e) {
    e.preventDefault();
    var c = rel(e.clientX, e.clientY);
    zoomAt(zs * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018)), c.x, c.y);
  }, { passive: false });

  function dist() {
    var k = Object.keys(pts), a = pts[k[0]], b = pts[k[1]];
    return { d: Math.hypot(a.x - b.x, a.y - b.y), x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  }
  big.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    try { big.setPointerCapture(e.pointerId); } catch (err) {}
    pts[e.pointerId] = { x: e.clientX, y: e.clientY };
    nPts = Object.keys(pts).length;
    if (nPts === 1) down = { x: e.clientX, y: e.clientY, t: Date.now(), moved: false };
    else { down = null; var p = dist(); prevD = p.d; prevMx = p.x; prevMy = p.y; }
    if (zs > 1.001) lb.classList.add("panning");
  });
  big.addEventListener("pointermove", function (e) {
    var p0 = pts[e.pointerId];
    if (!p0) return;
    var dx = e.clientX - p0.x, dy = e.clientY - p0.y;
    p0.x = e.clientX; p0.y = e.clientY;
    if (nPts >= 2) {
      var p = dist(), c = rel(p.x, p.y);
      if (prevD > 0) zoomAt(zs * p.d / prevD, c.x, c.y);
      tx += p.x - prevMx; ty += p.y - prevMy;
      prevD = p.d; prevMx = p.x; prevMy = p.y;
      applyZoom();
    } else if (nPts === 1) {
      if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8) down.moved = true;
      if (zs > 1.001) { tx += dx; ty += dy; applyZoom(); }
    }
  });
  function endPointer(e) {
    if (!pts[e.pointerId]) return;
    delete pts[e.pointerId];
    nPts = Object.keys(pts).length;
    lb.classList.remove("panning");
    if (nPts === 1) { var p = pts[Object.keys(pts)[0]]; down = null; if (zs > 1.001) lb.classList.add("panning"); return; }
    if (nPts > 0 || !down || e.type === "pointercancel") { down = null; return; }
    var d = down, ddx = e.clientX - d.x, ddy = e.clientY - d.y, now = Date.now();
    down = null;
    if (d.moved) { /* geser ke samping pada ukuran normal = ganti foto */
      if (zs <= 1.001 && Math.abs(ddx) > 60 && Math.abs(ddx) > 1.5 * Math.abs(ddy)) show(idx + (ddx < 0 ? 1 : -1));
      return;
    }
    if (now - d.t > 350) return;
    if (now - tapT < 320 && Math.hypot(e.clientX - tapX, e.clientY - tapY) < 30) { /* ketuk dua kali */
      tapT = 0;
      var c = rel(e.clientX, e.clientY);
      anim();
      if (zs > 1.001) zoomAt(1, 0, 0); else zoomAt(2.5, c.x, c.y);
    } else { tapT = now; tapX = e.clientX; tapY = e.clientY; }
  }
  big.addEventListener("pointerup", endPointer);
  big.addEventListener("pointercancel", endPointer);
  big.addEventListener("dragstart", function (e) { e.preventDefault(); });
  window.addEventListener("resize", function () { if (lb.classList.contains("open")) applyZoom(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open") || e.ctrlKey || e.metaKey) return;
    if (e.key === "+" || e.key === "=") { anim(); zoomAt(zs * 1.4, 0, 0); }
    else if (e.key === "-" || e.key === "_") { anim(); zoomAt(zs / 1.4, 0, 0); }
    else if (e.key === "0") { anim(); zoomAt(1, 0, 0); }
  });

  /* ---------- Satu kategori ---------- */
  function setup(group) {
    var grid = group.querySelector(".gal-grid");
    var old = group.querySelector(".gal-actions");
    if (old) old.remove();
    var figs = Array.prototype.slice.call(grid.querySelectorAll("figure"));
    var count = group.querySelector(".gal-count");
    if (count) count.textContent = figs.length ? figs.length + " foto" : "";
    grid.id = group.id + "-grid";
    var shown = Math.min(INITIAL, figs.length);
    if (figs.length <= INITIAL) { figs.forEach(function (f) { f.hidden = false; }); return; }

    var actions = document.createElement("div");
    actions.className = "gal-actions";
    var more = document.createElement("button");
    more.type = "button";
    more.className = "btn btn-ghost";
    more.setAttribute("aria-controls", grid.id);
    var less = document.createElement("button");
    less.type = "button";
    less.className = "btn btn-ghost";
    less.setAttribute("aria-controls", grid.id);
    less.textContent = "Tampilkan lebih sedikit";
    actions.appendChild(more);
    actions.appendChild(less);
    grid.parentNode.insertBefore(actions, grid.nextSibling);

    function render(prev) {
      figs.forEach(function (f, i) {
        f.hidden = i >= shown;
        f.classList.toggle("is-new", i >= prev && i < shown && shown > INITIAL);
      });
      grid.classList.toggle("is-collapsed", shown === INITIAL);
      var left = figs.length - shown;
      more.hidden = left <= 0;
      less.hidden = shown <= INITIAL;
      var n = Math.min(STEP, left);
      more.textContent = "Lihat " + n + " foto lainnya" + (left > STEP ? " (sisa " + left + ")" : "");
    }
    more.addEventListener("click", function () {
      var prev = shown;
      shown = Math.min(figs.length, shown + STEP);
      render(prev);
    });
    less.addEventListener("click", function () {
      shown = INITIAL;
      render(0);
      var head = group.querySelector(".gal-group-head");
      if (head.getBoundingClientRect().top < 0) head.scrollIntoView({ block: "start" });
    });
    render(0);
  }

  groups.forEach(function (group) {
    var grid = group.querySelector(".gal-grid");
    grid.addEventListener("click", function (e) {
      var fig = e.target.closest("figure");
      if (!fig || !grid.contains(fig)) return;
      list = Array.prototype.slice.call(grid.querySelectorAll("figure:not([hidden]) img"));
      show(list.indexOf(fig.querySelector("img")));
      lb.classList.add("open");
    });
    setup(group);
  });

  /* ---------- Cloudinary: daftar foto berdasarkan tag ---------- */
  function enc(id) { return id.split("/").map(encodeURIComponent).join("/"); }
  function empty(group) {
    var grid = group.querySelector(".gal-grid");
    if (grid.querySelector("figure")) return;
    grid.innerHTML = '<p class="gal-empty">Foto belum dapat ditampilkan saat ini. Coba muat ulang halaman nanti.</p>';
  }
  groups.forEach(function (group) {
    var cloud = group.getAttribute("data-cloud"), tag = group.getAttribute("data-tag");
    if (!cloud || !tag) return;
    var base = "https://res.cloudinary.com/" + cloud + "/image/upload/";
    fetch("https://res.cloudinary.com/" + cloud + "/image/list/" + encodeURIComponent(tag) + ".json")
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) {
        var items = (data.resources || []).slice().sort(function (a, b) {
          return a.public_id.localeCompare(b.public_id, undefined, { numeric: true });
        });
        if (!items.length) { empty(group); return; }
        var grid = group.querySelector(".gal-grid");
        var label = (group.querySelector("h3") || {}).textContent || "Galeri";
        grid.innerHTML = "";
        items.forEach(function (it, n) {
          var v = it.version ? "v" + it.version + "/" : "", path = v + enc(it.public_id);
          var fig = document.createElement("figure");
          var im = document.createElement("img");
          im.src = base + "c_limit,w_900,f_auto,q_auto/" + path;
          im.setAttribute("data-full", base + "c_limit,w_2400,f_auto,q_auto/" + path);
          im.loading = "lazy";
          im.alt = "Foto " + label + " " + (n + 1);
          fig.appendChild(im);
          grid.appendChild(fig);
        });
        setup(group);
      })
      .catch(function () { empty(group); });
  });
})();

/* Logo hero: hanya logonya yang berputar 3D (bingkai tetap). Seret untuk memutar (ada inersia lalu menempel ke sisi depan/belakang),
   ketuk untuk putar penuh, panah kiri/kanan membalik, Enter/Spasi memutar penuh. */
(function () {
  var coin = document.getElementById("logoCoin");
  if (!coin) return;
  var spin = document.getElementById("logoSpin");
  var hint = document.getElementById("coinHint");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ry = reduce ? 0 : -360, rx = 0, vy = 0, vx = 0, targetY = 0;
  var K = 0.00002, C = 0.0075; /* kekakuan & redaman pegas (per ms) */
  var dragging = false, moved = 0, startX = 0, lastX = 0, lastY = 0, lastT = 0, raf = 0, prevT = 0;

  function paint() {
    spin.style.transform = "rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
  }
  function frame(t) {
    var dt = Math.min(32, t - (prevT || t)); prevT = t;
    if (!dragging) {
      vy += (K * (targetY - ry) - C * vy) * dt; ry += vy * dt;
      vx += (K * (0 - rx) - C * vx) * dt; rx += vx * dt;
    }
    paint();
    var still = !dragging && Math.abs(vy) < 0.002 && Math.abs(vx) < 0.002 && Math.abs(targetY - ry) < 0.05 && Math.abs(rx) < 0.05;
    if (still) { ry = targetY; rx = 0; paint(); raf = 0; prevT = 0; return; }
    raf = requestAnimationFrame(frame);
  }
  function run() { if (!raf) raf = requestAnimationFrame(frame); }
  function settle(to) {
    targetY = to;
    if (reduce) { ry = to; rx = 0; vy = vx = 0; paint(); return; }
    run();
  }
  function used() { if (hint) hint.classList.add("is-gone"); }
  function nearest(deg) { return Math.round(deg / 180) * 180; }

  coin.addEventListener("pointerdown", function (e) {
    dragging = true; moved = 0; startX = lastX = e.clientX; lastY = e.clientY; lastT = e.timeStamp; vy = vx = 0;
    coin.classList.add("is-dragging");
    try { coin.setPointerCapture(e.pointerId); } catch (err) {}
    run();
  });
  coin.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var dx = e.clientX - lastX, dy = e.clientY - lastY, dt = Math.max(1, e.timeStamp - lastT);
    moved += Math.abs(dx) + Math.abs(dy);
    ry += dx * 0.55;
    rx = Math.max(-28, Math.min(28, rx - dy * 0.25));
    vy = (dx * 0.55) / dt; /* kecepatan terakhir (deg/ms) untuk inersia */
    lastX = e.clientX; lastY = e.clientY; lastT = e.timeStamp;
    if (moved > 4) used();
  });
  function release() {
    if (!dragging) return;
    dragging = false; coin.classList.remove("is-dragging");
    if (moved < 6) { /* ketukan: putar penuh */
      used(); vy = 0; settle(Math.round(ry / 360) * 360 + 360);
    } else {
      vy = Math.max(-1.6, Math.min(1.6, vy));
      settle(nearest(ry + vy * 220));
    }
  }
  coin.addEventListener("pointerup", release);
  coin.addEventListener("pointercancel", release);
  coin.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); used(); settle(nearest(ry) - 180); }
    else if (e.key === "ArrowRight") { e.preventDefault(); used(); settle(nearest(ry) + 180); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); used(); settle(Math.round(ry / 360) * 360 + 360); }
  });

  paint();
  if (!reduce) { targetY = 0; run(); } /* animasi masuk: berputar sekali dari belakang ke depan */
})();
