var P = {
  token: null, kind: null, eventId: akAppData('session') || null, init: null, items: [], currentId: null,
  data: null, live: {}, rxSince: -1, hidden: false, poller: null, stageKey: null, btn: {}, lbShown: false,
  lockJoin: false, seenNotes: {}, quizView: null, ring: null, ticker: null, confettiFor: {}, idleTimer: null
};

akSetLogo(['logo-gate']);
akMountTheme('theme-gate');

window.akOnAuthError = function (msg) {
  if (!P.token) return;
  stopAll();
  akStore.set(P.kind === 'presenter' ? 'presenter_token' : 'host_token', null, true);
  P.token = null;
  showGate();
  akToast(/FORBIDDEN/.test(msg) ? 'Anda tidak memiliki akses ke sesi ini.' : 'Sesi login Anda telah berakhir. Silakan masuk kembali.', 'info', 4000);
};

function showGate() {
  $id('pres').hidden = true;
  $id('gate').hidden = false;
  akClear($id('gate-auth')).appendChild(akAuthPanel({
    tabs: ['login', 'key'], initial: P.eventId ? 'login' : 'key',
    onSuccess: function (res, kind) {
      P.token = res.token; P.kind = kind;
      if (kind === 'presenter') P.eventId = res.eventId;
      start();
    }
  }));
}

function stopAll() {
  if (P.poller) P.poller.stop();
  clearInterval(P.ticker);
}

/* ================= Start ================= */
function start() {
  if (!P.eventId && P.kind === 'host') {
    akAlert('Belum ada sesi yang dipilih', 'Buka tampilan presenter dari tombol Presentasikan di dasbor Anda.', 'Ke dasbor', function () { akNavigate(AK_SITE.host()); }, 'info');
    return;
  }
  akCall('getPresenterInit', [P.token, P.eventId], function (res) {
    res.joinUrl = AK_SITE.join(res.event.code);
    res.dashboardUrl = AK_SITE.host(res.event.id);
    P.init = res; P.eventId = res.event.id;
    P.items = res.items; P.live = res.live || {}; P.lockJoin = !!res.event.settings.lockJoin;
    $id('gate').hidden = true;
    $id('pres').hidden = false;
    $id('p-name').textContent = res.event.name;
    $id('p-fac').textContent = res.event.facilitator ? 'bersama ' + res.event.facilitator + (res.event.institution ? ' \u00B7 ' + res.event.institution : '') : '';
    $id('join-code').textContent = res.event.codeDisplay;
    document.title = res.event.name + ' — AKTIVO';
    akQr($id('mini-qr'), res.joinUrl, 48);
    buildBar();
    var cur = res.currentContentId && P.items.some(function (i) { return i.contentId === res.currentContentId && i.status !== 'draft'; }) ? res.currentContentId : null;
    if (!cur) { var first = P.items.find(function (i) { return i.status !== 'draft'; }); if (first) { goTo(first.contentId); } else renderEmpty(); }
    else { P.currentId = cur; renderLoading(); }
    P.poller = akPoller(pollTask, 2500);
    P.poller.hiddenFactor = 2;
    clearInterval(P.ticker);
    P.ticker = setInterval(tick, 200);
    if (res.event.status !== 'active') akToast('Sesi ini sedang ditutup — peserta tidak bisa bergabung. Buka sesi dari dasbor.', 'info', 5000);
  }, function (msg, auth) {
    if (auth) return;
    if (/NOT_FOUND/.test(msg)) akAlert('Sesi tidak ditemukan', 'Sesi ini mungkin sudah dihapus.', 'OK', null, 'alert');
    else akAlert('Gagal memuat', 'Periksa koneksi Anda lalu muat ulang halaman.', 'OK', null, 'alert');
  });
}

function pollTask(done) {
  if (!P.token) { done(); return; }
  var id = P.currentId;
  akCall('presenterPoll', [P.token, P.eventId, id, Math.max(0, P.rxSince)], function (d) {
    done();
    akClock.sync(d.now);
    P.live = d.live || {};
    P.lockJoin = !!d.lockJoin;
    updateItems(d.items || []);
    updateStats(d);
    handleReactions(d.reactions);
    updateLeaderboardOverlay(d.leaderboard);
    updateBarState();
    if (id === P.currentId) { P.data = d.data; render(d.data); }
  }, function () { done(); });
}

function updateItems(items) {
  var sig = JSON.stringify(items.map(function (i) { return [i.contentId, i.type, i.title, i.status]; }));
  P.items = items;
  if (sig !== P.itemsSig) { P.itemsSig = sig; updateBarState(); }
}

function updateStats(d) {
  var box = $id('p-stats');
  var sig = d.participantCount + '|' + d.onlineCount + '|' + d.lockJoin;
  if (box._sig === sig) return;
  box._sig = sig;
  akClear(box);
  box.appendChild(mk('span', { class: 'p-stat glass', title: 'Peserta bergabung' }, [akIcon('users', 17), akFmt(d.participantCount)]));
  box.appendChild(mk('span', { class: 'p-stat glass', title: 'Sedang online' }, [mk('span', { class: 'live-dot' }), akFmt(d.onlineCount)]));
  if (d.lockJoin) box.appendChild(mk('span', { class: 'p-stat glass', title: 'Pendaftaran dikunci', style: 'color:var(--warning)' }, [akIcon('lock', 16)]));
}

