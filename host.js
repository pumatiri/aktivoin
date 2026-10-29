var H = {
  token: null, me: null, sessions: [], filter: 'all', legacy: false,
  eventId: null, ed: null, tab: 'slides', form: null, dirty: false, saving: false,
  edTimer: null, partTimer: null, parts: null, settingsDraft: null
};
var TEMPLATES = [
  { id: 'blank', icon: 'plus', color: 'var(--c8)', name: 'Kosong', desc: 'Mulai dari nol.' },
  { id: 'classroom', icon: 'graduation', color: 'var(--c1)', name: 'Kelas', desc: 'Pemanasan, kuis, papan skor, tanya jawab, exit ticket.' },
  { id: 'meeting', icon: 'briefcase', color: 'var(--c2)', name: 'Rapat bisnis', desc: 'Agenda, polling cepat, prioritas, umpan balik.' },
  { id: 'retro', icon: 'refresh-cw', color: 'var(--c3)', name: 'Retrospektif', desc: 'Anonim: yang berjalan baik, perbaikan, langkah berikutnya.' }
];

akSetLogo(['logo-gate', 'logo-top']);
akMountTheme('theme-gate');
akMountTheme('theme-top');
$id('gate-home').href = AK_SITE.home;
$id('search-wrap').insertBefore(akIcon('search', 18), $id('search'));
$id('btn-new').appendChild(akIcon('plus', 18)); $id('btn-new').appendChild(document.createTextNode('Sesi baru'));
$id('btn-import').appendChild(akIcon('download', 17)); $id('btn-import').appendChild(document.createTextNode('Impor sesi v2'));
$id('btn-back').appendChild(akIcon('arrow-left', 20));
$id('btn-add-slide').appendChild(akIcon('plus', 18)); $id('btn-add-slide').appendChild(document.createTextNode('Tambah slide'));
[['slides', 'layers', 'Slide'], ['participants', 'users', 'Peserta'], ['settings', 'settings', 'Pengaturan'], ['report', 'file-text', 'Laporan']].forEach(function (t) {
  var b = document.querySelector('[data-tab="' + t[0] + '"]');
  b.appendChild(akIcon(t[1], 17)); b.appendChild(document.createTextNode(t[2]));
  if (t[0] === 'slides' || t[0] === 'participants') b.appendChild(mk('span', { class: 'count', id: 'count-' + t[0] }));
  b.addEventListener('click', function () { switchTab(t[0]); });
});

window.akOnAuthError = function (msg) {
  if (!H.token) return;
  logout(true);
  akToast(/FORBIDDEN/.test(msg) ? 'Anda tidak memiliki akses ke sesi tersebut.' : 'Sesi login Anda telah berakhir. Silakan masuk kembali.', 'info', 4000);
};

/* ================= Auth ================= */
function showGate() {
  $id('app').hidden = true;
  $id('gate').hidden = false;
  var slot = akClear($id('gate-auth'));
  var onOk = function (res) { H.token = res.token; H.me = res.host; enterApp(); };
  var panel = akAuthPanel({ tabs: ['login', 'register'], inviteRequired: false, onSuccess: onOk });
  slot.appendChild(panel);
  akPublicConfig(function (cfg) {
    if (cfg.inviteRequired && slot.contains(panel)) slot.replaceChild(akAuthPanel({ tabs: ['login', 'register'], inviteRequired: true, onSuccess: onOk }), panel);
  });
}

function enterApp() {
  $id('gate').hidden = true;
  $id('app').hidden = false;
  renderUser();
  var target = akAppData('session');
  if (target && !H._openedParam) { H._openedParam = true; openEditor(target); }
  else showList();
}

function renderUser() {
  var n = (H.me && H.me.name) || 'Host';
  $id('avatar').textContent = n.split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join('');
  $id('uname').textContent = n;
  var first = n.split(/[\s,]+/).filter(function (w) { return w && !/^(dr|drs|dra|prof|ir|h|hj|ust|ustadz|ustadzah|bapak|ibu|pak|bu|mr|mrs|ms|miss|sir)\.?$/i.test(w); })[0] || n;
  $id('hello').textContent = 'Halo, ' + first + ' \u{1F44B}';
}

function logout(silent) {
  if (H.token && !silent) akCall('logoutSession', [H.token], null, function () {});
  akStore.set('host_token', null, true);
  H.token = null; H.me = null;
  clearInterval(H.edTimer); clearInterval(H.partTimer);
  showGate();
}

function confirmLogout() {
  var m = $id('user-menu'); if (m) m.parentNode.removeChild(m);
  akConfirm({
    title: 'Keluar dari akun?', icon: 'log-out', tone: 'warning',
    message: H.dirty ? 'Ada perubahan slide yang belum disimpan. Perubahan itu akan hilang jika Anda keluar sekarang.' : 'Anda perlu masuk lagi untuk mengelola sesi. Sesi dan hasil Anda tetap tersimpan.',
    cancelText: 'Tetap di sini', confirmText: 'Keluar', danger: true,
    onConfirm: function () { H.dirty = false; logout(false); }
  });
}

$id('user-btn').addEventListener('click', function (e) {
  e.stopPropagation();
  var existing = $id('user-menu');
  if (existing) { existing.parentNode.removeChild(existing); return; }
  var r = e.currentTarget.getBoundingClientRect();
  var menu = mk('div', { class: 'menu', id: 'user-menu', style: 'position:fixed;top:' + (r.bottom + 8) + 'px;right:' + Math.max(12, window.innerWidth - r.right) + 'px' }, [
    mk('div', { class: 'menu-head' }, [mk('b', { text: H.me.name }), mk('div', { class: 'small muted ellipsis', text: H.me.email }), H.me.institution ? mk('div', { class: 'tiny faint', text: H.me.institution }) : null]),
    mk('button', { class: 'menu-item', type: 'button', onclick: profileModal }, [akIcon('user', 17), 'Profil']),
    mk('button', { class: 'menu-item', type: 'button', onclick: passwordModal }, [akIcon('key', 17), 'Ganti kata sandi']),
    mk('a', { class: 'menu-item', href: AK_SITE.home }, [akIcon('monitor', 17), 'Halaman awal']),
    mk('button', { class: 'menu-item danger', type: 'button', onclick: confirmLogout }, [akIcon('log-out', 17), 'Keluar'])
  ]);
  document.body.appendChild(menu);
});
document.addEventListener('click', function (e) {
  var m = $id('user-menu');
  if (m && !m.contains(e.target)) m.parentNode.removeChild(m);
});

function profileModal() {
  var name = mk('input', { class: 'input', value: H.me.name, maxlength: '80' });
  var inst = mk('input', { class: 'input', value: H.me.institution || '', maxlength: '120' });
  var err = mk('div', { class: 'field-error' });
  akModal({
    title: 'Profil Anda', icon: 'user',
    body: mk('div', { style: 'margin-top:14px' }, [
      mk('div', { class: 'field' }, [mk('label', { class: 'label', text: 'Nama lengkap' }), name, mk('span', { class: 'hint', text: 'Dipakai sebagai nama fasilitator bawaan untuk sesi baru dan laporan.' })]),
      mk('div', { class: 'field' }, [mk('label', { class: 'label', text: 'Institusi' }), inst]), err
    ]),
    actions: [{ label: 'Batal', kind: 'btn-ghost' }, { label: 'Simpan', onClick: function (btn) {
      akBusy(btn, true);
      akCall('updateProfile', [H.token, { name: name.value, institution: inst.value }], function (res) {
        akBusy(btn, false);
        if (!res.success) { err.textContent = res.message; return; }
        H.me = res.host; renderUser(); akToast('Profil disimpan', 'success');
        var m = document.querySelector('.ak-modal-backdrop'); if (m) m.parentNode.removeChild(m);
      }, function () { akBusy(btn, false); err.textContent = 'Gagal menyimpan.'; });
      return false;
    } }]
  });
}

function passwordModal() {
  var a = akPasswordInput('pw-old', 'Kata sandi saat ini'), b = akPasswordInput('pw-new', 'Kata sandi baru', 'new-password'), c = akPasswordInput('pw-new2', 'Ulangi kata sandi baru', 'new-password');
  var err = mk('div', { class: 'field-error' });
  var m = akModal({
    title: 'Ganti kata sandi', icon: 'key',
    body: mk('div', { style: 'margin-top:14px' }, [
      mk('div', { class: 'field' }, [mk('label', { class: 'label', text: 'Kata sandi saat ini' }), a.wrap]),
      mk('div', { class: 'field' }, [mk('label', { class: 'label', text: 'Kata sandi baru' }), b.wrap]),
      mk('div', { class: 'field' }, [mk('label', { class: 'label', text: 'Ulangi kata sandi baru' }), c.wrap]), err
    ]),
    actions: [{ label: 'Batal', kind: 'btn-ghost' }, { label: 'Perbarui kata sandi', onClick: function (btn) {
      err.textContent = '';
      if (b.input.value !== c.input.value) { err.textContent = 'Kata sandi baru tidak sama.'; return false; }
      akBusy(btn, true);
      akCall('changePassword', [H.token, a.input.value, b.input.value], function (res) {
        akBusy(btn, false);
        if (!res.success) { err.textContent = res.message; return; }
        akToast('Kata sandi diperbarui', 'success'); m.close();
      }, function () { akBusy(btn, false); err.textContent = 'Gagal memperbarui.'; });
      return false;
    } }]
  });
}

