/**
 * Jafri Sacred Library — PWA Icon Generator
 * Renders authentic brand artwork (Seljuk star crest with dark navy & gold palette)
 * into standard PWA PNG icons (192x192, 512x512, and 512x512 maskable).
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ICONS_DIR = path.resolve(__dirname, '../public/icons');
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

function findChrome() {
  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) return process.env.CHROME_BIN;
  if (process.platform === 'darwin') {
    const macPath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    if (fs.existsSync(macPath)) return macPath;
  }
  const linuxPaths = [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/snap/bin/chromium',
  ];
  for (const p of linuxPaths) {
    if (fs.existsSync(p)) return p;
  }
  return process.env.CHROME_BIN || 'google-chrome';
}

function renderHtml(width, height, isMaskable = false) {
  // Seljuk star crest SVG definition
  const starSvg = `
    <polygon points="32,8 39,25 56,32 39,39 32,56 25,39 8,32 25,25" fill="rgba(212, 175, 55, 0.25)" stroke="#D4AF37" stroke-width="2"/>
    <rect x="18" y="18" width="28" height="28" transform="rotate(45 32 32)" fill="none" stroke="#E6CA65" stroke-width="1.5"/>
    <circle cx="32" cy="32" r="5" fill="#D4AF37"/>
  `;

  if (isMaskable) {
    // Maskable icons require safe zone (inner 80% circle), full bleed solid background
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: ${width}px; height: ${height}px; background: #071124; overflow: hidden; display: flex; align-items: center; justify-content: center; }
  </style>
</head>
<body>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${Math.round(width * 0.72)}" height="${Math.round(height * 0.72)}" fill="none">
    ${starSvg}
  </svg>
</body>
</html>`;
  }

  // Standard standalone icon with rounded-corner navy container
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: ${width}px; height: ${height}px; background: #071124; overflow: hidden; display: flex; align-items: center; justify-content: center; }
  </style>
</head>
<body>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${width}" height="${height}" fill="none">
    <rect width="64" height="64" rx="14" fill="#071124"/>
    ${starSvg}
  </svg>
</body>
</html>`;
}

function generateIcon(chromePath, width, height, outputFile, isMaskable = false) {
  const tmpHtml = path.resolve(__dirname, `../.tmp_icon_${width}x${height}.html`);
  fs.writeFileSync(tmpHtml, renderHtml(width, height, isMaskable), 'utf8');

  try {
    const res = spawnSync(
      chromePath,
      [
        '--headless=new',
        '--no-sandbox',
        '--disable-gpu',
        `--screenshot=${outputFile}`,
        `--window-size=${width},${height}`,
        '--default-background-color=00000000',
        `file://${tmpHtml}`,
      ],
      { encoding: 'utf8' }
    );

    if (!fs.existsSync(outputFile)) {
      console.error(`Failed to create ${outputFile}:`, res.stderr || res.stdout);
      process.exit(1);
    }

    const stat = fs.statSync(outputFile);
    console.log(`✓ Generated ${path.basename(outputFile)} (${width}x${height}, ${stat.size} bytes)`);
  } finally {
    if (fs.existsSync(tmpHtml)) {
      fs.unlinkSync(tmpHtml);
    }
  }
}

function main() {
  const chromePath = findChrome();
  console.log(`Using Chrome binary: ${chromePath}`);

  generateIcon(chromePath, 192, 192, path.join(ICONS_DIR, 'icon-192x192.png'), false);
  generateIcon(chromePath, 512, 512, path.join(ICONS_DIR, 'icon-512x512.png'), false);
  generateIcon(chromePath, 512, 512, path.join(ICONS_DIR, 'icon-maskable-512x512.png'), true);

  console.log('All PWA icons successfully generated in public/icons/');
}

if (require.main === module) {
  main();
}

module.exports = { generateIcon, renderHtml, ICONS_DIR };
