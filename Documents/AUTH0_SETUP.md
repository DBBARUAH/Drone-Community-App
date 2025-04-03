# Auth0 Setup Instructions for Next.js 15+

This document explains how to set up Auth0 authentication for the Drone Community App with Next.js 15+ and App Router.

## Step 1: Create an Auth0 Account

If you don't already have an Auth0 account, sign up at [auth0.com](https://auth0.com/).

## Step 2: Create a New Application

1. In the Auth0 dashboard, go to **Applications** > **Applications**.
2. Click **Create Application**.
3. Name your application (e.g., "Drone Community App").
4. Select **Regular Web Applications** as the application type.
5. Click **Create**.

## Step 3: Configure Your Application

In your application settings:

1. Set **Allowed Callback URLs** to:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://your-production-domain.com/auth/callback`

2. Set **Allowed Logout URLs** to:
   - Development: `http://localhost:3000`
   - Production: `https://your-production-domain.com`

3. Set **Allowed Web Origins** to:
   - Development: `http://localhost:3000`
   - Production: `https://your-production-domain.com`

## Step 4: Configure Environment Variables

Create or update your `.env.local` file with the following variables:

```
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_SECRET=a-long-random-string-for-cookie-encryption
APP_BASE_URL=http://localhost:3000
```

Where:
- `your-auth0-domain` is your Auth0 domain (found in your application settings)
- `your-auth0-client-id` is your Application Client ID
- `your-auth0-client-secret` is your Application Client Secret

For the AUTH0_SECRET, you can generate a secure random string using:
```bash
openssl rand -hex 32
```

## Step 5: Configuring Custom User Metadata

To store user roles and other custom data:

1. In the Auth0 dashboard, go to **Actions** > **Flows**.
2. Select the **Login** flow.
3. Add a new action called "Set user role".
4. Use this code as a template for the action:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  // Check if it's a new user
  if (event.stats.logins_count === 1) {
    // You could get role information from the user object if available
    const defaultRole = "client"; // Default role for new users
    
    // Set user metadata with the role
    api.user.setUserMetadata("role", defaultRole);
  }
  
  // Add the role to the ID token
  const namespace = "https://your-app-domain.com";
  const role = event.user.user_metadata.role || "client";
  
  api.idToken.setCustomClaim(`${namespace}/role`, role);
  api.accessToken.setCustomClaim(`${namespace}/role`, role);
};
```

## Step 6: Next.js App Router Integration

Our implementation uses the Auth0 SDK v4.x with Next.js App Router:

1. Create an Auth0 client file (`app/lib/auth0.ts`):
   ```typescript
   import { Auth0Client } from "@auth0/nextjs-auth0/server";
   export const auth0 = new Auth0Client();
   ```

2. Set up middleware (`middleware.ts`):
   ```typescript
   import { NextRequest } from 'next/server';
   import { auth0 } from './app/lib/auth0';

   export async function middleware(request: NextRequest) {
     return await auth0.middleware(request);
   }

   export const config = {
     matcher: [
       "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
     ],
   };
   ```

3. Create authentication routes in a catch-all route handler (`app/api/auth/[...auth0]/route.ts`):
   ```typescript
   import { NextRequest } from 'next/server';
   import { auth0 } from '@/app/lib/auth0';

   export async function GET(req: NextRequest) {
     return await auth0.handleAuth(req);
   }

   export async function POST(req: NextRequest) {
     return await auth0.handleAuth(req);
   }
   ```

## Step 7: Authentication Flows

The Auth0 SDK v4.x creates these routes automatically:

1. Login: `/auth/login`
2. Signup: `/auth/login?screen_hint=signup`
3. Callback: `/auth/callback`
4. Logout: `/auth/logout`
5. Profile: `/auth/profile`
6. Access Token: `/auth/access-token`

## Step 8: Testing

After setting up Auth0:

1. Run your application locally: `npm run dev`
2. Navigate to `http://localhost:3000/signin`
3. Click "Sign in with Auth0"
4. You should be redirected to Auth0 for authentication
5. After successful authentication, you should be redirected back to your application

## Troubleshooting

- If you encounter CORS errors, make sure your Auth0 application has the correct Allowed Web Origins.
- If callbacks fail, verify your Allowed Callback URLs are correct.
- For logout issues, check your Allowed Logout URLs.
- Verify all environment variables are correctly set.
- If using an older version of the SDK, you might need to reinstall with `npm install @auth0/nextjs-auth0@latest` 