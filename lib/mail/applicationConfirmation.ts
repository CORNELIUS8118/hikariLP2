import { sendMail } from './client';

// 公式LINE登録URL（申込確認メール専用の固定リンク。既存の LINE_URL 環境変数とは別管理）
const OFFICIAL_LINE_URL = 'https://lin.ee/989acvh';

export interface ApplicationConfirmationInput {
  sei: string;
  mei: string;
  sei_kana: string;
  mei_kana: string;
  company_name: string;
  company_name_kana: string;
  birthdate: string;
  phone: string;
  email: string;
  postal_code: string;
  address: string;
  building_name: string;
  residence_type: string;
  bank_name: string;
  branch_name: string;
  account_number: string;
  account_holder: string;
  referrer: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const orBlank = (v: string) => (v ? v : '未入力');

// メール本文専用の口座番号マスク（GAS payload・スプレッドシート保存値には影響しない）
function maskAccountNumber(value: string): string {
  if (!value) return '';
  if (value.length <= 4) return '*'.repeat(value.length);
  return '****' + value.slice(-4);
}

export function formatJstDateTime(date: Date): string {
  const parts = new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? '';

  return `${get('year')}/${get('month')}/${get('day')} ${get('hour')}:${get('minute')}`;
}

function buildRows(input: ApplicationConfirmationInput, submittedAtJst: string) {
  const name = [input.sei, input.mei].filter(Boolean).join(' ');
  const kana = [input.sei_kana, input.mei_kana].filter(Boolean).join(' ');

  return [
    ['お名前', name],
    ['フリガナ', kana],
    ['屋号・事業所名', input.company_name],
    ['屋号・事業所名フリガナ', input.company_name_kana],
    ['生年月日', input.birthdate],
    ['電話番号', input.phone],
    ['メールアドレス', input.email],
    ['郵便番号', input.postal_code],
    ['住所', input.address],
    ['建物名', input.building_name],
    ['住居区分', input.residence_type],
    ['銀行名', input.bank_name],
    ['支店名', input.branch_name],
    ['口座番号', maskAccountNumber(input.account_number)],
    ['口座名義', input.account_holder],
    ['紹介者', input.referrer],
    ['申込日時', submittedAtJst],
  ] as const;
}

export function buildApplicationConfirmationEmail(
  input: ApplicationConfirmationInput,
  submittedAt: Date,
) {
  const displayName = [input.sei, input.mei].filter(Boolean).join(' ') || 'お客様';
  const submittedAtJst = formatJstDateTime(submittedAt);
  const rows = buildRows(input, submittedAtJst);

  const subject = '【光回線10ヶ月無料キャンペーン】お申し込み確認';

  const tableRowsHtml = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e5e5;color:#333333;font-size:13px;white-space:nowrap;background-color:#f7f7f7;">${escapeHtml(label)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e5e5;color:#1a1a1a;font-size:13px;word-break:break-all;">${escapeHtml(orBlank(value))}</td>
        </tr>`,
    )
    .join('');

  const html = `
<div style="margin:0;padding:0;background-color:#ffffff;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;">
          <tr>
            <td style="padding:0 4px;font-family:'Hiragino Kaku Gothic ProN','Hiragino Sans',sans-serif;color:#1a1a1a;font-size:14px;line-height:1.8;">

              <p style="margin:0 0 16px 0;">${escapeHtml(displayName)} 様</p>

              <p style="margin:0 0 8px 0;">この度は「光回線10ヶ月無料キャンペーン」へお申し込みいただき、誠にありがとうございます。</p>
              <p style="margin:0 0 8px 0;">お申し込みを受け付けいたしました。</p>
              <p style="margin:0 0 24px 0;">担当者より順次ご連絡させていただきますので、今しばらくお待ちください。</p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid #1e3a8a;border-bottom:2px solid #1e3a8a;margin:0 0 24px 0;">
                <tr>
                  <td style="padding:16px 12px;">
                    <p style="margin:0 0 8px 0;color:#dc2626;font-weight:bold;font-size:15px;">【登録していない方は必ずこちらをご登録ください】</p>
                    <p style="margin:0 0 4px 0;">お手続きやご案内をスムーズに行うため、</p>
                    <p style="margin:0 0 16px 0;">公式LINEのご登録をお願いいたします。</p>
                    <p style="margin:0 0 12px 0;">▼公式LINE<br>
                      <a href="${OFFICIAL_LINE_URL}" style="color:#1e3a8a;">${OFFICIAL_LINE_URL}</a>
                    </p>
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="border-radius:8px;background-color:#06c755;">
                          <a href="${OFFICIAL_LINE_URL}" style="display:inline-block;padding:12px 28px;color:#ffffff;font-weight:bold;font-size:14px;text-decoration:none;">公式LINEを登録する</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 12px 0;font-weight:bold;font-size:15px;">■ お申し込み内容</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;border:1px solid #e5e5e5;">
                ${tableRowsHtml}
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:2px solid #1e3a8a;border-bottom:2px solid #1e3a8a;margin:0 0 24px 0;">
                <tr>
                  <td style="padding:16px 12px;">
                    <p style="margin:0 0 8px 0;font-weight:bold;">【今後の流れ】</p>
                    <p style="margin:0 0 4px 0;">① 公式LINEへご登録</p>
                    <p style="margin:0 0 4px 0;">② 担当者より内容確認のご連絡</p>
                    <p style="margin:0 0 4px 0;">③ お申し込み手続き</p>
                    <p style="margin:0 0 4px 0;">④ 開通日決定</p>
                    <p style="margin:0;">⑤ サービス開始</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 4px 0;color:#555555;font-size:12px;">このメールはシステムより自動送信されています。</p>
              <p style="margin:0 0 4px 0;color:#555555;font-size:12px;">ご返信いただいても確認・返信はできません。</p>
              <p style="margin:0 0 4px 0;color:#555555;font-size:12px;">お問い合わせは公式LINEよりお願いいたします。</p>
              <p style="margin:0 0 24px 0;color:#555555;font-size:12px;">▼公式LINE<br>
                <a href="${OFFICIAL_LINE_URL}" style="color:#1e3a8a;">${OFFICIAL_LINE_URL}</a>
              </p>

              <p style="margin:0;color:#999999;font-size:12px;">光回線10ヶ月無料キャンペーン</p>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>`;

  const textRows = rows.map(([label, value]) => `${label}：${orBlank(value)}`).join('\n');

  const text = `${displayName} 様

この度は「光回線10ヶ月無料キャンペーン」へお申し込みいただき、誠にありがとうございます。
お申し込みを受け付けいたしました。
担当者より順次ご連絡させていただきますので、今しばらくお待ちください。

━━━━━━━━━━━━━━━━━━
【登録していない方は必ずこちらをご登録ください】
お手続きやご案内をスムーズに行うため、
公式LINEのご登録をお願いいたします。
▼公式LINE
${OFFICIAL_LINE_URL}
━━━━━━━━━━━━━━━━━━

■ お申し込み内容
${textRows}

━━━━━━━━━━━━━━━━━━
【今後の流れ】
① 公式LINEへご登録
② 担当者より内容確認のご連絡
③ お申し込み手続き
④ 開通日決定
⑤ サービス開始
━━━━━━━━━━━━━━━━━━

このメールはシステムより自動送信されています。
ご返信いただいても確認・返信はできません。
お問い合わせは公式LINEよりお願いいたします。
▼公式LINE
${OFFICIAL_LINE_URL}
━━━━━━━━━━━━━━━━━━
光回線10ヶ月無料キャンペーン
`;

  return { subject, html, text };
}

export async function sendApplicationConfirmationEmail(
  input: ApplicationConfirmationInput,
  submittedAt: Date,
): Promise<void> {
  const { subject, html, text } = buildApplicationConfirmationEmail(input, submittedAt);
  await sendMail({ to: input.email, subject, html, text });
}
