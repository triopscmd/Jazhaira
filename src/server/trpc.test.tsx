import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appRouter } from './trpc';
import { createTRPCContext } from './context';

// Mock the Prisma client for isolation from the actual database
const mockPrisma = {
  user: {
    findMany: vi.fn(),
  },
};

// Mock the tRPC context creation to inject our mocked Prisma client.
// This ensures that when the `createCaller` is invoked, it uses our controlled mock environment.
vi.mock('./context', async (importOriginal) => {
  const originalModule = await importOriginal<typeof import('./context')>();
  return {
    ...originalModule,
    createTRPCContext: vi.fn().mockImplementation(() => ({
      prisma: mockPrisma,
      // Add other context properties here as they become relevant in your application,
      // e.g., session: null, auth: { userId: null }
    })),
  };
});

describe('tRPC API Infrastructure: User Procedures', () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    // Clear mock calls and reset mock implementations before each test
    mockPrisma.user.findMany.mockClear();
    (createTRPCContext as vi.Mock).mockClear();

    // Initialize the tRPC caller using the appRouter and the mocked context.
    // This line will cause the test to fail initially if 'appRouter' is not exported
    // from 'src/server/trpc.ts' or if 'createCaller' method is not yet available on it.
    caller = appRouter.createCaller(createTRPCContext());
  });

  it('should expose a user router with a getAll procedure to retrieve all users', async () => {
    // Arrange: Configure the mocked Prisma client to return an empty array initially.
    // This simulates a scenario where no users exist in the database.
    mockPrisma.user.findMany.mockResolvedValueOnce([]);

    // Act & Assert: Attempt to call the 'user.getAll' procedure.
    // This call will fail initially because the 'user' router or 'getAll' procedure
    // will not yet be defined within your 'appRouter' in 'src/server/trpc.ts'.
    const users = await caller.user.getAll();

    // These assertions will only be reached once the 'user.getAll' procedure is implemented
    // and successfully returns a value.
    expect(users).toBeInstanceOf(Array);
    expect(users).toEqual([]);
    expect(mockPrisma.user.findMany).toHaveBeenCalledTimes(1);
  });
});