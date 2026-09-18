# Firefox Bookmark Explorer

This project renders a Firefox bookmark export as a nested folder tree with expandable cards.

## Files

- `index.html` — page shell
- `styles.css` — visual styling
- `app.js` — loads `data/bookmarks.json` and renders the folder hierarchy
- `data/bookmarks.json` — your bookmark tree

## Local preview

From this folder, run:

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Replace data

Convert a Firefox HTML or JSON export before using it:

->
node scripts/convert-firefox-bookmarks.js sample/firefox-bookmarks-export.html data/bookmarks.json

node scripts/convert-firefox-bookmarks.js firefox/20260918_bookmarks.json data/bookmarks.json
