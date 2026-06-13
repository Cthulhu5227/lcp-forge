// js/editors/mod.js
/*
Editor for weapon mods (modifications applied to weapons).
*/

window.FORGE = window.FORGE || {};
window.FORGE.editors = window.FORGE.editors || {};

FORGE.editors.mod = {

  label: 'Mod',
  plural: 'Weapon Mods',
  storeKey: 'mods',
  exportFile: 'mods.json',

  // BLANK ITEM

  blank() {
    return {
      _uid: FORGE.store.uid(),
      name: '',
      source: '',
      license: '',
      license_level: 0,
      sp: 1,
      // Which weapon types this mod can be applied to.
      // Empty array means "any weapon type".
      applied_to: [],
      applied_string: '',   // Human-readable version, e.g. "any Rifle or Cannon"
      tags: [],
      description: '',
      effect: '',
      // Stats added by the mod
      added_tags: [],
      added_damage: [],
      added_range: [],
      actions: [],
    };
  },

  // SIDEBAR SUMMARY

  summarize(item) {
    const sp = item.sp ? `${item.sp} SP` : 'No SP';
    const tgt = item.applied_to.length
      ? item.applied_to.join(', ')
      : 'Any weapon';
    return `${sp} · ${tgt}`;
  },

  // RENDER

  render(item) {
    const ui = FORGE.ui;

    // Multi-checkbox for weapon types this mod can apply to
    const typeChecks = FORGE.data.weaponTypes.map(t => `
      <label class="checkbox-chip">
        <input type="checkbox" value="${t}"
               ${item.applied_to.includes(t) ? 'checked' : ''}
               onchange="FORGE.app.collectCurrent()" />
        <span>${t}</span>
      </label>`).join('');

    return `
      <div class="editor">

        <div class="editor-header">
          <div class="editor-header-left">
            <div class="editor-eyebrow">Weapon Mod</div>
            <input class="editor-title-input" id="eName"
                   value="${ui.e(item.name)}"
                   placeholder="Mod designation..."
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
          ui.row(2,
            ui.input('eSP', 'SP Cost', item.sp, { type: 'number', min: 0 }),
            ui.input('eAppliedString', 'Applied To (display text)',
                     item.applied_string, { placeholder: 'e.g. any Main Rifle or Cannon' }),
          )
        )}

        <div class="esec">
          <div class="esec-title">Applicable Weapon Types</div>
          <p style="font-family:var(--font-mono);font-size:10px;color:var(--text-dim);margin-bottom:8px">
            Leave all unchecked to allow on any weapon type.
          </p>
          <div class="checkbox-group">${typeChecks}</div>
        </div>

        ${ui.section('Tags', ui.renderTagSection(item.tags))}

        ${ui.section('Text',
          ui.textarea('eDesc',   'Description (flavor text)', item.description, 3) +
          ui.textarea('eEffect', 'Effect',                    item.effect,      4)
        )}

        ${ui.section('Added Damage (appended to weapon)', ui.renderDamageRows(item.added_damage))}

        ${ui.section('Added Range (appended to weapon)', ui.renderRangeRows(item.added_range))}

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
    item.applied_string = g('eAppliedString')?.value?.trim() || '';
    item.description = g('eDesc')?.value?.trim() || '';
    item.effect = g('eEffect')?.value?.trim() || '';

    item.applied_to = [...document.querySelectorAll('.checkbox-chip input:checked')]
      .map(cb => cb.value);

    item.added_damage = FORGE.ui.collectDamageRows();
    item.added_range = FORGE.ui.collectRangeRows();
  },

};
