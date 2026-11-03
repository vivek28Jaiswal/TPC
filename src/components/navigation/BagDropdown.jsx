import cartSvg from '../../assets/icons/cart.svg'
import './BagDropdown.css'

/**
 * BagDropdown Component
 *
 * Smooth expanding orange dropdown panel for the shopping bag.
 * Originates from the top-right (under the BAG button) and expands smoothly
 * from right to left with signature cubic-bezier(0.76, 0, 0.24, 1) easing.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the bag panel is open
 */
export function BagDropdown({ isOpen }) {
  return (
    <div
      id="bag-dropdown-container"
      className={`bag-dropdown ${isOpen ? 'is-open' : 'is-closed'}`}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
      aria-hidden={!isOpen}
    >
      <div className="bag-dropdown-inner">
        <div className="bag-empty-state">
          <img
            src={cartSvg}
            alt="Shopping cart"
            className="bag-cart-icon"
            width={24}
            height={24}
          />
          <p className="bag-empty-text">Your Bag Is Empty</p>
        </div>
      </div>
    </div>
  )
}

export default BagDropdown
