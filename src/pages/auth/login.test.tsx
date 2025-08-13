import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import Login from '../../src/pages/auth/login';

describe('Login Component', () => {
  test('renders the login form with email, password, and submit button', () => {
    render(<Login />);

    const emailInput = screen.getByLabelText(/email address/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');

    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');

    const loginButton = screen.getByRole('button', { name: /log in/i });
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toBeEnabled();
  });
});