/* ================= Sessions list ================= */
$id('brand-home').addEventListener('click', function () { guardLeave(showList); });
$id('btn-back').addEventListener('click', function () { guardLeave(showList); });
$id('btn-new').addEventListener('click', newSessionModal);
$id('btn-import').addEventListener('click', importModal);
$id('search').addEventListener('input', renderSessions);
document.querySelectorAll('#filter-seg .seg-btn').forEach(function (b) {
  b.addEventListener('click', function () {
    H.filter = b.getAttribute('data-f');
    document.querySelectorAll('#filter-seg .seg-btn').forEach(function (x) { x.classList.toggle('active', x === b); });
    renderSessions();
  });
});

function showList() {
  clearInterval(H.edTimer); clearInterval(H.partTimer);
  H.eventId = null; H.ed = null; H.form = null; H.dirty = false;
  $id('view-editor').hidden = true;
  $id('view-list').hidden = false;
  window.scrollTo(0, 0);
  var grid = akClear($id('session-grid'));
  for (var i = 0; i < 3; i++) grid.appendChild(mk('div', { class: 'skeleton', style: 'height:196px' }));
  loadSessions();
}

function loadSessions() {
  akCall('listMySessions', [H.token], function (res) {
    H.sessions = res.sessions || [];
    H.legacy = !!res.legacyAvailable;
    if (res.host) { H.me = res.host; renderUser(); }
    $id('btn-import').hidden = !H.legacy;
    renderStats();
    renderSessions();
  }, function (m, auth) { if (!auth) akClear($id('session-grid')).appendChild(mk('div', { class: 'empty', text: 'Gagal memuat sesi Anda. Silakan muat ulang halaman.' })); });
}

function renderStats() {
  var box = akClear($id('list-stats'));
  var total = H.sessions.length;
  var open = H.sessions.filter(function (s) { return s.status === 'active'; }).length;
  var people = H.sessions.reduce(function (a, s) { return a + s.participants; }, 0);
  var slides = H.sessions.reduce(function (a, s) { return a + s.slides; }, 0);
  [['layers', 'var(--c1)', total, 'Sesi'], ['activity', 'var(--c7)', open, 'Sedang terbuka'], ['users', 'var(--c2)', people, 'Peserta'], ['grid', 'var(--c4)', slides, 'Slide']].forEach(function (s) {
    box.appendChild(mk('div', { class: 'card stat' }, [mk('span', { class: 'si', style: '--sc:' + s[1] }, [akIcon(s[0], 22)]), mk('div', null, [mk('div', { class: 'sv', text: akFmt(s[2]) }), mk('div', { class: 'sl', text: s[3] })])]));
  });
}

function renderSessions() {
  var grid = akClear($id('session-grid'));
  var q = $id('search').value.trim().toLowerCase();
  var list = H.sessions.filter(function (s) {
    if (H.filter !== 'all' && s.status !== H.filter) return false;
    return !q || (s.name + ' ' + s.code + ' ' + s.facilitator).toLowerCase().indexOf(q) >= 0;
  });
  grid.appendChild(mk('button', { class: 'card s-card new-card', type: 'button', onclick: newSessionModal }, [mk('div', null, [mk('div', { class: 'empty-ic', style: 'width:54px;height:54px;border-radius:18px;margin:0 auto 10px;display:grid;place-items:center;background:var(--primary-soft);color:var(--primary)' }, [akIcon('plus', 26)]), mk('b', { text: 'Sesi baru' }), mk('div', { class: 'small', text: 'Kosong atau dari template' })])]));
  if (!list.length && H.sessions.length) grid.appendChild(mk('div', { class: 'empty', style: 'grid-column:1/-1', text: 'Tidak ada sesi yang cocok dengan pencarian.' }));
  list.forEach(function (s, i) {
    var present = mk('a', { class: 'btn btn-sm btn-secondary', href: AK_SITE.presenter(s.id), target: '_blank', rel: 'noopener', onclick: function (e) { e.stopPropagation(); } }, [akIcon('play', 15), 'Presentasikan']);
    var dup = mk('button', { class: 'icon-btn sm', type: 'button', title: 'Gandakan', 'aria-label': 'Gandakan' }, [akIcon('copy', 17)]);
    var del = mk('button', { class: 'icon-btn sm danger', type: 'button', title: 'Hapus', 'aria-label': 'Hapus' }, [akIcon('trash', 17)]);
    dup.addEventListener('click', function (e) { e.stopPropagation(); duplicateSession(s, dup); });
    del.addEventListener('click', function (e) { e.stopPropagation(); deleteSession(s); });
    grid.appendChild(mk('div', { class: 'card s-card', style: 'animation-delay:' + Math.min(i * 40, 400) + 'ms', tabindex: '0', onclick: function () { openEditor(s.id); }, onkeydown: function (e) { if (e.key === 'Enter') openEditor(s.id); } }, [
      mk('div', { class: 'row', style: 'justify-content:space-between' }, [
        mk('span', { class: 'badge ' + (s.status === 'active' ? 'badge-success' : '') }, [s.status === 'active' ? mk('span', { class: 'live-dot' }) : akIcon('lock', 12), s.status === 'active' ? 'Terbuka' : 'Ditutup']),
        mk('span', { class: 'code-chip', style: 'font-size:13px;padding:3px 10px', text: s.code })
      ]),
      mk('h3', { text: s.name }),
      mk('div', { class: 's-meta' }, [mk('span', null, [akIcon('user', 14), s.facilitator]), mk('span', null, [akIcon('layers', 14), s.slides + ' slide']), mk('span', null, [akIcon('users', 14), s.participants + ' bergabung'])]),
      mk('div', { class: 'tiny faint', text: 'Diperbarui ' + akAgo(s.updatedAt) }),
      mk('div', { class: 's-actions' }, [mk('button', { class: 'btn btn-sm btn-soft', type: 'button' }, [akIcon('edit', 15), 'Edit']), present, mk('span', { class: 'grow' }), dup, del])
    ]));
  });
}

function newSessionModal() {
  var name = mk('input', { class: 'input', placeholder: 'mis. Biologi X-A — Fotosintesis', maxlength: '120', autofocus: true });
  var fac = mk('input', { class: 'input', value: (H.me && H.me.name) || '', maxlength: '120' });
  var desc = mk('textarea', { class: 'textarea', rows: '2', maxlength: '500', placeholder: 'Opsional — tampil di laporan' });
  var tpl = 'classroom';
  var grid = mk('div', { class: 'tpl-grid' });
  TEMPLATES.forEach(function (t) {
    var b = mk('button', { class: 'tpl' + (t.id === tpl ? ' sel' : ''), type: 'button' }, [mk('span', { class: 'ti', style: 'background:' + t.color }, [akIcon(t.icon, 19)]), mk('div', null, [mk('b', { text: t.name }), mk('span', { text: t.desc })])]);
    b.addEventListener('click', function () { tpl = t.id; Array.prototype.forEach.call(grid.children, function (c) { c.classList.toggle('sel', c === b); }); });
    grid.appendChild(b);
  });
  var err = mk('div', { class: 'field-error' });
  var m = akModal({
    title: 'Sesi baru', size: 'lg', icon: 'sparkles',
    body: mk('div', { style: 'margin-top:14px' }, [
      mk('div', { class: 'field' }, [mk('label', { class: 'label', text: 'Nama sesi' }), name]),
      mk('div', { class: 'grid-2' }, [
        mk('div', { class: 'field' }, [mk('label', { class: 'label', text: 'Fasilitator (guru / dosen / mentor)' }), fac]),
        mk('div', { class: 'field' }, [mk('label', { class: 'label', html: null, text: 'Deskripsi' }), desc])
      ]),
      mk('div', { class: 'field' }, [mk('label', { class: 'label', text: 'Mulai dari' }), grid]), err
    ]),
    actions: [{ label: 'Batal', kind: 'btn-ghost' }, { label: 'Buat sesi', onClick: function (btn) {
      err.textContent = '';
      if (!name.value.trim()) { err.textContent = 'Beri nama sesi Anda.'; name.focus(); return false; }
      akBusy(btn, true, 'Membuat…');
      akCall('createSession', [H.token, { name: name.value, facilitator: fac.value, description: desc.value, template: tpl }], function (res) {
        akBusy(btn, false);
        if (!res.success) { err.textContent = res.message; return; }
        m.close(); akToast('Sesi dibuat', 'success'); openEditor(res.eventId);
      }, function () { akBusy(btn, false); err.textContent = 'Gagal membuat sesi.'; });
      return false;
    } }]
  });
}

