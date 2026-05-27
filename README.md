# LP Scout

ランディングページ（LP）のURLまたはテキストを入力すると、AIが10項目で採点し、レーダーチャートと項目ごとの改善コメントを返すWebサービス。結果はそのままXにシェアできる。

本番: https://lp-scorer-three.vercel.app

## 機能

- URL採点（cheerioで本文を抽出）／テキスト採点（最大5000文字）
- Claude APIによる10項目0〜100点採点（辛口・平均6点程度）
- レーダーチャート（recharts）と項目別コメント・総評
- 採点結果ページ（/result/[id]）とスコア入りOGP画像
- Xシェア
- 無料: 1日3回（IP単位）／Pro: 月300円で月30回（lp_uid cookie単位）

## 採点10項目

ファーストビュー / キャッチコピー / ベネフィット訴求 / 社会的証明 / CTA / 信頼性 / 読みやすさ / ターゲット明確性 / 差別化 / モバイル対応

## 技術スタック

- Next.js 14（App Router）+ TypeScript + Tailwind CSS
- Claude API（@anthropic-ai/sdk）
- DynamoDB（lp-scorer-prod / ap-northeast-1、TTL30日）
- Stripe（Checkout subscription + Webhook）
- cheerio（スクレイピング）/ recharts（チャート）
- Vercel デプロイ

## ディレクトリ

```
app/
├── page.tsx                       TOP（URL/テキスト入力）
├── pro/page.tsx                   Proプラン案内
├── pro-success/page.tsx           決済完了
├── result/[id]/
│   ├── page.tsx                   採点結果
│   └── opengraph-image.tsx        OGP画像（スコア表示）
└── api/
    ├── score/route.ts             採点（Pro判定→採点→保存）
    ├── result/[id]/route.ts       結果取得
    ├── checkout/route.ts          Stripe Checkout（lp_uid発行）
    └── webhook/route.ts           Stripe Webhook（pro_until付与）
lib/
├── claude.ts    dynamo.ts    scraper.ts    ratelimit.ts    stripe.ts    types.ts
components/
├── ScoreRadar.tsx    ScoreCard.tsx    ShareButton.tsx
```

## 環境変数

```
ANTHROPIC_API_KEY=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-northeast-1
DYNAMO_TABLE=lp-scorer-prod
NEXT_PUBLIC_BASE_URL=https://lp-scorer-three.vercel.app
STRIPE_SECRET_KEY=
STRIPE_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
```

実際の値は .env.local とVercelの環境変数にのみ置く。リポジトリやドキュメントに平文で書かない。

## Pro権限の紐付けについて

Pro権限はIPではなくlp_uid cookieで管理する。checkout時にlp_uid（uuid）を発行してStripeのclient_reference_idに渡し、Webhookで該当uidにpro_untilを書き込む。IPは回線・場所で変わるため、cookie単位にすることで「課金したのに別IPでPro扱いにならない」事故を防いでいる。cookie削除や別端末ではPro判定が引き継がれない点は仕様。

## 開発

```
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Stripe設定（本番）

- Webhook: https://lp-scorer-three.vercel.app/api/webhook（checkout.session.completed）
- 署名シークレットを STRIPE_WEBHOOK_SECRET に設定