function handleReactions(rx) {
  if (!rx) return;
  if (P.rxSince < 0) { P.rxSince = rx.seq; return; }
  (rx.items || []).forEach(function (r, i) { setTimeout(function () { akFloatReaction($id('rx-layer'), r.e); }, i * 140); });
  P.rxSince = Math.max(P.rxSince, rx.seq);
}

/* ================= Navigation ================= */
function navigable() { return P.items.filter(function (i) { return i.status !== 'draft'; }); }

function goTo(cid) {
  if (!cid) return;
  P.currentId = cid; P.data = null; P.stageKey = null; P.hidden = false;
  renderLoading();
  updateBarState();
  akCall('presenterSetCurrent', [P.token, P.eventId, cid], function (res) {
    if (res && res.live) P.live = res.live;
    if (P.poller) P.poller.now();
  }, function () { if (P.poller) P.poller.now(); });
}

function step(delta) {
  var list = navigable();
  if (!list.length) return;
  var idx = list.findIndex(function (i) { return i.contentId === P.currentId; });
  var next = idx < 0 ? 0 : Math.max(0, Math.min(list.length - 1, idx + delta));
  if (list[next].contentId !== P.currentId) goTo(list[next].contentId);
}

/* ================= Control bar ================= */
function iconBtn(key, icon, title, onClick) {
  var b = mk('button', { class: 'icon-btn', type: 'button', title: title, 'aria-label': title }, [akIcon(icon, 20)]);
  b.addEventListener('click', onClick);
  P.btn[key] = b;
  return b;
}

function buildBar() {
  var bar = akClear($id('bar'));
  P.btn = {};
  var slideBtn = mk('button', { class: 'slide-btn', type: 'button', title: 'Semua slide' }, [akIcon('layers', 17), mk('span', { class: 'num', id: 'slide-num' }), mk('span', { class: 'ellipsis', id: 'slide-name', style: 'max-width:150px' })]);
  slideBtn.addEventListener('click', slidePicker);
  bar.appendChild(slideBtn);
  var prev = mk('button', { class: 'icon-btn nav-btn', type: 'button', title: 'Sebelumnya (\u2190)', 'aria-label': 'Slide sebelumnya' }, [akIcon('chevron-left', 22)]);
  var next = mk('button', { class: 'btn btn-primary nav-btn', style: 'padding:0', type: 'button', title: 'Berikutnya (\u2192)', 'aria-label': 'Slide berikutnya' }, [akIcon('chevron-right', 22)]);
  prev.addEventListener('click', function () { step(-1); });
  next.addEventListener('click', function () { step(1); });
  P.btn.prev = prev; P.btn.next = next;
  bar.appendChild(prev); bar.appendChild(next);
  bar.appendChild(mk('span', { class: 'sep' }));
  bar.appendChild(iconBtn('hide', 'eye', 'Sembunyikan / tampilkan hasil (H)', toggleHide));
  bar.appendChild(iconBtn('reveal', 'check-circle', 'Tampilkan jawaban benar (R)', toggleReveal));
  bar.appendChild(iconBtn('vote', 'lock', 'Tutup / buka voting (V)', toggleVoting));
  bar.appendChild(iconBtn('timer', 'timer', 'Timer (T)', timerModal));
  bar.appendChild(iconBtn('random', 'shuffle', 'Pilih peserta acak (P)', randomPicker));
  bar.appendChild(iconBtn('lb', 'trophy', 'Papan skor (L)', toggleLeaderboard));
  bar.appendChild(mk('span', { class: 'sep' }));
  bar.appendChild(iconBtn('qr', 'qr', 'QR code & info gabung (Q)', qrModal));
  bar.appendChild(iconBtn('join', 'users', 'Sembunyikan / tampilkan info gabung (J)', toggleJoinInfo));
  bar.appendChild(iconBtn('lock', 'unlock', 'Kunci / buka pendaftaran', toggleLock));
  bar.appendChild(mk('span', { style: 'padding:0 4px;display:inline-flex' }, [akThemeSwitch()]));
  bar.appendChild(iconBtn('fs', 'maximize', 'Layar penuh (F)', toggleFullscreen));
  bar.appendChild(iconBtn('help', 'keyboard', 'Pintasan keyboard (?)', shortcutsModal));
  if (P.kind === 'host') {
    var exit = mk('a', { class: 'icon-btn', href: (P.init && P.init.dashboardUrl) || AK_SITE.host(), title: 'Kembali ke dasbor', 'aria-label': 'Kembali ke dasbor' }, [akIcon('grid', 20)]);
    bar.appendChild(exit);
  } else {
    bar.appendChild(iconBtn('exit', 'log-out', 'Keluar', function () {
      akConfirm({ title: 'Keluar dari tampilan presenter?', icon: 'log-out', tone: 'warning', danger: true, cancelText: 'Tetap di sini', confirmText: 'Keluar', message: 'Presentasi di layar ini akan berhenti. Peserta tetap berada di sesi, dan Anda bisa masuk lagi dengan kunci presenter.', onConfirm: function () {
        akCall('logoutSession', [P.token], null, function () {});
        akStore.set('presenter_token', null, true);
        stopAll(); P.token = null; showGate();
      } });
    }));
  }
  updateBarState();
}

