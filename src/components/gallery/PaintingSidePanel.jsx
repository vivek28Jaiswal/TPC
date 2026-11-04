import { useState, useEffect, useRef } from 'react'
import flowersBlueTableImg from '../../assets/image-paintings/flowers-blue-table.png'
import { getArtworkDescription } from '../../constants/artworkDescriptions'
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
 * - White #FFFFFF side panel background
 * - Soft #F6F6F6 showcase stage behind the artwork
 * - Bestseller badge docked at top-left
 * - Main framed painting centered cleanly without artificial CSS borders/lines
 * - 4-thumbnail stack docked at far right; clicked item is 100% opacity, others are 40% opacity
 * - Black square '×' close button on top-right of thumbnail 1
 * - Wishlist heart icon in #F6F6F6 rounded square
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
  const [naturalAspect, setNaturalAspect] = useState(null)

  const [prevPaintingId, setPrevPaintingId] = useState(painting?.id)
  const panelRef = useRef(null)
  const sizeDropdownRef = useRef(null)
  const scrollContainerRef = useRef(null)

  // Direct, smooth mouse wheel scrolling over the entire side panel
  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el || !isOpen) return

    const handleWheel = (e) => {
      // Stop propagation to prevent gallery canvas from moving, and scroll panel smoothly
      e.stopPropagation()
      el.scrollTop += e.deltaY
      e.preventDefault()
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      el.removeEventListener('wheel', handleWheel)
    }
  }, [isOpen])

  // Reset internal controls during render when a different painting is opened
  if (painting?.id !== prevPaintingId) {
    setPrevPaintingId(painting?.id)
    setActiveViewIndex(0)
    setIsExpanded(false)
    setIsSizeMenuOpen(false)
    setShowSizeGuide(false)
    setIsAdded(false)
    setNaturalAspect(null)
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
  const isDefaultCarla =
    !painting.image ||
    painting.title?.toLowerCase().includes('blue table') ||
    painting.title?.toLowerCase().includes('flowers')

  const title = isDefaultCarla ? 'Flowers On Blue Table' : painting.title
  const desc = getArtworkDescription(title, painting.artist)
  const artist = isDefaultCarla ? 'Carla Llanos' : (desc.artist || painting.artist || 'The Poster Club')

  // Main framed painting image
  const mainImage = isDefaultCarla ? flowersBlueTableImg : (painting.image || flowersBlueTableImg)

  // Orientation detection for preview image stack & tight spacing
  const isHorizontal =
    (naturalAspect !== null && naturalAspect > 1.05) ||
    Boolean(painting?.w && painting?.h && painting.w > painting.h) ||
    (painting?.title && [
      'abstract harmony',
      'blue grass melody',
      'polka coat',
      'dancing movement',
      'companions',
      'horse sketch',
      'mountain ridge',
      'graphic still life',
    ].includes(painting.title.toLowerCase()))

  const handleAdd = () => {
    setIsAdded(true)
    if (onAddToBag) {
      onAddToBag({
        id: `${painting.id}-${selectedSize.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
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
    }, 1200)
  }

  return (
    <>
      {/* Gentle ambient backdrop overlay allowing outside-click closure */}
      <div
        className={`panel-backdrop ${isOpen ? 'is-visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Sliding Side Panel (Drawer) with White Background */}
      <aside
        ref={panelRef}
        id="painting-side-panel"
        className={`painting-side-panel ${isOpen ? 'is-open' : 'is-closed'}`}
        role="dialog"
        aria-modal="true"
        aria-label={`${title} by ${artist}`}
      >
        <div className="panel-scroll-container" ref={scrollContainerRef}>
          {/* Top Showcase Stage: #F6F6F6 Gray Background */}
          <div className="panel-showcase-stage">
            {/* Top-Left Bestseller Badge (top: 24px, left: 30px) */}
            <div className="panel-badge-wrap">
              <span className="panel-badge">Bestseller</span>
            </div>

            {/* Main Framed Painting: Clean, direct image centered without artificial CSS borders */}
            <div className="panel-main-frame">
              <img
                src={mainImage}
                alt={title}
                className="panel-main-image"
                onLoad={(e) => {
                  const img = e.currentTarget
                  if (img.naturalWidth && img.naturalHeight) {
                    setNaturalAspect(img.naturalWidth / img.naturalHeight)
                  }
                }}
              />
            </div>

            {/* Right Thumbnails Column & Cancel Button (docked top: 24px, right: 30px) */}
            <div className={`panel-thumbs-column ${isHorizontal ? 'is-horizontal-art' : ''}`}>
              {/* Slot 1: Thumbnail 1 + Overlaid Close '×' button */}
              <div className="panel-thumb-wrapper">
                <button
                  type="button"
                  className="panel-close-btn"
                  onClick={onClose}
                  aria-label="Close details panel"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
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
                  aria-label="View 1"
                >
                  <img
                    src={mainImage}
                    alt="Thumbnail 1"
                  />
                </button>
              </div>

              {/* Slot 2: 40% opacity when inactive */}
              <button
                type="button"
                className={`panel-thumb-btn ${activeViewIndex === 1 ? 'is-active' : ''}`}
                onClick={() => setActiveViewIndex(1)}
                aria-label="View 2"
              >
                <img
                  src={mainImage}
                  alt="Thumbnail 2"
                />
              </button>

              {/* Slot 3: 40% opacity when inactive */}
              <button
                type="button"
                className={`panel-thumb-btn ${activeViewIndex === 2 ? 'is-active' : ''}`}
                onClick={() => setActiveViewIndex(2)}
                aria-label="View 3"
              >
                <img
                  src={mainImage}
                  alt="Thumbnail 3"
                />
              </button>

              {/* Slot 4: 40% opacity when inactive */}
              <button
                type="button"
                className={`panel-thumb-btn ${activeViewIndex === 3 ? 'is-active' : ''}`}
                onClick={() => setActiveViewIndex(3)}
                aria-label="View 4"
              >
                <img
                  src={mainImage}
                  alt="Thumbnail 4"
                />
              </button>
            </div>
          </div>

          {/* Details & Purchase Section with Pure White Background */}
          <div className="panel-info-section">
            {/* Title & Artist Row with #F6F6F6 Rounded Square Wishlist Button */}
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

            {/* Description Section matching exact Poster Club reference layout */}
            <div className="panel-desc-wrap">
              <p className="panel-desc-p1">{desc.teaser}</p>

              {isExpanded && (
                <div className="panel-desc-extended animate-fade-in">
                  <p className="panel-desc-p2">{desc.story}</p>

                  <p className="panel-desc-p3">{desc.craftsmanship}</p>

                  <ul className="panel-desc-bullets">
                    {desc.bullets.map((bullet, idx) => (
                      <li key={idx} className="panel-desc-bullet-item">
                        {bullet}
                      </li>
                    ))}
                  </ul>

                  <p className="panel-desc-collection">{desc.collection}</p>
                </div>
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
              {isAdded ? 'ADDED TO BAG' : 'ADD TO BAG'}
            </button>

            {/* Dedicated bottom whitespace spacer guaranteeing clear visibility above phone bars & home indicators */}
            <div className="panel-bottom-whitespace" aria-hidden="true" />
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
