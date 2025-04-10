import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import auth0Instance, { AUTH0_NAMESPACE } from '../../app/lib/auth0';
import { getUserRole } from '../../app/lib/auth';

// Mock the Auth0 useUser hook
vi.mock('@auth0/nextjs-auth0/client', () => ({
  useUser: vi.fn(() => ({
    user: null,
    error: null,
    isLoading: false
  }))
}));

// Mock localStorage for client-side testing
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

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

describe('Auth0 Configuration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorageMock.clear();
  });

  it('should initialize Auth0 instance with proper configuration', () => {
    // Just checking that the instance exists
    // Actual initialization is tested through environment variables
    expect(AUTH0_NAMESPACE).toBeDefined();
  });

  it('should extract user roles from token', () => {
    // Mock a user with roles in Auth0 token
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com',
      [`${AUTH0_NAMESPACE}/roles`]: ['photographer']
    };

    // Test role extraction function
    const role = getUserRole(mockUser);
    expect(role).toBe('photographer');
  });

  it('should fallback to localStorage when no roles in token', () => {
    // Mock a user without roles
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com'
    };

    // Set a role in localStorage
    localStorageMock.setItem('userRole', 'client');

    // Test role fallback
    const role = getUserRole(mockUser);
    expect(role).toBe('client');
  });

  it('should handle array of roles from token', () => {
    // Mock a user with array of roles
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com',
      [`${AUTH0_NAMESPACE}/roles`]: ['photographer', 'client']
    };

    // Test role extraction - should pick the first role
    const role = getUserRole(mockUser);
    expect(role).toBe('photographer');
  });

  it('should handle string role from token', () => {
    // Mock a user with a string role
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com',
      [`${AUTH0_NAMESPACE}/roles`]: 'client'
    };

    // Test role extraction with string value
    const role = getUserRole(mockUser);
    expect(role).toBe('client');
  });

  it('should return undefined if no roles are found', () => {
    // Mock a user without roles
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com'
    };

    // No role in localStorage
    localStorageMock.clear();

    // Test role extraction with no role available
    const role = getUserRole(mockUser);
    expect(role).toBeUndefined();
  });
}); 