import React, { useEffect } from 'react'
import Hero from './components/Hero'
import HorizontalShowcase from './components/HorizontalShowcase'
import VerticalSections from './components/VerticalSections'
import Footer from './components/Footer'
import Lenis from '@studio-freight/lenis'
import MagneticCursor from './components/MagneticCursor'

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    const id = requestAnimationFrame(raf)

    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div className="bg-black text-white min-h-screen">
      <MagneticCursor />
      <Hero />
      <HorizontalShowcase />
      <VerticalSections />
      <Footer />
    </div>
  )
}

export default App