function setIcon(btn, icon) { if (!btn) return; akClear(btn); btn.appendChild(akIcon(icon, 20)); }

function updateBarState() {
  if (!P.btn.prev) return;
  var list = navigable();
  var idx = list.findIndex(function (i) { return i.contentId === P.currentId; });
  var cur = P.items.find(function (i) { return i.contentId === P.currentId; });
  $id('slide-num').textContent = (idx + 1) + ' / ' + list.length;
  $id('slide-name').textContent = cur ? cur.title : '';
  P.btn.prev.disabled = idx <= 0;
  P.btn.next.disabled = idx < 0 || idx >= list.length - 1;
  var type = cur ? cur.type : '';
  var inputType = ['announcement', 'leaderboard'].indexOf(type) < 0 && !!cur;
  P.btn.hide.disabled = !inputType;
  setIcon(P.btn.hide, P.hidden ? 'eye-off' : 'eye');
  P.btn.hide.classList.toggle('active', P.hidden);
  P.btn.reveal.hidden = type !== 'multiplechoice';
  P.btn.reveal.classList.toggle('active', !!(cur && P.live.reveal && P.live.reveal[cur.contentId]));
  P.btn.vote.disabled = !inputType;
  var closed = cur && cur.status === 'closed';
  setIcon(P.btn.vote, closed ? 'unlock' : 'lock');
  P.btn.vote.title = closed ? 'Buka kembali voting (V)' : 'Tutup voting (V)';
  P.btn.vote.classList.toggle('active', !!closed);
  P.btn.lb.classList.toggle('active', !!P.live.leaderboard);
  P.btn.timer.classList.toggle('active', !!(P.live.timerEnd && P.live.timerEnd > akClock.now()));
  setIcon(P.btn.lock, P.lockJoin ? 'lock' : 'unlock');
  P.btn.lock.title = P.lockJoin ? 'Buka pendaftaran' : 'Kunci pendaftaran';
  P.btn.lock.classList.toggle('active', P.lockJoin);
  P.btn.join.classList.toggle('active', document.body.classList.contains('join-hidden'));
}

function action(name, arg, ok) {
  akCall('presenterAction', [P.token, P.eventId, name, arg || {}], function (res) {
    if (!res.success) { akToast(res.message, 'error'); return; }
    if (res.live) P.live = res.live;
    if (res.lockJoin !== undefined) P.lockJoin = res.lockJoin;
    updateBarState();
    if (ok) ok(res);
    if (P.poller) P.poller.now();
  });
}

function toggleHide() { if (P.btn.hide.disabled) return; P.hidden = !P.hidden; applyVeil(); updateBarState(); }
function applyVeil() { var b = $id('st-body'); if (b) b.classList.toggle('veiled', P.hidden); }
function toggleReveal() {
  var cur = P.currentId; if (!cur) return;
  var on = !(P.live.reveal && P.live.reveal[cur]);
  action('reveal', { cid: cur, on: on }, function () { akToast(on ? 'Jawaban benar ditampilkan' : 'Jawaban disembunyikan lagi', 'success'); });
}
function toggleVoting() {
  var cur = P.items.find(function (i) { return i.contentId === P.currentId; });
  if (!cur || P.btn.vote.disabled) return;
  var st = cur.status === 'closed' ? 'active' : 'closed';
  cur.status = st; updateBarState();
  action('status', { cid: cur.contentId, status: st }, function () { akToast(st === 'closed' ? 'Voting ditutup' : 'Voting dibuka kembali', 'success'); });
}
function toggleLeaderboard() { action('leaderboard', { on: !P.live.leaderboard }); }
function toggleLock() { action('lockJoin', { on: !P.lockJoin }, function (r) { akToast(r.lockJoin ? 'Pendaftaran dikunci' : 'Pendaftaran dibuka', 'success'); }); }
function toggleJoinInfo() { document.body.classList.toggle('join-hidden'); updateBarState(); }
function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      var p = document.documentElement.requestFullscreen();
      if (p && p.catch) p.catch(function () { akToast('Layar penuh diblokir di sini — tekan F11.', 'info'); });
    } else document.exitFullscreen();
  } catch (e) { akToast('Tekan F11 untuk layar penuh.', 'info'); }
}
document.addEventListener('fullscreenchange', function () { setIcon(P.btn.fs, document.fullscreenElement ? 'minimize' : 'maximize'); });
$id('join-info').addEventListener('click', qrModal);

