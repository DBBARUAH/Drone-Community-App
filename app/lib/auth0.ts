import { initAuth0 } from '@auth0/nextjs-auth0';

// Custom namespace for Auth0 custom claims - use environment-specific base URL
export const AUTH0_NAMESPACE = process.env.AUTH0_BASE_URL || 'https://localhost:3000';
export const AUTH0_ROLES_KEY = `${AUTH0_NAMESPACE}/roles`;

// Check if all required Auth0 variables are present
const isAuth0Configured = 
  process.env.AUTH0_SECRET &&
  process.env.AUTH0_ISSUER_BASE_URL &&
  process.env.AUTH0_BASE_URL &&
  process.env.AUTH0_CLIENT_ID &&
  process.env.AUTH0_CLIENT_SECRET;

// Initialize a null auth0 instance
let auth0Instance = null;

// Use a try-catch block to prevent hard crashes if config is missing
try {
  // Initialize Auth0 with the required configuration
  const auth0Config = {
    secret: process.env.AUTH0_SECRET || 'placeholder-secret-for-development-only',
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    baseURL: process.env.AUTH0_BASE_URL || 'http://localhost:3000',
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    routes: {
      callback: '/api/auth/callback',
      postLogoutRedirect: '/'
    },
    authorizationParams: {
      scope: process.env.AUTH0_SCOPE || 'openid profile email'
    }
  };

  // Log configuration issues in development
  if (process.env.NODE_ENV === 'development' && !isAuth0Configured) {
    console.warn('Auth0 is not fully configured. Authentication will not work properly.');
    console.warn('Missing environment variables:', {
      AUTH0_SECRET: !process.env.AUTH0_SECRET,
      AUTH0_ISSUER_BASE_URL: !process.env.AUTH0_ISSUER_BASE_URL,
      AUTH0_BASE_URL: !process.env.AUTH0_BASE_URL,
      AUTH0_CLIENT_ID: !process.env.AUTH0_CLIENT_ID,
      AUTH0_CLIENT_SECRET: !process.env.AUTH0_CLIENT_SECRET,
    });
  }

  // Only initialize Auth0 if properly configured
  if (isAuth0Configured) {
    auth0Instance = initAuth0(auth0Config);
  }
} catch (error) {
  console.error('Error initializing Auth0:', error);
}

// Export a single default value
export default auth0Instance; 