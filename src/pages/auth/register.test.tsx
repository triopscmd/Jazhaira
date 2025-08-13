```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RegisterPage from '../register';

describe('RegisterPage', () => {
  it('renders the registration form with name, email, password inputs and a submit button', () => {
    render(<RegisterPage />);

    expect(screen.getByRole('heading', { name: /Register/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
  });
});