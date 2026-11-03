import MenuDropdown from './MenuDropdown'
import './HeaderNav.css'

/**
 * Top-level fixed Header and Navigation bar
 *
 * @param {Object} props
 * @param {boolean} props.isMenuOpen - Whether the dropdown menu is visible
 * @param {Function} props.setIsMenuOpen - State setter for menu visibility
 * @param {string} props.activeCategory - Currently active menu category
 * @param {Function} props.setActiveCategory - State setter for active category
 * @param {import('react').RefObject} props.menuWrapperRef - Ref attached to nav container for outside-click detection
 */
export function HeaderNav({
  isMenuOpen,
  setIsMenuOpen,
  activeCategory,
  setActiveCategory,
  menuWrapperRef,
}) {
  return (
    <header className="header-nav">
      <h1 id="brand-logo" className="brand-logo">
        THE POSTER CLUB
      </h1>

      <nav ref={menuWrapperRef} className="nav-actions" aria-label="Main menu">
        <button
          id="btn-menu"
          type="button"
          className={`btn-menu ${isMenuOpen ? 'is-active' : ''}`}
          onClick={() => setIsMenuOpen((prev) => !prev)}
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

        <button
          id="btn-shop-artworks"
          type="button"
          className="btn-accent"
          onClick={() => setIsMenuOpen(false)}
        >
          Shop Artworks
        </button>
        <button
          id="btn-bag"
          type="button"
          className="btn-accent"
          onClick={() => setIsMenuOpen(false)}
        >
          BAG (0)
        </button>

        {/* Morphing Expanding Dropdown Menu */}
        <MenuDropdown
          isOpen={isMenuOpen}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          onClose={() => setIsMenuOpen(false)}
        />
      </nav>
    </header>
  )
}

export default HeaderNav

