// yarn 1.x fails to extract astro's dist/assets/ directory (confirmed on Windows & Linux).
// When assets are missing, this script re-installs astro via npm (which extracts correctly),
// then copies the complete dist/assets/ into the yarn-installed package directory.
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const astroRoot = path.join(__dirname, '..', 'node_modules', 'astro');
const assetsDir = path.join(astroRoot, 'dist', 'assets');
const checkFile = path.join(assetsDir, 'utils', 'getAssetsPrefix.js');

if (fs.existsSync(checkFile)) {
  process.exit(0); // assets already present, nothing to do
}

console.log('postinstall: astro dist/assets missing — re-fetching via npm...');

const tmp = path.join(__dirname, '..', '.astro-assets-tmp');

try {
  // Install astro into a temp prefix using npm (ignoring scripts to avoid loops)
  execSync(
    `npm install --prefix "${tmp}" astro@5.14.4 --ignore-scripts --no-audit --no-fund --loglevel=error`,
    { stdio: 'inherit' }
  );

  const srcAssets = path.join(tmp, 'node_modules', 'astro', 'dist', 'assets');
  if (!fs.existsSync(srcAssets)) {
    console.error('postinstall: npm also failed to provide dist/assets — build may fail');
    process.exit(0);
  }

  // Remove the broken (empty) assets dir and replace with the correct one
  if (fs.existsSync(assetsDir)) fs.rmSync(assetsDir, { recursive: true, force: true });
  copyDir(srcAssets, assetsDir);
  console.log('postinstall: astro dist/assets restored from npm');
} catch (e) {
  console.error('postinstall: failed to restore astro assets:', e.message);
} finally {
  if (fs.existsSync(tmp)) fs.rmSync(tmp, { recursive: true, force: true });
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}
