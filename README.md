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

Open `index.html` directly in your browser and start building. The app is plain `<script>`-tag JavaScript with no ES modules, so it runs from `file://` (an internet connection is needed once to load JSZip from its CDN).

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

## Acknowledgements

Parts of this project were written or refined with the help of [Claude](https://claude.ai) (Anthropic) — code cleanup, comment formatting, refactoring the ZIP implementation onto JSZip, and general development iteration.

The CRT scanline effect is based on a [CodePen by @thisanimus](https://codepen.io/thisanimus/pen/OJpaqWz).

## License & Legal

The original source code of this project is released under the [MIT License](LICENSE).

**This is an unofficial, fan-made tool.** It is not affiliated with, endorsed by, or
sponsored by Massif Press. *LANCER*, *HORUS*, *Comp/Con*, and related names and marks are
the property of [Massif Press](https://massifpress.com) and are used here purely for
compatibility and identification.

No copyrighted LANCER game content is bundled with this tool — it ships only empty editors,
and all content is created by you. Anything you build with it remains subject to Massif
Press's own licensing and community-use terms.

This project uses [JSZip](https://stuk.github.io/jszip/), dual-licensed under MIT and GPLv3.
