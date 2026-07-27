'use client';

import { useState } from 'react';
import type { FormValues, Intent } from '@/lib/types';
import FaqSection, { FAQ_TOTAL } from './FaqSection';

interface Props {
  onConfirm: (values: FormValues) => void;
  initialValues?: FormValues | null;
}

const INTENT_OPTIONS: { value: Intent; label: string }[] = [
  { value: 'A', label: '今すぐ申し込みしたい' },
  { value: 'D', label: '考えたい' },
];

const INITIAL: FormValues = {
  sei: '',
  mei: '',
  sei_kana: '',
  mei_kana: '',
  company_name: '',
  company_name_kana: '',
  birthdate: '',
  phone: '',
  postal_code: '',
  address: '',
  building_name: '',
  residence_type: '',
  bank_name: '',
  branch_name: '',
  account_number: '',
  account_holder: '',
  email: '',
  intent: '',
  agreed: true,
  referrer: '',
};

// フォーム表示順と同じ並び
const REQUIRED_TEXT_FIELDS = [
  'sei', 'mei', 'sei_kana', 'mei_kana',
  'company_name', 'company_name_kana',
  'birthdate', 'phone', 'postal_code', 'address',
  'building_name', 'residence_type',
  'bank_name', 'branch_name', 'account_number', 'account_holder',
  'email', 'referrer',
] as const satisfies (keyof FormValues)[];

const POSTAL_PATTERN = /^\d{3}-?\d{4}$/;

