import { useRef } from 'react'
import gsap from 'gsap'
import './PaintingItem.css'

/**
 * Individual framed painting figure positioned absolutely on the gallery canvas.
 * Executes a gentle, authentic hanging museum art micro-shake on cursor hover.
 *
 * @param {Object} props
 * @param {Object} props.painting - Painting data model (id, title, image, x, y, w, h)
 */
export function PaintingItem({ painting }) {
  const figureRef = useRef(null)

  const handlePointerEnter = (e) => {
    // Ignore while dragging (when mouse button is pressed down)
    if (e.buttons > 0) return
    const el = figureRef.current
    if (!el) return

    gsap.killTweensOf(el)

    // Gentle, authentic hanging art frame micro-shake with GSAP easing
    gsap.fromTo(
      el,
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
        src={painting.image}
        alt={painting.title}
        loading="eager"
        decoding="async"
      />
    </figure>
  )
}

export default PaintingItem
