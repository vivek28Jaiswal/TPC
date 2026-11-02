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
const TILE_WIDTH = 2240
const TILE_HEIGHT = 1300

// Painting layout with exact 10px gaps between adjacent artworks in groups
const masterPaintings = [
  // --- Center Cluster ---
  { id: 'center-horizontal', title: 'Friends Horizon', image: friendsImg, x: 900, y: 360, w: 320, h: 236 },
  { id: 'center-red', title: 'Shades Crimson', image: shadesImg, x: 980, y: 606, w: 240, h: 325 }, // 10px gap from center-horiz bottom
  { id: 'center-left-blue', title: 'Cobalt Curve', image: blueImg, x: 795, y: 606, w: 175, h: 237 }, // 10px gap from center-red left
  { id: 'center-tiny-blue', title: 'Mini Cobalt', image: blueImg, x: 1150, y: 941, w: 70, h: 95 }, // 10px gap from center-red bottom

  // --- Right of Center Cluster ---
  { id: 'upper-right-red', title: 'Stars and Birds', image: starsAndBirdsImg, x: 1230, y: 180, w: 240, h: 325 }, // 10px gap from center right
  { id: 'middle-right-yellow', title: 'Yellow Feline', image: catPaintingImg, x: 1230, y: 515, w: 175, h: 237 }, // 10px gap from upper-right-red
  { id: 'bottom-right-mount', title: 'Mountain Peak', image: mountImg, x: 1230, y: 762, w: 320, h: 236 }, // 10px gap from middle-right-yellow

  // --- Far Right Cluster ---
  { id: 'top-right-pink', title: 'Striped Silhouette', image: curlyLadyImg, x: 1590, y: 100, w: 240, h: 325 },
  { id: 'far-right-blue', title: 'Blue Edge Form', image: blueImg, x: 1590, y: 435, w: 240, h: 325 }, // 10px gap from top-right-pink

  // --- Right Peripheral ---
  { id: 'green-wall', title: 'Green Wall Pattern', image: greenWallImg, x: 1870, y: 120, w: 220, h: 298 },
  { id: 'tiny-blue-corner', title: 'Corner Blue', image: blueImg, x: 2100, y: 160, w: 70, h: 95 }, // 10px gap from green-wall
  { id: 'dancing-girl', title: 'Dancing Figure', image: dancingGirlImg, x: 1870, y: 428, w: 220, h: 162 }, // 10px gap from green-wall bottom
  { id: 'symbols-yellow', title: 'Still Life Ochre', image: symbolsImg, x: 1870, y: 600, w: 200, h: 148 }, // 10px gap from dancing-girl
  { id: 'blue-grass-horiz', title: 'Blue Grass Still Life', image: blueGrassImg, x: 1850, y: 758, w: 280, h: 207 }, // 10px gap from symbols-yellow

  // --- Left Cluster ---
  { id: 'top-blue-snippet', title: 'Blue Header Accent', image: blueImg, x: 530, y: 140, w: 175, h: 90 },
  { id: 'top-left-horiz', title: 'Abstract Composition', image: abstractImg, x: 435, y: 240, w: 320, h: 236 }, // 10px gap from top-blue-snippet
  { id: 'bottom-left-green', title: 'Botanical Grass', image: grassImg, x: 435, y: 486, w: 240, h: 325 }, // 10px gap from top-left-horiz

  // --- Left Peripheral ---
  { id: 'green-lady', title: 'Green Robe Lady', image: greenLadyImg, x: 55, y: 80, w: 240, h: 325 },
  { id: 'top-left-accent-blue', title: 'Cobalt Accent', image: blueImg, x: 155, y: 415, w: 140, h: 189 }, // 10px gap from green-lady
  { id: 'lady-with-book', title: 'Reading Lady', image: ladyWithBookImg, x: 55, y: 614, w: 180, h: 244 },
  { id: 'symbols-graphic', title: 'Graphic Still Life', image: symbolsImg, x: 245, y: 614, w: 180, h: 133 }, // 10px gap from lady-with-book
  { id: 'coat-pattern', title: 'Coat Study', image: coatImg, x: 245, y: 757, w: 180, h: 133 }, // 10px gap from symbols-graphic & 10px gap from grass

  // --- Bottom Center Accent ---
  { id: 'horse-crimson', title: 'Horse Study', image: horseImg, x: 960, y: 1046, w: 240, h: 177 }, // 10px gap from center-tiny-blue
]

// 3x3 Tile Grid Offsets for seamless 2D infinite wrapping in all directions
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
    // 1. Initialize Locomotive Scroll for smooth scrolling environment
    const locomotiveScroll = new LocomotiveScroll()

    // 2. Buttery Smooth 2D Infinite Drag Physics
    // Initial center offset placing the central masterpiece cluster right into the viewport
    const initialCenterX = -(1120 - window.innerWidth / 2)
    const initialCenterY = -(650 - window.innerHeight / 2)

    let targetX = initialCenterX
    let targetY = initialCenterY
    let currentX = initialCenterX
    let currentY = initialCenterY
    let velX = 0
    let velY = 0

    let isPointerDown = false
    let lastPointerX = 0
    let lastPointerY = 0

    const viewport = viewportRef.current
    const canvas = canvasRef.current
    if (!viewport || !canvas) return

    // Pointer Drag Handlers
    const onPointerDown = (e) => {
      // Ignore click on header navigation buttons
      if (e.target.closest('.header-nav') || e.target.closest('button')) return

      isPointerDown = true
      lastPointerX = e.clientX
      lastPointerY = e.clientY
      velX = 0
      velY = 0
      viewport.style.cursor = 'grabbing'
    }

    const onPointerMove = (e) => {
      if (!isPointerDown) return

      const dx = e.clientX - lastPointerX
      const dy = e.clientY - lastPointerY

      targetX += dx
      targetY += dy

      // Smooth velocity tracking for momentum release
      velX = velX * 0.35 + dx * 0.65
      velY = velY * 0.35 + dy * 0.65

      lastPointerX = e.clientX
      lastPointerY = e.clientY
    }

    const onPointerUp = () => {
      if (!isPointerDown) return
      isPointerDown = false
      viewport.style.cursor = 'grab'
    }

    // Wheel / Trackpad smooth panning
    const onWheel = (e) => {
      e.preventDefault()

      targetX -= e.deltaX * 1.15
      targetY -= e.deltaY * 1.15

      velX = -e.deltaX * 0.22
      velY = -e.deltaY * 0.22
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

    // GSAP Ticker for 120 FPS Buttery Smooth Physics & Modulo Infinite Wrapping
    const tickerUpdate = () => {
      if (!isPointerDown) {
        // Apply inertia with silky smooth friction
        targetX += velX
        targetY += velY

        velX *= 0.94
        velY *= 0.94

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
