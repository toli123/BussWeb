# Bali Bus – Kičevo · Presentation website

Student project for **Business Practice 2025/2026** (FCSE, Skopje).
A presentation website for *Bali Bus*, a bus company from Kičevo, North Macedonia.

> All timetables, prices, team members, phone numbers and news are **fictional** and were written for this course project.

## Pages

| File | Content |
|---|---|
| `index.html` | Home: hero with timetable search, key figures, popular routes, why travel with us, latest news, group CTA |
| `routes.html` | Interactive Leaflet/OpenStreetMap map with all 21 lines, country filter, route list, collapsible route cards per country |
| `timetable.html` | Full timetable with search, country and day-of-week filters; ticket/discount/luggage info |
| `services.html` | Services, coach rental, discount table and ticket rules |
| `about.html` | Company story, statistics, values, team, fleet gallery |
| `news.html` | Four news articles |
| `faq.html` | Frequently asked questions (accordion) |
| `contact.html` | Contact details, station map, validated contact form, directions |
| `privacy.html` | Privacy & cookie policy |

## Features required by the assignment

- Basic information, services, team, news, FAQ, detailed route/price information
- Contact form with client-side validation (no backend on static hosting – a success message is shown)
- Newsletter form in the footer
- **Multilingual**: Macedonian (MK), Albanian (SQ), English (EN). The language is part of the URL (`?lang=mk`) and is added to every internal link, so any page can be opened directly in a given language. With preference consent it is also remembered in `localStorage`; otherwise it falls back to the browser language. All strings live in `assets/js/i18n.js`.
- **Cookie consent** banner with *Accept all* / *Necessary only* / *Settings* (per-category toggles). The choice is stored in a real `balibus_consent` cookie (180 days); "Necessary only" deletes the saved language. "Cookie settings" in the footer reopens it.
- Responsive layout (mobile menu, stacked grids), flat "Night coach" look (navy + signal orange) inspired by zvv.ch, inline SVG icons, SVG logo and favicon
- No build step – plain HTML, CSS and JavaScript

## Structure

```
index.html … privacy.html      pages
assets/css/style.css           theme
assets/js/routes-data.js       all routes, coordinates, departure times, prices (edit here)
assets/js/i18n.js              translations for every data-i18n key
assets/js/main.js              language switch, nav, cookies, route cards, timetable, forms
assets/js/map.js               Leaflet route map + station map
assets/img/                    logo.svg, favicon.svg, bus-fallback.svg
assets/img/photos/             photos (originally from Unsplash, free licence)
```

## External resources (loaded from CDN)

- Leaflet 1.9.4 (unpkg) + OpenStreetMap tiles – route map
- Google Fonts (Barlow, Barlow Semi Condensed)
- Photos are stored locally in `assets/img/photos/` (downloaded from Unsplash, free licence); `assets/img/bus-fallback.svg` is shown automatically if a photo fails to load.

## Running locally

Open `index.html` directly in a browser, or serve the folder:

```bash
py -m http.server 8000
```

then open <http://localhost:8000>.

## Deploying on the FCSE server

Upload the whole folder (all `.html` files and the `assets/` directory) to the web root. No server-side code is needed.

## Editing content

- **Routes / times / prices**: `assets/js/routes-data.js` – each route has `name` in three languages, `coords`, `km`, `duration`, `price`, `days` (schedule code) and `departures`.
- **Texts**: HTML elements carry `data-i18n="key"`; the text for each key in each language is in `assets/js/i18n.js`. English is the fallback.
- **Team members / news**: edit `about.html` and `news.html` (and the matching keys in `i18n.js` for MK/SQ).
