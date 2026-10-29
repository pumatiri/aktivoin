/* Applies the saved theme before first paint (no flash). Loaded synchronously in <head>. */
  // Apply the saved theme before first paint (no flash).
  (function () {
    var t = null;
    try { t = localStorage.getItem('aktivo_theme'); } catch (e) {}
    if (t !== 'dark' && t !== 'light') t = (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);
  })();
