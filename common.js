  /* =====================================================================
     ICONS (inline SVG, Lucide-style strokes — no external requests)
     ===================================================================== */
  var AK_ICONS = {
    'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    'moon': '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
    'plus': '<path d="M12 5v14M5 12h14"/>',
    'arrow-right': '<path d="M5 12h14M13 6l6 6-6 6"/>',
    'arrow-left': '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    'arrow-up': '<path d="m5 12 7-7 7 7M12 19V5"/>',
    'chevron-up': '<path d="m18 15-6-6-6 6"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'chevron-left': '<path d="m15 18-6-6 6-6"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'x': '<path d="M18 6 6 18M6 6l12 12"/>',
    'check': '<path d="M20 6 9 17l-5-5"/>',
    'check-circle': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    'alert': '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/>',
    'info': '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    'bar-chart': '<path d="M3 3v18h18"/><path d="M8 17v-6M13 17V7M18 17v-4"/>',
    'cloud': '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"/>',
    'message': '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    'help': '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>',
    'sliders': '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    'list-ordered': '<path d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>',
    'type': '<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',
    'trophy': '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2z"/>',
    'users': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    'user': '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    'play': '<path d="m7 4 13 8-13 8z"/>',
    'edit': '<path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    'copy': '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
    'trash': '<path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
    'download': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
    'sheet': '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/>',
    'qr': '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v.01M14 20h.01M17 20h4v-3"/>',
    'timer': '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M10 2h4"/>',
    'shuffle': '<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
    'maximize': '<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>',
    'minimize': '<path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3"/>',
    'eye': '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    'eye-off': '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a13.2 13.2 0 0 1-1.67 2.68M6.61 6.61A13.5 13.5 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.39-1.61M2 2l20 20"/>',
    'lock': '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    'unlock': '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
    'log-out': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    'log-in': '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>',
    'settings': '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    'link': '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    'search': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
    'refresh': '<path d="M21 12a9 9 0 1 1-2.64-6.36L21 8M21 3v5h-5"/>',
    'grid': '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>',
    'layers': '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
    'key': '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
    'shield': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    'zap': '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
    'sparkles': '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
    'smartphone': '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
    'monitor': '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    'smile': '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
    'menu': '<path d="M3 6h18M3 12h18M3 18h18"/>',
    'activity': '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    'graduation': '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    'briefcase': '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    'refresh-cw': '<path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>',
    'clipboard': '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>',
    'mail': '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    'more': '<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>',
    'keyboard': '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M6 9h.01M10 9h.01M14 9h.01M18 9h.01M7 15h10"/>',
    'whatsapp': '<path d="M21 11.5a8.4 8.4 0 0 1-12.5 7.4L3 21l2.1-5.4A8.5 8.5 0 1 1 21 11.5z"/>',
    'flag': '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>',
    'pause': '<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>'
  };

  function akIcon(name, size, cls) {
    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var s = String(size || 18);
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', s); svg.setAttribute('height', s);
    svg.setAttribute('fill', 'none'); svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2'); svg.setAttribute('stroke-linecap', 'round'); svg.setAttribute('stroke-linejoin', 'round');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', 'ic' + (cls ? ' ' + cls : ''));
    svg.innerHTML = AK_ICONS[name] || '';
    return svg;
  }

  /* Slide types shown across the app */
  var AK_TYPES = {
    poll: { label: 'Pilihan Ganda', icon: 'bar-chart', color: 'var(--c1)', desc: 'Peserta memilih dari beberapa opsi. Hasilnya tampil sebagai grafik langsung.' },
    multiplechoice: { label: 'Kuis', icon: 'check-circle', color: 'var(--c2)', desc: 'Soal dengan jawaban benar, hitung mundur opsional, dan poin untuk kecepatan.' },
    wordcloud: { label: 'Awan Kata', icon: 'cloud', color: 'var(--c5)', desc: 'Jawaban singkat tampil makin besar jika makin sering dikirim.' },
    writing: { label: 'Jawaban Terbuka', icon: 'message', color: 'var(--c3)', desc: 'Jawaban bebas yang tampil sebagai kartu warna-warni.' },
    qna: { label: 'Tanya Jawab', icon: 'help', color: 'var(--c4)', desc: 'Peserta mengajukan pertanyaan dan mendukung pertanyaan terbaik.' },
    scales: { label: 'Skala', icon: 'sliders', color: 'var(--c6)', desc: 'Menilai pernyataan pada skala — cocok untuk umpan balik dan refleksi diri.' },
    ranking: { label: 'Pemeringkatan', icon: 'list-ordered', color: 'var(--c7)', desc: 'Peserta mengurutkan pilihan sesuai prioritas; urutan kelompok dihitung otomatis.' },
    announcement: { label: 'Konten', icon: 'type', color: 'var(--c8)', desc: 'Judul dan teks: instruksi, agenda, atau poin penting.' },
    leaderboard: { label: 'Papan Skor', icon: 'trophy', color: 'var(--c4)', desc: 'Menampilkan peraih poin kuis tertinggi — letakkan setelah soal-soal kuis.' }
  };
  var AK_TYPE_ORDER = ['poll', 'multiplechoice', 'wordcloud', 'writing', 'qna', 'scales', 'ranking', 'announcement', 'leaderboard'];
  var AK_PALETTE = ['var(--c1)', 'var(--c2)', 'var(--c3)', 'var(--c4)', 'var(--c5)', 'var(--c6)', 'var(--c7)', 'var(--c8)', 'var(--c9)', 'var(--c10)'];
  var AK_NOTE_COLORS = ['#ffd6de', '#d8f5c4', '#bfeedd', '#d6dcfa', '#ffe2c8', '#ecdcfb', '#cdeffa', '#fff1a8'];
  var AK_REACTIONS = { heart: '\u2764\uFE0F', like: '\u{1F44D}', laugh: '\u{1F602}', wow: '\u{1F62E}', clap: '\u{1F44F}', question: '\u2753' };

  function akColor(i) { return AK_PALETTE[i % AK_PALETTE.length]; }
  function akTypePill(type) {
    var t = AK_TYPES[type] || { label: type, icon: 'layers', color: 'var(--c8)' };
    var el = mk('span', { class: 'type-pill', style: '--tc:' + t.color }, [akIcon(t.icon, 14), t.label]);
    return el;
  }

  /* =====================================================================
     DOM helper (textContent everywhere → no XSS from user data)
     ===================================================================== */
  function mk(tag, props, children) {
    var n = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        var v = props[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') n.className = v;
        else if (k === 'text') n.textContent = v;
        else if (k === 'style') n.style.cssText = v;
        else if (k === 'value') n.value = v;
        else if (k.indexOf('on') === 0 && typeof v === 'function') n.addEventListener(k.slice(2), v);
        else if (v === true) n.setAttribute(k, '');
        else n.setAttribute(k, v);
      });
    }
    [].concat(children === undefined ? [] : children).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      n.appendChild((typeof c === 'string' || typeof c === 'number') ? document.createTextNode(String(c)) : c);
    });
    return n;
  }
  function akClear(el) { while (el && el.firstChild) el.removeChild(el.firstChild); return el; }
  function $id(id) { return document.getElementById(id); }

  function akAppData(key) {
    // Values that used to come from the Apps Script template now come from the URL.
    var q = new URLSearchParams(location.search);
    if (key === 'code') return (q.get('code') || '').replace(/[^0-9A-Za-z]/g, '').slice(0, 20);
    if (key === 'session') return (q.get('s') || '').replace(/[^0-9A-Za-z]/g, '').slice(0, 40);
    if (key === 'app-url') return window.AK_SITE ? AK_SITE.home : '';
    return '';
  }

  /* =====================================================================
     Storage (never throws — some browsers block storage in iframes)
     ===================================================================== */
  var akStore = {
    get: function (k, local) { try { return (local ? window.localStorage : window.sessionStorage).getItem('aktivo_' + k); } catch (e) { return null; } },
    set: function (k, v, local) {
      try {
        var s = local ? window.localStorage : window.sessionStorage;
        if (v === null || v === undefined) s.removeItem('aktivo_' + k); else s.setItem('aktivo_' + k, String(v));
      } catch (e) { /* ignore */ }
    }
  };

  /* =====================================================================
     Server calls
     ===================================================================== */
  function akCall(fn, args, onOk, onErr) {
    try {
      var runner = google.script.run
        .withSuccessHandler(function (res) { if (onOk) onOk(res); })
        .withFailureHandler(function (err) {
          var msg = (err && err.message) ? err.message : String(err);
          var isAuth = /SESSION_[A-Z]+|FORBIDDEN/.test(msg);
          if (isAuth && typeof window.akOnAuthError === 'function') window.akOnAuthError(msg);
          if (onErr) onErr(msg, isAuth);
          else if (!isAuth) akToast(akErrorText(msg), 'error');
        });
      runner[fn].apply(runner, args || []);
    } catch (e) {
      if (onErr) onErr(String(e), false);
    }
  }

  function akErrorText(msg) {
    msg = String(msg || '');
    if (/NOT_FOUND/.test(msg)) return 'Data tersebut sudah tidak ada.';
    if (/^(CONFIG|BAD_RESPONSE|TIMEOUT)/.test(msg)) return msg.replace(/^[A-Z_]+:\s*/, '');
    if (/Failed to fetch|NetworkError|Load failed|HTTP_/.test(msg)) return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
    return 'Terjadi kesalahan. Silakan coba lagi.';
  }

  function akBusy(btn, busy, text) {
    if (!btn) return;
    if (busy) {
      if (btn._akBusy) return;
      btn._akBusy = true;
      btn._akHtml = btn.innerHTML;
      btn.disabled = true;
      akClear(btn);
      btn.appendChild(mk('span', { class: 'spinner' }));
      if (text) btn.appendChild(document.createTextNode(text));
    } else {
      if (!btn._akBusy) return;
      btn._akBusy = false;
      btn.disabled = false;
      btn.innerHTML = btn._akHtml;
    }
  }

  /* Visibility-aware polling: never overlaps requests, slows down in background tabs. */
  function akPoller(task, interval) {
    var api = { interval: interval, stopped: false };
    var timer = null, inflight = false, startedAt = 0;
    function schedule(ms) { clearTimeout(timer); if (!api.stopped) timer = setTimeout(tick, ms); }
    function tick() {
      if (api.stopped) return;
      if (inflight && Date.now() - startedAt < 25000) { schedule(api.interval); return; }
      inflight = true; startedAt = Date.now();
      var finished = false;
      task(function () {
        if (finished) return; finished = true;
        inflight = false;
        schedule(document.hidden ? api.interval * (api.hiddenFactor || 4) : api.interval);
      });
    }
    api.now = function () { if (api.stopped) return; if (inflight) { schedule(300); return; } clearTimeout(timer); tick(); };
    api.stop = function () { api.stopped = true; clearTimeout(timer); };
    document.addEventListener('visibilitychange', function () { if (!document.hidden && !api.stopped) api.now(); });
    schedule(0);
    return api;
  }

  /* Server clock offset — keeps countdowns in sync across devices */
  var akClock = {
    offset: 0,
    sync: function (serverNow) { if (serverNow) this.offset = Number(serverNow) - Date.now(); },
    now: function () { return Date.now() + this.offset; }
  };

  /* =====================================================================
     Modal, alert, confirm, toast
     ===================================================================== */
  function akModal(opts) {
    opts = opts || {};
    var backdrop = mk('div', { class: 'ak-modal-backdrop' });
    var box = mk('div', { class: 'ak-modal' + (opts.size ? ' ' + opts.size : '') + (opts.dialog ? ' dialog' : '') + (opts.tone ? ' tone-' + opts.tone : ''), role: opts.dialog ? 'alertdialog' : 'dialog', 'aria-modal': 'true' });
    var closed = false;
    function close() {
      if (closed) return; closed = true;
      backdrop.classList.add('closing');
      document.removeEventListener('keydown', onKey, true);
      setTimeout(function () { if (backdrop.parentNode) backdrop.parentNode.removeChild(backdrop); }, 180);
      if (opts.onClose) opts.onClose();
    }
    function onKey(e) { if (e.key === 'Escape' && opts.dismissible !== false) { e.stopPropagation(); close(); } }
    if (opts.dismissible !== false) {
      box.appendChild(mk('button', { class: 'icon-btn sm ak-modal-x', 'aria-label': 'Tutup', onclick: close }, [akIcon('x', 18)]));
      backdrop.addEventListener('mousedown', function (e) { if (e.target === backdrop) close(); });
    }
    if (opts.icon) box.appendChild(mk('div', { class: 'ak-modal-icon' + (opts.danger ? ' danger' : opts.tone ? ' ' + opts.tone : '') }, [akIcon(opts.icon, opts.dialog ? 32 : 26)]));
    if (opts.title) box.appendChild(mk('h3', { text: opts.title }));
    if (opts.message) box.appendChild(mk('p', { class: 'ak-modal-msg', text: opts.message }));
    if (opts.body) box.appendChild(opts.body);
    if (opts.actions && opts.actions.length) {
      var actions = mk('div', { class: 'ak-modal-actions' });
      opts.actions.forEach(function (a) {
        var b;
        if (a.href) b = mk('a', { class: 'btn ' + (a.kind || 'btn-primary'), href: a.href, target: '_blank', rel: 'noopener noreferrer', text: a.label, onclick: function () { close(); } });
        else b = mk('button', { class: 'btn ' + (a.kind || 'btn-primary'), type: 'button', text: a.label, onclick: function () { if (a.onClick && a.onClick(b) === false) return; close(); } });
        actions.appendChild(b);
      });
      box.appendChild(actions);
    }
    backdrop.appendChild(box);
    document.body.appendChild(backdrop);
    document.addEventListener('keydown', onKey, true);
    setTimeout(function () {
      var f = box.querySelector('[autofocus]') || box.querySelector('.ak-modal-actions .btn:last-child');
      if (f && f.focus) f.focus();
    }, 40);
    return { close: close, el: box };
  }

  function akAlert(title, message, okText, onClose, icon) {
    var tone = icon === 'alert' ? 'danger' : icon === 'check-circle' ? 'success' : null;
    return akModal({ dialog: true, tone: tone, title: title, message: message, icon: icon || 'info', onClose: onClose, actions: [{ label: okText || 'OK', kind: 'btn-primary' }] });
  }

  function akConfirm(o) {
    return akModal({
      dialog: true, tone: o.danger ? 'danger' : o.tone,
      title: o.title || 'Anda yakin?', message: o.message, icon: o.icon || (o.danger ? 'alert' : 'help'), danger: o.danger, body: o.body,
      onClose: o.onClose,
      actions: [
        { label: o.cancelText || 'Batal', kind: 'btn-secondary', onClick: function () { if (o.onCancel) o.onCancel(); } },
        { label: o.confirmText || 'Ya, lanjutkan', kind: o.danger ? 'btn-solid-danger' : 'btn-primary', onClick: function () { if (o.onConfirm) o.onConfirm(); } }
      ]
    });
  }

  // A link the user clicks directly (window.open from async callbacks is blocked by pop-up blockers).
  function akLinkDialog(title, message, url, linkText) {
    return akModal({ dialog: true, tone: 'success', title: title, message: message, icon: 'check-circle', actions: [{ label: 'Tutup', kind: 'btn-secondary' }, { label: linkText || 'Buka', href: url }] });
  }

  var AK_TOAST_TITLES = { success: 'Berhasil', error: 'Terjadi kesalahan', warning: 'Perhatian', info: 'Info' };
  function akToast(message, kind, ms) {
    var wrap = $id('ak-toasts');
    if (!wrap) return;
    kind = AK_TOAST_TITLES[kind] ? kind : 'info';
    var icon = kind === 'error' ? 'alert' : kind === 'success' ? 'check-circle' : kind === 'warning' ? 'alert' : 'info';
    var bar = mk('span', { class: 't-bar', style: 'animation-duration:' + (ms || 3200) + 'ms' });
    var el = mk('div', { class: 'ak-toast ' + kind, role: kind === 'error' ? 'alert' : 'status' }, [
      mk('span', { class: 't-ic' }, [akIcon(icon, 18)]),
      mk('div', { class: 't-body' }, [mk('div', { class: 't-title', text: AK_TOAST_TITLES[kind] }), mk('div', { class: 't-msg', text: message })]),
      mk('button', { class: 't-x', type: 'button', 'aria-label': 'Tutup notifikasi' }, [akIcon('x', 15)]),
      bar
    ]);
    var gone = false;
    var dismiss = function () {
      if (gone) return; gone = true;
      el.classList.add('out');
      setTimeout(function () { if (el.parentNode) wrap.removeChild(el); }, 280);
    };
    el.querySelector('.t-x').addEventListener('click', dismiss);
    var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) setTimeout(dismiss, ms || 3200);
    else bar.addEventListener('animationend', dismiss);       // bar pauses while hovered, so the toast stays
    while (wrap.children.length >= 4) wrap.removeChild(wrap.firstChild);
    wrap.appendChild(el);
  }

  function akCopy(text, okMsg) {
    var done = function () { akToast(okMsg || 'Berhasil disalin', 'success'); };
    var fallback = function () {
      var ta = mk('textarea', { style: 'position:fixed;left:-9999px;top:0' });
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { akToast('Tekan Ctrl+C untuk menyalin', 'info'); }
      document.body.removeChild(ta);
    };
    try { navigator.clipboard.writeText(text).then(done, fallback); } catch (e) { fallback(); }
  }

  /* =====================================================================
     Theme toggle (dark / light slider)
     ===================================================================== */
  function akSetTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    akStore.set('theme', t, true);
    document.querySelectorAll('.theme-switch').forEach(function (b) {
      b.setAttribute('aria-checked', t === 'dark' ? 'true' : 'false');
    });
  }
  function akThemeSwitch() {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    var thumb = mk('span', { class: 'ts-thumb' }, [akIcon('sun', 14, 'ts-sun'), akIcon('moon', 14, 'ts-moon')]);
    return mk('button', {
      class: 'theme-switch', type: 'button', role: 'switch', 'aria-checked': dark ? 'true' : 'false', 'aria-label': 'Mode gelap', title: 'Ganti mode gelap / terang',
      onclick: function () { akSetTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); }
    }, [mk('span', { class: 'ts-track' }, [mk('i', { class: 'ts-star s1' }), mk('i', { class: 'ts-star s2' }), mk('i', { class: 'ts-star s3' }), thumb])]);
  }
  function akMountTheme(id) { var el = $id(id); if (el) el.appendChild(akThemeSwitch()); }

  function akSetLogo(ids) {
    if (typeof AKTIVO_LOGO_DATA_URI === 'undefined') return;
    ids.forEach(function (id) { var el = $id(id); if (el) el.src = AKTIVO_LOGO_DATA_URI; });
  }

  /* =====================================================================
     Formatting
     ===================================================================== */
  function akFmt(n) { return Number(n || 0).toLocaleString('id-ID'); }
  function akMMSS(ms) {
    var s = Math.max(0, Math.ceil(ms / 1000));
    var m = Math.floor(s / 60);
    return m + ':' + String(s % 60).padStart(2, '0');
  }
  function akAgo(iso) {
    var d = new Date(iso);
    if (!iso || isNaN(d)) return '';
    var s = Math.round((Date.now() - d.getTime()) / 1000);
    if (s < 60) return 'baru saja';
    if (s < 3600) return Math.floor(s / 60) + ' menit lalu';
    if (s < 86400) return Math.floor(s / 3600) + ' jam lalu';
    if (s < 604800) return Math.floor(s / 86400) + ' hari lalu';
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  function akHash(str) {
    var h = 0; str = String(str || '');
    for (var i = 0; i < str.length; i++) { h = ((h << 5) - h) + str.charCodeAt(i); h |= 0; }
    return Math.abs(h);
  }

  /* =====================================================================
     Result renderers — update in place so live changes animate smoothly
     ===================================================================== */
  function akBarsInto(el, results, opts) {
    opts = opts || {};
    results = results || [];
    var sig = results.map(function (r) { return r.option; }).join('\u0001');
    var rebuilt = false;
    if (el._akSig !== sig) {
      el._akSig = sig; rebuilt = true;
      akClear(el);
      el.className = 'bars' + (opts.large ? ' bars-lg' : '');
      el._akRows = results.map(function (r, i) {
        var fill = mk('div', { class: 'bar-fill', style: 'background:' + akColor(i) });
        var count = mk('span', { class: 'bar-count' });
        var label = mk('span', { text: r.option });
        var row = mk('div', { class: 'bar-row' }, [mk('div', { class: 'bar-head' }, [label, count]), mk('div', { class: 'bar-track' }, [fill])]);
        el.appendChild(row);
        return { row: row, fill: fill, count: count, label: label };
      });
    }
    var apply = function () {
      results.forEach(function (r, i) {
        var x = el._akRows[i]; if (!x) return;
        x.fill.style.width = (r.percent || 0) + '%';
        x.count.textContent = (r.count !== undefined ? akFmt(r.count) + ' \u00B7 ' : '') + (r.percent || 0) + '%';
        var reveal = !!opts.showCorrect;
        x.row.classList.toggle('is-correct', reveal && !!r.isCorrect);
        x.row.classList.toggle('is-wrong', reveal && !r.isCorrect);
        x.label.textContent = (reveal && r.isCorrect ? '\u2714 ' : '') + r.option;
      });
    };
    if (rebuilt) requestAnimationFrame(function () { requestAnimationFrame(apply); }); else apply();
  }

  function akColumnsInto(el, results, opts) {
    opts = opts || {};
    results = results || [];
    var sig = results.map(function (r) { return r.option; }).join('\u0001');
    var rebuilt = false;
    if (el._akSig !== sig) {
      el._akSig = sig; rebuilt = true;
      akClear(el);
      el.className = 'cols';
      el._akCols = results.map(function (r, i) {
        var val = mk('div', { class: 'col-val' });
        var bar = mk('div', { class: 'col-bar', style: 'background:' + akColor(i) });
        var label = mk('div', { class: 'col-label' }, [mk('span', { text: r.option })]);
        var col = mk('div', { class: 'col' }, [val, mk('div', { class: 'col-bar-wrap' }, [bar]), label]);
        el.appendChild(col);
        return { col: col, val: val, bar: bar, label: label };
      });
    }
    var max = results.reduce(function (m, r) { return Math.max(m, r.count || 0); }, 0);
    var apply = function () {
      results.forEach(function (r, i) {
        var x = el._akCols[i]; if (!x) return;
        x.bar.style.height = (max ? Math.max(2, (r.count / max) * 100) : 2) + '%';
        akClear(x.val);
        x.val.appendChild(document.createTextNode(opts.percent ? (r.percent + '%') : akFmt(r.count)));
        if (!opts.percent && opts.showPercent !== false) x.val.appendChild(mk('small', { text: r.percent + '%' }));
        var reveal = !!opts.showCorrect;
        x.col.classList.toggle('is-correct', reveal && !!r.isCorrect);
        x.col.classList.toggle('is-wrong', reveal && !r.isCorrect);
      });
    };
    if (rebuilt) requestAnimationFrame(function () { requestAnimationFrame(apply); }); else apply();
  }

  function akCloudInto(el, words, opts) {
    opts = opts || {};
    words = words || [];
    var sig = JSON.stringify(words) + (opts.large ? 'L' : 'S');
    if (el._akSig === sig) return;
    el._akSig = sig;
    var seen = el._akSeen || {};
    var next = {};
    akClear(el);
    el.className = 'cloud';
    var min = opts.large ? 22 : 15, span = opts.large ? 70 : 26;
    var max = words.length ? words[0].count : 1;
    var sorted = words.slice().sort(function (a, b) { return akHash(a.word) - akHash(b.word); });
    sorted.forEach(function (w) {
      var size = min + Math.round(Math.sqrt(w.count / max) * span);
      var color = AK_PALETTE[akHash(w.word) % AK_PALETTE.length];
      el.appendChild(mk('span', { class: 'cloud-word' + (seen[w.word] ? '' : ' pop'), title: w.count + '\u00D7', style: 'font-size:' + size + 'px;color:' + color }, [w.word]));
      next[w.word] = true;
    });
    el._akSeen = next;
  }

  function akScalesInto(el, rows, cfg, opts) {
    opts = opts || {}; cfg = cfg || { min: 1, max: 5 };
    rows = rows || [];
    var sig = rows.map(function (r) { return r.statement; }).join('\u0001');
    var rebuilt = false;
    if (el._akSig !== sig) {
      el._akSig = sig; rebuilt = true;
      akClear(el);
      el.className = 'scales' + (opts.large ? ' lg' : '');
      el._akRows = rows.map(function (r, i) {
        var avg = mk('span', { class: 'scale-avg' });
        var fill = mk('div', { class: 'scale-fill' });
        var dot = mk('div', { class: 'scale-dot', style: 'left:0%' });
        var row = mk('div', { class: 'scale-row', style: '--sc:' + akColor(i) }, [
          mk('div', { class: 'scale-label' }, [mk('span', { text: r.statement }), avg]),
          mk('div', { class: 'scale-line' }, [fill, dot]),
          mk('div', { class: 'scale-ends' }, [mk('span', { text: cfg.min + ' \u00B7 ' + (cfg.minLabel || '') }), mk('span', { text: (cfg.maxLabel || '') + ' \u00B7 ' + cfg.max })])
        ]);
        el.appendChild(row);
        return { avg: avg, fill: fill, dot: dot };
      });
    }
    var apply = function () {
      rows.forEach(function (r, i) {
        var x = el._akRows[i]; if (!x) return;
        var pct = r.avg === null ? 0 : ((r.avg - cfg.min) / Math.max(1, cfg.max - cfg.min)) * 100;
        x.fill.style.width = pct + '%';
        x.dot.style.left = pct + '%';
        x.dot.style.opacity = r.avg === null ? '0' : '1';
        x.avg.textContent = r.avg === null ? '\u2013' : r.avg + ' (' + r.count + ')';
      });
    };
    if (rebuilt) requestAnimationFrame(function () { requestAnimationFrame(apply); }); else apply();
  }

  function akRankingInto(el, rows, opts) {
    opts = opts || {};
    rows = rows || [];
    var sig = JSON.stringify(rows);
    if (el._akSig === sig) return;
    var first = !el._akSig;
    el._akSig = sig;
    akClear(el);
    el.className = 'rank-list' + (opts.large ? ' lg' : '');
    rows.forEach(function (r, i) {
      var fill = mk('div', { class: 'bar-fill', style: 'background:' + akColor(i) + ';width:' + (first ? 0 : r.percent) + '%' });
      el.appendChild(mk('div', { class: 'rank-row' }, [
        mk('div', { class: 'rank-pos', text: String(i + 1) }),
        mk('div', null, [
          mk('div', { class: 'bar-head' }, [mk('span', { text: r.option }), mk('span', { class: 'bar-count', text: akFmt(r.score) + ' poin' })]),
          mk('div', { class: 'bar-track' }, [fill])
        ])
      ]));
      if (first) requestAnimationFrame(function () { requestAnimationFrame(function () { fill.style.width = r.percent + '%'; }); });
    });
  }

  function akLeaderboardInto(el, lb, opts) {
    opts = opts || {};
    var rows = (lb && lb.rows) || [];
    var sig = JSON.stringify(rows) + JSON.stringify(lb && lb.me);
    if (el._akSig === sig) return;
    el._akSig = sig;
    akClear(el);
    if (!rows.length) {
      el.appendChild(mk('div', { class: 'empty' }, [mk('div', { class: 'empty-ic' }, [akIcon('trophy', 30)]), mk('h3', { text: 'Belum ada skor' }), mk('p', { text: 'Poin akan muncul setelah peserta menjawab soal kuis.' })]));
      return;
    }
    if (opts.podium) {
      var pod = mk('div', { class: 'podium' });
      [1, 0, 2].forEach(function (idx) {
        var r = rows[idx];
        if (!r) { pod.appendChild(mk('div', { class: 'pod' })); return; }
        pod.appendChild(mk('div', { class: 'pod p' + (idx + 1) }, [
          mk('div', { class: 'pod-name', text: r.name }),
          mk('div', { class: 'pod-score', text: akFmt(r.score) + ' poin' }),
          mk('div', { class: 'pod-block', text: String(r.rank || idx + 1) })
        ]));
      });
      el.appendChild(pod);
    }
    var list = mk('div', { class: 'lb-list' });
    rows.slice(opts.podium ? 3 : 0).forEach(function (r, i) {
      list.appendChild(mk('div', { class: 'lb-row' + (r.isMe ? ' me' : ''), style: 'animation-delay:' + (i * 50) + 'ms' }, [
        mk('span', { class: 'lb-rank', text: '#' + r.rank }), mk('span', { class: 'lb-name', text: r.name }),
        mk('span', { class: 'faint small', text: r.correct + ' benar' }), mk('span', { class: 'lb-score', text: akFmt(r.score) })
      ]));
    });
    el.appendChild(list);
  }

  /* Countdown ring */
  function akRing(size, stroke) {
    size = size || 88; stroke = stroke || 8;
    var r = (size - stroke) / 2, c = 2 * Math.PI * r;
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', size); svg.setAttribute('height', size);
    var mkC = function (cls) {
      var ci = document.createElementNS(ns, 'circle');
      ci.setAttribute('cx', size / 2); ci.setAttribute('cy', size / 2); ci.setAttribute('r', r);
      ci.setAttribute('fill', 'none'); ci.setAttribute('stroke-width', stroke); ci.setAttribute('stroke-linecap', 'round');
      ci.setAttribute('class', cls); return ci;
    };
    var bg = mkC('ring-bg'), fg = mkC('ring-fg');
    fg.setAttribute('stroke-dasharray', c); fg.setAttribute('stroke-dashoffset', 0);
    svg.appendChild(bg); svg.appendChild(fg);
    var txt = mk('span', { class: 'ring-txt', style: 'font-size:' + Math.round(size * 0.34) + 'px' });
    var el = mk('div', { class: 'ring' }, [svg, txt]);
    return {
      el: el,
      set: function (frac, text) {
        frac = Math.max(0, Math.min(1, frac));
        fg.setAttribute('stroke-dashoffset', String(c * (1 - frac)));
        txt.textContent = text;
        el.classList.toggle('warn', frac <= 0.5 && frac > 0.2);
        el.classList.toggle('hot', frac <= 0.2);
      }
    };
  }

  function akConfetti(n) {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var colors = ['#0e9f8e', '#7c5cff', '#ff6b5b', '#f5a524', '#2b9bf4', '#ec4899', '#22c55e'];
    for (var i = 0; i < (n || 90); i++) {
      (function (i) {
        var c = mk('i', { class: 'confetti', style: 'left:' + (Math.random() * 100) + 'vw;background:' + colors[i % colors.length] + ';--dx:' + (Math.random() * 200 - 100) + 'px;animation-duration:' + (2.2 + Math.random() * 1.8) + 's;animation-delay:' + (Math.random() * .5) + 's' });
        document.body.appendChild(c);
        setTimeout(function () { if (c.parentNode) c.parentNode.removeChild(c); }, 4800);
      })(i);
    }
  }

  function akFloatReaction(layer, kind) {
    var emoji = AK_REACTIONS[kind]; if (!emoji || !layer) return;
    var el = mk('span', { class: 'rx', text: emoji, style: 'left:' + (20 + Math.random() * 180) + 'px;--dx:' + (Math.random() * 80 - 40) + 'px' });
    layer.appendChild(el);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 3300);
  }

  function akQr(el, text, size) {
    akClear(el);
    size = size || 180;
    if (!text) { el.appendChild(mk('div', { class: 'small muted', text: 'Link belum tersedia.' })); return; }
    var svg = '';
    try { svg = window.AkQR ? AkQR.svg(text, { level: 'M', quiet: size < 100 ? 0 : 1 }) : ''; } catch (e) { svg = ''; }
    if (!svg) { el.appendChild(mk('div', { class: 'small muted', text: 'QR code tidak tersedia.' })); return; }
    // The SVG is generated locally from booleans only (no user text inside), so innerHTML is safe here.
    var box = mk('div', { class: size < 100 ? 'qr-mini' : 'qr-box', style: 'width:' + (size < 100 ? size : size + 28) + 'px' });
    box.innerHTML = svg;
    el.appendChild(box);
  }

  /* =====================================================================
     Auth panel (log in / create account / presenter key)
     ===================================================================== */
  function akPasswordInput(id, placeholder, autocomplete) {
    var input = mk('input', { class: 'input', type: 'password', id: id, placeholder: placeholder || 'Kata sandi', autocomplete: autocomplete || 'current-password', maxlength: '128' });
    var eye = mk('button', { class: 'icon-btn sm', type: 'button', 'aria-label': 'Tampilkan kata sandi', tabindex: '-1' }, [akIcon('eye', 18)]);
    eye.addEventListener('click', function () {
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      akClear(eye); eye.appendChild(akIcon(show ? 'eye-off' : 'eye', 18));
    });
    return { wrap: mk('div', { class: 'input-wrap' }, [input, eye]), input: input };
  }

  function akPwStrength(pw) {
    var s = 0;
    if (pw.length >= 8) s++;
    if (pw.length >= 12) s++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
    if (!/[0-9]/.test(pw) || !/[A-Za-z]/.test(pw)) s = Math.min(s, 1);
    return pw ? Math.max(1, s) : 0;
  }

  function akAuthPanel(opts) {
    opts = opts || {};
    var tabs = opts.tabs || ['login', 'register'];
    var labels = { login: 'Masuk', register: 'Daftar akun', key: 'Kunci presenter' };
    var wrap = mk('div', { class: 'auth' });
    var seg = mk('div', { class: 'seg block', role: 'tablist' });
    var panes = {}, btns = {};
    tabs.forEach(function (t) {
      btns[t] = mk('button', { class: 'seg-btn', type: 'button', role: 'tab', text: labels[t], onclick: function () { show(t); } });
      seg.appendChild(btns[t]);
    });
    if (tabs.length > 1) wrap.appendChild(seg);

    function field(label, control, extra) {
      return mk('div', { class: 'field' }, [mk('label', { class: 'label', text: label }), control].concat(extra || []));
    }
    function onEnter(inputs, fn) { inputs.forEach(function (i) { i.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); fn(); } }); }); }

    // --- Log in
    if (tabs.indexOf('login') >= 0) {
      var lEmail = mk('input', { class: 'input', type: 'email', placeholder: 'nama@sekolah.sch.id', autocomplete: 'email', maxlength: '120' });
      var lPw = akPasswordInput('ak-login-pw');
      var lErr = mk('div', { class: 'field-error' });
      var lBtn = mk('button', { class: 'btn btn-primary btn-lg btn-block', type: 'button' }, [akIcon('log-in', 18), 'Masuk']);
      var doLogin = function () {
        lErr.textContent = '';
        if (!lEmail.value.trim() || !lPw.input.value) { lErr.textContent = 'Masukkan email dan kata sandi Anda.'; return; }
        akBusy(lBtn, true, 'Sedang masuk…');
        akCall('loginHost', [lEmail.value.trim(), lPw.input.value], function (res) {
          akBusy(lBtn, false);
          if (!res.success) { lErr.textContent = res.message; return; }
          akStore.set('host_token', res.token, true);
          lPw.input.value = '';
          if (opts.onSuccess) opts.onSuccess(res, 'host');
        }, function () { akBusy(lBtn, false); lErr.textContent = 'Koneksi bermasalah. Silakan coba lagi.'; });
      };
      lBtn.addEventListener('click', doLogin);
      onEnter([lEmail, lPw.input], doLogin);
      panes.login = mk('div', { class: 'auth-pane' }, [field('Email', lEmail), field('Kata sandi', lPw.wrap), lErr, lBtn]);
    }

    // --- Register
    if (tabs.indexOf('register') >= 0) {
      var rName = mk('input', { class: 'input', placeholder: 'mis. Dr. Siti Rahma, M.Pd.', autocomplete: 'name', maxlength: '80' });
      var rInst = mk('input', { class: 'input', placeholder: 'Sekolah, kampus, atau perusahaan', autocomplete: 'organization', maxlength: '120' });
      var rEmail = mk('input', { class: 'input', type: 'email', placeholder: 'nama@sekolah.sch.id', autocomplete: 'email', maxlength: '120' });
      var rPw = akPasswordInput('ak-reg-pw', 'Minimal 8 karakter', 'new-password');
      var rPw2 = akPasswordInput('ak-reg-pw2', 'Ulangi kata sandi', 'new-password');
      var meter = mk('div', { class: 'strength', 'data-s': '0' }, [mk('i'), mk('i'), mk('i'), mk('i')]);
      rPw.input.addEventListener('input', function () { meter.setAttribute('data-s', akPwStrength(rPw.input.value)); });
      var rInvite = mk('input', { class: 'input', placeholder: 'Kode undangan dari pengelola', autocomplete: 'off', maxlength: '64' });
      var rAgree = mk('input', { type: 'checkbox' });
      var rErr = mk('div', { class: 'field-error' });
      var rBtn = mk('button', { class: 'btn btn-primary btn-lg btn-block', type: 'button' }, [akIcon('sparkles', 18), 'Daftar akun']);
      var doRegister = function () {
        rErr.textContent = '';
        var pw = rPw.input.value;
        if (!rName.value.trim()) { rErr.textContent = 'Masukkan nama Anda.'; return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rEmail.value.trim())) { rErr.textContent = 'Masukkan alamat email yang valid.'; return; }
        if (pw.length < 8 || !/[A-Za-z]/.test(pw) || !/[0-9]/.test(pw)) { rErr.textContent = 'Kata sandi minimal 8 karakter dan berisi huruf serta angka.'; return; }
        if (pw !== rPw2.input.value) { rErr.textContent = 'Kata sandi tidak sama.'; return; }
        if (opts.inviteRequired && !rInvite.value.trim()) { rErr.textContent = 'Masukkan kode undangan.'; return; }
        if (!rAgree.checked) { rErr.textContent = 'Centang persetujuan untuk melanjutkan.'; return; }
        akBusy(rBtn, true, 'Membuat akun…');
        akCall('registerHost', [{ name: rName.value.trim(), institution: rInst.value.trim(), email: rEmail.value.trim(), password: pw, invite: rInvite.value.trim() }], function (res) {
          akBusy(rBtn, false);
          if (!res.success) { rErr.textContent = res.message; return; }
          akStore.set('host_token', res.token, true);
          rPw.input.value = ''; rPw2.input.value = '';
          if (opts.onSuccess) opts.onSuccess(res, 'host');
        }, function () { akBusy(rBtn, false); rErr.textContent = 'Koneksi bermasalah. Silakan coba lagi.'; });
      };
      rBtn.addEventListener('click', doRegister);
      var regChildren = [
        field('Nama lengkap (tampil ke peserta & di laporan)', rName),
        field('Institusi', rInst),
        field('Email', rEmail),
        mk('div', { class: 'grid-2' }, [field('Kata sandi', rPw.wrap, [meter]), field('Konfirmasi kata sandi', rPw2.wrap)])
      ];
      if (opts.inviteRequired) regChildren.push(field('Kode undangan', rInvite));
      regChildren.push(mk('label', { class: 'check-row' }, [rAgree, mk('span', { text: 'Saya akan menggunakan AKTIVO secara bertanggung jawab dan menjaga kerahasiaan data peserta sesuai kebijakan institusi saya.' })]));
      regChildren.push(rErr, rBtn);
      panes.register = mk('div', { class: 'auth-pane' }, regChildren);
    }

    // --- Presenter key
    if (tabs.indexOf('key') >= 0) {
      var kInput = mk('input', { class: 'input input-lg', type: 'password', placeholder: 'Kunci presenter', autocomplete: 'off', maxlength: '40', style: 'letter-spacing:.12em;text-transform:uppercase' });
      var kErr = mk('div', { class: 'field-error' });
      var kBtn = mk('button', { class: 'btn btn-primary btn-lg btn-block', type: 'button' }, [akIcon('key', 18), 'Buka tampilan presenter']);
      var doKey = function () {
        kErr.textContent = '';
        if (!kInput.value.trim()) { kErr.textContent = 'Masukkan kunci presenter.'; return; }
        akBusy(kBtn, true, 'Memeriksa…');
        akCall('presenterKeyLogin', [kInput.value.trim()], function (res) {
          akBusy(kBtn, false);
          if (!res.success) { kErr.textContent = res.message; return; }
          akStore.set('presenter_token', res.token, true);
          kInput.value = '';
          if (opts.onSuccess) opts.onSuccess(res, 'presenter');
        }, function () { akBusy(kBtn, false); kErr.textContent = 'Koneksi bermasalah. Silakan coba lagi.'; });
      };
      kBtn.addEventListener('click', doKey);
      onEnter([kInput], doKey);
      panes.key = mk('div', { class: 'auth-pane' }, [
        mk('p', { class: 'muted small', style: 'margin-bottom:14px', text: 'Gunakan di komputer kelas atau ruang rapat. Host dapat menemukan kunci ini di Pengaturan sesi.' }),
        field('Kunci presenter', kInput), kErr, kBtn
      ]);
    }

    var body = mk('div');
    wrap.appendChild(body);
    function show(t) {
      Object.keys(btns).forEach(function (k) { btns[k].classList.toggle('active', k === t); btns[k].setAttribute('aria-selected', k === t ? 'true' : 'false'); });
      akClear(body);
      body.appendChild(panes[t]);
      var f = panes[t].querySelector('input'); if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 30);
    }
    show(opts.initial && panes[opts.initial] ? opts.initial : tabs[0]);
    wrap.akShow = show;
    return wrap;
  }

  /* Navigate the top window (the app runs in an iframe). Returns false if blocked. */
  function akNavigate(url) {
    try { window.top.location.href = url; return true; } catch (e) { return false; }
  }