/* ================= Modals ================= */
function slidePicker() {
  var list = mk('div', { class: 'slide-pick' });
  var m;
  P.items.forEach(function (it, i) {
    var t = AK_TYPES[it.type] || { icon: 'layers', color: 'var(--c8)', label: it.type };
    list.appendChild(mk('button', { class: (it.contentId === P.currentId ? 'cur' : '') + (it.status === 'draft' ? ' draft' : ''), type: 'button', onclick: function () { m.close(); goTo(it.contentId); } }, [
      mk('span', { class: 'n', text: String(i + 1) }), mk('span', { class: 'ic-wrap', style: '--tc:' + t.color }, [akIcon(t.icon, 18)]),
      mk('span', { style: 'min-width:0' }, [mk('b', { text: it.title }), mk('span', { class: 'tiny faint', text: t.label + (it.status === 'draft' ? ' \u00B7 tersembunyi' : it.status === 'closed' ? ' \u00B7 ditutup' : '') })]),
      mk('span', { class: 'badge', text: String(it.count) })
    ]));
  });
  m = akModal({ title: 'Slide', size: 'lg', body: list });
  setTimeout(function () { var c = list.querySelector('.cur'); if (c) c.scrollIntoView({ block: 'center' }); }, 50);
}

function qrModal() {
  if (!P.init) return;
  var qr = mk('div', { class: 'center', style: 'margin:10px 0 18px' });
  akModal({
    title: 'Gabung ke sesi', size: 'lg',
    body: mk('div', { class: 'center' }, [
      mk('p', { class: 'muted', text: 'Pindai QR code dengan kamera ponsel, atau buka link lalu masukkan kodenya.' }),
      qr,
      mk('div', { class: 'code-chip', style: 'font-size:clamp(30px,5vw,46px);padding:10px 24px', text: P.init.event.codeDisplay }),
      mk('div', { class: 'row', style: 'justify-content:center;margin-top:18px' }, [mk('button', { class: 'btn btn-soft btn-sm', type: 'button', onclick: function () { akCopy(P.init.joinUrl, 'Link gabung disalin'); } }, [akIcon('copy', 15), 'Salin link'])])
    ]),
    actions: [{ label: 'Tutup', kind: 'btn-primary' }]
  });
  akQr(qr, P.init.joinUrl, 300);
}

function timerModal() {
  var running = P.live.timerEnd && P.live.timerEnd > akClock.now();
  var label = mk('input', { class: 'input', placeholder: 'Label (opsional), mis. Diskusi kelompok', maxlength: '60', value: P.live.timerLabel || '' });
  var custom = mk('input', { class: 'input', type: 'number', min: '1', max: '60', placeholder: 'Menit' });
  var m;
  var startT = function (sec) { m.close(); action('timer', { seconds: sec, label: label.value }, function () { akToast('Timer dimulai di semua perangkat', 'success'); }); };
  var grid = mk('div', { class: 'timer-presets' });
  [[30, '30 detik'], [60, '1 menit'], [120, '2 menit'], [180, '3 menit'], [300, '5 menit'], [600, '10 menit']].forEach(function (p) {
    grid.appendChild(mk('button', { class: 'btn btn-secondary', type: 'button', text: p[1], onclick: function () { startT(p[0]); } }));
  });
  m = akModal({
    title: 'Timer hitung mundur', icon: 'timer',
    message: 'Menampilkan timer di layar besar dan di perangkat setiap peserta.',
    body: mk('div', { style: 'margin-top:14px' }, [label, grid, mk('div', { class: 'row' }, [custom, mk('button', { class: 'btn btn-primary', type: 'button', text: 'Mulai', onclick: function () { var v = Number(custom.value); if (v > 0) startT(Math.round(v * 60)); } })])]),
    actions: running ? [{ label: 'Hentikan timer', kind: 'btn-danger', onClick: function () { action('timer', { seconds: 0 }); } }] : []
  });
}

function randomPicker() {
  var nameEl = mk('div', { class: 'picker-name', text: '\u2026' });
  var again = mk('button', { class: 'btn btn-primary', type: 'button' }, [akIcon('shuffle', 17), 'Pilih lagi']);
  var spin = function () {
    again.disabled = true;
    nameEl.classList.remove('final');
    nameEl.textContent = '\u2026';
    akCall('presenterAction', [P.token, P.eventId, 'random', {}], function (res) {
      if (!res.success) { nameEl.textContent = res.message; again.disabled = false; return; }
      var names = res.names && res.names.length ? res.names : [res.name];
      var i = 0, delay = 60, t0 = Date.now();
      (function roll() {
        nameEl.textContent = names[i++ % names.length];
        if (Date.now() - t0 < 2200) { delay *= 1.08; setTimeout(roll, delay); }
        else { nameEl.textContent = res.name; nameEl.classList.add('final'); akConfetti(70); again.disabled = false; }
      })();
    }, function () { again.disabled = false; });
  };
  again.addEventListener('click', spin);
  akModal({ title: 'Peserta acak', icon: 'shuffle', size: 'lg', body: mk('div', null, [nameEl, mk('div', { class: 'center' }, [again])]) });
  spin();
}

