import { useState, useEffect, useRef } from 'react'
import flowersBlueTableImg from '../../assets/image-paintings/flowers-blue-table.png'
import flowersThumb1 from '../../assets/image-paintings/flowers-thumb-1.png'
import flowersThumb2 from '../../assets/image-paintings/flowers-thumb-2.png'
import flowersThumb3 from '../../assets/image-paintings/flowers-thumb-3.png'
import flowersThumb4 from '../../assets/image-paintings/flowers-thumb-4.png'
import './PaintingSidePanel.css'

// Available standard art print formats matching The Poster Club catalog
const SIZES = [
  { id: 'a4', name: 'A4 (21X29,7 CM)', price: '43,00', format: 'Standard Print' },
  { id: '30x40', name: '30X40 CM', price: '55,00', format: 'Medium Print' },
  { id: '50x70', name: '50X70 CM', price: '85,00', format: 'Large Statement' },
  { id: '70x100', name: '70X100 CM', price: '115,00', format: 'Grand Feature' },
]

/**
 * PaintingSidePanel Component
 *
 * Pixel-perfect implementation matching the actual design reference:
 * - Soft #F0F0F0 background matching Scandinavian Danish aesthetic
 * - Bestseller badge docked at top-left
 * - Main oak-framed painting horizontally centered in the showcase area
 * - 4-thumbnail stack docked at the far right with black square '×' close button on top
 * - Wishlist heart icon, title, artist, large price
 * - Collapsible description with "Read More" <-> "Close" toggle
 * - Select Size custom dropdown (1px black border) & Size Guide modal
 * - Total row & full-width black "ADD TO BAG" CTA
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the side panel is currently open
 * @param {Object} props.painting - Active painting data model
 * @param {Function} props.onClose - Callback to close panel
 * @param {Function} props.onAddToBag - Callback when item is added to shopping bag
 */
