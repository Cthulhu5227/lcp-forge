/**
 * js/ui.js
 * Shared HTML-generation utilities used by all editors.
 *
 * All functions return HTML strings. After inserting with innerHTML, the
 * app attaches event listeners or uses inline onclick="FORGE.app.*" handlers.
 */

window.FORGE = window.FORGE || {};

FORGE.ui = {


  /** HTML-escapes a value for safe use in attributes and text nodes. */
  e(val) {
    return String(val ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },


  /** Single text/number input wrapped in a labeled field div. */
  input(id, label, value = '', opts = {}) {
    const { type = 'text', placeholder = '', min, max, step } = opts;
    const attrs = [
      `id="${id}"`,
      `class="fi${opts.class ? ' ' + opts.class : ''}"`,
      `type="${type}"`,
      `value="${this.e(value)}"`,
      placeholder ? `placeholder="${this.e(placeholder)}"` : '',
      min !== undefined ? `min="${min}"` : '',
      max !== undefined ? `max="${max}"` : '',
      step !== undefined ? `step="${step}"` : '',
    ].filter(Boolean).join(' ');
    return `<div class="field">
      <label class="field-label" for="${id}">${label}</label>
      <input ${attrs} oninput="FORGE.app.collectCurrent()" />
    </div>`;
  },

  /* Textarea wrapped in a labeled field div. */
  textarea(id, label, value = '', rows = 3) {
    return `<div class="field">
      <label class="field-label" for="${id}">${label}</label>
      <textarea class="fi" id="${id}" rows="${rows}" oninput="FORGE.app.collectCurrent()">${this.e(value)}</textarea>
    </div>`;
  },

  /** Select dropdown wrapped in a labeled field div. */
  select(id, label, value, options) {
    const opts = options.map(o => {
      const v = typeof o === 'string' ? o : o.value;
      const l = typeof o === 'string' ? o : (o.label ?? o.value);
      return `<option value="${this.e(v)}"${v === String(value) ? ' selected' : ''}>${this.e(l)}</option>`;
    }).join('');
    return `<div class="field">
      <label class="field-label" for="${id}">${label}</label>
      <select class="fi" id="${id}" onchange="FORGE.app.collectCurrent()">${opts}</select>
    </div>`;
  },

  /* Wraps multiple field HTML strings in a CSS-grid row. */
  row(cols, ...fields) {
    const template = Array.isArray(cols)
      ? cols.join(' ')
      : `repeat(${cols}, 1fr)`;
    return `<div class="form-row" style="grid-template-columns:${template}">${fields.join('')}</div>`;
  },

  /** An esec section wrapper with title and content. */
  section(title, content) {
    return `<div class="esec"><div class="esec-title">${title}</div>${content}</div>`;
  },


  renderDamageRows(damage = []) {
    const rows = damage.map((d, i) => `
      <div class="inline-row dmg-row">
        <select class="fi dmg-type" onchange="FORGE.app.collectCurrent()">
          ${FORGE.data.damageTypes.map(t => `<option${t === d.type ? ' selected' : ''}>${t}</option>`).join('')}
        </select>
        <input class="fi dmg-val narrow" value="${this.e(d.val)}" placeholder="1d6+2"
               oninput="FORGE.app.collectCurrent()" />
        <button class="rm-btn" onclick="FORGE.app.removeDamage(${i})">✕</button>
      </div>`).join('');
    return `<div class="inline-rows" id="dmgRows">${rows}</div>
            <button class="add-row-btn" onclick="FORGE.app.addDamage()">+ Add damage</button>`;
  },

  collectDamageRows() {
    return [...document.querySelectorAll('.dmg-row')].map(r => ({
      type: r.querySelector('.dmg-type').value,
      val: r.querySelector('.dmg-val').value.trim(),
    })).filter(d => d.val);
  },


  renderRangeRows(range = []) {
    const rows = range.map((r, i) => `
      <div class="inline-row rng-row">
        <select class="fi rng-type" onchange="FORGE.app.collectCurrent()">
          ${FORGE.data.rangeTypes.map(t => `<option${t === r.type ? ' selected' : ''}>${t}</option>`).join('')}
        </select>
        <input class="fi rng-val narrow" type="number" value="${r.val ?? 1}" min="1"
               oninput="FORGE.app.collectCurrent()" />
        <button class="rm-btn" onclick="FORGE.app.removeRange(${i})">✕</button>
      </div>`).join('');
    return `<div class="inline-rows" id="rngRows">${rows}</div>
            <button class="add-row-btn" onclick="FORGE.app.addRange()">+ Add range</button>`;
  },

  collectRangeRows() {
    return [...document.querySelectorAll('.rng-row')].map(r => ({
      type: r.querySelector('.rng-type').value,
      val: parseInt(r.querySelector('.rng-val').value) || 1,
    }));
  },


  /** Renders the full tag section: chip display + add controls. */
  renderTagSection(tags = [], availableTags) {
    const tagDefs  = availableTags || FORGE.data.weaponTags;
    const chips    = tags.length
      ? tags.map((t, i) => {
          const def   = tagDefs.find(x => x.id === t.id) || { name: t.id, hasVal: false };
          const label = def.hasVal && t.val != null
            ? def.name.replace(' X', ` ${t.val}`)
            : def.name;
          return `<span class="tag-chip">${this.e(label)}<span class="tag-x" onclick="FORGE.app.removeTag(${i})">✕</span></span>`;
        }).join('')
      : '<span class="tag-empty">No tags</span>';

    const options  = tagDefs.map(t =>
      `<option value="${t.id}">${this.e(t.name)}</option>`
    ).join('');

    return `<div class="tag-chips" id="tagChips">${chips}</div>
      <div class="tag-add-row">
        <select class="fi" id="tagPicker" style="flex:1">${options}</select>
        <input class="fi" id="tagValIn" type="number" placeholder="X" style="width:70px" />
        <button class="tag-add-btn" onclick="FORGE.app.addTag()">+ Tag</button>
      </div>`;
  },


  renderMountChips(mounts = []) {
    const chips = mounts.map((m, i) =>
      `<span class="mount-chip">${this.e(m)}<span class="mount-x" onclick="FORGE.app.removeMount(${i})">✕</span></span>`
    ).join('');
    const options = FORGE.data.frameMountOptions.map(m =>
      `<option>${m}</option>`
    ).join('');
    return `<div class="mount-chips" id="mountChips">${chips || '<span class="tag-empty">No mounts</span>'}</div>
      <div class="mount-add-row">
        <select class="fi" id="mountPicker" style="width:auto">${options}</select>
        <button class="tag-add-btn" onclick="FORGE.app.addMount()">+ Mount</button>
      </div>`;
  },


  /** Renders a list of action cards with inline editing. */
  renderActionRows(actions = [], containerId = 'actionRows') {
    const rows = actions.map((a, i) => `
      <div class="action-card">
        <div class="action-card-header">
          <input class="fi" value="${this.e(a.name)}" placeholder="Action name"
                 data-action="${i}" data-field="name" oninput="FORGE.app.updateAction(${i},'name',this.value)" />
          <select class="fi" style="max-width:140px"
                  data-action="${i}" data-field="activation"
                  onchange="FORGE.app.updateAction(${i},'activation',this.value)">
            ${FORGE.data.activationTypes.map(t =>
              `<option${t === a.activation ? ' selected' : ''}>${t}</option>`
            ).join('')}
          </select>
          <button class="rm-btn" onclick="FORGE.app.removeAction(${i})">✕</button>
        </div>
        <textarea class="fi" rows="2" placeholder="Description / effect..."
                  oninput="FORGE.app.updateAction(${i},'detail',this.value)">${this.e(a.detail)}</textarea>
        ${a.activation === 'Reaction' ? `
          <input class="fi" style="margin-top:6px" value="${this.e(a.trigger || '')}"
                 placeholder="Reaction trigger condition..."
                 oninput="FORGE.app.updateAction(${i},'trigger',this.value)" />` : ''}
      </div>`).join('');

    return `<div class="action-rows" id="${containerId}">${rows}</div>
            <button class="add-row-btn" onclick="FORGE.app.addAction()">+ Add action</button>`;
  },


  renderMechTypeCheckboxes(selected = []) {
    return `<div class="checkbox-group">
      ${FORGE.data.mechTypes.map(t => `
        <label class="checkbox-chip">
          <input type="checkbox" value="${t}"
                 ${selected.includes(t) ? 'checked' : ''}
                 onchange="FORGE.app.collectCurrent()" />
          <span>${t}</span>
        </label>`).join('')}
    </div>`;
  },


  renderStatsGrid(stats) {
    const fields = [
      { id: 'sSz',  key: 'size',       label: 'Size',        step: 0.5, min: 0.5 },
      { id: 'sStr', key: 'structure',  label: 'Structure',   min: 1 },
      { id: 'sSts', key: 'stress',     label: 'Stress',      min: 1 },
      { id: 'sAr',  key: 'armor',      label: 'Armor',       min: 0, max: 4 },
      { id: 'sHP',  key: 'hp',         label: 'HP',          min: 1 },
      { id: 'sEv',  key: 'evasion',    label: 'Evasion',     min: 1 },
      { id: 'sEd',  key: 'edef',       label: 'E-Defense',   min: 1 },
      { id: 'sHt',  key: 'heatcap',   label: 'Heat Cap',    min: 1 },
      { id: 'sRp',  key: 'repcap',       label: 'Repair Cap',  min: 1 },
      { id: 'sSn',  key: 'sensor_range', label: 'Sensors',     min: 1 },
      { id: 'sTA',  key: 'tech_attack',  label: 'Tech Atk',    min: -3, max: 3 },
      { id: 'sSv',  key: 'save',       label: 'Save Target', min: 1 },
      { id: 'sSp',  key: 'speed',      label: 'Speed',       min: 1 },
      { id: 'sSP',  key: 'sp',         label: 'SP',          min: 0 },
    ];

    return `<div class="stats-grid">${fields.map(f => `
      <div class="stat-field">
        <label class="stat-label" for="${f.id}">${f.label}</label>
        <input class="fi fi-num" id="${f.id}" type="number"
               value="${stats[f.key] ?? 0}"
               min="${f.min ?? 0}"
               ${f.max !== undefined ? `max="${f.max}"` : ''}
               ${f.step ? `step="${f.step}"` : ''}
               oninput="FORGE.app.collectCurrent()" />
      </div>`).join('')}
    </div>`;
  },

};
