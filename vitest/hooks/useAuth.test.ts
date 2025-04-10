import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useAuth } from '../../app/hooks/useAuth';
import { AUTH0_NAMESPACE, AUTH0_ROLES_KEY } from '../../app/lib/auth0';

// Mock the Auth0 useUser hook
vi.mock('@auth0/nextjs-auth0/client', () => ({
  useUser: vi.fn()
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

// Mock window.location
const locationMock = {
  href: ''
};

// Type for mock Auth0 user with index signature
type MockAuth0User = {
  name: string;
  email: string;
  [key: string]: any; // Allow string indexing for dynamic Auth0 properties
};

describe('useAuth Hook', () => {
  beforeEach(() => {
    // Setup mocks before each test
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
    
    Object.defineProperty(window, 'location', {
      value: locationMock,
      writable: true
    });
    
    // Clear localStorage
    localStorageMock.clear();
    
    // Reset window.location.href
    locationMock.href = '';
    
    // Clear all mocks
    vi.clearAllMocks();

    // Default mock implementation for process.env
    vi.stubEnv('NODE_ENV', 'test');
  });

  it('should return isAuthenticated=false when user is null', () => {
    // Setup mock return value
    (useUser as any).mockReturnValue({ 
      user: null, 
      error: null, 
      isLoading: false 
    });

    // Render the hook
    const { result } = renderHook(() => useAuth());

    // Verify the hook returns the correct values
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should return isAuthenticated=true when user is not null', () => {
    // Mock authenticated user
    const mockUser: MockAuth0User = {
      name: 'Test User',
      email: 'test@example.com'
    };
    
    // Setup mock return value
    (useUser as any).mockReturnValue({ 
      user: mockUser, 
      error: null, 
      isLoading: false 
    });

    // Render the hook
    const { result } = renderHook(() => useAuth());

    // Verify the hook returns the correct values
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
  });

  it('should store user info in localStorage when authenticated', () => {
    // Mock authenticated user
    const mockUser: MockAuth0User = {
      name: 'Test User',
      email: 'test@example.com'
    };
    
    // Setup mock return value
    (useUser as any).mockReturnValue({ 
      user: mockUser, 
      error: null, 
      isLoading: false 
    });

    // Render the hook
    renderHook(() => useAuth());

    // Verify localStorage was updated
    expect(localStorageMock.getItem('isAuthenticated')).toBe('true');
    expect(localStorageMock.getItem('userName')).toBe('Test User');
    expect(localStorageMock.getItem('userEmail')).toBe('test@example.com');
  });

  it('should detect photographer role from token', () => {
    // Setup roles in auth0 token
    const mockUser: MockAuth0User = {
      name: 'Test User',
      email: 'test@example.com'
    };
    
    // Add roles to the user object using computed property
    mockUser[AUTH0_ROLES_KEY] = ['photographer'];
    
    // Setup mock return value
    (useUser as any).mockReturnValue({ 
      user: mockUser, 
      error: null, 
      isLoading: false 
    });

    // Render the hook
    const { result } = renderHook(() => useAuth());

    // Verify roles were detected correctly
    expect(result.current.isPhotographer).toBe(true);
    expect(result.current.isClient).toBe(false);
    expect(result.current.roles).toEqual(['photographer']);
  });

  it('should detect client role from token', () => {
    // Setup roles in auth0 token
    const mockUser: MockAuth0User = {
      name: 'Test User',
      email: 'test@example.com'
    };
    
    // Add roles to the user object using computed property
    mockUser[AUTH0_ROLES_KEY] = ['client'];
    
    // Setup mock return value
    (useUser as any).mockReturnValue({ 
      user: mockUser, 
      error: null, 
      isLoading: false 
    });

    // Render the hook
    const { result } = renderHook(() => useAuth());

    // Verify roles were detected correctly
    expect(result.current.isPhotographer).toBe(false);
    expect(result.current.isClient).toBe(true);
    expect(result.current.roles).toEqual(['client']);
  });

  it('should set user role in localStorage', () => {
    // Setup mock return value
    (useUser as any).mockReturnValue({ 
      user: null, 
      error: null, 
      isLoading: false 
    });

    // Render the hook
    const { result } = renderHook(() => useAuth());

    // Call the setUserRole function
    act(() => {
      result.current.setUserRole('photographer');
    });

    // Verify localStorage was updated
    expect(localStorageMock.getItem('userRole')).toBe('photographer');
  });

  it('should clear localStorage on logout', () => {
    // Populate localStorage first
    localStorageMock.setItem('isAuthenticated', 'true');
    localStorageMock.setItem('userRole', 'photographer');
    localStorageMock.setItem('userName', 'Test User');
    localStorageMock.setItem('userEmail', 'test@example.com');

    // Setup mock return value
    (useUser as any).mockReturnValue({ 
      user: { name: 'Test User' }, 
      error: null, 
      isLoading: false 
    });

    // Render the hook
    const { result } = renderHook(() => useAuth());

    // Call the logout function
    act(() => {
      result.current.logout();
    });

    // Verify localStorage was cleared
    expect(localStorageMock.getItem('isAuthenticated')).toBeNull();
    expect(localStorageMock.getItem('userRole')).toBeNull();
    expect(localStorageMock.getItem('userName')).toBeNull();
    expect(localStorageMock.getItem('userEmail')).toBeNull();
    
    // Verify redirection
    expect(locationMock.href).toBe('/api/auth/logout');
  });

  it('should handle errors from Auth0', () => {
    // Setup mock return value with error
    const mockError = new Error('Auth0 error');
    (useUser as any).mockReturnValue({ 
      user: null, 
      error: mockError, 
      isLoading: false 
    });

    // Render the hook
    const { result } = renderHook(() => useAuth());

    // Verify error was handled
    expect(result.current.error).toEqual(mockError);
  });
}); 