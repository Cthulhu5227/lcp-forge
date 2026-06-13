// js/editors/frame.js
/*
Editor for mech frames (the chassis/hull of a mech).

Frames are the most complex entity in LANCER. They include:
  - Core stats (HP, armor, evasion, etc.)
  - Weapon mount slots
  - Passive traits
  - A core system (with optional passive + one active ability)
*/

window.FORGE = window.FORGE || {};
window.FORGE.editors = window.FORGE.editors || {};

FORGE.editors.frame = {

  label: 'Frame',
  plural: 'Frames',
  storeKey: 'frames',
  exportFile: 'frames.json',

  // BLANK ITEM

  blank() {
    return {
      _uid: FORGE.store.uid(),
      name: '',
      source: '',
      mechtype: ['Balanced'],
      description: '',
      mounts: ['Main', 'Main', 'Heavy'],
      stats: { ...FORGE.data.frameStatDefaults },
      traits: [],
      core_system: {
        name: '',
        description: '',
        // Passive section (optional — leave name empty to omit)
        passive_name: '',
        passive_effect: '',
        passive_actions: [],
        // Active section
        active_name: '',
        activation: 'Protocol',
        active_effect: '',
        active_actions: [],
        use: 'Encounter',
        tags: [],
        counters: [],
        deployables: [],
        integrated: [],
      },
      image_url: '',
      other_art: [],
    };
  },

  // SIDEBAR SUMMARY

  summarize(item) {
    const types = (item.mechtype || []).join('/');
    const mounts = (item.mounts || []).join(', ') || 'No mounts';
    return `${types} · ${mounts}`;
  },

  // RENDER

  render(item) {
    const ui = FORGE.ui;
    const cs = item.core_system;

    return `
      <div class="editor">

        <div class="editor-header">
          <div class="editor-header-left">
            <div class="editor-eyebrow">Mech Frame</div>
            <input class="editor-title-input" id="eName"
                   value="${ui.e(item.name)}"
                   placeholder="Frame designation..."
                   oninput="FORGE.app.collectCurrent()" />
          </div>
        </div>

        ${ui.section('Manufacturer',
          ui.row(1,
            ui.input('eSource', 'Source (Manufacturer)', item.source, { placeholder: 'e.g. GMS, IPS-N, or your LCP prefix' }),
          )
        )}

        ${ui.section('Mech Type', ui.renderMechTypeCheckboxes(item.mechtype))}

        ${ui.section('Description',
          ui.textarea('eDesc', 'Flavor text', item.description, 4)
        )}

        ${ui.section('Stats', ui.renderStatsGrid(item.stats))}

        ${ui.section('Weapon Mounts', ui.renderMountChips(item.mounts))}

        ${ui.section('Traits', this._renderTraits(item.traits))}

        ${ui.section('Core System', this._renderCoreSystem(cs))}

        ${ui.section('Art',
          ui.input('eImageUrl', 'Image URL', item.image_url, { placeholder: 'https://…' })
        )}

      </div>`;
  },

  // TRAITS SUB-RENDERER

  _renderTraits(traits = []) {
    const ui = FORGE.ui;
    const cards = traits.map((t, i) => `
      <div class="trait-card">
        <div class="trait-card-header">
          <input class="fi" value="${ui.e(t.name)}" placeholder="Trait name"
                 oninput="FORGE.app.updateTrait(${i},'name',this.value)" />
          <button class="rm-btn" onclick="FORGE.app.removeTrait(${i})">✕</button>
        </div>
        <textarea class="fi" rows="2" placeholder="Trait description..."
                  oninput="FORGE.app.updateTrait(${i},'description',this.value)">${ui.e(t.description)}</textarea>
      </div>`).join('');

    return `<div class="trait-cards" id="traitCards">${cards}</div>
            <button class="add-row-btn" onclick="FORGE.app.addTrait()">+ Add trait</button>`;
  },

  // CORE SYSTEM SUB-RENDERER

  _renderCoreSystem(cs) {
    const ui = FORGE.ui;
    return `
      ${ui.row(2,
        ui.input('eCsName', 'Core System Name', cs.name,        { placeholder: 'e.g. HYPERSPEC FUEL INJECTOR' }),
        ui.select('eCsUse', 'Uses Per',         cs.use,         ['Encounter', 'Mission', 'Unlimited']),
      )}
      ${ui.textarea('eCsDesc', 'Core System Flavor Text', cs.description, 3)}

      <div class="divider"></div>
      <div class="field-label" style="margin-bottom:8px;color:var(--accent)">PASSIVE (optional)</div>
      ${ui.row(1,
        ui.input('eCsPasName', 'Passive Name', cs.passive_name, { placeholder: 'Leave blank to omit passive' }),
      )}
      ${ui.textarea('eCsPasEffect', 'Passive Effect', cs.passive_effect, 3)}

      <div class="divider"></div>
      <div class="field-label" style="margin-bottom:8px;color:var(--accent)">ACTIVE</div>
      ${ui.row(2,
        ui.input ('eCsActName', 'Active Name',   cs.active_name, { placeholder: 'e.g. ENGAGE AFTERBURNER' }),
        ui.select('eCsActType', 'Activation',    cs.activation,  FORGE.data.activationTypes),
      )}
      ${ui.textarea('eCsActEffect', 'Active Effect', cs.active_effect, 4)}
    `;
  },

  // COLLECT

  collect(item) {
    const g = id => document.getElementById(id);
    const num = (id, fallback = 0) => parseFloat(g(id)?.value) || fallback;

    item.name = g('eName')?.value?.trim() || '';
    item.source = g('eSource')?.value?.trim() || '';
    item.description = g('eDesc')?.value?.trim() || '';
    item.image_url = g('eImageUrl')?.value?.trim() || '';

    // Mech types — collect from checkboxes
    item.mechtype = [...document.querySelectorAll('.checkbox-chip input:checked')]
      .map(cb => cb.value);

    // Stats
    item.stats = {
      size: num('sSz',  1),
      structure: num('sStr', 4),
      stress: num('sSts', 4),
      armor: num('sAr',  0),
      hp: num('sHP',  10),
      evasion: num('sEv',  8),
      edef: num('sEd',  8),
      heatcap: num('sHt',  6),
      repcap: num('sRp',  4),
      sensor_range: num('sSn',  10),
      tech_attack: num('sTA',  0),
      save: num('sSv',  10),
      speed: num('sSp',  4),
      sp: num('sSP',  6),
    };

    // Core system
    const cs = item.core_system;
    cs.name = g('eCsName')?.value?.trim() || '';
    cs.description = g('eCsDesc')?.value?.trim() || '';
    cs.use = g('eCsUse')?.value || 'Encounter';
    cs.passive_name = g('eCsPasName')?.value?.trim() || '';
    cs.passive_effect = g('eCsPasEffect')?.value?.trim() || '';
    cs.active_name = g('eCsActName')?.value?.trim() || '';
    cs.activation = g('eCsActType')?.value || 'Protocol';
    cs.active_effect = g('eCsActEffect')?.value?.trim() || '';

    // Mounts and traits are managed via dedicated mutation methods
    // (addMount, removeTrait, etc.) and are already live in item
  },

};
