```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';

// Mock the PrismaClient to prevent actual database interactions during testing.
const mockUserCreateMany = vi.fn();
const mockUserDeleteMany = vi.fn();
const mockDisconnect = vi.fn();

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn(() => ({
    user: {
      createMany: mockUserCreateMany,
      deleteMany: mockUserDeleteMany,
    },
    $disconnect: mockDisconnect,
  })),
}));

// Import the seed script. This import will cause the test to fail initially
// if 'prisma/seed.ts' does not exist or does not export a 'seed' function.
// It assumes that the seeding logic is encapsulated in an exported 'seed' function.
import { seed } from './seed';

describe('Prisma Seed Script', () => {
  beforeEach(() => {
    // Reset all mock functions before each test to ensure isolation.
    mockUserCreateMany.mockClear();
    mockUserDeleteMany.mockClear();
    mockDisconnect.mockClear();
    // Re-instantiate PrismaClient mock if necessary, though the module mock handles it here.
    vi.mocked(PrismaClient).mockClear();
  });

  it('should seed the database with initial user data', async () => {
    // Execute the seed function.
    await seed();

    // Verify that PrismaClient was instantiated.
    expect(PrismaClient).toHaveBeenCalledTimes(1);

    // Verify that existing user data was potentially cleared (common for idempotent seeding).
    expect(mockUserDeleteMany).toHaveBeenCalledTimes(1);
    expect(mockUserDeleteMany).toHaveBeenCalledWith({});

    // Verify that new user data was created.
    expect(mockUserCreateMany).toHaveBeenCalledTimes(1);
    expect(mockUserCreateMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({ name: 'Alice', email: 'alice@example.com' }),
        expect.objectContaining({ name: 'Bob', email: 'bob@example.com' }),
      ]),
    });

    // Verify that the Prisma client connection was properly disconnected.
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });
});