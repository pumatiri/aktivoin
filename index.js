var S = { pid: null, token: null, eventId: null, eventName: '', facilitator: '', identity: 'full', code: '' };
var A = { poller: null, ticker: null, data: null, last: null, slideKey: null, phase: null, selected: null, away: 0, focus: false, local: {}, qnaLocal: {}, rxLast: 0, ring: null, rank: null };

/* ---------------- Landing ---------------- */
akSetLogo(['logo-nav', 'logo-foot', 'logo-aud']);
akMountTheme('theme-nav');
akMountTheme('theme-aud');
$id('btn-leave').appendChild(akIcon('log-out', 19));
$id('focus-ic').appendChild(akIcon('eye', 40));
$id('tools-ic').appendChild(akIcon('sparkles', 20));
$id('help-fab').appendChild(akIcon('whatsapp', 18));
$id('help-fab').appendChild(document.createTextNode('Butuh bantuan?'));
var WA = String((window.AKTIVO_CONFIG && AKTIVO_CONFIG.SUPPORT_WHATSAPP) || '').replace(/\D/g, '');
if (WA) $id('help-fab').href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent('Halo tim dukungan AKTIVO! Saya sedang menggunakan AKTIVO dan butuh bantuan.');
else $id('help-fab').hidden = true;

(function buildNav() {
  var box = $id('nav-actions');
  if (akStore.get('host_token', true)) {
    box.appendChild(mk('a', { class: 'btn btn-primary btn-sm', href: AK_SITE.host() }, [akIcon('grid', 16), 'Dasbor']));
  } else {
    box.appendChild(mk('button', { class: 'btn btn-ghost btn-sm', type: 'button', text: 'Masuk', onclick: function () { openAuth('login'); } }));
    box.appendChild(mk('button', { class: 'btn btn-primary btn-sm', type: 'button', text: 'Daftar gratis', onclick: function () { openAuth('register'); } }));
  }
})();

