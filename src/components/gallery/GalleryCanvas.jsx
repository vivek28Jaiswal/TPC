import PaintingItem from './PaintingItem'
import { masterPaintings } from '../../constants/paintingsData'
import './GalleryCanvas.css'

/**
 * GalleryCanvas Component
 * Viewport stage and the movable 5000px x 5000px art wall canvas container
 *
 * @param {Object} props
 * @param {import('react').RefObject} props.viewportRef
 * @param {import('react').RefObject} props.canvasRef
 */
export function GalleryCanvas({ viewportRef, canvasRef }) {
  return (
    <main
      ref={viewportRef}
      id="gallery-viewport"
      className="gallery-viewport"
      aria-label="Interactive Art Gallery Wall"
    >
      <div ref={canvasRef} className="gallery-canvas">
        {masterPaintings.map((painting) => (
          <PaintingItem key={painting.id} painting={painting} />
        ))}
      </div>
    </main>
  )
}

export default GalleryCanvas

