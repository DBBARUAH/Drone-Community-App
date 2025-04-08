/**
 * Utility for safely accessing environment variables in both client and server contexts
 */

// Client-side variables (exposed to the browser)
export const publicConfig = {
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  stripeProPriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
  stripePremiumPriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
}

// Server-side-only variables (not exposed to browser)
export const serverConfig = {
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  auth0Secret: process.env.AUTH0_SECRET,
  auth0ClientSecret: process.env.AUTH0_CLIENT_SECRET,
  auth0MgmtClientSecret: process.env.AUTH0_MGMT_CLIENT_SECRET,
  databaseUrl: process.env.DATABASE_URL,
}

// Utilities
export function getRequiredServerConfig(key: keyof typeof serverConfig): string {
  const value = serverConfig[key]
  if (!value) {
    throw new Error(`Missing required server environment variable: ${key}`)
  }
  return value
}

export function getRequiredPublicConfig(key: keyof typeof publicConfig): string {
  const value = publicConfig[key]
  if (!value) {
    throw new Error(`Missing required public environment variable: ${key}`)
  }
  return value
} 