function importModal() {
  var key = mk('input', { class: 'input', type: 'password', placeholder: 'AdminKey dari versi 2', autocomplete: 'off', maxlength: '64' });
  var err = mk('div', { class: 'field-error' });
  var m = akModal({
    title: 'Impor sesi versi 2', icon: 'download',
    message: 'Sesi yang dibuat sebelum ada fitur akun dapat dipindahkan ke akun Anda menggunakan AdminKey-nya (lihat sheet Events atau log setup).',
    body: mk('div', { style: 'margin-top:14px' }, [key, err]),
    actions: [{ label: 'Batal', kind: 'btn-ghost' }, { label: 'Impor', onClick: function (btn) {
      akBusy(btn, true);
      akCall('claimLegacySession', [H.token, key.value], function (res) {
        akBusy(btn, false);
        if (!res.success) { err.textContent = res.message; return; }
        m.close(); akToast('"' + res.name + '" imported', 'success'); loadSessions();
      }, function () { akBusy(btn, false); err.textContent = 'Gagal mengimpor.'; });
      return false;
    } }]
  });
}

function duplicateSession(s, btn) {
  btn.disabled = true;
  akCall('duplicateSession', [H.token, s.id], function (res) {
    btn.disabled = false;
    if (!res.success) { akToast(res.message, 'error'); return; }
    akToast('Salinan dibuat dengan kode baru', 'success'); loadSessions();
  }, function () { btn.disabled = false; });
}

function deleteSession(s, after) {
  var confirmInput = mk('input', { class: 'input', placeholder: 'Ketik HAPUS untuk konfirmasi', autocomplete: 'off' });
  akModal({
    title: 'Hapus "' + s.name + '"?', icon: 'trash', danger: true,
    message: 'Semua slide, jawaban, dan daftar peserta akan dihapus permanen. Unduh laporan PDF terlebih dahulu jika hasilnya masih diperlukan.',
    body: mk('div', { style: 'margin-top:14px' }, [confirmInput]),
    actions: [{ label: 'Batal', kind: 'btn-ghost' }, { label: 'Hapus permanen', kind: 'btn-solid-danger', onClick: function (btn) {
      if (confirmInput.value.trim().toUpperCase() !== 'HAPUS') { confirmInput.focus(); akToast('Ketik HAPUS untuk konfirmasi', 'info'); return false; }
      akBusy(btn, true);
      akCall('deleteSession', [H.token, s.id], function (res) {
        akBusy(btn, false);
        if (!res.success) { akToast(res.message, 'error'); return; }
        var m = document.querySelector('.ak-modal-backdrop'); if (m) m.parentNode.removeChild(m);
        akToast('Sesi dihapus', 'success');
        if (after) after(); else loadSessions();
      }, function () { akBusy(btn, false); });
      return false;
    } }]
  });
}

/* ================= Editor ================= */
// Runs fn now, or after the user confirms discarding unsaved slide changes (themed dialog, not window.confirm).
function guardLeave(fn) {
  if (!H.dirty) { fn(); return; }
  akConfirm({
    title: 'Buang perubahan yang belum disimpan?', icon: 'edit', tone: 'warning',
    message: 'Ada perubahan pada slide ini yang belum disimpan.',
    cancelText: 'Lanjut mengedit', confirmText: 'Buang', danger: true,
    onConfirm: function () { H.dirty = false; fn(); }
  });
}

function openEditor(id) {
  H.eventId = id; H.ed = null; H.form = null; H.dirty = false; H.parts = null; H.settingsDraft = null;
  $id('view-list').hidden = true;
  $id('view-editor').hidden = false;
  window.scrollTo(0, 0);
  $id('ed-name').textContent = 'Memuat…';
  akClear($id('ed-sub')); akClear($id('ed-actions')); akClear($id('slide-list'));
  akClear($id('slide-form')).appendChild(mk('div', { class: 'skeleton', style: 'height:300px' }));
  switchTab('slides', true);
  loadEditor(function () {
    var first = H.ed.items[0];
    if (first) selectSlide(first.contentId); else renderSlideForm();
  });
  clearInterval(H.edTimer);
  H.edTimer = setInterval(function () { if (!document.hidden && !H.saving && H.eventId) loadEditor(); }, 12000);
}

function loadEditor(cb) {
  var id = H.eventId;
  akCall('getSessionEditor', [H.token, id], function (res) {
    if (H.eventId !== id) return;
    res.joinUrl = AK_SITE.join(res.event.code);
    res.presentUrl = AK_SITE.presenter(res.event.id);
    H.ed = res;
    renderEditorHead();
    renderSlideList();
    if (H.form && H.form.cid && !H.ed.items.some(function (i) { return i.contentId === H.form.cid; })) { H.form = null; H.dirty = false; renderSlideForm(); }
    if (H.tab === 'report') renderReport();
    if (cb) cb();
  }, function (msg, auth) {
    if (auth) return;
    if (/NOT_FOUND/.test(msg)) { akToast('Sesi tersebut sudah tidak ada.', 'error'); showList(); }
  });
}

function renderEditorHead() {
  var ev = H.ed.event;
  $id('ed-name').textContent = ev.name;
  var sub = akClear($id('ed-sub'));
  sub.appendChild(mk('span', { class: 'code-chip', title: 'Kode sesi' }, [ev.codeDisplay]));
  sub.appendChild(mk('span', null, [akIcon('user', 14), ' ', ev.facilitatorResolved || '-']));
  sub.appendChild(mk('span', null, [mk('span', { class: 'online on' }), H.ed.onlineCount + ' online \u00B7 ' + H.ed.participantCount + ' bergabung']));
  $id('count-slides').textContent = String(H.ed.items.length);
  $id('count-participants').textContent = String(H.ed.participantCount);

  var act = akClear($id('ed-actions'));
  var open = ev.status === 'active';
  var sw = mk('input', { type: 'checkbox' }); sw.checked = open;
  sw.addEventListener('change', function () {
    var want = sw.checked ? 'active' : 'closed';
    var go = function () {
      akCall('setSessionStatus', [H.token, H.eventId, want], function (res) {
        if (!res.success) { akToast(res.message, 'error'); sw.checked = !sw.checked; return; }
        akToast(want === 'active' ? 'Sesi dibuka — peserta dapat bergabung' : 'Sesi ditutup — peserta telah dikeluarkan', 'success'); loadEditor();
      }, function () { sw.checked = !sw.checked; });
    };
    if (want === 'closed') akConfirm({ title: 'Tutup sesi ini?', message: 'Peserta akan dikeluarkan dan tidak ada yang bisa bergabung sampai sesi dibuka kembali. Hasil tetap tersimpan.', confirmText: 'Tutup sesi', danger: true, onConfirm: go });
    else go();
    if (want === 'closed') sw.checked = true; // revert until confirmed
  });
  act.appendChild(mk('label', { class: 'switch', title: 'Buka atau tutup sesi' }, [sw, mk('span', { class: 'track' }), mk('span', { class: 'small', style: 'font-weight:650', text: open ? 'Terbuka' : 'Ditutup' })]));
  act.appendChild(mk('button', { class: 'btn btn-secondary btn-sm', type: 'button', onclick: qrModal }, [akIcon('qr', 16), 'Bagikan']));
  act.appendChild(mk('a', { class: 'btn btn-primary', href: H.ed.presentUrl || '#', target: '_blank', rel: 'noopener' }, [akIcon('play', 16), 'Presentasikan']));
}

function qrModal() {
  var ev = H.ed.event;
  var qr = mk('div', { class: 'center', style: 'margin:18px 0' });
  akModal({
    title: 'Undang peserta', icon: 'qr',
    body: mk('div', null, [
      qr,
      mk('div', { class: 'center', style: 'margin-bottom:14px' }, [mk('div', { class: 'small muted', text: 'Kode sesi' }), mk('div', { class: 'code-chip', style: 'font-size:26px;margin-top:6px', text: ev.codeDisplay })]),
      mk('div', { class: 'row' }, [mk('input', { class: 'input', readonly: true, value: H.ed.joinUrl, onclick: function (e) { e.target.select(); } }), mk('button', { class: 'btn btn-soft', type: 'button', onclick: function () { akCopy(H.ed.joinUrl, 'Link gabung disalin'); } }, [akIcon('copy', 16), 'Salin'])])
    ]),
    actions: [{ label: 'Selesai', kind: 'btn-primary' }]
  });
  akQr(qr, H.ed.joinUrl, 200);
}

