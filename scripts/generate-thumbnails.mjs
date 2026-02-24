// generate-thumbnails.mjs
// Resizes photos in public/photos to 96x96 WebP thumbnails for map markers.
// Run: npm run generate:thumbnails or node scripts/generate-thumbnails.mjs

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const photosDir = path.join(process.cwd(), 'public/photos');
const thumbsDir = path.join(process.cwd(), 'public/photos/thumbs');
const SIZE = 96;
const exts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? [] : [p];
  });
}

async function main() {
  const files = listFiles(photosDir).filter((f) =>
    exts.has(path.extname(f).toLowerCase())
  );

  if (files.length === 0) {
    console.log('No photos found in public/photos');
    return;
  }

  if (!fs.existsSync(thumbsDir)) {
    fs.mkdirSync(thumbsDir, { recursive: true });
    console.log('Created public/photos/thumbs/');
  }

  for (const filePath of files) {
    const base = path.basename(filePath, path.extname(filePath)).toLowerCase();
    const outPath = path.join(thumbsDir, `${base}.webp`);

    try {
      await sharp(filePath)
        .resize(SIZE, SIZE, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(outPath);
      console.log(`Created: ${base}.webp`);
    } catch (err) {
      console.warn(`Failed ${path.basename(filePath)}: ${err.message}`);
    }
  }

  console.log(`Done. ${files.length} thumbnails in public/photos/thumbs/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
