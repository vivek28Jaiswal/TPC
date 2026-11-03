import { useState, useRef, useEffect, useMemo } from 'react'
import { masterPaintings } from '../../constants/paintingsData'
import './SearchDropdown.css'

// Curated popular search suggestions from authentic artworks available in our gallery
const POPULAR_CHIPS = [
  'Crimson Shades',
  'Cobalt Study',
  'Golden Feline',
  'Abstract Harmony',
  'Horse Sketch',
  'Botanical Grass',
  'Blue Grass Melody',
  'Dancing Movement',
]

// Metadata catalog for unique artworks on the gallery wall
const ARTWORK_CATALOG = [
  {
    title: 'Cobalt Study',
    artist: 'Sayul Atelier',
    category: 'Fine Art Print',
    tags: ['cobalt', 'blue', 'study', 'sea', 'sam at sea', 'ocean', 'water', 'minimalist'],
  },
  {
    title: 'Abstract Harmony',
    artist: 'Sammm Studio',
    category: 'Acrylic on Canvas',
    tags: ['abstract', 'harmony', 'sammm', 'shapes', 'modern', 'geometry', 'composition'],
  },
  {
    title: 'Blue Grass Melody',
    artist: 'Sayul Atelier',
    category: 'Archival Print',
    tags: ['blue', 'grass', 'melody', 'sea', 'sam at sea', 'nature', 'landscape'],
  },
  {
    title: 'Golden Feline',
    artist: 'Samya Cat Art',
    category: 'Giclée Fine Art',
    tags: ['cat', 'feline', 'samya', 'samya cat art', 'animal', 'pet', 'gold', 'kitten'],
  },
  {
    title: 'Curly Silhouette',
    artist: 'Sayul Artwork',
    category: 'Portrait Study',
    tags: ['curly', 'lady', 'silhouette', 'sayul', 'sayul artwork', 'portrait', 'woman'],
  },
  {
    title: 'Botanical Grass',
    artist: 'Studio Nord',
    category: 'Botanical Print',
    tags: ['botanical', 'grass', 'nature', 'flora', 'minimal', 'organic'],
  },
  {
    title: 'Green Robe Lady',
    artist: 'Samya Studio',
    category: 'Oil Painting',
    tags: ['green', 'robe', 'lady', 'portrait', 'samya', 'woman', 'fine art'],
  },
  {
    title: 'Polka Coat',
    artist: 'Sammm Atelier',
    category: 'Fashion Illustration',
    tags: ['polka', 'coat', 'fashion', 'sammm', 'dots', 'jacket', 'style'],
  },
  {
    title: 'Dancing Movement',
    artist: 'Sayul Artwork',
    category: 'Expressive Ink',
    tags: ['dancing', 'movement', 'sayul', 'sayul artwork', 'dance', 'figure', 'kinetic'],
  },
  {
    title: 'Companions',
    artist: 'Studio Nord',
    category: 'Figurative Art',
    tags: ['companions', 'friends', 'people', 'duo', 'together', 'figurative'],
  },
  {
    title: 'Green Wall Geometry',
    artist: 'Nordic Archive',
    category: 'Architectural Study',
    tags: ['green', 'wall', 'geometry', 'architecture', 'interior', 'minimal'],
  },
  {
    title: 'Horse Sketch',
    artist: 'Sayul Atelier',
    category: 'Charcoal & Wash',
    tags: ['horse', 'sketch', 'animal', 'equestrian', 'charcoal', 'drawing'],
  },
  {
    title: 'Reading Lady',
    artist: 'Samya Studio',
    category: 'Portrait Print',
    tags: ['reading', 'lady', 'book', 'portrait', 'peaceful', 'woman'],
  },
  {
    title: 'Mountain Ridge',
    artist: 'Nordic Archive',
    category: 'Landscape Print',
    tags: ['mountain', 'ridge', 'landscape', 'nature', 'peaks', 'scenic'],
  },
  {
    title: 'Crimson Shades',
    artist: 'Samya Studio',
    category: 'Oil on Linen',
    tags: ['crimson', 'shades', 'red', 'abstract', 'warm', 'sayul', 'vibrant'],
  },
  {
    title: 'Graphic Still Life',
    artist: 'Sammm Studio',
    category: 'Modern Still Life',
    tags: ['graphic', 'still life', 'symbols', 'sammm', 'objects', 'contemporary'],
  },
  {
    title: 'Stars and Birds',
    artist: 'Samya Studio',
    category: 'Nocturne Study',
    tags: ['stars', 'birds', 'night', 'sky', 'samya', 'dream', 'celestial'],
  },
]

// Join unique metadata with actual painting images and representative dimensions from master dataset
const UNIQUE_PAINTINGS = ARTWORK_CATALOG.map((item) => {
  const sample = masterPaintings.find((p) => p.title === item.title) || masterPaintings[0]
  return {
    ...item,
    image: sample.image,
    dimensions: `${sample.w} × ${sample.h} cm`,
  }
})

/**
 * SearchDropdown Component
 *
 * Smooth expanding dark search panel for artworks and artists.
 * Expands symmetrically from top-center to both sides equally with zero subpixel jitter,
 * powered by GPU-accelerated symmetrical clipping and Olivier Larose kinetic physics.
 * Supports live artwork searching, chip filtering, and tactile glide-to-wall interaction.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the search dropdown is open
 * @param {Function} props.onClose - Callback to close search
 */
