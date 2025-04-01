# Auth0 Action Setup for Role Assignment

This document explains how to configure your Auth0 Action to properly assign roles based on the selected role in the sign-in/sign-up forms.

## Step 1: Access Auth0 Actions

1. Log in to your [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Actions** > **Flows**
3. Select the **Login** flow
4. Find your existing action or create a new one titled "Assign User Role"
5. Click on the action to edit it

## Step 2: Update the Action Code

Replace the code in your action with the following:

```javascript
/**
 * Handler that will be called during the execution of a PostLogin flow.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  console.log('Auth0 Action executing...');
  
  // Get the role from the URL query parameter
  let role = event.request.query && event.request.query.role;
  
  // Fallback to screen_hint if role isn't directly provided
  if (!role && event.request.query && event.request.query.screen_hint) {
    // If screen_hint is "signup", check if there's a role in user_metadata
    if (event.request.query.screen_hint === "signup" && event.user.user_metadata && event.user.user_metadata.role) {
      role = event.user.user_metadata.role;
    } else if (event.request.query.screen_hint !== "signup") {
      // For non-signup flows, screen_hint might be the role
      role = event.request.query.screen_hint;
    }
  }
  
  // Default to client if no role is found
  if (!role) {
    role = "client";
  }
  
  // Validate the role
  if (role !== "client" && role !== "photographer") {
    console.log(`Invalid role: ${role}, defaulting to client`);
    role = "client";
  }
  
  console.log(`Setting user role to: ${role}`);
  
  // Store the role in user metadata
  api.user.setUserMetadata("role", role);
  
  // Set up the namespace for the claims
  const namespace = "https://localhost:3000";
  
  // Add role as a custom claim to both tokens
  // IMPORTANT: Use an array format for the roles as many systems expect this
  api.idToken.setCustomClaim(`${namespace}/roles`, [role]);
  api.accessToken.setCustomClaim(`${namespace}/roles`, [role]);
  
  console.log('Auth0 Action completed successfully');
};

/**
 * Handler that will be invoked when this action is resuming after an external redirect.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onContinuePostLogin = async (event, api) => {
  // We don't need to do anything here
};
```

## Step 3: Deploy the Action

1. Click on the **Deploy** button to save your changes
2. Ensure the action is enabled in the Login flow

## Step 4: Test the Setup

1. Log out of your application if you're currently logged in
2. Go to the sign-up or sign-in page
3. Select "Photographer" as your role
4. Complete the authentication process
5. You should now be redirected to the photographer dashboard

## Troubleshooting

If you're still being directed to the client dashboard, check:

1. **Browser Console**: Look for any console logs that might indicate what's happening
2. **Auth0 Logs**: In your Auth0 Dashboard, navigate to **Monitoring** > **Logs** to see if there are any errors
3. **Query Parameters**: Ensure that the `role` parameter is being passed correctly in the URL when redirecting to Auth0
4. **Token Inspector**: In your Auth0 Dashboard, use the **JWT Debugger** to inspect the tokens and verify the custom claims

## Common Issues

- **Caching**: Clear your browser cache and cookies to ensure you're getting a fresh session
- **Typos**: Ensure the namespace in your Auth0 Action matches exactly with your middleware and useAuth hook
- **Missing Parameters**: Verify all query parameters are being passed correctly to Auth0
- **Action Order**: If you have multiple actions in your Login flow, ensure they execute in the correct order

Remember that token-related changes will only take effect for new logins. Any existing sessions will continue to use the tokens that were generated at login time. 