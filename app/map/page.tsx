import { getAllPhotos } from '@/lib/photos';
import MapWrapper from '@/app/components/MapWrapper';

export const dynamic = 'force-dynamic';

export default function MapPage() {
  const photos = getAllPhotos();

  return (
    <section className="space-y-4">
      <MapWrapper photos={photos} />
    </section>
  );
}
  