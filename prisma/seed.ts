import React from 'react';

const SeedComponent = () => {
  const initialUsers = [
    { name: 'Alice Smith', email: 'alice@example.com' },
    { name: 'Bob Johnson', email: 'bob@example.com' },
    { name: 'Charlie Brown', email: 'charlie@example.com' },
  ];

  return (
    <div>
      <h1>Initial Users</h1>
      {initialUsers.map((user, index) => (
        <div key={index}>
          <p>{user.name}</p>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
};

export default SeedComponent;