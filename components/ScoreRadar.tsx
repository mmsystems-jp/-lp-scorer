'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { SCORE_ITEMS, ScoreKey } from '@/lib/types';

type Props = {
  scores: Record<ScoreKey, number>;
};

export function ScoreRadar({ scores }: Props) {
  const data = SCORE_ITEMS.map(item => ({
    subject: item.label,
    score: scores[item.key],
    fullMark: 10,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
        <Radar
          name="スコア"
          dataKey="score"
          stroke="#2563eb"
          fill="#2563eb"
          fillOpacity={0.3}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
