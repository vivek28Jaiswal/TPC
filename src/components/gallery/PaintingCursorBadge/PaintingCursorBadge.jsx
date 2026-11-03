import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './PaintingCursorBadge.css'

/**
 * PaintingCursorBadge Component
 *
 * Smoothly reveals and dissolves a sleek black pill badge beside the cursor
 * when hovering over paintings in the gallery wall, with luxurious easing
 * and zero abrupt snapping.
 */
export function PaintingCursorBadge() {
  const badgeRef = useRef(null)
  const textRef = useRef(null)
  const [title, setTitle] = useState('')
  const currentPaintingIdRef = useRef(null)
  const isPointerDownRef = useRef(false)
  const isVisibleRef = useRef(false)

  useEffect(() => {
    const badge = badgeRef.current
    const textEl = textRef.current
    if (!badge) return

    // QuickTo position setters for smooth, cushioned follower movement
    const xTo = gsap.quickTo(badge, 'x', { duration: 0.28, ease: 'power3.out' })
    const yTo = gsap.quickTo(badge, 'y', { duration: 0.28, ease: 'power3.out' })

    const showBadge = (targetX, targetY) => {
      isVisibleRef.current = true

      // Pre-position badge right at cursor location to eliminate any off-screen flying jerk
      gsap.set(badge, {
        x: targetX,
        y: targetY + 8,
        scale: 0.88,
        opacity: 0,
        visibility: 'visible',
      })

      // Gentle, luxurious reveal: floating softly into place
      gsap.to(badge, {
        y: targetY,
        scale: 1,
        opacity: 1,
        duration: 0.38,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }

    const hideBadge = () => {
      if (!isVisibleRef.current) return
      isVisibleRef.current = false

      // Soft, gentle exit fade and slight downward drift
      gsap.to(badge, {
        opacity: 0,
        scale: 0.88,
        y: '+=6',
        duration: 0.32,
        ease: 'power2.inOut',
        overwrite: 'auto',
        onComplete: () => {
          if (!isVisibleRef.current) {
            gsap.set(badge, { visibility: 'hidden' })
          }
        },
      })
    }

    const onPointerMove = (e) => {
      // While dragging canvas, keep badge hidden
      if (isPointerDownRef.current) {
        hideBadge()
        return
      }

      // Check if cursor is over any painting
      const target = e.target
      const paintingEl = target ? target.closest('.painting-item') : null

      if (paintingEl) {
        const itemTitle = paintingEl.getAttribute('data-painting-title') || 'Artwork'
        const itemId = paintingEl.getAttribute('data-painting-id')

        // Compute cursor offset coordinates
        let targetX = e.clientX + 16
        let targetY = e.clientY + 16

        // Prevent overflow at right or bottom edges
        if (targetX + 180 > window.innerWidth) {
          targetX = e.clientX - 170
        }
        if (targetY + 45 > window.innerHeight) {
          targetY = e.clientY - 45
        }

        // If newly entering from empty space: smooth reveal
        if (!isVisibleRef.current) {
          currentPaintingIdRef.current = itemId
          setTitle(itemTitle)
          showBadge(targetX, targetY)
        } else if (currentPaintingIdRef.current !== itemId) {
          // If moving directly between paintings: smooth text crossfade without badge re-pop
          currentPaintingIdRef.current = itemId
          setTitle(itemTitle)
          if (textEl) {
            gsap.fromTo(
              textEl,
              { opacity: 0, y: 3 },
              { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' }
            )
          }
        }

        // Smoothly guide badge to mouse coordinates
        xTo(targetX)
        yTo(targetY)
      } else {
        if (isVisibleRef.current) {
          currentPaintingIdRef.current = null
          hideBadge()
        }
      }
    }

    const onPointerDown = () => {
      isPointerDownRef.current = true
      currentPaintingIdRef.current = null
      if (isVisibleRef.current) {
        isVisibleRef.current = false
        gsap.to(badge, {
          opacity: 0,
          scale: 0.85,
          duration: 0.18,
          ease: 'power2.in',
          overwrite: 'auto',
          onComplete: () => {
            gsap.set(badge, { visibility: 'hidden' })
          },
        })
      }
    }

    const onPointerUp = () => {
      isPointerDownRef.current = false
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('pointerup', onPointerUp, { passive: true })

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointerup', onPointerUp)
      gsap.killTweensOf(badge)
    }
  }, [])

  return (
    <div ref={badgeRef} className="painting-cursor-badge" aria-hidden="true">
      <div className="badge-pill">
        <span className="badge-plus">+</span>
        <span ref={textRef} className="badge-title">{title}</span>
      </div>
    </div>
  )
}

export default PaintingCursorBadge
