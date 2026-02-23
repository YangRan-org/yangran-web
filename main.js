/* ═══════════════════════════════════════════════════════════════
   YANGRAN.ORG — v4 main.js
   Morning Lab. Sediment, not popcorn.
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ── RIPPLE CANVAS (Hero) ──────────────────────────────────────
(function initRipples() {
  const canvas = document.getElementById('rippleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  const ripples = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  function spawn(x, y) {
    ripples.push({
      x: x ?? Math.random() * W,
      y: y ?? Math.random() * H,
      r: 0,
      maxR: 80 + Math.random() * 120,
      alpha: 0.20 + Math.random() * 0.08,
      speed: 0.5 + Math.random() * 0.4,
      lineWidth: 0.5 + Math.random() * 0.5,
    });
  }

  let nextSpawn = 0;
  function scheduleSpawn() {
    nextSpawn = Date.now() + 2500 + Math.random() * 2500;
  }
  scheduleSpawn();

  canvas.parentElement.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    spawn(e.clientX - rect.left, e.clientY - rect.top);
  });

  canvas.parentElement.addEventListener('mousemove', (e) => {
    if (Math.random() < 0.012) {
      const rect = canvas.getBoundingClientRect();
      spawn(e.clientX - rect.left, e.clientY - rect.top);
    }
  }, { passive: true });

  function frame() {
    ctx.clearRect(0, 0, W, H);

    if (Date.now() > nextSpawn) {
      spawn();
      scheduleSpawn();
    }

    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      rp.r += rp.speed;

      const progress = rp.r / rp.maxR;
      const alpha = rp.alpha * (1 - progress) * (1 - progress);

      if (alpha <= 0 || rp.r >= rp.maxR) {
        ripples.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(94, 138, 120, ${alpha})`;
      ctx.lineWidth = rp.lineWidth;
      ctx.stroke();

      if (rp.r > 25) {
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r * 0.72, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(26, 29, 33, ${alpha * 0.25})`;
        ctx.lineWidth = rp.lineWidth * 0.5;
        ctx.stroke();
      }
    }

    requestAnimationFrame(frame);
  }

  frame();
  setTimeout(() => spawn(W * 0.38, H * 0.52), 400);
  setTimeout(() => spawn(W * 0.65, H * 0.35), 1100);
})();


// ── DAO DE JING RIPPLE CANVAS ─────────────────────────────────
(function initDaoRipples() {
  const canvas = document.getElementById('daoCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const section = canvas.parentElement;

  let W, H;
  const ripples = [];

  const verses = Array.from(section.querySelectorAll('.dao-verse'));
  const seeds = verses.map(v => ({
    nx: parseFloat(v.dataset.rippleX || 0.5),
    ny: parseFloat(v.dataset.rippleY || 0.5),
  }));

  function resize() {
    W = canvas.width  = section.offsetWidth;
    H = canvas.height = section.offsetHeight;
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  function spawnAt(nx, ny, big) {
    ripples.push({
      x:     nx * W,
      y:     ny * H,
      r:     0,
      maxR:  big ? 160 + Math.random() * 100 : 80 + Math.random() * 80,
      alpha: big ? 0.16 : 0.11,
      speed: big ? 0.4  : 0.55,
      lw:    big ? 0.7  : 0.5,
    });
  }

  const intervals = seeds.map((seed, i) => {
    const base = 3500 + i * 1200;
    return {
      seed,
      next: Date.now() + base + Math.random() * 2000,
      delay: base + Math.random() * 2000,
    };
  });

  section.addEventListener('click', (e) => {
    const rect = section.getBoundingClientRect();
    spawnAt(
      (e.clientX - rect.left) / rect.width,
      (e.clientY - rect.top)  / rect.height,
      true
    );
  });

  verses.forEach((v, i) => {
    v.addEventListener('mouseenter', () => {
      spawnAt(seeds[i].nx, seeds[i].ny, true);
    });
  });

  function frame() {
    const now = Date.now();

    intervals.forEach(iv => {
      if (now > iv.next) {
        spawnAt(iv.seed.nx, iv.seed.ny);
        iv.next = now + iv.delay + Math.random() * 1500;
      }
    });

    ctx.clearRect(0, 0, W, H);

    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      rp.r += rp.speed;

      const progress = rp.r / rp.maxR;
      const alpha = rp.alpha * (1 - progress) * (1 - progress);

      if (alpha <= 0.005 || rp.r >= rp.maxR) {
        ripples.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(94, 138, 120, ${alpha})`;
      ctx.lineWidth   = rp.lw;
      ctx.stroke();

      if (rp.r > 20) {
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r * 0.65, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(26, 29, 33, ${alpha * 0.22})`;
        ctx.lineWidth   = rp.lw * 0.5;
        ctx.stroke();
      }

      if (rp.r > 50 && rp.maxR > 120) {
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r * 1.3, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(94, 138, 120, ${alpha * 0.12})`;
        ctx.lineWidth   = 0.4;
        ctx.stroke();
      }
    }

    requestAnimationFrame(frame);
  }

  frame();
  setTimeout(() => seeds.forEach((s, i) =>
    setTimeout(() => spawnAt(s.nx, s.ny, true), i * 700)
  ), 300);
})();


// ── SCROLL REVEAL ─────────────────────────────────────────────
(function initReveal() {
  // Index page elements
  const targets = [
    '.opening-text',
    '.pf-left', '.pf-right',
    '.impact-item',
    '.t2-card',
    '.tier3-list li',
    '.dao-verse',
    '.contact-title', '.contact-email', '.contact-profile',
  ];

  targets.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.06}s`;
    });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -24px 0px' });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();


// ── DATA-REVEAL (subpages) ────────────────────────────────────
(function initDataReveal() {
  const cards = document.querySelectorAll('[data-reveal]');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  cards.forEach(card => observer.observe(card));
})();


// ── NAV STATE ─────────────────────────────────────────────────
(function navState() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > window.innerHeight * 0.7) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }, { passive: true });

  // Active section highlight (index page)
  const sections = [
    { id: 'irays',  nav: 'nav-irays'  },
    { id: 'vessel', nav: 'nav-vessel' },
  ];

  const sectionEls = sections.map(s => ({
    el: document.getElementById(s.id),
    navEl: document.getElementById(s.nav),
  })).filter(s => s.el && s.navEl);

  if (sectionEls.length) {
    window.addEventListener('scroll', () => {
      const mid = window.scrollY + window.innerHeight * 0.4;
      sectionEls.forEach(({ el, navEl }) => {
        const top = el.offsetTop;
        const bot = top + el.offsetHeight;
        if (mid >= top && mid < bot) {
          navEl.classList.add('active');
        } else {
          navEl.classList.remove('active');
        }
      });
    }, { passive: true });
  }
})();


// ── SMOOTH ANCHORS ────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = id ? document.getElementById(id) : null;
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
