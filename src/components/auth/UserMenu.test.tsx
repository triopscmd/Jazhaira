import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserMenu from './UserMenu'; // This import will fail initially as the component does not exist

const mockUser = {
  id: 'test-user-id-123',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
};

describe('UserMenu', () => {
  test('should display the logged-in user\'s name and a logout option', () => {
    // This render call will fail initially because UserMenu is not yet defined
    render(<UserMenu user={mockUser} />);

    // Assert that the user's name is visible
    expect(screen.getByText(mockUser.name)).toBeInTheDocument();

    // Assert that a logout button or link is present
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });
});