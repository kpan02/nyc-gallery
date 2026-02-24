// delete-photo.mjs
// Removes a photo from the gallery: image, thumbnail, metadata, and favorites.
// Run: npm run delete:photo -- <slug> or node scripts/delete-photo.mjs <slug>

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const slug = process.argv[2];
if (!slug) {
  console.error('Usage: node scripts/delete-photo.mjs <slug>');
  process.exit(1);
}

const contentDir = path.join(process.cwd(), 'content/photos');
const photosDir = path.join(process.cwd(), 'public/photos');
const thumbsDir = path.join(process.cwd(), 'public/photos/thumbs');
const favoritePhotosPath = path.join(process.cwd(), 'lib/favorite-photos.ts');

const metadataPath = path.join(contentDir, `${slug}.yml`);
if (!fs.existsSync(metadataPath)) {
  console.error(`No metadata found for slug: ${slug}`);
  process.exit(1);
}

const metadata = yaml.load(fs.readFileSync(metadataPath, 'utf8'));
const imagePath = path.join(process.cwd(), 'public', metadata.image);
const base = path.basename(metadata.image, path.extname(metadata.image)).toLowerCase();
const thumbPath = path.join(thumbsDir, `${base}.webp`);

// Delete image
if (fs.existsSync(imagePath)) {
  fs.unlinkSync(imagePath);
  console.log(`Deleted image: ${metadata.image}`);
} else {
  console.warn(`Image not found: ${imagePath}`);
}

// Delete thumbnail
if (fs.existsSync(thumbPath)) {
  fs.unlinkSync(thumbPath);
  console.log(`Deleted thumbnail: ${path.basename(thumbPath)}`);
} else {
  console.warn(`Thumbnail not found: ${thumbPath}`);
}

// Delete metadata
fs.unlinkSync(metadataPath);
console.log(`Deleted metadata: ${slug}.yml`);

console.log(`Done. Photo "${slug}" removed.`);
