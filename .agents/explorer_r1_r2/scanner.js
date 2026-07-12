const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve('c:/numan/Numanx-projacts/numanx-tools-hub');
console.log('Scanning project root:', ROOT_DIR);

// Helper to recursively get files
function getFiles(dir, excludes = []) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const relPath = path.relative(ROOT_DIR, fullPath).replace(/\\/g, '/');
    
    // Check excludes
    if (excludes.some(exclude => relPath === exclude || relPath.startsWith(exclude + '/'))) {
      return;
    }
    
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath, excludes));
    } else {
      results.push({
        fullPath,
        relPath,
        name: file,
        ext: path.extname(file)
      });
    }
  });
  return results;
}

const EXCLUDES = [
  'node_modules',
  '.git',
  '.astro',
  '.wrangler',
  'dist',
  '.agents'
];

const allFiles = getFiles(ROOT_DIR, EXCLUDES);
console.log(`Found ${allFiles.length} files total (excluding node_modules, .git, etc.)`);

// Print top level folders and some files
const extensions = {};
allFiles.forEach(f => {
  extensions[f.ext] = (extensions[f.ext] || 0) + 1;
});
console.log('File counts by extension:', extensions);

// Save file list for debugging
fs.writeFileSync(
  path.join(__dirname, 'all_files_list.json'),
  JSON.stringify(allFiles.map(f => f.relPath), null, 2)
);
console.log('Saved file list to all_files_list.json');
