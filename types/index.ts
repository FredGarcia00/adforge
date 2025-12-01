export type UserTier = 'free' | 'pro' | 'agency'

// Video status type
export type VideoStatus = 'pending' | 'processing' | 'completed' | 'failed'

// Sort and filter types for data tables
export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  column: string
  direction: SortDirection
}

export interface FilterState {
  status: VideoStatus[]
  search: string
}

export type BulkAction = 'delete' | 'export'

export interface User {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  tier: UserTier
  stripe_customer_id: string | null
  created_at: string
}

export interface Video {
  id: string
  user_id: string
  title: string
  prompt: string
  video_url: string | null
  thumbnail_url: string | null
  status: VideoStatus
  views: number
  likes: number
  shares: number
  saves: number
  product_name: string | null
  product_price: string | null
  product_link: string | null
  product_benefits: string[] | null
  brand_colors: string[] | null
  created_at: string
}

export interface TikTokAccount {
  id: string
  user_id: string
  tiktok_username: string
  access_token: string
  refresh_token: string | null
  connected_at: string
}

export interface ProductImage {
  id: string
  video_id: string
  image_url: string
  order: number
}

export interface GenerateFormData {
  prompt: string
  productName?: string
  productPrice?: string
  productLink?: string
  productBenefits?: string[]
  brandColors?: string[]
  avatarId?: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  videosPerMonth: number
  features: string[]
  stripePriceId: string
}

export const SUBSCRIPTION_PLANS: Record<UserTier, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    videosPerMonth: 3,
    features: [
      '3 videos per month',
      'Basic analytics',
      'Watermarked exports',
    ],
    stripePriceId: '',
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 29,
    videosPerMonth: 50,
    features: [
      '50 videos per month',
      'Advanced analytics',
      'No watermarks',
      'Priority support',
      'Custom branding',
    ],
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID || '',
  },
  agency: {
    id: 'agency',
    name: 'Agency',
    price: 99,
    videosPerMonth: -1, // unlimited
    features: [
      'Unlimited videos',
      'Full analytics suite',
      'No watermarks',
      'Priority support',
      'Custom branding',
      'Team collaboration',
      'API access',
    ],
    stripePriceId: process.env.STRIPE_AGENCY_PRICE_ID || '',
  },
}
