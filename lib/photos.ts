import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { FAVORITE_PHOTOS } from './favorite-photos';

export type Photo = {
  slug: string;
  title: string;
  image: string;
  date?: string;
  neighborhood?: string;
  borough?: string;
  camera?: string;
  latitude?: number | string;
  longitude?: number | string;
  tags?: string[];
};

const CONTENT_DIR = path.join(process.cwd(), 'content/photos');

export function getAllPhotos(): Photo[] {
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));

  const photos = files.map(file => {
    const filePath = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(raw) as Photo;
    return data;
  });

  // Sort favorite photos based on custom order && randomize the main gallery
  photos.sort((a, b) => {
    const aIndex = FAVORITE_PHOTOS.indexOf(a.slug);
    const bIndex = FAVORITE_PHOTOS.indexOf(b.slug);
    
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    
    return Math.random() - 0.5;
  });
  
  return photos;
}

export function getPhotoBySlug(slug: string): Photo | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.yml`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf8');
  return yaml.load(raw) as Photo;
}
