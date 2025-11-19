import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function ScrollHandCue({ onClick, className = '', color = '#ffffff' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const tl = gsap.to(el, { y: 10, duration: 1, repeat: -1, yoyo: true, ease: 'power1.inOut' })
    return () => tl.kill()
  }, [])

  return (
    <button
      aria-label="Scroll to next section"
      ref={ref}
      onClick={onClick}
      className={`scroll-hand group fixed md:absolute bottom-6 md:bottom-8 left-6 md:left-8 z-20 select-none outline-none ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="[perspective:800px]">
        <div className="transition-transform duration-300 group-hover:rotate-3 group-hover:scale-[1.05]" style={{ transformStyle: 'preserve-3d' }}>
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2v16M12 18l-4-4m4 4 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </button>
  )
}
