/* 뷰티택스 채팅 상담창 (모든 페이지 공통)
 * - 오른쪽 아래 버튼 → 요금 안내 / 자주 묻는 질문 / 상담 남기기
 * - 상담 남기기는 업종·상담 분야·상황·상호·대표자명·연락처를 받아
 *   상담 신청 폼과 같은 구글 시트 + 알림 메일로 보냅니다 (office.js 의 consultEndpoint).
 * - 실시간 대화가 아니라, 남겨 주신 내용을 보고 세무사가 연락드리는 방식입니다.
 */
(function () {
  var O = window.OFFICE || {};
  if (window.__beautyChat) return;
  window.__beautyChat = true;
  var TEL = O.consultPhone || O.phone || '';

  var C = { main: '#D9577A', dark: '#B93E61', soft: '#FBF0F3', line: '#EBDDE2', ink: '#1C1418' };
  var css = [
    '.bc-btn{position:fixed;right:20px;bottom:20px;z-index:60;display:flex;align-items:center;gap:8px;height:56px;padding:0 20px 0 16px;border:0;border-radius:999px;background:linear-gradient(135deg,#EF8AA6,' + C.dark + ');color:#fff;font:700 15px/1 "Pretendard Variable",Pretendard,-apple-system,"Malgun Gothic",sans-serif;box-shadow:0 10px 26px rgba(185,62,97,.4);cursor:pointer;transition:transform .15s}',
    '.bc-btn:hover{transform:translateY(-2px)}',
    '.bc-btn svg{width:24px;height:24px;flex:none}',
    '.bc-btn .dot{position:absolute;top:8px;right:10px;width:9px;height:9px;border-radius:50%;background:#fff;box-shadow:0 0 0 2px ' + C.dark + '}',
    '.bc-win{position:fixed;right:20px;bottom:88px;z-index:61;width:370px;max-width:calc(100vw - 24px);height:580px;max-height:calc(100vh - 120px);display:none;flex-direction:column;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.25);font-family:"Pretendard Variable",Pretendard,-apple-system,"Malgun Gothic",sans-serif;color:' + C.ink + ';word-break:keep-all}',
    '.bc-win.open{display:flex}',
    '.bc-head{background:linear-gradient(135deg,#EF8AA6,' + C.dark + ');color:#fff;padding:16px 18px 14px;position:relative}',
    '.bc-head b{display:block;font-size:18px;letter-spacing:-.03em}',
    '.bc-head span{display:block;font-size:13px;opacity:.9;margin-top:4px}',
    '.bc-x{position:absolute;top:12px;right:12px;width:34px;height:34px;border:0;border-radius:50%;background:rgba(255,255,255,.18);color:#fff;font-size:20px;line-height:34px;cursor:pointer}',
    '.bc-body{flex:1;overflow-y:auto;padding:16px 14px 8px;background:' + C.soft + '}',
    '.bc-row{display:flex;gap:8px;margin-bottom:10px;align-items:flex-start}',
    '.bc-row.me{justify-content:flex-end}',
    '.bc-ava{width:32px;height:32px;border-radius:9px;flex:none;background:url(/favicon.svg) center/cover}',
    '.bc-msg{max-width:80%;background:#fff;border:1px solid ' + C.line + ';border-radius:4px 14px 14px 14px;padding:10px 12px;font-size:14.5px;line-height:1.6;white-space:pre-line}',
    '.bc-row.me .bc-msg{background:' + C.main + ';color:#fff;border-color:' + C.main + ';border-radius:14px 4px 14px 14px}',
    '.bc-msg em{font-style:normal;font-weight:700;color:' + C.dark + '}',
    '.bc-msg small{display:block;margin-top:6px;font-size:12.5px;color:#8a7d83}',
    '.bc-chips{display:flex;flex-wrap:wrap;gap:6px;margin:2px 0 12px 40px}',
    '.bc-chips button{border:1.5px solid ' + C.main + ';background:#fff;color:' + C.dark + ';border-radius:999px;padding:7px 12px;font-family:inherit;font-size:13.5px;font-weight:600;line-height:1.2;cursor:pointer}',
    '.bc-chips button:hover{background:#FDE8EE}',
    '.bc-chips button.sub{border-color:' + C.line + ';color:#7a6d73;font-weight:500}',
    '.bc-agree{margin:2px 0 12px 40px;background:#fff;border:1px solid ' + C.line + ';border-radius:12px;padding:10px 12px;font-size:13px;line-height:1.55;color:#6B5F65}',
    '.bc-agree label{display:flex;gap:8px;align-items:flex-start;color:' + C.ink + ';font-weight:600;cursor:pointer}',
    '.bc-agree input{margin-top:3px;width:16px;height:16px;flex:none;accent-color:' + C.main + '}',
    '.bc-agree a{color:' + C.dark + '}',
    '.bc-agree button{margin-top:10px;width:100%;height:42px;border:0;border-radius:10px;background:' + C.main + ';color:#fff;font-family:inherit;font-size:14.5px;font-weight:700;cursor:pointer}',
    '.bc-agree button:disabled{opacity:.45;cursor:default}',
    '.bc-foot{display:flex;gap:8px;padding:10px 12px;border-top:1px solid ' + C.line + ';background:#fff}',
    '.bc-foot textarea{flex:1;resize:none;overflow:hidden;height:44px;border:1px solid ' + C.line + ';border-radius:10px;padding:11px 12px;font-family:inherit;font-size:15px;line-height:1.4;color:inherit;outline:none}',
    '.bc-foot textarea:focus{border-color:' + C.main + '}',
    '.bc-foot textarea:disabled{background:#f6f3f4}',
    '.bc-foot button{width:46px;height:44px;flex:none;border:0;border-radius:10px;background:' + C.main + ';color:#fff;cursor:pointer;display:grid;place-items:center}',
    '.bc-foot button:disabled{background:#d8cdd1;cursor:default}',
    '.bc-hp{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}',
    '@media (max-width:900px){.bc-btn{bottom:88px;right:14px;height:52px;padding:0 16px 0 13px;font-size:14px}.bc-win{right:12px;left:12px;width:auto;max-width:none;bottom:12px;height:auto;top:72px;max-height:none}}',
    '@media print{.bc-btn,.bc-win{display:none!important}}'
  ].join('');
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.9A8 8 0 1 1 21 12z"/><path d="M8.5 12h.01M12 12h.01M15.5 12h.01" stroke-width="2.6"/></svg>';
  var SEND = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg>';

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'bc-btn';
  btn.setAttribute('aria-label', '채팅으로 상담하기');
  btn.innerHTML = ICON + '<span>채팅 상담</span><i class="dot"></i>';

  var win = document.createElement('section');
  win.className = 'bc-win';
  win.setAttribute('role', 'dialog');
  win.setAttribute('aria-label', '뷰티택스 채팅 상담');
  win.innerHTML =
    '<div class="bc-head"><b>뷰티택스 상담</b><span>미용업 전문 세무사가 평일 9~18시에 직접 연락드립니다</span>' +
    '<button type="button" class="bc-x" aria-label="닫기">×</button></div>' +
    '<div class="bc-body" aria-live="polite"></div>' +
    '<div class="bc-foot"><textarea rows="1" placeholder="위 버튼을 눌러 주세요" disabled></textarea>' +
    '<button type="button" aria-label="보내기" disabled>' + SEND + '</button></div>' +
    '<div class="bc-hp" aria-hidden="true"><input type="text" tabindex="-1" autocomplete="off"></div>';

  document.body.appendChild(btn);
  document.body.appendChild(win);

  var body = win.querySelector('.bc-body');
  var ta = win.querySelector('textarea');
  var sendBtn = win.querySelector('.bc-foot button');
  var hp = win.querySelector('.bc-hp input');
  var data = {};
  var onText = null;
  var run = 0;  // 창을 새로 열 때마다 증가 (이전 대화의 늦은 응답 무시)

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function scroll() { body.scrollTop = body.scrollHeight; }
  function later(fn, ms) { var r = run; setTimeout(function () { if (r === run) fn(); }, ms || 300); }
  function bot(html) {
    var r = document.createElement('div');
    r.className = 'bc-row';
    r.innerHTML = '<div class="bc-ava" aria-hidden="true"></div><div class="bc-msg">' + html + '</div>';
    body.appendChild(r); scroll();
  }
  function me(text) {
    var r = document.createElement('div');
    r.className = 'bc-row me';
    r.innerHTML = '<div class="bc-msg">' + esc(text) + '</div>';
    body.appendChild(r); scroll();
  }
  // list: ['글자', ...] 또는 [{t:'글자', sub:true}]
  function chips(list, cb) {
    var w = document.createElement('div');
    w.className = 'bc-chips';
    list.forEach(function (it) {
      var t = typeof it === 'string' ? it : it.t;
      var b = document.createElement('button');
      b.type = 'button'; b.textContent = t;
      if (it.sub) b.className = 'sub';
      b.onclick = function () { w.remove(); me(t); cb(t); };
      w.appendChild(b);
    });
    body.appendChild(w); scroll();
  }
  function ask(placeholder, cb) {
    ta.disabled = false; sendBtn.disabled = false;
    ta.placeholder = placeholder; ta.value = '';
    onText = cb;
    setTimeout(function () { ta.focus(); }, 50);
  }
  function lock(ph) { ta.disabled = true; sendBtn.disabled = true; ta.value = ''; ta.placeholder = ph || ''; onText = null; }
  function submitText() {
    var v = ta.value.trim();
    if (!onText || !v) return;
    var cb = onText;
    me(v); lock();
    later(function () { cb(v); }, 250);
  }
  sendBtn.onclick = submitText;
  ta.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); submitText(); }
  });

  /* ---------- 처음 화면 ---------- */
  function home(first) {
    if (first) bot('안녕하세요, <em>뷰티택스</em>입니다.\n미용실·네일·피부관리 원장님의 세무를 챙겨드려요.\n무엇을 도와드릴까요?');
    else bot('다른 궁금하신 점이 있으신가요?');
    lock('위 버튼을 눌러 주세요');
    chips(['상담 남기기', '요금이 궁금해요', '자주 묻는 질문'], function (t) {
      if (t === '상담 남기기') later(stepBiz);
      else if (t === '요금이 궁금해요') later(price);
      else later(faqList);
    });
  }

  /* ---------- 요금 안내 ---------- */
  function price() {
    bot('뷰티택스 요금제는 세 가지예요. <small>(모두 부가세 별도)</small>\n\n' +
      '<em>① 연 구독형</em> 월 37,500원\n직원 없는 1인 매장 · 매출 8천만원 이하\n\n' +
      '<em>② AI 스마트 세무서비스</em> 월 60,000원\n직원·프리랜서 3명 이하 · 매출 1.5억원 이하\n\n' +
      '<em>③ 프리미엄 세무서비스</em> 월 80,000원부터\n규모와 관계없이, 여러 지점 운영 등 (별도 협의)');
    later(function () {
      bot('매장 상황을 남겨 주시면 맞는 요금제를 안내해 드릴게요.');
      chips(['상담 남기기', { t: '처음으로', sub: true }], function (t) {
        if (t === '상담 남기기') later(stepBiz); else later(function () { home(false); });
      });
    }, 500);
  }

  /* ---------- 자주 묻는 질문 ---------- */
  var FAQ = [
    ['디자이너를 프리랜서(3.3%)로 해도 되나요?',
      '근무 형태에 따라 달라요. 출퇴근 시간과 업무 지시를 받는 등 직원처럼 일하면 근로자로 볼 수 있어 4대보험 문제가 생길 수 있습니다.\n\n프리랜서로 3.3%를 떼고 지급했다면 원천세 신고와 함께 <em>사업소득 간이지급명세서를 매달</em> 제출해야 해요.'],
    ['현금 결제도 현금영수증을 꼭 끊어야 하나요?',
      '미용업은 <em>현금영수증 의무발행 업종</em>이에요.\n건당 10만원 이상 현금을 받으면 손님이 요청하지 않아도 발급해야 하고, 발급하지 않으면 그 금액의 <em>20%가 가산세</em>로 나올 수 있습니다.'],
    ['오픈 인테리어 부가세를 돌려받을 수 있나요?',
      '네. 인테리어와 시술 장비처럼 사업 설비에 들어간 부가세는 <em>조기환급</em>을 신청하면 신고기한보다 빨리 돌려받을 수 있어요.\n공사·구입할 때 <em>세금계산서를 꼭</em> 받아 두세요.'],
    ['간이과세와 일반과세, 뭐가 나아요?',
      '연 매출이 1억 400만원에 못 미칠 것 같으면 간이과세를 검토할 수 있어요.\n다만 간이과세자는 인테리어 부가세 환급을 받을 수 없어서, 공사비가 크면 <em>일반과세가 유리</em>할 수 있습니다. 오픈 전에 꼭 상담하세요.'],
    ['정액권·회원권 판매는 어떻게 신고하나요?',
      '정액권은 판매한 돈과 실제 시술에 쓴 금액을 따로 관리해 두는 게 중요해요.\n판매·사용 내역을 함께 정리해 두시면 신고 때 매출이 빠지거나 겹치지 않도록 챙겨 드립니다.']
  ];
  function faqList() {
    bot('궁금하신 질문을 골라 주세요.');
    lock('위 버튼을 눌러 주세요');
    chips(FAQ.map(function (f) { return f[0]; }).concat([{ t: '처음으로', sub: true }]), function (t) {
      if (t === '처음으로') { later(function () { home(false); }); return; }
      var f = FAQ.filter(function (x) { return x[0] === t; })[0];
      later(function () {
        bot(f[1] + '<small>※ 일반적인 안내이며 매장 상황에 따라 달라질 수 있어요.</small>');
        later(function () {
          chips(['다른 질문 보기', '상담 남기기', { t: '처음으로', sub: true }], function (t2) {
            if (t2 === '다른 질문 보기') later(faqList);
            else if (t2 === '상담 남기기') later(stepBiz);
            else later(function () { home(false); });
          });
        }, 400);
      }, 400);
    });
  }

  /* ---------- 상담 남기기 ---------- */
  function stepBiz() {
    data = {};
    bot('어떤 매장을 운영하고 계신가요?');
    lock('위 버튼을 눌러 주세요');
    chips(['미용실·헤어', '네일아트', '피부관리', '속눈썹·왁싱', '메이크업·반영구', '오픈 준비 중', '기타'], function (t) {
      data.type = t; later(stepTopic);
    });
  }
  function stepTopic() {
    bot('어떤 도움이 필요하세요?');
    chips(['기장·세금신고 맡기기', '디자이너 인건비', '개업·인테리어 환급', '절세 상담', '기타 문의'], function (t) {
      data.interest = t; later(stepMsg);
    });
  }
  function stepMsg() {
    var EX = {
      '기장·세금신고 맡기기': '네일숍 2년째 운영 중이고 매출은 월 1,500만원 정도예요. 지금은 혼자 신고하는데 맡기고 싶어요.',
      '디자이너 인건비': '디자이너 3명이 있는데 2명은 3.3%, 1명은 4대보험이에요. 제대로 처리하고 있는지 궁금해요.',
      '개업·인테리어 환급': '다음 달 미용실을 오픈해요. 인테리어 비용이 5천만원 정도 들었는데 부가세 환급이 되나요?',
      '절세 상담': '피부관리실 매출이 늘어서 종합소득세가 많이 나왔어요. 법인전환을 해야 할지 궁금해요.',
      '기타 문의': '매장을 다른 분께 넘기려고 하는데 권리금 세금이 어떻게 되는지 궁금해요.'
    };
    bot('상황을 간단히 적어 주세요.\n예: ' + (EX[data.interest] || EX['기타 문의']));
    ask('상황을 적어 주세요 (줄바꿈 Shift+Enter)', function (v) { data.memo = v.slice(0, 2000); stepShop(); });
  }
  function stepShop() {
    bot('<em>상호(매장 이름)</em>를 알려 주세요.\n아직 없으시면 "없음"이라고 적어 주세요.');
    ask('상호', function (v) { data.shop = /^없(음|어요|습니다)?$/.test(v) ? '' : v.slice(0, 60); stepName(); });
  }
  function stepName() {
    bot('대표자 <em>성함</em>을 알려 주세요.');
    ask('성함', function (v) { data.name = v.slice(0, 40); stepTel(); });
  }
  function stepTel(again) {
    bot(again ? '연락처를 다시 확인해 주세요. 숫자 9자리 이상으로 적어 주세요.'
      : esc(data.name) + ' 원장님, 연락받으실 <em>전화번호</em>를 알려 주세요.');
    ask('010-0000-0000', function (v) {
      if (v.replace(/[^0-9]/g, '').length < 9) { stepTel(true); return; }
      data.phone = v.slice(0, 30); stepAgree();
    });
  }
  function stepAgree() {
    bot('마지막으로 개인정보 수집·이용 동의가 필요합니다.');
    var w = document.createElement('div');
    w.className = 'bc-agree';
    w.innerHTML =
      '수집 항목: 대표자명, 연락처, 상호, 업종, 상담 내용 · 목적: 상담 연락 · 보관: 1년 후 파기 · 저장: Google(미국) 서버<br>' +
      '<a href="/privacy/" target="_blank" rel="noopener">개인정보처리방침 보기</a>' +
      '<label style="margin-top:8px"><input type="checkbox"> 위 내용에 동의합니다</label>' +
      '<button type="button" disabled>상담 남기기</button>';
    var cb = w.querySelector('input'), go = w.querySelector('button');
    cb.onchange = function () { go.disabled = !cb.checked; };
    go.onclick = function () { go.disabled = true; cb.disabled = true; send(w); };
    body.appendChild(w); scroll();
    lock('아래 동의 후 상담 남기기를 눌러 주세요');
  }
  function send(box) {
    if (!O.consultEndpoint) { bot('지금은 접수가 어렵습니다. 전화(' + esc(TEL) + ')로 문의해 주세요.'); return; }
    bot('보내는 중입니다…');
    var p = new URLSearchParams({
      name: data.name, phone: data.phone, shop: data.shop || '', type: data.type,
      interest: data.interest + ' (채팅 상담)', memo: data.memo || '', website: hp.value
    });
    var r = run;
    fetch(O.consultEndpoint, { method: 'POST', mode: 'no-cors', body: p })
      .then(function () {
        if (r !== run) return;
        box.remove();
        bot('<em>접수되었습니다.</em> 감사합니다.\n확인 후 평일 9~18시 안에 미용업 전문 세무사가 직접 연락드리겠습니다.');
        lock('상담이 접수되었습니다');
      })
      .catch(function () {
        if (r !== run) return;
        bot('전송에 실패했습니다. 잠시 후 다시 시도하시거나 전화(' + esc(TEL) + ')로 문의해 주세요.');
        box.querySelector('button').disabled = false;
        box.querySelector('input').disabled = false;
      });
  }

  function open() {
    win.classList.add('open'); btn.style.display = 'none';
    run++;  // 열 때마다 처음부터 새로 시작
    body.innerHTML = '';
    data = {};
    home(true);
  }
  function close() { win.classList.remove('open'); btn.style.display = ''; }
  btn.onclick = open;
  win.querySelector('.bc-x').onclick = close;
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && win.classList.contains('open')) close(); });
  // 페이지 안의 data-chat 버튼도 이 창을 엽니다
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-chat]');
    if (!a) return;
    e.preventDefault();
    open();
  });
  window.openBeautyChat = open;
})();
