import './PaintingItem.css'

/**
 * Individual framed painting figure positioned absolutely on the gallery canvas.
 *
 * @param {Object} props
 * @param {Object} props.painting - Painting data model (id, title, image, x, y, w, h)
 */
export function PaintingItem({ painting }) {
  return (
    <figure
      className="painting-item"
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

