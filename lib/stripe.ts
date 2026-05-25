import Stripe from 'stripe';

// ビルド時（page data 収集フェーズ）に new Stripe() が走ると、
// STRIPE_SECRET_KEY 未設定の環境では「Neither apiKey nor config.authenticator provided」で
// ビルドが失敗する。実際に使う瞬間まで初期化を遅延させ、ビルドを必ず通す。
// 鍵が設定されている場合の挙動は従来どおり（決済ロジックは不変）。
let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
    _stripe = new Stripe(key, { apiVersion: '2026-04-22.dahlia' });
  }
  return _stripe;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const client = getStripe() as unknown as Record<string | symbol, unknown>;
    const value = client[prop];
    return typeof value === 'function' ? value.bind(getStripe()) : value;
  },
});
