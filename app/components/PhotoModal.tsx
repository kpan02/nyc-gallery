'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import type { Photo } from '@/lib/photos';

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

export default function PhotoModal({ photo, isOpen, onClose }: PhotoModalProps) {
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

  const location = [photo.neighborhood, photo.borough].filter(Boolean).join(', ');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-5xl w-full max-h-[95vh] flex flex-col bg-white rounded-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gray-500 hover:text-gray-700 text-2xl leading-none transition-colors"
        >
          ×
        </button>
        
        {/* Title on top */}
        <div className="px-6 py-4">
          <h2 className="text-2xl font-semibold text-gray-900 text-center">{photo.title}</h2>
        </div>
        
        {/* Image in the middle */}
        <div className="relative flex-1 min-h-0 flex items-center justify-center">
          <Image
            src={photo.image}
            alt={photo.title}
            width={1200}
            height={800}
            className="w-full h-full max-h-[65vh] object-contain"
            priority
          />
        </div>
        
        {/* Metadata on bottom */}
        <div className="px-6 py-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-black">
            {photo.date && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Date:</span>
                <span>{formatDate(photo.date)}</span>
              </div>
            )}
            
            {location && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Location:</span>
                <span>{location}</span>
              </div>
            )}
            
            {photo.camera && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Camera:</span>
                <span>{photo.camera}</span>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
