import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white pb-16">
      {/* ヘッダー */}
      <div className="bg-blue-900 text-white text-center py-8 px-4">
        <h1 className="text-2xl font-bold">プライバシーポリシー</h1>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6 space-y-4">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 text-sm text-gray-700 leading-relaxed">
          <p>
            当社は、お客様の個人情報の重要性を認識し、適切に保護・管理することを社会的責務と考えています。当社は、以下の方針に基づき、お客様の個人情報を適切に取り扱います。
          </p>
        </div>

        <PolicySection title="1. 個人情報の収集（取得）、利用および提供について">
          <p>
            当社は、個人情報を取得する際には利用目的を明確に定め、適正かつ公正な手段により取得いたします。
          </p>
          <p>
            取得した個人情報は、あらかじめ明示した利用目的の範囲内でのみ利用し、お客様の同意または法令に基づく場合を除き、目的外利用は行いません。
          </p>
          <p>
            また、お客様が各サービスの利用を希望された場合に限り、お申し込み手続きに必要な範囲で各販売会社へ個人情報を提供いたします。
          </p>
        </PolicySection>

        <PolicySection title="2. 個人情報の安全管理について">
          <p>
            当社は、お客様の個人情報を適切に管理し、不正アクセス、紛失、改ざん、漏えい等の防止に努めます。
          </p>
          <p>
            また、安全管理措置を継続的に見直し、事故の予防および是正に取り組みます。
          </p>
        </PolicySection>

        <PolicySection title="3. 法令等の遵守について">
          <p>
            当社は、個人情報の取扱いに関して、個人情報保護法その他関係法令、各種ガイドライン等を遵守し、適切な管理・運用を行います。
          </p>
        </PolicySection>

        <PolicySection title="4. 継続的改善について">
          <p>
            当社は、個人情報保護を適切に実施するための管理体制を整備し、従業者への教育、運用状況の確認および見直しを継続的に実施し、改善に努めます。
          </p>
        </PolicySection>

        <PolicySection title="5. お客様の権利について">
          <p>
            お客様からご自身の個人情報について、開示、訂正、追加、削除、利用停止等のお申し出があった場合は、ご本人であることを確認のうえ、法令に基づき適切に対応いたします。
          </p>
        </PolicySection>

        <PolicySection title="6. 個人情報漏えい等への対応">
          <p>
            当社は、個人情報漏えい等の事故防止に努めるとともに、万一事故が発生した場合には、原因究明および再発防止策を速やかに実施し、適切に対応いたします。
          </p>
        </PolicySection>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 text-sm text-gray-700 leading-relaxed">
          <p>
            当社のすべての従業者は、本ポリシーを理解し、お客様の個人情報保護の重要性を認識したうえで、適切な管理・運用に努めます。
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="block text-center text-sm text-blue-700 underline underline-offset-2"
          >
            トップページに戻る
          </Link>
        </div>
      </div>
    </main>
  );
}

function PolicySection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="bg-blue-900 text-white px-4 py-2.5">
        <h2 className="text-sm font-bold">{title}</h2>
      </div>
      <div className="p-4 space-y-2 text-sm text-gray-700 leading-relaxed">
        {children}
      </div>
    </div>
  );
}
