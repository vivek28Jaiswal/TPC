import { useEffect } from 'react'
import LocomotiveScroll from 'locomotive-scroll'
import gsap from 'gsap'
import { getDragLimits, INITIAL_CENTER } from '../constants/galleryLayout'

/**
 * Custom Hook: useGalleryPhysics
 *
 * Implements high-performance physics, momentum slipping, drag interaction,
 * wheel/trackpad 2D panning, and boundary spring damping with the GSAP ticker.
 *
 * @param {Object} params
 * @param {import('react').RefObject} params.viewportRef - Reference to the viewport container element
 * @param {import('react').RefObject} params.canvasRef - Reference to the movable canvas wall element
 */
export function useGalleryPhysics({ viewportRef, canvasRef }) {
  useEffect(() => {
    // 1. Initialize Locomotive Scroll
    const locomotiveScroll = new LocomotiveScroll()

    let limits = getDragLimits()

    // 2. Position canvas centered on the Grand Hero Pavilion (Tier 3 Center) on initial load
    let initialX = window.innerWidth / 2 - INITIAL_CENTER.x
    let initialY = window.innerHeight / 2 - INITIAL_CENTER.y

    // Clamp initial position within finish-line limits
    initialX = Math.max(limits.minTargetX, Math.min(limits.maxTargetX, initialX))
    initialY = Math.max(limits.minTargetY, Math.min(limits.maxTargetY, initialY))

    let targetX = initialX
    let targetY = initialY
    let currentX = initialX
    let currentY = initialY
    let velX = 0
    let velY = 0

    let isPointerDown = false
    let lastPointerX = 0
    let lastPointerY = 0

    // High-resolution motion history buffer for calculating release "slip" inertia
    const motionHistory = []

    const viewport = viewportRef.current
    const canvas = canvasRef.current
    if (!viewport || !canvas) return

    // Pointer Drag Handlers
    const onPointerDown = (e) => {
      // Do not hijack clicks on navigation buttons or menu dropdown
      if (
        e.target.closest('.header-nav') ||
        e.target.closest('button') ||
        e.target.closest('.menu-dropdown')
      ) {
        return
      }

      isPointerDown = true
      lastPointerX = e.clientX
      lastPointerY = e.clientY
      velX = 0
      velY = 0

      // Reset motion history with initial point
      motionHistory.length = 0
      motionHistory.push({ x: e.clientX, y: e.clientY, time: performance.now() })

      viewport.style.cursor = 'grabbing'
    }

    const onPointerMove = (e) => {
      if (!isPointerDown) return

      const now = performance.now()
      let dx = e.clientX - lastPointerX
      let dy = e.clientY - lastPointerY

      // Tactile elastic resistance if pulling past the finish lines
      if ((targetX > limits.maxTargetX && dx > 0) || (targetX < limits.minTargetX && dx < 0)) {
        dx *= 0.3
      }
      if ((targetY > limits.maxTargetY && dy > 0) || (targetY < limits.minTargetY && dy < 0)) {
        dy *= 0.3
      }

      targetX += dx
      targetY += dy

      // Push into motion history buffer (keep last 120ms of events)
      motionHistory.push({ x: e.clientX, y: e.clientY, time: now })
      while (motionHistory.length > 0 && now - motionHistory[0].time > 120) {
        motionHistory.shift()
      }

      lastPointerX = e.clientX
      lastPointerY = e.clientY
    }

    const onPointerUp = () => {
      if (!isPointerDown) return
      isPointerDown = false
      viewport.style.cursor = 'grab'

      // Calculate the luxurious "slidly slip" momentum after-effect
      const now = performance.now()
      // Filter out points older than 100ms
      while (motionHistory.length > 0 && now - motionHistory[0].time > 100) {
        motionHistory.shift()
      }

      if (motionHistory.length >= 2) {
        const oldest = motionHistory[0]
        const newest = motionHistory[motionHistory.length - 1]
        const dt = Math.max(16, newest.time - oldest.time)
        const vx = (newest.x - oldest.x) / dt
        const vy = (newest.y - oldest.y) / dt

        // Kinetic fling boost creating that buttery slip slide
        velX = vx * 22
        velY = vy * 22
      }
    }

    // Wheel / Trackpad smooth panning with silky slip
    const onWheel = (e) => {
      e.preventDefault()

      targetX -= e.deltaX * 1.15
      targetY -= e.deltaY * 1.15

      velX = -e.deltaX * 0.28
      velY = -e.deltaY * 0.28
    }

    // Prevent default ghost image dragging
    const onDragStart = (e) => {
      e.preventDefault()
    }

    // Dynamic viewport resize recalculation
    const onResize = () => {
      limits = getDragLimits()
    }

    // Attach interaction listeners
    viewport.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerup', onPointerUp, { passive: true })
    window.addEventListener('pointercancel', onPointerUp, { passive: true })
    viewport.addEventListener('wheel', onWheel, { passive: false })
    viewport.addEventListener('dragstart', onDragStart)
    window.addEventListener('resize', onResize)

    // GSAP Ticker: 120 FPS Buttery Physics, Momentum Slip & Finish-Line Bounded Spring Stop
    const tickerUpdate = () => {
      if (!isPointerDown) {
        // Silky momentum slip friction decay
        targetX += velX
        targetY += velY

        velX *= 0.945
        velY *= 0.945

        if (Math.abs(velX) < 0.005) velX = 0
        if (Math.abs(velY) < 0.005) velY = 0

        // Smooth finish-line spring stop (cushions momentum and halts cleanly at boundary)
        if (targetX < limits.minTargetX) {
          targetX += (limits.minTargetX - targetX) * 0.16
          velX *= 0.6
        } else if (targetX > limits.maxTargetX) {
          targetX += (limits.maxTargetX - targetX) * 0.16
          velX *= 0.6
        }

        if (targetY < limits.minTargetY) {
          targetY += (limits.minTargetY - targetY) * 0.16
          velY *= 0.6
        } else if (targetY > limits.maxTargetY) {
          targetY += (limits.maxTargetY - targetY) * 0.16
          velY *= 0.6
        }
      }

      // Buttery smooth lerp damping
      currentX += (targetX - currentX) * 0.092
      currentY += (targetY - currentY) * 0.092

      canvas.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`
    }

    gsap.ticker.add(tickerUpdate)

    // Cleanup on unmount
    return () => {
      locomotiveScroll.destroy()
      gsap.ticker.remove(tickerUpdate)
      viewport.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      viewport.removeEventListener('wheel', onWheel)
      viewport.removeEventListener('dragstart', onDragStart)
      window.removeEventListener('resize', onResize)
    }
  }, [viewportRef, canvasRef])
}

export default useGalleryPhysics