function shortcutsModal() {
  var rows = [['\u2192 / Spasi', 'Slide berikutnya'], ['\u2190', 'Slide sebelumnya'], ['H', 'Sembunyikan / tampilkan hasil'], ['R', 'Tampilkan jawaban kuis'], ['V', 'Tutup / buka voting'],
    ['T', 'Timer'], ['P', 'Peserta acak'], ['L', 'Papan skor'], ['Q', 'QR code'], ['J', 'Sembunyikan / tampilkan info gabung'], ['F', 'Layar penuh'], ['Esc', 'Tutup dialog']];
  var list = mk('div', { class: 'shortcut-list' });
  rows.forEach(function (r) { list.appendChild(mk('span', { class: 'kbd', text: r[0] })); list.appendChild(mk('span', { text: r[1] })); });
  akModal({ title: 'Pintasan keyboard', icon: 'keyboard', body: list });
}

document.addEventListener('keydown', function (e) {
  if ($id('pres').hidden || document.querySelector('.ak-modal-backdrop')) return;
  if (/INPUT|TEXTAREA|SELECT/.test((e.target && e.target.tagName) || '')) return;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  var k = e.key;
  if (k === 'ArrowRight' || k === 'PageDown' || k === ' ') { e.preventDefault(); step(1); }
  else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); step(-1); }
  else if (k === 'h' || k === 'H') toggleHide();
  else if ((k === 'r' || k === 'R') && !P.btn.reveal.hidden) toggleReveal();
  else if (k === 'v' || k === 'V') toggleVoting();
  else if (k === 't' || k === 'T') timerModal();
  else if (k === 'p' || k === 'P') randomPicker();
  else if (k === 'l' || k === 'L') toggleLeaderboard();
  else if (k === 'q' || k === 'Q') qrModal();
  else if (k === 'j' || k === 'J') toggleJoinInfo();
  else if (k === 'f' || k === 'F') toggleFullscreen();
  else if (k === '?') shortcutsModal();
});

// Hide controls when the mouse is idle (projector-friendly)
function wake() {
  document.body.classList.remove('idle');
  clearTimeout(P.idleTimer);
  P.idleTimer = setTimeout(function () { if (!document.querySelector('.ak-modal-backdrop') && !$id('pres').hidden) document.body.classList.add('idle'); }, 3500);
}
['mousemove', 'mousedown', 'touchstart', 'keydown'].forEach(function (ev) { document.addEventListener(ev, wake, { passive: true }); });

/* ================= Stage rendering ================= */
function stageShell(type, title, desc) {
  var stage = akClear($id('stage'));
  stage.classList.remove('enter'); void stage.offsetWidth; stage.classList.add('enter');
  var head = mk('div', { class: 'st-head' }, [type ? akTypePill(type) : null, mk('span', { id: 'st-status' }), mk('span', { class: 'sp' }), mk('span', { class: 'st-count', id: 'st-count' })]);
  stage.appendChild(head);
  if (title !== null) stage.appendChild(mk('h1', { class: 'st-title', id: 'st-title', text: title || '' }));
  stage.appendChild(mk('p', { class: 'st-desc', id: 'st-desc', text: desc || '', hidden: !desc }));
  var body = mk('div', { class: 'st-body', id: 'st-body' }, [mk('div', { class: 'veil-note' }, [mk('div', null, [akIcon('eye-off', 20), 'Hasil disembunyikan \u2014 tekan H untuk menampilkan'])])]);
  stage.appendChild(body);
  return body;
}

function renderLoading() {
  var it = P.items.find(function (i) { return i.contentId === P.currentId; });
  var body = stageShell(it ? it.type : null, it ? it.title : '', '');
  body.appendChild(mk('div', { class: 'fill' }, [mk('div', { class: 'skeleton', style: 'height:55%;min-height:220px' })]));
}

function renderEmpty() {
  P.stageKey = 'empty';
  var body = stageShell(null, 'Belum ada slide untuk dipresentasikan', 'Tambahkan slide di dasbor, lalu kembali ke sini.');
  var fill = mk('div', { class: 'fill waiting' }, [mk('div', { class: 'orb' }, [akIcon('layers', 46)])]);
  if (P.kind === 'host') fill.appendChild(mk('a', { class: 'btn btn-primary', href: (P.init && P.init.dashboardUrl) || AK_SITE.host(), style: 'align-self:center' }, [akIcon('edit', 17), 'Buka editor']));
  body.appendChild(fill);
}

function waitingEl(text) {
  return mk('div', { class: 'fill waiting' }, [mk('div', { class: 'orb' }, [akIcon('smartphone', 46)]), mk('div', { class: 'wbig' }, [text, mk('span', { class: 'dots' })]), mk('div', { class: 'wsub', text: 'Peserta menjawab dari ponsel. Hasilnya langsung tampil di sini.' })]);
}

