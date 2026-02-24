'use client';

import { MapContainer, TileLayer, Marker, Popup, LayersControl } from 'react-leaflet';
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

/** Derives thumbnail URL from full image path: /photos/dumbo-1.JPG → /photos/thumbs/dumbo-1.webp */
function getThumbnailUrl(imagePath: string): string {
  const base = imagePath.replace(/\.(jpg|jpeg|png|webp|avif)$/i, '').split('/').pop() || '';
  return `/photos/thumbs/${base.toLowerCase()}.webp`;
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
      <LayersControl position="bottomleft">
        <LayersControl.BaseLayer checked name="Street">
          <TileLayer
            attribution=""
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite">
          <TileLayer
            attribution=""
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={18}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Minimalist">
          <TileLayer
            attribution=""
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            maxZoom={19}
          />
        </LayersControl.BaseLayer>
      </LayersControl>
      {photosWithLocation.map((photo) => (
        <Marker
          key={photo.slug}
          position={[Number(photo.latitude), Number(photo.longitude)]}
          icon={createThumbnailIcon(getThumbnailUrl(photo.image), photo.title)}
          title={photo.title}
        >
          <Popup className="custom-popup" minWidth={200} maxWidth={200}>
            <div className="map-info-window">
              <div className="date">{photo.title}</div>
              {(photo.neighborhood || photo.borough) && (
                <div className="description">
                  {[photo.neighborhood, photo.borough].filter(Boolean).join(' · ')}
                </div>
              )}
              {photo.image && (
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="popup-image"
                />
              )}
              {(photo.date || photo.camera) && (
                <div className="description">
                  {[photo.date && formatDate(photo.date), photo.camera].filter(Boolean).join(' · ')}
                </div>
              )}
              {photo.latitude != null && photo.longitude != null && (
                <div className="description">
                  {formatCoordinate(photo.latitude)}, {formatCoordinate(photo.longitude)}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