export default function FormSection({ onConfirm, initialValues }: Props) {
  const [values, setValues] = useState<FormValues>(initialValues ?? INITIAL);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [faqConfirmedCount, setFaqConfirmedCount] = useState(0);

  const setField =
    (key: keyof FormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((prev) => ({ ...prev, [key]: e.target.value }));

  const cls = (val: string) => (submitted && !val ? errCls : normalCls);

  const postalFormatErr =
    submitted && !!values.postal_code && !POSTAL_PATTERN.test(values.postal_code);
  const postalCls =
    (submitted && !values.postal_code) || postalFormatErr ? errCls : normalCls;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const hasEmpty = REQUIRED_TEXT_FIELDS.some((k) => !values[k]);
    if (hasEmpty) {
      setError('未入力の項目があります。赤枠の項目をご確認ください。');
      return;
    }
    if (!POSTAL_PATTERN.test(values.postal_code)) {
      setError('郵便番号を正しく入力してください');
      return;
    }
    if (!values.intent) {
      setError('お申込み意思を選択してください');
      return;
    }
    if (faqConfirmedCount < FAQ_TOTAL) {
      setError('重要事項の確認が完了していません。すべての項目をご確認ください。');
      return;
    }

    setError('');
    onConfirm({
      ...values,
      agreed: true,
      faq_confirmed: true,
      faq_confirmed_at: new Date().toISOString(),
      faq_confirm_count: `${faqConfirmedCount}/${FAQ_TOTAL}`,
    });
  };

  return (
    <main className="min-h-screen bg-white pb-16">
      {/* ヘッダー */}
      <div className="bg-blue-900 text-white text-center py-8 px-4">
        <p className="text-xs tracking-widest text-blue-300 mb-2 font-medium">期間限定キャンペーン</p>
        <h1 className="text-2xl font-bold leading-snug">
          光回線
          <br />
          <span className="text-orange-400 text-3xl">「まるっと10ヶ月」</span>
          <br />
          無料キャンペーン！
        </h1>
      </div>

      <div className="max-w-md mx-auto px-4">
        {/* 説明 */}
        <div className="mt-5 bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-sm font-semibold text-blue-900 mb-2">
            事前申込フォームへご入力後、公式LINEより詳細をご案内いたします。
          </p>
          <ul className="text-xs text-gray-600 space-y-1 leading-relaxed">
            <li>※ 本フォームのみでは契約確定となりません</li>
            <li>※ 無料キャンペーンはキャッシュバック対応になります</li>
            <li>※ 光回線工事代金等もキャッシュバック対象です</li>
          </ul>
        </div>

        {/* 注意事項 */}
        <div className="mt-3 border border-gray-200 rounded-2xl p-4">
          <p className="text-xs font-bold text-gray-700 mb-2">【ご注意事項】</p>
          <ul className="text-xs text-gray-600 space-y-1 leading-relaxed">
            <li>・申込内容確認後に詳細をご案内いたします</li>
            <li>・キャンペーン適用には条件がございます</li>
            <li>・無料分はキャッシュバック対応となります</li>
            <li>・工事代金等もキャッシュバック対応です</li>
            <li>・入力内容に誤りがある場合はご案内できない可能性があります</li>
          </ul>
        </div>

        {/* FAQ（チェックボックス付き） */}
        <FaqSection onConfirmChange={(count) => setFaqConfirmedCount(count)} />

        {/* フォーム */}
        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">

          {/* ── 1-2. 姓・名 ── */}
          <SectionHeading>お客様情報</SectionHeading>
          <div className="flex gap-3">
            <Field label="姓" required>
              <input
                type="text"
                placeholder="山田"
                value={values.sei}
                onChange={setField('sei')}
                className={cls(values.sei)}
                autoComplete="family-name"
              />
              {submitted && !values.sei && <FieldError />}
            </Field>
            <Field label="名" required>
              <input
                type="text"
                placeholder="太郎"
                value={values.mei}
                onChange={setField('mei')}
                className={cls(values.mei)}
                autoComplete="given-name"
              />
              {submitted && !values.mei && <FieldError />}
            </Field>
          </div>

          {/* ── 3-4. セイ・メイ ── */}
          <div className="flex gap-3">
            <Field label="セイ" required>
              <input
                type="text"
                placeholder="ヤマダ"
                value={values.sei_kana}
                onChange={setField('sei_kana')}
                className={cls(values.sei_kana)}
                autoComplete="off"
              />
              {submitted && !values.sei_kana && <FieldError />}
            </Field>
            <Field label="メイ" required>
              <input
                type="text"
                placeholder="タロウ"
                value={values.mei_kana}
                onChange={setField('mei_kana')}
                className={cls(values.mei_kana)}
                autoComplete="off"
              />
              {submitted && !values.mei_kana && <FieldError />}
            </Field>
          </div>

          {/* ── 5-6. 屋号名・事業所名 ── */}
          <SectionHeading>事業所情報</SectionHeading>
          <Field label="屋号名・事業所名" required>
            <input
              type="text"
              placeholder="〇〇事業所（仮）"
              value={values.company_name}
              onChange={setField('company_name')}
              className={cls(values.company_name)}
              autoComplete="off"
            />
            {submitted && !values.company_name && <FieldError />}
          </Field>

          <Field label="屋号名・事業所名フリガナ" required>
            <input
              type="text"
              placeholder="マルマルジギョウショ"
              value={values.company_name_kana}
              onChange={setField('company_name_kana')}
              className={cls(values.company_name_kana)}
              autoComplete="off"
            />
            {submitted && !values.company_name_kana && <FieldError />}
          </Field>

          {/* ── 7-10. 生年月日・携帯番号・郵便番号・住所 ── */}
          <SectionHeading>基本情報</SectionHeading>
          <Field label="生年月日" required note="例：1995-08-15（カレンダーまたは直接入力）">
            <input
              type="date"
              value={values.birthdate}
              onChange={setField('birthdate')}
              max={new Date().toISOString().split('T')[0]}
              className={cls(values.birthdate)}
            />
            {submitted && !values.birthdate && <FieldError />}
          </Field>

          <Field label="携帯番号" required>
            <input
              type="tel"
              placeholder="09012345678"
              value={values.phone}
              onChange={setField('phone')}
              className={cls(values.phone)}
              inputMode="numeric"
              autoComplete="tel"
            />
            {submitted && !values.phone && <FieldError />}
          </Field>

          <Field label="郵便番号" required note="ハイフンあり・なし両対応（例：810-0000）">
            <input
              type="text"
              placeholder="810-0000"
              value={values.postal_code}
              onChange={setField('postal_code')}
              className={postalCls}
              inputMode="numeric"
              maxLength={8}
              autoComplete="postal-code"
            />
            {submitted && !values.postal_code && (
              <FieldError text="郵便番号を入力してください" />
            )}
            {postalFormatErr && (
              <FieldError text="郵便番号を正しく入力してください" />
            )}
          </Field>

          <Field
            label="住所"
            required
            note="都道府県・市区町村・番地までご入力ください"
          >
            <textarea
              placeholder="福岡県福岡市中央区 天神1-1-1"
              value={values.address}
              onChange={setField('address')}
              rows={3}
              className={cls(values.address)}
              autoComplete="street-address"
            />
            {submitted && !values.address && <FieldError />}
          </Field>

          {/* ── 11. 建物名（部屋番号） ── */}
          <Field
            label="建物名（部屋番号）"
            required
            note="戸建てなど建物名・部屋番号がない場合は「なし」とご入力ください"
          >
            <input
              type="text"
              placeholder="〇〇マンション101号室"
              value={values.building_name}
              onChange={setField('building_name')}
              className={cls(values.building_name)}
              autoComplete="off"
            />
            {submitted && !values.building_name && (
              <FieldError text="建物名（部屋番号）を入力してください" />
            )}
          </Field>

          {/* ── 12. 住居区分 ── */}
          <Field label="住居区分" required>
            <select
              value={values.residence_type}
              onChange={setField('residence_type')}
              className={cls(values.residence_type)}
            >
              <option value="">選択してください</option>
              <option value="持ち家">持ち家</option>
              <option value="賃貸">賃貸</option>
            </select>
            {submitted && !values.residence_type && (
              <FieldError text="住居区分を選択してください" />
            )}
          </Field>

          {/* ── 13-16. 口座情報（囲み枠で明示） ── */}
          <SectionHeading>口座情報</SectionHeading>
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 space-y-4">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p className="text-xs text-gray-500">
                キャッシュバック対応のためご入力が必要です（SSL暗号化通信）
              </p>
            </div>

            <Field label="銀行名" required>
              <input
                type="text"
                placeholder="〇〇銀行"
                value={values.bank_name}
                onChange={setField('bank_name')}
                className={cls(values.bank_name)}
                autoComplete="off"
              />
              {submitted && !values.bank_name && <FieldError />}
            </Field>

            <Field label="支店名" required>
              <input
                type="text"
                placeholder="〇〇支店"
                value={values.branch_name}
                onChange={setField('branch_name')}
                className={cls(values.branch_name)}
                autoComplete="off"
              />
              {submitted && !values.branch_name && <FieldError />}
            </Field>

            <Field label="口座番号" required>
              <input
                type="text"
                placeholder="1234567"
                value={values.account_number}
                onChange={setField('account_number')}
                className={cls(values.account_number)}
                inputMode="numeric"
                autoComplete="off"
              />
              {submitted && !values.account_number && <FieldError />}
            </Field>

            <Field label="口座名義（カナ）" required>
              <input
                type="text"
                placeholder="ヤマダ タロウ"
                value={values.account_holder}
                onChange={setField('account_holder')}
                className={cls(values.account_holder)}
                autoComplete="off"
              />
              {submitted && !values.account_holder && <FieldError />}
            </Field>
          </div>
          {/* 口座情報ここまで ↑ */}

          {/* ── 15. メールアドレス（口座情報セクション外・独立項目） ── */}
          <Field label="メールアドレス" required>
            <input
              type="email"
              placeholder="example@gmail.com"
              value={values.email}
              onChange={setField('email')}
              className={cls(values.email)}
              inputMode="email"
              autoComplete="email"
            />
            {submitted && !values.email && <FieldError />}
          </Field>

          {/* ── 16. 紹介者（必須） ── */}
          <Field label="紹介者" required>
            <input
              type="text"
              value={values.referrer}
              onChange={setField('referrer')}
              className={cls(values.referrer)}
              autoComplete="off"
            />
            {submitted && !values.referrer && (
              <FieldError text="紹介者を入力してください" />
            )}
          </Field>

          {/* ── お申込み意思 ── */}
          <SectionHeading>お申込み意思</SectionHeading>
          <p className="text-sm text-gray-600 -mt-2">
            今回のキャンペーンについてお申込み意思を教えてください
          </p>

          <div className="space-y-2">
            {INTENT_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-3 px-4 py-4 rounded-xl border-2 cursor-pointer transition-all ${
                  values.intent === opt.value
                    ? 'border-blue-600 bg-blue-50'
                    : submitted && !values.intent
                      ? 'border-red-300 bg-white'
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="intent"
                  value={opt.value}
                  checked={values.intent === opt.value}
                  onChange={() => setValues((prev) => ({ ...prev, intent: opt.value }))}
                  className="w-4 h-4 accent-blue-600 shrink-0"
                />
                <span className="text-sm text-gray-800">
                  <span className="font-bold text-blue-700 mr-1">{opt.value}.</span>
                  {opt.label}
                </span>
              </label>
            ))}
            {submitted && !values.intent && (
              <p className="text-xs text-red-600 pl-1">お申込み意思を選択してください</p>
            )}
          </div>

          {/* プライバシーポリシー */}
          <SectionHeading>プライバシーポリシー</SectionHeading>
          <div className="max-h-[160px] overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 text-xs text-gray-600 leading-relaxed space-y-3 overscroll-contain [-webkit-overflow-scrolling:touch]">
            <PrivacyPolicyContent />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-blue-800 hover:bg-blue-900 active:bg-blue-950 text-white font-bold text-lg rounded-xl transition-colors shadow"
          >
            入力内容を確認する
          </button>

          <p className="text-center text-xs text-gray-400 pb-4">
            ※ 本フォームのみでは契約確定となりません
          </p>
        </form>
      </div>
    </main>
  );
}

