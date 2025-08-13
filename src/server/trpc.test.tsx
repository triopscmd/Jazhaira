import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import React from 'react';

import { trpc } from '../src/server/trpc';

const UserFetcherComponent: React.FC = () => {
  const { data, isLoading, isError } = trpc.user.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error!</div>;
  if (!data || data.length === 0) return <div>No users.</div>;

  return (
    <ul>
      {data.map((user: { id: string; name: string; email: string }) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

describe('tRPC Infrastructure User API Integration', () => {
  it('should fail when attempting to use the tRPC user API before implementation', () => {
    let caughtError: unknown;
    try {
      render(<UserFetcherComponent />);
    } catch (error) {
      caughtError = error;
    }

    expect(caughtError).toBeDefined();
  });
});