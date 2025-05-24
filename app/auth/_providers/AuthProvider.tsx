'use client';

import {
  signIn as authSignIn,
  signOut as authSignOut,
  signUp as authSignUp,
  useSession,
} from '@/_lib/auth-client';
import { useQueryClient } from '@tanstack/react-query';
import { User } from 'better-auth';
import {
  createContext,
  Dispatch,
  SetStateAction,
  use,
  useCallback,
  useState,
} from 'react';
import { toast } from 'sonner';
import SignIn from '../_components/SignIn';

interface AuthContextType {
  isSignedIn: boolean;
  isAuthPending: boolean;
  user?: User;
  isSignInOpen: boolean;
  openSignIn: Dispatch<SetStateAction<boolean>>;
  ensureSignedIn: (action: () => void, message?: string) => void;
  signUpEmail: (
    credentials: { email: string; password: string },
    fetchOptions?: Parameters<typeof authSignUp.email>[0]['fetchOptions']
  ) => void;
  signInEmail: (
    credentials: { email: string; password: string },
    fetchOptions?: Parameters<typeof authSignIn.email>[0]['fetchOptions']
  ) => void;
  signInSocial: (
    provider: Parameters<typeof authSignIn.social>[0]['provider'],
    fetchOptions?: Parameters<typeof authSignIn.social>[0]['fetchOptions']
  ) => void;
  signOut: (fetchOptions?: Parameters<typeof authSignOut>[0]) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isPending } = useSession();
  const [isSignInOpen, openSignIn] = useState(false);
  const [isAuthPending, setIsAuthPending] = useState(false);
  const isSignedIn = !!data?.user;

  const queryClient = useQueryClient();

  const showAuthRequiredToast = useCallback(
    (message = 'You must be signed in to access this page') => {
      toast(message, {
        action: {
          label: 'Sign in',
          onClick: () => {
            openSignIn(true);
          },
        },
      });
    },
    []
  );

  const ensureSignedIn = useCallback<AuthContextType['ensureSignedIn']>(
    (action, message) => {
      isSignedIn ? action() : showAuthRequiredToast(message);
    },
    [isSignedIn, showAuthRequiredToast]
  );

  const signUpEmail = useCallback<AuthContextType['signUpEmail']>(
    (credentials, fetchOptions) => {
      authSignUp.email({
        ...credentials,
        name: credentials.email,
        callbackURL: window?.location.href || '/',
        fetchOptions: {
          ...(fetchOptions || {}),
          onRequest: (ctx) => {
            setIsAuthPending(true);
            fetchOptions?.onRequest?.(ctx);
          },
          onResponse: (ctx) => {
            fetchOptions?.onResponse?.(ctx);
            setIsAuthPending(false);
          },
        },
      });
    },
    []
  );

  const signInEmail = useCallback<AuthContextType['signInEmail']>(
    (credentials, fetchOptions) => {
      authSignIn.email({
        ...credentials,
        fetchOptions: {
          ...(fetchOptions || {}),
          onRequest: (ctx) => {
            setIsAuthPending(true);
            fetchOptions?.onRequest?.(ctx);
          },
          onResponse: (ctx) => {
            fetchOptions?.onResponse?.(ctx);
            setIsAuthPending(false);
          },
        },
      });
    },
    []
  );

  const signInSocial = useCallback<AuthContextType['signInSocial']>(
    (provider, fetchOptions) => {
      authSignIn.social({
        provider,
        callbackURL: window?.location.href || '/',
        fetchOptions: {
          ...(fetchOptions || {}),
          onRequest: (ctx) => {
            setIsAuthPending(true);
            fetchOptions?.onRequest?.(ctx);
          },
          onResponse: (ctx) => {
            fetchOptions?.onResponse?.(ctx);
            setIsAuthPending(false);
          },
        },
      });
    },
    []
  );

  const signOut = useCallback<AuthContextType['signOut']>((opts) => {
    authSignOut({
      ...opts,
      fetchOptions: {
        ...(opts?.fetchOptions || {}),
        onRequest: (ctx) => {
          setIsAuthPending(true);
          opts?.fetchOptions?.onRequest?.(ctx);
        },
        onSuccess: (ctx) => {
          opts?.fetchOptions?.onSuccess?.(ctx);
          queryClient.removeQueries({
            queryKey: ['bookmarks'],
          });
        },
        onResponse: (ctx) => {
          opts?.fetchOptions?.onResponse?.(ctx);

          // added a small delay to ensure session is updated before setting isAuthPending to false
          setTimeout(() => {
            setIsAuthPending(false);
          }, 1000);
        },
      },
    });
  }, []);

  return (
    <AuthContext
      value={{
        isSignedIn: !!data?.user,
        user: data?.user,
        isAuthPending: isPending || isAuthPending,
        isSignInOpen,
        openSignIn,
        ensureSignedIn,
        signUpEmail,
        signInEmail,
        signInSocial,
        signOut,
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

