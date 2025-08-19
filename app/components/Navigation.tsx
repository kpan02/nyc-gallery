'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [theme, setTheme] = useState('dark');
  
  console.log('Current pathname:', pathname);
  console.log('Is root path?', pathname === '/');
  console.log('Is map path?', pathname === '/map');
  
  const isGalleryActive = pathname === '/' || pathname === '/photo';
  const isMapActive = pathname === '/map';
  
  useEffect(() => {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(savedTheme);
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
  };
  
  return (
    <nav className="flex items-center justify-between w-full">
      <div className="flex items-center gap-6">
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
      </div>
      
      <button
        onClick={toggleTheme}
        className="theme-toggle"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      >
        {theme === 'light' ? '☀︎' : '☾'}
      </button>
    </nav>
  );
}
