// js/export.js
/*
Assembles the LCP (Lancer Content Package) ZIP file and triggers download.

LCP structure:
  lcp_manifest.json   — pack metadata (required)
  weapons.json        — array of weapon objects
  systems.json        — array of system objects
  frames.json         — array of frame objects
  mods.json           — array of weapon mod objects
  talents.json        — array of talent objects
  tags.json           — array of custom tag definitions
  pilot_armor.json    — array of pilot armor objects
  pilot_weapons.json  — array of pilot weapon objects
  pilot_gear.json     — array of pilot gear objects

Files are only included if they contain at least one item.
*/

window.FORGE = window.FORGE || {};

FORGE.export = {

  /** Builds and downloads the .lcp file. */
  async downloadLCP() {
    FORGE.app.collectCurrent();  // ensure latest edits are saved

    const pack  = FORGE.store.pack;
    const files = [];

    // Manifest
    const manifest = {
      name: pack.name        || 'Unnamed Pack',
      author: pack.author      || 'Unknown',
      description: pack.description || `Content pack by ${pack.author || 'Unknown'}`,
      item_prefix: (pack.prefix     || 'mcl').toLowerCase(),
      version: pack.version     || '1.0.0',
      website: pack.website     || '',
      image_url: '',
      v3: true,
    };
    files.push({ name: 'lcp_manifest.json', data: JSON.stringify(manifest, null, 2) });

    // Content files
    let totalItems = 0;

    for (const editor of FORGE.app.registry) {
      const rawItems = FORGE.store[editor.storeKey] || [];
      if (!rawItems.length) continue;

      // Strip internal _uid fields and generate final LCP IDs
      const exportItems = rawItems.map(item => this._prepareItem(item));
      files.push({
        name: editor.exportFile,
        data: JSON.stringify(exportItems, null, 2),
      });
      totalItems += rawItems.length;
    }

    if (!totalItems) {
      FORGE.sidebar.showMsg('No content to export — create some items first.', 'var(--accent2)');
      return;
    }

    // Build ZIP and download
    const zipBytes = await FORGE.zip.create(files);
    const blob     = new Blob([zipBytes], { type: 'application/zip' });
    const url      = URL.createObjectURL(blob);
    const link     = document.createElement('a');
    const filename = this._safeFilename(pack.name) + '.lcp';

    link.href     = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);

    FORGE.sidebar.showMsg(
      `Exported ${totalItems} item${totalItems !== 1 ? 's' : ''} → ${filename}`,
      'var(--teal)'
    );
  },

  /* Prepares an item for export by:
     - Generating the final LCP ID (prefix_slug_uid)
     - Deep-removing all internal `_uid` fields
     - Stripping the v2 `use` field from frame traits */
  _prepareItem(item) {
    const exported = JSON.parse(JSON.stringify(item));

    if (!exported.id) {
      exported.id = FORGE.store.makeId(item);
    }

    this._stripUids(exported);

    // v3: frame traits no longer carry a `use` field
    if (Array.isArray(exported.traits)) {
      exported.traits.forEach(t => delete t.use);
    }

    // Omit license/license_level when no license is set (LL0 items)
    if (!exported.license) {
      delete exported.license;
      delete exported.license_level;
    }

    return exported;
  },

  /* Recursively deletes `_uid` from an object and all nested objects/arrays. */
  _stripUids(obj) {
    if (!obj || typeof obj !== 'object') return;
    delete obj._uid;
    for (const val of Object.values(obj)) {
      if (Array.isArray(val)) val.forEach(v => this._stripUids(v));
      else if (val && typeof val === 'object') this._stripUids(val);
    }
  },

  /* Converts a pack name to a safe filename (no spaces or special chars). */
  _safeFilename(name) {
    return String(name || 'lancer_lcp')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
  },

};
