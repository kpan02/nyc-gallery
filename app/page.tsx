import Image from 'next/image';
import Link from 'next/link';
import { getAllPhotos } from '@/lib/photos';

export default function GalleryPage() {
  const photos = getAllPhotos();

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Gallery</h1>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {photos.map(photo => (
          <Link key={photo.slug} href={`/photo/${photo.slug}`} className="block group break-inside-avoid mb-4">
            <div className="relative w-full rounded overflow-hidden bg-gray-100">
              <Image
                src={photo.image}
                alt={photo.title}
                width={600}
                height={400}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="mt-2 text-sm font-medium text-gray-900">{photo.title}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
