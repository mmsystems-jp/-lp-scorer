type Props = {
  label: string;
  score: number;
  comment: string;
};

export function ScoreCard({ label, score, comment }: Props) {
  const color =
    score >= 8 ? 'text-green-600' :
    score >= 5 ? 'text-yellow-600' :
    'text-red-500';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-gray-800">{label}</span>
        <span className={`text-xl font-bold ${color}`}>{score}<span className="text-sm text-gray-400">/10</span></span>
      </div>
      <p className="text-sm text-gray-600">{comment}</p>
    </div>
  );
}
