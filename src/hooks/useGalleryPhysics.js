import { useEffect } from 'react'
import LocomotiveScroll from 'locomotive-scroll'
import gsap from 'gsap'
import { getDragLimits, INITIAL_CENTER } from '../constants/galleryLayout'

/**
 * Custom Hook: useGalleryPhysics
 *
 * Implements high-performance physics, tactile drag response, and a controlled,
 * luxurious slide after-effect with cushioned friction decay and finish-line bounding.
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

    // High-resolution motion history buffer for calculating release "slide" after-effect
    const motionHistory = []

    const viewport = viewportRef.current
    const canvas = canvasRef.current
    if (!viewport || !canvas) return

    // Position canvas at initial location
    canvas.style.transform = `translate3d(${initialX.toFixed(2)}px, ${initialY.toFixed(2)}px, 0)`

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

      // Tactile elastic resistance if dragging past finish lines
      if ((targetX > limits.maxTargetX && dx > 0) || (targetX < limits.minTargetX && dx < 0)) {
        dx *= 0.3
      }
      if ((targetY > limits.maxTargetY && dy > 0) || (targetY < limits.minTargetY && dy < 0)) {
        dy *= 0.3
      }

      targetX += dx
      targetY += dy

      // Push into motion history buffer (keep last 80ms for responsive fling detection)
      motionHistory.push({ x: e.clientX, y: e.clientY, time: now })
      while (motionHistory.length > 0 && now - motionHistory[0].time > 80) {
        motionHistory.shift()
      }

      lastPointerX = e.clientX
      lastPointerY = e.clientY
    }

    const onPointerUp = () => {
      if (!isPointerDown) return
      isPointerDown = false
      viewport.style.cursor = 'grab'

      const now = performance.now()
      // Filter out points older than 80ms
      while (motionHistory.length > 0 && now - motionHistory[0].time > 80) {
        motionHistory.shift()
      }

      // Calculate controlled slide after-effect momentum
      if (motionHistory.length >= 2) {
        const oldest = motionHistory[0]
        const newest = motionHistory[motionHistory.length - 1]
        const dt = Math.max(16, newest.time - oldest.time)
        const vx = (newest.x - oldest.x) / dt
        const vy = (newest.y - oldest.y) / dt

        // Controlled, luxurious slide after-effect (moderated speed, never shoots wildly)
        const maxFlingSpeed = 13
        velX = Math.max(-maxFlingSpeed, Math.min(maxFlingSpeed, vx * 11.5))
        velY = Math.max(-maxFlingSpeed, Math.min(maxFlingSpeed, vy * 11.5))
      } else {
        velX = 0
        velY = 0
      }
    }

    // Wheel / Trackpad smooth panning with gentle slide
    const onWheel = (e) => {
      e.preventDefault()

      targetX -= e.deltaX * 0.95
      targetY -= e.deltaY * 0.95

      velX = Math.max(-8, Math.min(8, -e.deltaX * 0.14))
      velY = Math.max(-8, Math.min(8, -e.deltaY * 0.14))
    }

    // Prevent default ghost image dragging
    const onDragStart = (e) => {
      e.preventDefault()
    }

    // dynamic viewport resize recalculation
    const onResize = () => {
      limits = getDragLimits()
    }

    // Programmatic smooth glide to target painting (e.g. from search selection)
    const handlePanToPainting = (e) => {
      const painting = e.detail
      if (!painting) return

      const pCenterX = painting.x + (painting.w / 2)
      const pCenterY = painting.y + (painting.h / 2)

      const desiredX = (window.innerWidth / 2) - pCenterX
      const desiredY = (window.innerHeight / 2) - pCenterY

      limits = getDragLimits()
      targetX = Math.max(limits.minTargetX, Math.min(limits.maxTargetX, desiredX))
      targetY = Math.max(limits.minTargetY, Math.min(limits.maxTargetY, desiredY))

      // Clear manual fling velocities so it glides smoothly to the artwork
      velX = 0
      velY = 0
    }

    // Attach interaction listeners
    viewport.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerup', onPointerUp, { passive: true })
    window.addEventListener('pointercancel', onPointerUp, { passive: true })
    viewport.addEventListener('wheel', onWheel, { passive: false })
    viewport.addEventListener('dragstart', onDragStart)
    window.addEventListener('resize', onResize)
    window.addEventListener('panToPainting', handlePanToPainting)

    // GSAP Ticker: 120 FPS Buttery Physics, Controlled Slide After-Effect & Finish-Line Bounding
    const tickerUpdate = () => {
      if (!isPointerDown) {
        // Silky, controlled slide after-effect friction decay
        targetX += velX
        targetY += velY

        velX *= 0.952
        velY *= 0.952

        if (Math.abs(velX) < 0.01) velX = 0
        if (Math.abs(velY) < 0.01) velY = 0

        // Smooth finish-line spring stop (cushions slide momentum cleanly at boundary)
        if (targetX < limits.minTargetX) {
          targetX += (limits.minTargetX - targetX) * 0.14
          velX *= 0.55
        } else if (targetX > limits.maxTargetX) {
          targetX += (limits.maxTargetX - targetX) * 0.14
          velX *= 0.55
        }

        if (targetY < limits.minTargetY) {
          targetY += (limits.minTargetY - targetY) * 0.14
          velY *= 0.55
        } else if (targetY > limits.maxTargetY) {
          targetY += (limits.maxTargetY - targetY) * 0.14
          velY *= 0.55
        }
      }

      // Buttery smooth lerp damping: responsive while dragging, cushioned glide during slide
      const lerpFactor = isPointerDown ? 0.16 : 0.088
      currentX += (targetX - currentX) * lerpFactor
      currentY += (targetY - currentY) * lerpFactor

      // Expose current canvas position for search proximity calculations
      window.__galleryCanvasPos = { x: currentX, y: currentY }

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
      window.removeEventListener('panToPainting', handlePanToPainting)
    }
  }, [viewportRef, canvasRef])
}

export default useGalleryPhysics
