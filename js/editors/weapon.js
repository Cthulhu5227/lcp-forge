// js/editors/weapon.js
/*
Editor for mech weapons.

Every editor module exports an object on FORGE.editors with:
  label, plural, storeKey, exportFile
  blank()       → new blank item
  render(item)  → HTML string for the editor panel
  collect(item) → reads DOM into item (called on every input event)
  summarize(item) → short string for the sidebar
*/

window.FORGE = window.FORGE || {};
window.FORGE.editors = window.FORGE.editors || {};

FORGE.editors.weapon = {

  label: 'Weapon',
  plural: 'Weapons',
  storeKey: 'weapons',
  exportFile: 'weapons.json',

  // BLANK ITEM
  blank() {
    return {
      _uid: FORGE.store.uid(),
      name: '',
      source: '',
      license: '',
      license_level: 0,
      mount: 'Main',
      type: 'Rifle',
      damage: [{ type: 'Kinetic', val: '1d6' }],
      range: [{ type: 'Range',   val: 8      }],
      tags: [],
      sp: 0,
      description: '',
      effect: '',
      on_attack: '',
      on_hit: '',
      on_crit: '',
      actions: [],
    };
  },

  // SIDEBAR SUMMARY
  summarize(item) {
    const dmg = item.damage.map(d => `${d.val} ${d.type}`).join('+') || '—';
    const rng = item.range.map(r => `${r.type} ${r.val}`).join(' · ') || '—';
    return `${item.mount} ${item.type} · ${dmg} · ${rng}`;
  },

  // RENDER
  render(item) {
    const ui = FORGE.ui;
    return `
      <div class="editor">

        ${this._header(item)}

        ${ui.section('License',
          ui.row(3,
            ui.input('eSource',       'Source (Manufacturer)',  item.source,        { placeholder: 'e.g. GMS, IPS-N, or custom' }),
            ui.input('eLicense',      'License (blank = LL0)', item.license,       { placeholder: 'Frame name, e.g. ATLAS' }),
            ui.input('eLicenseLevel', 'License Level',         item.license_level, { type: 'number', min: 0, max: 3 }),
          )
        )}

        ${ui.section('Configuration',
          ui.row(4,
            ui.select('eMount', 'Mount',       item.mount, FORGE.data.mountSizes),
            ui.select('eType',  'Type',        item.type,  FORGE.data.weaponTypes),
            ui.input ('eSP',    'SP Cost',     item.sp,    { type: 'number', min: 0 }),
          )
        )}

        ${ui.section('Damage', ui.renderDamageRows(item.damage))}

        ${ui.section('Range', ui.renderRangeRows(item.range))}

        ${ui.section('Tags', ui.renderTagSection(item.tags))}

        ${ui.section('Text',
          ui.textarea('eDesc',   'Description (flavor text)', item.description, 3) +
          ui.textarea('eEffect', 'Effect',                    item.effect,      3) +
          ui.row(3,
            ui.textarea('eOnAtk',  'On Attack', item.on_attack, 2),
            ui.textarea('eOnHit',  'On Hit',    item.on_hit,    2),
            ui.textarea('eOnCrit', 'On Crit',   item.on_crit,   2),
          )
        )}

        ${ui.section('Actions', ui.renderActionRows(item.actions))}

      </div>`;
  },

  _header(item) {
    return `
      <div class="editor-header">
        <div class="editor-header-left">
          <div class="editor-eyebrow">Weapon</div>
          <input class="editor-title-input" id="eName"
                 value="${FORGE.ui.e(item.name)}"
                 placeholder="Weapon designation..."
                 oninput="FORGE.app.collectCurrent()" />
        </div>
      </div>`;
  },


  collect(item) {
    const g = id => document.getElementById(id);

    item.name = g('eName')?.value?.trim() || '';
    item.source = g('eSource')?.value?.trim() || '';
    item.license = g('eLicense')?.value?.trim() || '';
    item.license_level = parseInt(g('eLicenseLevel')?.value) || 0;
    item.mount = g('eMount')?.value || 'Main';
    item.type = g('eType')?.value || 'Rifle';
    item.sp = parseInt(g('eSP')?.value) || 0;
    item.description = g('eDesc')?.value?.trim() || '';
    item.effect = g('eEffect')?.value?.trim() || '';
    item.on_attack = g('eOnAtk')?.value?.trim() || '';
    item.on_hit = g('eOnHit')?.value?.trim() || '';
    item.on_crit = g('eOnCrit')?.value?.trim() || '';

    // Damage, range, and tags are managed by FORGE.app helper methods
    item.damage = FORGE.ui.collectDamageRows();
    item.range = FORGE.ui.collectRangeRows();

    // Actions collected via updateAction() mutations — already live in item
  },

};
