import sharp from 'sharp';

const sizes = [16, 32, 48, 64, 128, 256];

async function generateIcon() {
  // Create SVG with the three lines
  const svg = `
    <svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
      <rect width="256" height="256" fill="white"/>
      <g transform="translate(64, 108)">
        <rect width="128" height="8" fill="#111827" rx="4"/>
        <rect y="16" width="160" height="8" fill="#111827" rx="4"/>
        <rect y="32" width="128" height="8" fill="#111827" rx="4"/>
      </g>
    </svg>
  `;

  // Generate different sizes
  for (const size of sizes) {
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .toFile(`public/favicon-${size}x${size}.png`);
  }

  // Generate favicon.ico (multi-size icon)
  await sharp(Buffer.from(svg))
    .resize(32, 32)
    .toFile('public/favicon.ico');

  // Generate apple-touch-icon
  await sharp(Buffer.from(svg))
    .resize(180, 180)
    .toFile('public/apple-touch-icon.png');
}

generateIcon().catch(console.error); 