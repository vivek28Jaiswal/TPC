import fs from 'fs';

const appPath = 'src/App.jsx';
const appContent = fs.readFileSync(appPath, 'utf8');

// Load generated paintings data
const dataContent = fs.readFileSync('scratch/paintings_data.js', 'utf8');

// Remove 'export ' from dataContent so they are internal to App.jsx
const internalData = dataContent
  .replace('export const masterPaintings', 'const masterPaintings')
  .replace('export const WALL_BOUNDS', 'const WALL_BOUNDS');

// Find start of masterPaintings and end of WALL_BOUNDS in App.jsx
const startIndex = appContent.indexOf('const masterPaintings = [');
const endIndex = appContent.indexOf('const FINISH_PADDING = {');

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find markers in App.jsx');
  process.exit(1);
}

const before = appContent.slice(0, startIndex);
const after = appContent.slice(endIndex);

let newAppContent = before + internalData + '\n' + after;

// Update center cluster coordinates to 2383 and 2416
newAppContent = newAppContent.replace(
  /const centerClusterX = \d+[\r\n\s]+const centerClusterY = \d+/,
  'const centerClusterX = 1960\n    const centerClusterY = 2042'
);

fs.writeFileSync(appPath, newAppContent);
console.log('Successfully updated src/App.jsx with organic layout!');
