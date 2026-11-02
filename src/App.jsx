import { useEffect, useRef } from 'react'
import LocomotiveScroll from 'locomotive-scroll'
import gsap from 'gsap'
import './App.css'

// Required assets imported directly from project assets folder
import abstractImg from './assets/image-paintings/abstract.png'
import blueGrassImg from './assets/image-paintings/blue grass.png'
import blueImg from './assets/image-paintings/blue.png'
import catPaintingImg from './assets/image-paintings/cat-painting.png'
import coatImg from './assets/image-paintings/coat.png'
import curlyLadyImg from './assets/image-paintings/curly lady.png'
import dancingGirlImg from './assets/image-paintings/dancing girl.png'
import friendsImg from './assets/image-paintings/friends.png'
import grassImg from './assets/image-paintings/grass.png'
import greenLadyImg from './assets/image-paintings/green lady.png'
import greenWallImg from './assets/image-paintings/green-wall.png'
import horseImg from './assets/image-paintings/horse.png'
import ladyWithBookImg from './assets/image-paintings/lady with book.png'
import mountImg from './assets/image-paintings/mount.png'
import shadesImg from './assets/image-paintings/shades.png'
import shadowImg from './assets/image-paintings/Shadow.png'
import starsAndBirdsImg from './assets/image-paintings/stars and birds.png'
import symbolsImg from './assets/image-paintings/symbols.png'

// Dimensions of a single master cluster tile for infinite wrapping
const TILE_WIDTH = 2280
const TILE_HEIGHT = 1320

// Painting layout with exact 10px gaps, zero overlaps, and complete authentic frames (no cutouts)
const masterPaintings = [
  // --- Center Cluster ---
  { id: 'center-horizontal', title: 'Friends Horizon', image: friendsImg, x: 940, y: 350, w: 320, h: 236 },
  { id: 'center-red', title: 'Shades Crimson', image: shadesImg, x: 1020, y: 596, w: 240, h: 325 }, // 10px gap from center-horiz bottom
  { id: 'center-left-blue', title: 'Cobalt Curve', image: blueImg, x: 830, y: 596, w: 180, h: 244 }, // 10px gap from center-red left
  { id: 'center-tiny-blue', title: 'Mini Cobalt', image: blueImg, x: 1180, y: 931, w: 80, h: 108 }, // 10px gap from center-red bottom
  { id: 'horse-crimson', title: 'Horse Study', image: horseImg, x: 1000, y: 1049, w: 260, h: 192 }, // 10px gap from center-tiny-blue bottom

  // --- Right of Center Cluster ---
  { id: 'upper-right-red', title: 'Stars and Birds', image: starsAndBirdsImg, x: 1270, y: 160, w: 220, h: 298 }, // 10px gap from center right
  { id: 'middle-right-yellow', title: 'Yellow Feline', image: catPaintingImg, x: 1270, y: 468, w: 180, h: 244 }, // 10px gap from upper-right-red bottom
  { id: 'bottom-right-mount', title: 'Mountain Peak', image: mountImg, x: 1270, y: 722, w: 320, h: 236 }, // 10px gap from middle-right-yellow bottom

  // --- Far Right Cluster ---
  { id: 'top-right-pink', title: 'Striped Silhouette', image: curlyLadyImg, x: 1660, y: 120, w: 240, h: 325 },
  { id: 'far-right-blue', title: 'Blue Edge Form', image: blueImg, x: 1660, y: 455, w: 240, h: 325 }, // 10px gap from top-right-pink bottom
  { id: 'green-wall', title: 'Green Wall Pattern', image: greenWallImg, x: 1910, y: 140, w: 220, h: 298 }, // 10px gap from far-right cluster
  { id: 'tiny-blue-corner', title: 'Corner Blue', image: blueImg, x: 2140, y: 180, w: 70, h: 95 }, // 10px gap from green-wall right
  { id: 'dancing-girl', title: 'Dancing Figure', image: dancingGirlImg, x: 1910, y: 448, w: 220, h: 162 }, // 10px gap from green-wall bottom
  { id: 'symbols-yellow', title: 'Still Life Ochre', image: symbolsImg, x: 1910, y: 620, w: 200, h: 148 }, // 10px gap from dancing-girl bottom
  { id: 'blue-grass-horiz', title: 'Blue Grass Still Life', image: blueGrassImg, x: 1910, y: 778, w: 280, h: 207 }, // 10px gap from symbols-yellow bottom & 10px from far-right-blue

  // --- Left Cluster ---
  { id: 'top-blue-vertical', title: 'Blue Header Form', image: blueImg, x: 525, y: 17, w: 150, h: 203 }, // Complete unclipped painting
  { id: 'top-left-horiz', title: 'Abstract Composition', image: abstractImg, x: 440, y: 230, w: 320, h: 236 }, // 10px gap from top-blue bottom
  { id: 'bottom-left-green', title: 'Botanical Grass', image: grassImg, x: 440, y: 476, w: 240, h: 325 }, // 10px gap from top-left-horiz bottom

  // --- Far Left Cluster ---
  { id: 'green-lady', title: 'Green Robe Lady', image: greenLadyImg, x: 30, y: 100, w: 220, h: 298 },
  { id: 'top-left-accent-blue', title: 'Cobalt Accent', image: blueImg, x: 260, y: 160, w: 140, h: 190 }, // 10px gap from green-lady right
  { id: 'lady-with-book', title: 'Reading Lady', image: ladyWithBookImg, x: 10, y: 520, w: 170, h: 230 },
  { id: 'symbols-graphic', title: 'Graphic Still Life', image: symbolsImg, x: 190, y: 472, w: 200, h: 148 }, // 10px gap from lady-with-book right
  { id: 'coat-pattern', title: 'Coat Study', image: coatImg, x: 190, y: 630, w: 240, h: 177 }, // 10px gap from symbols bottom & 10px from grass left
]

