# Gaby Bonilla — portfolio

Static portfolio site built with HTML and CSS. No build step or framework is needed.

## Preview locally

From this folder, run:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000` in a browser. The home page links to selected work, the profile page, and the interactive CV.

## Files

- `index.html` — portfolio home and profile
- `work.html` — selected projects overview
- `summary.html`, `date-picker.html`, `imei-registration.html`, `travel-club.html`, `teatro-mayor.html`, `questions.html` — independent case-study pages with end-of-page project navigation
- `cv.html`, `cv.css`, `cv.js`, `cv-data.js` — interactive CV, built from the supplied source document
- `outputs/maria-gabriela-cv.pdf` — polished, two-page PDF version available from the CV page
- `cv-print.html`, `cv-print.css`, `cv-print.js` — print-ready CV layout source
- `styles.css`, `portfolio-overrides.css`, `case-studies.css`, `meli-case.css` — layout and case-study styles
- `visitor.css`, `visitor-cursor.js` — the visitor’s state-aware cursor, frosty particle trail, and private name setting. A chosen name stays in that visitor’s browser storage.
- `assets/meli/02_SUMMARY/T1___T3.png` — the full-length Summary dashboard shown in an accessible, scrollable preview
- `assets/meli/06_VIDEOS/QUESTIONS/` — the two Questions case-study walkthrough videos
- `assets/` — profile illustration and project imagery from the supplied portfolio materials

The visual direction takes cues from the supplied reference’s dotted canvas, floating labels, and pill navigation, with an original layout, palette, and code. Fonts load from Google Fonts when a network connection is available; system fallbacks are included.
