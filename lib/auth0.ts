import { initAuth0 } from '@auth0/nextjs-auth0';

// Custom namespace for Auth0 custom claims - use environment-specific base URL
export const AUTH0_NAMESPACE = process.env.AUTH0_BASE_URL || 'https://localhost:3000';
export const AUTH0_ROLES_KEY = `${AUTH0_NAMESPACE}/roles`;

// Initialize Auth0 with the required configuration
export default initAuth0({
  secret: process.env.AUTH0_SECRET,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  routes: {
    callback: '/api/auth/callback',
    postLogoutRedirect: '/'
  },
  authorizationParams: {
    scope: 'openid profile email'
  }
}); 