import { handleAuth, handleCallback, handleLogin, handleLogout } from '@auth0/nextjs-auth0';

export default handleAuth({
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
      res.status(302).setHeader('Location', '/error').end();
    }
  },
  
  async callback(req, res) {
    try {
      await handleCallback(req, res, {
        redirectTo: '/dashboard'
      });
    } catch (error) {
      console.error('Callback error:', error);
      res.status(302).setHeader('Location', '/error').end();
    }
  },
  
  async logout(req, res) {
    try {
      await handleLogout(req, res, {
        returnTo: '/'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(302).setHeader('Location', '/').end();
    }
  }
}); 