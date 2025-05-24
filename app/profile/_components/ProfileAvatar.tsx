'use client';

import { Avatar, Button } from '@/_components';
import { initials } from '@/_lib/string-utils';
import { useAuth } from '@/auth/_providers/AuthProvider';

export default function ProfileAvatar() {
  const { isSignedIn, isAuthPending, openSignIn, user } = useAuth();

  return isSignedIn ? (
    <Avatar imageUrl={user?.image} fallback={initials(user?.name || '')} />
  ) : (
    <Button
      className="text-primary-foreground cursor-pointer"
      variant="default"
      disabled={isAuthPending}
      onClick={() => openSignIn(true)}
    >
      Sign in
    </Button>
  );
}

