'use client';

import {
  Avatar,
  Button,
  LoadingButton,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/_components';
import { signOut } from '@/_lib/auth-client';
import { initials } from '@/_lib/string-utils';
import { useAuth } from '@/auth/_providers/AuthProvider';
import { User } from 'better-auth';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ProfileAvatar() {
  const { isSignedIn, isAuthPending, openSignIn, user } = useAuth();

  return isSignedIn ? (
    <ProfilePopover user={user!} />
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

export function ProfilePopover({ user }: { user: User }) {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onSuccess: () => {
          setOpen(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || 'Something went wrong');
        },
      },
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="cursor-pointer">
        <Avatar imageUrl={user?.image} fallback={initials(user?.name || '')} />
      </PopoverTrigger>
      <PopoverContent className="mr-2 w-fit">
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground text-sm">{user?.email}</p>
          <LoadingButton
            className="cursor-pointer"
            variant="outline"
            size="sm"
            onClick={handleSignOut}
            isLoading={isPending}
          >
            Sign out
          </LoadingButton>
        </div>
      </PopoverContent>
    </Popover>
  );
}

