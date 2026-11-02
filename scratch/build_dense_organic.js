import fs from 'fs';

const H = (w) => Math.round((w * 192) / 260);
const V = (w) => Math.round((w * 352) / 260);
const CLUSTER_GAP = 10;

const VERTICAL_ART = [
  { key: 'blueImg', title: 'Cobalt Study' },
  { key: 'catPaintingImg', title: 'Golden Feline' },
  { key: 'curlyLadyImg', title: 'Curly Silhouette' },
  { key: 'grassImg', title: 'Botanical Grass' },
  { key: 'greenLadyImg', title: 'Green Robe Lady' },
  { key: 'greenWallImg', title: 'Green Wall Geometry' },
  { key: 'ladyWithBookImg', title: 'Reading Lady' },
  { key: 'shadesImg', title: 'Crimson Shades' },
  { key: 'starsAndBirdsImg', title: 'Stars and Birds' }
];

const HORIZONTAL_ART = [
  { key: 'abstractImg', title: 'Abstract Harmony' },
  { key: 'blueGrassImg', title: 'Blue Grass Melody' },
  { key: 'coatImg', title: 'Polka Coat' },
  { key: 'dancingGirlImg', title: 'Dancing Movement' },
  { key: 'friendsImg', title: 'Companions' },
  { key: 'horseImg', title: 'Horse Sketch' },
  { key: 'mountImg', title: 'Mountain Ridge' },
  { key: 'symbolsImg', title: 'Graphic Still Life' }
];

let vIdx = 0;
let hIdx = 0;

function nextV() {
  const item = VERTICAL_ART[vIdx % VERTICAL_ART.length];
  vIdx++;
  return item;
}

function nextH() {
  const item = HORIZONTAL_ART[hIdx % HORIZONTAL_ART.length];
  hIdx++;
  return item;
}

// Cluster types tailored for ~340x350 cells:
// 1. single_v: 1 vertical painting (w: 180..220)
// 2. single_h: 1 horizontal painting (w: 240..270)
// 3. pair_stacked_hh: 2 small horizontals stacked (w: 210, h: 155 each, total h: 320)
// 4. pair_side_vv: 2 small verticals side by side (w: 140 each, total w: 290)
// 5. pair_stacked_hv: 1 horizontal on top, 1 mini accent below
// 6. pair_side_vh: 1 vertical left (w: 140), 1 mini horizontal right (w: 160)
// 7. single_v_with_mini: 1 vertical + 1 mini blue accent beside it

function makeCellCluster(type, seed) {
  const items = [];
  if (type === 'single_v') {
    const art = nextV();
    const w = 190 + (seed % 3) * 20; // 190, 210, 230
    items.push({ art, w, h: V(w), relX: 0, relY: 0 });
  } else if (type === 'single_h') {
    const art = nextH();
    const w = 245 + (seed % 3) * 20; // 245, 265, 285
    items.push({ art, w, h: H(w), relX: 0, relY: 0 });
  } else if (type === 'pair_stacked_hh') {
    const h1 = nextH();
    const h2 = nextH();
    const w = 210 + (seed % 2) * 15;
    items.push({ art: h1, w, h: H(w), relX: 0, relY: 0 });
    items.push({ art: h2, w, h: H(w), relX: (seed % 2 === 0 ? 0 : 15), relY: H(w) + CLUSTER_GAP });
  } else if (type === 'pair_side_vv') {
    const v1 = nextV();
    const v2 = nextV();
    const w = 135 + (seed % 2) * 15;
    items.push({ art: v1, w, h: V(w), relX: 0, relY: 0 });
    items.push({ art: v2, w, h: V(w), relX: w + CLUSTER_GAP, relY: 10 });
  } else if (type === 'pair_stacked_hv') {
    const h = nextH();
    const v = nextV();
    const wH = 240;
    const miniW = 80;
    items.push({ art: h, w: wH, h: H(wH), relX: 0, relY: 0 });
    items.push({ art: v, w: miniW, h: V(miniW), relX: (seed % 2 === 0 ? 0 : wH - miniW), relY: H(wH) + CLUSTER_GAP });
  } else if (type === 'pair_side_vh') {
    const v = nextV();
    const h = nextH();
    const vW = 145;
    const hW = 155;
    items.push({ art: v, w: vW, h: V(vW), relX: 0, relY: 0 });
    items.push({ art: h, w: hW, h: H(hW), relX: vW + CLUSTER_GAP, relY: 20 });
  } else if (type === 'single_v_with_mini') {
    const v = nextV();
    const mini = nextV();
    const vW = 180;
    const miniW = 75;
    items.push({ art: v, w: vW, h: V(vW), relX: 0, relY: 0 });
    items.push({ art: mini, w: miniW, h: V(miniW), relX: vW + CLUSTER_GAP, relY: 100 });
  }

  let maxX = 0, maxY = 0;
  for (const it of items) {
    if (it.relX + it.w > maxX) maxX = it.relX + it.w;
    if (it.relY + it.h > maxY) maxY = it.relY + it.h;
  }

  return { items, width: maxX, height: maxY };
}

// 11 rows x 11 columns of compact organic cells
const ROWS = 11;
const COLS = 11;
const CELL_W = 345;
const CELL_H = 355;
const START_X = 70;
const START_Y = 100;