function switchTab(tab, silent) {
  if (!silent && H.tab === 'slides' && tab !== 'slides' && H.dirty) { guardLeave(function () { switchTab(tab, true); }); return; }
  if (tab !== 'slides') H.dirty = false;
  H.tab = tab;
  document.querySelectorAll('#ed-tabs .tab').forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-tab') === tab); });
  ['slides', 'participants', 'settings', 'report'].forEach(function (t) { $id('tab-' + t).hidden = t !== tab; });
  clearInterval(H.partTimer);
  if (tab === 'participants') { loadParticipants(); H.partTimer = setInterval(function () { if (!document.hidden) loadParticipants(); }, 10000); }
  if (tab === 'settings' && H.ed) renderSettings();
  if (tab === 'report' && H.ed) renderReport();
}

/* ---------- Slides list ---------- */
$id('btn-add-slide').addEventListener('click', function () { guardLeave(typePicker); });

function renderSlideList() {
  var list = akClear($id('slide-list'));
  var items = H.ed.items;
  if (!items.length) {
    list.appendChild(mk('div', { class: 'empty', style: 'padding:30px 10px' }, [mk('p', { class: 'small', text: 'Belum ada slide. Tambahkan slide pertama Anda!' })]));
    return;
  }
  items.forEach(function (it, idx) {
    var t = AK_TYPES[it.type] || { label: it.type, icon: 'alert', color: 'var(--danger)' };
    var up = mk('button', { class: 'icon-btn', type: 'button', title: 'Naikkan', 'aria-label': 'Naikkan', disabled: idx === 0 }, [akIcon('chevron-up', 15)]);
    var dn = mk('button', { class: 'icon-btn', type: 'button', title: 'Turunkan', 'aria-label': 'Turunkan', disabled: idx === items.length - 1 }, [akIcon('chevron-down', 15)]);
    up.addEventListener('click', function (e) { e.stopPropagation(); moveSlide(it, 'up'); });
    dn.addEventListener('click', function (e) { e.stopPropagation(); moveSlide(it, 'down'); });
    var meta = [t.label];
    if (['announcement', 'leaderboard'].indexOf(it.type) < 0) meta.push(it.responseCount + ' jawaban');
    if (it.status === 'draft') meta.push('Tersembunyi'); else if (it.status === 'closed') meta.push('Ditutup');
    if (!it.known) meta = ['Jenis tidak dikenal — edit untuk memperbaiki'];
    list.appendChild(mk('div', { class: 'sl-item' + (H.form && H.form.cid === it.contentId ? ' sel' : '') + (it.status === 'draft' ? ' draft' : ''), tabindex: '0', onclick: function () { if (!H.form || H.form.cid !== it.contentId) guardLeave(function () { selectSlide(it.contentId); }); }, onkeydown: function (e) { if (e.key === 'Enter') guardLeave(function () { selectSlide(it.contentId); }); } }, [
      mk('span', { class: 'sl-num', text: String(idx + 1) }),
      mk('span', { class: 'sl-ic', style: '--tc:' + t.color }, [akIcon(t.icon, 18)]),
      mk('span', { class: 'sl-t' }, [mk('b', { text: it.title }), mk('span', { text: meta.join(' \u00B7 ') })]),
      mk('span', { class: 'sl-move' }, [up, dn])
    ]));
  });
}

function moveSlide(it, dir) {
  H.saving = true;
  akCall('moveContentItem', [H.token, H.eventId, it.contentId, dir], function (res) {
    H.saving = false;
    if (!res.success) akToast(res.message, 'error');
    loadEditor();
  }, function () { H.saving = false; });
}

function typePicker() {
  var grid = mk('div', { class: 'type-grid', style: 'margin-top:16px' });
  var m;
  AK_TYPE_ORDER.forEach(function (k) {
    var t = AK_TYPES[k];
    grid.appendChild(mk('button', { class: 'type-card', type: 'button', style: '--tc:' + t.color, onclick: function () { m.close(); startNew(k); } }, [
      mk('span', { class: 'tic' }, [akIcon(t.icon, 20)]), mk('b', { text: t.label }), mk('span', { text: t.desc })
    ]));
  });
  m = akModal({ title: 'Pilih jenis slide', size: 'xl', body: grid });
}

function blankForm(type) {
  var f = { cid: null, type: type, title: '', description: '', options: [], correctIdx: -1, config: {}, status: 'active', responseCount: 0 };
  if (type === 'poll' || type === 'multiplechoice') f.options = ['', '', ''];
  if (type === 'ranking') f.options = ['', '', ''];
  if (type === 'scales') { f.options = ['', '']; f.config = { min: 1, max: 5, minLabel: 'Sangat tidak setuju', maxLabel: 'Sangat setuju' }; }
  if (type === 'multiplechoice') f.config = { timeLimit: 20 };
  if (type === 'wordcloud') f.config = { maxEntries: 1 };
  if (type === 'writing') f.config = { maxLength: 1000 };
  if (type === 'qna') f.config = { maxQuestions: 3 };
  if (type === 'leaderboard') f.title = 'Papan Skor';
  return f;
}

function startNew(type) {
  H.form = blankForm(type);
  H.dirty = true;
  renderSlideList();
  renderSlideForm();
}

function selectSlide(cid) {
  var it = H.ed.items.find(function (i) { return i.contentId === cid; });
  if (!it) return;
  var type = it.known ? it.type : 'poll';
  H.form = {
    cid: it.contentId, type: type, title: it.title, description: it.description || '',
    options: (it.options || []).slice(), correctIdx: (it.options || []).indexOf(it.correctAnswer),
    config: JSON.parse(JSON.stringify(it.config || {})), status: it.status, responseCount: it.responseCount, origType: it.type
  };
  if (!it.known) H.form.config = blankForm(type).config;
  H.dirty = false;
  renderSlideList();
  renderSlideForm();
}

function selectField(label, value, options, onChange, disabled) {
  var sel = mk('select', { class: 'select', disabled: !!disabled });
  options.forEach(function (o) { var op = new Option(o[1], String(o[0])); sel.appendChild(op); });
  sel.value = String(value);
  sel.addEventListener('change', function () { onChange(sel.value); H.dirty = true; });
  return mk('div', { class: 'field' }, [mk('label', { class: 'label', text: label }), sel]);
}

function normOpt(s) { return String(s || '').replace(/\s+/g, ' ').trim().replace(/\|/g, '/'); }

