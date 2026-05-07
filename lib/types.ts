export const SCORE_ITEMS = [
  { key: 'firstView',       label: 'ファーストビュー',   desc: '3秒で何を売っているかわかるか' },
  { key: 'catchCopy',       label: 'キャッチコピー',     desc: '刺さるか・具体的か' },
  { key: 'benefit',         label: 'ベネフィット訴求',   desc: '機能ではなく価値を伝えているか' },
  { key: 'socialProof',     label: '社会的証明',         desc: '実績・口コミ・数字があるか' },
  { key: 'cta',             label: 'CTA（行動喚起）',    desc: 'ボタンの文言・配置・数' },
  { key: 'trust',           label: '信頼性',             desc: '会社情報・顔出し・メディア掲載' },
  { key: 'readability',     label: '読みやすさ',         desc: '文字量・構成・流れ' },
  { key: 'target',          label: 'ターゲット明確性',   desc: '誰向けかが伝わるか' },
  { key: 'differentiation', label: '差別化',             desc: 'なぜここで買うかが伝わるか' },
  { key: 'mobile',          label: 'モバイル対応',       desc: 'スマホで読みやすそうか' },
] as const;

export type ScoreKey = typeof SCORE_ITEMS[number]['key'];

export type ScoreRecord = {
  id: string;
  inputType: 'url' | 'text';
  inputValue: string;
  totalScore: number;
  scores: Record<ScoreKey, number>;
  comments: Record<ScoreKey, string>;
  summary: string;
  createdAt: string;
};

export type ScoreApiRequest = {
  type: 'url' | 'text';
  value: string;
};

export type ScoreApiResponse = {
  id: string;
};

export type ClaudeScoreResult = {
  scores: Record<ScoreKey, number>;
  comments: Record<ScoreKey, string>;
  summary: string;
};
