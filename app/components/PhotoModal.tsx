'use client';

import { useEffect } from 'react';
import Image from 'next/image';

interface PhotoModalProps {
  photo: {
    slug: string;
    title: string;
    image: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
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

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl max-h-full overflow-auto bg-white rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 transition-all"
        >
          ×
        </button>
        
        {/* Photo */}
        <div className="relative">
          <Image
            src={photo.image}
            alt={photo.title}
            width={1200}
            height={800}
            className="w-full h-auto max-h-[80vh] object-contain"
            priority
          />
        </div>
        
        {/* Title */}
        <div className="p-6 bg-white">
          <h2 className="text-xl font-semibold text-gray-900">{photo.title}</h2>
        </div>
      </div>
    </div>
  );
}
