// js/editors/system.js
/*
Editor for mech systems (active and passive equipment installed on frames).
*/

window.FORGE = window.FORGE || {};
window.FORGE.editors = window.FORGE.editors || {};

FORGE.editors.system = {

  label: 'System',
  plural: 'Systems',
  storeKey: 'systems',
  exportFile: 'systems.json',

  // BLANK ITEM

  blank() {
    return {
      _uid: FORGE.store.uid(),
      name: '',
      source: '',
      license: '',
      license_level: 0,
      sp: 2,
      tags: [],
      description: '',
      effect: '',
      type: '',         // optional system type string (e.g. "Deployable")
      actions: [],
    };
  },

  // SIDEBAR SUMMARY

  summarize(item) {
    const sp = item.sp ? `${item.sp} SP` : 'No SP';
    const acts = item.actions.length ? `${item.actions.length} action${item.actions.length !== 1 ? 's' : ''}` : '';
    return [sp, acts].filter(Boolean).join(' · ') || 'System';
  },

  // RENDER

  render(item) {
    const ui = FORGE.ui;
    return `
      <div class="editor">

        <div class="editor-header">
          <div class="editor-header-left">
            <div class="editor-eyebrow">Mech System</div>
            <input class="editor-title-input" id="eName"
                   value="${ui.e(item.name)}"
                   placeholder="System designation..."
                   oninput="FORGE.app.collectCurrent()" />
          </div>
        </div>

        ${ui.section('License',
          ui.row(3,
            ui.input('eSource',       'Source (Manufacturer)',  item.source,        { placeholder: 'e.g. GMS, IPS-N, or custom' }),
            ui.input('eLicense',      'License (blank = LL0)', item.license,       { placeholder: 'Frame name, e.g. ATLAS' }),
            ui.input('eLicenseLevel', 'License Level',         item.license_level, { type: 'number', min: 0, max: 3 }),
          )
        )}

        ${ui.section('Configuration',
          ui.row(3,
            ui.input('eSP',   'SP Cost',     item.sp,   { type: 'number', min: 0 }),
            ui.input('eType', 'System Type', item.type, { placeholder: 'e.g. Deployable, Drone, AI…' }),
          )
        )}

        ${ui.section('Tags', ui.renderTagSection(item.tags))}

        ${ui.section('Text',
          ui.textarea('eDesc',   'Description (flavor text)', item.description, 3) +
          ui.textarea('eEffect', 'Effect',                    item.effect,      4)
        )}

        ${ui.section('Actions', ui.renderActionRows(item.actions))}

      </div>`;
  },

  // COLLECT

  collect(item) {
    const g = id => document.getElementById(id);
    item.name = g('eName')?.value?.trim() || '';
    item.source = g('eSource')?.value?.trim() || '';
    item.license = g('eLicense')?.value?.trim() || '';
    item.license_level = parseInt(g('eLicenseLevel')?.value) || 0;
    item.sp = parseInt(g('eSP')?.value) || 0;
    item.type = g('eType')?.value?.trim() || '';
    item.description = g('eDesc')?.value?.trim() || '';
    item.effect = g('eEffect')?.value?.trim() || '';
  },

};
