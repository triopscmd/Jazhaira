```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Register from './register';

describe('Register Page', () => {
  it('should display a registration form with name, email, password, confirm password, and submit button', () => {
    render(<Register />);

    const nameInput = screen.getByLabelText(/name/i);
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveAttribute('type', 'text');

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');

    const passwordInput = screen.getByLabelText(/password/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');

    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
    expect(confirmPasswordInput).toBeInTheDocument();
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    const submitButton = screen.getByRole('button', { name: /register/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeEnabled();
  });
});