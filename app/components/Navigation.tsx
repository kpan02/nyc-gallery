'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  
  console.log('Current pathname:', pathname);
  console.log('Is root path?', pathname === '/');
  console.log('Is map path?', pathname === '/map');
  
  const isGalleryActive = pathname === '/' || pathname === '/photo';
  const isMapActive = pathname === '/map';
  
  return (
    <nav className="flex items-center gap-6">
      <Link 
        href="/" 
        className={`nav-link ${isGalleryActive ? 'active' : ''}`}
      >
        PHOTOS
      </Link>
      <Link 
        href="/map" 
        className={`nav-link ${isMapActive ? 'active' : ''}`}
      >
        MAP
      </Link>
    </nav>
  );
}
