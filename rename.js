import fs from 'fs';
import path from 'path';

const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  '.artifacts',
  'ui/dist',
  'coverage',
]);

const IGNORE_EXTS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.webp', '.mp4', '.webm',
  '.zip', '.tar', '.gz', '.tgz', '.exe', '.dll', '.bin', '.pdf', '.woff', '.woff2', '.ttf',
  '.DS_Store'
]);

function processText(content) {
  let newContent = content;
  // Case sensitive replaces first to catch specific capitalizations
  newContent = newContent.replace(/FastClaw/g, 'FastClaw');
  newContent = newContent.replace(/fastclaw/g, 'fastclaw');
  newContent = newContent.replace(/FastClaw/g, 'FastClaw');
  newContent = newContent.replace(/fastclaw/g, 'fastclaw');
  newContent = newContent.replace(/FASTCLAW/g, 'FASTCLAW');
  return newContent;
}

function shouldProcessFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (IGNORE_EXTS.has(ext)) return false;
  
  // try to read a few bytes to see if it's binary
  try {
    const buffer = Buffer.alloc(1024);
    const fd = fs.openSync(filePath, 'r');
    const bytesRead = fs.readSync(fd, buffer, 0, 1024, 0);
    fs.closeSync(fd);
    for (let i = 0; i < bytesRead; i++) {
        if (buffer[i] === 0) {
            return false; // Binary file null byte heuristic
        }
    }
  } catch (e) {
    return false;
  }
  return true;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (IGNORE_DIRS.has(file)) continue;
    
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      walkDir(fullPath);
      // rename directory if needed
      if (file.toLowerCase().includes('fastclaw') || file.toLowerCase().includes('fastclaw')) {
        let newName = file.replace(/fastclaw/ig, match => match.charAt(0) === 'O' ? 'FastClaw' : 'fastclaw');
        newName = newName.replace(/fastclaw/ig, match => match.charAt(0) === 'T' ? 'FastClaw' : 'fastclaw');
        const newPath = path.join(dir, newName);
        fs.renameSync(fullPath, newPath);
        console.log(`Renamed directory: ${fullPath} -> ${newPath}`);
      }
    } else {
      if (shouldProcessFile(fullPath)) {
        try {
            const content = fs.readFileSync(fullPath, 'utf8');
            const modified = processText(content);
            if (content !== modified) {
                fs.writeFileSync(fullPath, modified, 'utf8');
                console.log(`Updated content: ${fullPath}`);
            }
        } catch(e) {
            console.error(`Error processing file ${fullPath}:`, e);
        }
      }
      
      // rename file if needed
      if (file.toLowerCase().includes('fastclaw') || file.toLowerCase().includes('fastclaw')) {
        let newName = file.replace(/fastclaw/ig, match => match.charAt(0) === 'O' ? 'FastClaw' : 'fastclaw');
        newName = newName.replace(/fastclaw/ig, match => match.charAt(0) === 'T' ? 'FastClaw' : 'fastclaw');
        const newPath = path.join(dir, newName);
        fs.renameSync(fullPath, newPath);
        console.log(`Renamed file: ${fullPath} -> ${newPath}`);
      }
    }
  }
}

console.log('Starting mass rename...');
walkDir(process.cwd());
console.log('Mass rename complete.');
