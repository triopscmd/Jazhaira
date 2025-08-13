import { describe, it, expect } from 'vitest';
import { getAuthenticatedUser } from '../auth';

describe('Authentication & Authorization Service', () => {
  it('should retrieve an authenticated user by their ID', async () => {
    const existingUserId = 'clx123abcde';
    const expectedUserEmail = 'authenticated.user@example.com';
    const expectedUserName = 'Authenticated User';

    const user = await getAuthenticatedUser(existingUserId);

    expect(user).toBeDefined();
    expect(user?.id).toBe(existingUserId);
    expect(user?.email).toBe(expectedUserEmail);
    expect(user?.name).toBe(expectedUserName);
  });

  it('should return null if the user ID does not exist', async () => {
    const nonExistentUserId = 'clx999xyzab';

    const user = await getAuthenticatedUser(nonExistentUserId);

    expect(user).toBeNull();
  });
});