import Image from 'next/image';
import Link from 'next/link';
import { getAllPhotos } from '@/lib/photos';

export default function GalleryPage() {
  const photos = getAllPhotos();

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Gallery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map(photo => (
          <Link key={photo.slug} href={`/photo/${photo.slug}`} className="block">
            <div className="relative aspect-[3/2] rounded overflow-hidden">
              <Image
                src={photo.image}
                alt={photo.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-2 text-sm">{photo.title}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
