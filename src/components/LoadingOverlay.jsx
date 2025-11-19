import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    onChange()
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])
  return reduced
}

const letters = Array.from('Loading')

const ParticleBackground = ({ active }) => {
  const canvasRef = useRef(null)
  const rafRef = useRef(0)
  const particlesRef = useRef([])
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const handleResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const count = reduced ? 20 : 80
    particlesRef.current = new Array(count).fill(0).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      life: Math.random() * 200 + 100,
      age: 0,
      size: Math.random() * 1.2 + 0.4,
      alpha: Math.random() * 0.35 + 0.15,
    }))

    const step = () => {
      if (!active) return
      ctx.clearRect(0, 0, w, h)
      ctx.save()
      // subtle vignette backdrop
      const grad = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.2, w / 2, h / 2, Math.max(w, h) * 0.8)
      grad.addColorStop(0, 'rgba(0,0,0,0)')
      grad.addColorStop(1, 'rgba(0,0,0,0.6)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      ctx.globalCompositeOperation = 'lighter'
      particlesRef.current.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        p.age += 1
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        if (p.age > p.life) {
          p.x = Math.random() * w
          p.y = Math.random() * h
          p.age = 0
        }
        ctx.beginPath()
        ctx.strokeStyle = `rgba(255,255,255,${p.alpha})`
        ctx.lineWidth = p.size
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x - p.vx * 8, p.y - p.vy * 8)
        ctx.stroke()
      })
      ctx.restore()
      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [active, reduced])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

const LoadingOverlay = ({ show, onComplete = () => {} }) => {
  const [internalShow, setInternalShow] = useState(show)
  const completedRef = useRef(false)
  const reduced = usePrefersReducedMotion()

  // finish when window finishes loading or after 3.5s (whichever first)
  useEffect(() => {
    if (!internalShow) return

    const done = () => {
      if (completedRef.current) return
      completedRef.current = true
      // slight delay to let fade-out play
      setTimeout(() => setInternalShow(false), 200)
    }

    const onLoad = () => done()
    window.addEventListener('load', onLoad, { once: true })
    const t = setTimeout(done, 3500)
    return () => {
      clearTimeout(t)
      window.removeEventListener('load', onLoad)
    }
  }, [internalShow])

  // notify parent when fully unmounted from AnimatePresence
  const handleExitComplete = () => {
    if (completedRef.current) onComplete()
  }

  const containerVariants = {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } },
  }

  const skew = useMemo(() => (reduced ? 0 : -4), [reduced])

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {internalShow && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black text-white"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={containerVariants}
          style={{ perspective: 800 }}
        >
          <ParticleBackground active={internalShow} />

          <motion.div
            className="relative flex flex-col items-center select-none"
            initial={{ opacity: 0, y: 10, rotateX: reduced ? 0 : 12 }}
            animate={{ opacity: 1, y: 0, rotateX: reduced ? 0 : 0, transition: { duration: 0.8, ease: 'easeOut' } }}
          >
            <motion.div
              className="mb-4 h-px w-24 bg-white/20"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1, transition: { duration: 0.8, ease: 'easeOut' } }}
            />
            <div className="flex space-x-1 text-4xl md:text-6xl font-semibold tracking-[0.2em]" style={{ transform: `skewY(${skew}deg)` }}>
              {letters.map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ y: 20, opacity: 0, scale: 0.9 }}
                  animate={{
                    y: [20, 0, -2, 0],
                    opacity: [0, 1, 1, 1],
                    scale: [0.9, 1, 1.02, 1],
                    transition: {
                      delay: i * 0.06,
                      duration: 1.4,
                      ease: [0.22, 1, 0.36, 1],
                      repeat: reduced ? 0 : Infinity,
                      repeatDelay: 0.8,
                      repeatType: 'mirror',
                    },
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
            <motion.div
              className="mt-6 text-xs uppercase tracking-[0.3em] text-white/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.6, duration: 0.8 } }}
            >
              Preparing experience
            </motion.div>
          </motion.div>

          {/* subtle grain overlay */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'120\' viewBox=\'0 0 120 120\'><filter id=\'n\'><feTurbulence baseFrequency=\'0.8\' numOctaves=\'2\' /></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\' opacity=\'0.6\'/></svg>")', backgroundSize: '120px 120px' }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoadingOverlay
