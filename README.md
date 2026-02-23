# yangran.org — v2

**Personal website of Dr. Ran Yang, Teaching Professor of Physics, William & Mary.**

> *"Where the instrument meets the infinite."*

---

## Design Concept: Ink on Still Water

Version 1 was a physics lab at night. Version 2 is a philosopher's study at dawn.

The design principle is **Wu Wei** (無為) — effortless action, the Taoist concept at the center of Dr. Yang's Untitled Time work. The void is not empty. It is the most powerful thing. The website embodies this: radical negative space, one barely-there waveform that breathes rather than oscillates, and a single accent color — celadon green, drawn from Song dynasty porcelain — used with extreme restraint.

**The one unforgettable thing:** You scroll to the bottom, and the Chinese characters 無為 emerge from the dark, barely visible, fading in over two seconds. They don't announce themselves. They were always there.

---

## File Structure

```
yangran.org/
├── index.html      — Main single-page site
├── teaching.html   — Four-year engineering pipeline + course sub-nav
├── style.css       — Shared stylesheet (both pages)
├── main.js         — Shared JS (ripple canvas, scroll reveals, nav)
└── README.md       — This file
```

No build tools. No npm. No framework. Zero dependencies. Ships as-is.

---

## Design Tokens

### Colors

| Token             | Value                        | Role                                       |
|-------------------|------------------------------|--------------------------------------------|
| `--ground`        | `#F4F2EE`                    | Base surface — sun-bleached bone           |
| `--ground-lift`   | `#ECEAE6`                    | Slightly lifted surfaces                   |
| `--ground-deep`   | `#E4E1DC`                    | Deepest surface — course sub-nav bg        |
| `--ink`           | `#1A1D21`                    | Cool charcoal — primary text               |
| `--ink-mid`       | `#3A3D42`                    | Secondary body text                        |
| `--ink-soft`      | `rgba(26,29,33,0.45)`        | Labels, captions                           |
| `--ink-ghost`     | `rgba(26,29,33,0.18)`        | Timestamps, decorative arrows              |
| `--celadon`       | `#5E8A78`                    | **The one accent.** Song dynasty porcelain |
| `--celadon-dim`   | `rgba(94,138,120,0.15)`      | Borders, hover backgrounds                 |
| `--celadon-wash`  | `rgba(94,138,120,0.06)`      | Active state fill on sub-nav               |
| `--slate`         | `#8C9196`                    | Technical labels, spec tags                |

### Typography

| Role    | Font              | Weight   | Usage                          |
|---------|-------------------|----------|--------------------------------|
| Display | `Cormorant Infant`| 300 / it | Hero name, section headings    |
| Body    | `EB Garamond`     | 400 / it | All prose                      |
| Mono    | `IBM Plex Mono`   | 300–400  | Labels, codes, status, nav     |

---

## Page Architecture

### `index.html`

| Section        | Purpose                                                            |
|----------------|--------------------------------------------------------------------|
| **Nav**        | `RY` mark · iRays · The Vessel · Teaching pillars + Contact ghost |
| **Hero**       | Name, one italic subtitle, ripple canvas on click/mousemove        |
| **Breath**     | Three-line opening poem — sets the philosophical register          |
| **Tier 1**     | iRays (left, celadon tint) ↔ The Vessel (right) side by side      |
| **Impact**     | 6 aggregate statistics — wide type, no footnotes                   |
| **Tier 2**     | MCP + Waveform.ai — equal weight, horizontal split                 |
| **Teaching**   | Brief intro + course list + link to teaching.html                  |
| **Tier 3**     | Everything else — compact list, one line each                      |
| **Contact**    | Email only · Wu Wei characters emerging in the dark                |

### `teaching.html`

Two-tier navigation: primary nav (site-wide) + **sticky course sub-nav** (page-specific).

#### Navigation Design

The page uses a two-level sticky nav system so visitors reach any course in one click, without scrolling:

1. **Primary nav** (`.nav`, z-index 100) — site-wide, links back to index sections.
2. **Course sub-nav** (`.course-nav`, z-index 98) — teaching-page-specific, always visible at the top of the viewport. Shows all four courses as jump-links the moment you land on the page.

```
┌──────────────────────────────────────────────────────┐  ← z-100 .nav
│   iRays    The Vessel    Teaching                     │
├──────────────────────────────────────────────────────┤  ← z-98 .course-nav
│  PHYS 252 → PHYS 351 → PHYS 471/472 → EPAD 495/496  │
└──────────────────────────────────────────────────────┘
```