export function SearchDropdown({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('')
  const inputRef = useRef(null)

  // Auto-focus input smoothly after panel expansion settles (prevents focus scroll jump)
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus({ preventScroll: true })
        }
      }, 420)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Filter artworks live based on search term
  const searchResults = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return []

    return UNIQUE_PAINTINGS.filter((artwork) => {
      // 1. Direct title match
      if (artwork.title.toLowerCase().includes(query)) return true
      // 2. Artist match
      if (artwork.artist.toLowerCase().includes(query)) return true
      // 3. Category match
      if (artwork.category.toLowerCase().includes(query)) return true
      // 4. Tags match (e.g. "cat", "sea", "sayul", "samya", "crimson")
      if (artwork.tags.some((tag) => tag.includes(query) || query.includes(tag))) return true
      return false
    })
  }, [searchTerm])

  // Click on a popular search chip
  const handleChipClick = (chip) => {
    if (searchTerm === chip) {
      setSearchTerm('')
    } else {
      setSearchTerm(chip)
    }
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true })
    }
  }

  // Clear search input
  const handleClear = () => {
    setSearchTerm('')
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true })
    }
  }

  // Navigate directly to the selected artwork on the gallery wall
  const handleSelectArtwork = (artwork) => {
    // Locate the placement closest to the current viewport center
    const canvasPos = window.__galleryCanvasPos || { x: 0, y: 0 }
    const viewCenterX = window.innerWidth / 2 - canvasPos.x
    const viewCenterY = window.innerHeight / 2 - canvasPos.y

    const placements = masterPaintings.filter((p) => p.title === artwork.title)
    let closestPlacement = placements[0]
    let minDistanceSq = Infinity

    for (const p of placements) {
      const pCenterX = p.x + p.w / 2
      const pCenterY = p.y + p.h / 2
      const distSq = (pCenterX - viewCenterX) ** 2 + (pCenterY - viewCenterY) ** 2
      if (distSq < minDistanceSq) {
        minDistanceSq = distSq
        closestPlacement = p
      }
    }

    if (closestPlacement) {
      // Smoothly pan canvas to center that painting
      window.dispatchEvent(new CustomEvent('panToPainting', { detail: closestPlacement }))
      // Trigger authentic frame shake on targeted artwork
      window.dispatchEvent(
        new CustomEvent('highlightPainting', { detail: { id: closestPlacement.id } })
      )
      // Smoothly open painting side panel details
      window.dispatchEvent(
        new CustomEvent('openPaintingDetails', { detail: closestPlacement })
      )
    }

    // Close the search dropdown
    if (onClose) {
      onClose()
    }
  }

  const isSearching = searchTerm.trim().length > 0

  return (
    <div
      id="search-dropdown-container"
      className={`search-dropdown-wrapper ${isOpen ? 'is-open' : 'is-closed'}`}
      role="dialog"
      aria-modal="true"
      aria-label="Search Artworks"
      aria-hidden={!isOpen}
    >
      <div className="search-dropdown-panel">
        <div className="search-dropdown-inner">
          {/* Search Input Bar */}
          <div className="search-input-wrap">
            <svg
              className="search-input-icon"
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#767676"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>

            <input
              ref={inputRef}
              type="text"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Artworks, Artists..."
              aria-label="Search Artworks, Artists"
            />

            {searchTerm && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={handleClear}
                aria-label="Clear search input"
              >
                ×
              </button>
            )}
          </div>

          {/* Active Search Results State */}
          {isSearching ? (
            <div className="search-results-section">
              <div className="search-results-header">
                <span className="search-results-count">
                  {searchResults.length}{' '}
                  {searchResults.length === 1 ? 'ARTWORK' : 'ARTWORKS'} FOUND
                </span>
                <button
                  type="button"
                  className="search-reset-link"
                  onClick={handleClear}
                >
                  Show Popular
                </button>
              </div>

              {searchResults.length > 0 ? (
                <div className="search-results-list" role="listbox">
                  {searchResults.map((artwork) => (
                    <div
                      key={artwork.title}
                      className="search-result-item"
                      onClick={() => handleSelectArtwork(artwork)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleSelectArtwork(artwork)
                        }
                      }}
                      role="option"
                      aria-selected="false"
                      tabIndex={0}
                    >
                      <div className="search-result-thumb-wrap">
                        <img
                          src={artwork.image}
                          alt={artwork.title}
                          className="search-result-thumb"
                          loading="lazy"
                        />
                      </div>

                      <div className="search-result-info">
                        <span className="search-result-title">{artwork.title}</span>
                        <span className="search-result-meta">
                          {artwork.artist} • {artwork.category}
                        </span>
                      </div>

                      <span className="search-result-action" aria-hidden="true">
                        View
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="search-no-results">
                  <p className="search-no-results-text">
                    No artworks found matching &ldquo;
                    {searchTerm.length > 4 ? `${searchTerm.slice(0, 4)}...` : searchTerm}
                    &rdquo;
                  </p>
                  <button
                    type="button"
                    className="search-no-results-btn"
                    onClick={handleClear}
                  >
                    Browse Popular Searches
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Popular Searches State (Matches Reference Image Layout) */
            <div className="search-popular-section">
              <h2 className="search-popular-title">POPULAR SEARCHES</h2>

              <div className="search-chips-wrap">
                {POPULAR_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    className={`search-chip ${searchTerm === chip ? 'is-selected' : ''}`}
                    onClick={() => handleChipClick(chip)}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchDropdown