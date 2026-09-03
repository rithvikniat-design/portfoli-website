"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: { url: string; alt: string }[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  };

  const prev = () =>
    setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () =>
    setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <>
      {/* Thumbnail Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => openLightbox(i)}
            className="aspect-video rounded-lg overflow-hidden bg-charcoal-800 group cursor-pointer"
          >
            <img
              src={img.url}
              alt={img.alt || `Still ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-charcoal-950/95 backdrop-blur-sm flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white hover:text-gold-400 transition-colors"
            aria-label="Close lightbox"
          >
            <X size={28} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-4 md:left-8 text-white hover:text-gold-400 transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={36} />
          </button>

          <img
            src={images[currentIndex].url}
            alt={images[currentIndex].alt}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-4 md:right-8 text-white hover:text-gold-400 transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={36} />
          </button>

          <div className="absolute bottom-6 text-charcoal-400 text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
