/**
 * Gallery Wall Layout Boundaries & Physics Configuration
 * Defines coordinates, cluster bounding boxes, and viewport finish lines.
 */

export const WALL_BOUNDS = {
  minX: 71,
  maxX: 3849,
  minY: 100,
  maxY: 3984,
}

export const FINISH_PADDING = {
  left: 90,   // Breathing room from screen left edge
  right: 90,  // Breathing room from screen right edge
  top: 100,   // Clean clearance below the fixed top navigation header
  bottom: 90, // Breathing room from screen bottom edge
}

// Initial center focal coordinates (Grand Hero Pavilion: Tier 3 Center)
export const INITIAL_CENTER = {
  x: 1960,
  y: 2042,
}

/**
 * Calculates current drag limits based on window viewport dimensions
 * ensuring paintings never get lost past finish-line boundaries.
 */
export function getDragLimits(vw = window.innerWidth, vh = window.innerHeight) {
  // Leftmost finish line (when canvas is dragged to the right, viewing left paintings)
  let maxTargetX = FINISH_PADDING.left - WALL_BOUNDS.minX
  // Rightmost finish line (when canvas is dragged to the left, viewing right paintings)
  let minTargetX = vw - WALL_BOUNDS.maxX - FINISH_PADDING.right

  if (minTargetX > maxTargetX) {
    const cx = (vw - (WALL_BOUNDS.maxX + WALL_BOUNDS.minX)) / 2
    minTargetX = maxTargetX = cx
  }

  // Top finish line (when canvas is dragged down, viewing top paintings below header)
  let maxTargetY = FINISH_PADDING.top - WALL_BOUNDS.minY
  // Bottom finish line (when canvas is dragged up, viewing bottom paintings)
  let minTargetY = vh - WALL_BOUNDS.maxY - FINISH_PADDING.bottom

  if (minTargetY > maxTargetY) {
    const cy = (vh - (WALL_BOUNDS.maxY + WALL_BOUNDS.minY)) / 2
    minTargetY = maxTargetY = cy
  }

  return { minTargetX, maxTargetX, minTargetY, maxTargetY }
}

