import Anthropic from '@anthropic-ai/sdk';
import { ClaudeScoreResult } from './types';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function scoreLP(content: string): Promise<ClaudeScoreResult> {
  const prompt = `以下のランディングページのコンテンツを分析し、10項目で採点してください。

【LPコンテンツ】
${content}

【採点項目】
- firstView: ファーストビュー（3秒で何を売っているかわかるか）
- catchCopy: キャッチコピー（刺さるか・具体的か）
- benefit: ベネフィット訴求（機能ではなく価値を伝えているか）
- socialProof: 社会的証明（実績・口コミ・数字があるか）
- cta: CTA（ボタンの文言・配置・数）
- trust: 信頼性（会社情報・顔出し・メディア掲載）
- readability: 読みやすさ（文字量・構成・流れ）
- target: ターゲット明確性（誰向けかが伝わるか）
- differentiation: 差別化（なぜここで買うかが伝わるか）
- mobile: モバイル対応（スマホで読みやすそうか）

【採点基準】各項目0〜10点で採点。厳しめに採点（平均6点程度）。

【出力形式】必ずJSON形式のみで出力。前後に説明文不要。
{
  "scores": { "firstView": 7, "catchCopy": 5, ... },
  "comments": { "firstView": "コメント1〜2行", ... },
  "summary": "全体コメント2〜3行"
}`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Claude APIから有効なJSONが返されませんでした');

  return JSON.parse(jsonMatch[0]) as ClaudeScoreResult;
}
