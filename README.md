# yangran.org

**Personal website of Dr. Ran Yang, Teaching Professor of Physics, William & Mary.**

> *"The precision of a waveform. The patience of a planted seed."*

---

## Overview

This repository contains the complete source code for `yangran.org` — a static, single-page personal website built to reflect Dr. Yang's dual identity as a rigorous applied physicist and a deeply humanistic educator, artist, and interdisciplinary thinker.

**Design concept:** *Oscilloscope Meets Ink Wash.* The clinical precision of a physics lab instrument — grid lines, waveforms, monospace readouts — fused with the fluid patience of East Asian calligraphy. Dark field. Teal pulse. Amber soul.

---

## File Structure

```
yangran.org/
├── index.html    — Complete single-page site (semantic HTML5)
├── style.css     — Full stylesheet (CSS custom properties, responsive, no framework)
├── main.js       — Canvas waveform animation, scroll reveals, cursor, interactions
└── README.md     — This file
```

No build tools. No npm. No framework. **Zero dependencies.** Ships as-is.

---

## Design System

### Color Palette

| Token         | Hex / Value             | Meaning                        |
|---------------|-------------------------|--------------------------------|
| `--void`      | `#060810`               | Deep space — background        |
| `--deep`      | `#0b0f1a`               | Secondary surfaces             |
| `--teal`      | `#00d4dc`               | Science pulse — iRays, physics |
| `--amber`     | `#f5a623`               | Human soul — art, mentorship   |
| `--white`     | `#f0f0ee`               | Primary text                   |
| `--white-dim` | `rgba(240,240,238,0.55)`| Secondary text                 |

### Typography

| Role    | Font                   | Weights   | Usage                        |
|---------|------------------------|-----------|------------------------------|
| Display | `Cormorant` (serif)    | 300       | Hero name, section titles    |
| Body    | `Cormorant Garamond`   | 300–600   | All prose, quotes, body      |
| Mono    | `JetBrains Mono`       | 300–500   | Labels, codes, data, status  |

Loaded from Google Fonts. Two families, three optical roles.

### Motion

- **Hero waveform**: Canvas-based dual-channel oscilloscope animation (teal = science, amber = humanity). Mouse-reactive glow.
- **Scroll reveals**: `IntersectionObserver`-based stagger. Elements translate up 28px and fade in as they enter viewport.
- **Card enter**: Grid children stagger at 80ms intervals on section entry.
- **Vessel rings**: Three concentric `border-radius: 50%` rings with CSS `animation: spin` at different speeds/directions. No JS required.
- **Cursor**: Custom 8px teal dot via CSS `::after` + CSS custom properties `--cx`, `--cy` set by JS `mousemove`.

---

## Sections

| # | Section        | ID           | Purpose                                                    |
|---|---------------|-------------|-------------------------------------------------------------|
| — | Navigation    | `#nav`      | Fixed, blur-backdrop, collapses on mobile                   |
| — | Hero          | `#hero`     | Full-screen waveform canvas, name monument, duality tagline |
| — | Duality       | `#duality`  | Hard-core physics ↔ Soft soul. Metrics + philosophy quote   |
| 01| Research      | `#research` | 5 project cards: iRays, Waveform.ai, MCP, QD Bandage, Brite|
| 02| Teaching      | `#teaching` | Course cards + mentorship impact statistics                 |
| 03| Recognition   | `#honors`   | Vertical timeline: grants, talks, awards (2022–2025)        |
| 04| The Vessel    | `#vessel`   | Untitled Time proposal, deep time philosophy, collaborators |
| 05| Formation     | `#education`| Ph.D., B.E., professional certifications                   |
| — | Contact       | `#contact`  | Email, phone, W&M faculty profile, address                  |

---

## Deployment

This is a **static site**. No server-side logic required.

### Option A — GitHub Pages (Recommended)

```bash
# 1. Push to a repo named yangran.org or any repo
git init
git add .
git commit -m "initial launch"
git remote add origin https://github.com/yourusername/yangran.org.git
git push -u origin main

# 2. In GitHub repo Settings → Pages → Branch: main / root
# 3. Add custom domain: yangran.org
# 4. Add CNAME record at your DNS registrar pointing to yourusername.github.io
```

