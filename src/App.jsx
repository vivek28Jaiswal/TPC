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
const _H = (w) => Math.round((w * 192) / 260)
const _V = (w) => Math.round((w * 352) / 260)

function DragIcon(props) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M19 7.92969V16.5011C19 19.0011 17.4 20.5011 15 20.5011H10.3789C9.81826 20.5011 9.28432 20.2658 8.9055 19.8526L5.1216 15.7247C4.47127 15.0152 4.41845 13.9432 4.99591 13.1732L7 10.5011"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
      <path
        d="M16 8.49665V7.92522C16 5.63951 19 5.63951 19 7.92522"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
      <path
        d="M16 8.49971V7.92828V7.02679C16 4.74107 13 4.74107 13 7.02679M13 6.49971V7.02679M13 7.02679V8.49971"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
      <path
        d="M10 8.50335V6.50335C10 4.21763 13 4.21763 13 6.50335V7.03042V8.50335"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
      <path
        d="M7 13.5027V6.50275C7 5.67432 7.67157 5.00275 8.5 5.00275C9.32843 5.00275 10 5.55795 10 6.38638V6.50275V8.50275"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
    </svg>
  )
}

// Expansive 5-tier x 5-column square gallery wall (~4800px width x ~4800px height)
// Exactly 10px gaps within clusters, 0 overlaps, and complete authentic frames
const masterPaintings = [
  { id: 'p-0-1-1', title: 'Cobalt Study', image: blueImg, x: 521, y: 152, w: 210, h: 284 },
  { id: 'p-0-2-2', title: 'Abstract Harmony', image: abstractImg, x: 795, y: 211, w: 285, h: 210 },
  { id: 'p-0-3-3', title: 'Blue Grass Melody', image: blueGrassImg, x: 1165, y: 135, w: 240, h: 177 },
  { id: 'p-0-3-4', title: 'Golden Feline', image: catPaintingImg, x: 1325, y: 322, w: 80, h: 108 },
  { id: 'p-0-4-5', title: 'Curly Silhouette', image: curlyLadyImg, x: 1517, y: 140, w: 210, h: 284 },
  { id: 'p-0-5-6', title: 'Botanical Grass', image: grassImg, x: 1804, y: 182, w: 150, h: 203 },
  { id: 'p-0-5-7', title: 'Green Robe Lady', image: greenLadyImg, x: 1964, y: 192, w: 150, h: 203 },
  { id: 'p-0-6-8', title: 'Polka Coat', image: coatImg, x: 2155, y: 175, w: 285, h: 210 },
  { id: 'p-0-7-9', title: 'Dancing Movement', image: dancingGirlImg, x: 2505, y: 100, w: 225, h: 166 },
  { id: 'p-0-7-10', title: 'Companions', image: friendsImg, x: 2520, y: 276, w: 225, h: 166 },
  { id: 'p-0-8-11', title: 'Green Wall Geometry', image: greenWallImg, x: 2844, y: 124, w: 210, h: 284 },
  { id: 'p-1-0-12', title: 'Horse Sketch', image: horseImg, x: 71, y: 470, w: 265, h: 196 },
  { id: 'p-1-1-13', title: 'Reading Lady', image: ladyWithBookImg, x: 433, y: 460, w: 145, h: 196 },
  { id: 'p-1-1-14', title: 'Mountain Ridge', image: mountImg, x: 588, y: 480, w: 155, h: 114 },
  { id: 'p-1-2-15', title: 'Crimson Shades', image: shadesImg, x: 873, y: 535, w: 190, h: 257 },
  { id: 'p-1-3-16', title: 'Graphic Still Life', image: symbolsImg, x: 1189, y: 473, w: 210, h: 155 },
  { id: 'p-1-3-17', title: 'Abstract Harmony', image: abstractImg, x: 1189, y: 638, w: 210, h: 155 },
  { id: 'p-1-4-18', title: 'Blue Grass Melody', image: blueGrassImg, x: 1476, y: 562, w: 285, h: 210 },
  { id: 'p-1-5-19', title: 'Stars and Birds', image: starsAndBirdsImg, x: 1826, y: 527, w: 180, h: 244 },
  { id: 'p-1-5-20', title: 'Cobalt Study', image: blueImg, x: 2016, y: 627, w: 75, h: 102 },
  { id: 'p-1-6-21', title: 'Polka Coat', image: coatImg, x: 2173, y: 486, w: 240, h: 177 },
  { id: 'p-1-6-22', title: 'Golden Feline', image: catPaintingImg, x: 2333, y: 673, w: 80, h: 108 },
  { id: 'p-1-7-23', title: 'Curly Silhouette', image: curlyLadyImg, x: 2516, y: 489, w: 210, h: 284 },
  { id: 'p-1-8-24', title: 'Dancing Movement', image: dancingGirlImg, x: 2836, y: 526, w: 285, h: 210 },
  { id: 'p-1-9-25', title: 'Botanical Grass', image: grassImg, x: 3177, y: 525, w: 135, h: 183 },
  { id: 'p-1-9-26', title: 'Green Robe Lady', image: greenLadyImg, x: 3322, y: 535, w: 135, h: 183 },
  { id: 'p-2-0-27', title: 'Green Wall Geometry', image: greenWallImg, x: 76, y: 816, w: 230, h: 311 },
  { id: 'p-2-1-28', title: 'Companions', image: friendsImg, x: 500, y: 810, w: 225, h: 166 },
  { id: 'p-2-1-29', title: 'Horse Sketch', image: horseImg, x: 515, y: 986, w: 225, h: 166 },
  { id: 'p-2-2-30', title: 'Reading Lady', image: ladyWithBookImg, x: 802, y: 821, w: 135, h: 183 },
  { id: 'p-2-2-31', title: 'Crimson Shades', image: shadesImg, x: 947, y: 831, w: 135, h: 183 },
  { id: 'p-2-3-32', title: 'Mountain Ridge', image: mountImg, x: 1137, y: 811, w: 285, h: 210 },
  { id: 'p-2-4-33', title: 'Stars and Birds', image: starsAndBirdsImg, x: 1462, y: 945, w: 145, h: 196 },
  { id: 'p-2-4-34', title: 'Graphic Still Life', image: symbolsImg, x: 1617, y: 965, w: 155, h: 114 },
  { id: 'p-2-5-35', title: 'Cobalt Study', image: blueImg, x: 1866, y: 882, w: 190, h: 257 },
  { id: 'p-2-6-36', title: 'Abstract Harmony', image: abstractImg, x: 2166, y: 925, w: 265, h: 196 },
  { id: 'p-2-7-37', title: 'Blue Grass Melody', image: blueGrassImg, x: 2511, y: 810, w: 225, h: 166 },
  { id: 'p-2-7-38', title: 'Polka Coat', image: coatImg, x: 2526, y: 986, w: 225, h: 166 },
  { id: 'p-2-8-39', title: 'Golden Feline', image: catPaintingImg, x: 2841, y: 873, w: 180, h: 244 },
  { id: 'p-2-8-40', title: 'Curly Silhouette', image: curlyLadyImg, x: 3031, y: 973, w: 75, h: 102 },
  { id: 'p-2-9-41', title: 'Dancing Movement', image: dancingGirlImg, x: 3179, y: 894, w: 265, h: 196 },
  { id: 'p-2-10-42', title: 'Botanical Grass', image: grassImg, x: 3635, y: 839, w: 210, h: 284 },
  { id: 'p-3-0-43', title: 'Companions', image: friendsImg, x: 78, y: 1179, w: 240, h: 177 },
  { id: 'p-3-0-44', title: 'Green Robe Lady', image: greenLadyImg, x: 238, y: 1366, w: 80, h: 108 },
  { id: 'p-3-1-45', title: 'Green Wall Geometry', image: greenWallImg, x: 532, y: 1179, w: 210, h: 284 },
  { id: 'p-3-2-46', title: 'Horse Sketch', image: horseImg, x: 799, y: 1189, w: 285, h: 210 },
  { id: 'p-3-3-47', title: 'Reading Lady', image: ladyWithBookImg, x: 1154, y: 1176, w: 180, h: 244 },
  { id: 'p-3-3-48', title: 'Crimson Shades', image: shadesImg, x: 1344, y: 1276, w: 75, h: 102 },
  { id: 'p-3-4-49', title: 'Mountain Ridge', image: mountImg, x: 1508, y: 1165, w: 225, h: 166 },
  { id: 'p-3-4-50', title: 'Graphic Still Life', image: symbolsImg, x: 1523, y: 1341, w: 225, h: 166 },
  { id: 'p-3-5-51', title: 'Stars and Birds', image: starsAndBirdsImg, x: 1805, y: 1306, w: 145, h: 196 },
  { id: 'p-3-5-52', title: 'Abstract Harmony', image: abstractImg, x: 1960, y: 1326, w: 155, h: 114 },
  { id: 'p-3-6-53', title: 'Blue Grass Melody', image: blueGrassImg, x: 2178, y: 1205, w: 240, h: 177 },
  { id: 'p-3-6-54', title: 'Cobalt Study', image: blueImg, x: 2338, y: 1392, w: 80, h: 108 },
  { id: 'p-3-7-55', title: 'Golden Feline', image: catPaintingImg, x: 2529, y: 1234, w: 190, h: 257 },
  { id: 'p-3-8-56', title: 'Curly Silhouette', image: curlyLadyImg, x: 2834, y: 1262, w: 150, h: 203 },
  { id: 'p-3-8-57', title: 'Botanical Grass', image: grassImg, x: 2994, y: 1272, w: 150, h: 203 },
  { id: 'p-3-9-58', title: 'Polka Coat', image: coatImg, x: 3181, y: 1265, w: 265, h: 196 },
  { id: 'p-3-10-59', title: 'Dancing Movement', image: dancingGirlImg, x: 3609, y: 1165, w: 225, h: 166 },
  { id: 'p-3-10-60', title: 'Companions', image: friendsImg, x: 3624, y: 1341, w: 225, h: 166 },
  { id: 'p-4-0-61', title: 'Horse Sketch', image: horseImg, x: 77, y: 1583, w: 265, h: 196 },
  { id: 'p-4-1-62', title: 'Green Robe Lady', image: greenLadyImg, x: 415, y: 1566, w: 150, h: 203 },
  { id: 'p-4-1-63', title: 'Green Wall Geometry', image: greenWallImg, x: 575, y: 1576, w: 150, h: 203 },
  { id: 'p-4-2-64', title: 'Reading Lady', image: ladyWithBookImg, x: 818, y: 1548, w: 180, h: 244 },
  { id: 'p-4-2-65', title: 'Crimson Shades', image: shadesImg, x: 1008, y: 1648, w: 75, h: 102 },
  { id: 'p-4-3-66', title: 'Mountain Ridge', image: mountImg, x: 1176, y: 1520, w: 225, h: 166 },
  { id: 'p-4-3-67', title: 'Graphic Still Life', image: symbolsImg, x: 1191, y: 1696, w: 225, h: 166 },
  { id: 'p-4-4-68', title: 'Stars and Birds', image: starsAndBirdsImg, x: 1531, y: 1528, w: 210, h: 284 },
  { id: 'p-4-5-69', title: 'Abstract Harmony', image: abstractImg, x: 1820, y: 1531, w: 285, h: 210 },
  { id: 'p-4-6-70', title: 'Cobalt Study', image: blueImg, x: 2204, y: 1521, w: 190, h: 257 },
  { id: 'p-4-7-71', title: 'Golden Feline', image: catPaintingImg, x: 2492, y: 1656, w: 145, h: 196 },
  { id: 'p-4-7-72', title: 'Blue Grass Melody', image: blueGrassImg, x: 2647, y: 1676, w: 155, h: 114 },
  { id: 'p-4-8-73', title: 'Polka Coat', image: coatImg, x: 2845, y: 1646, w: 265, h: 196 },
  { id: 'p-4-9-74', title: 'Dancing Movement', image: dancingGirlImg, x: 3186, y: 1556, w: 240, h: 177 },
  { id: 'p-4-9-75', title: 'Curly Silhouette', image: curlyLadyImg, x: 3346, y: 1743, w: 80, h: 108 },
  { id: 'p-4-10-76', title: 'Botanical Grass', image: grassImg, x: 3522, y: 1581, w: 190, h: 257 },
  { id: 'p-5-0-77', title: 'Green Robe Lady', image: greenLadyImg, x: 85, y: 1890, w: 230, h: 311 },
  { id: 'p-5-1-78', title: 'Companions', image: friendsImg, x: 419, y: 1884, w: 210, h: 155 },
  { id: 'p-5-1-79', title: 'Horse Sketch', image: horseImg, x: 419, y: 2049, w: 210, h: 155 },
  { id: 'p-5-2-80', title: 'Mountain Ridge', image: mountImg, x: 839, y: 1940, w: 245, h: 181 },
  { id: 'p-5-3-81', title: 'Green Wall Geometry', image: greenWallImg, x: 1121, y: 1923, w: 145, h: 196 },
  { id: 'p-5-3-82', title: 'Graphic Still Life', image: symbolsImg, x: 1276, y: 1943, w: 155, h: 114 },
  { id: 'p-5-4-83', title: 'Reading Lady', image: ladyWithBookImg, x: 1496, y: 1900, w: 180, h: 244 },
  { id: 'p-5-4-84', title: 'Crimson Shades', image: shadesImg, x: 1686, y: 2000, w: 75, h: 102 },
  { id: 'p-5-5-85', title: 'Abstract Harmony', image: abstractImg, x: 1846, y: 1906, w: 245, h: 181 },
  { id: 'p-5-6-86', title: 'Blue Grass Melody', image: blueGrassImg, x: 2184, y: 1875, w: 225, h: 166 },
  { id: 'p-5-6-87', title: 'Polka Coat', image: coatImg, x: 2199, y: 2051, w: 225, h: 166 },
  { id: 'p-5-7-88', title: 'Stars and Birds', image: starsAndBirdsImg, x: 2523, y: 1876, w: 230, h: 311 },
  { id: 'p-5-8-89', title: 'Dancing Movement', image: dancingGirlImg, x: 2842, y: 2003, w: 285, h: 210 },
  { id: 'p-5-9-90', title: 'Cobalt Study', image: blueImg, x: 3183, y: 2010, w: 135, h: 183 },
  { id: 'p-5-9-91', title: 'Golden Feline', image: catPaintingImg, x: 3328, y: 2020, w: 135, h: 183 },
  { id: 'p-5-10-92', title: 'Companions', image: friendsImg, x: 3523, y: 1997, w: 265, h: 196 },
  { id: 'p-6-0-93', title: 'Curly Silhouette', image: curlyLadyImg, x: 73, y: 2325, w: 145, h: 196 },
  { id: 'p-6-0-94', title: 'Horse Sketch', image: horseImg, x: 228, y: 2345, w: 155, h: 114 },
  { id: 'p-6-1-95', title: 'Mountain Ridge', image: mountImg, x: 419, y: 2314, w: 265, h: 196 },
  { id: 'p-6-2-96', title: 'Botanical Grass', image: grassImg, x: 875, y: 2259, w: 210, h: 284 },
  { id: 'p-6-3-97', title: 'Graphic Still Life', image: symbolsImg, x: 1181, y: 2250, w: 240, h: 177 },
  { id: 'p-6-3-98', title: 'Green Robe Lady', image: greenLadyImg, x: 1341, y: 2437, w: 80, h: 108 },
  { id: 'p-6-4-99', title: 'Abstract Harmony', image: abstractImg, x: 1512, y: 2290, w: 245, h: 181 },
  { id: 'p-6-5-100', title: 'Green Wall Geometry', image: greenWallImg, x: 1807, y: 2269, w: 150, h: 203 },
  { id: 'p-6-5-101', title: 'Reading Lady', image: ladyWithBookImg, x: 1967, y: 2279, w: 150, h: 203 },
  { id: 'p-6-6-102', title: 'Crimson Shades', image: shadesImg, x: 2173, y: 2253, w: 180, h: 244 },
  { id: 'p-6-6-103', title: 'Stars and Birds', image: starsAndBirdsImg, x: 2363, y: 2353, w: 75, h: 102 },
  { id: 'p-6-7-104', title: 'Blue Grass Melody', image: blueGrassImg, x: 2521, y: 2230, w: 225, h: 166 },
  { id: 'p-6-7-105', title: 'Polka Coat', image: coatImg, x: 2536, y: 2406, w: 225, h: 166 },
  { id: 'p-6-8-106', title: 'Cobalt Study', image: blueImg, x: 2872, y: 2238, w: 190, h: 257 },
  { id: 'p-6-9-107', title: 'Dancing Movement', image: dancingGirlImg, x: 3187, y: 2234, w: 265, h: 196 },
  { id: 'p-6-10-108', title: 'Golden Feline', image: catPaintingImg, x: 3528, y: 2257, w: 230, h: 311 },
  { id: 'p-7-0-109', title: 'Companions', image: friendsImg, x: 83, y: 2695, w: 265, h: 196 },
  { id: 'p-7-1-110', title: 'Curly Silhouette', image: curlyLadyImg, x: 421, y: 2652, w: 180, h: 244 },
  { id: 'p-7-1-111', title: 'Botanical Grass', image: grassImg, x: 611, y: 2752, w: 75, h: 102 },
  { id: 'p-7-2-112', title: 'Horse Sketch', image: horseImg, x: 849, y: 2585, w: 225, h: 166 },
  { id: 'p-7-2-113', title: 'Mountain Ridge', image: mountImg, x: 864, y: 2761, w: 225, h: 166 },
  { id: 'p-7-3-114', title: 'Green Robe Lady', image: greenLadyImg, x: 1228, y: 2631, w: 190, h: 257 },
  { id: 'p-7-4-115', title: 'Green Wall Geometry', image: greenWallImg, x: 1465, y: 2647, w: 150, h: 203 },
  { id: 'p-7-4-116', title: 'Reading Lady', image: ladyWithBookImg, x: 1625, y: 2657, w: 150, h: 203 },
  { id: 'p-7-5-117', title: 'Graphic Still Life', image: symbolsImg, x: 1824, y: 2639, w: 285, h: 210 },
  { id: 'p-7-6-118', title: 'Crimson Shades', image: shadesImg, x: 2151, y: 2635, w: 145, h: 196 },
  { id: 'p-7-6-119', title: 'Abstract Harmony', image: abstractImg, x: 2306, y: 2655, w: 155, h: 114 },
  { id: 'p-7-7-120', title: 'Stars and Birds', image: starsAndBirdsImg, x: 2546, y: 2608, w: 190, h: 257 },
  { id: 'p-7-8-121', title: 'Blue Grass Melody', image: blueGrassImg, x: 2859, y: 2594, w: 240, h: 177 },
  { id: 'p-7-8-122', title: 'Cobalt Study', image: blueImg, x: 3019, y: 2781, w: 80, h: 108 },
  { id: 'p-7-9-123', title: 'Polka Coat', image: coatImg, x: 3184, y: 2603, w: 285, h: 210 },
  { id: 'p-7-10-124', title: 'Dancing Movement', image: dancingGirlImg, x: 3529, y: 2585, w: 225, h: 166 },
  { id: 'p-7-10-125', title: 'Companions', image: friendsImg, x: 3544, y: 2761, w: 225, h: 166 },
  { id: 'p-8-0-126', title: 'Golden Feline', image: catPaintingImg, x: 98, y: 2989, w: 210, h: 284 },
  { id: 'p-8-1-127', title: 'Horse Sketch', image: horseImg, x: 426, y: 2976, w: 240, h: 177 },
  { id: 'p-8-1-128', title: 'Curly Silhouette', image: curlyLadyImg, x: 586, y: 3163, w: 80, h: 108 },
  { id: 'p-8-2-129', title: 'Mountain Ridge', image: mountImg, x: 761, y: 3057, w: 245, h: 181 },
  { id: 'p-8-3-130', title: 'Botanical Grass', image: grassImg, x: 1123, y: 3036, w: 145, h: 196 },
  { id: 'p-8-3-131', title: 'Graphic Still Life', image: symbolsImg, x: 1278, y: 3056, w: 155, h: 114 },
  { id: 'p-8-4-132', title: 'Green Robe Lady', image: greenLadyImg, x: 1530, y: 2957, w: 230, h: 311 },
  { id: 'p-8-5-133', title: 'Abstract Harmony', image: abstractImg, x: 1857, y: 2940, w: 225, h: 166 },
  { id: 'p-8-5-134', title: 'Blue Grass Melody', image: blueGrassImg, x: 1872, y: 3116, w: 225, h: 166 },
  { id: 'p-8-6-135', title: 'Polka Coat', image: coatImg, x: 2189, y: 3013, w: 245, h: 181 },
  { id: 'p-8-7-136', title: 'Green Wall Geometry', image: greenWallImg, x: 2515, y: 2977, w: 180, h: 244 },
  { id: 'p-8-7-137', title: 'Reading Lady', image: ladyWithBookImg, x: 2705, y: 3077, w: 75, h: 102 },
  { id: 'p-8-8-138', title: 'Crimson Shades', image: shadesImg, x: 2866, y: 2949, w: 230, h: 311 },
  { id: 'p-8-9-139', title: 'Stars and Birds', image: starsAndBirdsImg, x: 3180, y: 2971, w: 150, h: 203 },
  { id: 'p-8-9-140', title: 'Cobalt Study', image: blueImg, x: 3340, y: 2981, w: 150, h: 203 },
  { id: 'p-8-10-141', title: 'Dancing Movement', image: dancingGirlImg, x: 3529, y: 2965, w: 265, h: 196 },
  { id: 'p-9-1-142', title: 'Companions', image: friendsImg, x: 428, y: 3441, w: 245, h: 181 },
  { id: 'p-9-2-143', title: 'Golden Feline', image: catPaintingImg, x: 766, y: 3342, w: 210, h: 284 },
  { id: 'p-9-3-144', title: 'Horse Sketch', image: horseImg, x: 1217, y: 3310, w: 210, h: 155 },
  { id: 'p-9-3-145', title: 'Mountain Ridge', image: mountImg, x: 1217, y: 3475, w: 210, h: 155 },
  { id: 'p-9-4-146', title: 'Graphic Still Life', image: symbolsImg, x: 1520, y: 3407, w: 245, h: 181 },
  { id: 'p-9-5-147', title: 'Curly Silhouette', image: curlyLadyImg, x: 1895, y: 3348, w: 190, h: 257 },
  { id: 'p-9-6-148', title: 'Abstract Harmony', image: abstractImg, x: 2194, y: 3320, w: 240, h: 177 },
  { id: 'p-9-6-149', title: 'Botanical Grass', image: grassImg, x: 2354, y: 3507, w: 80, h: 108 },
  { id: 'p-9-7-150', title: 'Blue Grass Melody', image: blueGrassImg, x: 2507, y: 3360, w: 285, h: 210 },
  { id: 'p-9-8-151', title: 'Green Robe Lady', image: greenLadyImg, x: 2884, y: 3330, w: 190, h: 257 },
  { id: 'p-9-9-152', title: 'Green Wall Geometry', image: greenWallImg, x: 3180, y: 3346, w: 145, h: 196 },
  { id: 'p-9-9-153', title: 'Polka Coat', image: coatImg, x: 3335, y: 3366, w: 155, h: 114 },
  { id: 'p-10-2-154', title: 'Dancing Movement', image: dancingGirlImg, x: 763, y: 3774, w: 285, h: 210 },
  { id: 'p-10-3-155', title: 'Reading Lady', image: ladyWithBookImg, x: 1240, y: 3723, w: 190, h: 257 },
  { id: 'p-10-4-156', title: 'Crimson Shades', image: shadesImg, x: 1493, y: 3770, w: 135, h: 183 },
  { id: 'p-10-4-157', title: 'Stars and Birds', image: starsAndBirdsImg, x: 1638, y: 3780, w: 135, h: 183 },
  { id: 'p-10-5-158', title: 'Companions', image: friendsImg, x: 1843, y: 3758, w: 265, h: 196 },
  { id: 'p-10-6-159', title: 'Horse Sketch', image: horseImg, x: 2216, y: 3663, w: 210, h: 155 },
  { id: 'p-10-6-160', title: 'Mountain Ridge', image: mountImg, x: 2216, y: 3828, w: 210, h: 155 },
  { id: 'p-10-7-161', title: 'Cobalt Study', image: blueImg, x: 2559, y: 3700, w: 190, h: 257 },
  { id: 'p-10-8-162', title: 'Graphic Still Life', image: symbolsImg, x: 2857, y: 3727, w: 265, h: 196 },
];

const WALL_BOUNDS = { minX: 71, maxX: 3849, minY: 100, maxY: 3984 };

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
    const centerClusterX = 1960
    const centerClusterY = 2042
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

      {/* 4. Drag to Explore Floating Indicator (Center Bottom) */}
      <aside className="drag-explore-indicator" aria-label="Exploration instruction">
        <DragIcon className="drag-icon" />
        <span className="drag-text">Drag to explore</span>
      </aside>
    </div>
  )
}

export default App
