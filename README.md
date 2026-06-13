# HORUS // LCP Forge

![Vanilla JS](https://img.shields.io/badge/vanilla-JS-f7df1e?logo=javascript&logoColor=black)
![No build step](https://img.shields.io/badge/build-none-brightgreen)
![Runs in browser](https://img.shields.io/badge/runs-in%20browser-blue)
![For LANCER](https://img.shields.io/badge/for-LANCER-00cc44)
![License](https://img.shields.io/badge/license-fan%20content-lightgrey)

A browser-based content package builder for the [LANCER TTRPG](https://massifpress.com/lancer). Build custom weapons, systems, frames, and mods, then export a `.lcp` file you can import straight into [Comp/Con](https://compcon.app).

No build step, no backend — just vanilla JavaScript.

## Features

- **Weapons** — mount size, type, damage, range, tags, effects
- **Mech Systems** — SP cost, effects, actions
- **Frames** — full stats, mounts, traits, core systems
- **Weapon Mods** — SP cost, applicable types, added damage/range
- Auto-saves to browser `localStorage` as you work
- Exports a valid `.lcp` ZIP file, entirely client-side

## Usage

### Hosted (GitHub Pages)

Open the page in your browser and start building.

### Local

Open `index.html` directly in your browser. The app is plain `<script>`-tag JavaScript with no ES modules, so it runs from `file://` (an internet connection is needed once to load JSZip from its CDN).

To run a local dev server instead:

```bash
# Python 3
python -m http.server 8080

# Node.js
npx serve .
```

Then visit `http://localhost:8080`.

## Importing into Comp/Con

1. Click **Export .LCP** in the sidebar
2. Save the downloaded `.lcp` file
3. Open [Comp/Con](https://compcon.app)
4. Go to **Compendium → Content Manager → Add Content Package**
5. Select your `.lcp` file
6. Your custom content will appear in the compendium

## Project Structure

```
lancer-lcp-forge/
├── index.html              Main HTML shell
├── css/
│   └── style.css           All styles (edit the CSS variables at the top to retheme)
└── js/
    ├── data.js             Game constants
    ├── zip.js              Thin wrapper around JSZip
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

## Adding a new entity type

1. **Create the editor** — copy any file from `js/editors/` as a template.
   Your editor must register an object on `FORGE.editors.myType` with:

   | Property | Type | Description |
   |---|---|---|
   | `label` | string | Singular display name |
   | `plural` | string | Plural display name for the sidebar |
   | `storeKey` | string | Key in `FORGE.store` (e.g. `'myTypes'`) |
   | `exportFile` | string | Filename in the LCP ZIP (e.g. `'my_types.json'`) |
   | `icon` | string | Emoji or glyph for the sidebar |
   | `blank()` | function | Returns a new blank item |
   | `render(item)` | function | Returns an HTML string for the editor panel |
   | `collect(item)` | function | Reads DOM values into the item |
   | `summarize(item)` | function | Returns a short string for the sidebar |

2. **Add the store array** — in `js/store.js`, add the key to `_persistedKeys`:
   ```js
   _persistedKeys: ['weapons', 'systems', 'frames', 'mods', 'myTypes'],
   ```

3. **Load the script** — in `index.html`, add it before `app.js`:
   ```html
   <script src="js/editors/my-type.js"></script>
   ```

4. **Register it** — in `js/app.js`, add it to the registry:
   ```js
   registry: [
     // ...existing editors...
     FORGE.editors.myType,
   ],
   ```

The sidebar, editor panel, and export all wire up automatically.

## Deploying to GitHub Pages

1. Push the repository to GitHub
2. Go to **Settings → Pages**
3. Set Source to **Deploy from a branch**, then select your branch and `/root`
4. Your app will be live at `https://<username>.github.io/lancer-lcp-forge/`

## Acknowledgements

Parts of this project were written or refined with the help of [Claude](https://claude.ai) (Anthropic) — code cleanup, comment formatting, refactoring the ZIP implementation onto JSZip, and general development iteration.

The CRT scanline effect is based on a [CodePen by @thisanimus](https://codepen.io/thisanimus/pen/OJpaqWz).

## License

This tool is fan-made and unofficial. LANCER is published by [Massif Press](https://massifpress.com).
</content>
</invoke>