### Option B — Netlify (Drag-and-Drop)

1. Go to [netlify.com](https://netlify.com) → "Add new site" → "Deploy manually"
2. Drag the entire `yangran.org/` folder into the drop zone
3. Set custom domain to `yangran.org` in Site Settings → Domain management
4. Update DNS at your registrar: add a `CNAME` for `www` → `yoursite.netlify.app`

### Option C — Any Static Host (Vercel, Cloudflare Pages, etc.)

Just upload the three files. There is no build step.

---

## DNS Configuration

At your domain registrar (GoDaddy, Namecheap, Google Domains, etc.):

```
Type  Name   Value                    TTL
A     @      185.199.108.153          Auto   (GitHub Pages IPs)
A     @      185.199.109.153          Auto
A     @      185.199.110.153          Auto
A     @      185.199.111.153          Auto
CNAME www    yourusername.github.io   Auto
```

*(Adjust the CNAME target for Netlify/Vercel accordingly.)*

Enable **HTTPS / SSL** (free via Let's Encrypt) in your host's dashboard.

---

## Customization Guide

### Updating Projects

In `index.html`, find any `<article class="project-card">` block. Each card has:
- `data-type="science"` → teal accent, or `data-type="art"` / `"human"` → amber accent
- `class="project-featured"` → spans 2 columns (use for flagship projects like iRays)
- `.project-status` → shows active/complete dot + date range

### Adding a New Grant to the Timeline

```html
<div class="timeline-item reveal-left">
  <span class="tl-year mono">2026</span>
  <div class="tl-content">
    <div class="tl-title">Grant Name — Status</div>
    <div class="tl-sub mono">Funding body · Role</div>
  </div>
</div>
```

### Changing the Waveform Colors

In `main.js`, lines near the top of `initWaveform()`:

```js
const TEAL  = '#00d4dc'; // science channel — change to any hex
const AMBER = '#f5a623'; // humanity channel — change to any hex
```

### Adding a Photo

Insert before `.hero-content` or inside `.contact-section`:

```html
<img
  src="assets/ran-yang.jpg"
  alt="Dr. Ran Yang"
  class="profile-photo"
  width="300"
  height="300"
/>
```

Then in `style.css`:
```css
.profile-photo {
  border-radius: 1px;
  border: 1px solid var(--border);
  filter: grayscale(0.3) contrast(1.05);
  max-width: 280px;
}
```

---

## Accessibility

- Semantic HTML5 landmarks (`<nav>`, `<section>`, `<article>`, `<footer>`)
- All images require `alt` attributes when added
- Color contrast: teal (#00d4dc) on dark void (#060810) → **AA compliant**
- Amber (#f5a623) on dark void → **AA compliant**
- Keyboard navigable via native anchor tags
- `prefers-reduced-motion`: Add to `style.css` to respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  .wave-canvas { display: none; }
}
```

---

## Performance Notes

- **No JavaScript frameworks** — vanilla JS only (~4KB)
- **No CSS frameworks** — pure CSS (~10KB)
- Google Fonts loaded with `preconnect` hints
- Canvas waveform uses `requestAnimationFrame` with `clearRect` — no memory leak
- `IntersectionObserver` used for scroll reveals — no scroll listeners polling
- All animations are CSS `transform` + `opacity` — GPU-composited, no layout thrash

Expected Lighthouse scores: Performance 95+, Accessibility 90+, Best Practices 100.

---

## Browser Support

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+. IE not supported.

---

## Credits & Acknowledgments

Built to honor the work of **Dr. Ran Yang**, Teaching Professor of Physics at William & Mary — physicist, inventor, educator, artist, and architect of deep time.

Projects referenced:
- **iRays** — dual-spectrum pupillometry (Patent Pending, NIH/AI4Health)
- **Waveform.ai** — [waveformai.wm.edu](https://waveformai.wm.edu)
- **MCP Program** — [mcp.physics.wm.edu](https://mcp.physics.wm.edu)
- **Untitled Time** — W&M Pathfinder Proposal, 2026

---

*"Can you plant a seed for a shadow you will never see?"*
