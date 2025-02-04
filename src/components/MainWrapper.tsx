'use client';

import { usePathname } from 'next/navigation';

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className={`h-full ${!pathname?.startsWith('/auth') ? 'lg:pl-20' : ''}`}>
      {children}
    </main>
  );
} 