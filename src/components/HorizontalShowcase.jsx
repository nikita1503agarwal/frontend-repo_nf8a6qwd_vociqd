import React, { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Hover3DCard from './Hover3DCard'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Helper to set up horizontal scrolling pinned section with cinematic video slides
export default function HorizontalShowcase() {
  const containerRef = useRef(null)
  const trackRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const container = containerRef.current
      const track = trackRef.current
      if (!container || !track) return

      ScrollTrigger.matchMedia({
        '(min-width: 768px)': function () {
          const refresh = () => {
            const totalWidth = track.scrollWidth
            const pinDistance = Math.max(0, totalWidth - container.offsetWidth)

            const tl = gsap.timeline({ defaults: { ease: 'none' } })
            tl.to(track, { x: -pinDistance, duration: 1 })

            // main pin
            const st = ScrollTrigger.create({
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

            // Parallax layers per slide
            const parallaxItems = track.querySelectorAll('[data-parallax]')
            parallaxItems.forEach((el) => {
              const strength = parseFloat(el.getAttribute('data-parallax')) || 0.2
              gsap.to(el, {
                x: () => -(pinDistance * strength),
                ease: 'none',
                scrollTrigger: { trigger: container, start: 'top top', end: `+=${pinDistance}`, scrub: true }
              })
            })

            // Slide reveals using containerAnimation
            gsap.utils.toArray('.h-slide').forEach((el) => {
              gsap.from(el, {
                opacity: 0,
                xPercent: 10,
                rotateY: -3,
                scale: 0.98,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: { trigger: el, containerAnimation: tl, start: 'left 80%', end: 'left 40%', scrub: true }
              })
            })

            return () => {
              st.kill()
              tl.kill()
              ScrollTrigger.getAll().forEach((t) => t.vars.trigger === container && t.kill())
            }
          }

          const cleanup = refresh()
          // recalc on refresh
          ScrollTrigger.addEventListener('refreshInit', () => {
            gsap.set(track, { clearProps: 'transform' })
          })

          return () => {
            cleanup && cleanup()
          }
        },

        '(max-width: 767px)': function () {
          // vertical fall-back
          gsap.utils.toArray('.h-slide').forEach((el) => {
            gsap.from(el, {
              opacity: 0,
              y: 30,
              duration: 0.8,
              ease: 'power2.out',
              scrollTrigger: { trigger: el, start: 'top 85%' }
            })
          })
        }
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section id="works" ref={containerRef} className="relative w-full bg-black text-white">
      {/* Perspective wrapper for subtle 3D depth */}
      <div className="[perspective:1000px]">
        <div ref={trackRef} className="horizontal-wrapper flex will-change-transform [transform-style:preserve-3d]">
          {/* Slide 1: Featured Reel */}
          <article className="h-slide shrink-0 w-[100vw] md:w-[80vw] xl:w-[70vw] h-[80vh] md:h-[90vh] p-8 md:p-12 flex items-end border-r border-white/10 relative overflow-hidden">
            {/* Background video (replace with your high-end reel) */}
            <div className="absolute inset-0 -z-10" data-parallax="0.12">
              <video className="w-full h-full object-cover" autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1920&auto=format&fit=crop">
                <source src="https://cdn.coverr.co/videos/coverr-urban-night-drive-4130/1080p.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-black/35" />
            </div>
            <Hover3DCard className="skewable relative z-10 max-w-lg" data-magnetic>
              <h3 className="text-3xl md:text-5xl font-black tracking-tight">Featured Reel</h3>
              <p className="mt-3 text-white/80 max-w-md">High-impact commercial pieces, product films, and interactive brand moments.</p>
            </Hover3DCard>
          </article>

          {/* Slide 2: Automotive Vision */}
          <article className="h-slide shrink-0 w-[100vw] md:w-[80vw] xl:w-[70vw] h-[80vh] md:h-[90vh] p-8 md:p-12 flex items-end border-r border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 -z-10" data-parallax="0.2">
              <video className="w-full h-full object-cover" autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1920&auto=format&fit=crop">
                <source src="https://cdn.coverr.co/videos/coverr-night-highway-traffic-lights-1412/1080p.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-tr from-red-600/25 to-black/30" />
            </div>
            <Hover3DCard className="skewable relative z-10 max-w-lg" data-magnetic>
              <h3 className="text-3xl md:text-5xl font-black tracking-tight">Automotive Vision</h3>
              <p className="mt-3 text-white/80 max-w-md">Dynamic camera moves, glossy surfaces, and precision lighting designed for speed.</p>
            </Hover3DCard>
          </article>

          {/* Slide 3: Product Stories */}
          <article className="h-slide shrink-0 w-[100vw] md:w-[80vw] xl:w-[70vw] h-[80vh] md:h-[90vh] p-8 md:p-12 flex items-end border-r border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 -z-10" data-parallax="0.16">
              <video className="w-full h-full object-cover" autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1920&auto=format&fit=crop">
                <source src="https://cdn.coverr.co/videos/coverr-city-b-roll-4955/1080p.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-black/35" />
            </div>
            <Hover3DCard className="skewable relative z-10 max-w-lg" data-magnetic>
              <h3 className="text-3xl md:text-5xl font-black tracking-tight">Product Stories</h3>
              <p className="mt-3 text-white/80 max-w-md">Macro textures and tactile choreography that elevate the physical into the iconic.</p>
            </Hover3DCard>
          </article>

          {/* Slide 4: Interactive Worlds */}
          <article className="h-slide shrink-0 w-[100vw] md:w-[80vw] xl:w-[70vw] h-[80vh] md:h-[90vh] p-8 md:p-12 flex items-end relative overflow-hidden">
            <div className="absolute inset-0 -z-10" data-parallax="0.1">
              <video className="w-full h-full object-cover" autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1549887534-1541e9323b5d?q=80&w=1920&auto=format&fit=crop">
                <source src="https://cdn.coverr.co/videos/coverr-colorful-neon-waves-2737/1080p.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <Hover3DCard className="skewable relative z-10 max-w-lg" data-magnetic>
              <h3 className="text-3xl md:text-5xl font-black tracking-tight">Interactive Worlds</h3>
              <p className="mt-3 text-white/80 max-w-md">Real-time experiences and websites with filmic motion and narrative cadence.</p>
            </Hover3DCard>
          </article>
        </div>
      </div>
    </section>
  )
}
