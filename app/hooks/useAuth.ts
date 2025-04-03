'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';
import { AUTH0_NAMESPACE, AUTH0_ROLES_KEY } from '@/lib/auth0';

/**
 * Main authentication hook to be used throughout the application.
 * This combines capabilities from all other auth hooks into a single source of truth.
 */
export function useAuth() {
  // Get user from Auth0, with graceful error handling
  const { user, error: authError, isLoading } = useUser();
  const [error, setError] = useState(authError);

  // Handle Auth0 errors gracefully
  useEffect(() => {
    if (authError) {
      console.error('Auth0 error:', authError);
      setError(authError);
    }
  }, [authError]);
  
  // Debug user object and roles in development only
  useEffect(() => {
    if (user && !isLoading && process.env.NODE_ENV === 'development') {
      console.log('Auth0 user full object:', user);
      console.log('Auth0 namespace being checked:', AUTH0_NAMESPACE);
      console.log('Auth0 roles key path:', AUTH0_ROLES_KEY);
      console.log('Auth0 roles value from token:', user[AUTH0_ROLES_KEY]);
      
      // Check localStorage as fallback
      const localRole = localStorage.getItem('userRole');
      console.log('Role from localStorage:', localRole);
    }
  }, [user, isLoading]);
  
  // If authenticated, ensure local storage reflects this
  useEffect(() => {
    if (user && !isLoading) {
      localStorage.setItem('isAuthenticated', 'true');
      
      // Store user's name and email for convenience
      if (user.name) localStorage.setItem('userName', user.name as string);
      if (user.email) localStorage.setItem('userEmail', user.email as string);
    }
  }, [user, isLoading]);
  
  // Handle roles which could be an array, a single string, or undefined
  let rolesArray: string[] = [];
  
  try {
    if (user && user[AUTH0_ROLES_KEY]) {
      if (Array.isArray(user[AUTH0_ROLES_KEY])) {
        // If roles is already an array, use it directly
        rolesArray = user[AUTH0_ROLES_KEY] as string[];
        if (process.env.NODE_ENV === 'development') {
          console.log('Roles from token (array):', rolesArray);
        }
      } else if (typeof user[AUTH0_ROLES_KEY] === 'string') {
        // If roles is a single string, convert to array
        rolesArray = [user[AUTH0_ROLES_KEY] as string];
        if (process.env.NODE_ENV === 'development') {
          console.log('Roles from token (string):', rolesArray);
        }
      }
    } else if (user && typeof window !== 'undefined' && localStorage.getItem('userRole')) {
      // Fallback to localStorage if no roles in token
      const localRole = localStorage.getItem('userRole');
      if (localRole) {
        rolesArray = [localRole];
        if (process.env.NODE_ENV === 'development') {
          console.log('Using role from localStorage:', rolesArray);
        }
      }
    }
  } catch (err) {
    console.error('Error retrieving roles:', err);
    // Continue with empty roles array
  }
  
  // Determine role flags from the roles array
  const isPhotographer = rolesArray.includes('photographer');
  
  // IMPORTANT: Only default to client if there are truly no roles
  // and we're authenticated
  const isClient = rolesArray.includes('client') || 
    (!!user && rolesArray.length === 0);
    
  if (process.env.NODE_ENV === 'development') {
    console.log('Final role determination - isPhotographer:', isPhotographer, 'isClient:', isClient);
  }
  
  // Helper functions
  const setUserRole = (role: 'client' | 'photographer' | undefined): void => {
    if (typeof window !== 'undefined') {
      if (role) {
        localStorage.setItem('userRole', role);
      } else {
        localStorage.removeItem('userRole');
      }
    }
  };
  
  const logout = (): void => {
    // Clear local storage items related to user before redirecting
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      
      try {
        // Redirect to Auth0 logout endpoint
        window.location.href = '/api/auth/logout';
      } catch (err) {
        console.error('Error during logout:', err);
        // As fallback, redirect to home
        window.location.href = '/';
      }
    }
  };
  
  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    isPhotographer,
    isClient,
    roles: rolesArray,
    setUserRole,
    logout
  };
} 