'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Inter } from 'next/font/google';
import type { Photo } from '@/lib/photos';

const inter = Inter({ weight: ['400', '600'], subsets: ['latin'] });

interface PhotoModalProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatCoordinate(value: number | string): string {
  return Number(value).toFixed(5);
}

export default function PhotoModal({ photo, isOpen, onClose }: PhotoModalProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    if (photo) {
      setIsImageLoaded(false);
    }
  }, [photo]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !photo) return null;

  const location = [photo.neighborhood, photo.borough].filter(Boolean).join(' · ');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 sm:p-4"
      onClick={onClose}
    >
      {!isImageLoaded ? (
        <>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-white/70 hover:text-white text-2xl leading-none transition-colors"
          >
            ×
          </button>
          {/* Invisible image to trigger load */}
          <div className="absolute opacity-0 w-0 h-0 overflow-hidden">
            <Image
              src={photo.image}
              alt=""
              width={1200}
              height={800}
              onLoad={() => setIsImageLoaded(true)}
              priority
            />
          </div>
        </>
      ) : (
        <div 
          className={`relative w-fit max-w-5xl max-h-[95vh] flex flex-col bg-[#FEFEFA] shadow-2xl overflow-hidden ${inter.className}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 z-10 text-gray-400 hover:text-gray-600 text-xl leading-none transition-colors"
          >
            ×
          </button>
          
          {/* Title and location on top */}
          <div className="px-4 pt-4 pb-2 sm:px-5 sm:pt-5 text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">{photo.title}</h2>
            {location && (
              <p className="text-xs sm:text-sm text-gray-600 mt-1">{location}</p>
            )}
          </div>
          
          {/* Image and metadata - shared width constraint */}
          <div className="flex flex-1 min-h-0 justify-center px-5 sm:px-7 overflow-hidden">
            <div className="flex flex-col items-center min-w-0">
              <div className="relative flex-1 min-h-0 flex items-center">
                <Image
                  src={photo.image}
                  alt={photo.title}
                  width={1200}
                  height={800}
                  className="max-h-[65vh] w-auto object-contain"
                  priority
                />
              </div>
              
              {/* Metadata constrained to image width, left-aligned */}
              <div className="w-full pt-1.5 pb-4 sm:pb-5 flex flex-col items-start gap-y-0.5 text-xs sm:text-sm text-gray-600">
                {(photo.date || photo.camera) && (
                  <div>
                    {[photo.date && formatDate(photo.date), photo.camera].filter(Boolean).join(' · ')}
                  </div>
                )}
                
                {(photo.latitude && photo.longitude) && (
                  <div className="text-xs sm:text-sm text-gray-500">
                    {formatCoordinate(photo.latitude)}, {formatCoordinate(photo.longitude)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
