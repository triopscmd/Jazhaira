```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

// Mock PrismaClient to prevent actual database interactions during testing
const mockUserCreate = vi.fn();
const mockPrismaClient = {
  user: {
    create: mockUserCreate,
  },
  $disconnect: vi.fn(),
};

// Mock the @prisma/client module to return our mock instance
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => mockPrismaClient),
}));

// This import will fail initially because the `seedDatabase` function
// is not yet exported from `prisma/seed.ts`, or the file itself might not exist.
// Adjust the path '../../prisma/seed' based on your project's exact file structure.
// Common paths might be '../prisma/seed' or './prisma/seed' depending on test file location.
import { seedDatabase } from '../../prisma/seed';

describe('Prisma Seed Script Functionality', () => {
  beforeEach(() => {
    // Reset all mocks before each test to ensure isolation
    mockUserCreate.mockClear();
    mockPrismaClient.$disconnect.mockClear();
    vi.mocked(PrismaClient).mockClear(); // Clear PrismaClient constructor calls if needed

    // Default successful mock return for create operation
    mockUserCreate.mockResolvedValue({
      id: 'mock-user-id',
      name: 'Mock User',
      email: 'mock@example.com',
    });
  });

  it('should attempt to seed initial user data into the database', async () => {
    await seedDatabase(); // Assuming seedDatabase is the exported function to test

    // Verify that PrismaClient was instantiated
    expect(PrismaClient).toHaveBeenCalledTimes(1);

    // Verify that the user.create method was called with the expected data
    expect(mockUserCreate).toHaveBeenCalledTimes(1);
    expect(mockUserCreate).toHaveBeenCalledWith({
      data: {
        name: 'Test User',
        email: 'test@example.com',
      },
    });

    // Verify that the database connection was disconnected
    expect(mockPrismaClient.$disconnect).toHaveBeenCalledTimes(1);
  });

  it('should disconnect from the database even if seeding fails', async () => {
    const seedingError = new Error('Failed to create user during seeding');
    mockUserCreate.mockRejectedValueOnce(seedingError); // Simulate a failure during user creation

    // Expect the function to throw the error
    await expect(seedDatabase()).rejects.toThrow(seedingError);

    // Verify that user.create was still attempted
    expect(mockUserCreate).toHaveBeenCalledTimes(1);

    // Verify that $disconnect was called, indicating cleanup even on error
    expect(mockPrismaClient.$disconnect).toHaveBeenCalledTimes(1);
  });
});