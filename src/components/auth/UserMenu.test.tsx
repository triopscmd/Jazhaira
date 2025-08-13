import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import UserMenu from './UserMenu';

const mockUser = {
  id: 'user123',
  name: 'John Doe',
  email: 'john.doe@example.com',
};

describe('UserMenu', () => {
  it('should display the logged-in user\'s name and a logout button', () => {
    render(<UserMenu user={mockUser} />);

    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });
});