import { useRef, useState } from 'react'
import { HeaderNav } from './components/navigation'
import { GalleryCanvas, AmbientShadow } from './components/gallery'
import { DragIndicator } from './components/common'
import { useClickOutside, useGalleryPhysics } from './hooks'
import './App.css'

/**
 * Main Application Orchestrator
 *
 * Coordinates top-level interaction states, hooks up the kinetic physics engine,
 * and composes presentation layers cleanly.
 */
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('shop')

  const menuWrapperRef = useRef(null)
  const viewportRef = useRef(null)
  const canvasRef = useRef(null)

  // Close dropdown on outside click or Escape key
  useClickOutside(menuWrapperRef, () => setIsMenuOpen(false), isMenuOpen)

  // Initialize smooth kinetic momentum physics and bounds damping
  useGalleryPhysics({ viewportRef, canvasRef })

  return (
    <div className="page-container">
      {/* 1. Header Navigation & Expanding Menu */}
      <HeaderNav
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        menuWrapperRef={menuWrapperRef}
      />

      {/* 2. Soft Ambient Sunlight Window Shadow Overlay */}
      <AmbientShadow />

      {/* 3. Bounded Drag Art Wall Viewport with Finish Lines */}
      <GalleryCanvas
        viewportRef={viewportRef}
        canvasRef={canvasRef}
      />

      {/* 4. Drag to Explore Floating Indicator */}
      <DragIndicator />
    </div>
  )
}

export default App
