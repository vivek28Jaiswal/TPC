import { useEffect } from 'react'

/**
 * Hook to trigger a callback when a click/pointerdown occurs outside the referenced element,
 * or when the user presses the 'Escape' key.
 *
 * @param {import('react').RefObject} ref - Ref to the element to watch
 * @param {Function} handler - Callback to execute on outside click or Escape
 * @param {boolean} [isActive=true] - Whether the listener should be active
 */
export function useClickOutside(ref, handler, isActive = true) {
  useEffect(() => {
    if (!isActive) return

    const handlePointerDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        handler(e)
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handler(e)
      }
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [ref, handler, isActive])
}

export default useClickOutside

