'use client';

import { useState } from 'react';

export const FAQ_TOTAL = 9;

// checked[0] = 警告ボックス, checked[1..8] = アコーディオン各項目
const CONFIRM_LABELS: string[] = [
  '現在利用中の光回線工事費のことではないことを理解しました',
  '今回キャンペーンの工事費は実質無料であることを理解しました',
  '毎月の基本料金はキャッシュバック対応による実質無料であることを理解しました',
  'オプション料金はキャッシュバック対応による実質無料であることを理解しました',
  '解約違約金はキャッシュバック対応であることを理解しました',
  'キャッシュバックには請求明細写真の提出が必要であることを理解しました',
  '利用期間中の必要手続きに協力することに同意します',
  '無料・0円表記はキャッシュバック対応であることを理解しました',
  '今回の施策はNTT公式キャンペーンではないことを理解しました',
];

interface FaqItem {
  title: string;
  content: React.ReactNode;
}

const p = 'text-sm text-gray-700 leading-relaxed';
const nt = 'text-xs text-gray-500 leading-relaxed';

const faqItems: FaqItem[] = [
  {
    title: '今回のキャンペーンの工事費について',
    content: (
      <div className="space-y-1">
        <p className={p}>工事費は無料となります。</p>
        <p className={p}>お客様へのご請求はございません。</p>
        <p className={p}>弊社にてお支払いいたします。</p>
      </div>
    ),
  },
  {
    title: '毎月の基本料金',
    content: (
      <div className="space-y-2">
        <p className={p}>毎月の基本料金は実質無料となります。</p>
        <p className={p}>
          回線事業者よりご請求書が届きますが、弊社より事前にお客様へキャッシュバックいたします。
        </p>
      </div>
    ),
  },
  {
    title: 'オプション料金',
    content: (
      <div className="space-y-2">
        <p className={p}>オプション料金は実質無料となります。</p>
        <p className={p}>
          回線事業者よりご請求書が届きますが、弊社より事前にお客様へキャッシュバックいたします。
        </p>
      </div>
    ),
  },
  {
    title: '解約違約金（10ヶ月後）',
    content: (
      <div className="space-y-2">
        <p className={p}>10ヶ月後の解約時に発生する解約違約金は実質無料となります。</p>
        <p className={p}>
          回線事業者よりご請求書が届きますが、弊社より事前にお客様へキャッシュバックいたします。
        </p>
      </div>
    ),
  },
  {
    title: 'キャッシュバックについて',
    content: (
      <div className="space-y-2">
        <p className={p}>
          光回線事業者からの請求明細のお写真をご提出いただき次第、弊社よりお支払いさせていただきます。
        </p>
        <p className={p}>実質ご負担はございませんので、ご安心ください。</p>
      </div>
    ),
  },
  {
    title: 'ご協力のお願い',
    content: (
      <div className="space-y-2">
        <p className={p}>10ヶ月間のご利用期間中に、光回線事業者の変更が発生する場合があります。</p>
        <p className={p}>その際は、</p>
        <ul className="text-sm text-gray-700 space-y-1 pl-1">
          <li>・確認のお電話対応</li>
          <li>・お支払い方法登録</li>
          <li>・必要情報入力</li>
        </ul>
        <p className={p}>などのお手続きへご協力をお願いいたします。</p>
      </div>
    ),
  },
  {
    title: 'キャンペーン特典内容',
    content: (
      <div className="space-y-2">
        <ul className="text-sm text-gray-700 space-y-1.5">
          <li>① 工事費：無料</li>
          <li>② 月額：無料</li>
          <li>③ Wi-Fiルーター：プレゼント</li>
          <li>④ 解約違約金：0円</li>
        </ul>
        <p className={nt}>※ 無料・0円に関しましては、キャッシュバックにて対応します。</p>
      </div>
    ),
  },
  {
    title: '重要事項',
    content: (
      <div className="space-y-3">
        <p className={p}>
          今回の施策は、弊社独自でNTT回線と光事業者の組合せをパッケージ化したものです。
        </p>
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg px-3 py-2.5">
          <p className="text-sm font-bold text-yellow-800">
            ⚠ NTT公式キャンペーンではありません。
          </p>
        </div>
      </div>
    ),
  },
];

