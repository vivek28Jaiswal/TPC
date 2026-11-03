import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './PaintingCursorBadge.css'

// Fixed cursor-to-button offset matching reference image
const OFFSET_X = 32
const OFFSET_Y = 32
const LERP_FACTOR = 0.16

/**
 * PaintingCursorBadge Component
 *
 * Renders a sleek matte black pill badge inside each painting's container.
 * The outer container strictly handles smooth translate3d lerp positioning,
 * while the inner pill cleanly handles opacity/scale visibility transitions,
 * completely preventing any transform collisions, jumps, or hover-out blinks.
 *
 * @param {Object} props
 * @param {string} props.title - Painting artwork title
 * @param {import('react').RefObject} props.containerRef - Ref to the painting element
 */
export function PaintingCursorBadge({ title, containerRef }) {
  const badgeRef = useRef(null)
  const pillRef = useRef(null)
  const isHoveredRef = useRef(false)
  const currentPos = useRef({ x: 0, y: 0 })
  const targetPos = useRef({ x: 0, y: 0 })
  const rafId = useRef(null)

  useEffect(() => {
    const container = containerRef?.current
    const badge = badgeRef.current
    const pill = pillRef.current
    if (!container || !badge || !pill) return

    const animate = () => {
      // Smooth cursor interpolation (lerp)
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * LERP_FACTOR
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * LERP_FACTOR

      badge.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0)`

      if (isHoveredRef.current) {
        rafId.current = requestAnimationFrame(animate)
      } else {
        // Continue lerping during fade-out until motion settles
        const dx = Math.abs(targetPos.current.x - currentPos.current.x)
        const dy = Math.abs(targetPos.current.y - currentPos.current.y)
        if (dx > 0.5 || dy > 0.5) {
          rafId.current = requestAnimationFrame(animate)
        } else {
          rafId.current = null
        }
      }
    }

    const startAnimation = () => {
      if (!rafId.current) {
        rafId.current = requestAnimationFrame(animate)
      }
    }

    const stopAnimation = () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
        rafId.current = null
      }
    }

    const onPointerEnter = (e) => {
      if (e.pointerType === 'touch' || e.buttons > 0) return

      isHoveredRef.current = true

      const rect = container.getBoundingClientRect()
      const initX = e.clientX - rect.left + OFFSET_X
      const initY = e.clientY - rect.top + OFFSET_Y

      currentPos.current.x = initX
      currentPos.current.y = initY
      targetPos.current.x = initX
      targetPos.current.y = initY

      badge.style.transform = `translate3d(${initX}px, ${initY}px, 0)`
      badge.style.visibility = 'visible'

      // Smooth reveal on the inner pill (never collides with translate3d)
      gsap.killTweensOf(pill)
      gsap.fromTo(
        pill,
        { scale: 0.88, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.22,
          ease: 'power2.out',
          overwrite: 'auto',
        }
      )

      startAnimation()
    }

    const onPointerMove = (e) => {
      if (e.pointerType === 'touch') return
      if (e.buttons > 0) {
        if (isHoveredRef.current) {
          onPointerLeave()
        }
        return
      }

      // If not yet hovered, do not process move events
      if (!isHoveredRef.current) return

      const rect = container.getBoundingClientRect()
      targetPos.current.x = e.clientX - rect.left + OFFSET_X
      targetPos.current.y = e.clientY - rect.top + OFFSET_Y
    }

    const onPointerLeave = () => {
      if (!isHoveredRef.current) return
      isHoveredRef.current = false

      // Smooth exit fade on the inner pill
      gsap.killTweensOf(pill)
      gsap.to(pill, {
        opacity: 0,
        scale: 0.88,
        duration: 0.18,
        ease: 'power2.inOut',
        overwrite: 'auto',
        onComplete: () => {
          if (!isHoveredRef.current) {
            badge.style.visibility = 'hidden'
            stopAnimation()
          }
        },
      })
    }

    const onPointerDown = (e) => {
      if (e.pointerType === 'touch') return
      if (isHoveredRef.current) {
        onPointerLeave()
      }
    }

    container.addEventListener('pointerenter', onPointerEnter)
    container.addEventListener('pointermove', onPointerMove, { passive: true })
    container.addEventListener('pointerleave', onPointerLeave)
    container.addEventListener('pointerdown', onPointerDown)

    return () => {
      container.removeEventListener('pointerenter', onPointerEnter)
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('pointerleave', onPointerLeave)
      container.removeEventListener('pointerdown', onPointerDown)
      stopAnimation()
      gsap.killTweensOf(pill)
    }
  }, [containerRef])

  return (
    <div ref={badgeRef} className="painting-cursor-badge" aria-hidden="true">
      <div ref={pillRef} className="badge-pill">
        <span className="badge-plus">+</span>
        <span className="badge-title">{title}</span>
      </div>
    </div>
  )
}

export default PaintingCursorBadge