export function PaintingSidePanel({ isOpen, painting, onClose, onAddToBag }) {
  const [activeViewIndex, setActiveViewIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedSize, setSelectedSize] = useState(SIZES[0])
  const [isSizeMenuOpen, setIsSizeMenuOpen] = useState(false)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  const [prevPaintingId, setPrevPaintingId] = useState(painting?.id)
  const panelRef = useRef(null)
  const sizeDropdownRef = useRef(null)

  // Reset internal controls during render when a different painting is opened
  if (painting?.id !== prevPaintingId) {
    setPrevPaintingId(painting?.id)
    setActiveViewIndex(0)
    setIsExpanded(false)
    setIsSizeMenuOpen(false)
    setShowSizeGuide(false)
    setIsAdded(false)
  }

  // Handle outside click for size dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (sizeDropdownRef.current && !sizeDropdownRef.current.contains(e.target)) {
        setIsSizeMenuOpen(false)
      }
    }
    if (isSizeMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
      return () => document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [isSizeMenuOpen])

  // Handle escape key to close panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (showSizeGuide) {
          setShowSizeGuide(false)
        } else if (isSizeMenuOpen) {
          setIsSizeMenuOpen(false)
        } else {
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, showSizeGuide, isSizeMenuOpen, onClose])

  if (!painting) return null

  // Artwork metadata
  const isCarlaLlanos =
    painting.title?.toLowerCase().includes('blue table') ||
    painting.title?.toLowerCase().includes('abstract') ||
    painting.title?.toLowerCase().includes('flowers') ||
    painting.artist?.toLowerCase().includes('carla')

  const title = isCarlaLlanos ? 'Flowers On Blue Table' : painting.title
  const artist = isCarlaLlanos ? 'Carla Llanos' : (painting.artist || 'Carla Llanos')

  // Main image and thumbnails
  const mainImage = isCarlaLlanos ? flowersBlueTableImg : painting.image
  const thumbList = isCarlaLlanos
    ? [flowersThumb1, flowersThumb2, flowersThumb3, flowersThumb4]
    : [painting.image, painting.image, painting.image, painting.image]

  const teaserText = `Premium-Quality Botanic Art Print By ${artist} Created Exclusively For The Poster Club, Printed On 245g FSC™-Certified Archival-Quality Art Paper.`

  const extendedText = `${title} Brings Together A Contemporary Palette Of Blue, Burgundy, Pink, Red, Green, And Orange, With Delicate Floral Forms That Feel Thoughtful And Quietly Vibrant. The Motif Offers A Gentle Statement For A Bedroom, Home Office, Living Room, Or Kitchen – Its Calm Elegance Pairs Harmoniously With Natural Wood, Soft Neutrals, Or Textured Ceramics, And Its Matte Finish Exudes Understated Sophisticatio`

  const handleAdd = () => {
    if (isAdded) return
    setIsAdded(true)
    if (onAddToBag) {
      onAddToBag({
        id: `${painting.id}-${selectedSize.id}-${Date.now()}`,
        paintingId: painting.id,
        title,
        artist,
        image: mainImage,
        size: selectedSize.name,
        price: selectedSize.price,
      })
    }
    setTimeout(() => {
      setIsAdded(false)
    }, 1800)
  }

  return (
    <>
      {/* Gentle ambient backdrop overlay allowing outside-click closure */}
      <div
        className={`panel-backdrop ${isOpen ? 'is-visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Sliding Side Panel (Drawer) */}
      <aside
        ref={panelRef}
        id="painting-side-panel"
        className={`painting-side-panel ${isOpen ? 'is-open' : 'is-closed'}`}
        role="dialog"
        aria-modal="true"
        aria-label={`${title} by ${artist}`}
      >
        <div className="panel-scroll-container">
          {/* Top Showcase Stage: Centered Frame, Left Badge, Right Thumbnails */}
          <div className="panel-showcase-stage">
            {/* Top-Left Bestseller Badge */}
            <div className="panel-badge-wrap">
              <span className="panel-badge">Bestseller</span>
            </div>

            {/* Main Oak-Framed Painting (Horizontally Centered) */}
            <div className="panel-main-frame">
              <div className={`panel-frame-inner view-mode-${activeViewIndex}`}>
                <img
                  src={mainImage}
                  alt={title}
                  className="panel-main-image"
                />
              </div>
            </div>

            {/* Right Thumbnails Column Docked at Right Edge */}
            <div className="panel-thumbs-column">
              {/* Slot 1: Thumbnail 1 + Overlaid Close '×' button */}
              <div className="panel-thumb-wrapper">
                <button
                  type="button"
                  className="panel-close-btn"
                  onClick={onClose}
                  aria-label="Close details panel"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                <button
                  type="button"
                  className={`panel-thumb-btn ${activeViewIndex === 0 ? 'is-active' : ''}`}
                  onClick={() => setActiveViewIndex(0)}
                  aria-label="View 1: Full Frame"
                >
                  <img
                    src={thumbList[0]}
                    alt="Thumbnail 1: Full frame"
                    className="thumb-crop-0"
                  />
                </button>
              </div>

              {/* Slot 2: Perspective view */}
              <button
                type="button"
                className={`panel-thumb-btn ${activeViewIndex === 1 ? 'is-active' : ''}`}
                onClick={() => setActiveViewIndex(1)}
                aria-label="View 2: Perspective View"
              >
                <img
                  src={thumbList[1]}
                  alt="Thumbnail 2: Perspective view"
                  className="thumb-crop-1"
                />
              </button>

              {/* Slot 3: Detail texture zoom */}
              <button
                type="button"
                className={`panel-thumb-btn ${activeViewIndex === 2 ? 'is-active' : ''}`}
                onClick={() => setActiveViewIndex(2)}
                aria-label="View 3: Texture Detail"
              >
                <img
                  src={thumbList[2]}
                  alt="Thumbnail 3: Texture detail"
                  className="thumb-crop-2"
                />
              </button>

              {/* Slot 4: Minimalist crop */}
              <button
                type="button"
                className={`panel-thumb-btn ${activeViewIndex === 3 ? 'is-active' : ''}`}
                onClick={() => setActiveViewIndex(3)}
                aria-label="View 4: Interior Context"
              >
                <img
                  src={thumbList[3]}
                  alt="Thumbnail 4: Interior context"
                  className="thumb-crop-3"
                />
              </button>
            </div>
          </div>

          {/* Details & Purchase Section */}
          <div className="panel-info-section">
            {/* Title & Artist Row with Bare Minimalist Wishlist Heart */}
            <div className="panel-title-row">
              <div className="panel-title-col">
                <h2 className="panel-title">{title}</h2>
                <p className="panel-artist">{artist}</p>
              </div>

              <button
                type="button"
                className={`panel-wishlist-btn ${isLiked ? 'is-liked' : ''}`}
                onClick={() => setIsLiked((prev) => !prev)}
                aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={isLiked ? '#000000' : 'none'}
                  stroke="#000000"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            {/* Price */}
            <div className="panel-price">€{selectedSize.price}</div>

            {/* Description Section with "Read More" <-> "Close" Toggle */}
            <div className="panel-desc-wrap">
              <p className="panel-desc-p1">{teaserText}</p>

              {isExpanded && (
                <p className="panel-desc-p2 animate-fade-in">{extendedText}</p>
              )}

              <button
                type="button"
                className="panel-expand-btn"
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                {isExpanded ? 'Close' : 'Read More'}
              </button>
            </div>

            {/* Size Selector */}
            <div className="panel-size-section" ref={sizeDropdownRef}>
              <div className="panel-size-header">
                <span className="panel-size-label">Select Size</span>
                <button
                  type="button"
                  className="panel-size-guide-btn"
                  onClick={() => setShowSizeGuide(true)}
                >
                  Size Guide
                </button>
              </div>

              {/* Custom Size Dropdown Box (1px Black Border, White Background) */}
              <div className="panel-size-dropdown-wrap">
                <button
                  type="button"
                  className={`panel-size-selector-btn ${isSizeMenuOpen ? 'is-menu-open' : ''}`}
                  onClick={() => setIsSizeMenuOpen((prev) => !prev)}
                  aria-expanded={isSizeMenuOpen}
                  aria-haspopup="listbox"
                >
                  <span className="panel-size-name">{selectedSize.name}</span>
                  <span className="panel-size-price-wrap">
                    <span className="panel-size-price">€{selectedSize.price}</span>
                    <svg
                      className={`panel-size-chevron ${isSizeMenuOpen ? 'is-rotated' : ''}`}
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>

                {isSizeMenuOpen && (
                  <div className="panel-size-options" role="listbox">
                    {SIZES.map((size) => (
                      <button
                        key={size.id}
                        type="button"
                        className={`panel-size-option ${selectedSize.id === size.id ? 'is-selected' : ''}`}
                        onClick={() => {
                          setSelectedSize(size)
                          setIsSizeMenuOpen(false)
                        }}
                        role="option"
                        aria-selected={selectedSize.id === size.id}
                      >
                        <span className="option-name">{size.name}</span>
                        <span className="option-price">€{size.price}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Total Row */}
            <div className="panel-total-row">
              <span className="panel-total-label">Total</span>
              <span className="panel-total-value">€{selectedSize.price}</span>
            </div>

            {/* ADD TO BAG Button */}
            <button
              type="button"
              className={`panel-add-btn ${isAdded ? 'is-added' : ''}`}
              onClick={handleAdd}
            >
              {isAdded ? 'ADDED TO BAG ✓' : 'ADD TO BAG'}
            </button>
          </div>
        </div>
      </aside>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div
          className="size-guide-overlay"
          onClick={() => setShowSizeGuide(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Size Guide"
        >
          <div
            className="size-guide-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="size-guide-modal-header">
              <h3 className="size-guide-modal-title">Size Guide</h3>
              <button
                type="button"
                className="size-guide-close-btn"
                onClick={() => setShowSizeGuide(false)}
                aria-label="Close size guide"
              >
                ×
              </button>
            </div>

            <div className="size-guide-body">
              <p className="size-guide-intro">
                All art prints are printed on 245g FSC™-certified archival-quality art paper with a light texture and matte finish.
              </p>

              <table className="size-guide-table">
                <thead>
                  <tr>
                    <th>Format</th>
                    <th>Dimensions</th>
                    <th>Ideal Placement</th>
                  </tr>
                </thead>
                <tbody>
                  {SIZES.map((s) => (
                    <tr key={s.id}>
                      <td className="guide-name">{s.name.split(' ')[0]}</td>
                      <td className="guide-dims">{s.name.match(/\((.*?)\)/)?.[1] || s.name}</td>
                      <td className="guide-placement">{s.format}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PaintingSidePanel
