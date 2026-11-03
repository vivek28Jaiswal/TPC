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

  // Listen for search-selection highlight events
  useEffect(() => {
    const handleHighlight = (e) => {
      if (e.detail?.id === painting.id && figureRef.current) {
        const figure = figureRef.current
        gsap.killTweensOf(figure)

        figure.classList.add('is-search-highlighted')

        // Gentle spring pulse
        gsap.fromTo(
          figure,
          { scale: 1 },
          {
            scale: 1.045,
            duration: 0.32,
            yoyo: true,
            repeat: 1,
            ease: 'power2.out',
            onComplete: () => {
              gsap.set(figure, { clearProps: 'scale' })
            },
          }
        )

        // Softly remove highlight after 2.6s
        const timer = setTimeout(() => {
          if (figure) figure.classList.remove('is-search-highlighted')
        }, 2600)

        return () => clearTimeout(timer)
      }
    }

    window.addEventListener('highlightPainting', handleHighlight)
    return () => window.removeEventListener('highlightPainting', handleHighlight)
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
