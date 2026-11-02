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

// Helpers for authentic aspect-ratio dimensions
// Horizontal assets are naturally 260x192; Vertical assets are naturally 260x352
const H = (w) => Math.round((w * 192) / 260)
const V = (w) => Math.round((w * 352) / 260)

// Expansive 5-tier x 5-column square gallery wall (~4800px width x ~4800px height)
// Exactly 10px gaps within clusters, 0 overlaps, and complete authentic frames
const masterPaintings = [
  // =========================================================================
  // TIER 1 (TOP ATELIERS) — Y: 100 to 1100
  // =========================================================================
  { id: 't1-c1-green-lady', title: 'Green Robe Lady', image: greenLadyImg, x: 60, y: 100, w: 220, h: V(220) },
  { id: 't1-c1-blue', title: 'Cobalt Study', image: blueImg, x: 290, y: 100, w: 140, h: V(140) },
  { id: 't1-c1-symbols', title: 'Graphic Still Life', image: symbolsImg, x: 290, y: 100 + V(140) + 10, w: 190, h: H(190) },
  { id: 't1-c1-lady-book', title: 'Reading Lady', image: ladyWithBookImg, x: 60, y: 100 + V(220) + 10, w: 180, h: V(180) },
  { id: 't1-c1-coat', title: 'Polka Coat', image: coatImg, x: 250, y: 440, w: 240, h: H(240) },
  { id: 't1-c1-dancing', title: 'Dancing Movement', image: dancingGirlImg, x: 250, y: 440 + H(240) + 10, w: 240, h: H(240) },
  { id: 't1-c1-abstract', title: 'Abstract Harmony', image: abstractImg, x: 500, y: 120, w: 320, h: H(320) },
  { id: 't1-c1-grass', title: 'Botanical Grass', image: grassImg, x: 500, y: 120 + H(320) + 10, w: 240, h: V(240) },
  { id: 't1-c1-blue-vert', title: 'Deep Cobalt', image: blueImg, x: 750, y: 120 + H(320) + 10, w: 170, h: V(170) },
  { id: 't1-c1-horse', title: 'Horse Sketch', image: horseImg, x: 60, y: 850, w: 260, h: H(260) },
  { id: 't1-c1-cat', title: 'Golden Feline', image: catPaintingImg, x: 330, y: 850, w: 180, h: V(180) },
  { id: 't1-c1-mount', title: 'Ridge Line', image: mountImg, x: 520, y: 850, w: 300, h: H(300) },

  { id: 't1-c2-top-blue', title: 'Blue Header Form', image: blueImg, x: 1110, y: 100, w: 150, h: V(150) },
  { id: 't1-c2-abstract', title: 'Abstract Ochre', image: abstractImg, x: 1020, y: 100 + V(150) + 10, w: 320, h: H(320) },
  { id: 't1-c2-grass', title: 'Botanical Foliage', image: grassImg, x: 1020, y: 100 + V(150) + 10 + H(320) + 10, w: 240, h: V(240) },
  { id: 't1-c2-shades', title: 'Shades Study', image: shadesImg, x: 1270, y: 100 + V(150) + 10 + H(320) + 10, w: 220, h: V(220) },
  { id: 't1-c2-birds', title: 'Celestial Birds', image: starsAndBirdsImg, x: 1350, y: 120, w: 220, h: V(220) },
  { id: 't1-c2-cat', title: 'Feline in Vase', image: catPaintingImg, x: 1580, y: 120, w: 200, h: V(200) },
  { id: 't1-c2-mount', title: 'Alpine Peak', image: mountImg, x: 1580, y: 120 + V(200) + 10, w: 320, h: H(320) },
  { id: 't1-c2-dancing', title: 'Dancing Solitude', image: dancingGirlImg, x: 1270, y: 100 + V(150) + 10 + H(320) + 10 + V(220) + 10, w: 260, h: H(260) },
  { id: 't1-c2-blue-grass', title: 'Blue Grass Melody', image: blueGrassImg, x: 1540, y: 120 + V(200) + 10 + H(320) + 10, w: 280, h: H(280) },

  { id: 't1-c3-friends', title: 'Friends Horizon', image: friendsImg, x: 2150, y: 100, w: 320, h: H(320) },
  { id: 't1-c3-shades', title: 'Shades Crimson', image: shadesImg, x: 2230, y: 100 + H(320) + 10, w: 240, h: V(240) },
  { id: 't1-c3-blue', title: 'Cobalt Curve', image: blueImg, x: 2040, y: 100 + H(320) + 10, w: 180, h: V(180) },
  { id: 't1-c3-birds', title: 'Stars and Birds', image: starsAndBirdsImg, x: 2480, y: 100, w: 220, h: V(220) },
  { id: 't1-c3-feline', title: 'Yellow Feline', image: catPaintingImg, x: 2480, y: 100 + V(220) + 10, w: 180, h: V(180) },
  { id: 't1-c3-mount', title: 'Mountain Peak', image: mountImg, x: 2480, y: 100 + V(220) + 10 + V(180) + 10, w: 320, h: H(320) },
  { id: 't1-c3-curly', title: 'Curly Silhouette', image: curlyLadyImg, x: 2810, y: 100, w: 230, h: V(230) },

  { id: 't1-c4-curly', title: 'Striped Silhouette', image: curlyLadyImg, x: 3100, y: 100, w: 240, h: V(240) },
  { id: 't1-c4-blue', title: 'Blue Edge Form', image: blueImg, x: 3100, y: 100 + V(240) + 10, w: 240, h: V(240) },
  { id: 't1-c4-green-wall', title: 'Green Wall Pattern', image: greenWallImg, x: 3350, y: 120, w: 220, h: V(220) },
  { id: 't1-c4-corner-blue', title: 'Corner Blue', image: blueImg, x: 3580, y: 150, w: 70, h: V(70) },
  { id: 't1-c4-dancing', title: 'Dancing Figure', image: dancingGirlImg, x: 3350, y: 120 + V(220) + 10, w: 220, h: H(220) },
  { id: 't1-c4-symbols', title: 'Still Life Ochre', image: symbolsImg, x: 3350, y: 120 + V(220) + 10 + H(220) + 10, w: 200, h: H(200) },
  { id: 't1-c4-blue-grass', title: 'Blue Grass Still Life', image: blueGrassImg, x: 3350, y: 120 + V(220) + 10 + H(220) + 10 + H(200) + 10, w: 280, h: H(280) },

  { id: 't1-c5-lady-green', title: 'Lady in Emerald', image: greenLadyImg, x: 3950, y: 100, w: 230, h: V(230) },
  { id: 't1-c5-blue-accent', title: 'Cobalt Portal', image: blueImg, x: 4190, y: 100, w: 160, h: V(160) },
  { id: 't1-c5-mount', title: 'Crested Summit', image: mountImg, x: 4190, y: 100 + V(160) + 10, w: 300, h: H(300) },
  { id: 't1-c5-birds', title: 'Avian Flight', image: starsAndBirdsImg, x: 4500, y: 100, w: 220, h: V(220) },
  { id: 't1-c5-tiny-blue', title: 'Mini Azure', image: blueImg, x: 4730, y: 140, w: 70, h: V(70) },
  { id: 't1-c5-friends', title: 'Twilight Reunion', image: friendsImg, x: 3950, y: 550, w: 310, h: H(310) },
  { id: 't1-c5-shades', title: 'Crimson Rhythm', image: shadesImg, x: 3950, y: 550 + H(310) + 10, w: 240, h: V(240) },
  { id: 't1-c5-horse', title: 'Galloping Form', image: horseImg, x: 4270, y: 550, w: 270, h: H(270) },
  { id: 't1-c5-feline', title: 'Cat and Blossom', image: catPaintingImg, x: 4550, y: 550, w: 210, h: V(210) },
  { id: 't1-c5-blue-grass', title: 'Verdant Horizon', image: blueGrassImg, x: 4480, y: 550 + V(210) + 10, w: 280, h: H(280) },

  // =========================================================================
  // TIER 2 (MID-HIGH SALONS) — Y: 1250 to 2150
  // =========================================================================
  { id: 't2-c1-abstract', title: 'Abstract Vista', image: abstractImg, x: 100, y: 1250, w: 320, h: H(320) },
  { id: 't2-c1-grass', title: 'Meadow Study', image: grassImg, x: 100, y: 1250 + H(320) + 10, w: 240, h: V(240) },
  { id: 't2-c1-blue', title: 'Cobalt Horizon', image: blueImg, x: 350, y: 1250 + H(320) + 10, w: 180, h: V(180) },
  { id: 't2-c1-coat', title: 'Spotted Pattern', image: coatImg, x: 100, y: 1250 + H(320) + 10 + V(240) + 10, w: 250, h: H(250) },
  { id: 't2-c1-lady-book', title: 'Reader in Ochre', image: ladyWithBookImg, x: 360, y: 1760, w: 180, h: V(180) },
  { id: 't2-c1-symbols', title: 'Modern Still Life', image: symbolsImg, x: 550, y: 1760, w: 200, h: H(200) },

  { id: 't2-c2-green-wall', title: 'Botanical Geometry', image: greenWallImg, x: 1100, y: 1250, w: 220, h: V(220) },
  { id: 't2-c2-friends', title: 'Companions', image: friendsImg, x: 1330, y: 1250, w: 310, h: H(310) },
  { id: 't2-c2-shades', title: 'Crimson Arc', image: shadesImg, x: 1330, y: 1250 + H(310) + 10, w: 240, h: V(240) },
  { id: 't2-c2-dancing', title: 'Figure in Motion', image: dancingGirlImg, x: 1650, y: 1250, w: 240, h: H(240) },
  { id: 't2-c2-horse', title: 'Running Steed', image: horseImg, x: 1650, y: 1250 + H(240) + 10, w: 260, h: H(260) },
  { id: 't2-c2-feline', title: 'Yellow Feline II', image: catPaintingImg, x: 1650, y: 1250 + H(240) + 10 + H(260) + 10, w: 190, h: V(190) },

  { id: 't2-c3-birds', title: 'Flight Patterns', image: starsAndBirdsImg, x: 2200, y: 1250, w: 240, h: V(240) },
  { id: 't2-c3-mount', title: 'High Summit', image: mountImg, x: 2450, y: 1250, w: 310, h: H(310) },
  { id: 't2-c3-blue', title: 'Cobalt Form II', image: blueImg, x: 2450, y: 1250 + H(310) + 10, w: 220, h: V(220) },
  { id: 't2-c3-curly', title: 'Striped Silhouette II', image: curlyLadyImg, x: 2680, y: 1250 + H(310) + 10, w: 230, h: V(230) },

  { id: 't2-c4-grass', title: 'Tall Grass', image: grassImg, x: 3150, y: 1250, w: 240, h: V(240) },
  { id: 't2-c4-blue-grass', title: 'Azure Meadow', image: blueGrassImg, x: 3400, y: 1250, w: 280, h: H(280) },
  { id: 't2-c4-dancing', title: 'Joyful Figure', image: dancingGirlImg, x: 3400, y: 1250 + H(280) + 10, w: 250, h: H(250) },
  { id: 't2-c4-green-lady', title: 'Emerald Lady II', image: greenLadyImg, x: 3150, y: 1250 + V(240) + 10, w: 220, h: V(220) },

  { id: 't2-c5-coat', title: 'Dark Coat Study', image: coatImg, x: 4000, y: 1250, w: 260, h: H(260) },
  { id: 't2-c5-abstract', title: 'Prismatic Landscape', image: abstractImg, x: 4270, y: 1250, w: 300, h: H(300) },
  { id: 't2-c5-feline', title: 'Window Cat', image: catPaintingImg, x: 4000, y: 1250 + H(260) + 10, w: 200, h: V(200) },
  { id: 't2-c5-lady-book', title: 'Reader Study', image: ladyWithBookImg, x: 4210, y: 1250 + H(300) + 10, w: 180, h: V(180) },
  { id: 't2-c5-symbols', title: 'Table Composition', image: symbolsImg, x: 4400, y: 1250 + H(300) + 10, w: 200, h: H(200) },

  // =========================================================================
  // TIER 3: GRAND CENTRAL GALLERY — USER'S HERO PAVILION AT CENTER (Y: 2250 to 3250)
  // =========================================================================
  { id: 'hero-top-accent-blue', title: 'Azure Echo', image: blueImg, x: 2270, y: 2280, w: 150, h: V(150) },
  { id: 'hero-horizontal', title: 'Friends Horizon', image: friendsImg, x: 2180, y: 2500, w: 320, h: H(320) }, // 10px gap below accent blue
  { id: 'hero-left-blue', title: 'Cobalt Curve', image: blueImg, x: 2070, y: 2500 + H(320) + 10, w: 180, h: V(180) }, // 10px gap left of hero-red
  { id: 'hero-red', title: 'Shades Crimson', image: shadesImg, x: 2260, y: 2500 + H(320) + 10, w: 240, h: V(240) }, // 10px gap below hero-horizontal
  { id: 'hero-tiny-blue', title: 'Mini Cobalt', image: blueImg, x: 2420, y: 2500 + H(320) + 10 + V(240) + 10, w: 80, h: V(80) }, // 10px gap below hero-red
  { id: 'hero-horse', title: 'Horse Study', image: horseImg, x: 2240, y: 2500 + H(320) + 10 + V(240) + 10 + V(80) + 10, w: 260, h: H(260) }, // 10px gap below tiny-blue
  { id: 'hero-upper-red', title: 'Stars and Birds', image: starsAndBirdsImg, x: 2510, y: 2340, w: 220, h: V(220) }, // 10px gap right of hero center
  { id: 'hero-mid-yellow', title: 'Yellow Feline', image: catPaintingImg, x: 2510, y: 2340 + V(220) + 10, w: 180, h: V(180) }, // 10px gap below upper-red
  { id: 'hero-bot-mount', title: 'Mountain Peak', image: mountImg, x: 2510, y: 2340 + V(220) + 10 + V(180) + 10, w: 320, h: H(320) }, // 10px gap below mid-yellow
  { id: 'hero-top-pink', title: 'Curly Silhouette', image: curlyLadyImg, x: 2850, y: 2320, w: 230, h: V(230) },
  { id: 'hero-mid-blue', title: 'Blue Edge Form', image: blueImg, x: 2850, y: 2320 + V(230) + 10, w: 230, h: V(230) },

  { id: 't3-left-green-lady', title: 'Emerald Lady III', image: greenLadyImg, x: 100, y: 2350, w: 220, h: V(220) },
  { id: 't3-left-blue', title: 'Cobalt Portal', image: blueImg, x: 330, y: 2350, w: 160, h: V(160) },
  { id: 't3-left-abstract', title: 'Horizon Glow', image: abstractImg, x: 550, y: 2350, w: 310, h: H(310) },
  { id: 't3-left-lady-book', title: 'Quiet Reader', image: ladyWithBookImg, x: 100, y: 2350 + V(220) + 10, w: 180, h: V(180) },
  { id: 't3-left-symbols', title: 'Ochre Study', image: symbolsImg, x: 330, y: 2350 + V(160) + 10, w: 200, h: H(200) },
  { id: 't3-left-grass', title: 'Wild Botanical', image: grassImg, x: 550, y: 2350 + H(310) + 10, w: 240, h: V(240) },

  { id: 't3-midl-coat', title: 'Polka Garment', image: coatImg, x: 1100, y: 2350, w: 250, h: H(250) },
  { id: 't3-midl-dancing', title: 'Solo Dancer', image: dancingGirlImg, x: 1360, y: 2350, w: 240, h: H(240) },
  { id: 't3-midl-mount', title: 'Alpine Ridge', image: mountImg, x: 1610, y: 2350, w: 300, h: H(300) },
  { id: 't3-midl-feline', title: 'Cat Portrait', image: catPaintingImg, x: 1100, y: 2350 + H(250) + 10, w: 190, h: V(190) },
  { id: 't3-midl-green-wall', title: 'Emerald Grid', image: greenWallImg, x: 1300, y: 2350 + H(240) + 10, w: 220, h: V(220) },

  { id: 't3-midr-green-wall', title: 'Foliage Form', image: greenWallImg, x: 3200, y: 2350, w: 220, h: V(220) },
  { id: 't3-midr-corner-blue', title: 'Corner Azure', image: blueImg, x: 3430, y: 2380, w: 70, h: V(70) },
  { id: 't3-midr-dancing', title: 'Dancer Study', image: dancingGirlImg, x: 3200, y: 2350 + V(220) + 10, w: 220, h: H(220) },
  { id: 't3-midr-symbols', title: 'Still Life Graphic', image: symbolsImg, x: 3200, y: 2350 + V(220) + 10 + H(220) + 10, w: 200, h: H(200) },
  { id: 't3-midr-blue-grass', title: 'Blue Grass Melody', image: blueGrassImg, x: 3200, y: 2350 + V(220) + 10 + H(220) + 10 + H(200) + 10, w: 280, h: H(280) },
  { id: 't3-midr-curly', title: 'Silhouette Profile', image: curlyLadyImg, x: 3500, y: 2350, w: 240, h: V(240) },

  { id: 't3-far-right-lady', title: 'Emerald Figure', image: greenLadyImg, x: 3950, y: 2350, w: 230, h: V(230) },
  { id: 't3-far-right-blue', title: 'Deep Cobalt Portal', image: blueImg, x: 4190, y: 2350, w: 160, h: V(160) },
  { id: 't3-far-right-mount', title: 'Crested Ridge', image: mountImg, x: 4190, y: 2350 + V(160) + 10, w: 300, h: H(300) },
  { id: 't3-far-right-birds', title: 'Soaring Flock', image: starsAndBirdsImg, x: 4500, y: 2350, w: 220, h: V(220) },
  { id: 't3-far-right-tiny', title: 'Accent Azure', image: blueImg, x: 4730, y: 2390, w: 70, h: V(70) },

  // =========================================================================
  // TIER 4 (MID-LOW PAVILIONS) — Y: 3400 to 4150
  // =========================================================================
  { id: 't4-c1-horse', title: 'Steed in Motion', image: horseImg, x: 100, y: 3400, w: 260, h: H(260) },
  { id: 't4-c1-cat', title: 'Ochre Feline', image: catPaintingImg, x: 420, y: 3400, w: 190, h: V(190) },
  { id: 't4-c1-mount', title: 'Glacier Crest', image: mountImg, x: 620, y: 3400, w: 300, h: H(300) },
  { id: 't4-c1-friends', title: 'Two Companions', image: friendsImg, x: 100, y: 3400 + H(260) + 10, w: 310, h: H(310) },
  { id: 't4-c1-shades', title: 'Crimson Sunset', image: shadesImg, x: 100, y: 3400 + H(260) + 10 + H(310) + 10, w: 240, h: V(240) },

  { id: 't4-c2-blue', title: 'Cobalt Arch', image: blueImg, x: 1100, y: 3400, w: 160, h: V(160) },
  { id: 't4-c2-abstract', title: 'Color Field', image: abstractImg, x: 1270, y: 3400, w: 310, h: H(310) },
  { id: 't4-c2-birds', title: 'Evening Birds', image: starsAndBirdsImg, x: 1590, y: 3400, w: 220, h: V(220) },
  { id: 't4-c2-grass', title: 'Foliage Arc', image: grassImg, x: 1270, y: 3400 + H(310) + 10, w: 230, h: V(230) },
  { id: 't4-c2-coat', title: 'Coat in Repose', image: coatImg, x: 1510, y: 3400 + V(220) + 10, w: 240, h: H(240) },

  { id: 't4-c3-green-wall', title: 'Green Lattice', image: greenWallImg, x: 2150, y: 3450, w: 220, h: V(220) },
  { id: 't4-c3-friends', title: 'Friends in Crimson', image: friendsImg, x: 2380, y: 3450, w: 300, h: H(300) },
  { id: 't4-c3-dancing', title: 'Fluid Dance', image: dancingGirlImg, x: 2690, y: 3450, w: 240, h: H(240) },
  { id: 't4-c3-shades', title: 'Deep Crimson Field', image: shadesImg, x: 2380, y: 3450 + H(300) + 10, w: 240, h: V(240) },
  { id: 't4-c3-blue-grass', title: 'Azure Meadow II', image: blueGrassImg, x: 2690, y: 3450 + H(240) + 10, w: 270, h: H(270) },

  { id: 't4-c4-curly', title: 'Striped Silhouette III', image: curlyLadyImg, x: 3150, y: 3400, w: 230, h: V(230) },
  { id: 't4-c4-mount', title: 'Mountain Pass', image: mountImg, x: 3390, y: 3400, w: 310, h: H(310) },
  { id: 't4-c4-blue', title: 'Cobalt Window', image: blueImg, x: 3710, y: 3400, w: 170, h: V(170) },
  { id: 't4-c4-symbols', title: 'Graphic Geometry', image: symbolsImg, x: 3390, y: 3400 + H(310) + 10, w: 200, h: H(200) },
  { id: 't4-c4-cat', title: 'Quiet Feline', image: catPaintingImg, x: 3600, y: 3400 + H(310) + 10, w: 190, h: V(190) },

  { id: 't4-c5-green-lady', title: 'Emerald Robe', image: greenLadyImg, x: 4100, y: 3400, w: 220, h: V(220) },
  { id: 't4-c5-lady-book', title: 'Reading Solitude II', image: ladyWithBookImg, x: 4330, y: 3400, w: 180, h: V(180) },
  { id: 't4-c5-horse', title: 'Field Horse', image: horseImg, x: 4520, y: 3400, w: 260, h: H(260) },
  { id: 't4-c5-coat', title: 'Draped Robe', image: coatImg, x: 4330, y: 3400 + V(180) + 10, w: 240, h: H(240) },

  // =========================================================================
  // TIER 5 (BOTTOM ATELIERS) — Y: 4350 to 4877
  // =========================================================================
  { id: 't5-c1-abstract', title: 'Prismatic Vista II', image: abstractImg, x: 100, y: 4350, w: 320, h: H(320) },
  { id: 't5-c1-grass', title: 'Summer Flora', image: grassImg, x: 430, y: 4350, w: 230, h: V(230) },
  { id: 't5-c1-blue', title: 'Azure Curve', image: blueImg, x: 670, y: 4350, w: 160, h: V(160) },
  { id: 't5-c1-dancing', title: 'Evening Dance', image: dancingGirlImg, x: 100, y: 4350 + H(320) + 10, w: 250, h: H(250) },

  { id: 't5-c2-green-wall', title: 'Geometric Wall', image: greenWallImg, x: 1100, y: 4350, w: 220, h: V(220) },
  { id: 't5-c2-friends', title: 'Horizon Pair', image: friendsImg, x: 1330, y: 4350, w: 300, h: H(300) },
  { id: 't5-c2-mount', title: 'Alpine Peak II', image: mountImg, x: 1640, y: 4350, w: 310, h: H(310) },

  { id: 't5-c3-shades', title: 'Crimson Duet', image: shadesImg, x: 2200, y: 4350, w: 240, h: V(240) },
  { id: 't5-c3-birds', title: 'Night Birds', image: starsAndBirdsImg, x: 2450, y: 4350, w: 220, h: V(220) },
  { id: 't5-c3-cat', title: 'Feline in Solitude', image: catPaintingImg, x: 2680, y: 4350, w: 190, h: V(190) },
  { id: 't5-c3-horse', title: 'Nocturne Steed', image: horseImg, x: 2200, y: 4350 + V(240) + 10, w: 260, h: H(260) },

  { id: 't5-c4-curly', title: 'Striped Silhouette IV', image: curlyLadyImg, x: 3200, y: 4350, w: 230, h: V(230) },
  { id: 't5-c4-blue-grass', title: 'Blue Grass Study', image: blueGrassImg, x: 3440, y: 4350, w: 280, h: H(280) },
  { id: 't5-c4-coat', title: 'Night Coat', image: coatImg, x: 3440, y: 4350 + H(280) + 10, w: 240, h: H(240) },

  { id: 't5-c5-lady-green', title: 'Lady in Verdant', image: greenLadyImg, x: 4100, y: 4350, w: 220, h: V(220) },
  { id: 't5-c5-blue-accent', title: 'Cobalt Portal II', image: blueImg, x: 4330, y: 4350, w: 160, h: V(160) },
  { id: 't5-c5-symbols', title: 'Still Life Finale', image: symbolsImg, x: 4500, y: 4350, w: 200, h: H(200) },
  { id: 't5-c5-mount', title: 'Sunset Peak', image: mountImg, x: 4330, y: 4350 + V(160) + 10, w: 300, h: H(300) },
]

