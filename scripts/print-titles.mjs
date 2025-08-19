#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const CONTENT_DIR = path.join(process.cwd(), 'content/photos');

try {
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
  
  console.log('Photo Titles:\n');
  
  files.forEach(file => {
    const filePath = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = yaml.load(raw);
    
    if (data.title) {
      console.log(`• ${data.title}`);
    }
  });
  
  console.log(`\nTotal photos: ${files.length}`);
} catch (error) {
  console.error('Error reading photos:', error.message);
}
