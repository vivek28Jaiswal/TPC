import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { PaintingCursorBadge } from './PaintingCursorBadge'
import './PaintingItem.css'

/**
 * Individual framed painting figure positioned absolutely on the gallery canvas.
 * Executes a gentle, authentic hanging museum art micro-shake on cursor hover,
 * responds to search selection highlighting, and hosts its dedicated cursor-following title pill button.
 *
 * @param {Object} props
 * @param {Object} props.painting - Painting data model (id, title, image, x, y, w, h)
 */
export function PaintingItem({ painting }) {
  const figureRef = useRef(null)
  const imageRef = useRef(null)

  // Listen for search-selection events: smooth canvas arrives and shakes the framed art
  useEffect(() => {
    let shakeTimer = null

    const handleHighlight = (e) => {
      if (e.detail?.id === painting.id && imageRef.current) {
        const imgEl = imageRef.current

        // Wait ~450ms for the canvas glide pan to center the artwork, then playfully shake
        shakeTimer = setTimeout(() => {
          gsap.killTweensOf(imgEl)
          gsap.fromTo(
            imgEl,
            { x: 0, rotation: 0 },
            {
              keyframes: [
                { x: -6, rotation: -2.2, duration: 0.08, ease: 'power1.inOut' },
                { x: 6, rotation: 2.2, duration: 0.08, ease: 'power1.inOut' },
                { x: -4, rotation: -1.5, duration: 0.08, ease: 'power1.inOut' },
                { x: 4, rotation: 1.5, duration: 0.08, ease: 'power1.inOut' },
                { x: -2, rotation: -0.7, duration: 0.08, ease: 'power1.inOut' },
                { x: 0, rotation: 0, duration: 0.2, ease: 'power2.out' },
              ],
              ease: 'power2.out',
            }
          )
        }, 450)
      }
    }

    window.addEventListener('highlightPainting', handleHighlight)
    return () => {
      window.removeEventListener('highlightPainting', handleHighlight)
      if (shakeTimer) clearTimeout(shakeTimer)
    }
  }, [painting.id])

  const handlePointerEnter = (e) => {
    // Ignore while dragging (when mouse button is pressed down)
    if (e.buttons > 0) return
    const imgEl = imageRef.current
    if (!imgEl) return

    gsap.killTweensOf(imgEl)

    // Gentle, authentic hanging art frame micro-shake on image only (badge does not shake)
    gsap.fromTo(
      imgEl,
      { x: 0, rotation: 0 },
      {
        keyframes: [
          { x: -3.5, rotation: -1.2, duration: 0.08, ease: 'power1.inOut' },
          { x: 3.5, rotation: 1.2, duration: 0.08, ease: 'power1.inOut' },
          { x: -1.8, rotation: -0.6, duration: 0.08, ease: 'power1.inOut' },
          { x: 1.8, rotation: 0.6, duration: 0.08, ease: 'power1.inOut' },
          { x: 0, rotation: 0, duration: 0.15, ease: 'power2.out' },
        ],
        ease: 'power2.out',
      }
    )
  }

  return (
    <figure
      ref={figureRef}
      className="painting-item"
      data-painting-id={painting.id}
      data-painting-title={painting.title}
      onPointerEnter={handlePointerEnter}
      style={{
        left: `${painting.x}px`,
        top: `${painting.y}px`,
        width: `${painting.w}px`,
        height: `${painting.h}px`,
      }}
    >
      <img
        ref={imageRef}
        src={painting.image}
        alt={painting.title}
        loading="eager"
        decoding="async"
      />
      <PaintingCursorBadge title={painting.title} containerRef={figureRef} />
    </figure>
  )
}

export default PaintingItem
