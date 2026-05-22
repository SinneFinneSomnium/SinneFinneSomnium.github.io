# SinneFinneSomnium Website – Agent Guide

## Quick Start
- Run a local HTTP server (e.g., `python -m http.server` in the repo root) and open `http://localhost:8000/index.html`. Direct `file://` loads will block `fetch('assets.json')`.
- Login form expects username **admin** and password **1234**; successful login redirects to `Home/Homepage.html`.

## Project Structure

```
/
├── index.html              # Login page (entry point)
├── script.js               # Login page logic (particles, video, music, login)
├── Style.css               # Login page styles
├── assets.json             # Media config (Supabase URLs for videos + music)
├── AGENTS.md               # This file
├── Home/
│   ├── Homepage.html       # Main portfolio page
│   ├── homepage.js         # Homepage logic (sidebar, clock, language, media)
│   └── Homepage.css        # Homepage styles
├── Company/
│   ├── index.html          # Company landing page template
│   ├── company.css         # Company page styles
│   └── company.js          # Company page scroll animations
├── Img/icon/
│   ├── ic.png              # Site favicon and avatar
│   └── sticker_11.gif      # Sticker asset
├── backgrounds/            # Local video files (legacy, not actively used)
└── music/                  # Local music files (legacy, not actively used)
```

## Asset Loading (Supabase)
- All background video and music URLs are defined in `assets.json`.
- Format: `{ "videos": [{ "name": "...", "url": "..." }], "music": [{ "name": "...", "url": "..." }] }`
- Both login (`script.js`) and homepage (`homepage.js`) fetch this file on load.
- **Videos** play randomly with 10-second display + 1.5s fade-in/fade-out transitions.
- **Music** plays randomly; when a song ends, a new random song starts. No consecutive repeats.
- The volume bar dynamically displays the current song name from `assets.json`.
- User manages their own Supabase storage URLs — placeholder values are `YOUR_SUPABASE_..._URL_HERE.webm`.
- All media files use `.webm` format.

## Background Video Cycle
1. Random video picked → fade in (1.5s CSS opacity transition)
2. Visible for 10 seconds
3. Fade out (1.5s) → pick next random video (no repeat) → fade in
4. Repeat forever

## Background Music
- Music array is shuffled randomly.
- On song end (`ended` event), next random song starts automatically.
- `<span id="song-name">` updates dynamically with the current song's name.
- Volume slider initial value is 8%; changes sync via JavaScript on both pages.
- Autoplay blocked by browsers until user interaction; scripts retry after first click/keydown/touchstart.

## Left Sidebar (Homepage)
- Toggle via hamburger button (`id="sidebar-toggle"`) in the navbar.
- Close via × button, overlay click, or Escape key.
- Contains **10 dropdown/accordion sections**:

| # | Section | Content |
|---|---------|---------|
| 1 | 📚 My Library | Reading progress cards (Clean Code, You Don't Know JS, etc.) |
| 2 | 💬 Mindful Quotes | Rotating inspirational quotes with shuffle button |
| 3 | 🔧 Tools | Placeholder video downloaders (YouTube, Twitter/X, Instagram, Facebook) |
| 4 | 🏆 Certificates | Certificate gallery with placeholder cards |
| 5-9 | 📌 Templates | 5 empty dropdown templates for future content |
| 10 | 🏢 My Company | Link to `../Company/index.html` (at sidebar bottom) |

- Dropdowns use accordion behavior: clicking one closes others.
- `max-height` CSS animation for smooth expand/collapse.

## TH/EN Language Switcher
- Pill-shaped button in the top-right corner of the navbar.
- Toggles between English and Thai translations.
- Uses `data-i18n` attributes on HTML elements.
- Translation dictionary is in `homepage.js` (`translations` object).
- Currently covers: nav labels, hero text, section titles, button text, sidebar labels.

## Bangkok Timezone Clock
- Displayed in the hero section below the tagline.
- Shows real-time Bangkok time (UTC+7) updating every second.
- Displays: time (HH:MM:SS), full date with day of week, year in both **BE** (Buddhist Era = AD+543) and **AD**.
- Date format switches between English and Thai based on current language setting.

## Company Page
- Located at `Company/index.html`.
- Template with placeholder content in `[brackets]`.
- Same design system (glass cards, dark theme, accent gradients).
- Has "← Back to Portfolio" navigation link.
- Linked from the sidebar's "My Company" button.

## Login Page Features
- Loading screen (4s) → Welcome screen → Login form with typing effect
- Particle canvas with connection lines
- Custom cursor glow
- Parallax effect on mouse move
- Background video + music from `assets.json`

## Homepage Features
- Fixed navbar with scroll effect (transparent → opaque)
- Hero section with typing tagline animation
- About section with animated stat counters
- Skills section with animated progress bars
- Projects section with glass cards
- Contact section
- IntersectionObserver fade-in animations on all cards

## Development Quirks
- No build step; all assets are static. Editing JS/CSS/HTML updates immediately after refresh.
- Autoplay of background music is blocked by browsers until user interaction; scripts retry after first click/keydown/touchstart.
- Volume slider `input` events stop propagation to avoid triggering the autoplay guard.
- `assets.json` fetch uses relative paths: `"assets.json"` on login, `"../assets.json"` on homepage.

## Contributing
- Keep CSS variables (`--accent-*`, `--glass-bg`, `--radius-*`) unchanged unless updating the design system.
- When adding new sections, follow existing glass-card pattern and add IntersectionObserver fade-in classes.
- For sidebar content, add new `sidebar-dropdown` blocks following the existing accordion pattern.
- Use `data-i18n` attributes on translatable text and add entries to both `en` and `th` dictionaries in `homepage.js`.

## Known Gotchas
- Opening `index.html` directly (`file://`) will cause `fetch('assets.json')` to fail; always use a local server.
- Changing the default volume (value attribute in `<input id="vol-slider">`) without updating JS may desync UI.
- The login redirect URL is hard-coded (`Home/Homepage.html`); if the project structure changes, update `window.location.href` in `script.js`.
- Sidebar tool downloaders are placeholders; actual implementation requires backend services.
- Ensure Supabase storage files have public access policies enabled.
- All media must be `.webm` format for consistent browser support.
