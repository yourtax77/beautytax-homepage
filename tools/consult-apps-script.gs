/**
 * 뷰티택스 상담 신청 접수 (Google Apps Script)
 *
 * beauti-tax.com 상담 신청 폼의 내용을
 *   1) 이 스크립트가 붙은 구글 시트의 '상담신청' 탭에 한 줄씩 쌓고
 *   2) 아래 NOTIFY_EMAIL 주소로 알림 메일을 보냅니다.
 *
 * ※ 안심상속센터 시트와는 별개의 새 시트에 붙여서 쓰세요.
 * 설정 방법은 tools/상담신청-연결방법.md 를 보세요.
 */

// ★ 알림 받을 이메일 주소 (여러 개면 쉼표로 구분)
//   비워두면 이 시트를 만든 구글 계정으로 알림이 갑니다.
const NOTIFY_EMAIL = '';

const SHEET_NAME = '상담신청';
const HEADERS = ['접수일시', '대표자명', '연락처', '상호명', '지역', '업종', '직원 수', '현재 기장', '관심사', '문의 내용', '처리 상태', '메모'];

function doPost(e) {
  const p = (e && e.parameter) || {};

  // 스팸 방지: 사람에게는 보이지 않는 칸이 채워져 있으면 무시
  if (p.website) return reply_('ok');

  const name = clean_(p.name, 40);
  const phone = clean_(p.phone, 30);
  if (!name || phone.replace(/[^0-9]/g, '').length < 9) return reply_('invalid');

  const row = {
    shop: clean_(p.shop, 60),
    area: clean_(p.area, 60),
    type: clean_(p.type, 40),
    staff: clean_(p.staff, 40),
    current: clean_(p.current, 40),
    interest: clean_(p.interest, 100),
    memo: clean_(p.memo, 2000)
  };

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) {
      sh.appendRow(HEADERS);
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    }
    sh.appendRow([new Date(), name, phone, row.shop, row.area, row.type, row.staff, row.current, row.interest, row.memo, '미확인', '']);
  } finally {
    lock.releaseLock();
  }

  MailApp.sendEmail({
    to: NOTIFY_EMAIL || Session.getEffectiveUser().getEmail(),
    subject: '[뷰티택스] 새 상담 신청 - ' + name + ' (' + (row.type || '업종 미선택') + ')',
    body:
      '뷰티택스 홈페이지로 새 상담 신청이 들어왔습니다.\n\n' +
      '대표자명: ' + name + '\n' +
      '연락처: ' + phone + '\n' +
      '상호명: ' + row.shop + '\n' +
      '지역: ' + row.area + '\n' +
      '업종: ' + row.type + '\n' +
      '직원 수: ' + row.staff + '\n' +
      '현재 기장: ' + row.current + '\n' +
      '관심사: ' + row.interest + '\n' +
      '문의 내용:\n' + (row.memo || '(없음)') + '\n\n' +
      '접수 시각: ' + Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm') + '\n\n' +
      '전체 목록: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl()
  });

  return reply_('ok');
}

// 길이 제한 + 시트 수식 실행 방지 (=, +, -, @ 로 시작하면 글자로 저장)
function clean_(v, max) {
  let s = String(v || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function reply_(text) {
  return ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.TEXT);
}

// 설정 확인용: 편집기에서 이 함수를 한 번 실행하면 시트에 테스트 줄이 생기고 메일이 옵니다.
function testSubmit() {
  doPost({ parameter: { name: '테스트', phone: '010-0000-0000', shop: '테스트 네일', area: '서울', type: '네일아트', staff: '원장님 혼자', current: '아직 사업 전이에요', interest: '개업·환급', memo: '연결 테스트입니다.' } });
}
