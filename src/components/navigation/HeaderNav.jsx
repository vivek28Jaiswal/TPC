import MenuDropdown from './MenuDropdown'
import BagDropdown from './BagDropdown'
import SearchDropdown from './SearchDropdown'
import './HeaderNav.css'

/**
 * Top-level fixed Header and Navigation bar
 * Responsive mobile layout matches the stacked sliding CTA design
 * 3 CTAs with tri-directional kinetic physics:
 * - Menu opens Left-to-Right
 * - Search Artwork opens Center-Outwards to both sides
 * - Bag opens Right-to-Left
 *
 * @param {Object} props
 * @param {boolean} props.isMenuOpen - Whether the dropdown menu is visible
 * @param {Function} props.setIsMenuOpen - State setter for menu visibility
 * @param {boolean} props.isSearchOpen - Whether the search artwork panel is visible
 * @param {Function} props.setIsSearchOpen - State setter for search visibility
 * @param {boolean} props.isBagOpen - Whether the shopping bag panel is visible
 * @param {Function} props.setIsBagOpen - State setter for bag visibility
 * @param {string} props.activeCategory - Currently active menu category
 * @param {Function} props.setActiveCategory - State setter for active category
 * @param {import('react').RefObject} props.menuWrapperRef - Ref attached to nav container for outside-click detection
 */
export function HeaderNav({
  isMenuOpen,
  setIsMenuOpen,
  isSearchOpen,
  setIsSearchOpen,
  isBagOpen,
  setIsBagOpen,
  activeCategory,
  setActiveCategory,
  menuWrapperRef,
}) {
  const handleMenuClick = () => {
    if (setIsSearchOpen) setIsSearchOpen(false)
    if (setIsBagOpen) setIsBagOpen(false)
    setIsMenuOpen((prev) => !prev)
  }

  const handleSearchClick = () => {
    setIsMenuOpen(false)
    if (setIsBagOpen) setIsBagOpen(false)
    if (setIsSearchOpen) setIsSearchOpen((prev) => !prev)
  }

  const handleBagClick = () => {
    setIsMenuOpen(false)
    if (setIsSearchOpen) setIsSearchOpen(false)
    if (setIsBagOpen) setIsBagOpen((prev) => !prev)
  }

  const navClasses = [
    'nav-actions',
    isMenuOpen ? 'is-menu-open' : 'is-menu-closed',
    isSearchOpen ? 'is-search-open' : 'is-search-closed',
    isBagOpen ? 'is-bag-open' : 'is-bag-closed',
  ].join(' ')

  return (
    <header className="header-nav">
      <h1 id="brand-logo" className="brand-logo">
        THE POSTER CLUB
      </h1>

      <nav
        ref={menuWrapperRef}
        className={navClasses}
        aria-label="Main menu"
      >
        {/* 1. Menu CTA (Left Origin) */}
        <button
          id="btn-menu"
          type="button"
          className={`btn-menu ${isMenuOpen ? 'is-active' : ''}`}
          onClick={handleMenuClick}
          aria-expanded={isMenuOpen}
          aria-controls="menu-dropdown-container"
        >
          <span className="btn-menu-label-wrap">
            <span className="btn-menu-slider">
              <span className="btn-menu-text">Menu</span>
              <span className="btn-menu-text">Close</span>
            </span>
          </span>
        </button>

        {/* 2. Search Artwork CTA (Center Origin - Elegant Black matching Menu) */}
        <button
          id="btn-search-artwork"
          type="button"
          className={`btn-search ${isSearchOpen ? 'is-active' : ''}`}
          onClick={handleSearchClick}
          aria-expanded={isSearchOpen}
          aria-controls="search-dropdown-container"
        >
          <span className="btn-search-label-wrap">
            <span className="btn-search-slider">
              <span className="btn-search-text">Search Artwork</span>
              <span className="btn-search-text">Close</span>
            </span>
          </span>
        </button>

        {/* 3. Bag CTA (Right Origin) */}
        <button
          id="btn-bag"
          type="button"
          className={`btn-accent btn-bag ${isBagOpen ? 'is-active' : ''}`}
          onClick={handleBagClick}
          aria-expanded={isBagOpen}
          aria-controls="bag-dropdown-container"
        >
          <span className="btn-bag-label-wrap">
            <span className="btn-bag-slider">
              <span className="btn-bag-text">BAG (0)</span>
              <span className="btn-bag-text">Close</span>
            </span>
          </span>
        </button>

        {/* Morphing Expanding Dropdown Menu (Opens Left-to-Right) */}
        <MenuDropdown
          isOpen={isMenuOpen}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onClose={() => setIsMenuOpen(false)}
        />

        {/* Smooth Expanding Search Dropdown (Opens Center Symmetrically) */}
        <SearchDropdown
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen && setIsSearchOpen(false)}
        />

        {/* Smooth Expanding Orange Bag Dropdown (Opens Right-to-Left) */}
        <BagDropdown
          isOpen={isBagOpen}
          onClose={() => setIsBagOpen && setIsBagOpen(false)}
        />
      </nav>
    </header>
  )
}

export default HeaderNav
