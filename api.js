/*
 * AKTIVO — API bridge
 * Talks to the Apps Script backend (config.js → API_URL) with fetch().
 * It exposes the same interface as Apps Script's google.script.run, so the
 * page code works unchanged:
 *     google.script.run.withSuccessHandler(ok).withFailureHandler(fail).someServerFunction(a, b)
 *
 * Requests are sent as text/plain POST ("simple" CORS request, no preflight),
 * which is what Apps Script web apps support.
 */
(function () {
  'use strict';
  var cfg = window.AKTIVO_CONFIG || {};
  var TIMEOUT_MS = 45000;

  /* ---------- Clickjacking guard: dashboard & presenter must not be framed ---------- */
  var page = document.documentElement.getAttribute('data-page');
  if (window.top !== window.self && page !== 'index') {
    try { window.top.location.replace(window.self.location.href); }
    catch (e) { document.documentElement.style.display = 'none'; }
  }

  /* ---------- Site URLs (computed from where the site is hosted) ---------- */
  var base = location.href.split('#')[0].split('?')[0].replace(/[^\/]*$/, '');
  window.AK_SITE = {
    base: base,
    home: base,
    host: function (sessionId) { return base + 'host.html' + (sessionId ? '?s=' + encodeURIComponent(sessionId) : ''); },
    presenter: function (sessionId) { return base + 'presenter.html' + (sessionId ? '?s=' + encodeURIComponent(sessionId) : ''); },
    join: function (code) { return base + (code ? '?code=' + encodeURIComponent(code) : ''); }
  };

  // Logo used by akSetLogo() (the Apps Script version used a base64 constant)
  window.AKTIVO_LOGO_DATA_URI = 'logo.png';

  /* ---------- Transport ---------- */
  function call(fn, args, ok, fail) {
    var done = false;
    var finish = function (cb, val) { if (done) return; done = true; if (cb) cb(val); };
    if (!cfg.API_URL || !/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/.test(cfg.API_URL)) {
      setTimeout(function () { finish(fail, new Error('CONFIG: API_URL in config.js is missing or is not an Apps Script /exec URL.')); }, 0);
      return;
    }
    var ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    var timer = setTimeout(function () {
      if (ctrl) ctrl.abort();
      finish(fail, new Error('TIMEOUT: The server took too long to respond.'));
    }, TIMEOUT_MS);

    fetch(cfg.API_URL, {
      method: 'POST',
      redirect: 'follow',
      cache: 'no-store',
      credentials: 'omit',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ fn: fn, args: args }),
      signal: ctrl ? ctrl.signal : undefined
    })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP_' + r.status);
        return r.text();
      })
      .then(function (text) {
        clearTimeout(timer);
        var res;
        try { res = JSON.parse(text); }
        catch (e) {
          // Apps Script returns an HTML page when the deployment is not public or the URL is wrong.
          throw new Error('BAD_RESPONSE: The server did not return JSON. Check that the Apps Script deployment is shared with "Anyone".');
        }
        if (res && res.ok) finish(ok, res.result);
        else finish(fail, new Error((res && res.error) || 'Server error'));
      })
      .catch(function (err) {
        clearTimeout(timer);
        finish(fail, err instanceof Error ? err : new Error(String(err)));
      });
  }

  function runner(ok, fail) {
    return new Proxy({}, {
      get: function (_, name) {
        if (name === 'withSuccessHandler') return function (f) { return runner(f, fail); };
        if (name === 'withFailureHandler') return function (f) { return runner(ok, f); };
        if (typeof name !== 'string') return undefined;
        return function () {
          var args = Array.prototype.slice.call(arguments).map(function (a) { return a === undefined ? null : a; });
          call(name, args, ok, fail);
        };
      }
    });
  }

  window.google = window.google || {};
  window.google.script = { run: runner(null, null) };

  /* ---------- Setup diagnostics: tells the site owner exactly what is wrong ---------- */
  var shown = {};
  function setupBanner(key, title, detail) {
    if (shown[key]) return;
    shown[key] = true;
    var show = function () {
      var box = document.getElementById('ak-setup-banner');
      if (!box) {
        box = document.createElement('div');
        box.id = 'ak-setup-banner';
        box.setAttribute('role', 'alert');
        box.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:2147483000;max-width:760px;margin:0 auto;' +
          'padding:14px 16px;border-radius:14px;background:#fff4e5;color:#5c3500;border:1px solid #f5b971;' +
          'box-shadow:0 12px 30px rgba(0,0,0,.18);font:14px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif';
        document.body.appendChild(box);
      }
      var item = document.createElement('div');
      item.style.cssText = 'margin:4px 0';
      var b = document.createElement('b'); b.textContent = '\u26A0 ' + title;
      var d = document.createElement('div'); d.textContent = detail;
      item.appendChild(b); item.appendChild(d); box.appendChild(item);
    };
    if (document.body) show(); else document.addEventListener('DOMContentLoaded', show);
  }
  function fileName(url) { return String(url || '').split('#')[0].split('?')[0].split('/').pop(); }
  var missing = [];
  function missingFile(url) {
    var name = fileName(url);
    if (!name || missing.indexOf(name) >= 0) return;
    missing.push(name);
    var detail = 'Unggah SEMUA file dari paket AKTIVO ke folder utama repository (folder yang sama dengan index.html), tunggu 1-2 menit, lalu muat ulang halaman dengan Ctrl+F5.';
    var el = document.getElementById('ak-missing-files');
    if (el) { el.textContent = '\u26A0 File tidak ditemukan: ' + missing.join(', '); return; }
    setupBanner('files', 'File tidak ditemukan: ' + name, detail);
    var mark = function () {
      var b = document.querySelector('#ak-setup-banner b');
      if (b && /File tidak ditemukan/.test(b.textContent)) { b.id = 'ak-missing-files'; b.textContent = '\u26A0 File tidak ditemukan: ' + missing.join(', '); }
    };
    if (document.body) mark(); else document.addEventListener('DOMContentLoaded', mark);
  }
  // Scripts/styles that fail to load after this point
  window.addEventListener('error', function (e) {
    var t = e.target;
    if (t && (t.tagName === 'SCRIPT' || t.tagName === 'LINK' || t.tagName === 'IMG') && (t.src || t.href)) {
      var url = t.src || t.href;
      if (url.indexOf(location.origin) === 0) missingFile(url);
    }
  }, true);
  // Files that were requested before this script ran
  window.addEventListener('load', function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      var l = links[i];
      if (l.href.indexOf(location.origin) !== 0) continue;
      // A missing file arrives as an empty sheet (the 404 page is not valid CSS), so check for rules.
      var rules = 0;
      try { rules = l.sheet && l.sheet.cssRules ? l.sheet.cssRules.length : 0; } catch (e) { rules = 1; }
      if (!rules) missingFile(l.href);
    }
    if (!document.documentElement.getAttribute('data-theme')) missingFile('theme.js');
  });
  if (!window.AKTIVO_CONFIG) missingFile('config.js');

  function backendProblem(err) {
    var msg = String((err && err.message) || err || '');
    if (/^CONFIG/.test(msg)) {
      setupBanner('backend', 'Alamat backend belum benar',
        'Buka config.js dan isi API_URL dengan URL Web app Apps Script yang berakhiran /exec.');
    } else if (/^BAD_RESPONSE|UNKNOWN_FUNCTION/.test(msg)) {
      setupBanner('backend', 'Backend Apps Script belum versi terbaru',
        'Tempel Code.gs yang baru di Apps Script, lalu Deploy > Manage deployments > Edit > Version: New version > Deploy (akses: Anyone). Tes: buka URL /exec?ping, harus muncul "ok":true.');
    } else if (/Failed to fetch|NetworkError|Load failed|HTTP_|TIMEOUT/.test(msg)) {
      setupBanner('backend', 'Tidak dapat menghubungi backend',
        'Periksa koneksi internet. Jika internet normal: pastikan Code.gs terbaru sudah di-deploy sebagai "New version" dengan akses "Anyone", dan API_URL di config.js sama dengan URL /exec tersebut.');
    }
  }

  /* Public config from the server (e.g. whether registration needs an invitation code).
     Also serves as the backend health check. Cached per tab; concurrent callers share one request. */
  var pending = null;
  window.akPublicConfig = function (cb) {
    cb = cb || function () {};
    var cached = null;
    try { cached = JSON.parse(sessionStorage.getItem('aktivo_public_config') || 'null'); } catch (e) {}
    if (cached) { cb(cached); return; }
    if (pending) { pending.push(cb); return; }
    pending = [cb];
    call('getPublicConfig', [], function (res) {
      try { sessionStorage.setItem('aktivo_public_config', JSON.stringify(res || {})); } catch (e) {}
      var list = pending; pending = null;
      list.forEach(function (f) { f(res || {}); });
    }, function (err) {
      backendProblem(err);
      var list = pending; pending = null;
      list.forEach(function (f) { f({}); });
    });
  };
  window.akBackendProblem = backendProblem;
  // Check the backend on every page load (one small, cached request).
  window.addEventListener('load', function () { window.akPublicConfig(); });
})();
