import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'NYC Captured',
  description: 'Photography by Kevin',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-neutral-900">
        <header className="border-b">
          <nav className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-6">
            <Link href="/" className="font-semibold">NYC Captured</Link>
            <Link href="/">Gallery</Link>
            <Link href="/map">Map</Link>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