document.querySelectorAll('[data-scroll]').forEach(function (b) {
  b.addEventListener('click', function () { var t = $id('sec-' + b.getAttribute('data-scroll')); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
});

(function fillLanding() {
  [['zap', 'Tanpa aplikasi'], ['smartphone', 'Bisa di ponsel apa pun'], ['shield', 'Privat & aman'], ['users', 'Hingga 300 peserta']].forEach(function (x) {
    $id('trust').appendChild(mk('span', null, [akIcon(x[0], 16), x[1]]));
  });
  var types = $id('feat-types');
  AK_TYPE_ORDER.forEach(function (k) {
    var t = AK_TYPES[k];
    types.appendChild(mk('div', { class: 'card feat' }, [mk('div', { class: 'feat-ic', style: '--fc:' + t.color }, [akIcon(t.icon, 22)]), mk('h3', { text: t.label }), mk('p', { text: t.desc })]));
  });
  var tools = [
    ['play', 'var(--c1)', 'Dipandu presenter atau mandiri', 'Pandu semua peserta slide demi slide seperti acara langsung, atau biarkan peserta mengerjakan aktivitas sesuai kecepatan masing-masing.'],
    ['trophy', 'var(--c4)', 'Kuis langsung & papan skor', 'Hitung mundur, poin untuk kecepatan, dan podium yang mengubah latihan soal menjadi permainan.'],
    ['clipboard', 'var(--c5)', 'Absensi & laporan', 'Nama, email, dan NIS/NIM setiap peserta. Ekspor laporan PDF — lengkap dengan nama fasilitator — atau Google Sheet.'],
    ['shield', 'var(--c3)', 'Moderasi & keamanan', 'Setujui pertanyaan sebelum tampil, saring kata kasar, keluarkan peserta, dan kunci ruangan.'],
    ['timer', 'var(--c6)', 'Timer & pemilih acak', 'Jalankan hitung mundur yang tampil di semua perangkat, atau pilih peserta secara acak untuk menjawab.'],
    ['smile', 'var(--c7)', 'Reaksi emoji', 'Peserta mengirim hati, tepuk tangan, dan tanda tanya yang melayang di layar besar.'],
    ['eye', 'var(--c2)', 'Mode fokus', 'Untuk ujian dan tugas bernilai: watermark pribadi dan catatan siapa yang meninggalkan halaman.'],
    ['qr', 'var(--c8)', 'Gabung lewat QR atau kode', 'QR code besar dan kode 8 digit di layar presenter membuat peserta bisa bergabung seketika.']
  ];
  tools.forEach(function (t) {
    $id('feat-tools').appendChild(mk('div', { class: 'card feat' }, [mk('div', { class: 'feat-ic', style: '--fc:' + t[1] }, [akIcon(t[0], 22)]), mk('h3', { text: t[2] }), mk('p', { text: t[3] })]));
  });
  var step = function (n, title, text) { return mk('div', { class: 'step' }, [mk('span', { class: 'step-n', text: String(n) }), mk('div', null, [mk('b', { text: title }), mk('p', { text: text })])]); };
  var host = $id('how-host');
  host.appendChild(mk('h3', null, [akIcon('monitor', 22), 'Untuk presenter']));
  host.appendChild(step(1, 'Buat akun host gratis', 'Daftar di bawah dengan nama Anda — nama ini tampil di layar sesi dan di laporan.'));
  host.appendChild(step(2, 'Susun sesi', 'Mulai dari template Kelas, Rapat bisnis, atau Retrospektif, atau buat slide sendiri.'));
  host.appendChild(step(3, 'Presentasikan', 'Buka tampilan Presenter di proyektor. Layar peserta otomatis mengikuti saat Anda berpindah slide.'));
  host.appendChild(step(4, 'Unduh laporan', 'Ekspor PDF berisi hasil dan absensi, atau Google Sheet untuk analisis lebih lanjut.'));
  host.appendChild(mk('div', { class: 'shortcuts' }, [
    mk('span', null, [mk('span', { class: 'kbd', text: '\u2192' }), ' berikutnya']), mk('span', null, [mk('span', { class: 'kbd', text: 'H' }), ' sembunyikan hasil']),
    mk('span', null, [mk('span', { class: 'kbd', text: 'Q' }), ' QR code']), mk('span', null, [mk('span', { class: 'kbd', text: 'T' }), ' timer']),
    mk('span', null, [mk('span', { class: 'kbd', text: 'F' }), ' layar penuh'])
  ]));
  var aud = $id('how-aud');
  aud.appendChild(mk('h3', null, [akIcon('smartphone', 22), 'Untuk peserta']));
  aud.appendChild(step(1, 'Buka link atau pindai QR code', 'Gunakan ponsel, tablet, atau laptop apa pun yang memiliki browser.'));
  aud.appendChild(step(2, 'Masukkan kode dan nama Anda', 'Ketik kode 8 digit dari layar. Beberapa sesi juga meminta email atau NIS/NIM untuk absensi.'));
  aud.appendChild(step(3, 'Jawab, pilih, dan beri reaksi', 'Layar Anda otomatis mengikuti presenter. Hasilnya langsung tampil di layar besar.'));
  aud.appendChild(mk('div', { class: 'notice', style: 'margin-top:12px' }, [akIcon('info', 18), mk('span', { text: 'Bergabung kembali? Gunakan email dan nama yang sama — jawaban sebelumnya tetap tersimpan.' })]));
  [['shield', 'Aman sejak awal', 'Kata sandi terenkripsi, pemeriksaan akses per sesi, dan tidak ada data yang disimpan di luar akun Google Anda.'],
   ['zap', 'Ringan & cepat', 'Cache pintar dan pembaruan adaptif menjaga semuanya tetap lancar, bahkan di kelas yang penuh.'],
   ['file-text', 'Laporan yang bermanfaat', 'Setiap PDF memuat sesi, fasilitator, institusi, hasil, dan daftar hadir.']].forEach(function (b) {
    $id('benefits').appendChild(mk('div', { class: 'benefit' }, [mk('span', { class: 'bi' }, [akIcon(b[0], 20)]), mk('div', null, [mk('b', { text: b[1] }), mk('p', { text: b[2] })])]));
  });
})();

var authPanel = akAuthPanel({ tabs: ['login', 'register'], inviteRequired: false, onSuccess: onHostAuth });
$id('auth-slot').appendChild(authPanel);
// Rebuild the form with an invitation-code field if the server requires one.
akPublicConfig(function (cfg) {
  if (!cfg.inviteRequired || !document.body.contains(authPanel)) return;
  var fresh = akAuthPanel({ tabs: ['login', 'register'], inviteRequired: true, onSuccess: onHostAuth });
  authPanel.parentNode.replaceChild(fresh, authPanel);
  authPanel = fresh;
});

function openAuth(tab) {
  authPanel.akShow(tab);
  $id('sec-host').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function onHostAuth(res) {
  var url = AK_SITE.host();
  var slot = $id('auth-slot');
  akClear(slot);
  slot.appendChild(mk('div', { class: 'auth-success' }, [
    mk('div', { class: 'empty-ic', style: 'width:64px;height:64px;margin:0 auto 14px;border-radius:20px;display:grid;place-items:center;background:var(--success-soft);color:var(--success)' }, [akIcon('check', 30)]),
    mk('h3', { text: 'Selamat datang, ' + ((res.host && res.host.name) || 'host') + '!', style: 'margin-bottom:6px' }),
    mk('p', { class: 'muted', style: 'margin-bottom:18px', text: 'Membuka dasbor Anda…' }),
    mk('a', { class: 'btn btn-primary btn-lg btn-block', href: url }, ['Buka dasbor', akIcon('arrow-right', 18)])
  ]));
  akNavigate(url);
}

/* ---------------- Join flow ---------------- */
var codeInput = $id('code-input');
codeInput.addEventListener('input', function () {
  var raw = codeInput.value.replace(/\s+/g, '');
  if (/^\d{5,8}$/.test(raw)) codeInput.value = raw.slice(0, 4) + ' ' + raw.slice(4);
  $id('code-error').textContent = '';
});
codeInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') submitCode(); });
$id('btn-join').addEventListener('click', submitCode);

function submitCode() {
  var btn = $id('btn-join'), err = $id('code-error');
  var code = codeInput.value.replace(/\s+/g, '');
  err.textContent = '';
  if (!code) { err.textContent = 'Masukkan kode sesi.'; codeInput.focus(); return; }
  akBusy(btn, true);
  akCall('checkEventCode', [code], function (res) {
    akBusy(btn, false);
    if (!res.success) { err.textContent = res.message; return; }
    S.eventId = res.eventId; S.eventName = res.eventName; S.facilitator = res.facilitator; S.identity = res.identity; S.code = code;
    if (res.identity === 'anonymous') { doJoin(null); return; }
    showJoinForm();
  }, function () { akBusy(btn, false); err.textContent = 'Koneksi bermasalah. Silakan coba lagi.'; });
}

var joinInputs = {};
function showJoinForm() {
  $id('landing').hidden = true;
  $id('join-screen').hidden = false;
  document.body.className = 'mode-join';
  $id('join-code-label').textContent = 'Kode ' + (/^\d{8}$/.test(S.code) ? S.code.slice(0, 4) + ' ' + S.code.slice(4) : S.code);
  $id('join-event-name').textContent = S.eventName;
  $id('join-facilitator').textContent = S.facilitator ? 'Dipandu oleh ' + S.facilitator : '';
  var box = akClear($id('join-fields'));
  joinInputs = {};
  var add = function (key, label, attrs) {
    var input = mk('input', Object.assign({ class: 'input input-lg' }, attrs));
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') doJoin($id('btn-enter')); });
    joinInputs[key] = input;
    box.appendChild(mk('div', { class: 'field' }, [mk('label', { class: 'label', text: label }), input]));
  };
  add('name', 'Nama Anda', { placeholder: 'Nama lengkap', autocomplete: 'name', maxlength: '80' });
  if (S.identity === 'full') {
    add('email', 'Email', { type: 'email', placeholder: 'nama@contoh.com', autocomplete: 'email', maxlength: '120' });
    add('nim', 'NIS / NIM / NIP (opsional)', { placeholder: 'mis. 2205123', maxlength: '30' });
  }
  $id('join-hint').textContent = S.identity === 'full' ? 'Bergabung kembali? Gunakan nama dan email yang sama — jawaban sebelumnya tetap tersimpan.' : 'Nama Anda dapat dilihat oleh host.';
  $id('join-error').textContent = '';
  setTimeout(function () { joinInputs.name.focus(); }, 60);
}

$id('btn-enter').addEventListener('click', function () { doJoin($id('btn-enter')); });
var back = $id('btn-join-back');
back.appendChild(akIcon('arrow-left', 16)); back.appendChild(document.createTextNode('Gunakan kode lain'));
back.addEventListener('click', function () { showLanding(); });

function doJoin(btn) {
  var err = $id('join-error');
  var name = joinInputs.name ? joinInputs.name.value.trim() : '';
  var email = joinInputs.email ? joinInputs.email.value.trim() : '';
  var nim = joinInputs.nim ? joinInputs.nim.value.trim() : '';
  if (err) err.textContent = '';
  if (S.identity !== 'anonymous') {
    if (!name) { err.textContent = 'Masukkan nama Anda.'; return; }
    if (S.identity === 'full' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = 'Masukkan alamat email yang valid.'; return; }
  }
  if (btn) akBusy(btn, true, 'Bergabung…');
  akCall('joinEvent', [S.eventId, name, email, nim], function (res) {
    if (btn) akBusy(btn, false);
    if (!res.success) {
      if (S.identity === 'anonymous') { $id('code-error').textContent = res.message; return; }
      err.textContent = res.message; return;
    }
    saveSession(res);
    enterLive();
    if (res.rejoined) akToast('Selamat datang kembali! Jawaban sebelumnya tetap tersimpan.', 'success', 3500);
    else if (S.identity === 'anonymous') akToast('Anda bergabung sebagai ' + res.name, 'success', 3500);
  }, function () { if (btn) akBusy(btn, false); (err || $id('code-error')).textContent = 'Koneksi bermasalah. Silakan coba lagi.'; });
}

function saveSession(res) {
  S.pid = res.participantId; S.token = res.sessionToken;
  S.eventId = res.eventId; S.eventName = res.eventName; S.facilitator = res.facilitator || '';
  akStore.set('pid', S.pid); akStore.set('ptoken', S.token);
}

function showLanding() {
  $id('join-screen').hidden = true;
  $id('audience').hidden = true;
  $id('landing').hidden = false;
  document.body.className = '';
  window.scrollTo(0, 0);
}

/* ---------------- Live audience ---------------- */
function enterLive() {
  $id('landing').hidden = true;
  $id('join-screen').hidden = true;
  $id('audience').hidden = false;
  document.body.className = 'mode-aud';
  window.scrollTo(0, 0);
  $id('aud-session').textContent = S.eventName;
  $id('aud-facilitator').textContent = S.facilitator ? 'bersama ' + S.facilitator : '';
  A.slideKey = null; A.selected = null; A.last = null;
  renderWaiting('Menghubungkan…', 'Mengambil slide terbaru');
  buildReactions();
  if (A.poller) A.poller.stop();
  A.poller = akPoller(pollTask, 2500);
  clearInterval(A.ticker);
  A.ticker = setInterval(tick, 250);
}

function pollTask(done) {
  if (!S.pid) { done(); return; }
  var away = A.away; A.away = 0;
  akCall('audiencePoll', [S.pid, S.token, A.selected, away], function (d) {
    done();
    if (S.pid) onData(d);
  }, function () { A.away += away; done(); });
}

function onData(d) {
  akClock.sync(d.now);
  A.data = d;
  var ss = d.session;
  $id('aud-session').textContent = ss.name;
  $id('aud-facilitator').textContent = ss.facilitator ? 'bersama ' + ss.facilitator : '';
  A.poller.interval = ss.pace === 'presenter' ? 2500 : 4000;
  $id('aud-react').hidden = !ss.reactions;
  setFocusMode(ss.focusMode, ss.me, ss.email);

  var cur = d.current;
  var list = $id('aud-list');
  if (ss.pace === 'audience') {
    list.hidden = false;
    renderList(d.list || []);
    if (cur && cur.closed) { A.selected = null; cur = null; A.slideKey = null; akToast('Aktivitas itu sudah ditutup oleh host.', 'info'); }
    if (!A.selected && d.list && d.list.length === 1) { selectActivity(d.list[0].contentId); return; }
    if (!A.selected) cur = null;
  } else {
    list.hidden = true;
    A.selected = null;
  }
  renderCurrent(cur, ss);
}

function renderList(items) {
  var list = $id('aud-list');
  var sig = JSON.stringify(items) + '|' + A.selected;
  if (list._sig === sig) return;
  list._sig = sig;
  akClear(list);
  if (!items.length) { list.appendChild(mk('span', { class: 'muted small', text: 'Belum ada aktivitas yang dibuka.' })); return; }
  items.forEach(function (it) {
    var t = AK_TYPES[it.type] || {};
    list.appendChild(mk('button', { class: 'aud-chip' + (A.selected === it.contentId ? ' sel' : ''), type: 'button', title: it.title, onclick: function () { selectActivity(it.contentId); } }, [
      akIcon(t.icon || 'layers', 16), mk('span', { class: 'ellipsis', text: it.title }), it.done ? mk('span', { class: 'done' }, [akIcon('check', 12)]) : null
    ]));
  });
}

function selectActivity(cid) {
  A.selected = cid; A.slideKey = null;
  $id('aud-list')._sig = null;
  renderWaiting('Memuat…', '');
  A.poller.now();
}

function renderWaiting(title, sub) {
  A.last = null; A.ring = null;
  var key = 'wait|' + title + '|' + sub;
  if (A.slideKey === key) return;
  A.slideKey = key;
  var stage = akClear($id('aud-stage'));
  stage.appendChild(mk('div', { class: 'wait enter' }, [mk('div', { class: 'wait-orb' }, [akIcon('sparkles', 42)]), mk('h3', { text: title }), mk('p', { text: sub })]));
}

function quizPhase(s) {
  if (s.answered) return s.quiz && s.quiz.revealed ? 'result' : 'locked';
  if (!s.open) return 'closed';
  var q = s.quiz || {};
  if (q.timed) {
    if (!q.start) return 'wait';
    var now = akClock.now();
    if (now < q.start) return 'ready';
    if (now > q.end) return q.revealed ? 'closed' : 'timeout';
  }
  return 'answer';
}

function applyLocal(s) {
  var loc = A.local[s.contentId];
  if (loc && !s.answered && s.type !== 'qna') {
    s.answered = true; s.myAnswer = loc.answer;
    if (s.type === 'multiplechoice' && loc.isCorrect !== undefined && loc.isCorrect !== null) {
      s.isCorrect = loc.isCorrect; s.correctAnswer = loc.correctAnswer; s.score = loc.score;
    }
  }
  if (s.type === 'qna') s.myCount = Math.max(s.myCount || 0, A.qnaLocal[s.contentId] || 0);
}

function renderCurrent(s, ss) {
  if (!s) {
    if (ss && ss.pace === 'audience') renderWaiting('Pilih aktivitas', 'Pilih salah satu aktivitas yang terbuka di atas untuk memulai.');
    else renderWaiting('Menunggu presenter', ((ss && ss.facilitator) ? ss.facilitator : 'Host') + ' akan segera memulai slide berikutnya.');
    return;
  }
  applyLocal(s);
  A.last = s;
  var phase = s.type === 'multiplechoice' ? quizPhase(s) : '';
  A.phase = phase;
  var qnaFull = s.type === 'qna' ? (s.myCount >= ((s.config && s.config.maxQuestions) || 1)) : false;
  var key = [s.contentId, s.type, s.status, s.answered ? 1 : 0, (s.options || []).join('\u0001'), phase, qnaFull ? 1 : 0, JSON.stringify(s.config || {})].join('|');
  if (key !== A.slideKey) { A.slideKey = key; buildSlide(s, phase); }
  updateSlide(s);
}

function el(id) { return $id(id); }

function buildSlide(s, phase) {
  var stage = akClear($id('aud-stage'));
  A.ring = null; A.rank = null;
  stage.classList.remove('enter'); void stage.offsetWidth; stage.classList.add('enter');
  var head = mk('div', { class: 'aud-head' }, [akTypePill(s.type)]);
  if (!s.open) head.appendChild(mk('span', { class: 'badge' }, [akIcon('lock', 12), 'Ditutup']));
  stage.appendChild(head);
  stage.appendChild(mk('h2', { class: 'aud-title', id: 's-title', text: s.title }));
  stage.appendChild(mk('p', { class: 'aud-desc' + (s.type === 'announcement' ? ' big' : ''), id: 's-desc' }));
  var body = mk('div', { id: 's-body' });
  stage.appendChild(body);
  stage.appendChild(mk('div', { id: 's-results' }));
  var err = mk('div', { class: 'field-error', id: 's-err', style: 'margin-top:10px' });

  switch (s.type) {
    case 'announcement': break;
    case 'leaderboard': break;
    case 'poll': buildPoll(body, s, err); break;
    case 'multiplechoice': buildQuiz(body, s, phase, err); break;
    case 'wordcloud': buildWordcloud(body, s, err); break;
    case 'writing': buildWriting(body, s, err); break;
    case 'qna': buildQna(body, s, err); break;
    case 'scales': buildScales(body, s, err); break;
    case 'ranking': buildRanking(body, s, err); break;
  }
  if (body.childNodes.length && ['announcement', 'leaderboard'].indexOf(s.type) < 0) body.appendChild(err);
}

function closedNotice(body) {
  body.appendChild(mk('div', { class: 'notice warn' }, [akIcon('lock', 18), mk('span', { text: 'Jawaban untuk slide ini sudah ditutup.' })]));
}
function submittedNotice(body, label, value) {
  body.appendChild(mk('div', { class: 'notice good' }, [akIcon('check-circle', 18), mk('span', null, [label + ' ', value ? mk('b', { text: value }) : null])]));
}
function waitResultsNote(body, s) {
  body.appendChild(mk('p', { class: 'hint', id: 's-wait-note', style: 'margin-top:10px', hidden: !!s.showResults, text: 'Hasil akan ditampilkan di layar presenter.' }));
}

function submitBtn(label, icon) {
  return mk('button', { class: 'btn btn-primary btn-lg', type: 'button' }, [akIcon(icon || 'arrow-right', 18), label]);
}

function buildPoll(body, s, err) {
  var multi = s.config && s.config.multi;
  if (s.answered) {
    var mine = s.myAnswer || '';
    if (mine.charAt(0) === '[') { try { mine = JSON.parse(mine).join(', '); } catch (e) {} }
    submittedNotice(body, 'Pilihan Anda:', mine);
    waitResultsNote(body, s);
    return;
  }
  if (!s.open) { closedNotice(body); return; }
  var sel = [];
  var list = mk('div', { class: 'opt-list' });
  var btn = submitBtn('Kirim pilihan', 'check');
  btn.disabled = true;
  (s.options || []).forEach(function (o, i) {
    var b = mk('button', { class: 'opt' + (multi ? ' multi' : ''), type: 'button', 'aria-pressed': 'false' }, [
      mk('span', { class: 'opt-mark' }, multi ? [akIcon('check', 16)] : [String.fromCharCode(65 + i)]), mk('span', { class: 'opt-text', text: o })
    ]);
    b.addEventListener('click', function () {
      var at = sel.indexOf(o);
      if (multi) { if (at >= 0) sel.splice(at, 1); else sel.push(o); }
      else sel = [o];
      Array.prototype.forEach.call(list.children, function (c, k) {
        var on = sel.indexOf(s.options[k]) >= 0;
        c.classList.toggle('sel', on); c.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      btn.disabled = !sel.length;
    });
    list.appendChild(b);
  });
  if (multi) body.appendChild(mk('p', { class: 'hint', style: 'margin:-6px 0 12px', text: 'Anda boleh memilih lebih dari satu.' }));
  body.appendChild(list);
  btn.addEventListener('click', function () {
    if (!sel.length) return;
    var ordered = s.options.filter(function (o) { return sel.indexOf(o) >= 0; });
    submit(s, multi ? ordered : ordered[0], btn, err);
  });
  body.appendChild(mk('div', { style: 'display:flex;justify-content:flex-end' }, [btn]));
}

function buildQuiz(body, s, phase, err) {
  var q = s.quiz || {};
  if (phase === 'wait') {
    body.appendChild(mk('div', { class: 'big-state' }, [mk('span', { class: 'em', text: '\u23F3' }), mk('h3', { text: 'Bersiap!' }), mk('p', { class: 'muted', text: 'Presenter akan segera memulai soal ini.' })]));
    return;
  }
  if (phase === 'ready') {
    body.appendChild(mk('div', { class: 'big-state' }, [mk('p', { class: 'muted', style: 'margin-bottom:10px', text: 'Soal dimulai dalam' }), mk('div', { class: 'countdown-big', id: 'q-ready' })]));
    return;
  }
  if (phase === 'answer') {
    if (q.timed) {
      A.ring = akRing(64, 7);
      body.appendChild(mk('div', { class: 'quiz-bar' }, [A.ring.el, mk('div', null, [mk('b', { text: 'Jawab cepat untuk poin lebih besar!' }), mk('div', { class: 'small muted', text: 'Hingga 1.000 poin per soal.' })])]));
    }
    var grid = mk('div', { class: 'quiz-grid' });
    (s.options || []).forEach(function (o, i) {
      var b = mk('button', { class: 'quiz-opt', type: 'button', style: '--qc:' + akColor(i) }, [mk('span', { class: 'ql', text: String.fromCharCode(65 + i) }), mk('span', { text: o })]);
      b.addEventListener('click', function () {
        Array.prototype.forEach.call(grid.children, function (c) { c.disabled = true; c.style.opacity = c === b ? '1' : '.35'; });
        submit(s, o, null, err, function () { Array.prototype.forEach.call(grid.children, function (c) { c.disabled = false; c.style.opacity = '1'; }); });
      });
      grid.appendChild(b);
    });
    body.appendChild(grid);
    return;
  }
  if (phase === 'locked') {
    body.appendChild(mk('div', { class: 'big-state' }, [mk('span', { class: 'em', text: '\u{1F512}' }), mk('h3', { text: 'Jawaban terkunci' }), mk('p', { class: 'muted' }, ['Anda memilih ', mk('b', { text: s.myAnswer || '' }), '. Menunggu hasil…'])]));
    return;
  }
  if (phase === 'timeout') {
    body.appendChild(mk('div', { class: 'big-state' }, [mk('span', { class: 'em', text: '\u231B' }), mk('h3', { text: 'Waktu habis!' }), mk('p', { class: 'muted', text: 'Menunggu presenter menampilkan jawaban…' })]));
    return;
  }
  if (phase === 'result') {
    if (s.isCorrect === true) {
      body.appendChild(mk('div', { class: 'big-state' }, [mk('span', { class: 'em', text: '\u{1F389}' }), mk('h3', { text: 'Benar!' }), mk('div', { class: 'pts', text: '+' + akFmt(s.score || 0) + ' poin' })]));
      if (!A.local['conf_' + s.contentId]) { A.local['conf_' + s.contentId] = true; akConfetti(60); }
    } else if (s.isCorrect === false) {
      body.appendChild(mk('div', { class: 'big-state' }, [mk('span', { class: 'em', text: '\u{1F914}' }), mk('h3', { text: 'Belum tepat' }), mk('p', { class: 'muted' }, ['Jawaban yang benar adalah ', mk('b', { text: s.correctAnswer || '-' }), '. Anda memilih ', mk('b', { text: s.myAnswer || '' }), '.'])]));
    } else {
      submittedNotice(body, 'Jawaban terkirim:', s.myAnswer);
    }
    return;
  }
  // closed and not answered
  var children = [mk('span', { class: 'em', text: '\u{1F4DD}' }), mk('h3', { text: 'Soal ini sudah ditutup' })];
  if (s.correctAnswer) children.push(mk('p', { class: 'muted' }, ['Jawaban benar: ', mk('b', { text: s.correctAnswer })]));
  body.appendChild(mk('div', { class: 'big-state' }, children));
}

function buildWordcloud(body, s, err) {
  if (s.answered) {
    submittedNotice(body, 'Anda mengirim:', (s.myAnswer || '').split('\n').join(', '));
    waitResultsNote(body, s);
    return;
  }
  if (!s.open) { closedNotice(body); return; }
  var n = (s.config && s.config.maxEntries) || 1;
  var inputs = [];
  for (var i = 0; i < n; i++) {
    var inp = mk('input', { class: 'input input-lg', maxlength: '40', placeholder: n > 1 ? 'Isian ' + (i + 1) : 'Ketik kata atau frasa singkat', autocomplete: 'off' });
    inputs.push(inp);
    body.appendChild(mk('div', { style: 'margin-bottom:10px' }, [inp]));
  }
  var btn = submitBtn('Kirim');
  var go = function () {
    var vals = inputs.map(function (x) { return x.value.trim(); }).filter(Boolean);
    if (!vals.length) { err.textContent = 'Ketik minimal satu kata.'; return; }
    submit(s, vals, btn, err);
  };
  inputs.forEach(function (x) { x.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); go(); } }); });
  btn.addEventListener('click', go);
  body.appendChild(mk('div', { class: 'composer-foot' }, [mk('span', { class: 'hint', text: 'Maksimal 4 kata per isian.' }), btn]));
}

function buildWriting(body, s, err) {
  if (s.answered) {
    submittedNotice(body, 'Jawaban Anda sudah terkirim.');
    body.appendChild(mk('div', { class: 'card', style: 'padding:14px 16px;margin-top:12px;white-space:pre-wrap;word-break:break-word;background:var(--surface-2)', text: s.myAnswer || '' }));
    return;
  }
  if (!s.open) { closedNotice(body); return; }
  var max = (s.config && s.config.maxLength) || 1000;
  var ta = mk('textarea', { class: 'textarea', rows: '6', maxlength: String(max), placeholder: 'Tulis jawaban Anda di sini…' });
  var counter = mk('span', { class: 'counter', text: '0 / ' + max });
  ta.addEventListener('input', function () { counter.textContent = ta.value.length + ' / ' + max; });
  var btn = submitBtn('Kirim');
  btn.addEventListener('click', function () { submit(s, ta.value, btn, err); });
  body.appendChild(ta);
  body.appendChild(mk('div', { class: 'composer-foot' }, [counter, btn]));
}

function buildQna(body, s, err) {
  var max = (s.config && s.config.maxQuestions) || 1;
  if (!s.open) { closedNotice(body); return; }
  if ((s.myCount || 0) >= max) {
    body.appendChild(mk('div', { class: 'notice' }, [akIcon('check-circle', 18), mk('span', { text: 'Anda sudah memakai semua (' + max + ') kesempatan bertanya. Dukung pertanyaan yang ingin Anda dengar jawabannya!' })]));
    return;
  }
  var ta = mk('textarea', { class: 'textarea', rows: '3', maxlength: '300', placeholder: 'Ajukan pertanyaan…' });
  var counter = mk('span', { class: 'counter', text: '0 / 300 \u00B7 ' + 'sisa ' + (max - (s.myCount || 0)) });
  ta.addEventListener('input', function () { counter.textContent = ta.value.length + ' / 300 \u00B7 ' + 'sisa ' + (max - (s.myCount || 0)); });
  var btn = submitBtn('Kirim pertanyaan', 'message');
  btn.addEventListener('click', function () { submit(s, ta.value, btn, err); });
  body.appendChild(ta);
  body.appendChild(mk('div', { class: 'composer-foot' }, [counter, btn]));
}

function buildScales(body, s, err) {
  if (s.answered) { submittedNotice(body, 'Terima kasih! Penilaian Anda sudah terkirim.'); waitResultsNote(body, s); return; }
  if (!s.open) { closedNotice(body); return; }
  var c = s.config || { min: 1, max: 5 };
  var mid = Math.round((c.min + c.max) / 2);
  var vals = (s.options || []).map(function () { return mid; });
  (s.options || []).forEach(function (st, i) {
    var val = mk('span', { class: 'sq-val', text: String(mid) });
    var r = mk('input', { type: 'range', min: String(c.min), max: String(c.max), step: '1', value: String(mid), 'aria-label': st });
    r.addEventListener('input', function () { vals[i] = Number(r.value); val.textContent = r.value; });
    body.appendChild(mk('div', { class: 'scale-q' }, [
      mk('div', { class: 'sq-top' }, [mk('span', { text: st }), val]), r,
      mk('div', { class: 'sq-ends' }, [mk('span', { text: c.min + ' \u00B7 ' + (c.minLabel || '') }), mk('span', { text: (c.maxLabel || '') + ' \u00B7 ' + c.max })])
    ]));
  });
  var btn = submitBtn('Kirim penilaian', 'check');
  btn.addEventListener('click', function () { submit(s, vals, btn, err); });
  body.appendChild(mk('div', { style: 'display:flex;justify-content:flex-end;margin-top:14px' }, [btn]));
}

function buildRanking(body, s, err) {
  if (s.answered) {
    var arr = []; try { arr = JSON.parse(s.myAnswer || '[]'); } catch (e) {}
    submittedNotice(body, 'Urutan Anda:', arr.map(function (x, i) { return (i + 1) + '. ' + x; }).join('  '));
    waitResultsNote(body, s);
    return;
  }
  if (!s.open) { closedNotice(body); return; }
  var order = (s.options || []).slice();
  var list = mk('div', { class: 'rank-edit' });
  var draw = function () {
    akClear(list);
    order.forEach(function (o, i) {
      var up = mk('button', { class: 'icon-btn sm', type: 'button', 'aria-label': 'Naikkan', disabled: i === 0 }, [akIcon('chevron-up', 18)]);
      var dn = mk('button', { class: 'icon-btn sm', type: 'button', 'aria-label': 'Turunkan', disabled: i === order.length - 1 }, [akIcon('chevron-down', 18)]);
      up.addEventListener('click', function () { var t = order[i - 1]; order[i - 1] = order[i]; order[i] = t; draw(); });
      dn.addEventListener('click', function () { var t = order[i + 1]; order[i + 1] = order[i]; order[i] = t; draw(); });
      list.appendChild(mk('div', { class: 'rank-item' }, [mk('span', { class: 'rp', text: String(i + 1) }), mk('span', { class: 'rt', text: o }), up, dn]));
    });
  };
  draw();
  body.appendChild(mk('p', { class: 'hint', style: 'margin:-6px 0 12px', text: 'Gunakan tanda panah untuk menaruh prioritas utama di urutan teratas.' }));
  body.appendChild(list);
  var btn = submitBtn('Kirim urutan', 'check');
  btn.addEventListener('click', function () { submit(s, order.slice(), btn, err); });
  body.appendChild(mk('div', { style: 'display:flex;justify-content:flex-end' }, [btn]));
}

function updateSlide(s) {
  var t = el('s-title'); if (t && t.textContent !== s.title) t.textContent = s.title;
  var d = el('s-desc'); if (d) { d.textContent = s.description || ''; d.hidden = !s.description; }
  var note = el('s-wait-note'); if (note) note.hidden = !!s.showResults;
  var box = el('s-results'); if (!box) return;

  if (s.type === 'qna') { renderQuestions(box, s); return; }
  if (s.type === 'leaderboard') {
    if (!box._lb) {
      box._me = mk('div'); box._lb = mk('div');
      box.appendChild(box._me); box.appendChild(box._lb);
    }
    var lb = s.leaderboard || {};
    akClear(box._me);
    if (lb.me) box._me.appendChild(mk('div', { class: 'me-card' }, [mk('div', null, [mk('div', { class: 'small', style: 'opacity:.85', text: 'Posisi Anda' }), mk('div', { class: 'r', text: '#' + lb.me.rank + ' dari ' + lb.me.of })]), mk('div', { style: 'text-align:right' }, [mk('div', { class: 'small', style: 'opacity:.85', text: 'Poin' }), mk('div', { class: 'r', text: akFmt(lb.me.score) })])]));
    akLeaderboardInto(box._lb, lb, {});
    return;
  }
  if (!s.showResults) { if (box._inner) { akClear(box); box._inner = null; } return; }
  if (!box._inner) {
    box._count = mk('span');
    box.appendChild(mk('div', { class: 'results-head' }, [mk('span', { text: 'Hasil langsung' }), box._count]));
    box._inner = mk('div');
    box.appendChild(box._inner);
  }
  box._count.textContent = akFmt(s.respondents || 0) + ' jawaban';
  if (s.type === 'poll') akBarsInto(box._inner, s.results);
  else if (s.type === 'multiplechoice') akBarsInto(box._inner, s.results, { showCorrect: true });
  else if (s.type === 'wordcloud') akCloudInto(box._inner, s.words);
  else if (s.type === 'scales') akScalesInto(box._inner, s.scales, s.config);
  else if (s.type === 'ranking') akRankingInto(box._inner, s.ranking);
}

function renderQuestions(box, s) {
  var qs = s.questions || [];
  var sig = JSON.stringify(qs) + s.open;
  if (box._sig === sig) return;
  box._sig = sig;
  akClear(box);
  box.appendChild(mk('div', { class: 'results-head' }, [mk('span', { text: 'Pertanyaan' }), mk('span', { text: String(qs.length) })]));
  if (!qs.length) { box.appendChild(mk('p', { class: 'muted small', text: 'Belum ada pertanyaan — jadilah yang pertama bertanya!' })); return; }
  var list = mk('div', { class: 'qa-list' });
  qs.forEach(function (q) {
    var meta = mk('div', { class: 'qa-meta' });
    if (q.isMine) meta.appendChild(mk('span', { class: 'badge badge-primary', text: 'Pertanyaan Anda' }));
    if (q.state === 'pending') meta.appendChild(mk('span', { class: 'badge badge-warning', text: 'Menunggu persetujuan' }));
    if (q.state === 'answered') meta.appendChild(mk('span', { class: 'badge badge-success' }, [akIcon('check', 12), 'Sudah dijawab']));
    var vote = mk('button', { class: 'vote-btn' + (q.iVoted ? ' voted' : ''), type: 'button', disabled: q.isMine || q.state !== 'visible' || !s.open, title: q.isMine ? 'Pertanyaan Anda' : (q.iVoted ? 'Batalkan dukungan' : 'Dukung pertanyaan ini') }, [akIcon('arrow-up', 16), mk('span', { text: String(q.upvotes) })]);
    vote.addEventListener('click', function () { doUpvote(q, vote); });
    list.appendChild(mk('div', { class: 'qa-item' + (q.isMine ? ' mine' : '') + (q.state === 'answered' ? ' answered' : '') + (q.state === 'pending' ? ' pending' : '') }, [
      mk('div', { class: 'qa-text' }, [mk('div', { text: q.text }), meta.childNodes.length ? meta : null]), vote
    ]));
  });
  box.appendChild(list);
}

function doUpvote(q, btn) {
  btn.disabled = true;
  // optimistic UI
  var n = btn.querySelector('span');
  q.iVoted = !q.iVoted; q.upvotes += q.iVoted ? 1 : -1;
  btn.classList.toggle('voted', q.iVoted); if (n) n.textContent = String(q.upvotes);
  akCall('toggleUpvote', [S.pid, S.token, q.responseId], function (res) {
    if (!res.success) akToast(res.message, 'error');
    var box = el('s-results'); if (box) box._sig = null;
    A.poller.now();
  }, function (m, auth) { if (!auth) akToast('Dukungan Anda gagal dicatat.', 'error'); btn.disabled = false; });
}

function submit(s, value, btn, err, onFail) {
  if (err) err.textContent = '';
  if (btn) akBusy(btn, true, 'Mengirim…');
  akCall('submitResponse', [S.pid, S.token, s.contentId, value], function (res) {
    if (btn) akBusy(btn, false);
    if (!res.success) {
      if (err) err.textContent = res.message; else akToast(res.message, 'error');
      if (onFail) onFail();
      if (res.alreadyAnswered || res.closed || res.timeUp) { A.slideKey = null; A.poller.now(); }
      return;
    }
    if (s.type === 'qna') {
      A.qnaLocal[s.contentId] = Math.max(A.qnaLocal[s.contentId] || 0, s.myCount || 0) + 1;
      akToast(res.pending ? 'Terkirim! Pertanyaan akan tampil setelah disetujui host.' : 'Pertanyaan terkirim!', 'success');
      var box = el('s-results'); if (box) box._sig = null;
    } else {
      A.local[s.contentId] = { answer: res.value, isCorrect: res.isCorrect, correctAnswer: res.correctAnswer, score: res.score };
      akToast('Terkirim!', 'success', 1800);
    }
    try { if (navigator.vibrate) navigator.vibrate(25); } catch (e) {}
    A.slideKey = null;
    if (A.last) renderCurrent(A.last, A.data && A.data.session);
    A.poller.now();
  }, function (m, auth) {
    if (btn) akBusy(btn, false);
    if (onFail) onFail();
    if (!auth && err) err.textContent = 'Gagal mengirim. Periksa koneksi Anda lalu coba lagi.';
  });
}

/* Ticker: countdowns and quiz phase changes between server refreshes */
function tick() {
  var d = A.data;
  var wrap = $id('aud-timer'), pill = $id('aud-timer-pill');
  if (d && d.timer && d.timer.end) {
    var left = d.timer.end - akClock.now();
    wrap.hidden = left < -3000;
    akClear(pill);
    pill.appendChild(akIcon('timer', 16));
    pill.appendChild(document.createTextNode((d.timer.label ? d.timer.label + ' \u00B7 ' : '') + (left > 0 ? akMMSS(left) : 'Waktu habis!')));
    pill.classList.toggle('done', left <= 0);
  } else wrap.hidden = true;

  var s = A.last;
  if (!s || s.type !== 'multiplechoice') return;
  var phase = quizPhase(s);
  if (phase !== A.phase) { renderCurrent(s, d && d.session); return; }
  var q = s.quiz || {};
  if (phase === 'ready') { var r = $id('q-ready'); if (r) r.textContent = String(Math.max(1, Math.ceil((q.start - akClock.now()) / 1000))); }
  if (phase === 'answer' && A.ring && q.timed) {
    var rem = q.end - akClock.now();
    A.ring.set(rem / (q.limit * 1000), String(Math.max(0, Math.ceil(rem / 1000))));
  }
}

/* Reactions */
function buildReactions() {
  var bar = akClear($id('aud-react'));
  Object.keys(AK_REACTIONS).forEach(function (k) {
    var b = mk('button', { type: 'button', title: 'Kirim reaksi', 'aria-label': 'Kirim reaksi ' + k, text: AK_REACTIONS[k] });
    b.addEventListener('click', function () {
      var now = Date.now();
      if (now - A.rxLast < 1500) return;
      A.rxLast = now;
      akFloatReaction($id('rx-local'), k);
      Array.prototype.forEach.call(bar.children, function (c) { c.disabled = true; });
      setTimeout(function () { Array.prototype.forEach.call(bar.children, function (c) { c.disabled = false; }); }, 1500);
      akCall('sendReaction', [S.pid, S.token, k], null, function () {});
    });
    bar.appendChild(b);
  });
}

/* Focus mode */
function setFocusMode(on, name, email) {
  if (on === A.focus) return;
  A.focus = !!on;
  document.body.classList.toggle('focus-on', A.focus);
  var wm = $id('watermark');
  akClear(wm);
  if (A.focus) {
    var line = (name || '') + (email ? '  \u2022  ' + email : '') + '  \u2022  ' + new Date().toLocaleDateString('id-ID');
    for (var i = 0; i < 22; i++) wm.appendChild(mk('div', { class: 'wm-row', text: new Array(6).join(line + '        ') }));
  } else {
    $id('focus-overlay').classList.remove('show');
  }
}
function onLeavePage() {
  if (!A.focus || $id('audience').hidden) return;
  if (!$id('focus-overlay').classList.contains('show')) A.away++;
  $id('focus-overlay').classList.add('show');
}
document.addEventListener('visibilitychange', function () { if (document.hidden) onLeavePage(); });
window.addEventListener('blur', onLeavePage);
$id('btn-focus-back').addEventListener('click', function () { $id('focus-overlay').classList.remove('show'); });
document.addEventListener('contextmenu', function (e) { if (A.focus) e.preventDefault(); });
document.addEventListener('copy', function (e) { if (A.focus && !/INPUT|TEXTAREA/.test((e.target && e.target.tagName) || '')) e.preventDefault(); });

/* Leave / session end */
$id('btn-leave').addEventListener('click', function () {
  akConfirm({ title: 'Keluar dari sesi ini?', message: 'Jawaban Anda tetap tersimpan. Anda bisa kembali kapan saja dengan kode yang sama' + (S.identity === 'full' ? ', serta nama dan email yang sama.' : '.'), cancelText: 'Tetap di sini', confirmText: 'Keluar', icon: 'log-out', tone: 'warning', danger: true, onConfirm: function () { leave(); } });
});

function leave() {
  if (A.poller) A.poller.stop();
  clearInterval(A.ticker);
  akStore.set('pid', null); akStore.set('ptoken', null);
  S.pid = null; S.token = null;
  A.local = {}; A.qnaLocal = {}; A.slideKey = null; A.last = null; A.data = null; A.selected = null;
  setFocusMode(false);
  $id('focus-overlay').classList.remove('show');
  codeInput.value = '';
  showLanding();
}

window.akOnAuthError = function (msg) {
  if (!S.pid) return;
  var closed = /SESSION_CLOSED/.test(msg), removed = /SESSION_REMOVED/.test(msg);
  leave();
  akAlert(
    closed ? 'Sesi berakhir' : removed ? 'Anda dikeluarkan dari sesi' : 'Silakan bergabung kembali',
    closed ? 'Host telah menutup sesi ini. Terima kasih sudah berpartisipasi!' : removed ? 'Host telah mengeluarkan Anda dari sesi ini.' : 'Sesi Anda tidak berlaku lagi (misalnya karena Anda bergabung dari perangkat lain).',
    'OK', null, closed ? 'check-circle' : 'info');
};

/* Boot: resume a session, or use a ?code= link */
(function boot() {
  var pid = akStore.get('pid'), token = akStore.get('ptoken');
  var prefill = akAppData('code');
  if (pid && token) {
    akCall('resumeSession', [pid, token], function (res) {
      if (res.success) {
        S.pid = pid; S.token = token; S.eventId = res.eventId; S.eventName = res.eventName; S.facilitator = res.facilitator;
        enterLive();
      } else {
        akStore.set('pid', null); akStore.set('ptoken', null);
        if (prefill) { codeInput.value = prefill; submitCode(); }
      }
    }, function () {});
    return;
  }
  if (prefill) { codeInput.value = /^\d{8}$/.test(prefill) ? prefill.slice(0, 4) + ' ' + prefill.slice(4) : prefill; submitCode(); }
})();