function render(d) {
  if (!d) { if (!navigable().length) renderEmpty(); return; }
  if (!d.found) {
    P.stageKey = 'gone';
    var b = stageShell(null, 'Slide ini sudah tidak ada', 'Slide ini mungkin sudah dihapus di editor.');
    b.appendChild(mk('div', { class: 'fill' }));
    return;
  }
  var key = d.contentId + '|' + d.type;
  var fresh = key !== P.stageKey;
  if (fresh) {
    P.stageKey = key; P.quizView = null; P.ring = null; P.seenNotes = {};
    var body = stageShell(d.type, d.title, d.description);
    body._fill = mk('div', { class: 'fill' });
    body.appendChild(body._fill);
    applyVeil();
  }
  var t = $id('st-title'); if (t && t.textContent !== d.title) t.textContent = d.title;
  var ds = $id('st-desc'); if (ds) { ds.textContent = d.description || ''; ds.hidden = !d.description; }
  var st = akClear($id('st-status'));
  if (d.status === 'closed') st.appendChild(mk('span', { class: 'badge badge-warning' }, [akIcon('lock', 12), 'Voting ditutup']));
  if (d.status === 'draft') st.appendChild(mk('span', { class: 'badge' }, [akIcon('eye-off', 12), 'Disembunyikan dari peserta']));
  var cnt = akClear($id('st-count'));
  if (['announcement', 'leaderboard'].indexOf(d.type) < 0) { cnt.appendChild(akIcon(d.type === 'qna' ? 'message' : 'users', 18)); cnt.appendChild(document.createTextNode(akFmt(d.responseCount) + (d.type === 'qna' ? ' pertanyaan' : ' jawaban'))); }

  var fill = $id('st-body')._fill;
  switch (d.type) {
    case 'announcement': renderContent(fill, d); break;
    case 'poll': renderPoll(fill, d); break;
    case 'multiplechoice': renderQuiz(fill, d); break;
    case 'wordcloud': renderCloud(fill, d); break;
    case 'writing': renderNotes(fill, d); break;
    case 'qna': renderQna(fill, d); break;
    case 'scales': renderScales(fill, d); break;
    case 'ranking': renderRank(fill, d); break;
    case 'leaderboard': renderLb(fill, d); break;
    default: akClear(fill).appendChild(mk('div', { class: 'waiting', text: 'Jenis slide tidak didukung: ' + d.type }));
  }
}

// Swap between "waiting" and a persistent results element without rebuilding it each refresh
function slot(fill, mode, builder) {
  if (fill._mode !== mode) {
    akClear(fill);
    fill._mode = mode;
    fill._el = builder();
    fill.appendChild(fill._el);
  }
  return fill._el;
}

function renderContent(fill) {
  if (fill._mode !== 'content') { akClear(fill); fill._mode = 'content'; }
  $id('st-desc').classList.add('content-body');
}

function renderPoll(fill, d) {
  if (!d.total) { slot(fill, 'wait', function () { return waitingEl('Menunggu pilihan'); }); return; }
  var cols = d.results.length <= 6;
  var el = slot(fill, cols ? 'cols' : 'bars', function () { return mk('div', { style: cols ? 'height:clamp(300px,52vh,560px);width:100%' : 'width:100%;max-width:1000px;margin:0 auto' }); });
  if (cols) akColumnsInto(el, d.results, {}); else akBarsInto(el, d.results, { large: true });
}

function quizView(d) {
  var q = d.quiz || {};
  if (q.revealed) return 'results';
  if (q.timed && q.start && akClock.now() < q.start) return 'ready';
  return 'question';
}

function renderQuiz(fill, d) {
  var view = quizView(d);
  var q = d.quiz || {};
  if (view === 'ready') {
    var r = slot(fill, 'ready', function () { return mk('div', { class: 'ready-big', id: 'q-ready' }); });
    r.textContent = String(Math.max(1, Math.ceil((q.start - akClock.now()) / 1000)));
    return;
  }
  if (view === 'question') {
    var el = slot(fill, 'question', function () {
      var tiles = mk('div', { class: 'quiz-tiles' });
      d.options.forEach(function (o, i) {
        tiles.appendChild(mk('div', { class: 'quiz-tile', style: '--qc:' + akColor(i) + ';animation-delay:' + (i * 80) + 'ms' }, [mk('span', { class: 'ql', text: String.fromCharCode(65 + i) }), mk('span', { text: o })]));
      });
      var meta = mk('div', { class: 'quiz-meta' });
      if (q.timed) { P.ring = akRing(120, 11); meta.appendChild(P.ring.el); }
      var ans = mk('div', { class: 'qv', id: 'q-answers', text: '0' });
      meta.appendChild(mk('div', { class: 'qm' }, [ans, mk('div', { class: 'ql2', text: 'jawaban' })]));
      var wrap = mk('div', null, [tiles, meta]);
      if (!q.timed) wrap.appendChild(mk('p', { class: 'summary', text: 'Tekan R (atau tombol \u2714) untuk menampilkan hasil dan jawaban benar.' }));
      return wrap;
    });
    var a = $id('q-answers'); if (a) a.textContent = akFmt(d.total);
    return;
  }
  var res = slot(fill, 'results', function () {
    var chart = mk('div', { style: 'height:clamp(280px,48vh,520px);width:100%' });
    var sum = mk('div', { class: 'summary' });
    var w = mk('div', null, [chart, sum]); w._chart = chart; w._sum = sum;
    return w;
  });
  akColumnsInto(res._chart, d.results, { showCorrect: true });
  akClear(res._sum);
  if (d.correctCount !== null && d.total) res._sum.appendChild(mk('span', null, [mk('b', { text: akFmt(d.correctCount) }), ' dari ' + akFmt(d.total) + ' peserta menjawab benar (' + Math.round(d.correctCount / d.total * 100) + '%)']));
  else if (!d.total) res._sum.textContent = 'Tidak ada yang menjawab soal ini.';
}

