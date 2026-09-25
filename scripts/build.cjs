// Publish only the standalone site's pages and runtime assets.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.resolve(root, 'dist');
if (path.dirname(output) !== root || path.basename(output) !== 'dist') {
  throw new Error('Unexpected build output path');
}
if (fs.existsSync(output) && fs.lstatSync(output).isSymbolicLink()) {
  throw new Error('Build output must not be a symbolic link');
}
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output);
for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (entry.isFile() && /\.html?$/i.test(entry.name)) {
    fs.copyFileSync(path.join(root, entry.name), path.join(output, entry.name));
  }
}
fs.cpSync(path.join(root, 'shared'), path.join(output, 'shared'), { recursive: true });
console.log('Built standalone website in dist/ (pages and runtime assets only).');
