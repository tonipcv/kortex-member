"use client"

import { useState, useEffect } from 'react'

export function MousePointerBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div 
      className="fixed w-[800px] h-[800px] rounded-full bg-blue-500/10 blur-3xl pointer-events-none transition-all duration-1000 ease-out"
      style={{
        transform: `translate(${mousePosition.x - 400}px, ${mousePosition.y - 400}px)`,
      }}
    />
  )
} 