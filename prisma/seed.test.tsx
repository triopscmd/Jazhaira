import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

// The component we are testing. This import path is hypothetical and
// assumes a React component named UserList will be created at './UserList.tsx'.
// As the component does not exist yet, this import will cause a module not found error
// or a similar import failure, leading to the test failing initially as required.
import UserList from './UserList';

// Mock data to simulate the users fetched from the API.
// This aligns with the 'User' model defined in prisma/schema.prisma.
const mockUsers = [
  { id: 'clx0p0t3y00003b1776w4s0p3', name: 'Alice Smith', email: 'alice@example.com' },
  { id: 'clx0p0t3y00013b1776w4s0p4', name: 'Bob Johnson', email: 'bob@example.com' },
];

// Mock a hypothetical API hook or service that UserList would use to fetch users.
// This is crucial for isolating the component's rendering logic from actual API calls.
vi.mock('../utils/api', () => ({
  // This mock assumes the component uses a hook named `useUsers`
  // that returns an object with `data`, `isLoading`, and `error` properties.
  useUsers: vi.fn(),
}));

describe('UserList Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test to ensure test isolation.
    vi.clearAllMocks();

    // Default mock implementation for the `useUsers` hook: return success with mockUsers.
    vi.mocked(vi.importActual('../utils/api')).useUsers.mockImplementation(() => ({
      data: mockUsers,
      isLoading: false,
      error: null,
    }));
  });

  it('should display a list of users fetched from the API', async () => {
    // Render the UserList component. This will initially fail because './UserList'
    // does not exist or does not export a default React component.
    render(<UserList />);

    // Wait for the component to render and display the user data.
    // This assumes the data fetching is asynchronous.
    await waitFor(() => {
      // Assert that the names and emails of the mock users are present in the document.
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.getByText('alice@example.com')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      expect(screen.getByText('bob@example.com')).toBeInTheDocument();
    });
  });

  it('should display a loading state while fetching users', async () => {
    // Override the mock to simulate a loading state (data is undefined, isLoading is true).
    vi.mocked(vi.importActual('../utils/api')).useUsers.mockImplementation(() => ({
      data: undefined,
      isLoading: true,
      error: null,
    }));

    render(<UserList />);

    // Assert that a loading indicator is displayed.
    // This will fail if the component does not render "Loading users..." during its loading state.
    expect(screen.getByText('Loading users...')).toBeInTheDocument();
  });

  it('should display an error message if fetching users fails', async () => {
    const errorMessage = 'Failed to load users due to network issue.';
    // Override the mock to simulate an error state.
    vi.mocked(vi.importActual('../utils/api')).useUsers.mockImplementation(() => ({
      data: undefined,
      isLoading: false,
      error: new Error(errorMessage),
    }));

    render(<UserList />);

    // Assert that the error message is displayed.
    // This will fail if the component does not render the error when `error` is present.
    await waitFor(() => {
      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });

    // Ensure no user data is displayed when there's an error.
    expect(screen.queryByText('Alice Smith')).not.toBeInTheDocument();
  });
});