import React from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserMenuProps {
  user: User;
  onLogout?: () => void; // Optional logout handler for future use, satisfies stateless requirement
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout }) => {
  return (
    <div className="flex items-center space-x-4">
      <span className="text-gray-800 font-medium">{user.name}</span>
      <button
        onClick={onLogout}
        className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        aria-label="Logout"
      >
        Logout
      </button>
    </div>
  );
};

export default UserMenu;