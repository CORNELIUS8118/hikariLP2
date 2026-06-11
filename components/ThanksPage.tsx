export default function ThanksPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className="bg-blue-900 text-white text-center py-6 px-4">
        <h1 className="text-xl font-bold">送信完了</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
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

        <h2 className="text-xl font-bold text-gray-800 mb-3">送信が完了しました</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          ご入力いただきありがとうございました。
          <br />
          引き続きよろしくお願いいたします。
        </p>
      </div>
    </main>
  );
}
