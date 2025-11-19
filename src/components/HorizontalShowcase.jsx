import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Hover3DCard from './Hover3DCard'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Helper to set up horizontal scrolling pinned section
export default function HorizontalShowcase() {
  const containerRef = useRef(null)
  const trackRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current
      const track = trackRef.current
      if (!container || !track) return

      // Match media to disable on small screens
      ScrollTrigger.matchMedia({
        // Desktop only
        '(min-width: 768px)': function () {
          const totalWidth = track.scrollWidth
          const pinDistance = totalWidth - container.offsetWidth

          const tl = gsap.timeline({
            defaults: { ease: 'none' }
          })

          tl.to(track, {
            x: -pinDistance,
            duration: 1
          })

          ScrollTrigger.create({
            trigger: container,
            start: 'top top',
            end: `+=${pinDistance}`,
            pin: true,
            scrub: 1.2,
            animation: tl,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // velocity-based skew effect
              const velocity = self.getVelocity()
              const skew = gsap.utils.clamp(-8, 8, velocity / 300)
              gsap.to(track.querySelectorAll('.skewable'), { skewY: skew, transformOrigin: 'center', duration: 0.2 })
            },
          })

          // Parallax layers
          const parallaxItems = track.querySelectorAll('[data-parallax]')
          parallaxItems.forEach((el) => {
            const strength = parseFloat(el.getAttribute('data-parallax')) || 0.2
            gsap.to(el, {
              x: () => -(pinDistance * strength),
              ease: 'none',
              scrollTrigger: {
                trigger: container,
                start: 'top top',
                end: `+=${pinDistance}`,
                scrub: true,
              }
            })
          })

          // Fade and slide-in for slides
          gsap.utils.toArray('.h-slide').forEach((el, i) => {
            gsap.from(el, {
              opacity: 0,
              xPercent: 10,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                containerAnimation: tl,
                start: 'left center',
                end: 'left 40%',
                scrub: true,
              }
            })
          })
        },

        // Mobile/tablet: fall back to vertical stack
        '(max-width: 767px)': function () {
          // basic reveals
          gsap.utils.toArray('.h-slide').forEach((el) => {
            gsap.from(el, {
              opacity: 0,
              y: 30,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: 'top 80%'
              }
            })
          })
        }
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section id="works" ref={containerRef} className="relative w-full bg-black text-white">
      <div ref={trackRef} className="horizontal-wrapper flex will-change-transform">
        {/* Slide 1 */}
        <article className="h-slide shrink-0 w-[100vw] md:w-[70vw] xl:w-[60vw] h-[80vh] md:h-[90vh] p-8 md:p-12 flex items-end bg-neutral-900 border-r border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 -z-0" data-parallax="0.15">
            <div className="absolute inset-0 bg-gradient-to-tr from-red-600/30 to-transparent" />
          </div>
          <Hover3DCard className="skewable relative z-10 max-w-md">
            <h3 className="text-3xl md:text-5xl font-black tracking-tight">Featured Reel</h3>
            <p className="mt-3 text-white/70">A montage of high-impact commercial pieces, product films, and interactive brand moments.</p>
          </Hover3DCard>
        </article>

        {/* Slide 2 */}
        <article className="h-slide shrink-0 w-[100vw] md:w-[70vw] xl:w-[60vw] h-[80vh] md:h-[90vh] p-8 md:p-12 flex items-end bg-neutral-900 border-r border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 -z-0" data-parallax="0.25">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1629380321590-3b3f75d66dec?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwcG90dGVyeSUyMGhhbmRtYWRlfGVufDB8MHx8fDE3NjM1MTI1ODN8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40" />
          </div>
          <Hover3DCard className="skewable relative z-10 max-w-md">
            <h3 className="text-3xl md:text-5xl font-black tracking-tight">Automotive Vision</h3>
            <p className="mt-3 text-white/70">Dynamic camera moves, glossy surfaces, and precision lighting designed for speed.</p>
          </Hover3DCard>
        </article>

        {/* Slide 3 */}
        <article className="h-slide shrink-0 w-[100vw] md:w-[70vw] xl:w-[60vw] h-[80vh] md:h-[90vh] p-8 md:p-12 flex items-end bg-neutral-900 border-r border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 -z-0" data-parallax="0.18">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1629380321590-3b3f75d66dec?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwcG90dGVyeSUyMGhhbmRtYWRlfGVufDB8MHx8fDE3NjM1MTI1ODN8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40" />
          </div>
          <Hover3DCard className="skewable relative z-10 max-w-md">
            <h3 className="text-3xl md:text-5xl font-black tracking-tight">Product Stories</h3>
            <p className="mt-3 text-white/70">Macro textures and tactile choreography that elevate the physical into the iconic.</p>
          </Hover3DCard>
        </article>

        {/* Slide 4 */}
        <article className="h-slide shrink-0 w-[100vw] md:w-[70vw] xl:w-[60vw] h-[80vh] md:h-[90vh] p-8 md:p-12 flex items-end bg-neutral-900 relative overflow-hidden">
          <div className="absolute inset-0 -z-0" data-parallax="0.12">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1629380321590-3b3f75d66dec?ixid=M3w3OTkxMTl8MHwxfHNlYXJjaHwxfHxjZXJhbWljJTIwcG90dGVyeSUyMGhhbmRtYWRlfGVufDB8MHx8fDE3NjM1MTI1ODN8MA&ixlib=rb-4.1.0&w=1600&auto=format&fit=crop&q=80')] bg-cover bg-center opacity-40" />
          </div>
          <Hover3DCard className="skewable relative z-10 max-w-md">
            <h3 className="text-3xl md:text-5xl font-black tracking-tight">Interactive Worlds</h3>
            <p className="mt-3 text-white/70">Real-time experiences and websites with filmic motion and narrative cadence.</p>
          </Hover3DCard>
        </article>
      </div>
    </section>
  )
}
