# Auth0 Delete Account Feature Setup

This document explains how to configure your Auth0 account to enable the "Delete Account" feature in your Drone Community App.

## Step 1: Enable Management API Access

Your application needs to have access to the Auth0 Management API with the proper scopes to delete user accounts.

1. Log in to your [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Applications** > **Applications**
3. Select your application (e.g., "Drone Community App")
4. Scroll down to the **Application Properties** section
5. Make sure the Application Type is set to "Regular Web Application"

## Step 2: Create an Auth0 Machine-to-Machine Application

For security purposes, it's best to create a separate Machine-to-Machine (M2M) application specifically for management operations:

1. In the Auth0 Dashboard, go to **Applications** > **Applications**
2. Click **Create Application**
3. Choose a name (e.g., "Drone Community Management API")
4. Select "Machine to Machine Applications" as the application type
5. Click **Create**
6. Select the Auth0 Management API from the dropdown
7. In the permissions (scopes) section, select the following permissions:
   - **REQUIRED**: `delete:users` - allows deleting users
   - `read:users` - allows reading user profiles (helpful for verification)
   - `update:users` - allows updating user profiles (helpful if you need to deactivate instead of delete)
8. Click **Authorize**

## Step 3: Update Your Environment Variables

Update your `.env.local` file with the credentials of your M2M application:

```
# Existing Auth0 variables for your web application
AUTH0_SECRET=your-existing-secret
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-tenant.region.auth0.com
AUTH0_CLIENT_ID=your-web-app-client-id
AUTH0_CLIENT_SECRET=your-web-app-client-secret
AUTH0_SCOPE=openid profile email

# Add these new variables for the Management API
AUTH0_MGMT_CLIENT_ID=your-m2m-app-client-id
AUTH0_MGMT_CLIENT_SECRET=your-m2m-app-client-secret
```

## Step 4: Update API Endpoint

Update the `app/api/user/delete-account/route.ts` file to use the M2M application credentials:

```typescript
// In the getManagementApiToken function, use the M2M credentials
body: JSON.stringify({
  client_id: process.env.AUTH0_MGMT_CLIENT_ID || process.env.AUTH0_CLIENT_ID,
  client_secret: process.env.AUTH0_MGMT_CLIENT_SECRET || process.env.AUTH0_CLIENT_SECRET,
  audience: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/`,
  grant_type: 'client_credentials'
})
```

## Troubleshooting

If you encounter errors when trying to delete a user account, check the following:

### 1. Check console logs

The API endpoint has detailed logging. Check your server console for error messages.

### 2. Verify permissions (most common issue)

Make sure your M2M application has the `delete:users` permission. You can verify this in the Auth0 Dashboard under:
- **Applications** > **Your M2M App** > **APIs** > **Auth0 Management API**

According to [Auth0's official documentation](https://auth0.com/docs/api/management/v2/users/delete-users-by-id), deleting a user requires:
- A valid access token with the `delete:users` scope

### 3. Check the API endpoint format

The Management API URL should be in this format:
```
DELETE https://YOUR_DOMAIN/api/v2/users/USER_ID
```

Where:
- `YOUR_DOMAIN` is your Auth0 domain (e.g., `dev-abc123.us.auth0.com`)
- `USER_ID` is the user's Auth0 ID (typically in format `auth0|1234567890`)

### 4. Check for rate limiting

Auth0 has rate limits for the Management API. If you see errors indicating rate limiting, you may need to wait or request increased limits.

### 5. Verify environment variables

Double-check that your environment variables are set correctly and that the application can access them.

### Common error messages:

- **"Insufficient scope"**: Your application doesn't have the required permissions. Ensure you granted `delete:users` scope.
- **"Invalid token"**: The token is malformed or expired. Check the token generation process.
- **"Rate limit exceeded"**: You've hit Auth0's rate limits.
- **"Invalid request"**: The request to the Management API is malformed.
- **"401 Unauthorized"**: Your application doesn't have permission to use the Management API. Check credentials.
- **"403 Forbidden"**: Your token is valid but doesn't have the required scopes.

## Testing the Delete User API

You can test the Management API directly using a tool like Postman or curl:

```bash
curl --request DELETE \
  --url 'https://YOUR_DOMAIN/api/v2/users/USER_ID' \
  --header 'authorization: Bearer YOUR_MANAGEMENT_API_TOKEN'
```

Replace:
- `YOUR_DOMAIN` with your Auth0 domain
- `USER_ID` with the user ID to delete
- `YOUR_MANAGEMENT_API_TOKEN` with a token obtained using your M2M credentials

## Best Practices

For production use, consider implementing:

1. **Token caching**: Cache the Management API token as it's valid for 24 hours.
2. **Proper error handling**: Add more detailed error handling and user-friendly messages.
3. **Confirmation emails**: Send an email to users when their account is deleted.
4. **Data cleanup**: Implement background jobs to clean up associated data. 