'use client';

import { useSession } from '@/_lib/auth-client';
import { User } from 'better-auth';
import { createContext, Dispatch, SetStateAction, use, useState } from 'react';
import SignIn from '../_components/SignIn';

interface AuthContextType {
  isSignedIn: boolean;
  isAuthPending: boolean;
  user?: User;
  isSignInOpen: boolean;
  openSignIn: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isPending } = useSession();
  const [isSignInOpen, openSignIn] = useState(false);

  return (
    <AuthContext
      value={{
        isSignedIn: !!data?.user,
        user: data?.user,
        isAuthPending: isPending,
        isSignInOpen,
        openSignIn,
      }}
    >
      {children}
      <SignIn />
    </AuthContext>
  );
}

export const useAuth = () => {
  const context = use(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

