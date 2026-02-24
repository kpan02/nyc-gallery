'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Photo } from '@/lib/photos';

// Fix default marker icon in Next.js (Leaflet uses window/document)
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function formatDate(dateString: string): string {
  const d = new Date(dateString);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  return `${month}-${day}-${year}`;
}

function formatCoordinate(value: number | string): string {
  return Number(value).toFixed(5);
}

function createThumbnailIcon(imageUrl: string, title: string) {
  return L.divIcon({
    className: 'thumbnail-marker',
    html: `<img src="${imageUrl}" alt="${title.replace(/"/g, '&quot;')}" style="width:48px;height:48px;object-fit:cover;border-radius:9999px;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.3);display:block" />`,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });
}

interface MapProps {
  photos: Photo[];
}

export default function Map({ photos }: MapProps) {
  const photosWithLocation = photos.filter(
    (p) => p.latitude != null && p.longitude != null && p.latitude !== 0 && p.longitude !== 0
  );

  return (
    <MapContainer
      center={[40.7128, -74.006]}
      zoom={12}
      className="h-[80vh] w-full rounded-lg z-0"
      scrollWheelZoom={true}
      attributionControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {photosWithLocation.map((photo) => (
        <Marker
          key={photo.slug}
          position={[Number(photo.latitude), Number(photo.longitude)]}
          icon={createThumbnailIcon(photo.image, photo.title)}
          title={photo.title}
        >
          <Popup>
            <div className="min-w-[180px] max-w-[240px] text-center">
              <h3 className="font-semibold text-base mb-1">{photo.title}</h3>
              {(photo.neighborhood || photo.borough) && (
                <p className="text-xs text-gray-600 mb-2">
                  {[photo.neighborhood, photo.borough].filter(Boolean).join(' · ')}
                </p>
              )}
              {photo.image && (
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full rounded object-cover max-h-40 mb-2 mx-auto"
                />
              )}
              <div className="text-xs text-gray-500 space-y-0.5">
                {(photo.date || photo.camera) && (
                  <p>{[photo.date && formatDate(photo.date), photo.camera].filter(Boolean).join(' · ')}</p>
                )}
                {photo.latitude != null && photo.longitude != null && (
                  <p>{formatCoordinate(photo.latitude)}, {formatCoordinate(photo.longitude)}</p>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