function renderCloud(fill, d) {
  if (!d.words || !d.words.length) { slot(fill, 'wait', function () { return waitingEl('Menunggu kata'); }); return; }
  var el = slot(fill, 'cloud', function () { return mk('div'); });
  akCloudInto(el, d.words, { large: true });
}

function renderNotes(fill, d) {
  if (!d.responses || !d.responses.length) { slot(fill, 'wait', function () { return waitingEl('Menunggu jawaban'); }); return; }
  var el = slot(fill, 'notes', function () { return mk('div', { class: 'cards-grid p-cards', style: 'align-self:stretch' }); });
  var sig = d.responses.map(function (r) { return r.id; }).join(',');
  if (el._sig === sig) return;
  el._sig = sig;
  akClear(el);
  fill.style.justifyContent = 'flex-start';
  d.responses.forEach(function (r) {
    var isNew = !P.seenNotes[r.id];
    P.seenNotes[r.id] = true;
    el.appendChild(mk('div', { class: 'note' + (isNew ? '' : ' old'), style: '--nc:' + AK_NOTE_COLORS[akHash(r.id) % AK_NOTE_COLORS.length] }, [r.name ? mk('div', { class: 'note-name', text: r.name }) : null, mk('div', { class: 'note-text', text: r.text })]));
  });
}

function renderQna(fill, d) {
  var qs = d.questions || [];
  if (!qs.length) { slot(fill, 'wait', function () { return waitingEl('Menunggu pertanyaan'); }); return; }
  var el = slot(fill, 'qna', function () { return mk('div', { class: 'p-qa', style: 'max-width:980px;width:100%;margin:0 auto;align-self:stretch' }); });
  fill.style.justifyContent = 'flex-start';
  var sig = JSON.stringify(qs);
  if (el._sig === sig) return;
  el._sig = sig;
  akClear(el);
  var pending = qs.filter(function (q) { return q.state === 'pending'; });
  var shown = qs.filter(function (q) { return q.state === 'visible' || q.state === 'answered'; });
  var hidden = qs.filter(function (q) { return q.state === 'hidden'; });
  var tool = function (icon, title, op, q, cls) {
    return mk('button', { class: 'icon-btn sm ' + (cls || ''), type: 'button', title: title, 'aria-label': title, onclick: function () { moderate(q, op); } }, [akIcon(icon, 17)]);
  };
  if (pending.length) {
    el.appendChild(mk('div', { class: 'qa-sec' }, [akIcon('alert', 15), pending.length + ' menunggu persetujuan']));
    var pl = mk('div', { class: 'qa-list', style: 'margin-bottom:22px' });
    pending.forEach(function (q) {
      pl.appendChild(mk('div', { class: 'qa-item pending' }, [mk('div', { class: 'qa-text', text: q.text }), mk('div', { class: 'qa-tools', style: 'opacity:1' }, [
        mk('button', { class: 'btn btn-soft btn-sm', type: 'button', onclick: function () { moderate(q, 'approve'); } }, [akIcon('check', 15), 'Setujui']),
        tool('x', 'Tolak', 'hide', q, 'danger')
      ])]));
    });
    el.appendChild(pl);
  }
  var list = mk('div', { class: 'qa-list' });
  shown.forEach(function (q) {
    list.appendChild(mk('div', { class: 'qa-item' + (q.state === 'answered' ? ' answered' : '') }, [
      mk('div', { class: 'votes' }, [String(q.upvotes), mk('small', { text: 'dukungan' })]),
      mk('div', { class: 'qa-text' }, [mk('div', { text: q.text }), q.state === 'answered' ? mk('div', { class: 'qa-meta' }, [mk('span', { class: 'badge badge-success' }, [akIcon('check', 12), 'Sudah dijawab'])]) : null]),
      mk('div', { class: 'qa-tools' }, [
        q.state === 'answered' ? tool('refresh', 'Tandai belum dijawab', 'restore', q) : tool('check', 'Tandai sudah dijawab', 'answered', q),
        tool('eye-off', 'Sembunyikan', 'hide', q), tool('trash', 'Hapus', 'delete', q, 'danger')
      ])
    ]));
  });
  if (!shown.length && !pending.length) list.appendChild(mk('div', { class: 'waiting', text: 'Semua pertanyaan disembunyikan.' }));
  el.appendChild(list);
  if (hidden.length) el.appendChild(mk('p', { class: 'hint', style: 'margin-top:12px' }, [hidden.length + ' pertanyaan disembunyikan. ', mk('button', { class: 'btn btn-ghost btn-sm', type: 'button', text: 'Pulihkan semua', onclick: function () { hidden.forEach(function (q) { moderate(q, 'restore', true); }); } })]));
}

