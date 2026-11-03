import { useRef, useState, useEffect } from 'react'
import { HeaderNav } from './components/navigation'
import { GalleryCanvas, AmbientShadow, PaintingSidePanel } from './components/gallery'
import { DragIndicator } from './components/common'
import { useClickOutside, useGalleryPhysics } from './hooks'
import { masterPaintings } from './constants/paintingsData'
import './App.css'

// Default fallback painting (Carla Llanos / Flowers On Blue Table)
const defaultPainting =
  masterPaintings.find((p) => p.title.toLowerCase().includes('abstract')) || masterPaintings[0]

/**
 * Main Application Orchestrator
 *
 * Coordinates top-level interaction states, kinetic physics engine,
 * interactive painting side panel drawer, shopping bag, and composes presentation layers cleanly.
 */
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isBagOpen, setIsBagOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('shop')

  // Painting side panel & shopping cart states
  const [selectedPainting, setSelectedPainting] = useState(defaultPainting)
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
  const [bagItems, setBagItems] = useState([])

  const menuWrapperRef = useRef(null)
  const viewportRef = useRef(null)
  const canvasRef = useRef(null)

  // Listen for openPaintingDetails custom event (from gallery wall or search result)
  useEffect(() => {
    const handleOpenPainting = (e) => {
      if (e.detail) {
        setSelectedPainting(e.detail)
        setIsSidePanelOpen(true)
        setIsMenuOpen(false)
        setIsSearchOpen(false)
        setIsBagOpen(false)
      }
    }
    window.addEventListener('openPaintingDetails', handleOpenPainting)
    return () => window.removeEventListener('openPaintingDetails', handleOpenPainting)
  }, [])

  // Close dropdowns on outside click or Escape key
  useClickOutside(
    menuWrapperRef,
    () => {
      setIsMenuOpen(false)
      setIsSearchOpen(false)
      setIsBagOpen(false)
    },
    isMenuOpen || isSearchOpen || isBagOpen
  )

  const handleAddToBag = (item) => {
    setBagItems((prev) => [...prev, item])
  }

  const handleRemoveFromBag = (itemId) => {
    setBagItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  // Initialize smooth kinetic momentum physics and bounds damping
  useGalleryPhysics({ viewportRef, canvasRef })

  return (
    <div className="page-container">
      {/* 1. Fixed Header Navigation & Expanding Menu */}
      <HeaderNav
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        isBagOpen={isBagOpen}
        setIsBagOpen={setIsBagOpen}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        menuWrapperRef={menuWrapperRef}
        bagCount={bagItems.length}
        bagItems={bagItems}
        onRemoveFromBag={handleRemoveFromBag}
      />

      {/* 2. Bounded Drag Art Wall Viewport */}
      <GalleryCanvas
        viewportRef={viewportRef}
        canvasRef={canvasRef}
      />

      {/* 3. Soft Ambient Sunlight Window Shadow Overlay */}
      <AmbientShadow />

      {/* 4. Drag to Explore Floating Indicator */}
      <DragIndicator />

      {/* 5. Smooth Sliding Artwork Details Side Panel (Matches References 1, 2, 3) */}
      <PaintingSidePanel
        isOpen={isSidePanelOpen}
        painting={selectedPainting}
        onClose={() => setIsSidePanelOpen(false)}
        onAddToBag={handleAddToBag}
      />
    </div>
  )
}

export default App
