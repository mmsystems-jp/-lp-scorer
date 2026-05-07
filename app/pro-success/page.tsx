export default function ProSuccessPage() {
  return (
    <main className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center max-w-sm">
        <p className="text-green-500 text-5xl">✓</p>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">Proプランへようこそ！</h1>
        <p className="text-gray-500 text-sm mt-2">月30回の採点が利用できます。</p>
        <a
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg mt-6 hover:bg-blue-700 transition-colors"
        >
          さっそく採点する
        </a>
      </div>
    </main>
  );
}
