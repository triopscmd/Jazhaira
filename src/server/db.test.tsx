import { describe, it, expect } from 'vitest';
import { PrismaClient } from '@prisma/client';

import { db } from '../db';

describe('Prisma Database Client', () => {
  it('should export a defined PrismaClient instance', () => {
    expect(db).toBeDefined();
    expect(db).toBeInstanceOf(PrismaClient);
  });
});