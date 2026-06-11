'use client';

import { useState } from 'react';
import type { FormValues } from '@/lib/types';

interface Props {
  values: FormValues;
  onBack: () => void;
  onSubmit: () => Promise<void>;
}

const intentLabel = (intent: string) =>
  intent === 'A' ? '今すぐ申し込みしたい' : intent === 'D' ? '考えたい' : '';

// 口座番号：末尾4桁のみ表示
const maskAccount = (num: string) =>
  num.length > 4 ? '***' + num.slice(-4) : num;

export default function ConfirmPage({ values, onBack, onSubmit }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      await onSubmit();
    } catch (err) {
      setError(err instanceof Error ? err.message : '送信に失敗しました。再度お試しください。');
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      {/* ヘッダー */}
      <div className="bg-blue-900 text-white text-center py-6 px-4">
        <h1 className="text-xl font-bold">入力内容の確認</h1>
      </div>

      <div className="max-w-md mx-auto px-4 mt-5 space-y-4">
        <p className="text-sm text-gray-600 text-center leading-relaxed">
          以下の内容にお間違いがないかご確認ください。
        </p>

        {/* お客様情報 */}
        <ConfirmSection title="お客様情報">
          <ConfirmRow label="姓" value={values.sei} />
          <ConfirmRow label="名" value={values.mei} />
          <ConfirmRow label="セイ" value={values.sei_kana} />
          <ConfirmRow label="メイ" value={values.mei_kana} />
          {values.company_name && (
            <ConfirmRow label="屋号名・事業所名" value={values.company_name} />
          )}
          {values.company_name_kana && (
            <ConfirmRow label="屋号名・事業所名フリガナ" value={values.company_name_kana} />
          )}
        </ConfirmSection>

        {/* 基本情報 */}
        <ConfirmSection title="基本情報">
          <ConfirmRow label="生年月日" value={values.birthdate} />
          <ConfirmRow label="携帯番号" value={values.phone} />
          <ConfirmRow label="郵便番号" value={values.postal_code} />
          <ConfirmRow label="住所" value={values.address} />
          <ConfirmRow label="建物名（部屋番号）" value={values.building_name} />
          <ConfirmRow label="住居区分" value={values.residence_type} />
        </ConfirmSection>

        {/* 口座情報 */}
        <ConfirmSection title="口座情報">
          <ConfirmRow label="銀行名" value={values.bank_name} />
          <ConfirmRow label="支店名" value={values.branch_name} />
          <ConfirmRow label="口座番号" value={maskAccount(values.account_number)} />
          <ConfirmRow label="口座名義（カナ）" value={values.account_holder} />
        </ConfirmSection>

        {/* 連絡先・その他 */}
        <ConfirmSection title="連絡先・その他">
          <ConfirmRow label="メールアドレス" value={values.email} />
          <ConfirmRow label="紹介者" value={values.referrer} />
          <ConfirmRow label="申込意思" value={intentLabel(values.intent)} />
        </ConfirmSection>

        {/* 注意文 */}
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4">
          <p className="text-xs text-yellow-800 leading-relaxed">
            ⚠ 入力内容に誤りがある場合、キャンペーンのご案内やキャッシュバック対応ができない場合があります。
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 text-center">
            {error}
          </div>
        )}

        {/* ボタン */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-4 bg-blue-800 hover:bg-blue-900 active:bg-blue-950 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl transition-colors shadow"
          >
            {submitting ? '送信中...' : 'この内容で送信する'}
          </button>

          <button
            type="button"
            onClick={onBack}
            disabled={submitting}
            className="w-full py-4 bg-white hover:bg-gray-50 active:bg-gray-100 disabled:cursor-not-allowed text-gray-700 font-bold text-base rounded-xl border-2 border-gray-300 transition-colors"
          >
            修正する
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 pb-4">
          ※ 本フォームのみでは契約確定となりません
        </p>
      </div>
    </main>
  );
}

function ConfirmSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <div className="bg-blue-900 text-white px-4 py-2.5">
        <h2 className="text-sm font-bold">{title}</h2>
      </div>
      <div className="divide-y divide-gray-100">{children}</div>
    </div>
  );
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 px-4 py-3 min-h-[44px]">
      <span className="text-xs text-gray-500 shrink-0 w-36 leading-relaxed pt-0.5">
        {label}
      </span>
      <span className="text-sm text-gray-900 font-medium leading-relaxed break-all flex-1">
        {value || '—'}
      </span>
    </div>
  );
}
