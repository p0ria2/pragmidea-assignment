'use client';

import AuthProvider from '@/auth/_providers/AuthProvider';
import QueryProvider from './QueryProvider';

export default function GlobalProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  );
}

