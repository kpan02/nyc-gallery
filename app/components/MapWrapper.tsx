'use client';

import dynamicImport from 'next/dynamic';
import type { Photo } from '@/lib/photos';

const Map = dynamicImport(() => import('@/app/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-[80vh] w-full rounded-lg bg-neutral-100 animate-pulse flex items-center justify-center">
      <span className="text-neutral-500">Loading map…</span>
    </div>
  ),
});

interface MapWrapperProps {
  photos: Photo[];
}

export default function MapWrapper({ photos }: MapWrapperProps) {
  return <Map photos={photos} />;
}