// Organic distribution map across 11x11 grid (121 cells)
// We leave a few perimeter cells empty for an organic cloud contour, but keep the body dense!
const cellTypes = [
  // row 0
  ['empty', 'single_v', 'single_h', 'pair_stacked_hv', 'single_v', 'pair_side_vv', 'single_h', 'pair_stacked_hh', 'single_v', 'empty', 'empty'],
  // row 1
  ['single_h', 'pair_side_vh', 'single_v', 'pair_stacked_hh', 'single_h', 'single_v_with_mini', 'pair_stacked_hv', 'single_v', 'single_h', 'pair_side_vv', 'empty'],
  // row 2
  ['single_v', 'pair_stacked_hh', 'pair_side_vv', 'single_h', 'pair_side_vh', 'single_v', 'single_h', 'pair_stacked_hh', 'single_v_with_mini', 'single_h', 'single_v'],
  // row 3
  ['pair_stacked_hv', 'single_v', 'single_h', 'single_v_with_mini', 'pair_stacked_hh', 'pair_side_vh', 'pair_stacked_hv', 'single_v', 'pair_side_vv', 'single_h', 'pair_stacked_hh'],
  // row 4
  ['single_h', 'pair_side_vv', 'single_v_with_mini', 'pair_stacked_hh', 'single_v', 'single_h', 'single_v', 'pair_side_vh', 'single_h', 'pair_stacked_hv', 'single_v'],
  // row 5 (CENTER)
  ['single_v', 'pair_stacked_hh', 'single_h', 'pair_side_vh', 'single_v_with_mini', 'single_h', 'pair_stacked_hh', 'single_v', 'single_h', 'pair_side_vv', 'single_h'],
  // row 6
  ['pair_side_vh', 'single_h', 'single_v', 'pair_stacked_hv', 'single_h', 'pair_side_vv', 'single_v_with_mini', 'pair_stacked_hh', 'single_v', 'single_h', 'single_v'],
  // row 7
  ['single_h', 'single_v_with_mini', 'pair_stacked_hh', 'single_v', 'pair_side_vv', 'single_h', 'pair_side_vh', 'single_v', 'pair_stacked_hv', 'single_h', 'pair_stacked_hh'],
  // row 8
  ['single_v', 'pair_stacked_hv', 'single_h', 'pair_side_vh', 'single_v', 'pair_stacked_hh', 'single_h', 'single_v_with_mini', 'single_v', 'pair_side_vv', 'single_h'],
  // row 9
  ['empty', 'single_h', 'single_v', 'pair_stacked_hh', 'single_h', 'single_v', 'pair_stacked_hv', 'single_h', 'single_v', 'pair_side_vh', 'empty'],
  // row 10
  ['empty', 'empty', 'single_h', 'single_v', 'pair_side_vv', 'single_h', 'pair_stacked_hh', 'single_v', 'single_h', 'empty', 'empty']
];

const allPaintings = [];
let pCount = 0;

for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const type = cellTypes[r][c];
    if (type === 'empty') continue;

    const seed = (r * 13 + c * 19) % 100;
    const cluster = makeCellCluster(type, seed);

    const cellLeft = START_X + c * CELL_W;
    const cellTop = START_Y + r * CELL_H;

    const maxShiftX = Math.max(0, CELL_W - cluster.width - 15);
    const maxShiftY = Math.max(0, CELL_H - cluster.height - 15);

    // Natural organic jitter inside the cell
    const shiftX = Math.floor(((seed * 31) % 100) / 100 * maxShiftX);
    const shiftY = Math.floor(((seed * 47) % 100) / 100 * maxShiftY);

    const clusterX = cellLeft + shiftX;
    const clusterY = cellTop + shiftY;

    for (const it of cluster.items) {
      pCount++;
      allPaintings.push({
        id: `p-${r}-${c}-${pCount}`,
        title: it.art.title,
        imageKey: it.art.key,
        x: clusterX + it.relX,
        y: clusterY + it.relY,
        w: it.w,
        h: it.h
      });
    }
  }
}

console.log('Total paintings:', allPaintings.length);

// Collision check
let collisions = 0;
for (let i = 0; i < allPaintings.length; i++) {
  for (let j = i + 1; j < allPaintings.length; j++) {
    const a = allPaintings[i];
    const b = allPaintings[j];
    if (a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y) {
      collisions++;
    }
  }
}
console.log('Collisions:', collisions);

let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
for (const p of allPaintings) {
  if (p.x < minX) minX = p.x;
  if (p.y < minY) minY = p.y;
  if (p.x + p.w > maxX) maxX = p.x + p.w;
  if (p.y + p.h > maxY) maxY = p.y + p.h;
}

console.log(`Bounds: minX=${minX}, maxX=${maxX}, minY=${minY}, maxY=${maxY}`);
console.log(`Dimensions: ${maxX - minX} x ${maxY - minY}`);
console.log(`Aspect Ratio: ${(maxX - minX) / (maxY - minY)}`);

// Save to scratch/paintings_data.js
const codeLines = allPaintings.map(p => {
  return `  { id: '${p.id}', title: '${p.title}', image: ${p.imageKey}, x: ${p.x}, y: ${p.y}, w: ${p.w}, h: ${p.h} },`;
});

const output = `export const masterPaintings = [\n${codeLines.join('\n')}\n];\n\nexport const WALL_BOUNDS = { minX: ${minX}, maxX: ${maxX}, minY: ${minY}, maxY: ${maxY} };\n`;

fs.writeFileSync('scratch/paintings_data.js', output);
console.log('Saved scratch/paintings_data.js successfully!');
