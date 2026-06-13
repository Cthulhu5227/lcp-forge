/**
 * js/app.js
 * Main application controller. Bootstraps the app and coordinates between
 * the store, sidebar, and editors.
 */

window.FORGE = window.FORGE || {};

FORGE.app = {

  /*
     Registry of all entity types, in sidebar display order.
     Add new editors here to register them with the app.
   */
  registry: [
    FORGE.editors.weapon,
    FORGE.editors.system,
    FORGE.editors.frame,
    FORGE.editors.mod,
  ],


  init() {
    FORGE.store.load();
    this.render();

    // Auto-save on page unload
    window.addEventListener('beforeunload', () => {
      this.collectCurrent();
      FORGE.store.save();
    });
  },

  /** Re-renders sidebar + main panel. */
  render() {
    FORGE.sidebar.render();
    this._renderMain();
  },


  /** Toggles a sidebar section open/closed. */
  toggleSection(storeKey) {
    const ui = FORGE.store._ui;
    if (ui.section === storeKey) {
      // Clicking the active section collapses it
      ui.section  = null;
      ui.itemIdx  = -1;
    } else {
      ui.section  = storeKey;
      ui.itemIdx  = -1;
    }
    this.render();
  },

  /** Selects an item for editing. */
  selectItem(storeKey, idx) {
    this.collectCurrent();    // save pending edits
    FORGE.store.save();
    FORGE.store._ui.section = storeKey;
    FORGE.store._ui.itemIdx = idx;
    this.render();
  },

  /** Creates a new blank item and immediately selects it. */
  createItem(storeKey) {
    this.collectCurrent();
    const editor  = this._editorFor(storeKey);
    if (!editor) return;
    const newItem = editor.blank();
    FORGE.store[storeKey].push(newItem);
    FORGE.store._ui.section = storeKey;
    FORGE.store._ui.itemIdx = FORGE.store[storeKey].length - 1;
    FORGE.store.save();
    this.render();
  },

  /** Deletes an item after confirmation. */
  deleteItem(storeKey, idx) {
    const arr    = FORGE.store[storeKey];
    const name   = arr[idx]?.name || 'this item';
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    arr.splice(idx, 1);
    const ui = FORGE.store._ui;
    if (ui.section === storeKey && ui.itemIdx >= arr.length) {
      ui.itemIdx = arr.length - 1;
    }
    FORGE.store.save();
    this.render();
  },


  /** Returns the editor module for a given storeKey. */
  _editorFor(storeKey) {
    return this.registry.find(e => e.storeKey === storeKey) || null;
  },

  /** Renders the main editor panel for the current item. */
  _renderMain() {
    const main = document.getElementById('main');
    if (!main) return;
    FORGE.starfield.stop();
    const item   = FORGE.store.currentItem();
    const editor = item ? this._editorFor(FORGE.store._ui.section) : null;

    if (!item || !editor) {
      main.innerHTML = `
        <div class="placeholder">
          <pre id="starfield" class="starfield" aria-hidden="true"></pre>
          <div class="placeholder-info">
            <p class="placeholder-text">Select a category and create an item</p>
            <p class="placeholder-hint">Your work is auto-saved in the browser</p>
          </div>
        </div>`;
      FORGE.starfield.start();
      return;
    }

    main.innerHTML = editor.render(item);
  },

  /**
   * Collects the current editor's DOM values into the active item.
   * Called on every input event and before any navigation action.
   */
  collectCurrent() {
    const item   = FORGE.store.currentItem();
    const editor = item ? this._editorFor(FORGE.store._ui.section) : null;
    if (!item || !editor) return;
    editor.collect(item);
    // Re-render sidebar names/meta without rebuilding the whole editor
    FORGE.sidebar.render();
    FORGE.store.save();
  },


  addDamage() {
    const item = FORGE.store.currentItem();
    if (!item) return;
    (item.damage = item.damage || []).push({ type: 'Kinetic', val: '1d6' });
    this._rerenderDamage(item);
  },

  removeDamage(idx) {
    const item = FORGE.store.currentItem();
    if (!item) return;
    item.damage.splice(idx, 1);
    this._rerenderDamage(item);
  },

  _rerenderDamage(item) {
    const container = document.getElementById('dmgRows')?.parentElement;
    if (!container) return;
    container.innerHTML = FORGE.ui.renderDamageRows(item.damage);
  },


  addRange() {
    const item = FORGE.store.currentItem();
    if (!item) return;
    (item.range = item.range || []).push({ type: 'Range', val: 5 });
    this._rerenderRange(item);
  },

  removeRange(idx) {
    const item = FORGE.store.currentItem();
    if (!item) return;
    item.range.splice(idx, 1);
    this._rerenderRange(item);
  },

  _rerenderRange(item) {
    const container = document.getElementById('rngRows')?.parentElement;
    if (!container) return;
    container.innerHTML = FORGE.ui.renderRangeRows(item.range);
  },


  addTag() {
    const item = FORGE.store.currentItem();
    if (!item) return;
    const id      = document.getElementById('tagPicker')?.value;
    const valRaw  = document.getElementById('tagValIn')?.value;
    if (!id) return;
    if ((item.tags || []).find(t => t.id === id)) return;  // no duplicates
    const def     = FORGE.data.weaponTags.find(t => t.id === id);
    const entry   = { id };
    if (def?.hasVal && valRaw) entry.val = parseInt(valRaw);
    (item.tags = item.tags || []).push(entry);
    document.getElementById('tagValIn').value = '';
    this._rerenderTags(item);
  },

  removeTag(idx) {
    const item = FORGE.store.currentItem();
    if (!item) return;
    item.tags.splice(idx, 1);
    this._rerenderTags(item);
  },

  _rerenderTags(item) {
    const section = document.getElementById('tagChips')?.parentElement;
    if (!section) return;
    section.innerHTML = FORGE.ui.renderTagSection(item.tags);
  },


  addMount() {
    const item = FORGE.store.currentItem();
    if (!item) return;
    const val = document.getElementById('mountPicker')?.value;
    if (!val) return;
    (item.mounts = item.mounts || []).push(val);
    this._rerenderMounts(item);
  },

  removeMount(idx) {
    const item = FORGE.store.currentItem();
    if (!item) return;
    item.mounts.splice(idx, 1);
    this._rerenderMounts(item);
  },

  _rerenderMounts(item) {
    const section = document.getElementById('mountChips')?.parentElement;
    if (!section) return;
    section.innerHTML = FORGE.ui.renderMountChips(item.mounts);
  },


  addTrait() {
    const item = FORGE.store.currentItem();
    if (!item) return;
    (item.traits = item.traits || []).push({
      _uid: FORGE.store.uid(),
      name: '', description: '',
    });
    this._rerenderTraits(item);
  },

  removeTrait(idx) {
    const item = FORGE.store.currentItem();
    if (!item) return;
    item.traits.splice(idx, 1);
    this._rerenderTraits(item);
  },

  updateTrait(idx, field, value) {
    const item = FORGE.store.currentItem();
    if (!item?.traits?.[idx]) return;
    item.traits[idx][field] = value;
    FORGE.store.save();
  },

  _rerenderTraits(item) {
    const container = document.getElementById('traitCards');
    if (!container) return;
    container.outerHTML = FORGE.editors.frame._renderTraits(item.traits);
  },


  addAction() {
    const item = FORGE.store.currentItem();
    if (!item) return;
    (item.actions = item.actions || []).push({
      _uid: FORGE.store.uid(),
      name: '', activation: 'Quick', detail: '', trigger: '',
    });
    this._rerenderActions(item);
  },

  removeAction(idx) {
    const item = FORGE.store.currentItem();
    if (!item) return;
    item.actions.splice(idx, 1);
    this._rerenderActions(item);
  },

  updateAction(idx, field, value) {
    const item = FORGE.store.currentItem();
    if (!item?.actions?.[idx]) return;
    item.actions[idx][field] = value;
    // Re-render only if activation changed (to show/hide trigger field)
    if (field === 'activation') this._rerenderActions(item);
    FORGE.store.save();
  },

  _rerenderActions(item) {
    const container = document.getElementById('actionRows');
    if (!container) return;
    container.outerHTML = FORGE.ui.renderActionRows(item.actions);
  },

};

FORGE.app.init();