// Bounding box of the grand square master wall (~4740px width x ~4777px height)
const WALL_BOUNDS = {
  minX: 60,
  maxX: 4800, // rightmost edge
  minY: 100,
  maxY: 4877, // bottom-most edge (y: 4350 + h: 527)
}

// Generous finish-line margins ensuring NO painting is ever cut off at the finish points
const FINISH_PADDING = {
  left: 90,   // Breathing room from screen left edge
  right: 90,  // Breathing room from screen right edge
  top: 100,   // Clean clearance below the fixed top navigation header
  bottom: 90, // Breathing room from screen bottom edge
}

function getDragLimits() {
  const vw = window.innerWidth
  const vh = window.innerHeight

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

function App() {
  const viewportRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    // 1. Initialize Locomotive Scroll
    const locomotiveScroll = new LocomotiveScroll()

    let limits = getDragLimits()

    // 2. Position canvas centered on the Grand Hero Pavilion (Tier 3 Center) on initial load
    const centerClusterX = 2390
    const centerClusterY = 2750
    let initialX = window.innerWidth / 2 - centerClusterX
    let initialY = window.innerHeight / 2 - centerClusterY

    // Clamp initial position within finish-line limits
    initialX = Math.max(limits.minTargetX, Math.min(limits.maxTargetX, initialX))
    initialY = Math.max(limits.minTargetY, Math.min(limits.maxTargetY, initialY))

    let targetX = initialX
    let targetY = initialY
    let currentX = initialX
    let currentY = initialY
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
      let dx = e.clientX - lastPointerX
      let dy = e.clientY - lastPointerY

      // Tactile elastic resistance if pulling past the finish lines
      if ((targetX > limits.maxTargetX && dx > 0) || (targetX < limits.minTargetX && dx < 0)) {
        dx *= 0.3
      }
      if ((targetY > limits.maxTargetY && dy > 0) || (targetY < limits.minTargetY && dy < 0)) {
        dy *= 0.3
      }

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

    // Dynamic viewport resize recalculation
    const onResize = () => {
      limits = getDragLimits()
    }

    // Attach interaction listeners
    viewport.addEventListener('pointerdown', onPointerDown, { passive: true })
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerup', onPointerUp, { passive: true })
    window.addEventListener('pointercancel', onPointerUp, { passive: true })
    viewport.addEventListener('wheel', onWheel, { passive: false })
    viewport.addEventListener('dragstart', onDragStart)
    window.addEventListener('resize', onResize)

    // GSAP Ticker: 120 FPS Buttery Physics, Momentum Slip & Finish-Line Bounded Spring Stop
    const tickerUpdate = () => {
      if (!isPointerDown) {
        // Silky momentum slip friction decay
        targetX += velX
        targetY += velY

        velX *= 0.945
        velY *= 0.945

        if (Math.abs(velX) < 0.005) velX = 0
        if (Math.abs(velY) < 0.005) velY = 0

        // Smooth finish-line spring stop (cushions momentum and halts cleanly at boundary)
        if (targetX < limits.minTargetX) {
          targetX += (limits.minTargetX - targetX) * 0.16
          velX *= 0.6
        } else if (targetX > limits.maxTargetX) {
          targetX += (limits.maxTargetX - targetX) * 0.16
          velX *= 0.6
        }

        if (targetY < limits.minTargetY) {
          targetY += (limits.minTargetY - targetY) * 0.16
          velY *= 0.6
        } else if (targetY > limits.maxTargetY) {
          targetY += (limits.maxTargetY - targetY) * 0.16
          velY *= 0.6
        }
      }

      // Buttery smooth lerp damping
      currentX += (targetX - currentX) * 0.092
      currentY += (targetY - currentY) * 0.092

      canvas.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0)`
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
      window.removeEventListener('resize', onResize)
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

      {/* 3. Bounded Drag Art Wall Viewport with Finish Lines */}
      <main
        ref={viewportRef}
        id="gallery-viewport"
        className="gallery-viewport"
        aria-label="Interactive Art Gallery Wall"
      >
        <div ref={canvasRef} className="gallery-canvas">
          {masterPaintings.map((painting) => (
            <figure
              key={painting.id}
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
      </main>
    </div>
  )
}

export default App
