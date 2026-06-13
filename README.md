# HORUS // LCP Forge

A browser-based content package builder for the [LANCER TTRPG](https://massifpress.com/lancer), designed to export `.lcp` files importable directly into [Comp/Con](https://compcon.app).

---

## Features

- **Weapons** — mount size, type, damage, range, tags, effects
- **Mech Systems** — SP cost, effects, actions
- **Frames** — full stats, mounts, traits, core systems
- **Weapon Mods** — SP cost, applicable types, added damage/range
- Auto-saves to browser localStorage as you work
- Exports a valid `.lcp` ZIP file, no server required

---

## Usage

### On GitHub Pages (hosted)

Just open the page in your browser and start building.

### Locally (without a server)

ES-free build: open `index.html` directly in your browser — everything is vanilla JS with no build step and no ES modules, so it works from `file://`.

If you want to run a quick local dev server anyway:

```bash
# Python 3
python -m http.server 8080

# Node.js (npx)
npx serve .
```

Then visit `http://localhost:8080`.

---

## Importing into Comp/Con

1. Click **Export .LCP** in the sidebar
2. Save the downloaded `.lcp` file
3. Open [Comp/Con](https://compcon.app)
4. Go to **Compendium → Content Manager → Add Content Package**
5. Select your `.lcp` file
6. Your custom content will appear in the compendium

### Adding a new entity type

1. **Create the editor** — copy any file from `js/editors/` as a template.
   Your editor must export an object on `FORGE.editors.myType` with:

   | Property | Type | Description |
   |---|---|---|
   | `label` | string | Singular display name |
   | `plural` | string | Plural display name for sidebar |
   | `storeKey` | string | Key in `FORGE.store` (e.g. `'myTypes'`) |
   | `exportFile` | string | Filename in the LCP ZIP (e.g. `'my_types.json'`) |
   | `icon` | string | Emoji or glyph for the sidebar |
   | `blank()` | function | Returns a new blank item |
   | `render(item)` | function | Returns an HTML string for the editor panel |
   | `collect(item)` | function | Reads DOM values into the item |
   | `summarize(item)` | function | Returns a short string for the sidebar |

2. **Add the store array** — in `js/store.js`:
   ```js
   myTypes: [],
   // and in _persistedKeys:
   _persistedKeys: [..., 'myTypes'],
   ```

3. **Load the script** — in `index.html`, add before `app.js`:
   ```html
   <script src="js/editors/my-type.js"></script>
   ```

4. **Register it** — in `js/app.js`, add to the registry:
   ```js
   registry: [
     // ...existing editors...
     FORGE.editors.myType,
   ],
   ```

The sidebar, editor panel, and export all wire up automatically.

---

## Project Structure

```
lancer-lcp-forge/
├── index.html              Main HTML shell
├── css/
│   └── style.css           All styles (edit CSS variables at the top to retheme)
└── js/
    ├── data.js             Game constants 
    ├── zip.js              ZIP file generator
    ├── store.js            Application state + localStorage persistence
    ├── ui.js               Shared HTML-generation helpers for editors
    ├── sidebar.js          Sidebar renderer
    ├── export.js           LCP export logic
    ├── starfield.js        Placeholder ASCII animation
    ├── app.js              Main controller + entity mutation helpers
    └── editors/
        ├── weapon.js
        ├── system.js
        ├── frame.js
        └── mod.js
```

---

## Deploying to GitHub Pages

1. Push this repository to GitHub
2. Go to **Settings / Pages**
3. Set Source to **Deploy from a branch**, select `main` / `root`
4. Your app will be live at `https://yourusername.github.io/lancer-lcp-forge/`

---

## AI Acknowledgements

Parts of this project were written or refined with the assistance of [Claude](https://claude.ai) (Anthropic). This includes code cleanup, comment formatting, refactoring the ZIP implementation to use JSZip, and general development iteration.

The CRT scanline effect is based on a CodePen by [@thisanimus](https://codepen.io/thisanimus/pen/OJpaqWz).

---

## License

This tool is fan-made and unofficial. LANCER is published by [Massif Press](https://massifpress.com).
