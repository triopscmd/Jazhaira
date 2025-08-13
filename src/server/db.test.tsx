import { expect, describe, it } from 'vitest';
import { prisma } from '../db';

describe('Database Client Initialization', () => {
  it('should initialize and export the Prisma client', () => {
    expect(prisma).toBeDefined();
    expect(typeof prisma).toBe('object');
    expect(prisma.user).toBeDefined();
    expect(typeof prisma.user.findUnique).toBe('function');
  });
});