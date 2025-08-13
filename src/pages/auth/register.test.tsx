```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Register from '../../pages/auth/register';

describe('Register Page', () => {
  it('should display a registration form with name, email, password, and confirm password fields', () => {
    render(<Register />);

    // Expect a text input for name
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();

    // Expect a text input for email address
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();

    // Expect a password input
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();

    // Expect a password input for confirmation
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();

    // Expect a submit button for registration
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });
});