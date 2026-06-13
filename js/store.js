/**
 * js/store.js
 * Central application state. All LCP content lives here.
 */

window.FORGE = window.FORGE || {};

FORGE.store = {

  pack: {
    name: 'My Custom LCP',
    author: '',
    version: '1.0.0',
    prefix: 'mcl',
    description: '',
    website: '',
  },

  // Each array holds items for that entity type.
  weapons: [],
  systems: [],
  frames: [],
  mods: [],

  // Keys that are saved/loaded from localStorage (must match array names above)
  _persistedKeys: ['weapons', 'systems', 'frames', 'mods'],

  _ui: {
    section: null,  // storeKey of the currently active entity type
    itemIdx: -1,    // index of the currently selected item (-1 = none)
  },


  /** Generates a short random unique string for internal tracking. */
  uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  },

  /** Converts a display name into a URL-safe slug. */
  slug(name) {
    return String(name || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
  },

  /**
   * Builds a stable LCP export ID for an item.
   * Format: {prefix}_{name-slug}_{uid}
   */
  makeId(item) {
    const prefix    = (this.pack.prefix || 'mcl').toLowerCase();
    const nameSlug  = this.slug(item.name) || 'item';
    const uid       = item._uid || this.uid();
    return `${prefix}_${nameSlug}_${uid}`;
  },


  /** Saves all content to localStorage (silently fails if unavailable). */
  save() {
    try {
      const snapshot = { pack: this.pack };
      for (const key of this._persistedKeys) {
        snapshot[key] = this[key];
      }
      localStorage.setItem('forge_lcp_state', JSON.stringify(snapshot));
    } catch (e) {
      console.warn('[FORGE] localStorage save failed:', e);
    }
  },

  /** Restores content from localStorage (silently fails if nothing saved). */
  load() {
    try {
      const raw = localStorage.getItem('forge_lcp_state');
      if (!raw) return;
      const snapshot = JSON.parse(raw);
      if (snapshot.pack) Object.assign(this.pack, snapshot.pack);
      for (const key of this._persistedKeys) {
        if (Array.isArray(snapshot[key])) {
          this[key] = snapshot[key];
        }
      }
    } catch (e) {
      console.warn('[FORGE] localStorage load failed:', e);
    }
  },

  /** Clears all content after confirmation. */
  clear() {
    if (!confirm('Clear all content? This cannot be undone.')) return;
    for (const key of this._persistedKeys) {
      this[key] = [];
    }
    this._ui.section  = null;
    this._ui.itemIdx  = -1;
    this.save();
    FORGE.app.render();
  },


  /** Returns the currently selected item, or null. */
  currentItem() {
    const { section, itemIdx } = this._ui;
    if (!section || itemIdx < 0) return null;
    const arr = this[section];
    if (!arr || itemIdx >= arr.length) return null;
    return arr[itemIdx];
  },

};
