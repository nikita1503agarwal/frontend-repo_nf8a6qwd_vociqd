import React, { useEffect, useRef } from 'react'

// Lightweight magnetic cursor: a soft circle follows the pointer and
// slightly attracts elements marked with data-magnetic
export default function MagneticCursor() {
  const dotRef = useRef(null)
  const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const dot = dotRef.current
    if (!dot) return

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let tx = x
    let ty = y

    const speed = 0.18

    const move = (e) => {
      tx = e.clientX
      ty = e.clientY

      // magnetic attraction for elements with data-magnetic
      const target = e.target.closest?.('[data-magnetic]')
      if (target) {
        dot.classList.add('scale-150', 'bg-white/30')
      } else {
        dot.classList.remove('scale-150')
        dot.style.backgroundColor = 'rgba(255,255,255,0.15)'
      }
    }

    const raf = () => {
      x += (tx - x) * speed
      y += (ty - y) * speed
      dot.style.transform = `translate3d(${x - 10}px, ${y - 10}px, 0)`
      id = requestAnimationFrame(raf)
    }

    if (reduce) {
      dot.style.display = 'none'
      return
    }

    let id = requestAnimationFrame(raf)
    window.addEventListener('pointermove', move, { passive: true })

    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('pointermove', move)
    }
  }, [reduce])

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed z-[100] top-0 left-0 h-5 w-5 rounded-full bg-white/15 backdrop-blur-[2px] mix-blend-difference transition-transform duration-150 will-change-transform"
    />
  )
}
