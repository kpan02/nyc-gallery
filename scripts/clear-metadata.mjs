// clear-metadata.mjs
// Deletes all YAML metadata files from the content/photos directory.
// Run: npm run clear:metadata or node scripts/clear-metadata.mjs

import { readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

const photosDir = join(process.cwd(), 'content', 'photos');

try {
  const files = await readdir(photosDir);
  await Promise.all(
    files.map(file => rm(join(photosDir, file), { force: true }))
  );
  console.log('Successfully cleared photos directory contents');
} catch (error) {
  console.error('Error clearing photos directory contents:', error);
  process.exit(1);
}
