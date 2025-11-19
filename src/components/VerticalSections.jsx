import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger)

export default function VerticalSections() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const blocks = ref.current?.querySelectorAll('[data-reveal]') || []
      blocks.forEach((el, i) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%'
          }
        })
      })

      const lines = ref.current?.querySelectorAll('.reveal-line') || []
      lines.forEach((line) => {
        const words = line.textContent.split(' ')
        line.innerHTML = words.map(w => `<span class='inline-block overflow-hidden mr-2 align-top'><span class='inner inline-block translate-y-full opacity-0'>${w}</span></span>`).join(' ')
        const inners = line.querySelectorAll('.inner')
        gsap.to(inners, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.05,
          scrollTrigger: {
            trigger: line,
            start: 'top 85%'
          }
        })
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="bg-black text-white py-24 md:py-40">
      <div className="container mx-auto px-6 md:px-10 max-w-6xl">
        <h2 className="reveal-line text-3xl md:text-5xl font-black tracking-tight">We design for attention and memory.</h2>
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 mt-12 md:mt-20">
          <div data-reveal>
            <p className="text-white/80 leading-relaxed">From the first frame to the last interaction, we craft rhythm. Our team blends film craft, brand systems, and interactive design to create products and stories that resonate.</p>
          </div>
          <div data-reveal>
            <p className="text-white/80 leading-relaxed">We collaborate with agencies and in-house teams to produce launch films, product visualizations, and high-performance web experiences.</p>
          </div>
        </div>

        <div className="mt-16 md:mt-24 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {["Strategy","Direction","CGI","Interactive"].map((label,i)=> (
            <div key={i} data-reveal className="bg-neutral-900/60 border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold">{label}</h3>
              <p className="text-sm text-white/60 mt-2">Replace with your offering bullets, services, or capabilities.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
