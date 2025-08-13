import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SeedComponent from './seed'; // Assuming seed.ts will be refactored into a React component

describe('Initial Users Display Component', () => {
  it('should display a list of initial users from the seeded data', () => {
    // This test assumes 'prisma/seed.ts' will be a React component responsible
    // for displaying data populated by the seeding process.
    render(<SeedComponent />);

    // Verify the presence of a title or heading related to initial users
    expect(screen.getByRole('heading', { name: /initial users/i })).toBeInTheDocument();

    // Verify specific seeded users are displayed
    expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();

    expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();

    expect(screen.getByText('Charlie Brown')).toBeInTheDocument();
    expect(screen.getByText('charlie@example.com')).toBeInTheDocument();
  });
});