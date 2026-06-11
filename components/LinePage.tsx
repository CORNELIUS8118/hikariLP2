'use client';

interface Props {
  lineUrl: string;
  onLineClick: () => void;
}

export default function LinePage({ lineUrl, onLineClick }: Props) {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className="bg-blue-900 text-white text-center py-6 px-4">
        <h1 className="text-xl font-bold">公式LINE登録</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-md mx-auto w-full">
        {/* LINEアイコン */}
        <div className="w-20 h-20 rounded-2xl bg-green-500 flex items-center justify-center shadow-lg mb-8">
          <svg viewBox="0 0 24 24" fill="white" className="w-12 h-12">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          ありがとうございます。
        </h2>

        <p className="text-gray-600 text-center leading-relaxed mb-8">
          お申込み意思を確認いたしました。
          <br />
          下記より公式LINEをご登録ください。
          <br />
          担当者より詳細をご案内いたします。
        </p>

        <a
          href={lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onLineClick}
          className="w-full block text-center py-4 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold text-xl rounded-2xl transition-colors shadow-lg"
        >
          公式LINEを登録する
        </a>

        <p className="mt-4 text-xs text-gray-400 text-center">
          担当者より詳細のご案内をいたします
        </p>
      </div>
    </main>
  );
}
