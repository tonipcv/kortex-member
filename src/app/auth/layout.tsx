'use client';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="h-full">
      {children}
    </main>
  );
} 