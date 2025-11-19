import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const el = ref.current
      if (!el) return
      gsap.from(el.querySelectorAll('.line'), {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: el,
          start: 'top 80%'
        }
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <footer ref={ref} className="relative h-[100vh] bg-black text-white flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,0,0,0.12),transparent_60%)]" />
      <div className="text-center px-6">
        <h2 className="line text-4xl md:text-6xl font-black tracking-tight">Let’s build something cinematic.</h2>
        <p className="line mt-4 text-white/70">hello@yourstudio.com</p>
        <div className="line mt-8 flex items-center justify-center gap-6">
          <a className="underline underline-offset-4 decoration-red-500 hover:text-red-400 transition-colors" href="#">Instagram</a>
          <a className="underline underline-offset-4 decoration-red-500 hover:text-red-400 transition-colors" href="#">Vimeo</a>
          <a className="underline underline-offset-4 decoration-red-500 hover:text-red-400 transition-colors" href="#">LinkedIn</a>
        </div>
      </div>
    </footer>
  )
}