function renderSlideForm() {
  var box = akClear($id('slide-form'));
  var f = H.form;
  if (!f) {
    box.appendChild(mk('div', { class: 'empty' }, [
      mk('div', { class: 'empty-ic' }, [akIcon('layers', 30)]), mk('h3', { text: H.ed && H.ed.items.length ? 'Pilih slide untuk diedit' : 'Tambahkan slide pertama' }),
      mk('p', { style: 'margin-bottom:18px', text: 'Polling, kuis, awan kata, tanya jawab, dan lainnya.' }),
      mk('button', { class: 'btn btn-primary', type: 'button', onclick: typePicker }, [akIcon('plus', 18), 'Tambah slide'])
    ]));
    return;
  }
  var locked = f.cid && f.responseCount > 0;
  var hasOptions = ['poll', 'multiplechoice', 'ranking', 'scales'].indexOf(f.type) >= 0;
  var t = AK_TYPES[f.type];
  var mark = function () { H.dirty = true; };

  var head = mk('div', { class: 'form-head' }, [mk('h2', { text: f.cid ? 'Edit slide' : 'Slide baru' }), akTypePill(f.type)]);
  if (f.cid && ['announcement', 'leaderboard'].indexOf(f.type) < 0) head.appendChild(mk('span', { class: 'badge', text: f.responseCount + ' jawaban' }));
  box.appendChild(head);

  if (locked && (hasOptions || true)) {
    box.appendChild(mk('div', { class: 'edit-note' }, [akIcon('lock', 17), mk('span', { text: 'Slide ini sudah memiliki jawaban, sehingga jenis' + (hasOptions ? ' dan pilihannya' : '-nya') + ' dikunci agar hasil tetap valid. Anda masih dapat mengubah teks' + (f.type === 'multiplechoice' ? ', jawaban benar (poin dihitung ulang)' : '') + ' dan visibilitas. Untuk perubahan lain, gandakan slide ini.' })]));
  }

  // Type
  var typeOpts = AK_TYPE_ORDER.map(function (k) { return [k, AK_TYPES[k].label]; });
  box.appendChild(selectField('Jenis slide', f.type, typeOpts, function (v) {
    var nf = blankForm(v);
    nf.cid = f.cid; nf.title = f.title || nf.title; nf.description = f.description; nf.status = f.status; nf.responseCount = f.responseCount;
    if (['poll', 'multiplechoice', 'ranking'].indexOf(v) >= 0 && f.options.length) nf.options = f.options.slice();
    H.form = nf; H.dirty = true; renderSlideForm();
  }, locked));

  // Title & description
  var titleLabel = f.type === 'announcement' ? 'Judul' : f.type === 'leaderboard' ? 'Judul' : 'Pertanyaan Anda';
  var title = mk('input', { class: 'input input-lg', maxlength: '200', value: f.title, placeholder: f.type === 'announcement' ? 'mis. Agenda hari ini' : 'Ajukan sesuatu kepada peserta…' });
  var tCount = mk('span', { class: 'counter', text: f.title.length + ' / 200' });
  title.addEventListener('input', function () { f.title = title.value; tCount.textContent = f.title.length + ' / 200'; mark(); });
  box.appendChild(mk('div', { class: 'field' }, [mk('div', { class: 'row', style: 'justify-content:space-between' }, [mk('label', { class: 'label', text: titleLabel }), tCount]), title]));
  if (f.type !== 'leaderboard') {
    var desc = mk('textarea', { class: 'textarea', rows: f.type === 'announcement' ? '6' : '2', maxlength: '2000', placeholder: f.type === 'announcement' ? 'Teks isi — instruksi, agenda, poin penting…' : 'Instruksi atau konteks tambahan (opsional)' });
    desc.value = f.description;
    desc.addEventListener('input', function () { f.description = desc.value; mark(); });
    box.appendChild(mk('div', { class: 'field' }, [mk('label', { class: 'label' }, [f.type === 'announcement' ? 'Teks isi' : 'Deskripsi ', f.type === 'announcement' ? null : mk('span', { class: 'opt', text: '(opsional)' })]), desc]));
  }

  // Options
  if (hasOptions) box.appendChild(optionsEditor(f, locked));

  // Type-specific settings
  var cfg = mk('div', { class: 'config-grid' });
  if (f.type === 'poll') {
    var multi = mk('input', { type: 'checkbox' }); multi.checked = !!f.config.multi; multi.disabled = locked;
    multi.addEventListener('change', function () { f.config.multi = multi.checked; mark(); });
    cfg.appendChild(mk('div', { class: 'field', style: 'justify-content:flex-end' }, [mk('label', { class: 'switch' }, [multi, mk('span', { class: 'track' }), mk('span', { class: 'small', style: 'font-weight:600', text: 'Izinkan memilih lebih dari satu' })])]));
  }
  if (f.type === 'multiplechoice') {
    cfg.appendChild(selectField('Hitung mundur', f.config.timeLimit || 0, [[0, 'Tanpa timer'], [10, '10 detik'], [15, '15 detik'], [20, '20 detik'], [30, '30 detik'], [45, '45 detik'], [60, '1 menit'], [90, '90 detik'], [120, '2 menit']], function (v) { f.config.timeLimit = Number(v); }));
  }
  if (f.type === 'wordcloud') cfg.appendChild(selectField('Isian per peserta', f.config.maxEntries || 1, [[1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5']], function (v) { f.config.maxEntries = Number(v); }));
  if (f.type === 'writing') cfg.appendChild(selectField('Panjang maksimal', f.config.maxLength || 1000, [[200, '200 karakter'], [500, '500 karakter'], [1000, '1.000 karakter'], [2000, '2.000 karakter']], function (v) { f.config.maxLength = Number(v); }));
  if (f.type === 'qna') cfg.appendChild(selectField('Pertanyaan per peserta', f.config.maxQuestions || 3, [[1, '1'], [2, '2'], [3, '3'], [5, '5'], [10, '10']], function (v) { f.config.maxQuestions = Number(v); }));
  if (f.type === 'scales') {
    cfg.appendChild(selectField('Nilai terendah', f.config.min, [[0, '0'], [1, '1']], function (v) { f.config.min = Number(v); }, locked));
    cfg.appendChild(selectField('Nilai tertinggi', f.config.max, [[3, '3'], [4, '4'], [5, '5'], [7, '7'], [10, '10']], function (v) { f.config.max = Number(v); }, locked));
    var lo = mk('input', { class: 'input', maxlength: '40', value: f.config.minLabel || '' });
    var hi = mk('input', { class: 'input', maxlength: '40', value: f.config.maxLabel || '' });
    lo.addEventListener('input', function () { f.config.minLabel = lo.value; mark(); });
    hi.addEventListener('input', function () { f.config.maxLabel = hi.value; mark(); });
    cfg.appendChild(mk('div', { class: 'field' }, [mk('label', { class: 'label', text: 'Label nilai terendah' }), lo]));
    cfg.appendChild(mk('div', { class: 'field' }, [mk('label', { class: 'label', text: 'Label nilai tertinggi' }), hi]));
  }
  if (cfg.childNodes.length) box.appendChild(cfg);
  if (f.type === 'multiplechoice') box.appendChild(mk('p', { class: 'hint', style: 'margin:-6px 0 14px', text: 'Pada sesi yang dipandu presenter, hitung mundur dimulai 3 detik setelah slide ditampilkan. Jawaban benar yang lebih cepat mendapat poin lebih besar (500–1.000).' }));
  if (f.type === 'leaderboard') box.appendChild(mk('div', { class: 'notice', style: 'display:flex;gap:10px;padding:12px 14px;border-radius:14px;background:var(--primary-soft);margin-bottom:14px' }, [akIcon('info', 18), mk('span', { class: 'small', text: 'Menampilkan total poin kuis semua peserta. Letakkan setelah soal-soal kuis.' })]));

  // Visibility
  var seg = mk('div', { class: 'seg' });
  [['active', 'eye', 'Terbuka'], ['closed', 'lock', 'Ditutup'], ['draft', 'eye-off', 'Tersembunyi']].forEach(function (s) {
    var b = mk('button', { class: 'seg-btn' + (f.status === s[0] ? ' active' : ''), type: 'button' }, [akIcon(s[1], 15), s[2]]);
    b.addEventListener('click', function () { f.status = s[0]; Array.prototype.forEach.call(seg.children, function (c) { c.classList.toggle('active', c === b); }); statusHint.textContent = STATUS_HINT[s[0]]; mark(); });
    seg.appendChild(b);
  });
  var STATUS_HINT = { active: 'Tampil dan menerima jawaban.', closed: 'Tampil beserta hasil, tetapi tidak menerima jawaban baru.', draft: 'Dilewati saat presentasi dan disembunyikan dari peserta.' };
  var statusHint = mk('span', { class: 'hint', text: STATUS_HINT[f.status] });
  box.appendChild(mk('div', { class: 'field' }, [mk('label', { class: 'label', text: 'Visibilitas' }), mk('div', { class: 'row wrap' }, [seg, statusHint])]));

  var err = mk('div', { class: 'field-error', id: 'form-err' });
  box.appendChild(err);
  var save = mk('button', { class: 'btn btn-primary', type: 'button' }, [akIcon('check', 17), f.cid ? 'Simpan perubahan' : 'Tambah slide']);
  save.addEventListener('click', function () { saveSlide(save, err); });
  var actions = mk('div', { class: 'form-actions' }, [save]);
  if (!f.cid || H.dirty) actions.appendChild(mk('button', { class: 'btn btn-ghost', type: 'button', text: 'Batal', onclick: function () { H.dirty = false; if (f.cid) selectSlide(f.cid); else { H.form = null; renderSlideList(); renderSlideForm(); } } }));
  actions.appendChild(mk('span', { class: 'sp' }));
  if (f.cid) {
    var dup = mk('button', { class: 'btn btn-ghost btn-sm', type: 'button' }, [akIcon('copy', 15), 'Gandakan']);
    dup.addEventListener('click', function () { duplicateSlide(f.cid, dup); });
    var del = mk('button', { class: 'btn btn-danger btn-sm', type: 'button' }, [akIcon('trash', 15), 'Hapus']);
    del.addEventListener('click', function () { deleteSlide(f); });
    actions.appendChild(dup); actions.appendChild(del);
  }
  box.appendChild(actions);
  if (!f.cid) setTimeout(function () { title.focus(); }, 60);
}

function optionsEditor(f, locked) {
  var isScale = f.type === 'scales', isQuiz = f.type === 'multiplechoice';
  var max = isScale ? 8 : 10, min = isScale ? 1 : 2;
  var wrap = mk('div', { class: 'field' });
  wrap.appendChild(mk('label', { class: 'label', text: isScale ? 'Pernyataan yang dinilai' : f.type === 'ranking' ? 'Butir yang diurutkan' : isQuiz ? 'Pilihan jawaban — tandai yang benar' : 'Pilihan' }));
  var list = mk('div', { class: 'opt-editor' });
  var addBtn = mk('button', { class: 'btn btn-ghost btn-sm', type: 'button', style: 'align-self:flex-start' }, [akIcon('plus', 15), isScale ? 'Tambah pernyataan' : 'Tambah pilihan']);
  function draw() {
    akClear(list);
    f.options.forEach(function (o, i) {
      var input = mk('input', { class: 'input', maxlength: '150', value: o, placeholder: (isScale ? 'Pernyataan ' : 'Pilihan ') + (i + 1), disabled: locked });
      input.addEventListener('input', function () { f.options[i] = input.value; H.dirty = true; });
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !locked && f.options.length < max) { e.preventDefault(); f.options.splice(i + 1, 0, ''); H.dirty = true; draw(); var n = list.children[i + 1]; if (n) n.querySelector('input').focus(); } });
      var row = mk('div', { class: 'opt-row' }, [mk('span', { class: 'dot', style: 'background:' + akColor(i) }), input]);
      if (isQuiz) {
        var cb = mk('button', { class: 'correct-btn' + (f.correctIdx === i ? ' on' : ''), type: 'button', title: 'Tandai sebagai jawaban benar' }, [akIcon('check', 15), f.correctIdx === i ? 'Benar' : '']);
        cb.addEventListener('click', function () { f.correctIdx = i; H.dirty = true; draw(); });
        row.appendChild(cb);
      }
      if (!locked) {
        var rm = mk('button', { class: 'icon-btn sm danger', type: 'button', title: 'Hapus', 'aria-label': 'Hapus', disabled: f.options.length <= min }, [akIcon('x', 16)]);
        rm.addEventListener('click', function () {
          f.options.splice(i, 1);
          if (f.correctIdx === i) f.correctIdx = -1; else if (f.correctIdx > i) f.correctIdx--;
          H.dirty = true; draw();
        });
        row.appendChild(rm);
      }
      list.appendChild(row);
    });
    addBtn.hidden = locked || f.options.length >= max;
  }
  addBtn.addEventListener('click', function () { f.options.push(''); H.dirty = true; draw(); var last = list.lastChild; if (last) last.querySelector('input').focus(); });
  draw();
  wrap.appendChild(list);
  wrap.appendChild(addBtn);
  return wrap;
}

function saveSlide(btn, err) {
  var f = H.form;
  err.textContent = '';
  var opts = f.options.map(normOpt);
  var payload = { type: f.type, title: f.title, description: f.description, options: opts.filter(Boolean), config: f.config, status: f.status };
  if (!payload.title.trim()) { err.textContent = f.type === 'announcement' ? 'Tambahkan judul.' : 'Tuliskan pertanyaan Anda.'; return; }
  if (['poll', 'multiplechoice', 'ranking'].indexOf(f.type) >= 0 && payload.options.length < 2) { err.textContent = 'Isi minimal 2 pilihan.'; return; }
  if (f.type === 'scales' && !payload.options.length) { err.textContent = 'Tambahkan minimal 1 pernyataan.'; return; }
  if (f.type === 'multiplechoice') {
    var correct = f.correctIdx >= 0 ? opts[f.correctIdx] : '';
    if (!correct) { err.textContent = 'Tandai jawaban yang benar.'; return; }
    payload.correctAnswer = correct;
  }
  H.saving = true;
  akBusy(btn, true, 'Menyimpan…');
  var fn = f.cid ? 'updateContentItem' : 'addContentItem';
  var args = f.cid ? [H.token, H.eventId, f.cid, payload] : [H.token, H.eventId, payload];
  akCall(fn, args, function (res) {
    H.saving = false;
    akBusy(btn, false);
    if (!res.success) { err.textContent = res.message; return; }
    H.dirty = false;
    akToast(f.cid ? 'Slide disimpan' : 'Slide ditambahkan', 'success');
    var target = f.cid || res.contentId;
    loadEditor(function () { selectSlide(target); });
  }, function (m, auth) { H.saving = false; akBusy(btn, false); if (!auth) err.textContent = 'Gagal menyimpan. Silakan coba lagi.'; });
}

function duplicateSlide(cid, btn) {
  akBusy(btn, true);
  akCall('duplicateContentItem', [H.token, H.eventId, cid], function (res) {
    akBusy(btn, false);
    if (!res.success) { akToast(res.message, 'error'); return; }
    akToast('Salinan (tersembunyi) ditambahkan tepat setelah slide asli', 'success');
    loadEditor(function () { selectSlide(res.contentId); });
  }, function () { akBusy(btn, false); });
}

function deleteSlide(f) {
  akConfirm({
    title: 'Hapus slide ini?', danger: true, confirmText: 'Hapus',
    message: '"' + f.title + '"' + (f.responseCount ? ' beserta ' + f.responseCount + ' jawabannya akan dihapus permanen.' : ' akan dihapus permanen.') + ' Tindakan ini tidak dapat dibatalkan.',
    onConfirm: function () {
      akCall('deleteContentItem', [H.token, H.eventId, f.cid], function (res) {
        if (!res.success) { akToast(res.message, 'error'); return; }
        akToast('Slide dihapus', 'success');
        H.form = null; H.dirty = false;
        loadEditor(function () { renderSlideForm(); });
      });
    }
  });
}

/* ---------- Participants ---------- */
function loadParticipants() {
  var id = H.eventId;
  var box = $id('tab-participants');
  if (!H.parts) akClear(box).appendChild(mk('div', { class: 'skeleton', style: 'height:240px' }));
  akCall('getParticipantList', [H.token, id], function (res) {
    if (H.eventId !== id || H.tab !== 'participants') return;
    H.parts = res;
    renderParticipants();
  }, function () {});
}

function renderParticipants() {
  var res = H.parts, box = $id('tab-participants');
  var keepQ = $id('p-search') ? $id('p-search').value : '';
  akClear(box);
  var rows = res.rows || [];
  var active = rows.filter(function (r) { return r.status !== 'removed'; });
  var online = active.filter(function (r) { return r.online; }).length;
  var settings = H.ed.event.settings;

  var lock = mk('input', { type: 'checkbox' }); lock.checked = !!settings.lockJoin;
  lock.addEventListener('change', function () {
    akCall('updateSession', [H.token, H.eventId, { settings: { lockJoin: lock.checked } }], function (r) {
      if (!r.success) { akToast(r.message, 'error'); lock.checked = !lock.checked; return; }
      settings.lockJoin = lock.checked;
      akToast(lock.checked ? 'Pendaftaran dikunci — tidak ada peserta baru' : 'Pendaftaran dibuka', 'success');
    });
  });
  box.appendChild(mk('div', { class: 'stat-row' }, [
    mk('div', { class: 'card stat' }, [mk('span', { class: 'si', style: '--sc:var(--c2)' }, [akIcon('users', 22)]), mk('div', null, [mk('div', { class: 'sv', text: active.length + ' / ' + res.max }), mk('div', { class: 'sl', text: 'Bergabung' })])]),
    mk('div', { class: 'card stat' }, [mk('span', { class: 'si', style: '--sc:var(--c7)' }, [akIcon('activity', 22)]), mk('div', null, [mk('div', { class: 'sv', text: String(online) }), mk('div', { class: 'sl', text: 'Sedang online' })])]),
    mk('div', { class: 'card stat', style: 'justify-content:space-between' }, [mk('div', null, [mk('div', { style: 'font-weight:700', text: 'Kunci pendaftaran' }), mk('div', { class: 'sl', text: 'Tolak peserta baru' })]), mk('label', { class: 'switch' }, [lock, mk('span', { class: 'track' })])])
  ]));

  var search = mk('input', { class: 'input', id: 'p-search', placeholder: 'Cari nama, email, atau NIS/NIM…', value: keepQ });
  var tools = mk('div', { class: 'list-tools' }, [mk('div', { class: 'search' }, [akIcon('search', 18), search]), mk('span', { class: 'grow' }),
    mk('button', { class: 'btn btn-ghost btn-sm', type: 'button', onclick: loadParticipants }, [akIcon('refresh', 15), 'Muat ulang'])]);
  box.appendChild(tools);
  var tableWrap = mk('div', { class: 'table-wrap card' });
  box.appendChild(tableWrap);
  var draw = function () {
    akClear(tableWrap);
    var q = search.value.trim().toLowerCase();
    var list = rows.filter(function (r) { return !q || (r.name + ' ' + r.email + ' ' + r.nim).toLowerCase().indexOf(q) >= 0; });
    if (!list.length) { tableWrap.appendChild(mk('div', { class: 'empty', text: rows.length ? 'Tidak ada peserta yang cocok dengan pencarian.' : 'Belum ada yang bergabung. Bagikan kode atau QR untuk memulai.' })); return; }
    var table = mk('table', { class: 'table' }, [mk('tr', null, ['#', 'Nama', 'Email', 'NIS/NIM', 'Bergabung', 'Dijawab', 'Poin kuis', 'Keluar halaman', ''].map(function (h) { return mk('th', { text: h }); }))]);
    list.forEach(function (r, i) {
      var j = new Date(r.joinedAt);
      var act = r.status === 'removed'
        ? mk('button', { class: 'btn btn-ghost btn-sm', type: 'button', text: 'Pulihkan', onclick: function () { setPart(r, 'active'); } })
        : mk('button', { class: 'btn btn-danger btn-sm', type: 'button', text: 'Keluarkan', onclick: function () { akConfirm({ title: 'Keluarkan ' + r.name + '?', message: 'Peserta ini akan dikeluarkan dan tidak bisa bergabung lagi dengan email yang sama. Jawabannya tetap tersimpan.', confirmText: 'Keluarkan', danger: true, onConfirm: function () { setPart(r, 'removed'); } }); } });
      table.appendChild(mk('tr', { class: r.status === 'removed' ? 'removed' : '' }, [
        mk('td', { text: String(i + 1) }),
        mk('td', null, [mk('span', { class: 'online' + (r.online ? ' on' : ''), title: r.online ? 'Online' : 'Offline' }), r.name]),
        mk('td', { text: r.email || '\u2013' }), mk('td', { text: r.nim || '\u2013' }),
        mk('td', { text: isNaN(j) ? '\u2013' : j.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }),
        mk('td', { text: r.answered + ' / ' + res.inputSlides }),
        mk('td', { text: akFmt(r.score) }),
        mk('td', null, [r.away ? mk('span', { class: 'badge badge-warning', text: r.away + '\u00D7' }) : '\u2013']),
        mk('td', null, [act])
      ]));
    });
    tableWrap.appendChild(table);
  };
  search.addEventListener('input', draw);
  draw();
  if (keepQ) { search.focus(); search.setSelectionRange(keepQ.length, keepQ.length); }
}

function setPart(r, status) {
  akCall('setParticipantStatus', [H.token, H.eventId, r.pid, status], function (res) {
    if (!res.success) { akToast(res.message, 'error'); return; }
    akToast(status === 'removed' ? r.name + ' telah dikeluarkan' : r.name + ' telah dipulihkan', 'success');
    loadParticipants();
  });
}

/* ---------- Settings ---------- */
function renderSettings() {
  var ev = H.ed.event;
  var d = H.settingsDraft = { name: ev.name, facilitator: ev.facilitator, description: ev.description, settings: JSON.parse(JSON.stringify(ev.settings)) };
  var s = d.settings;
  var box = akClear($id('tab-settings'));

  var input = function (key, attrs) { var i = mk('input', Object.assign({ class: 'input', value: d[key] || '' }, attrs)); i.addEventListener('input', function () { d[key] = i.value; }); return i; };
  var toggle = function (key, title, desc) {
    var cb = mk('input', { type: 'checkbox' }); cb.checked = !!s[key];
    cb.addEventListener('change', function () { s[key] = cb.checked; });
    return mk('div', { class: 'setting-row' }, [mk('div', null, [mk('div', { class: 't', text: title }), mk('div', { class: 'd', text: desc })]), mk('label', { class: 'switch' }, [cb, mk('span', { class: 'track' })])]);
  };

  var descTa = mk('textarea', { class: 'textarea', rows: '2', maxlength: '500' }); descTa.value = d.description || '';
  descTa.addEventListener('input', function () { d.description = descTa.value; });
  box.appendChild(mk('div', { class: 'card panel' }, [
    mk('h3', null, [akIcon('file-text', 20), 'Umum']), mk('p', { class: 'muted', text: 'Nama fasilitator tampil di layar peserta, tampilan presenter, dan laporan PDF.' }),
    mk('div', { class: 'grid-2' }, [
      mk('div', { class: 'field' }, [mk('label', { class: 'label', text: 'Nama sesi' }), input('name', { maxlength: '120' })]),
      mk('div', { class: 'field' }, [mk('label', { class: 'label', text: 'Fasilitator (guru / dosen / mentor)' }), input('facilitator', { maxlength: '120', placeholder: H.me.name })])
    ]),
    mk('div', { class: 'field' }, [mk('label', { class: 'label', text: 'Deskripsi' }), descTa])
  ]));

  var paceGrid = mk('div', { class: 'pace-grid' });
  [['presenter', 'monitor', 'Dipandu presenter', 'Semua peserta melihat slide yang sedang Anda tampilkan — seperti Mentimeter. Paling cocok untuk kelas dan rapat langsung.'],
   ['audience', 'smartphone', 'Mandiri', 'Peserta memilih sendiri slide yang terbuka dan menjawab sesuai kecepatan masing-masing. Cocok untuk PR, survei, dan pos belajar.']].forEach(function (p) {
    var b = mk('button', { class: 'pace' + (s.pace === p[0] ? ' sel' : ''), type: 'button' }, [mk('b', null, [akIcon(p[1], 17), p[2]]), mk('span', { text: p[3] })]);
    b.addEventListener('click', function () { s.pace = p[0]; Array.prototype.forEach.call(paceGrid.children, function (c) { c.classList.toggle('sel', c === b); }); });
    paceGrid.appendChild(b);
  });
  var idSel = mk('select', { class: 'select' });
  [['full', 'Nama + email (+ NIS/NIM opsional) — absensi'], ['name', 'Nama saja'], ['anonymous', 'Anonim (nama samaran acak)']].forEach(function (o) { idSel.appendChild(new Option(o[1], o[0])); });
  idSel.value = s.identity; idSel.addEventListener('change', function () { s.identity = idSel.value; });
  var maxIn = mk('input', { class: 'input', type: 'number', min: '1', max: '300', value: String(s.maxParticipants) });
  maxIn.addEventListener('input', function () { s.maxParticipants = Number(maxIn.value) || 1; });
  box.appendChild(mk('div', { class: 'card panel' }, [
    mk('h3', null, [akIcon('users', 20), 'Partisipasi']), mk('p', { class: 'muted', text: 'Cara peserta bergabung dan mengikuti sesi.' }),
    paceGrid,
    mk('div', { class: 'grid-2' }, [
      mk('div', { class: 'field' }, [mk('label', { class: 'label', text: 'Identitas peserta' }), idSel]),
      mk('div', { class: 'field' }, [mk('label', { class: 'label', text: 'Maksimal peserta (1–300)' }), maxIn])
    ]),
    toggle('audienceResults', 'Tampilkan hasil ke peserta', 'Setelah menjawab, peserta melihat hasil langsung di perangkatnya sendiri.'),
    toggle('reactions', 'Reaksi emoji', 'Peserta dapat mengirim reaksi yang melayang di layar presenter.'),
    toggle('lockJoin', 'Kunci pendaftaran', 'Peserta baru tidak bisa bergabung. Peserta lama tetap bisa masuk kembali.')
  ]));

  box.appendChild(mk('div', { class: 'card panel' }, [
    mk('h3', null, [akIcon('shield', 20), 'Moderasi & integritas']), mk('p', { class: 'muted', text: 'Jaga ruangan tetap aman dan fokus.' }),
    toggle('profanityFilter', 'Filter kata kasar', 'Menyamarkan kata kasar umum (bahasa Indonesia & Inggris) pada jawaban teks.'),
    toggle('qnaModeration', 'Moderasi tanya jawab', 'Pertanyaan baru menunggu persetujuan Anda di tampilan presenter sebelum dilihat peserta lain.'),
    toggle('showNames', 'Tampilkan nama pada jawaban terbuka', 'Menampilkan nama penulis setiap kartu di layar besar (tidak berlaku di mode anonim).'),
    toggle('focusMode', 'Mode fokus (gaya ujian)', 'Menampilkan watermark pribadi, membatasi salin-tempel, dan mencatat saat peserta meninggalkan halaman.')
  ]));

  var keyChip = mk('span', { class: 'code-chip', text: '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022' });
  var shown = false;
  var showBtn = mk('button', { class: 'btn btn-ghost btn-sm', type: 'button' }, [akIcon('eye', 15), 'Tampilkan']);
  showBtn.addEventListener('click', function () { shown = !shown; keyChip.textContent = shown ? ev.presenterKey : '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'; });
  box.appendChild(mk('div', { class: 'card panel' }, [
    mk('h3', null, [akIcon('key', 20), 'Akses']), mk('p', { class: 'muted', text: 'Bagikan kunci presenter kepada rekan pemandu atau gunakan di komputer kelas — kunci ini hanya membuka tampilan presenter untuk sesi ini.' }),
    mk('div', { class: 'key-box' }, [keyChip, showBtn,
      mk('button', { class: 'btn btn-ghost btn-sm', type: 'button', onclick: function () { akCopy(ev.presenterKey, 'Kunci presenter disalin'); } }, [akIcon('copy', 15), 'Salin']),
      mk('button', { class: 'btn btn-ghost btn-sm', type: 'button', onclick: function () {
        akConfirm({ title: 'Buat kunci presenter baru?', message: 'Kunci lama langsung tidak berlaku dan siapa pun yang memakainya akan dikeluarkan.', confirmText: 'Buat', onConfirm: function () {
          akCall('regeneratePresenterKey', [H.token, H.eventId], function (r) { if (r.success) { ev.presenterKey = r.presenterKey; shown = true; keyChip.textContent = r.presenterKey; akToast('Kunci presenter baru dibuat', 'success'); } });
        } });
      } }, [akIcon('refresh', 15), 'Buat ulang'])
    ]),
    mk('div', { class: 'field', style: 'margin:16px 0 0' }, [mk('label', { class: 'label', text: 'Link peserta' }), mk('div', { class: 'row' }, [mk('input', { class: 'input', readonly: true, value: H.ed.joinUrl, onclick: function (e) { e.target.select(); } }), mk('button', { class: 'btn btn-soft', type: 'button', onclick: function () { akCopy(H.ed.joinUrl, 'Link gabung disalin'); } }, [akIcon('copy', 16), 'Salin'])])])
  ]));

  var alsoParts = mk('input', { type: 'checkbox' });
  box.appendChild(mk('div', { class: 'card panel danger-zone' }, [
    mk('h3', { style: 'color:var(--danger)' }, [akIcon('alert', 20), 'Zona berbahaya']),
    mk('div', { class: 'setting-row' }, [mk('div', null, [mk('div', { class: 't', text: 'Reset hasil' }), mk('div', { class: 'd', text: 'Hapus semua jawaban, dukungan, dan poin kuis agar sesi bisa dipakai lagi. Slide tetap ada.' }),
      mk('label', { class: 'check-row', style: 'margin:8px 0 0' }, [alsoParts, mk('span', { text: 'Hapus juga daftar peserta' })])]),
      mk('button', { class: 'btn btn-danger btn-sm', type: 'button', onclick: function () {
        akConfirm({ title: 'Reset semua hasil?', danger: true, confirmText: 'Reset', message: 'Semua jawaban di sesi ini' + (alsoParts.checked ? ' beserta daftar pesertanya' : '') + ' akan dihapus permanen. Unduh laporan terlebih dahulu jika masih diperlukan.', onConfirm: function () {
          akCall('resetResults', [H.token, H.eventId, alsoParts.checked], function (r) { if (r.success) { akToast('Hasil direset', 'success'); H.parts = null; loadEditor(); } else akToast(r.message, 'error'); });
        } });
      } }, [akIcon('refresh', 15), 'Reset'])]),
    mk('div', { class: 'setting-row' }, [mk('div', null, [mk('div', { class: 't', text: 'Hapus sesi' }), mk('div', { class: 'd', text: 'Hapus permanen sesi ini beserta slide, jawaban, dan pesertanya.' })]),
      mk('button', { class: 'btn btn-solid-danger btn-sm', type: 'button', onclick: function () { deleteSession({ id: H.eventId, name: ev.name }, showList); } }, [akIcon('trash', 15), 'Hapus'])])
  ]));

  var saveBtn = mk('button', { class: 'btn btn-primary', type: 'button' }, [akIcon('check', 17), 'Simpan pengaturan']);
  saveBtn.addEventListener('click', function () {
    if (!String(d.name || '').trim()) { akToast('Nama sesi tidak boleh kosong.', 'error'); return; }
    akBusy(saveBtn, true, 'Menyimpan…');
    akCall('updateSession', [H.token, H.eventId, { name: d.name, facilitator: d.facilitator, description: d.description, settings: s }], function (r) {
      akBusy(saveBtn, false);
      if (!r.success) { akToast(r.message, 'error'); return; }
      akToast('Pengaturan disimpan', 'success');
      loadEditor();
    }, function () { akBusy(saveBtn, false); });
  });
  box.appendChild(mk('div', { class: 'save-bar glass' }, [mk('span', { class: 'small muted grow', style: 'align-self:center', text: 'Perubahan berlaku untuk peserta dalam beberapa detik.' }), saveBtn]));
}

/* ---------- Report ---------- */
function renderReport() {
  var box = akClear($id('tab-report'));
  var items = H.ed.items;
  var inputItems = items.filter(function (i) { return ['announcement', 'leaderboard'].indexOf(i.type) < 0; });
  var totalResp = inputItems.reduce(function (a, i) { return a + i.responseCount; }, 0);
  var maxResp = inputItems.reduce(function (a, i) { return Math.max(a, i.responseCount); }, 0) || 1;
  box.appendChild(mk('div', { class: 'stat-row' }, [
    [akIcon('users', 22), 'var(--c2)', H.ed.participantCount, 'Peserta'],
    [akIcon('layers', 22), 'var(--c1)', items.length, 'Slide'],
    [akIcon('message', 22), 'var(--c3)', totalResp, 'Jawaban'],
    [akIcon('activity', 22), 'var(--c7)', H.ed.participantCount && inputItems.length ? Math.round((totalResp / (H.ed.participantCount * inputItems.length)) * 100) + '%' : '\u2013', 'Tingkat respons']
  ].map(function (s) { return mk('div', { class: 'card stat' }, [mk('span', { class: 'si', style: '--sc:' + s[1] }, [s[0]]), mk('div', null, [mk('div', { class: 'sv', text: typeof s[2] === 'number' ? akFmt(s[2]) : s[2] }), mk('div', { class: 'sl', text: s[3] })])]); })));

  var pdfBtn = mk('button', { class: 'btn btn-primary btn-sm', type: 'button' }, [akIcon('download', 15), 'Ekspor PDF']);
  var shBtn = mk('button', { class: 'btn btn-secondary btn-sm', type: 'button' }, [akIcon('download', 15), 'Ekspor ke Sheets']);
  pdfBtn.addEventListener('click', function () { exportRun('exportSessionPdf', pdfBtn, 'Laporan PDF siap', 'Tersimpan di folder "AKTIVO_Archives" di Google Drive.', 'Buka PDF'); });
  shBtn.addEventListener('click', function () { exportRun('exportSessionSheet', shBtn, 'Spreadsheet siap', 'Peserta, seluruh jawaban, dan papan skor — tersimpan di folder "AKTIVO_Archives" di Google Drive.', 'Buka spreadsheet'); });
  box.appendChild(mk('div', { class: 'export-grid', style: 'margin-bottom:18px' }, [
    mk('div', { class: 'card export-card' }, [mk('span', { class: 'ei', style: 'background:var(--danger-soft);color:var(--danger)' }, [akIcon('file-text', 22)]), mk('div', { class: 'grow' }, [mk('b', { text: 'Laporan PDF' }), mk('p', { class: 'small muted', style: 'margin:4px 0 12px', text: 'Hasil setiap slide, papan skor, daftar hadir, serta nama dan kolom tanda tangan fasilitator.' }), pdfBtn])]),
    mk('div', { class: 'card export-card' }, [mk('span', { class: 'ei', style: 'background:var(--success-soft);color:var(--success)' }, [akIcon('sheet', 22)]), mk('div', { class: 'grow' }, [mk('b', { text: 'Google Sheets' }), mk('p', { class: 'small muted', style: 'margin:4px 0 12px', text: 'Data mentah untuk penilaian atau analisis: satu baris per jawaban, lengkap dengan nama, email, dan poin.' }), shBtn])])
  ]));

  var tw = mk('div', { class: 'table-wrap card' });
  var table = mk('table', { class: 'table' }, [mk('tr', null, ['#', 'Slide', 'Jenis', 'Status', 'Jawaban', ''].map(function (h) { return mk('th', { text: h }); }))]);
  items.forEach(function (it, i) {
    var t = AK_TYPES[it.type] || { label: it.type };
    var counts = ['announcement', 'leaderboard'].indexOf(it.type) < 0;
    table.appendChild(mk('tr', null, [
      mk('td', { text: String(i + 1) }), mk('td', { class: 'ellipsis', style: 'max-width:340px', text: it.title }), mk('td', { text: t.label }),
      mk('td', { text: it.status === 'active' ? 'Terbuka' : it.status === 'closed' ? 'Ditutup' : 'Tersembunyi' }),
      mk('td', { text: counts ? String(it.responseCount) : '\u2013' }),
      mk('td', null, [counts ? mk('div', { class: 'mini-bar' }, [mk('i', { style: 'width:' + Math.round((it.responseCount / maxResp) * 100) + '%' })]) : null])
    ]));
  });
  tw.appendChild(items.length ? table : mk('div', { class: 'empty', text: 'Belum ada slide.' }));
  box.appendChild(tw);
}

function exportRun(fn, btn, title, msg, linkText) {
  akBusy(btn, true, 'Membuat…');
  akCall(fn, [H.token, H.eventId], function (res) {
    akBusy(btn, false);
    if (res.success) akLinkDialog(title, msg, res.fileUrl, linkText);
    else akAlert('Ekspor gagal', res.message || 'Silakan coba lagi.', 'OK', null, 'alert');
  }, function (m, auth) { akBusy(btn, false); if (!auth) akAlert('Ekspor gagal', 'Silakan coba lagi sebentar lagi.', 'OK', null, 'alert'); });
}

window.addEventListener('beforeunload', function (e) { if (H.dirty) { e.preventDefault(); e.returnValue = ''; } });

/* ================= Boot ================= */
(function boot() {
  var t = akStore.get('host_token', true);
  if (!t) { showGate(); return; }
  H.token = t;
  akCall('getMe', [t], function (res) { H.me = res.host; enterApp(); }, function (m, auth) { if (!auth) showGate(); });
})();
