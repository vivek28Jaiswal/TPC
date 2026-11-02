import fs from 'fs';

const H = (w) => Math.round((w * 192) / 260);
const V = (w) => Math.round((w * 352) / 260);
const GAP = 10;

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

function createCluster(type, seed = 0) {
  const items = [];
  if (type === 'single_v') {
    const art = nextV();
    const w = 190 + (seed % 4) * 20; // 190, 210, 230, 250
    items.push({ art, w, h: V(w), relX: 0, relY: 0 });
  } else if (type === 'single_h') {
    const art = nextH();
    const w = 260 + (seed % 4) * 25; // 260, 285, 310, 335
    items.push({ art, w, h: H(w), relX: 0, relY: 0 });
  } else if (type === 'pair_side_vh') {
    const vArt = nextV();
    const hArt = nextH();
    const vW = 180 + (seed % 3) * 15;
    const hW = 230 + (seed % 3) * 20;
    items.push({ art: vArt, w: vW, h: V(vW), relX: 0, relY: 0 });
    items.push({ art: hArt, w: hW, h: H(hW), relX: vW + GAP, relY: Math.round((V(vW) - H(hW)) / 3) });
  } else if (type === 'pair_side_hv') {
    const hArt = nextH();
    const vArt = nextV();
    const hW = 240 + (seed % 3) * 20;
    const vW = 180 + (seed % 3) * 15;
    items.push({ art: hArt, w: hW, h: H(hW), relX: 0, relY: 0 });
    items.push({ art: vArt, w: vW, h: V(vW), relX: hW + GAP, relY: 0 });
  } else if (type === 'pair_stacked_hh') {
    const h1 = nextH();
    const h2 = nextH();
    const w1 = 250 + (seed % 3) * 20;
    const w2 = 240 + ((seed + 1) % 3) * 20;
    items.push({ art: h1, w: w1, h: H(w1), relX: 0, relY: 0 });
    items.push({ art: h2, w: w2, h: H(w2), relX: (seed % 2 === 0 ? 0 : 20), relY: H(w1) + GAP });
  } else if (type === 'pair_stacked_vv') {
    const v1 = nextV();
    const v2 = nextV();
    const w1 = 160 + (seed % 3) * 15;
    const w2 = 160 + (seed % 3) * 15;
    items.push({ art: v1, w: w1, h: V(w1), relX: 0, relY: 0 });
    items.push({ art: v2, w: w2, h: V(w2), relX: 0, relY: V(w1) + GAP });
  } else if (type === 'pair_stacked_hv') {
    const h = nextH();
    const v = nextV();
    const wH = 250;
    const wV = 190;
    items.push({ art: h, w: wH, h: H(wH), relX: 0, relY: 0 });
    items.push({ art: v, w: wV, h: V(wV), relX: Math.round((wH - wV) / 2), relY: H(wH) + GAP });
  } else if (type === 'triad_L_left') {
    const v = nextV();
    const h1 = nextH();
    const h2 = nextH();
    const vW = 190;
    const h1W = 220;
    const h2W = 220;
    items.push({ art: v, w: vW, h: V(vW), relX: 0, relY: 0 });
    items.push({ art: h1, w: h1W, h: H(h1W), relX: vW + GAP, relY: 0 });
    items.push({ art: h2, w: h2W, h: H(h2W), relX: vW + GAP, relY: H(h1W) + GAP });
  } else if (type === 'triad_L_right') {
    const h1 = nextH();
    const h2 = nextH();
    const v = nextV();
    const h1W = 220;
    const h2W = 220;
    const vW = 180;
    items.push({ art: h1, w: h1W, h: H(h1W), relX: 0, relY: 0 });
    items.push({ art: h2, w: h2W, h: H(h2W), relX: 0, relY: H(h1W) + GAP });
    items.push({ art: v, w: vW, h: V(vW), relX: h1W + GAP, relY: 0 });
  } else if (type === 'triad_T_top') {
    const h = nextH();
    const v1 = nextV();
    const v2 = nextV();
    const hW = 310;
    const v1W = 150;
    const v2W = 150;
    items.push({ art: h, w: hW, h: H(hW), relX: 0, relY: 0 });
    items.push({ art: v1, w: v1W, h: V(v1W), relX: 0, relY: H(hW) + GAP });
    items.push({ art: v2, w: v2W, h: V(v2W), relX: v1W + GAP, relY: H(hW) + GAP });
  } else if (type === 'triad_stair') {
    const h1 = nextH();
    const v = nextV();
    const h2 = nextH();
    const h1W = 210;
    const vW = 160;
    const h2W = 210;
    items.push({ art: h1, w: h1W, h: H(h1W), relX: 0, relY: 0 });
    items.push({ art: v, w: vW, h: V(vW), relX: h1W + GAP, relY: 40 });
    items.push({ art: h2, w: h2W, h: H(h2W), relX: h1W + vW + GAP * 2, relY: 80 });
  } else if (type === 'quartet_asym') {
    const v1 = nextV();
    const h1 = nextH();
    const v2 = nextV();
    const h2 = nextH();
    const v1W = 190;
    const h1W = 230;
    items.push({ art: v1, w: v1W, h: V(v1W), relX: 0, relY: 0 });
    items.push({ art: h1, w: h1W, h: H(h1W), relX: v1W + GAP, relY: 0 });
    items.push({ art: v2, w: 150, h: V(150), relX: v1W + GAP, relY: H(h1W) + GAP });
    items.push({ art: h2, w: 190, h: H(190), relX: 0, relY: V(v1W) + GAP });
  } else if (type === 'cluster_with_mini_v') {
    // Large V + H stacked + small mini accent tucked below
    const v = nextV();
    const h = nextH();
    const mini = nextV(); // e.g. blueImg
    const vW = 190;
    const hW = 230;
    const miniW = 75;
    items.push({ art: v, w: vW, h: V(vW), relX: 0, relY: 0 });
    items.push({ art: h, w: hW, h: H(hW), relX: vW + GAP, relY: 0 });
    items.push({ art: mini, w: miniW, h: V(miniW), relX: vW + GAP, relY: H(hW) + GAP });
  } else if (type === 'mini_accent') {
    const v = nextV();
    const miniW = 75 + (seed % 2) * 10;
    items.push({ art: v, w: miniW, h: V(miniW), relX: 0, relY: 0 });
  }

  let maxX = 0, maxY = 0;
  for (const it of items) {
    if (it.relX + it.w > maxX) maxX = it.relX + it.w;
    if (it.relY + it.h > maxY) maxY = it.relY + it.h;
  }

  return {
    items,
    width: maxX,
    height: maxY
  };
}

