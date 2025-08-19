import './globals.css';
import Link from 'next/link';
import Navigation from './components/Navigation';

export const metadata = {
  title: 'NYC GALLERY',
  description: '',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-900">
        <header>
          <div className="mx-auto max-w-6xl px-4">
            <div className="mb-4">
              <h1 className="site-title">NYC GALLERY</h1>
            </div>
          </div>
        </header>
        
        <div>
          <div className="mx-auto max-w-6xl px-4">
            <Navigation />
          </div>
        </div>
        
        <main className="mx-auto max-w-6xl px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
