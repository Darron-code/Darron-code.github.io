# Sarg & Cents — Bookkeeping (Static Site)

One-page marketing website for Sarg & Cents. Built with **plain HTML + CSS** (no build step).

## Quick start (GitHub Pages)

1. **Create a new repo** on GitHub (e.g., `sarg-and-cents-site`).
2. Download this folder and push the files, or upload them via the web UI.
3. In your repo, go to **Settings → Pages** and set:
   - **Source:** *Deploy from a branch*
   - **Branch:** `main` / **root**
4. Wait for the green check, then open the Pages URL shown there.

> If you want a custom domain, add it in **Settings → Pages** and create a `CNAME` record at your DNS provider.  
> Alternatively, add a `CNAME` file at repo root that contains your domain name (e.g., `bookkeeping.example.com`).

## Local preview
Just open `index.html` in your browser. The page links to `styles.css` in the same directory.

## Customize
- **Email button:** In `index.html`, find the “Email Us” button and change the `mailto:` address to your real email.
- **Logo / images:** Place files in `assets/` and swap the inline SVG or add `<img>` tags.
- **Brand text:** Update `<title>` and the hero text to your preferred copy.
- **Analytics:** Add your Google Analytics/Tag snippet before `</head>`.

## Deploy via git (optional)
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/sarg-and-cents-site.git
git push -u origin main
```

## Notes
- `.nojekyll` ensures GitHub Pages serves the site without Jekyll processing.
- This template uses CSS variables for easy theming.
- License: MIT — customize or replace if you prefer.
