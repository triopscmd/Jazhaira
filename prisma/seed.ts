```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seed() {
  try {
    // Clear existing users to ensure idempotency for development and testing
    await prisma.user.deleteMany({});
    console.log('Cleared existing user data.');

    const initialUsers = [
      { name: 'Alice', email: 'alice@example.com' },
      { name: 'Bob', email: 'bob@example.com' },
      // Add more initial users as needed
      { name: 'Charlie', email: 'charlie@example.com' },
    ];

    // Create new users
    await prisma.user.createMany({
      data: initialUsers,
      skipDuplicates: true, // Optionally skip duplicates if emails might conflict in re-runs
    });
    console.log(`Seeded ${initialUsers.length} users.`);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect();
    console.log('Prisma client disconnected.');
  }
}

// This block allows the seed function to be executed directly from the command line
// e.g., `ts-node prisma/seed.ts` or `npx prisma db seed` (if configured in package.json)
if (require.main === module) {
  void seed();
}