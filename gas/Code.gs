// ============================================================
// 光回線LP - Google Apps Script
// ============================================================
// 設定: スクリプトプロパティ（プロジェクトの設定 > スクリプトプロパティ）に
// SHEET_ID = スプレッドシートのID を追加してください
// ============================================================
//
// 【列の自動追加について】
// 既存シートに不足している列がある場合、送信時に末尾へ自動追加します。
// 既存データは削除されません。既存列は削除されません。
// 列への書き込みはヘッダー名で照合するため、列順が変わっても正常動作します。
//
// 【申込意思による保存先】
// 「今すぐ申し込みしたい」(intent=A) → 申込データ シート
// 「考えたい」(intent=D)             → 検討中データ シート（なければ自動作成）
// ============================================================

var SHEET_NAME          = '申込データ';
var THINKING_SHEET_NAME = '検討中データ';

// 新規シート作成時のヘッダー順序（フォーム表示順に合わせる）
// ※既存シートのヘッダーは変更しない。不足列のみ末尾に追加する。
var HEADERS = [
  '送信日時',
  'submission_id',
  '姓',
  '名',
  'セイ',
  'メイ',
  '屋号名・事業所名',
  '屋号名・事業所名フリガナ',
  '生年月日',
  '携帯番号',
  '郵便番号',
  '住所',
  '建物名（部屋番号）',
  '住居区分',
  '銀行名',
  '支店名',
  '口座番号',
  '口座名義（カナ）',
  'メールアドレス',
  '申込意思',
  'LINE表示有無',
  'LINEクリック有無',
  '流入元ref',
  'UserAgent',
  'FAQ確認済み',
  'FAQ確認日時',
  'FAQ確認数',
  '紹介者'
];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheetId = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
    var ss = SpreadsheetApp.openById(sheetId);

    if (data.action === 'submit') {
      // target_sheet で申込データ / 検討中データ を振り分ける
      var targetSheetName = data.target_sheet === THINKING_SHEET_NAME ? THINKING_SHEET_NAME : SHEET_NAME;
      var targetSheet = ss.getSheetByName(targetSheetName);
      if (!targetSheet) {
        targetSheet = initSheet(ss, targetSheetName);
      }
      return handleSubmit(targetSheet, data);
    }

    if (data.action === 'line_click') {
      // LINEクリックは申込データのみ（LINE表示はA意思のみ）
      var submitSheet = ss.getSheetByName(SHEET_NAME);
      if (!submitSheet) {
        return jsonResponse({ error: 'sheet not found' });
      }
      return handleLineClick(submitSheet, data);
    }

    return jsonResponse({ error: 'unknown_action' });
  } catch (err) {
    return jsonResponse({ error: String(err) });
  }
}

function initSheet(ss, sheetName) {
  var sheet = ss.insertSheet(sheetName);
  sheet.appendRow(HEADERS);
  sheet.setFrozenRows(1);
  var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setBackground('#1e3a8a');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  return sheet;
}

// シートの1行目からヘッダー配列を取得する
function getHeaders(sheet) {
  var lastCol = sheet.getLastColumn();
  if (lastCol === 0) return [];
  return sheet.getRange(1, 1, 1, lastCol).getValues()[0];
}

// 列名が存在すればその列番号（1-indexed）を返す。
// 存在しない場合は末尾に列を追加してその番号を返す。
function ensureColumn(sheet, headers, colName) {
  var idx = headers.indexOf(colName);
  if (idx !== -1) return idx + 1;

  // 不足列を末尾に追加
  var newColNum = headers.length + 1;
  var cell = sheet.getRange(1, newColNum);
  cell.setValue(colName);
  cell.setBackground('#1e3a8a');
  cell.setFontColor('#ffffff');
  cell.setFontWeight('bold');
  headers.push(colName); // ローカル配列も更新（次のlookupに反映）
  return newColNum;
}

function handleSubmit(sheet, data) {
  var now = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm:ss');
  var headers = getHeaders(sheet);

  // 書き込むデータを「列名 → 値」の配列で定義（フォーム表示順）
  var rowData = [
    { col: '送信日時',               val: now },
    { col: 'submission_id',          val: data.submission_id || '' },
    { col: '姓',                     val: data.sei || '' },
    { col: '名',                     val: data.mei || '' },
    // 旧互換列：姓+名を結合して保存（既存シートに列があれば書き込む）
    { col: '名前（漢字）',           val: data.name_kanji || '' },
    { col: 'セイ',                   val: data.sei_kana || '' },
    { col: 'メイ',                   val: data.mei_kana || '' },
    // 旧互換列：セイ+メイを結合して保存（既存シートに列があれば書き込む）
    { col: '名前（フリガナ）',       val: data.name_kana || '' },
    { col: '屋号名・事業所名',       val: data.company_name || '' },
    { col: '屋号名・事業所名フリガナ', val: data.company_name_kana || '' },
    { col: '生年月日',               val: data.birthdate || '' },
    { col: '携帯番号',               val: data.phone || '' },
    { col: '郵便番号',               val: data.postal_code || '' },
    { col: '住所',                   val: data.address || '' },
    { col: '建物名（部屋番号）',     val: data.building_name || '' },
    { col: '住居区分',               val: data.residence_type || '' },
    { col: '銀行名',                 val: data.bank_name || '' },
    { col: '支店名',                 val: data.branch_name || '' },
    { col: '口座番号',               val: data.account_number || '' },
    { col: '口座名義（カナ）',       val: data.account_holder || '' },
    { col: 'メールアドレス',         val: data.email || '' },
    { col: '申込意思',               val: intentLabel(data.intent) },
    { col: 'LINE表示有無',           val: data.show_line ? 'あり' : 'なし' },
    { col: 'LINEクリック有無',       val: 'なし' },
    { col: '流入元ref',              val: data.ref || '' },
    { col: 'UserAgent',              val: data.ua || '' },
    { col: 'FAQ確認済み',            val: data.faq_confirmed ? '確認済み' : '未確認' },
    { col: 'FAQ確認日時',            val: data.faq_confirmed_at || '' },
    { col: 'FAQ確認数',              val: data.faq_confirm_count || '' },
    { col: '紹介者',                 val: data.referrer || '' },
  ];

  // 書き込み行番号を確定（ヘッダー追加前に取得）
  var newRow = sheet.getLastRow() + 1;

  // 列ごとに「列が無ければ追加 → 正しいセルに書き込み」
  rowData.forEach(function(item) {
    var colNum = ensureColumn(sheet, headers, item.col);
    sheet.getRange(newRow, colNum).setValue(item.val);
  });

  return jsonResponse({ success: true });
}

function handleLineClick(sheet, data) {
  if (!data.submission_id) {
    return jsonResponse({ error: 'submission_id missing' });
  }

  var headers = getHeaders(sheet);
  var submissionIdIdx = headers.indexOf('submission_id');   // 0-indexed（行配列用）
  var lineClickColNum = headers.indexOf('LINEクリック有無') + 1; // 1-indexed（getRange用）

  if (submissionIdIdx === -1 || lineClickColNum === 0) {
    return jsonResponse({ error: 'required columns not found' });
  }

  var rows = sheet.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][submissionIdIdx] === data.submission_id) {
      sheet.getRange(i + 1, lineClickColNum).setValue('あり');
      break;
    }
  }
  return jsonResponse({ success: true });
}

function intentLabel(intent) {
  var labels = {
    'A': '今すぐ申し込みしたい',
    'D': '考えたい'
  };
  return labels[intent] || intent || '';
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
