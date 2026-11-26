(function () {
  var O = window.OFFICE || {};

  // 사무소 정보 채우기
  document.querySelectorAll('[data-office]').forEach(function (el) {
    var v = O[el.getAttribute('data-office')];
    if (v) el.textContent = v; else el.closest('span,div').style.display = 'none';
  });
  document.querySelectorAll('[data-tel]').forEach(function (a) {
    var t = O.consultPhone || O.phone; if (t) a.href = 'tel:' + t.replace(/[^0-9]/g, '');
  });

  // 스크롤 시 헤더 배경
  var hd = document.getElementById('hd');
  function onScroll() { hd.classList.toggle('scrolled', window.scrollY > 30); }
  window.addEventListener('scroll', onScroll); onScroll();

  // 모바일 메뉴
  var menu = document.getElementById('menu');
  document.getElementById('burger').addEventListener('click', function () { menu.classList.toggle('open'); });
  menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { menu.classList.remove('open'); }); });

  // 특화 서비스: 마우스 올린 항목 강조
  var sps = document.querySelectorAll('.sp');
  sps.forEach(function (s) {
    s.addEventListener('mouseenter', function () { sps.forEach(function (x) { x.classList.remove('on'); }); s.classList.add('on'); });
  });

  // 주요기능 탭
  var tabs = document.querySelectorAll('.tab'), panels = document.querySelectorAll('.panel');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      var i = +t.getAttribute('data-tab');
      tabs.forEach(function (x, j) { x.classList.toggle('on', j === i); });
      panels.forEach(function (p, j) { p.classList.toggle('on', j === i); });
    });
  });

  // 상담 신청
  var form = document.getElementById('consultForm'), msg = document.getElementById('msg');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name.value.trim(), phone = form.phone.value.trim();
    if (!name || !phone) { msg.textContent = '대표자명과 연락처를 입력해 주세요.'; return; }
    if (!document.getElementById('agree').checked) { msg.textContent = '개인정보 수집·이용에 동의해 주세요.'; return; }
    if (phone.replace(/[^0-9]/g, '').length < 9) { msg.textContent = '연락처를 확인해 주세요.'; return; }
    if (!O.consultEndpoint) {
      msg.textContent = '온라인 접수는 준비 중입니다. ' + (O.consultPhone ? O.consultPhone + '로 전화 주시면 바로 상담해 드릴게요.' : '');
      return;
    }
    // 구글 Apps Script로 전송 (설정 방법: tools/상담신청-연결방법.md)
    var data = new URLSearchParams(), interest = [];
    new FormData(form).forEach(function (v, k) {
      if (k === 'interest') interest.push(v); else data.append(k, String(v).trim());
    });
    data.append('interest', interest.join(', '));
    var btn = form.querySelector('button[type=submit]');
    btn.disabled = true;
    msg.textContent = '보내는 중입니다…';
    // Apps Script는 다른 주소라 응답을 읽을 수 없어(no-cors), 전송이 끝나면 접수된 것으로 안내합니다.
    fetch(O.consultEndpoint, { method: 'POST', mode: 'no-cors', body: data })
      .then(function () { form.reset(); msg.textContent = '상담 신청이 접수되었습니다. 확인 후 세무사가 직접 연락드리겠습니다.'; })
      .catch(function () { msg.textContent = '전송에 실패했습니다. 잠시 후 다시 시도하시거나 ' + (O.consultPhone || O.phone || '') + '로 전화 주세요.'; })
      .then(function () { btn.disabled = false; });
  });
})();
