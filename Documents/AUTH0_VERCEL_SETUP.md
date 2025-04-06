# Auth0 Setup Guide for Development and Vercel

## Environment Variables

You need to set up the following environment variables in both your local development environment and Vercel:

```env
# Auth0 Configuration
AUTH0_SECRET='use [openssl rand -hex 32] to generate a 32 bytes value'
AUTH0_BASE_URL='http://localhost:3000' # Local: http://localhost:3000, Vercel: https://your-app.vercel.app
AUTH0_ISSUER_BASE_URL='https://your-tenant.region.auth0.com'
AUTH0_CLIENT_ID='your-auth0-client-id'
AUTH0_CLIENT_SECRET='your-auth0-client-secret'
```

## Local Development Setup

1. Create a `.env.local` file in your project root
2. Copy the above environment variables
3. Fill in the values from your Auth0 dashboard
4. Use `http://localhost:3000` as your `AUTH0_BASE_URL`

## Vercel Production Setup

1. Go to your project settings in Vercel
2. Navigate to the "Environment Variables" section
3. Add the same environment variables as above
4. Use your Vercel deployment URL (e.g., `https://your-app.vercel.app`) as your `AUTH0_BASE_URL`

## Auth0 Dashboard Configuration

### Allowed Callback URLs
Add both URLs:
- `http://localhost:3000/api/auth/callback`
- `https://your-app.vercel.app/api/auth/callback`

### Allowed Logout URLs
Add both URLs:
- `http://localhost:3000`
- `https://your-app.vercel.app`

### Allowed Web Origins
Add both URLs:
- `http://localhost:3000`
- `https://your-app.vercel.app`

## Important Notes

1. Make sure your Auth0 application type is set to "Regular Web Application"
2. Enable the "Password" grant type in your Auth0 application settings
3. If using custom domains, replace `your-app.vercel.app` with your custom domain
4. Update the URLs in Auth0 dashboard whenever you add new domains or deployment environments

## Troubleshooting

If you encounter issues:

1. Verify all environment variables are correctly set
2. Check that all URLs in Auth0 dashboard match your actual URLs
3. Ensure your Auth0 application settings match the above configuration
4. Clear browser cookies and local storage if testing changes
5. Check Vercel deployment logs for any Auth0-related errors 