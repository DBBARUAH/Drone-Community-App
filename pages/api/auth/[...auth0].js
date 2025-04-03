import { handleAuth, handleCallback, handleLogin, handleLogout } from '@auth0/nextjs-auth0';

// Create improved error handlers with more specific error messages
const enhancedHandlers = {
  async login(req, res) {
    try {
      // Get the role parameter and connection type if available
      const role = req.query.role || 'client';
      const connection = req.query.connection; // 'google-oauth2', 'apple', etc.
      
      // Prepare Auth0 login options
      const authorizationParams = {
        // Pass role as a custom parameter to use in Auth0 Action
        role: role,
        // If using universal login screen without connection parameter
        screen_hint: role
      };
      
      // If a specific connection was requested, add it to params
      if (connection) {
        authorizationParams.connection = connection;
      }
      
      await handleLogin(req, res, {
        returnTo: '/dashboard',
        authorizationParams
      });
    } catch (error) {
      console.error('Login error:', error);
      
      // Check for specific error types
      if (error.message && error.message.includes('secret')) {
        console.error('Auth0 configuration error - missing secret');
      }
      
      // Redirect to error page with specific error code
      res.status(302).setHeader('Location', '/error?type=auth_error').end();
    }
  },
  
  async callback(req, res) {
    try {
      await handleCallback(req, res, {
        redirectTo: '/dashboard'
      });
    } catch (error) {
      console.error('Callback error:', error);
      
      // For callback errors, it's sometimes better to redirect to home
      // rather than showing an error page
      res.status(302).setHeader('Location', '/?auth_error=callback').end();
    }
  },
  
  async logout(req, res) {
    try {
      await handleLogout(req, res, {
        returnTo: '/'
      });
    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if logout fails, redirect to home page
      res.status(302).setHeader('Location', '/').end();
    }
  }
};

// Create a fallback handler function for when Auth0 initialization fails
function fallbackHandler(req, res) {
  console.error('Auth0 fallback handler invoked due to initialization error');
  return res.status(302).setHeader('Location', '/').end();
}

// Export the appropriate handler
let authHandler;
try {
  // Use the enhanced handlers when possible
  authHandler = handleAuth(enhancedHandlers);
} catch (error) {
  console.error('Auth0 initialization error:', error);
  authHandler = fallbackHandler;
}

export default authHandler; 