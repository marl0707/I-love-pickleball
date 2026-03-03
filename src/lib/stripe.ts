import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('Stripe SECRET key is not set in environment variables.')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'dummy_key_for_build', {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2026-02-25.clover', // eslint等による指定バージョン
    appInfo: {
        name: 'ilovepickleball-ad-auction',
        url: 'https://ronshoal.com/pickleball',
    },
})