The sub-nav uses `IntersectionObserver` scroll-spy to highlight whichever course is currently in the viewport. Each pipeline stage card has a `scroll-margin-top: 110px` so neither sticky bar clips the heading on jump.

#### Content

Each pipeline stage links to a dedicated subpage and shows:
- Year level (`Sophomore` / `Junior` / `Senior`)
- Course code + name
- One-paragraph description

---

## The Ripple Canvas

`main.js` → `initRipples()`

Celadon concentric rings spawn from random positions on a slow timer (every 2.5–5 s). Clicking or moving the mouse anywhere on the hero spawns additional ripples at the cursor position. Each ripple expands and fades with a quadratic ease; a faint inner echo ring adds depth. The physics is there if you look; the poetry is there if you feel.

---

## Navigation Reference

### Primary nav (`.nav`)

Lives in both `index.html` and `teaching.html`. Links: iRays, The Vessel, Teaching. Scrolls-down indicator via `nav--scrolled` class added at 70% viewport depth.

### Course sub-nav (`.course-nav`) — `teaching.html` only

- **Position:** `sticky; top: 0; z-index: 98` — pins just below the primary nav.
- **Items:** One per course; each has a `.cn-code` (mono, celadon) and `.cn-label` (mono, muted).
- **Flow arrows** (`→`) between items via `::after` — decorative, hidden on mobile.
- **Active state:** celadon underline + celadon-wash background fill, toggled by scroll-spy.
- **Smooth scroll:** `click` handler offsets by `120px` to clear both sticky bars.

To add a new course item:
```html
<a href="#new-course-id" class="cn-item" data-course="new-course-id">
  <span class="cn-code">PHYS XXX</span>
  <span class="cn-label">Course Name</span>
</a>
```
Then add `id="new-course-id"` to the corresponding `.pipeline-stage` and include the id in the scroll-spy array in the inline `<script>`.

---

## Deployment

**Static site — no build step required.** Deploy all four files to any host.

### GitHub Pages

```bash
git init && git add .
git commit -m "launch yangran.org"
git remote add origin https://github.com/yourusername/yangran.org.git
git push -u origin main
# Then: Settings → Pages → Branch: main / root
# Add CNAME pointing yangran.org to yourusername.github.io
```

### Netlify (fastest)

Drag the folder to [app.netlify.com](https://app.netlify.com) → set custom domain → done.

### DNS Records (at your registrar)

```
A     @    185.199.108.153    (GitHub Pages)
A     @    185.199.109.153
A     @    185.199.110.153
A     @    185.199.111.153
CNAME www  yourusername.github.io
```

Adjust CNAME target for Netlify/Vercel accordingly. Enable HTTPS in dashboard.

---

## Updating Content

### Adding a grant or talk to Tier 3 (index.html)

```html
<li class="tier3-item">
  <span class="t3y mono-sm">2026</span>
  <span class="t3n">Title of Grant or Talk</span>
  <span class="t3d">One sentence. Funder or venue. Role.</span>
</li>
```

### Changing the impact numbers

In `index.html`, search for `inum`. Six stats, each has a number and label. Edit directly.

### Adding a course stage to the pipeline (teaching.html)

1. Add a new `.cn-item` to `.course-nav` with a unique `data-course` and `href`.
2. Add the matching `id` to the `.pipeline-stage` element.
3. Add the id string to the `stageIds` array in the inline `<script>` at the bottom of `teaching.html`.

### Adding a photo

```html
<img src="assets/ran.jpg" alt="Dr. Ran Yang"
     style="max-width:240px; filter:grayscale(0.2) contrast(1.05); border:1px solid var(--rule-mid);" />
```

---

## Performance

- No JS frameworks — vanilla JS ~3KB
- No CSS frameworks — pure CSS ~9KB
- Google Fonts: 2 families, preconnect hints
- Canvas: `requestAnimationFrame` with `clearRect` — no leak
- Scroll reveals: `IntersectionObserver` — no polling
- Course sub-nav scroll-spy: `IntersectionObserver` — no polling
- All animations on `opacity` + `transform` — GPU-composited

Expected Lighthouse: Performance 95+, Best Practices 100.

---

## Browser Support

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+.

---

*"Can you plant a seed for a shadow you will never see?"*  
*— Untitled Time, Ran Yang, 2026*
