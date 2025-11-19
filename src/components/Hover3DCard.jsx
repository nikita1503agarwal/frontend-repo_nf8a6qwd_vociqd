import React, { useRef } from 'react'

export default function Hover3DCard({ children, className = '' }) {
  const ref = useRef(null)

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rx = ((y / rect.height) - 0.5) * -8
    const ry = ((x / rect.width) - 0.5) * 8
    el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`
  }

  const reset = () => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)'
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`transition-transform duration-150 will-change-transform [transform-style:preserve-3d] ${className}`}
    >
      {children}
    </div>
  )
}
