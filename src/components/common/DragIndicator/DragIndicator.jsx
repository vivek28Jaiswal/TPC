import DragIcon from './DragIcon'
import './DragIndicator.css'

/**
 * Centered bottom indicator with 'difference' blend mode
 * informing the visitor of the fluid drag gesture capability.
 */
export function DragIndicator() {
  return (
    <aside className="drag-explore-indicator" aria-label="Exploration instruction">
      <DragIcon className="drag-icon" />
      <span className="drag-text">Drag to explore</span>
    </aside>
  )
}

export default DragIndicator

