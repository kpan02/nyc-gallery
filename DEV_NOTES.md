## Getting Started

First, run the development server:

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

<br>

### Content System Overview

The site’s photo content is file-based and generated from local image files.

- Source images live in `public/photos/`
- Metadata files live in `content/photos/*.yml`
- Map marker thumbnails live in `public/photos/thumbs/*.webp`
- Featured photos are manually listed in `lib/favorite-photos.ts`

---

## Standard Workflow: Add New Photos

1. Add image files to `public/photos/`
2. Generate missing metadata:
   - `npm run generate:metadata`
3. Generate thumbnails:
   - `npm run generate:thumbnails`
4. Edit each new `content/photos/<slug>.yml`:

   - Fill `title`
   - Fill `neighborhood` and `borough`
   - Add `latitude` and `longitude` for map placement
   - Add/normalize `tags`
   - Verify `date` and `camera` are correct

5. Validate metadata and references:

   - `npm run validate:photos`

6. (Optional) Feature selected photos by adding slugs to `lib/favorite-photos.ts`
7. Run local app:

   - `npm run dev`
   - Verify gallery cards, modal metadata, and map markers/popups

8. Optional sanity checks:

   - `node scripts/print-titles.mjs`
   - `node scripts/display-photo-tags.mjs`

---

## Remove Photo Workflow

1. Run:

   - `npm run delete:photo -- <slug>`

2. Confirm deleted:

   - `content/photos/<slug>.yml`
   - original image under `public/photos`
   - `public/photos/thumbs/<slug>.webp`

3. If needed, remove slug manually from `lib/favorite-photos.ts`
4. Run:

   - `npm run validate:photos`

---

# Scripts Reference

### `npm run generate:metadata`

**Runs:** `scripts/generate-metadata.mjs`

**Purpose:**

- Scans `public/photos` for image files (`.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`)
- Creates missing metadata files in `content/photos/`

**What it writes per photo:**

- `slug` (lowercase filename without extension)
- `title` (blank, manual)
- `image` (`/photos/<relative-path>`)
- `date` and `camera` (EXIF when available; EXIF parsing only for jpg/jpeg)
- `neighborhood`, `borough`, `latitude`, `longitude`, `tags` (blank defaults)

**Behavior:**

- Does **not overwrite** existing YAML files
- Safe to rerun after adding new files

---

### `npm run generate:thumbnails`

**Runs:** `scripts/generate-thumbnails.mjs`

**Purpose:**

- Creates 96x96 WebP thumbnails in `public/photos/thumbs/` for map markers

**Behavior:**

- Converts filename base to lowercase and outputs `<base>.webp`
- Overwrites/refreshes thumbnail output for processed files

---

### `npm run delete:photo -- <slug>`

**Runs:** `scripts/delete-photo.mjs <slug>`

**Purpose:**

- Removes one photo from:
  - original image (using `image` path from YAML)
  - thumbnail in `public/photos/thumbs`
  - metadata file in `content/photos`

**Notes:**

- If slug is listed in `lib/favorite-photos.ts`, remove it manually
- Requires the YAML file to exist for that slug

---

### `npm run validate:photos`

**Runs:** `scripts/validate-photos.mjs`

**Purpose:**

- Validates metadata quality and integrity across `content/photos/*.yml`
- Verifies references to source images, thumbnails, and favorite slugs

**Checks:**

- Duplicate slugs
- Filename/slug mismatch
- Missing image files
- Missing thumbnails (warning)
- Invalid or incomplete coordinates
- Non-array tags
- Favorite slugs missing from metadata

**Output:**

- Prints `ERROR` and `WARN` lines with slug context
- Exits with code `1` if any errors are found
- Exits with code `0` when only warnings (or no issues) are found

---

### `node scripts/display-photo-tags.mjs`

**Purpose:**

- Prints all unique tags and each photo’s tag list from YAML metadata

**Use cases:**

- Tag audit and consistency checks

---

### `node scripts/print-titles.mjs`

**Purpose:**

- Prints all non-empty photo titles from YAML metadata

**Use cases:**

- Quick quality pass for missing titles

---
