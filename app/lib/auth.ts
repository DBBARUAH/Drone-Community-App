import { useUser } from '@auth0/nextjs-auth0/client';

// Basic user profile interface based on Auth0 user properties
export interface UserProfile {
  name?: string | null;
  nickname?: string | null;
  picture?: string | null;
  email?: string | null;
  email_verified?: boolean | null;
  sub?: string | null;
  [key: string]: any; // For other properties that might be returned
}

// User roles
export type UserRole = 'client' | 'photographer' | undefined;

// Extended user interface with our custom fields
export interface ExtendedUser extends UserProfile {
  role?: UserRole;
}

// Get the user's role
export function getUserRole(): UserRole {
  // First priority: check localStorage
  if (typeof window !== 'undefined') {
    const role = localStorage.getItem('userRole') as UserRole;
    if (role) return role;
  }
  
  return undefined;
}

// Set the user's role
export function setUserRole(role: UserRole): void {
  if (typeof window !== 'undefined') {
    if (role) {
      localStorage.setItem('userRole', role);
    } else {
      localStorage.removeItem('userRole');
    }
  }
}

// Custom hook to get the extended user
export function useExtendedUser() {
  const { user, error, isLoading } = useUser();
  
  // Extend the user with our additional fields
  const extendedUser: ExtendedUser | undefined = user ? {
    ...user,
    role: getUserRole(),
  } : undefined;
  
  return { user: extendedUser, error, isLoading };
}

// Helper to check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window !== 'undefined') {
    // Check both Auth0 and our local auth flag for backwards compatibility
    const localAuth = localStorage.getItem('isAuthenticated') === 'true';
    return localAuth;
  }
  return false;
}

// Logout helper with cleanup
export function logout(): void {
  // First, clear local storage items related to user
  if (typeof window !== 'undefined') {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    
    // Redirect to Auth0 logout endpoint
    window.location.href = '/api/auth/logout';
  }
} 