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
    if (!r.ok) { btn.classList.add("is-disabled"); btn.removeAttribute("download"); btn.innerHTML = '<span>📄 Tata Acara Ibadah Natal</span><span class="soon">Segera hadir</span>'; btn.setAttribute("aria-disabled", "true"); }
  }).catch(function () { /* mis. dibuka lewat file:// — biarkan tombol aktif */ });
})();
