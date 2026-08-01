// Server Component on purpose (no "use client" here).
// These routes depend on localStorage/auth state that only exists in the
// browser, so they must never be statically prerendered at build time.
export const dynamic = "force-dynamic";

import AppShellClient from "@/components/AppShellClient";

export default function AppLayout({ children }) {
  return <AppShellClient>{children}</AppShellClient>;
}