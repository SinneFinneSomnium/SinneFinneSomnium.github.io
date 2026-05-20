# SinneFinneSomnium Website - Agent Guide

## Overview
Personal portfolio website with an animated login page and full portfolio homepage. Features premium glassmorphism UI, particle effects, background music with working volume controls, parallax effects, and smooth transitions.

## Architecture
- **Interests Section** (`Home/Homepage.html` → new library & quote UI)
- **Homepage** (`Home/Homepage.html`) → Full portfolio with hero, about, skills, projects, contact sections

## Key Files
- `index.html` — Login entry point with particle canvas, premium login form
- `script.js` — Login logic (admin/1234), particle system, music controls, custom cursor, error handling
- `Style.css` — Main stylesheet with CSS variables design system, glassmorphism, animations
- `Home/Homepage.html` — Full portfolio page with navbar, hero, about, skills, projects, contact, footer
- `Home/Homepage.css` — Portfolio styles with glassmorphism cards, skill bars, scroll animations
- `Home/homepage.js` — Homepage interactivity: tagline typewriter, navbar scroll, stat counters, skill bar animations, IntersectionObserver
- `/bg` — Background videos (11 .mp4 files, randomly selected)
- `/Img/icon` — Icons (ic.png avatar, sticker_11.gif)
- `music/viva.mp3` — Background music

## Development
- No setup required — open `index.html` in browser (or use `python -m http.server`)
- Login credentials hardcoded in `script.js`: username="admin", password="1234"
- After login, redirects to `Home/Homepage.html`
- Random background video selected from `/bg` on each load
- Volume slider properly synced with audio (stopPropagation prevents conflicts)
- Music state simplified to single `musicPlaying` boolean

## Design System (CSS Variables)
- `--accent-blue: #6c9fff` / `--accent-purple: #a855f7` / `--accent-pink: #ec4899`
- `--glass-bg: rgba(15, 15, 35, 0.6)` with `backdrop-filter: blur(24px)`
- Font: Inter + Outfit (Google Fonts)
- Border radius tokens: `--radius-lg: 24px`, `--radius-md: 14px`, `--radius-sm: 8px`

## Features
- Particle system (Canvas API) with connection lines
- Custom cursor glow trail
- Animated gradient border (conic-gradient rotation)
- Floating label inputs
- Music visualizer bars
- Error toast with shake animation (replaces alert())
- Hero tagline typewriter with phrase cycling
- IntersectionObserver scroll animations (fade-in, skill bars, stat counters)
- Responsive design (mobile hamburger menu, flexible grids)

## Notes
- Pure HTML/CSS/JS — no build system, no dependencies
- Audio/video files are large — consider before modifying
- All existing animations and parallax effects preserved and enhanced