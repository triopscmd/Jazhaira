```typescript
import { vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// This import path is specified by the problem description.
// It will cause the test to fail initially because 'src/server/api/routers/auth.router'
// is a backend tRPC router, not a React component.
import AuthForm from 'src/server/api/routers/auth.router';

// Mock the tRPC client for authentication-related procedures.
// This assumes a 'trpc' utility with an 'auth' router and a 'login' mutation.
// Adjust the path to 'trpc' utility based on your project structure relative to this test file.
vi.mock('../utils/trpc', () => ({
  trpc: {
    auth: {
      login: {
        useMutation: vi.fn(), // Mock the `useMutation` hook for the `login` procedure
      },
      getSession: { // Mock for potentially re-fetching session after login/logout
        useQuery: vi.fn(),
      },
    },
  },
}));

// Import the mocked trpc object to control its return values
import { trpc } from '../utils/trpc';

describe('AuthForm Component - User Authentication', () => {
  // Common mock for the `mutate` function from `useMutation`
  const mockLoginMutate = vi.fn();
  // Common mock for `refetch` from `useQuery` for session
  const mockGetSessionRefetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock for `trpc.auth.login.useMutation`.
    // We'll override `mockLoginMutate`'s behavior in specific tests.
    (trpc.auth.login.useMutation as ReturnType<typeof vi.fn>).mockReturnValue({
      mutate: mockLoginMutate,
      isLoading: false,
      isError: false,
      isSuccess: false,
      error: null,
    });

    // Default mock for `trpc.auth.getSession.useQuery`.
    (trpc.auth.getSession.useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: null, // No session by default
      isLoading: false,
      isError: false,
      error: null,
      refetch: mockGetSessionRefetch,
    });
  });

  test('should allow a user to log in successfully and display success message', async () => {
    const user = userEvent.setup();

    // Configure the `mockLoginMutate` to call `onSuccess` callback.
    mockLoginMutate.mockImplementation((_credentials, { onSuccess }) => {
      onSuccess?.(); // Simulate successful API call
    });

    render(<AuthForm />);

    // Assert initial form elements presence
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    const loginButton = screen.getByRole('button', { name: /log in|sign in/i });
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toBeEnabled();

    // Simulate user input
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');

    // Simulate form submission
    await user.click(loginButton);

    // Assert that the tRPC login mutation was called with the correct data
    expect(mockLoginMutate).toHaveBeenCalledTimes(1);
    expect(mockLoginMutate).toHaveBeenCalledWith(
      { email: 'test@example.com', password: 'password123' },
      expect.any(Object) // Expecting the options object with callbacks
    );

    // After successful login, the component should show a success message
    await waitFor(() => {
      expect(screen.getByText(/login successful|welcome/i)).toBeInTheDocument();
    });

    // Assert that the session was re-fetched after successful login
    expect(mockGetSessionRefetch).toHaveBeenCalledTimes(1);
  });

  test('should display an error message on failed login attempt', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Invalid credentials or user not found.';

    // Configure the `mockLoginMutate` to call `onError` callback.
    mockLoginMutate.mockImplementation((_credentials, { onError }) => {
      onError?.(new Error(errorMessage)); // Simulate failed API call
    });

    render(<AuthForm />);

    // Simulate user input
    await user.type(screen.getByLabelText(/email/i), 'wrong@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpass');

    // Simulate form submission
    await user.click(screen.getByRole('button', { name: /log in|sign in/i }));

    // Assert that the tRPC login mutation was called
    expect(mockLoginMutate).toHaveBeenCalledTimes(1);

    // After failed login, the component should display an error message
    await waitFor(() => {
      expect(screen.getByText(new RegExp(errorMessage, 'i'))).toBeInTheDocument();
    });

    // Ensure success message is not present and session was not re-fetched
    expect(screen.queryByText(/login successful|welcome/i)).not.toBeInTheDocument();
    expect(mockGetSessionRefetch).not.toHaveBeenCalled();
  });

  test('should show loading state during login submission and then resolve', async () => {
    const user = userEvent.setup();

    // Create a deferred promise to control when the mutation resolves
    let resolveLoginPromise: (value?: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let rejectLoginPromise: (reason?: any) => void; // Not used in this success case
    const deferredLoginPromise = new Promise((resolve, reject) => {
      resolveLoginPromise = resolve;
      rejectLoginPromise = reject;
    });

    // Configure the `useMutation` mock for this specific test to control `isLoading` state
    (trpc.auth.login.useMutation as ReturnType<typeof vi.fn>).mockImplementation(() => {
      let isLoadingState = false;

      const mutate = vi.fn(async (_input, { onSuccess, onError }) => {
        isLoadingState = true; // Set isLoading to true when mutate is called
        // We'll manage the promise resolution from the test
        await deferredLoginPromise.then(
          (result) => {
            isLoadingState = false;
            onSuccess?.(result);
          },
          (error) => {
            isLoadingState = false;
            onError?.(error);
          }
        );
      });

      return {
        mutate: mutate,
        get isLoading() { return isLoadingState; }, // Getter to reflect current state
        isError: false,
        isSuccess: false,
        error: null,
      };
    });

    render(<AuthForm />);
    const loginButton = screen.getByRole('button', { name: /log in|sign in/i });

    // Initial state: button enabled, no loading text
    expect(loginButton).toBeEnabled();
    expect(screen.queryByText(/logging in...|authenticating.../i)).not.toBeInTheDocument();

    // Simulate user input and form submission
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(loginButton);

    // After submission, the component should show a loading state
    await waitFor(() => {
      expect(loginButton).toBeDisabled(); // Button typically disabled during loading
      expect(screen.getByText(/logging in...|authenticating.../i)).toBeInTheDocument();
    });

    // Resolve the deferred promise to simulate successful completion of the mutation
    resolveLoginPromise();

    // After resolution, loading state should disappear and success message should appear
    await waitFor(() => {
      expect(loginButton).toBeEnabled(); // Button re-enabled
      expect(screen.queryByText(/logging in...|authenticating.../i)).not.toBeInTheDocument();
      expect(screen.getByText(/login successful|welcome/i)).toBeInTheDocument();
    });

    // Assert that the session was re-fetched
    expect(mockGetSessionRefetch).toHaveBeenCalledTimes(1);
  });
});