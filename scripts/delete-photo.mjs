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

// Remove slug from favorites list
if (fs.existsSync(favoritePhotosPath)) {
  const favoritesRaw = fs.readFileSync(favoritePhotosPath, 'utf8');
  const favoritesUpdated = favoritesRaw
    .split('\n')
    .filter((line) => {
      const trimmed = line.trim();
      return trimmed !== `'${slug}',` && trimmed !== `"${slug}",`;
    })
    .join('\n');

  if (favoritesUpdated !== favoritesRaw) {
    fs.writeFileSync(favoritePhotosPath, favoritesUpdated, 'utf8');
    console.log(`Removed from favorites: ${slug}`);
  }
} else {
  console.warn(`Favorites file not found: ${favoritePhotosPath}`);
}

console.log(`Done. Photo "${slug}" removed.`);
