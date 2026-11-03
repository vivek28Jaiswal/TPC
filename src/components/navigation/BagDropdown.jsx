import cartSvg from '../../assets/icons/cart.svg'
import './BagDropdown.css'

/**
 * BagDropdown Component
 *
 * Smooth expanding orange dropdown panel for the shopping bag.
 * Originates from the top-right (under the BAG button) and expands smoothly
 * from right to left with signature cubic-bezier(0.76, 0, 0.24, 1) easing.
 * Displays items added to bag or friendly empty state.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the bag panel is open
 * @param {Array} props.bagItems - List of items in bag
 */
export function BagDropdown({ isOpen, bagItems = [] }) {
  const totalAmount = bagItems
    .reduce((sum, item) => {
      const num = parseFloat(item.price?.replace(',', '.') || 0)
      return sum + num
    }, 0)
    .toFixed(2)
    .replace('.', ',')

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
        {bagItems.length === 0 ? (
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
        ) : (
          <div className="bag-items-state">
            <div className="bag-items-list">
              {bagItems.map((item, idx) => (
                <div key={item.id || idx} className="bag-item-row">
                  <div className="bag-item-thumb-frame">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="bag-item-thumb"
                    />
                  </div>
                  <div className="bag-item-info">
                    <span className="bag-item-title">{item.title}</span>
                    <span className="bag-item-size">{item.size}</span>
                  </div>
                  <span className="bag-item-price">€{item.price}</span>
                </div>
              ))}
            </div>

            <div className="bag-footer">
              <div className="bag-total-row">
                <span className="bag-total-label">Total</span>
                <span className="bag-total-price">€{totalAmount}</span>
              </div>
              <button type="button" className="bag-checkout-btn">
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BagDropdown
