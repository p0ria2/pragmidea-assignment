"use client";

import { QueryProvider } from "./QueryProvider";

export default function GlobalProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QueryProvider>{children}</QueryProvider>;
}
