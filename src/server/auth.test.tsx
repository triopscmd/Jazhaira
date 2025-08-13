import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

// This import will cause the test to FAIL initially as the file
// "src/server/auth.ts" and its exports (AuthProvider, useAuth) do not exist yet.
import { AuthProvider, useAuth } from '../server/auth';

// Define a mock User type consistent with prisma/schema.prisma
type MockUser = {
  id: string;
  name: string;
  email: string;
};

// A dummy component to consume the authentication context provided by AuthProvider
const TestAuthConsumer = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  if (user) {
    return <span>Logged in as: {user.name} ({user.email})</span>;
  }

  return <div>Not logged in</div>;
};

describe('AuthProvider', () => {
  const mockAuthenticatedUser: MockUser = {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
  };

  // Mock a function that AuthProvider might internally use to fetch session data.
  // This simulates the asynchronous dependency of AuthProvider.
  const mockInternalSessionFetcher = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially and then transition to authenticated state upon successful session fetch', async () => {
    // Configure the mock fetcher to resolve with an authenticated user object.
    mockInternalSessionFetcher.mockResolvedValueOnce(mockAuthenticatedUser);

    // Render the AuthProvider, assuming it accepts an 'internalSessionFetcher' prop
    // for dependency injection, allowing us to control its async behavior.
    render(
      <AuthProvider internalSessionFetcher={mockInternalSessionFetcher}>
        <TestAuthConsumer />
      </AuthProvider>
    );

    // Assert initial loading state
    expect(screen.getByText('Loading authentication...')).toBeInTheDocument();

    // Wait for the asynchronous session fetch to complete and for the component
    // to re-render with the authenticated state.
    await waitFor(() => {
      expect(screen.getByText(`Logged in as: ${mockAuthenticatedUser.name} (${mockAuthenticatedUser.email})`)).toBeInTheDocument();
    }, { timeout: 3000 }); // Increase timeout for CI environments if needed

    // Verify that the internal session fetcher was called once.
    expect(mockInternalSessionFetcher).toHaveBeenCalledTimes(1);
  });

  it('should render loading state initially and then transition to unauthenticated state if no session is found', async () => {
    // Configure the mock fetcher to resolve with null, indicating no active user session.
    mockInternalSessionFetcher.mockResolvedValueOnce(null);

    render(
      <AuthProvider internalSessionFetcher={mockInternalSessionFetcher}>
        <TestAuthConsumer />
      </AuthProvider>
    );

    // Assert initial loading state
    expect(screen.getByText('Loading authentication...')).toBeInTheDocument();

    // Wait for the asynchronous session fetch to complete and for the component
    // to re-render with the unauthenticated state.
    await waitFor(() => {
      expect(screen.getByText('Not logged in')).toBeInTheDocument();
    }, { timeout: 3000 });

    // Verify that the internal session fetcher was called once.
    expect(mockInternalSessionFetcher).toHaveBeenCalledTimes(1);
  });
});