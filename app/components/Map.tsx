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
      className="h-[60vh] w-full rounded-lg z-0"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {photosWithLocation.map((photo) => (
        <Marker
          key={photo.slug}
          position={[Number(photo.latitude), Number(photo.longitude)]}
          title={photo.title}
        >
          <Popup>
            <div className="min-w-[120px]">
              <p className="font-medium text-sm mb-2">{photo.title}</p>
              {photo.image && (
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full rounded object-cover max-h-32"
                />
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