const clusterTypes = [
  ['empty', 'single_v', 'pair_side_hv', 'mini_accent', 'triad_L_left', 'single_h', 'pair_stacked_vv', 'empty'],
  ['single_h', 'pair_stacked_hh', 'single_v', 'triad_T_top', 'empty', 'pair_side_vh', 'mini_accent', 'single_v'],
  ['pair_side_vh', 'empty', 'quartet_asym', 'cluster_with_mini_v', 'pair_stacked_hh', 'empty', 'triad_L_right', 'pair_side_hv'],
  ['mini_accent', 'triad_L_right', 'single_v', 'pair_side_vh', 'quartet_asym', 'cluster_with_mini_v', 'single_h', 'empty'],
  ['single_v', 'pair_stacked_vv', 'empty', 'triad_stair', 'single_v', 'triad_T_top', 'empty', 'pair_stacked_hh'],
  ['pair_side_hv', 'single_h', 'triad_T_top', 'empty', 'cluster_with_mini_v', 'single_v', 'quartet_asym', 'single_v'],
  ['empty', 'quartet_asym', 'pair_stacked_hh', 'pair_side_vh', 'mini_accent', 'pair_stacked_vv', 'single_h', 'mini_accent'],
  ['single_h', 'mini_accent', 'single_v', 'pair_side_hv', 'triad_L_right', 'empty', 'pair_side_vh', 'single_h']
];

const ROWS = 8;
const COLS = 8;
const CELL_W = 580;
const CELL_H = 580;
const START_X = 60;
const START_Y = 100;

const allPaintings = [];
let pCount = 0;

for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const type = clusterTypes[r][c];
    if (type === 'empty') continue;

    const seed = (r * 11 + c * 17) % 100;
    const cluster = createCluster(type, seed);

    const cellLeft = START_X + c * CELL_W;
    const cellTop = START_Y + r * CELL_H;

    const maxShiftX = Math.max(0, CELL_W - cluster.width - 25);
    const maxShiftY = Math.max(0, CELL_H - cluster.height - 25);

    const shiftX = Math.floor(((seed * 29) % 100) / 100 * maxShiftX);
    const shiftY = Math.floor(((seed * 43) % 100) / 100 * maxShiftY);

    const clusterX = cellLeft + shiftX;
    const clusterY = cellTop + shiftY;

    for (const item of cluster.items) {
      pCount++;
      allPaintings.push({
        id: `p-${r}-${c}-${pCount}`,
        title: item.art.title,
        imageKey: item.art.key,
        x: clusterX + item.relX,
        y: clusterY + item.relY,
        w: item.w,
        h: item.h
      });
    }
  }
}

console.log('Total paintings placed:', allPaintings.length);

// Verify collisions
let collisions = 0;
for (let i = 0; i < allPaintings.length; i++) {
  for (let j = i + 1; j < allPaintings.length; j++) {
    const a = allPaintings[i];
    const b = allPaintings[j];
    const overlapX = a.x < b.x + b.w && a.x + a.w > b.x;
    const overlapY = a.y < b.y + b.h && a.y + a.h > b.y;
    if (overlapX && overlapY) {
      collisions++;
    }
  }
}
console.log('Total collisions:', collisions);

let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
for (const p of allPaintings) {
  if (p.x < minX) minX = p.x;
  if (p.y < minY) minY = p.y;
  if (p.x + p.w > maxX) maxX = p.x + p.w;
  if (p.y + p.h > maxY) maxY = p.y + p.h;
}

console.log(`Bounds: minX=${minX}, maxX=${maxX}, minY=${minY}, maxY=${maxY}`);
console.log(`Width: ${maxX - minX}, Height: ${maxY - minY}`);
console.log(`Ratio: ${(maxX - minX) / (maxY - minY)}`);

// Generate code snippet for App.jsx
const codeLines = allPaintings.map(p => {
  return `  { id: '${p.id}', title: '${p.title}', image: ${p.imageKey}, x: ${p.x}, y: ${p.y}, w: ${p.w}, h: ${p.h} },`;
});

const output = `export const masterPaintings = [\n${codeLines.join('\n')}\n];\n\nexport const WALL_BOUNDS = { minX: ${minX}, maxX: ${maxX}, minY: ${minY}, maxY: ${maxY} };\n`;

fs.writeFileSync('scratch/paintings_data.js', output);
console.log('Saved scratch/paintings_data.js successfully!');
