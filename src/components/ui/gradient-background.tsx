"use client"

export function GradientBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-black/30" /> {/* Overlay para escurecer */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-gradient" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-soft-light" />
    </div>
  )
} 