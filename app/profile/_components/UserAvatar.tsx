'use client';

import { Button } from '@/_components';
import { useAuth } from '@/auth/_providers/AuthProvider';

export default function UserAvatar() {
  const { isSignedIn, isAuthPending, openSignIn } = useAuth();

  if (isAuthPending) {
    return null;
  }

  return isSignedIn ? (
    <div>Sign out</div>
  ) : (
    <Button
      className="text-primary-foreground cursor-pointer"
      variant="default"
      onClick={() => openSignIn(true)}
    >
      Sign in
    </Button>
  );
}

