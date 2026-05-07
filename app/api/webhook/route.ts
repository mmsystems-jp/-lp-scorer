import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { setProUntil } from '@/lib/dynamo';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature')!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const ip = session.client_reference_id;
    if (ip) {
      const proUntil = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30;
      await setProUntil(ip, proUntil);
    }
  }

  return NextResponse.json({ ok: true });
}
