// js/zip.js
// Thin wrapper around JSZip. Requires jszip.min.js loaded before this file.

window.FORGE = window.FORGE || {};

FORGE.zip = {
  async create(files) {
    const zip = new JSZip();
    for (const f of files) {
      zip.file(f.name, f.data);
    }
    return zip.generateAsync({ type: 'uint8array' });
  },
};
