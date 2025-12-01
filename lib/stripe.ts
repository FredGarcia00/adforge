import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
})

export const STRIPE_PRICES = {
  pro: process.env.STRIPE_PRO_PRICE_ID!,
  agency: process.env.STRIPE_AGENCY_PRICE_ID!,
}
