(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  let members = [], selected = null;
  const views = ['select', 'gift', 'letter', 'heart'];
  const normalize = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase();
  function show(view) {
    views.forEach(name => { $(name + '-view').hidden = name !== view; });
    document.body.dataset.view = view;
    window.scrollTo(0, 0);
    $(view + '-view').scrollTop = 0;
    const title = $(view + '-title');
    if (title) { title.setAttribute('tabindex', '-1'); title.focus({ preventScroll: true }); }
  }
  function imageFallback(img) {
    img.addEventListener('error', () => {
      img.hidden = true;
      img.parentElement.classList.add('missing-photo');
    }, { once: true });
  }
  function render() {
    const query = normalize($('search').value.trim());
    const matches = members.filter(m => normalize(m.name).includes(query));
    $('members').replaceChildren();
    $('status').textContent = matches.length ? `${matches.length} món quà đang chờ người nhận` : 'Chưa thấy tên bạn. Thử nhập một phần tên nhé.';
    matches.forEach(member => {
      const button = document.createElement('button');
      button.className = 'member';
      const photo = document.createElement('span'); photo.className = 'member-photo';
      const img = document.createElement('img'); img.src = member.thumbnail || member.avatar; img.alt = ''; img.loading = 'lazy'; imageFallback(img);
      const name = document.createElement('span'); name.className = 'member-name'; name.textContent = member.name;
      photo.append(img); button.append(photo, name);
      button.addEventListener('click', () => {
        selected = member;
        if (window.gemusHeart.focusMember?.(member.id)) {
          show('heart');
          $('heart-status').textContent = member.name + ' · Chạm đốm sáng được đánh dấu để mở thiệp';
        } else openLetter();
      });
      $('members').append(button);
    });
  }
  async function load() {
    $('retry').hidden = true;
    $('heart-retry').hidden = true;
    $('status').textContent = 'Đang chuẩn bị những món quà…';
    try {
      const configResponse = await fetch('site-config.json');
      if (!configResponse.ok) throw new Error('Could not load configuration');
      const config = await configResponse.json();
      $('preview-note').hidden = !config.preview;
      const response = await fetch(config.membersFile || 'members.json');
      if (!response.ok) throw new Error('Could not load members');
      const data = await response.json();
      if (!Array.isArray(data) || !data.length || data.some(m => !m.name || !m.avatar || !m.wish)) throw new Error('Invalid member data');
      members = data; render();
      window.gemusHeart.setMembers(members, member => { selected = member; openLetter(); });
      $('heart-status').textContent = config.preview ? `Bản xem thử ${members.length} người · Ảnh lặp, tên và lời nhắn minh họa` : 'Tìm đốm sáng mang tên bạn nhé.';
    } catch (error) {
      $('status').textContent = 'Chưa tải được danh sách. Bạn kiểm tra kết nối rồi thử lại nhé.';
      $('retry').hidden = false;
      $('heart-retry').hidden = false;
      $('heart-status').textContent = 'Chưa tải được tên. Bạn thử tải lại nhé.';
    }
  }
  function openLetter() {
    if (!selected) return;
    $('letter-title').textContent = selected.name;
    $('personal-wish').textContent = selected.wish;
    const img = $('letter-photo');
    img.hidden = false; img.parentElement.classList.remove('missing-photo');
    img.alt = selected.name; imageFallback(img); img.src = selected.avatar;
    $('read-again').hidden = false;
    show('letter');
  }
  $('find-member').addEventListener('click', () => show('select'));
  $('back-heart').addEventListener('click', () => show('heart'));
  $('heart-retry').addEventListener('click', load);
  $('search').addEventListener('input', render);
  $('retry').addEventListener('click', load);
  $('choose-again').addEventListener('click', () => show('select'));
  $('open-gift').addEventListener('click', openLetter);
  $('read-again').addEventListener('click', openLetter);
  $('close-letter').addEventListener('click', () => show('heart'));
  $('explore').addEventListener('click', () => show('heart'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.dataset.view === 'letter') show('heart'); });
  load();
})();
