import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Hero from './components/Hero'
import HorizontalShowcase from './components/HorizontalShowcase'
import VerticalSections from './components/VerticalSections'
import Footer from './components/Footer'
import Lenis from '@studio-freight/lenis'
import MagneticCursor from './components/MagneticCursor'
import LoadingOverlay from './components/LoadingOverlay'

function App() {
  const [showLoader, setShowLoader] = useState(true)

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
      <LoadingOverlay show={showLoader} onComplete={() => setShowLoader(false)} />

      <AnimatePresence>
        {!showLoader && (
          <motion.div
            key="site"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } }}
          >
            <MagneticCursor />
            <Hero />
            <HorizontalShowcase />
            <VerticalSections />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