interface Props {
  onConfirmChange: (confirmedCount: number, total: number) => void;
}

export default function FaqSection({ onConfirmChange }: Props) {
  const [openStates, setOpenStates] = useState<boolean[]>(
    Array(faqItems.length).fill(false),
  );
  const [checked, setChecked] = useState<boolean[]>(Array(FAQ_TOTAL).fill(false));

  const confirmedCount = checked.filter(Boolean).length;
  const allConfirmed = confirmedCount === FAQ_TOTAL;

  const handleCheck = (i: number) => {
    const next = checked.map((v, idx) => (idx === i ? !v : v));
    setChecked(next);
    onConfirmChange(next.filter(Boolean).length, FAQ_TOTAL);
  };

  const toggle = (i: number) =>
    setOpenStates((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  const allOpen = openStates.every(Boolean);
  const toggleAll = () => setOpenStates(Array(faqItems.length).fill(!allOpen));

  return (
    <div className="mt-4">
      {/* セクションヘッダー */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-blue-800 rounded-full" />
          <h2 className="text-base font-bold text-gray-800">よくある質問</h2>
        </div>
        <button
          type="button"
          onClick={toggleAll}
          className="text-xs font-medium text-blue-700 underline underline-offset-2"
        >
          {allOpen ? '全部閉じる' : '全部開く'}
        </button>
      </div>

      {/* 確認状況プログレス */}
      <div
        className={`flex items-center justify-between px-4 py-2.5 rounded-xl mb-3 border transition-colors ${
          allConfirmed
            ? 'bg-green-50 border-green-300'
            : 'bg-gray-50 border-gray-200'
        }`}
      >
        <span className="text-sm text-gray-600 font-medium">確認状況</span>
        <span
          className={`text-sm font-bold ${
            allConfirmed ? 'text-green-700' : 'text-blue-700'
          }`}
        >
          {confirmedCount} / {FAQ_TOTAL} 完了{allConfirmed ? ' ✓' : ''}
        </span>
      </div>

      {/* 警告ボックス（チェックボックスindex=0） */}
      <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4 mb-3">
        <p className="text-sm font-bold text-red-700 mb-1.5 flex items-center gap-1">
          <span aria-hidden="true">⚠</span>
          <span>※必ずご確認ください※</span>
        </p>
        <p className="text-sm font-semibold text-red-900 leading-relaxed mb-3">
          現在利用中の光回線の工事費のことではありません。
        </p>
        <ConfirmCheckbox
          checked={checked[0]}
          label={CONFIRM_LABELS[0]}
          onChange={() => handleCheck(0)}
        />
      </div>

      {/* アコーディオン（チェックボックスindex=1〜8） */}
      <div className="space-y-2">
        {faqItems.map((item, i) => {
          const checkIdx = i + 1;
          const isChecked = checked[checkIdx];
          return (
            <div
              key={i}
              className={`border-2 rounded-xl overflow-hidden transition-colors ${
                isChecked ? 'border-green-300' : 'border-gray-200'
              }`}
            >
              {/* アコーディオンヘッダー */}
              <button
                type="button"
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2 pr-2">
                  <span
                    className={`text-base font-bold leading-none ${
                      isChecked ? 'text-green-500' : 'text-gray-300'
                    }`}
                    aria-hidden="true"
                  >
                    {isChecked ? '✓' : '○'}
                  </span>
                  <span className="text-sm font-semibold text-gray-800">
                    ■ {item.title}
                  </span>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${
                    openStates[i] ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* アコーディオン本文 */}
              {openStates[i] && (
                <div className="px-4 pt-3 pb-4 bg-gray-50 border-t border-gray-100">
                  {item.content}
                  <div className="mt-4">
                    <ConfirmCheckbox
                      checked={isChecked}
                      label={CONFIRM_LABELS[checkIdx]}
                      onChange={() => handleCheck(checkIdx)}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ConfirmCheckbox({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <label
      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
        checked ? 'bg-green-50 border-green-400' : 'bg-white border-blue-200'
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-6 h-6 accent-blue-600 shrink-0"
      />
      <span className="text-xs font-medium text-gray-800 leading-relaxed">
        {label}
      </span>
    </label>
  );
}
