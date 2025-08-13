```typescript
import React from 'react';
import type { User } from '../../server/auth';

interface UserMenuProps {
  user: User;
}

const UserMenu = ({ user }: UserMenuProps) => {
  return (
    <div className="flex items-center gap-4">
      <span className="text-lg font-medium text-gray-800">
        {user.name}
      </span>
      <button
        type="button"
        className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Logout
      </button>
    </div>
  );
};

export default UserMenu;