// scripts/generate-metadata.mjs
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import exifr from 'exifr'; 

const photosDir = path.join(process.cwd(), 'public/photos');
const contentDir = path.join(process.cwd(), 'content/photos');

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? listFiles(p) : [p];
  });
}

const extsAll = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);
const extsExif = new Set(['.jpg', '.jpeg']); 

if (!fs.existsSync(contentDir)) fs.mkdirSync(contentDir, { recursive: true });

async function extractExif(filePath, ext) {
  let date = '';
  let camera = '';

  if (!extsExif.has(ext)) return { date, camera }; 

  try {
    const data = await exifr.parse(filePath, [
      'DateTimeOriginal', 'CreateDate', 'ModifyDate', 'Model', 'Make'
    ]);
    if (data) {
      const dt = data.DateTimeOriginal || data.CreateDate || data.ModifyDate;
      if (dt instanceof Date) date = dt.toISOString().split('T')[0]; 

      if (data.Model || data.Make) {
        camera = [data.Make, data.Model].filter(Boolean).join(' ').trim();
        if (camera === 'Canon Canon PowerShot G7 X Mark II') {
          camera = 'Canon PowerShot G7X Mark II';
        }
      }
    }
  } catch (e) {
    console.warn(`EXIF parse failed for ${path.basename(filePath)}: ${e.message}`);
  }
  return { date, camera };
}

async function main() {
  const files = listFiles(photosDir)
    .filter(f => extsAll.has(path.extname(f).toLowerCase()));

  if (files.length === 0) {
    return;
  }

  for (const absPath of files) {
    const file = path.relative(photosDir, absPath).replace(/\\/g, '/'); 
    const ext = path.extname(file).toLowerCase();
    const slug = path.basename(file, path.extname(file)).toLowerCase();
    const title = '';

    const { date, camera } = await extractExif(absPath, ext);

    const metadata = {
      slug,
      title,
      image: `/photos/${file}`,
      date,                 
      neighborhood: '',
      borough: '',
      camera,               
      latitude: '',
      longitude: '',
      tags: []
    };

    const outPath = path.join(contentDir, `${slug}.yml`);
    if (fs.existsSync(outPath)) {
      continue;
    }
    fs.writeFileSync(outPath, yaml.dump(metadata, { lineWidth: -1 }), 'utf8');
    console.log(`Created: ${slug}`);
  }

}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
