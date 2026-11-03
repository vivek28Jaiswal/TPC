import { MENU_CATEGORIES } from '../../constants/navigationData'
import './MenuDropdown.css'

/**
 * Awwwards-inspired morphing dropdown menu container
 * Smoothly expands to the end of the action buttons and slides up category sub-items
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the menu is currently expanded
 * @param {string} props.activeCategory - Currently selected primary category key
 * @param {Function} props.onSelectCategory - Category hover/selection callback
 * @param {Function} props.onClose - Menu close callback
 */
export function MenuDropdown({
  isOpen,
  activeCategory,
  onSelectCategory,
  onClose,
}) {
  return (
    <div
      id="menu-dropdown-container"
      className={`menu-dropdown ${isOpen ? 'is-open' : 'is-closed'}`}
      aria-hidden={!isOpen}
    >
      <div className="menu-dropdown-inner">
        {/* Left Primary Categories (Hover reveals parentheses & activates sub-menu) */}
        <div className="menu-col-main">
          {Object.entries(MENU_CATEGORIES).map(([key, cat]) => (
            <a
              key={key}
              href={`#${key}`}
              className={`menu-link-main ${activeCategory === key ? 'is-active-cat' : ''}`}
              onMouseEnter={() => onSelectCategory(key)}
              onClick={(e) => {
                e.preventDefault()
                onSelectCategory(key)
              }}
            >
              <span className="bracket bracket-left">(</span>
              <span className="menu-link-text">{cat.label}</span>
              <span className="bracket bracket-right">)</span>
            </a>
          ))}
        </div>

        {/* Right Sub-categories with bottom slide-up stagger animation */}
        <div key={activeCategory} className="menu-col-sub">
          {MENU_CATEGORIES[activeCategory]?.items.map((item, idx) => (
            <div key={item.label} className="sub-link-mask">
              <a
                href={item.href}
                className="menu-link-sub"
                style={{ animationDelay: `${idx * 0.045}s` }}
                onClick={() => onClose()}
              >
                <span className="bullet-dot">•</span>
                <span className="sub-link-label">{item.label}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MenuDropdown

