/**
 * js/sidebar.js
 * Renders the left-hand sidebar: pack config, entity type nav, and export.
 *
 * The sidebar is fully driven by FORGE.app.registry
 */

window.FORGE = window.FORGE || {};

FORGE.sidebar = {

  /** Renders the full sidebar into sidebar. */
  render() {
    const el = document.getElementById('sidebar');
    if (!el) return;
    el.innerHTML = this._packConfig() + this._nav() + this._exportSection();
    this._attachPackListeners();
  },


  _packConfig() {
    const p = FORGE.store.pack;
    return `
      <div class="sidebar-pack">
        <div class="sidebar-pack-title">Content Pack</div>
        <div class="pack-fields">
          <div class="pack-field full">
            <span class="pack-label">Pack Name</span>
            <input class="pack-input" id="packName" value="${this._e(p.name)}" />
          </div>
          <div class="pack-field full">
            <span class="pack-label">Author</span>
            <input class="pack-input" id="packAuthor" value="${this._e(p.author)}" placeholder="Your name" />
          </div>
          <div class="pack-field">
            <span class="pack-label">Version</span>
            <input class="pack-input" id="packVersion" value="${this._e(p.version)}" />
          </div>
          <div class="pack-field">
            <span class="pack-label">ID Prefix</span>
            <input class="pack-input" id="packPrefix" value="${this._e(p.prefix)}" maxlength="8" />
          </div>
          <div class="pack-field full">
            <span class="pack-label">Website (optional)</span>
            <input class="pack-input" id="packWebsite" value="${this._e(p.website)}" placeholder="https://…" />
          </div>
        </div>
      </div>`;
  },

  _attachPackListeners() {
    const fields = {
      packName: 'name',
      packAuthor: 'author',
      packVersion: 'version',
      packPrefix: 'prefix',
      packWebsite: 'website',
    };
    for (const [id, key] of Object.entries(fields)) {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => {
          FORGE.store.pack[key] = el.value.trim();
          FORGE.store.save();
        });
      }
    }
  },


  _nav() {
    const sections = FORGE.app.registry.map(editor => {
      const items    = FORGE.store[editor.storeKey] || [];
      const isOpen   = FORGE.store._ui.section === editor.storeKey;
      const openCls  = isOpen ? 'open' : '';

      const itemsHtml = items.map((item, idx) => {
        const isActive = isOpen && FORGE.store._ui.itemIdx === idx;
        const name     = item.name || 'Unnamed';
        const nameCls  = item.name ? '' : 'unnamed';
        const meta     = editor.summarize(item);
        return `
          <div class="nav-item${isActive ? ' active' : ''}"
               onclick="FORGE.app.selectItem('${editor.storeKey}', ${idx})">
            <div>
              <div class="nav-item-name ${nameCls}">${this._e(name)}</div>
              <div class="nav-item-meta">${this._e(meta)}</div>
            </div>
            <button class="nav-item-del"
                    onclick="event.stopPropagation(); FORGE.app.deleteItem('${editor.storeKey}', ${idx})">
              DEL
            </button>
          </div>`;
      }).join('');

      const count = items.length;
      return `
        <div class="nav-section">
          <div class="nav-section-header ${openCls}"
               onclick="FORGE.app.toggleSection('${editor.storeKey}')">
            <div class="nav-section-left">
              <span class="nav-section-label">${editor.plural}</span>
            </div>
            <div style="display:flex;align-items:center;gap:6px">
              ${count ? `<span class="nav-section-count">${count}</span>` : ''}
              <span class="nav-chevron">›</span>
            </div>
          </div>
          <div class="nav-items">
            ${itemsHtml}
            <button class="nav-add-btn"
                    onclick="FORGE.app.createItem('${editor.storeKey}')">
              + New ${editor.label}
            </button>
          </div>
        </div>`;
    }).join('');

    return `<nav class="sidebar-nav">${sections}</nav>`;
  },


  _exportSection() {
    return `
      <div class="sidebar-export">
        <button class="export-btn" onclick="FORGE.export.downloadLCP()">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          Export .LCP
        </button>
        <div class="export-msg" id="exportMsg"></div>
      </div>`;
  },


  _e(val) {
    return String(val ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  /** Shows a brief status message in the export area. */
  showMsg(text, color = 'var(--teal)') {
    const el = document.getElementById('exportMsg');
    if (!el) return;
    el.style.color = color;
    el.textContent = text;
    clearTimeout(this._msgTimer);
    this._msgTimer = setTimeout(() => { el.textContent = ''; }, 5000);
  },

};
