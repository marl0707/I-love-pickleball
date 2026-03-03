import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(req: Request) {
    const bodyText = await req.text()
    const signature = req.headers.get('stripe-signature') as string

    // ユーザーに設定してもらうWebhookシークレット
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
        console.warn('STRIPE_WEBHOOK_SECRET is not set.')
        return new NextResponse('Webhook secret not set', { status: 400 })
    }

    let event: Stripe.Event

    try {
        event = getStripe().webhooks.constructEvent(bodyText, signature, webhookSecret)
    } catch (err: any) {
        console.error('Webhook signature verification failed.', err.message)
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session
                if (session.metadata?.action === 'create_ad_bid') {
                    const { userId, category, bidAmount } = session.metadata

                    // FormDataから受け取って本来はmetadata等で渡すべきですが、
                    // 今回はテスト実装として「名称未設定」などで一旦レコードを作成します。
                    // ※実際には Checkout への遷移前に一旦 DB に PENDING ステータスで保存し、
                    //   Webhook でACTIVEに更新する設計が王道です。

                    await prisma.adBid.create({
                        data: {
                            category,
                            bidAmount: parseInt(bidAmount, 10),
                            bidderId: userId,
                            advertiserName: '名称未設定スポンサー (ダッシュボードから設定)', // 仮
                            targetUrl: 'https://...', // 仮
                            imageUrl: '', // 仮
                            stripeSubscriptionId: session.subscription as string,
                            status: 'ACTIVE',
                        }
                    })
                }
                break
            }
            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription
                await prisma.adBid.updateMany({
                    where: { stripeSubscriptionId: subscription.id },
                    data: { status: 'CANCELED' }
                })
                break
            }
            default:
                console.log(`Unhandled event type ${event.type}`)
        }
        return new NextResponse('OK', { status: 200 })
    } catch (error: any) {
        console.error('Webhook processing failed.', error)
        return new NextResponse('Error processing webhook', { status: 500 })
    }
}
