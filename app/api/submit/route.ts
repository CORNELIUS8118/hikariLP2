import { NextRequest, NextResponse } from 'next/server';

const s = (v: unknown): string => (v != null ? String(v) : '');
const b = (v: unknown): boolean => v === true || v === 'true';

const SHEET_SUBMIT   = '申込データ';
const SHEET_THINKING = '検討中データ';

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Record<string, unknown>;

  const gasUrl  = process.env.GAS_URL;
  const lineUrl = process.env.LINE_URL;

  const ua     = req.headers.get('user-agent') ?? 'unknown';
  const intent = s(body.intent);
  const ref    = s(body.ref);

  const showLine    = intent === 'A';
  const targetSheet = intent === 'A' ? SHEET_SUBMIT : SHEET_THINKING;

  // 姓・名からフルネームを導出（旧互換列用）
  const sei       = s(body.sei);
  const mei       = s(body.mei);
  const seiKana   = s(body.sei_kana);
  const meiKana   = s(body.mei_kana);
  const nameKanji = sei && mei ? `${sei} ${mei}` : sei || mei;
  const nameKana  = seiKana && meiKana ? `${seiKana} ${meiKana}` : seiKana || meiKana;

  const payload = {
    action: 'submit',
    submission_id:       s(body.submission_id),
    target_sheet:        targetSheet,
    // 分割フィールド（新列）
    sei,
    mei,
    sei_kana:            seiKana,
    mei_kana:            meiKana,
    // 旧互換列（姓名を結合して既存列にも保存）
    name_kanji:          nameKanji,
    name_kana:           nameKana,
    // 事業所
    company_name:        s(body.company_name),
    company_name_kana:   s(body.company_name_kana),
    // 基本情報
    birthdate:           s(body.birthdate),
    phone:               s(body.phone),
    postal_code:         s(body.postal_code),
    address:             s(body.address),
    building_name:       s(body.building_name),
    residence_type:      s(body.residence_type),
    // 口座
    bank_name:           s(body.bank_name),
    branch_name:         s(body.branch_name),
    account_number:      s(body.account_number),
    account_holder:      s(body.account_holder),
    // 連絡先（最後）
    email:               s(body.email),
    // 紹介者
    referrer:            s(body.referrer),
    // システム
    intent,
    show_line:           showLine,
    ref,
    ua,
    faq_confirmed:       b(body.faq_confirmed),
    faq_confirmed_at:    s(body.faq_confirmed_at),
    faq_confirm_count:   s(body.faq_confirm_count),
  };

  // サーバーログ（個人情報を含まないフィールドのみ）
  const logCtx = {
    ts:            new Date().toISOString(),
    intent,
    targetSheet,
    showLine,
    ref,
    ua:            ua.slice(0, 100),
    submission_id: s(body.submission_id),
  };

  console.log('[submit] start', JSON.stringify(logCtx));

  if (gasUrl) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 9000);

    try {
      const gasRes = await fetch(gasUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!gasRes.ok) {
        console.error('[submit] GAS HTTP error', JSON.stringify({ ...logCtx, gasStatus: gasRes.status, lineUrlReturned: false }));
        return NextResponse.json({ error: 'GAS送信エラー' }, { status: 500 });
      }

      // GASは常にHTTP 200を返すため、レスポンスボディのerrorフィールドも確認する
      const gasData = await gasRes.json().catch(() => null) as Record<string, unknown> | null;
      if (!gasData || gasData.error) {
        console.error('[submit] GAS body error', JSON.stringify({
          ...logCtx,
          gasError: String(gasData?.error ?? 'parse failed'),
          lineUrlReturned: false,
        }));
        return NextResponse.json({ error: 'GAS送信エラー' }, { status: 500 });
      }

      const lineUrlReturned = showLine && !!lineUrl;
      console.log('[submit] success', JSON.stringify({ ...logCtx, gasSaved: true, lineUrlReturned }));
    } catch (err) {
      console.error('[submit] timeout/network error', JSON.stringify({ ...logCtx, error: String(err), lineUrlReturned: false }));
      return NextResponse.json({ error: '送信タイムアウト。再度お試しください。' }, { status: 500 });
    } finally {
      clearTimeout(timer);
    }
  } else {
    const lineUrlReturned = showLine && !!lineUrl;
    console.warn('[mock] GAS_URL未設定 — ローカル開発モードで動作中', JSON.stringify({ ...logCtx, lineUrlReturned }));
  }

  return NextResponse.json({
    success: true,
    ...(showLine && lineUrl ? { line_url: lineUrl } : {}),
  });
}
