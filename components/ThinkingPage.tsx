'use client';

interface Props {
  onBack: () => void;
}

export default function ThinkingPage({ onBack }: Props) {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className="bg-blue-900 text-white text-center py-6 px-4">
        <h1 className="text-xl font-bold">ご回答ありがとうございます</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-md mx-auto w-full">
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-blue-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
          ご回答ありがとうございます
        </h2>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 w-full space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>ご入力内容を受け付けました。</p>
          <p>今回は「考えたい」を選択されています。</p>
          <p>
            お申込みの意思が確定されましたら、<br />
            お手数ですが再度フォームよりご入力をお願いいたします。
          </p>
          <p>ご検討のほどよろしくお願いいたします。</p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="mt-8 w-full py-4 bg-blue-800 hover:bg-blue-900 active:bg-blue-950 text-white font-bold text-base rounded-xl transition-colors shadow"
        >
          フォームへ戻る
        </button>
      </div>
    </main>
  );
}
