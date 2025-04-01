'use client';

import { useUser } from '@auth0/nextjs-auth0/client';

// Define the namespace inline to avoid import issues
const AUTH0_NAMESPACE = 'https://localhost:3000';
const AUTH0_ROLES_KEY = `${AUTH0_NAMESPACE}/roles`;

export function useAuth() {
  const { user, error, isLoading } = useUser();
  
  // Extract roles from user object if available
  const roles = (user?.[AUTH0_ROLES_KEY] as string[]) || [];
  const isPhotographer = roles.includes('photographer');
  const isClient = roles.includes('client') || roles.length === 0; // Default to client
  
  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    isPhotographer,
    isClient,
    roles
  };
} 