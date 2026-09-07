import React, { useState } from "react";
import type { PropertyImage } from "@/types/thikana";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyGalleryProps {
  images: (PropertyImage | string)[];
  title: string;
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-16/10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-muted-foreground border">
        <ImageIcon className="w-12 h-12 stroke-1" />
      </div>
    );
  }

  const currentItem = images[selectedIndex] ?? images[0];
  const currentUrl = typeof currentItem === "string" ? currentItem : currentItem?.url ?? "";
  const currentAlt = typeof currentItem === "string" ? title : currentItem?.alt || title;

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Main Image Viewport */}
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl bg-slate-900 border shadow-sm">
        <img
          src={currentUrl}
          alt={currentAlt}
          className="w-full h-full object-cover transition-all duration-300"
        />

        {/* Previous & Next Buttons */}
        {images.length > 1 && (
          <>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/50 text-white hover:bg-black/70 border-0 shadow-md backdrop-blur-xs"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/50 text-white hover:bg-black/70 border-0 shadow-md backdrop-blur-xs"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>

            {/* Counter */}
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-xs font-medium">
              {selectedIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {images.map((img, idx) => {
            const url = typeof img === "string" ? img : img.url;
            const alt = typeof img === "string" ? title : img.alt;
            const key = typeof img === "string" ? idx : img.id || idx;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative aspect-16/10 w-20 sm:w-24 shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  selectedIndex === idx ? "border-primary ring-2 ring-primary/20 scale-102" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img src={url} alt={alt} className="w-full h-full object-cover" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
