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
├── teaching.html   — PHYS 252 / PHYS 351 / EPAD student project gallery
├── style.css       — Shared stylesheet (both pages)
├── main.js         — Shared JS (breathing canvas, scroll reveals, nav)
└── README.md       — This file
```

No build tools. No npm. No framework. Zero dependencies. Ships as-is.

---

## Design Tokens

### Colors

| Token           | Value                        | Role                                       |
|-----------------|------------------------------|--------------------------------------------|
| `--ink`         | `#0d0a08`                    | Warm near-black — like charred wood        |
| `--ink-lift`    | `#151008`                    | Slightly lifted surfaces                   |
| `--paper`       | `#e4ddd1`                    | Warm cream — rice paper, not white         |
| `--paper-dim`   | `rgba(228,221,209,0.55)`     | Secondary body text                        |
| `--paper-mute`  | `rgba(228,221,209,0.28)`     | Labels, timestamps, footer                 |
| `--celadon`     | `#7a9e8e`                    | **The one accent.** Song dynasty porcelain |
| `--rust`        | `#9e6b55`                    | iRays section only — life, urgency         |

### Typography

| Role    | Font              | Weight   | Usage                          |
|---------|-------------------|----------|--------------------------------|
| Display | `Cormorant Infant`| 300 / it | Hero name, section headings    |
| Body    | `EB Garamond`     | 400 / it | All prose                      |
| Mono    | `IBM Plex Mono`   | 300–400  | Labels, codes, status, footer  |

---

## Page Architecture

### `index.html`

| Section        | Purpose                                                            |
|----------------|--------------------------------------------------------------------|
| **Nav**        | `RY` mark · iRays · The Vessel · Teaching pillars + Contact ghost |
| **Hero**       | Name, one italic subtitle, single breathing waveform canvas        |
| **Breath**     | Three-line opening poem — sets the philosophical register          |
| **Tier 1**     | iRays (left, rust tint) ↔ The Vessel (right, celadon) side by side|
| **Impact**     | 6 aggregate statistics — wide type, no footnotes                   |
| **Tier 2**     | MCP + Waveform.ai — equal weight, horizontal split                 |
| **Teaching**   | Brief intro + course list + link to teaching.html                  |
| **Tier 3**     | Everything else — compact list, one line each                      |
| **Contact**    | Email only · Wu Wei characters emerging in the dark                |

### `teaching.html`

Separate page showcasing student work from PHYS 252, PHYS 351, and EPAD Capstone.

Each project entry shows:
- Sequential number
- Project title
- Student name(s) + semester ← **replace with real names**
- Description paragraph
- 2–3 tag badges

**To update with real projects:** Find all `[ Student Name(s) ]` and `[ Spring/Fall 20XX ]` placeholder text and replace. Delete any placeholder entries, add new ones by copying the `<div class="project-entry">` block.

---

## The Breathing Waveform

`main.js` → `initBreath()`

Two channels, both barely visible:

- **Celadon channel** (science): amplitude 5.5% of viewport height, moderate speed
- **Paper/cream channel** (soul): amplitude 8.5%, very slow — takes ~45 seconds per cycle

The waveform is not an oscilloscope. It is a breath. It suggests rather than declares. The physics is there if you look; the poetry is there if you feel.

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

### Adding a grant or talk to Tier 3

```html
<li class="tier3-item">
  <span class="t3-year mono-sm">2026</span>
  <span class="t3-name">Title of Grant or Talk</span>
  <span class="t3-desc">One sentence. Funder or venue. Role.</span>
</li>
```

### Changing the impact numbers

In `index.html`, search for `impact-num`. Six stats, each has a number and label. Edit directly.

### Adding a student project to teaching.html

Copy any `<div class="project-entry">` block and fill in title, authors, description, and tags. Change `pe-tag-highlight` to highlight the first/most important tag in celadon.

### Adding a photo

```html
<!-- In .t-hero or .contact-inner: -->
<img src="assets/ran.jpg" alt="Dr. Ran Yang" 
     style="max-width:240px; filter:grayscale(0.2) contrast(1.05); border:1px solid var(--border-mid);" />
```

---

## Performance

- No JS frameworks — vanilla JS ~3KB
- No CSS frameworks — pure CSS ~9KB
- Google Fonts: 2 families, preconnect hints
- Canvas: `requestAnimationFrame` with `clearRect` — no leak
- Scroll reveals: `IntersectionObserver` — no polling
- All animations on `opacity` + `transform` — GPU-composited

Expected Lighthouse: Performance 95+, Best Practices 100.

---

## Browser Support

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+.

---

*"Can you plant a seed for a shadow you will never see?"*  
*— Untitled Time, Ran Yang, 2026*
