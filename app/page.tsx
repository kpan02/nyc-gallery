export const dynamic = 'force-dynamic';

import { getAllPhotos } from '@/lib/photos';
import { FAVORITE_PHOTOS } from '@/lib/favorite-photos';
import Gallery from './components/Gallery';

export default function GalleryPage() {
  const allPhotos = getAllPhotos();
  const favorites = allPhotos.filter(photo => FAVORITE_PHOTOS.includes(photo.slug));
  const mainPhotos = allPhotos.filter(photo => !FAVORITE_PHOTOS.includes(photo.slug));

  return <Gallery favorites={favorites} mainPhotos={mainPhotos} />;
}
