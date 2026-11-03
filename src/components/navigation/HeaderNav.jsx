import MenuDropdown from './MenuDropdown'
import BagDropdown from './BagDropdown'
import './HeaderNav.css'

/**
 * Top-level fixed Header and Navigation bar
 * Responsive mobile layout matches the stacked sliding CTA design
 * Menu opens left-to-right; Bag opens right-to-left with cart icon
 *
 * @param {Object} props
 * @param {boolean} props.isMenuOpen - Whether the dropdown menu is visible
 * @param {Function} props.setIsMenuOpen - State setter for menu visibility
 * @param {boolean} props.isBagOpen - Whether the shopping bag panel is visible
 * @param {Function} props.setIsBagOpen - State setter for bag visibility
 * @param {string} props.activeCategory - Currently active menu category
 * @param {Function} props.setActiveCategory - State setter for active category
 * @param {import('react').RefObject} props.menuWrapperRef - Ref attached to nav container for outside-click detection
 */
export function HeaderNav({
  isMenuOpen,
  setIsMenuOpen,
  isBagOpen,
  setIsBagOpen,
  activeCategory,
  setActiveCategory,
  menuWrapperRef,
}) {
  const handleMenuClick = () => {
    if (setIsBagOpen) setIsBagOpen(false)
    setIsMenuOpen((prev) => !prev)
  }

  const handleBagClick = () => {
    setIsMenuOpen(false)
    if (setIsBagOpen) setIsBagOpen((prev) => !prev)
  }

  const handleShopClick = () => {
    setIsMenuOpen(false)
    if (setIsBagOpen) setIsBagOpen(false)
  }

  const navClasses = [
    'nav-actions',
    isMenuOpen ? 'is-menu-open' : 'is-menu-closed',
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

        <button
          id="btn-shop-artworks"
          type="button"
          className="btn-accent"
          onClick={handleShopClick}
        >
          Shop Artworks
        </button>

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
