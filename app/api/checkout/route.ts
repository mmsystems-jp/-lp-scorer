import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { stripe } from '@/lib/stripe';

// Pro権限は「IP」ではなく「lp_uid cookie」で紐づける。
// IPは回線・場所で変わるため、「課金したのに別IPでPro扱いにならない」事故を防ぐ。
export async function POST(req: NextRequest) {
  let uid = req.cookies.get('lp_uid')?.value;
  const isNew = !uid;
  if (!uid) uid = randomUUID();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
    mode: 'subscription',
    client_reference_id: uid,
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pro-success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pro`,
  });

  const res = NextResponse.json({ url: session.url });
  if (isNew) {
    res.cookies.set('lp_uid', uid, {
      path: '/',
      maxAge: 60 * 60 * 24 * 400,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
  }
  return res;
}
