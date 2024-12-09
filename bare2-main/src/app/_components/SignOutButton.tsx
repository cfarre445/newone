// app/_components/SignOutButton.tsx
'use client'; // Ensure it's a client component

import { useAuthenticator } from '@aws-amplify/ui-react';
import React from 'react';

export default function SignOutButton() {
  const { signOut } = useAuthenticator();

  return (
    <button
      onClick={signOut}
      className="hover:bg-white/20 block p-2 rounded w-full text-left" // Full width and aligned to the left
    >
      Sign out
    </button>
  );
}
