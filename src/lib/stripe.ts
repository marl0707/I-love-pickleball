import Stripe from 'stripe'

// KI準拠: Stripe build-time Proxy パターン
// ビルド時にキーが存在しなくてもクラッシュしないよう、
// lazy-getter (遅延初期化) を使用してランタイムでのみStripeを初期化する
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
    if (!_stripe) {
        const secretKey = process.env.STRIPE_SECRET_KEY
        if (!secretKey) {
            throw new Error(
                'STRIPE_SECRET_KEY is not set. Please add it to your environment variables.'
            )
        }
        _stripe = new Stripe(secretKey, {
            apiVersion: '2025-02-24.acacia' as any,
            appInfo: {
                name: 'ilovepickleball-ad-auction',
                url: 'https://ronshoal.com/pickleball',
            },
        })
    }
    return _stripe
}