function moderate(q, op, quiet) {
  var run = function () {
    akCall('moderateQuestion', [P.token, P.eventId, q.responseId, op], function (res) {
      if (!res.success) akToast(res.message, 'error');
      if (P.poller) P.poller.now();
    });
  };
  if (op === 'delete' && !quiet) akConfirm({ title: 'Hapus pertanyaan ini?', message: '"' + q.text + '" akan dihapus untuk semua orang.', confirmText: 'Hapus', danger: true, onConfirm: run });
  else run();
}

function renderScales(fill, d) {
  if (!d.responseCount) { slot(fill, 'wait', function () { return waitingEl('Menunggu penilaian'); }); return; }
  var el = slot(fill, 'scales', function () { return mk('div', { style: 'max-width:1000px;width:100%;margin:0 auto' }); });
  akScalesInto(el, d.scales, d.config, { large: true });
}

function renderRank(fill, d) {
  if (!d.total) { slot(fill, 'wait', function () { return waitingEl('Menunggu urutan'); }); return; }
  var el = slot(fill, 'rank', function () { return mk('div', { style: 'max-width:1000px;width:100%;margin:0 auto' }); });
  akRankingInto(el, d.ranking, { large: true });
}

function renderLb(fill, d) {
  var el = slot(fill, 'lb', function () { return mk('div', { style: 'width:100%' }); });
  akLeaderboardInto(el, d.leaderboard, { podium: true });
  if (d.leaderboard && d.leaderboard.rows.length && !P.confettiFor[d.contentId]) { P.confettiFor[d.contentId] = true; setTimeout(function () { akConfetti(120); }, 700); }
}

function updateLeaderboardOverlay(lb) {
  var ov = $id('lb-overlay');
  var on = !!P.live.leaderboard && !!lb;
  if (!on) { ov.hidden = true; P.lbShown = false; return; }
  if (!P.lbShown) {
    P.lbShown = true;
    akClear($id('lb-title')).appendChild(akIcon('trophy', 40));
    $id('lb-title').appendChild(document.createTextNode('Papan Skor'));
    $id('lb-body')._akSig = null;
    if (lb.rows.length) setTimeout(function () { akConfetti(120); }, 600);
  }
  ov.hidden = false;
  akLeaderboardInto($id('lb-body'), lb, { podium: true });
}
$id('lb-overlay').addEventListener('click', function (e) { if (e.target === e.currentTarget) toggleLeaderboard(); });

/* Ticker: timer pill + quiz countdowns between refreshes */
function tick() {
  var wrap = $id('p-timer'), pill = $id('p-timer-pill');
  var end = P.live.timerEnd || 0;
  if (end && end > akClock.now() - 5000) {
    var left = end - akClock.now();
    wrap.hidden = false;
    var done = left <= 0;
    var txt = done ? 'Waktu habis!' : akMMSS(left);
    if (pill._t !== txt) {
      pill._t = txt;
      akClear(pill);
      pill.appendChild(akIcon('timer', 24));
      if (P.live.timerLabel) pill.appendChild(mk('small', { text: P.live.timerLabel }));
      pill.appendChild(document.createTextNode(txt));
      pill.classList.toggle('done', done);
    }
  } else wrap.hidden = true;

  var d = P.data;
  if (!d || d.type !== 'multiplechoice') return;
  var q = d.quiz || {};
  var view = quizView(d);
  var fill = $id('st-body') && $id('st-body')._fill;
  if (!fill) return;
  if (view === 'ready') { renderQuiz(fill, d); return; }
  if (fill._mode === 'ready' && view === 'question') { renderQuiz(fill, d); return; }
  if (view === 'question' && P.ring && q.timed && q.start) {
    var rem = q.end - akClock.now();
    P.ring.set(rem / (q.limit * 1000), String(Math.max(0, Math.ceil(rem / 1000))));
    if (rem < -1600 && !P._quizPoked) { P._quizPoked = true; P.poller.now(); setTimeout(function () { P._quizPoked = false; }, 3000); }
  }
}

/* ================= Boot ================= */
(function boot() {
  var host = akStore.get('host_token', true), pres = akStore.get('presenter_token', true);
  if (host && P.eventId) { P.token = host; P.kind = 'host'; start(); return; }
  if (pres) { P.token = pres; P.kind = 'presenter'; P.eventId = null; start(); return; }
  if (host) { P.token = host; P.kind = 'host'; start(); return; }
  showGate();
})();
