import React, { useEffect, useRef, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedText from './AnimatedText'
import ScrollHandCue from './ScrollHandCue'

// Register GSAP plugin
if (typeof window !== 'undefined' && gsap.core?.globals()?.ScrollTrigger !== ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Hero() {
  const subtitleRef = useRef(null)
  const overlayRef = useRef(null)

  const onScrollCue = useCallback(() => {
    const next = document.querySelector('#works')
    if (!next) return
    next.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  useEffect(() => {
    const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (subtitleRef.current && !reduce) {
        gsap.from(subtitleRef.current, { y: 20, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.2 })
      }

      if (!reduce) {
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

        // Slight fade to hint transition to next sections
        gsap.to('#hero', {
          opacity: 0.96,
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section id="hero" className="relative h-[100dvh] w-full bg-black text-white overflow-hidden">
      {/* Cinematic background video: replace sources with your reels */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1920&auto=format&fit=crop"
        >
          <source src="https://cdn.coverr.co/videos/coverr-city-drive-6310/1080p.mp4" type="video/mp4" />
          <source src="https://cdn.coverr.co/videos/coverr-silhouette-of-man-looking-at-sunrise-6521/1080p.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Vignette + color grading overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,0,0,0.12),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.15)_0%,rgba(0,0,0,0.35)_60%,rgba(0,0,0,0.85)_100%)]" />

      {/* Copy */}
      <div className="relative z-10 h-full w-full flex items-center">
        <div className="container mx-auto px-6 md:px-10">
          <AnimatedText
            as="h1"
            text="Cinematic photography. Built for the web."
            split="letters"
            className="leading-[0.95] tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold"
            style={{ fontFamily: "'Courier Prime', Courier, monospace" }}
          />
          <p ref={subtitleRef} className="mt-6 max-w-2xl text-base md:text-lg text-white/85">
            High-end imagery and interactive craft. We direct, shoot, and design digital experiences with filmic motion.
          </p>
        </div>
      </div>

      {/* Floating accent shapes for depth */}
      <div ref={overlayRef} className="absolute inset-0 z-10 pointer-events-none">
        <div className="floaty absolute top-[20%] left-[8%] w-2 h-2 md:w-3 md:h-3 rounded-full bg-red-500/80 shadow-[0_0_30px_6px_rgba(239,68,68,0.35)]" />
        <div className="floaty absolute bottom-[18%] right-[12%] w-24 h-24 border border-white/10 rounded-full" />
        <div className="floaty absolute top-[35%] right-[30%] w-16 h-10 rotate-12 border-t border-red-500/40" />
      </div>

      {/* Palm-hand scroll cue */}
      <ScrollHandCue onClick={onScrollCue} className="text-white" color="#ffffff" />
    </section>
  )
}
