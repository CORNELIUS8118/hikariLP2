'use client';

import { useState, useEffect, useCallback } from 'react';
import FormSection from '@/components/FormSection';
import ConfirmPage from '@/components/ConfirmPage';
import LinePage from '@/components/LinePage';
import ThanksPage from '@/components/ThanksPage';
import ThinkingPage from '@/components/ThinkingPage';
import type { FormValues } from '@/lib/types';

type Step = 'form' | 'confirm' | 'line' | 'thanks' | 'thinking';

export default function Home() {
  const [step, setStep] = useState<Step>('form');
  const [lineUrl, setLineUrl] = useState('');
  const [ref, setRef] = useState('');
  const [submissionId, setSubmissionId] = useState('');
  const [pendingValues, setPendingValues] = useState<FormValues | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRef(params.get('ref') ?? '');
  }, []);

  // ステップ切り替え時に必ずページ最上部へ
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // フォーム検証完了 → 確認ページへ
  const handleConfirm = useCallback((values: FormValues) => {
    setPendingValues(values);
    setStep('confirm');
  }, []);

  // 確認ページ「修正する」→ フォームへ戻る（入力内容保持）
  const handleBack = useCallback(() => {
    setStep('form');
  }, []);

  // 確認ページ「この内容で送信する」→ API 送信
  const handleSubmit = useCallback(async () => {
    if (!pendingValues) return;

    const id = crypto.randomUUID();
    setSubmissionId(id);

    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...pendingValues, submission_id: id, ref }),
    });

    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(err.error ?? '送信に失敗しました');
    }

    const data = (await res.json()) as { success: boolean; line_url?: string };

    // クリア前に意思を保存
    const intent = pendingValues.intent;
    setPendingValues(null);

    if (data.line_url) {
      setLineUrl(data.line_url);
      setStep('line');
    } else if (intent === 'D') {
      setStep('thinking');
    } else {
      setStep('thanks');
    }
  }, [pendingValues, ref]);

  const handleLineClick = useCallback(async () => {
    if (!submissionId) return;
    await fetch('/api/line-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submission_id: submissionId }),
    }).catch(() => {});
  }, [submissionId]);

  if (step === 'confirm' && pendingValues) {
    return (
      <ConfirmPage values={pendingValues} onBack={handleBack} onSubmit={handleSubmit} />
    );
  }
  if (step === 'line') return <LinePage lineUrl={lineUrl} onLineClick={handleLineClick} />;
  if (step === 'thinking') return <ThinkingPage onBack={() => setStep('form')} />;
  if (step === 'thanks') return <ThanksPage />;
  return <FormSection onConfirm={handleConfirm} initialValues={pendingValues} />;
}
