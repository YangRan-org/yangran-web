# yangran.org

Personal website of Dr. Ran Yang, Teaching Professor of Physics at William & Mary.

Live domain: <https://yangran.org>

This is a static site: HTML, CSS, and mostly vanilla JavaScript. There is no build step, no npm install, and no framework required for the public portfolio pages.

## Design Direction

The site should remain quiet, poetic, and spacious: celadon accents, paper-like surfaces, ripple canvases, Dao references, and a personal portfolio rhythm rather than an institutional one.

Keep the homepage hero unchanged:

```text
Yang, Ran
Physicist. Inventor. Educator.
```

Do not add a visible title, affiliation, CTA, portrait, badge, or explanatory hero text.

## File Structure

```text
yangran-web/
├── index.html                 Public homepage
├── teaching.html              Teaching hub and engineering physics pipeline
├── phys252.html               PHYS 252: Electronics
├── phys351.html               PHYS 351: Advanced Instrumentation
├── engineering-physics.html   Capstone and Honors Thesis
├── 9stars.html                Noindex private page reached from the Dao link
├── style.css                  Shared public-page styles
├── main.js                    Shared public-page JavaScript
├── 9stars.css                 Private-page styles
├── 9stars.js                  Private-page gate
├── 9stars-app.jsx             Private-page app loaded in browser
├── planetary-system.jsx       Source/reference copy for the private page
├── assets/
│   ├── favicon.svg
│   ├── social-preview.png
│   └── social-preview.svg
├── scripts/
│   └── check-site.py          Dependency-free local sanity checks
├── CNAME                      GitHub Pages custom domain: yangran.org
└── README.md
```

`index_beforeStar.html` is an archived pre-private-link copy and is marked `noindex`.

## Design Tokens

Primary tokens live in `style.css`.

| Token | Value | Role |
| --- | --- | --- |
| `--ground` | `#F4F2EE` | Base paper surface |
| `--ground-lift` | `#ECEAE6` | Lifted surface |
| `--ground-deep` | `#E4E1DC` | Deeper surface |
| `--ink` | `#1A1D21` | Primary text |
| `--ink-mid` | `#3A3D42` | Body text |
| `--ink-soft` | `rgba(26,29,33,0.45)` | Labels and captions |
| `--ink-ghost` | `rgba(26,29,33,0.18)` | Very subtle text |
| `--celadon` | `#5E8A78` | Accent |
| `--celadon-dim` | `rgba(94,138,120,0.15)` | Borders and focus wash |
| `--celadon-wash` | `rgba(94,138,120,0.06)` | Quiet fills |
| `--slate` | `#8C9196` | Technical labels |

Fonts:

| Role | Font |
| --- | --- |
| Display | `Cormorant Infant` |
| Body | `EB Garamond` |
| Mono | `IBM Plex Mono` |
| Chinese serif | `Noto Serif SC` |

## Current Pages

- `index.html`: homepage, project hierarchy, impact, Dao section, contact.
- `teaching.html`: teaching overview and four-course pipeline.
- `phys252.html`: PHYS 252 course page.
- `phys351.html`: PHYS 351 course page.
- `engineering-physics.html`: PHYS 471/472 and EPAD 495/496.
- `9stars.html`: noindex private page.

## Metadata And Social Preview

Every HTML page should have:

- a page-specific `<title>` and description
- canonical URL using `https://yangran.org`
- Open Graph title, description, URL, and image
- Twitter summary card metadata
- favicon links
- `theme-color`

The shared preview asset is `assets/social-preview.png`, rendered from `assets/social-preview.svg`. If the SVG source changes, re-export the PNG at 1200x630 and keep the `og:image` and `twitter:image` values pointed at the PNG.

Homepage JSON-LD uses conservative `Person` schema. Subpages use simple `WebPage` schema.

## MCP Link State

For now, MCP links should point to:

```text
https://mentoring-for-careers-in-physics.github.io/mcp-site/
```

When MCP DNS is ready, switch those links back to:

```text
https://mcp.physics.wm.edu
```

Also update visible labels if they should once again display `mcp.physics.wm.edu`.

## Local Checks

Run:

```bash
python3 scripts/check-site.py
```

The script checks missing local files, broken internal anchors, required page metadata, and accidental use of the future MCP DNS host in site files.

## Deployment

GitHub Pages serves the repository root directly. Keep `CNAME` set to:

```text
yangran.org
```

Recommended flow:

```bash
git add .
git commit -m "Update site metadata and accessibility"
git push
```

Then verify GitHub Pages is configured for the main branch root, with HTTPS enabled for `yangran.org`.
