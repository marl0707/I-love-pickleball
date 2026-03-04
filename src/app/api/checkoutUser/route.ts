import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'
import { getStripe } from '@/lib/stripe'

export async function POST(req: Request) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const formData = await req.formData()
        const category = formData.get('category') as string // "Facility" or "Gear"
        const bidAmountStr = formData.get('bidAmount') as string
        const bidAmount = parseInt(bidAmountStr, 10)

        if (!category || isNaN(bidAmount) || bidAmount < 35) {
            return new NextResponse('Invalid input. Category and valid minimum bid amount (35 USD) are required.', { status: 400 })
        }

        // DBからユーザー情報を取得
        let dbUser = await prisma.user.findUnique({
            where: { id: user.id }
        })

        if (!dbUser) {
            return new NextResponse('User not found in DB', { status: 404 })
        }

        // 1. Stripeカスタマーが存在しない場合は作成
        if (!dbUser.stripeCustomerId) {
            const customer = await getStripe().customers.create({
                email: user.email,
                metadata: {
                    userId: user.id,
                },
            })

            dbUser = await prisma.user.update({
                where: { id: user.id },
                data: { stripeCustomerId: customer.id }
            })
        }

        // 2. Stripe Checkout Sessionの発行
        const checkoutSession = await getStripe().checkout.sessions.create({
            mode: 'subscription', // 月額課金（サブスクリプション）
            payment_method_types: ['card'],
            customer: dbUser.stripeCustomerId!,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `I LOVE PICKLEBALL: Sponsor Ad Bid (${category})`,
                            description: `Category: ${category} / Monthly Auto-renew`,
                        },
                        unit_amount: bidAmount * 100, // USD converts to cents for Stripe

                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            // 成功後・キャンセル後のURL
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/advertise/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/advertise`,
            metadata: {
                userId: user.id,
                category: category,
                bidAmount: bidAmount.toString(),
                advertiserName: '名称未設定',
                targetUrl: '#',
                action: 'create_ad_bid',
            }
        })

        if (!checkoutSession.url) {
            throw new Error('Could not create checkout session URL')
        }

        return NextResponse.redirect(checkoutSession.url, 303)

    } catch (error: any) {
        console.error('Error creating checkout session:', error)
        return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 })
    }
}
