import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0/edge';

// Define the namespace inline to avoid import issues
const AUTH0_NAMESPACE = 'https://localhost:3000';
const AUTH0_ROLES_KEY = `${AUTH0_NAMESPACE}/roles`;

// Helper function to get roles array from session
function getRolesFromSession(session: any): string[] {
  const rolesData = session.user[AUTH0_ROLES_KEY];
  console.log('Roles data from session:', rolesData, 'Type:', typeof rolesData);
  
  if (!rolesData) {
    console.log('No roles found in session using the namespace:', AUTH0_NAMESPACE);
    
    // Check if user has a role in user_metadata as fallback
    if (session.user.user_metadata && session.user.user_metadata.role) {
      const metadataRole = session.user.user_metadata.role;
      console.log('Found role in user_metadata:', metadataRole);
      return [metadataRole];
    }
    
    return [];
  }
  
  // Handle different formats
  if (Array.isArray(rolesData)) {
    console.log('Roles is an array:', rolesData);
    return rolesData as string[];
  }
  if (typeof rolesData === 'string') {
    console.log('Roles is a string, converting to array:', [rolesData]);
    return [rolesData];
  }
  return [];
}

// Middleware to protect routes and handle role-based redirects
export async function middleware(request: NextRequest) {
  try {
    // Check if user is authenticated by getting the session
    const res = NextResponse.next();
    const session = await getSession(request, res);
    
    if (!session?.user) {
      return NextResponse.redirect(new URL('/api/auth/login', request.url));
    }
    
    // Print debugging info to server logs
    console.log('Auth0 Session User:', session.user);
    console.log('Auth0 Roles from token:', session.user[AUTH0_ROLES_KEY]);
    
    // For the dashboard route, redirect based on role
    if (request.nextUrl.pathname === '/dashboard') {
      // Get roles from user token
      const roles = getRolesFromSession(session);
      const isPhotographer = roles.includes('photographer');
      
      console.log('Dashboard redirect - roles:', roles);
      console.log('Dashboard redirect - isPhotographer:', isPhotographer);
      
      // Redirect to the appropriate dashboard
      const dashboardPath = isPhotographer 
        ? '/dashboard/photographer' 
        : '/dashboard/client';
        
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }
    
    // Check for client attempting to access photographer dashboard
    if (request.nextUrl.pathname === '/dashboard/photographer') {
      const roles = getRolesFromSession(session);
      if (!roles.includes('photographer')) {
        return NextResponse.redirect(new URL('/dashboard/client', request.url));
      }
    }
    
    // Check for photographer attempting to access client dashboard
    if (request.nextUrl.pathname === '/dashboard/client') {
      const roles = getRolesFromSession(session);
      if (roles.includes('photographer') && !roles.includes('client')) {
        return NextResponse.redirect(new URL('/dashboard/photographer', request.url));
      }
    }
    
    // For other protected routes, just continue
    return res;
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.redirect(new URL('/api/auth/login', request.url));
  }
}

// Configure middleware to only run on protected routes
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*'
  ],
}; 