const normalCls =
  'w-full px-4 py-3 rounded-xl border border-gray-300 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400';

const errCls =
  'w-full px-4 py-3 rounded-xl border-2 border-red-400 text-base bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent placeholder:text-gray-400';

function PrivacyPolicyContent() {
  return (
    <>
      <p>
        当社は、お客様の個人情報の重要性を認識し、適切に保護・管理することを社会的責務と考えています。当社は、以下の方針に基づき、お客様の個人情報を適切に取り扱います。
      </p>

      <div>
        <p className="font-bold text-gray-700 mb-1">1. 個人情報の収集（取得）、利用および提供について</p>
        <p>
          当社は、個人情報を取得する際には利用目的を明確に定め、適正かつ公正な手段により取得いたします。
        </p>
        <p>
          取得した個人情報は、あらかじめ明示した利用目的の範囲内でのみ利用し、お客様の同意または法令に基づく場合を除き、目的外利用は行いません。
        </p>
        <p>
          また、お客様が各サービスの利用を希望された場合に限り、お申し込み手続きに必要な範囲で各販売会社へ個人情報を提供いたします。
        </p>
      </div>

      <div>
        <p className="font-bold text-gray-700 mb-1">2. 個人情報の安全管理について</p>
        <p>
          当社は、お客様の個人情報を適切に管理し、不正アクセス、紛失、改ざん、漏えい等の防止に努めます。
        </p>
        <p>
          また、安全管理措置を継続的に見直し、事故の予防および是正に取り組みます。
        </p>
      </div>

      <div>
        <p className="font-bold text-gray-700 mb-1">3. 法令等の遵守について</p>
        <p>
          当社は、個人情報の取扱いに関して、個人情報保護法その他関連法令、各種ガイドライン等を遵守し、適切な管理・運用を行います。
        </p>
      </div>

      <div>
        <p className="font-bold text-gray-700 mb-1">4. 継続的改善について</p>
        <p>
          当社は、個人情報保護を適切に実施するための管理体制を整備し、従業者への教育、利用状況の確認および見直しを継続的に実施し、改善に努めます。
        </p>
      </div>

      <div>
        <p className="font-bold text-gray-700 mb-1">5. お客様の権利について</p>
        <p>
          お客様からご自身の個人情報について、開示、訂正、追加、削除、利用停止等のお申し出があった場合は、ご本人であることを確認のうえ、法令に基づき適切に対応いたします。
        </p>
      </div>

      <div>
        <p className="font-bold text-gray-700 mb-1">6. 個人情報漏えい等への対応</p>
        <p>
          当社は、個人情報漏えい等の事故防止に努めるとともに、万一事故が発生した場合には、原因究明および再発防止策を速やかに実施し、適切に対応いたします。
        </p>
      </div>

      <p>
        当社のすべての従業者は、本ポリシーを理解し、お客様の個人情報保護の重要性を認識したうえで、適切な管理・運用に努めます。
      </p>
    </>
  );
}
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 pt-2">
      <div className="w-1 h-5 bg-blue-800 rounded-full" />
      <h2 className="text-base font-bold text-gray-800">{children}</h2>
    </div>
  );
}

function Field({
  label,
  required,
  note,
  children,
}: {
  label: string;
  required?: boolean;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {required && (
          <span className="text-[11px] font-medium text-white bg-red-500 px-1.5 py-0.5 rounded">
            必須
          </span>
        )}
      </div>
      {note && <p className="text-xs text-gray-500">{note}</p>}
      {children}
    </div>
  );
}

function FieldError({ text = 'この項目は必須です' }: { text?: string }) {
  return <p className="text-xs text-red-600 pl-1">{text}</p>;
}
