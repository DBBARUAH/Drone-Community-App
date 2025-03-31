'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect } from 'react';

// Define the namespace inline to avoid import issues
const AUTH0_NAMESPACE = 'https://localhost:3000';
const AUTH0_ROLES_KEY = `${AUTH0_NAMESPACE}/roles`;

export function useAuth() {
  const { user, error, isLoading } = useUser();
  
  // Debug user object and roles
  useEffect(() => {
    if (user && !isLoading) {
      console.log('Auth0 user full object:', user);
      console.log('Auth0 namespace being checked:', AUTH0_NAMESPACE);
      console.log('Auth0 roles key path:', AUTH0_ROLES_KEY);
      console.log('Auth0 roles value from token:', user[AUTH0_ROLES_KEY]);
      
      // Check localStorage as fallback
      const localRole = localStorage.getItem('userRole');
      console.log('Role from localStorage:', localRole);
    }
  }, [user, isLoading]);
  
  // Handle roles which could be an array, a single string, or undefined
  let rolesArray: string[] = [];
  if (user && user[AUTH0_ROLES_KEY]) {
    if (Array.isArray(user[AUTH0_ROLES_KEY])) {
      // If roles is already an array, use it directly
      rolesArray = user[AUTH0_ROLES_KEY] as string[];
      console.log('Roles from token (array):', rolesArray);
    } else if (typeof user[AUTH0_ROLES_KEY] === 'string') {
      // If roles is a single string, convert to array
      rolesArray = [user[AUTH0_ROLES_KEY] as string];
      console.log('Roles from token (string):', rolesArray);
    }
  } else if (user && localStorage.getItem('userRole')) {
    // Fallback to localStorage if no roles in token
    const localRole = localStorage.getItem('userRole');
    if (localRole) {
      rolesArray = [localRole];
      console.log('Using role from localStorage:', rolesArray);
    }
  }
  
  // Determine role flags from the roles array
  const isPhotographer = rolesArray.includes('photographer');
  
  // IMPORTANT: Only default to client if there are truly no roles
  // and we're authenticated
  const isClient = rolesArray.includes('client') || 
    (!!user && rolesArray.length === 0);
    
  console.log('Final role determination - isPhotographer:', isPhotographer, 'isClient:', isClient);
  
  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    isPhotographer,
    isClient,
    roles: rolesArray
  };
} 