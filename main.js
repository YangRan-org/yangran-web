/* ═══════════════════════════════════════════════════════════════
   YANGRAN.ORG — main.js
   Waveform canvas · Scroll reveals · Custom cursor · Nav scroll
   ═══════════════════════════════════════════════════════════════ */

'use strict';

// ── CUSTOM CURSOR ────────────────────────────────────────────
document.addEventListener('mousemove', (e) => {
  document.documentElement.style.setProperty('--cx', e.clientX + 'px');
  document.documentElement.style.setProperty('--cy', e.clientY + 'px');
});

// ── WAVEFORM CANVAS ──────────────────────────────────────────
(function initWaveform() {
  const canvas = document.getElementById('waveCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, animId;
  let t = 0;
  let mouseX = 0.5; // normalized [0,1]

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth;
  });

  // Color constants
  const TEAL  = '#00d4dc';
  const AMBER = '#f5a623';

  function drawWave(opts) {
    const { amp, freq, speed, phase, color, alpha, lineWidth } = opts;
    ctx.beginPath();
    ctx.lineWidth = lineWidth || 1;
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;

    for (let x = 0; x <= W; x += 2) {
      const xNorm = x / W;
      const y = H * 0.5 +
        Math.sin(xNorm * freq * Math.PI * 2 + t * speed + phase) * amp +
        Math.sin(xNorm * freq * 0.7 * Math.PI * 2 + t * speed * 1.3 + phase * 0.7) * amp * 0.3;

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function drawScanLine() {
    // Oscilloscope horizontal scan line
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, H * 0.5);
    ctx.lineTo(W, H * 0.5);
    ctx.strokeStyle = 'rgba(0,212,220,0.06)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 12]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  function drawGrid() {
    ctx.save();
    ctx.strokeStyle = 'rgba(0,212,220,0.03)';
    ctx.lineWidth = 1;
    const cols = 12, rows = 8;
    for (let i = 0; i <= cols; i++) {
      const x = (i / cols) * W;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let j = 0; j <= rows; j++) {
      const y = (j / rows) * H;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    ctx.restore();
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);

    drawGrid();
    drawScanLine();

    // Science waves — teal
    drawWave({ amp: H * 0.12, freq: 3,  speed: 0.6,  phase: 0,    color: TEAL,  alpha: 0.6, lineWidth: 1.5 });
    drawWave({ amp: H * 0.07, freq: 5,  speed: 0.9,  phase: 1.2,  color: TEAL,  alpha: 0.3, lineWidth: 1 });
    drawWave({ amp: H * 0.04, freq: 8,  speed: 1.4,  phase: 2.4,  color: TEAL,  alpha: 0.15, lineWidth: 0.75 });

    // Humanity waves — amber, slower, wider
    drawWave({ amp: H * 0.16, freq: 1.5, speed: 0.25, phase: 0.8,  color: AMBER, alpha: 0.25, lineWidth: 1.5 });
    drawWave({ amp: H * 0.09, freq: 2.5, speed: 0.18, phase: Math.PI, color: AMBER, alpha: 0.12, lineWidth: 1 });

    // Mouse-reactive ripple
    const mx = mouseX * W;
    const gradient = ctx.createRadialGradient(mx, H * 0.5, 0, mx, H * 0.5, 120);
    gradient.addColorStop(0, 'rgba(0,212,220,0.08)');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, W, H);

    t += 0.012;
    animId = requestAnimationFrame(frame);
  }

  frame();
})();

// ── SCROLL REVEAL ────────────────────────────────────────────
(function initReveal() {
  const targets = document.querySelectorAll(
    '.reveal-up, .reveal-left, .project-card, .course-card, .edu-card, .timeline-item'
  );

  // Add reveal-up to non-explicitly-tagged elements
  targets.forEach(el => {
    if (!el.classList.contains('reveal-up') && !el.classList.contains('reveal-left')) {
      el.classList.add('reveal-up');
    }
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-left').forEach(el => io.observe(el));
})();

// ── NAV SCROLL BEHAVIOR ──────────────────────────────────────
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 80) {
      nav.style.background = 'rgba(6,8,16,0.92)';
    } else {
      nav.style.background = 'rgba(6,8,16,0.7)';
    }
    lastScroll = currentScroll;
  }, { passive: true });
})();

// ── STAGGER CHILDREN ON REVEAL ───────────────────────────────
(function staggerSections() {
  const grids = document.querySelectorAll(
    '.projects-grid, .teaching-grid, .edu-grid, .duality-metrics, .hero-tags'
  );

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = Array.from(entry.target.children);
        children.forEach((child, i) => {
          child.style.transitionDelay = `${i * 0.08}s`;
          child.classList.add('visible');
        });
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  grids.forEach(g => io.observe(g));
})();

// ── SMOOTH ANCHOR SCROLL ─────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── PROJECT CARD HOVER GLOW ──────────────────────────────────
(function initCardGlow() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--gx', x + '%');
      card.style.setProperty('--gy', y + '%');
    });
  });
})();