// 3x3 Tile Matrix for continuous, seamless 2D infinite wrapping
const TILES = [
  { col: -1, row: -1 },
  { col: 0, row: -1 },
  { col: 1, row: -1 },
  { col: -1, row: 0 },
  { col: 0, row: 0 },
  { col: 1, row: 0 },
  { col: -1, row: 1 },
  { col: 0, row: 1 },
  { col: 1, row: 1 },
]

function App() {
  const viewportRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    // 1. Initialize Locomotive Scroll
    const locomotiveScroll = new LocomotiveScroll()

    // 2. Position canvas centered on the main gallery cluster
    const initialCenterX = -(1100 - window.innerWidth / 2)
    const initialCenterY = -(620 - window.innerHeight / 2)

    let targetX = initialCenterX
    let targetY = initialCenterY
    let currentX = initialCenterX
    let currentY = initialCenterY
    let velX = 0
    let velY = 0

    let isPointerDown = false
    let lastPointerX = 0
    let lastPointerY = 0

    // High-resolution motion history buffer for calculating release "slip" inertia
    const motionHistory = []

    const viewport = viewportRef.current
    const canvas = canvasRef.current
    if (!viewport || !canvas) return

    // Pointer Drag Handlers
    const onPointerDown = (e) => {
      // Do not hijack clicks on navigation buttons
      if (e.target.closest('.header-nav') || e.target.closest('button')) return

      isPointerDown = true
      lastPointerX = e.clientX
      lastPointerY = e.clientY
      velX = 0
      velY = 0

      // Reset motion history with initial point
      motionHistory.length = 0
      motionHistory.push({ x: e.clientX, y: e.clientY, time: performance.now() })

      viewport.style.cursor = 'grabbing'
    }

    const onPointerMove = (e) => {
      if (!isPointerDown) return

      const now = performance.now()
      const dx = e.clientX - lastPointerX
      const dy = e.clientY - lastPointerY

      targetX += dx
      targetY += dy

      // Push into motion history buffer (keep last 120ms of events)
      motionHistory.push({ x: e.clientX, y: e.clientY, time: now })
      while (motionHistory.length > 0 && now - motionHistory[0].time > 120) {
        motionHistory.shift()
      }

      lastPointerX = e.clientX
      lastPointerY = e.clientY
    }

    const onPointerUp = () => {
      if (!isPointerDown) return
      isPointerDown = false
      viewport.style.cursor = 'grab'

      // Calculate the luxurious "slidly slip" momentum after-effect
      const now = performance.now()
      // Filter out points older than 100ms
      while (motionHistory.length > 0 && now - motionHistory[0].time > 100) {
        motionHistory.shift()
      }

      if (motionHistory.length >= 2) {
        const oldest = motionHistory[0]
        const newest = motionHistory[motionHistory.length - 1]
        const dt = Math.max(16, newest.time - oldest.time)
        const vx = (newest.x - oldest.x) / dt
        const vy = (newest.y - oldest.y) / dt

        // Kinetic fling boost creating that buttery slip slide
        velX = vx * 22
        velY = vy * 22
      }
    }

    // Wheel / Trackpad smooth panning with silky slip
    const onWheel = (e) => {
      e.preventDefault()

      targetX -= e.deltaX * 1.15
      targetY -= e.deltaY * 1.15

      velX = -e.deltaX * 0.28
      velY = -e.deltaY * 0.28
    }

    // Prevent default ghost image dragging
    const onDragStart = (e) => {
      e.preventDefault()
    }

    // Attach interaction listeners
    viewport.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerup', onPointerUp, { passive: true })
    window.addEventListener('pointercancel', onPointerUp, { passive: true })
    viewport.addEventListener('wheel', onWheel, { passive: false })
    viewport.addEventListener('dragstart', onDragStart)

    // GSAP Ticker: 120 FPS Buttery Physics, Momentum Slip & 2D Infinite Modulo Wrapping
    const tickerUpdate = () => {
      if (!isPointerDown) {
        // Silky momentum slip friction decay (0.958 gives a sustained, effortless glide)
        targetX += velX
        targetY += velY

        velX *= 0.958
        velY *= 0.958

        if (Math.abs(velX) < 0.005) velX = 0
        if (Math.abs(velY) < 0.005) velY = 0
      }

      // Buttery smooth lerp damping
      currentX += (targetX - currentX) * 0.088
      currentY += (targetY - currentY) * 0.088

      // Continuous 2D infinite wrapping modulo calculation
      const wrappedX = ((currentX % TILE_WIDTH) + TILE_WIDTH) % TILE_WIDTH - TILE_WIDTH
      const wrappedY = ((currentY % TILE_HEIGHT) + TILE_HEIGHT) % TILE_HEIGHT - TILE_HEIGHT

      canvas.style.transform = `translate3d(${wrappedX.toFixed(2)}px, ${wrappedY.toFixed(2)}px, 0)`
    }

    gsap.ticker.add(tickerUpdate)

    // Cleanup on unmount
    return () => {
      locomotiveScroll.destroy()
      gsap.ticker.remove(tickerUpdate)
      viewport.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      viewport.removeEventListener('wheel', onWheel)
      viewport.removeEventListener('dragstart', onDragStart)
    }
  }, [])

  return (
    <div className="page-container">
      {/* 1. Header & Navigation (Fixed at top) */}
      <header className="header-nav">
        <h1 id="brand-logo" className="brand-logo">
          THE POSTER CLUB
        </h1>

        <nav className="nav-actions" aria-label="Main menu">
          <button id="btn-menu" type="button" className="btn-menu">
            Menu
          </button>
          <button id="btn-shop-artworks" type="button" className="btn-accent">
            Shop Artworks
          </button>
          <button id="btn-bag" type="button" className="btn-accent">
            BAG (0)
          </button>
        </nav>
      </header>

      {/* 2. Soft Ambient Sunlight Window Shadow Overlay */}
      <div
        className="ambient-shadow-layer"
        style={{ backgroundImage: `url(${shadowImg})` }}
        aria-hidden="true"
      />

      {/* 3. Buttery Infinite Drag Art Wall Viewport */}
      <main
        ref={viewportRef}
        id="infinite-viewport"
        className="infinite-viewport"
        aria-label="Interactive Infinite Art Gallery Wall"
      >
        <div ref={canvasRef} className="infinite-canvas">
          {TILES.map(({ col, row }) => (
            <div
              key={`tile-${col}-${row}`}
              className="cluster-tile"
              style={{
                transform: `translate3d(${col * TILE_WIDTH}px, ${row * TILE_HEIGHT}px, 0)`,
              }}
              aria-hidden={col !== 0 || row !== 0}
            >
              {masterPaintings.map((painting) => (
                <figure
                  key={`${col}-${row}-${painting.id}`}
                  className="painting-item"
                  style={{
                    left: `${painting.x}px`,
                    top: `${painting.y}px`,
                    width: `${painting.w}px`,
                    height: `${painting.h}px`,
                  }}
                >
                  <img
                    src={painting.image}
                    alt={painting.title}
                    loading="eager"
                    decoding="async"
                  />
                </figure>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App
