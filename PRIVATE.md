# 九星 — Private Notes

**URL:** `yangran.org/9stars.html`  
**Current password:** `wuwei`  
**Hidden link:** Click the 萬物並作，吾以觀復 characters in the Dao section on the homepage.

## Changing the password

1. Open your browser console (F12 → Console)
2. Run:

```js
crypto.subtle.digest('SHA-256', new TextEncoder().encode('YOUR_NEW_PASSWORD'))
  .then(b => console.log(Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2,'0')).join('')))
```

3. Open `9stars.html`, find the line near the bottom of the first `<script>` block:

```js
window.__correctHash = await sha256('wuwei');
```

4. Replace `'wuwei'` with `'YOUR_NEW_PASSWORD'`.
