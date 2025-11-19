import React, { useEffect, useRef } from 'react'
import Spline from '@splinetool/react-spline'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugin
if (typeof window !== 'undefined' && gsap.core?.globals()?.ScrollTrigger !== ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Hero() {
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    // Text reveal animations
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from(titleRef.current?.querySelectorAll('.reveal-word'), {
        yPercent: 100,
        opacity: 0,
        duration: 1.1,
        stagger: 0.07,
      })
      tl.from(subtitleRef.current, { y: 20, opacity: 0, duration: 0.9 }, '-=0.4')

      // Subtle floating parallax for overlay chips
      gsap.to(overlayRef.current?.querySelectorAll('.floaty'), {
        y: 30,
        x: 15,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.3,
      })

      // Fade overlay out slightly on scroll to transition to next sections
      gsap.to('#hero', {
        opacity: 0.92,
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    })

    return () => ctx.revert()
  }, [])

  const title = 'We craft cinematic digital experiences.'
  const words = title.split(' ')

  return (
    <section id="hero" className="relative h-[100dvh] w-full bg-black text-white overflow-hidden">
      {/* 3D Spline scene */}
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/Ujidb4bmigoHT4IV/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Gradient vignette overlay for depth (non-blocking) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,0,0,0.12),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.35)_60%,rgba(0,0,0,0.85)_100%)]" />

      {/* Content */}
      <div className="relative z-10 h-full w-full flex items-center">
        <div className="container mx-auto px-6 md:px-10">
          <h1 ref={titleRef} style={{ fontFamily: "'Courier Prime', Courier, monospace" }} className="text-white leading-[0.95] tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold">
            {words.map((w, i) => (
              <span key={i} className="inline-block overflow-hidden mr-2 align-top">
                <span className="reveal-word inline-block will-change-transform">{w}</span>
              </span>
            ))}
          </h1>
          <p ref={subtitleRef} className="mt-6 max-w-2xl text-base md:text-lg text-white/80">
            Production agency for ambitious brands. Film-grade craft, real-time 3D, and interactive stories.
          </p>
        </div>
      </div>

      {/* Floating accent shapes for subtle parallax/floating */}
      <div ref={overlayRef} className="absolute inset-0 z-10 pointer-events-none">
        <div className="floaty absolute top-[20%] left-[8%] w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500/80 shadow-[0_0_30px_6px_rgba(239,68,68,0.35)]" />
        <div className="floaty absolute bottom-[18%] right-[12%] w-24 h-24 border border-white/10 rounded-full" />
        <div className="floaty absolute top-[35%] right-[30%] w-16 h-10 rotate-12 border-t border-red-500/40" />
      </div>
    </section>
  )
}
