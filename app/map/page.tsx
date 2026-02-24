import { getAllPhotos } from '@/lib/photos';
import MapWrapper from '@/app/components/MapWrapper';

export const dynamic = 'force-dynamic';

export default function MapPage() {
  const photos = getAllPhotos();

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Map</h1>
      <p className="text-neutral-600">Photo locations in NYC</p>
      <MapWrapper photos={photos} />
    </section>
  );
}
  