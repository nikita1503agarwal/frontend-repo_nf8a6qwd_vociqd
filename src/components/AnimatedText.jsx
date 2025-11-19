import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

export default function AnimatedText({ text, as: Tag = 'h1', className = '', split = 'letters', triggerOnScroll = false, delay = 0, ...rest }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const el = containerRef.current
      if (!el) return

      // Split text
      const content = text || ''
      const parts = split === 'words' ? content.split(' ') : content.split('')
      el.innerHTML = parts
        .map((p) => {
          const display = split === 'words' ? p : (p === ' ' ? '&nbsp;' : p)
          return `<span class='inline-block overflow-hidden align-top'><span class='inner inline-block will-change-transform'>${display}</span></span>`
        })
        .join(split === 'words' ? ' ' : '')

      const inners = el.querySelectorAll('.inner')

      const animate = () => {
        gsap.fromTo(
          inners,
          { yPercent: 120, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.04,
            delay
          }
        )
      }

      if (reduce) {
        gsap.set(inners, { yPercent: 0, opacity: 1 })
        return
      }

      if (triggerOnScroll) {
        gsap.set(inners, { yPercent: 120, opacity: 0 })
        ScrollTrigger.create({
          trigger: el,
          start: 'top 80%',
          onEnter: animate,
          once: true,
        })
      } else {
        animate()
      }
    })

    return () => ctx.revert()
  }, [text, split, triggerOnScroll, delay])

  return <Tag ref={containerRef} className={className} {...rest} />
}
