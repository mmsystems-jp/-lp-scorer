import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? '127.0.0.1';
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    mode: 'subscription',
    client_reference_id: ip,
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pro-success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pro`,
  });
  return NextResponse.json({ url: session.url });
}
