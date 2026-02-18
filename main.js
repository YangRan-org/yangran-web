/* ═══════════════════════════════════════════════════════════════
   YANGRAN.ORG — v3 main.js
   Ripples on still water. Not oscilloscope — Wu Wei.
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ── RIPPLE CANVAS ─────────────────────────────────────────────
// Concentric circles expanding from random points — like rain
// on a still pond. Barely visible. Almost not there.
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

  // Spawn a ripple at a random point
  function spawn(x, y) {
    ripples.push({
      x: x ?? Math.random() * W,
      y: y ?? Math.random() * H,
      r: 0,
      maxR: 80 + Math.random() * 120,
      alpha: 0.22 + Math.random() * 0.1,
      speed: 0.6 + Math.random() * 0.5,
      lineWidth: 0.5 + Math.random() * 0.5,
    });
  }

  // Auto-spawn ripples at a quiet, irregular pace
  let nextSpawn = 0;
  function scheduleSpawn() {
    // 1.8–4s between spontaneous ripples — unhurried
    nextSpawn = Date.now() + 1800 + Math.random() * 2200;
  }
  scheduleSpawn();

  // Mouse touch spawns a ripple exactly where cursor lands
  canvas.parentElement.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    spawn(e.clientX - rect.left, e.clientY - rect.top);
  });

  // Very rare, very soft mouse-move ripple (1-in-60 chance per move)
  canvas.parentElement.addEventListener('mousemove', (e) => {
    if (Math.random() < 0.015) {
      const rect = canvas.getBoundingClientRect();
      spawn(e.clientX - rect.left, e.clientY - rect.top);
    }
  }, { passive: true });

  function frame() {
    ctx.clearRect(0, 0, W, H);

    // Auto-spawn
    if (Date.now() > nextSpawn) {
      spawn();
      scheduleSpawn();
    }

    // Draw and age each ripple
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      rp.r += rp.speed;

      // Fade out as it expands
      const progress = rp.r / rp.maxR;
      const alpha = rp.alpha * (1 - progress);

      if (alpha <= 0 || rp.r >= rp.maxR) {
        ripples.splice(i, 1);
        continue;
      }

      // Draw the ring — ink color on light ground
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(107, 144, 128, ${alpha})`; // celadon
      ctx.lineWidth = rp.lineWidth;
      ctx.stroke();

      // Occasionally draw a second, slightly larger ghost ring
      // (like the secondary wave that follows a real water ripple)
      if (rp.r > 25) {
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r * 0.72, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(26, 20, 16, ${alpha * 0.3})`; // ink ghost
        ctx.lineWidth = rp.lineWidth * 0.5;
        ctx.stroke();
      }
    }

    requestAnimationFrame(frame);
  }

  frame();

  // Seed 2 initial ripples so the page isn't blank
  setTimeout(() => spawn(W * 0.38, H * 0.52), 400);
  setTimeout(() => spawn(W * 0.65, H * 0.35), 1100);
})();

// ── SCROLL REVEAL ─────────────────────────────────────────────
(function initReveal() {
  const targets = [
    '.opening-text',
    '.pf-left', '.pf-right',
    '.impact-item',
    '.t2-card',
    '.tier3-list li',
    '.contact-left', '.contact-right',
  ];

  targets.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      // Stagger siblings
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

// ── WU WEI CHARACTERS ─────────────────────────────────────────
(function wuReveal() {
  const wu = document.querySelector('.wu');
  if (!wu) return;
  const io = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      wu.classList.add('visible');
      io.disconnect();
    }
  }, { threshold: 0.5 });
  io.observe(wu);
})();

// ── NAV ACTIVE STATE ──────────────────────────────────────────
(function navActive() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  // Subtle background shift when scrolled past hero
  window.addEventListener('scroll', () => {
    const past = window.scrollY > window.innerHeight * 0.7;
    nav.style.borderBottomColor = past
      ? 'rgba(26,20,16,0.16)'
      : 'rgba(26,20,16,0.1)';
  }, { passive: true });

  // Active section highlight
  const sections = [
    { id: 'irays',   nav: 'nav-irays'  },
    { id: 'vessel',  nav: 'nav-vessel' },
  ];

  const sectionEls = sections.map(s => ({
    el: document.getElementById(s.id),
    navEl: document.getElementById(s.nav),
  })).filter(s => s.el && s.navEl);

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
