// display-photo-tags.mjs
// Displays all unique tags and photo-tag mappings from photo metadata files.
// Run: node scripts/display-photo-tags.mjs

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

function parsePhotoFiles() {
  const photosDir = path.join(process.cwd(), 'content', 'photos');
  const files = fs.readdirSync(photosDir);
  
  const allTags = new Set();
  const photoTags = [];
  
  files.forEach(file => {
    if (file.endsWith('.yml') || file.endsWith('.yaml')) {
      const filePath = path.join(photosDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      try {
        const photo = yaml.load(content);
        
        if (photo.tags && Array.isArray(photo.tags)) {
          photo.tags.forEach(tag => allTags.add(tag));
          
          photoTags.push({
            slug: photo.slug,
            title: photo.title,
            tags: photo.tags
          });
        }
      } catch (error) {
        console.error(`Error parsing ${file}:`, error.message);
      }
    }
  });
  
  return {
    uniqueTags: Array.from(allTags).sort(),
    photoTags: photoTags.sort((a, b) => a.slug.localeCompare(b.slug))
  };
}


try {  
  const { uniqueTags, photoTags } = parsePhotoFiles();
  
  console.log('LIST OF UNIQUE TAGS:');
  uniqueTags.forEach((tag, index) => {
    console.log(`${index + 1}. ${tag}`);
  });
  
  console.log(`\nTotal unique tags: ${uniqueTags.length}\n`);
  
  console.log('PHOTO-TAG MAPPINGS:');
  photoTags.forEach(photo => {
    console.log(`(${photo.slug}): ${photo.tags.join(', ')}`);
  });
  
  console.log(`\nTotal photos processed: ${photoTags.length}`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
