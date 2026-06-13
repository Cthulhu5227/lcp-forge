/**
 * js/data.js
 *
 * All editors read from FORGE.data, so changes here propagate everywhere.
 */

window.FORGE = window.FORGE || {};

FORGE.data = {

  // Damage types available in the system
  damageTypes: ['Kinetic', 'Energy', 'Explosive', 'Heat', 'Burn', 'Variable'],

  // Range/ area types for weapons
  rangeTypes: ['Range', 'Threat', 'Blast', 'Burst', 'Cone', 'Line'],

  // Weapon mount  sizes
  mountSizes: ['Aux', 'Main', 'Heavy', 'Superheavy'],

  // Weapon classification  types
  weaponTypes: ['Rifle', 'Cannon', 'Launcher', 'CQB', 'Nexus', 'Melee', 'Improvised'],

  // Frame loadout mount options (Integrated = built-in)
  frameMountOptions: ['Aux', 'Aux/Aux', 'Main', 'Main/Aux', 'Heavy', 'Flex', 'Integrated'],

  mechTypes: ['Balanced', 'Artillery', 'Striker', 'Controller', 'Defender', 'Support'],

  // Action activation types 
  activationTypes: ['Passive', 'Protocol', 'Free', 'Quick', 'Full', 'Reaction', 'Quick Tech', 'Full Tech', 'Invade'],

  // Weapon/system tags KEEP ALIGNMENT FOR READBILITY'S SAKE
  weaponTags: [
    { id: 'tg_accurate',   name: 'Accurate',       hasVal: false },
    { id: 'tg_ap',         name: 'AP',             hasVal: false },
    { id: 'tg_arcing',     name: 'Arcing',         hasVal: false },
    { id: 'tg_armored',    name: 'Armored',        hasVal: false },
    { id: 'tg_burn_x',     name: 'Burn X',         hasVal: true  },
    { id: 'tg_dancer',     name: 'Dancer',         hasVal: false },
    { id: 'tg_heat_self',  name: '[Heat X]',       hasVal: true  },
    { id: 'tg_homing',     name: 'Homing',         hasVal: false },
    { id: 'tg_inaccurate', name: 'Inaccurate',     hasVal: false },
    { id: 'tg_knockback',  name: 'Knockback X',    hasVal: true  },
    { id: 'tg_limited',    name: 'Limited X',      hasVal: true  },
    { id: 'tg_loading',    name: 'Loading',        hasVal: false },
    { id: 'tg_lock_on',    name: 'Lock On',        hasVal: false },
    { id: 'tg_ordnance',   name: 'Ordnance',       hasVal: false },
    { id: 'tg_overkill',   name: 'Overkill',       hasVal: false },
    { id: 'tg_overshield', name: 'Overshield',     hasVal: false },
    { id: 'tg_reliable',   name: 'Reliable X',     hasVal: true  },
    { id: 'tg_seeking',    name: 'Seeking',        hasVal: false },
    { id: 'tg_smart',      name: 'Smart',          hasVal: false },
    { id: 'tg_thrown',     name: 'Thrown X',       hasVal: true  },
    { id: 'tg_unique',     name: 'Unique',         hasVal: false },
    { id: 'tg_ai',         name: 'AI',             hasVal: false },
    { id: 'tg_drone',      name: 'Drone',          hasVal: false },
    { id: 'tg_deployable', name: 'Deployable',     hasVal: false },
    { id: 'tg_protocol',   name: 'Protocol',       hasVal: false },
    { id: 'tg_shield',     name: 'Shield',         hasVal: false },
    { id: 'tg_active',     name: 'Active',         hasVal: true },
  ],


  // Frame default stats  (used when creating a new blank frame)
  frameStatDefaults: {
    size: 1,
    structure: 4,
    stress: 4,
    armor: 0,
    hp: 10,
    evasion: 8,
    edef: 8,
    heatcap: 6,
    repcap: 4,
    sensor_range: 10,
    tech_attack: 0,
    save: 10,
    speed: 4,
    sp: 6,
  },

};
