export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 relative min-h-screen bg-white">
      {/* Grid background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="fixed inset-0 bg-gradient-to-b from-white via-white/80 to-white/40" />
      
      {/* Content */}
      <div className="relative text-gray-900">
        {children}
      </div>
    </div>
  );
} 