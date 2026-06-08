import React, { useEffect, useState } from 'react'

export function ScanlineEffect(): React.ReactElement {
  const [position, setPosition] = useState(-10)

  useEffect(() => {
    // A single scanline that sweeps down periodically
    const interval = setInterval(() => {
      setPosition(prev => {
        if (prev > 110) return -10
        return prev + 1
      })
    }, 20)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {/* Background static scanlines */}
      <div className="scanlines" />
      
      {/* Moving scanline */}
      <div style={{
        position: 'absolute',
        left: 0,
        right: 0,
        height: '2px',
        background: 'rgba(255, 255, 255, 0.1)',
        boxShadow: '0 0 10px rgba(255,255,255,0.2)',
        top: `${position}%`,
        pointerEvents: 'none',
        zIndex: 10,
      }} />
      
      {/* Vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.8) 100%)',
        pointerEvents: 'none',
        zIndex: 5
      }} />
    </>
  )
}
