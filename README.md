
# SinneFinneSomnium.github.io
This is my website to you to know more about me. :)

## Structure

```
index.html              intro + login page
Home/Homepage.html      homepage
Company/index.html      company page (placeholder)
projects/<name>/        one page per project
projects/_template/     copy this to start a new project page
assets/
  css/  base.css (shared) + one file per page
  js/   media.js (background video + music), reveal.js (scroll effects), lang.js (EN/TH on project pages), one file per page
  img/  avatar, favicon
  media.json            playlist of background videos and music
```

## Run locally

Opening the HTML file directly won't load the playlist. Start a small server in this folder instead:

```
python -m http.server 8000
```

then open http://localhost:8000
