```typescript
import React from 'react';

const InitialSetup = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 text-gray-800">
      <h1 className="mb-4 text-center text-4xl font-bold">Welcome to your project!</h1>
      <p className="max-w-prose text-center text-lg">
        Please configure your application to get started.
      </p>
    </div>
  );
};

export default InitialSetup;