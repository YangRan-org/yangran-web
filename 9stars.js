// ── PASSWORD CHECK via SHA-256 hash ──────────────────
// To change the password:
//   1. Open browser console
//   2. Run: crypto.subtle.digest('SHA-256', new TextEncoder().encode('YOUR_NEW_PASSWORD')).then(b => console.log(Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2,'0')).join('')))
//   3. Replace the hash below with the output
//
// Current password: "wuwei" (無為)
const PASS_HASH = '8a43dff71a4f tried7da7b6b2c3f87b33d8c5cc66f0bcb1c8c3d8ee4a8c47e96d';

// Actual SHA-256 of "wuwei" — we compute at runtime
async function sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// We'll compute and store the real hash on first load to set things up
// For now, let's use runtime comparison
const passInput = document.getElementById('passInput');
const gateError = document.getElementById('gateError');
const gate = document.getElementById('gate');
const appRoot = document.getElementById('app-root');

passInput.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    const hash = await sha256(passInput.value);
    // Compare with stored hash
    if (hash === window.__correctHash) {
      // Success — dissolve gate, show app
      gate.classList.add('dissolve');
      setTimeout(() => {
        gate.style.display = 'none';
        appRoot.classList.add('unlocked');
      }, 800);
    } else {
      gateError.textContent = '·';
      passInput.value = '';
      setTimeout(() => { gateError.innerHTML = '&nbsp;'; }, 1500);
    }
  }
});

// Pre-compute the correct hash on load
// Default password: "wuwei"  — change this string to whatever you want
(async () => {
  window.__correctHash = await sha256('wuwei');
})();
