export const dynamic = 'force-dynamic';

import Image from 'next/image';
import { getAllPhotos } from '@/lib/photos';
import { FAVORITE_PHOTOS } from '@/lib/favorite-photos';

export default function GalleryPage() {
  const allPhotos = getAllPhotos();
  const favorites = allPhotos.filter(photo => FAVORITE_PHOTOS.includes(photo.slug));
  const mainPhotos = allPhotos.filter(photo => !FAVORITE_PHOTOS.includes(photo.slug));

  return (
    <section>
      {/* Favorites Section */}
      <div className="space-y-2">
        <div className="columns-2 lg:columns-3 gap-4 space-y-4">
          {favorites.map((photo) => (
            <div key={photo.slug} className="block group break-inside-avoid mb-4">
              <div className="relative w-full overflow-hidden bg-gray-100">
                <Image
                  src={photo.image}
                  alt={photo.title}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
              </div>
              
              <div className="photo-caption mb-6">{photo.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Gallery Section (Column Layout & Random Ordering) */}
      <div className="columns-2 lg:columns-3 gap-4 space-y-4">
        {mainPhotos.map(photo => (
          <div key={photo.slug} className="block group break-inside-avoid mb-4">
            <div className="relative w-full overflow-hidden bg-gray-100">
              <Image
                src={photo.image}
                alt={photo.title}
                width={600}
                height={400}
                className="w-full h-auto object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={true}
                loading="eager"
              />
            </div>

            <div className="photo-caption mb-6">{photo.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
