import { describe, it, expect } from 'vitest';
import { registerNewUser } from '../src/server/auth'; // This import will cause the test to fail initially.

describe('Authentication Service (auth.ts)', () => {
  it('should successfully register a new user with valid details', async () => {
    const newUserDetails = {
      name: 'Alice Smith',
      email: 'alice.smith@example.com',
    };

    // This call will fail because 'registerNewUser' is not yet implemented in 'src/server/auth.ts'.
    const registeredUser = await registerNewUser(newUserDetails.name, newUserDetails.email);

    // These assertions define the expected behavior once 'registerNewUser' is implemented.
    expect(registeredUser).toBeDefined();
    expect(registeredUser.name).toBe(newUserDetails.name);
    expect(registeredUser.email).toBe(newUserDetails.email);
    expect(registeredUser).toHaveProperty('id');
  });
});