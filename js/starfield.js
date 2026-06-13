/*
This file implements the starfield ascii background effect on the main page.
*/



window.FORGE = window.FORGE || {};
FORGE.starfield = {
  _timer: null,
  _stars: [],
  _speed: 18,
  _N: 160,
  _MAX_Z: 700,

  _spawn(fullRange) {
    const z = fullRange
      ? this._MAX_Z * (0.05 + Math.random() * 0.95)
      : this._MAX_Z;
    return { x: (Math.random() - 0.5) * 1600,
             y: (Math.random() - 0.5) * 1600,
             z, pz: z };
  },

  start() {
    this._stars = Array.from({length: this._N}, () => this._spawn(true));
    this._frame();
    this._timer = setInterval(() => this._frame(), 50);
  },
  stop() {
    clearInterval(this._timer);
    this._timer = null;
  },

  _frame() {
    const el = document.getElementById('starfield');
    if (!el) { this.stop(); return; }
    const W = Math.max(Math.floor(el.clientWidth  / 7.2),  20);
    const H = Math.max(Math.floor(el.clientHeight / 15.6), 10);
    el.textContent = this._render(W, H);
    for (const s of this._stars) {
      s.pz = s.z;
      s.z -= this._speed;
      if (s.z < 1) Object.assign(s, this._spawn(false));
    }
  },

  _render(W, H) {
    const out = new Array(W * H).fill(' ');
    const FOV = 28, K = 11 / 26; // aspect correction (chars are ~2.4× taller than wide)
    const BRIGHT = ' .,+*oO#@';

    for (const s of this._stars) {
      const sx = Math.floor(s.x / s.z * FOV + W / 2);
      const sy = Math.floor(s.y / s.z * FOV * K + H / 2);
      if (sx < 0 || sx >= W || sy < 0 || sy >= H) continue;

      // Quadratic brightness - dim when far, blazing when close
      const t = 1 - s.z / this._MAX_Z;
      const ci = Math.min(Math.floor(t * t * (BRIGHT.length - 1)) + 1, BRIGHT.length - 1);
      out[sx + W * sy] = BRIGHT[ci];

      // Trail dot at previous (farther-back) screen position
      if (s.pz > s.z) {
        const px = Math.floor(s.x / s.pz * FOV + W / 2);
        const py = Math.floor(s.y / s.pz * FOV * K + H / 2);
        if (px >= 0 && px < W && py >= 0 && py < H) {
          const pi = px + W * py;
          if (out[pi] === ' ') out[pi] = '.';
        }
        // Extra midpoint for fast-moving close stars
        if (t > 0.55) {
          const mx = Math.floor((s.x/s.z + s.x/s.pz) / 2 * FOV + W / 2);
          const my = Math.floor((s.y/s.z + s.y/s.pz) / 2 * FOV * K + H / 2);
          if (mx >= 0 && mx < W && my >= 0 && my < H && out[mx + W*my] === ' ')
            out[mx + W * my] = '.';
        }
      }
    }

    return Array.from({length: H}, (_, r) =>
      out.slice(r * W, (r + 1) * W).join('')
    ).join('\n');
  },
};