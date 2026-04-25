#!/usr/bin/env node

// validate-photos.mjs
// Validates photo metadata, file references, thumbnails, and featured slugs.
// Run: npm run validate:photos or node scripts/validate-photos.mjs

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'content/photos');
const PUBLIC_DIR = path.join(ROOT, 'public');
const PHOTOS_DIR = path.join(ROOT, 'public/photos');
const THUMBS_DIR = path.join(ROOT, 'public/photos/thumbs');
const FAVORITES_FILE = path.join(ROOT, 'lib/favorite-photos.ts');

function isYmlFile(fileName) {
  return fileName.endsWith('.yml') || fileName.endsWith('.yaml');
}

function readPhotoFiles() {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs.readdirSync(CONTENT_DIR).filter(isYmlFile);
}

function listPhotoSourceFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'thumbs') return [];
      return listPhotoSourceFiles(fullPath);
    }
    return [fullPath];
  });
}

function coerceNumber(value) {
  if (value === '' || value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : NaN;
}

function getThumbnailPathFromImage(image) {
  const base = image.replace(/\.(jpg|jpeg|png|webp|avif)$/i, '').split('/').pop() || '';
  return path.join(THUMBS_DIR, `${base.toLowerCase()}.webp`);
}

function parseFavoriteSlugs(fileText) {
  const arrayMatch = fileText.match(/FAVORITE_PHOTOS[\s\S]*?\[([\s\S]*?)\]/m);
  if (!arrayMatch) return [];

  const inner = arrayMatch[1];
  const slugs = [];
  const slugRegex = /['"]([^'"]+)['"]/g;
  let match = slugRegex.exec(inner);
  while (match) {
    slugs.push(match[1]);
    match = slugRegex.exec(inner);
  }
  return slugs;
}

const errors = [];
const warnings = [];

function pushError(slug, message) {
  errors.push(`ERROR [slug=${slug}] ${message}`);
}

function pushWarning(slug, message) {
  warnings.push(`WARN  [slug=${slug}] ${message}`);
}

function validate() {
  const sourceFiles = listPhotoSourceFiles(PHOTOS_DIR).filter((filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    return ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.webp' || ext === '.avif';
  });

  const sourceSlugToFiles = new Map();
  for (const absPath of sourceFiles) {
    const relPath = path.relative(PHOTOS_DIR, absPath).replace(/\\/g, '/');
    const slug = path.basename(relPath, path.extname(relPath)).toLowerCase();
    const existing = sourceSlugToFiles.get(slug) || [];
    existing.push(relPath);
    sourceSlugToFiles.set(slug, existing);
  }

  const sourceCollisions = Array.from(sourceSlugToFiles.entries()).filter(([, relPaths]) => relPaths.length > 1);
  for (const [slug, relPaths] of sourceCollisions) {
    errors.push(`ERROR [slug=${slug}] source photo slug collision: ${relPaths.join(', ')}`);
  }

  const files = readPhotoFiles();
  if (files.length === 0) {
    console.log('No metadata files found in content/photos');
    return;
  }

  const seenSlugs = new Map();
  const existingSlugs = new Set();

  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    const baseName = path.basename(file, path.extname(file));

    let data;
    try {
      data = yaml.load(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
      errors.push(`ERROR [slug=${baseName}] failed to parse YAML (${err.message})`);
      continue;
    }

    if (!data || typeof data !== 'object') {
      errors.push(`ERROR [slug=${baseName}] metadata must be a YAML object`);
      continue;
    }

    const slug = String(data.slug ?? '').trim();
    const title = String(data.title ?? '').trim();
    const image = String(data.image ?? '').trim();
    const tags = data.tags;
    const latitudeRaw = data.latitude;
    const longitudeRaw = data.longitude;

    if (!slug) {
      errors.push(`ERROR [slug=${baseName}] missing required field: slug`);
      continue;
    }

    existingSlugs.add(slug);

    if (seenSlugs.has(slug)) {
      pushError(slug, `duplicate slug also found in ${seenSlugs.get(slug)}`);
    } else {
      seenSlugs.set(slug, file);
    }

    if (baseName !== slug) {
      pushError(slug, `filename/slug mismatch (file: ${baseName}.yml)`);
    }

    if (!title) {
      pushWarning(slug, 'title is empty');
    }

    if (!image) {
      pushError(slug, 'missing required field: image');
    } else {
      const imagePath = path.join(PUBLIC_DIR, image.replace(/^\/+/, ''));
      if (!fs.existsSync(imagePath)) {
        pushError(slug, `image missing: ${image}`);
      }
      const thumbPath = getThumbnailPathFromImage(image);
      if (!fs.existsSync(thumbPath)) {
        pushWarning(slug, `thumbnail missing: /photos/thumbs/${path.basename(thumbPath)}`);
      }
    }

    if (!Array.isArray(tags)) {
      pushError(slug, 'tags must be an array');
    } else if (tags.length === 0) {
      pushWarning(slug, 'tags array is empty');
    }

    const latExists = latitudeRaw !== '' && latitudeRaw != null;
    const lngExists = longitudeRaw !== '' && longitudeRaw != null;
    if (latExists !== lngExists) {
      pushError(slug, 'latitude and longitude must both be set or both be empty');
    }

    if (latExists && lngExists) {
      const lat = coerceNumber(latitudeRaw);
      const lng = coerceNumber(longitudeRaw);

      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        pushError(slug, 'latitude/longitude must be numeric');
      } else {
        if (lat < -90 || lat > 90) pushError(slug, `latitude out of range: ${latitudeRaw}`);
        if (lng < -180 || lng > 180) pushError(slug, `longitude out of range: ${longitudeRaw}`);
      }
    }
  }

  if (fs.existsSync(FAVORITES_FILE)) {
    const favoriteText = fs.readFileSync(FAVORITES_FILE, 'utf8');
    const favoriteSlugs = parseFavoriteSlugs(favoriteText);

    for (const favoriteSlug of favoriteSlugs) {
      if (!existingSlugs.has(favoriteSlug)) {
        errors.push(`ERROR [slug=${favoriteSlug}] favorite slug missing in content/photos`);
      }
    }
  } else {
    warnings.push('WARN  [global] favorite photos file not found: lib/favorite-photos.ts');
  }

  for (const line of errors) console.error(line);
  for (const line of warnings) console.log(line);

  console.log('');
  console.log(
    `Validation complete: ${errors.length} error(s), ${warnings.length} warning(s), ${files.length} file(s) checked`
  );

  if (errors.length > 0) process.exit(1);
}

validate();
