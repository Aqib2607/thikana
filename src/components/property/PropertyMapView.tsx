import React from "react";
import { MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyMapViewProps {
  address?: string | undefined;
  area?: string | undefined;
  city?: string | undefined;
  latitude?: number | undefined;
  longitude?: number | undefined;
  coordinates?: { lat: number; lng: number } | undefined;
  title?: string | undefined;
  className?: string | undefined;
}

export function PropertyMapView({
  address,
  area,
  city,
  latitude: rawLat,
  longitude: rawLng,
  coordinates,
  title,
  className = "",
}: PropertyMapViewProps) {
  const latitude = rawLat ?? coordinates?.lat ?? 22.825;
  const longitude = rawLng ?? coordinates?.lng ?? 89.542;
  const displayAddress = address ?? title ?? "Khulna";
  const displayArea = area ?? "Khulna";
  const displayCity = city ?? "Khulna";

  // OpenStreetMap embed coordinates bounding box (delta approx 0.008 for clean zoom)
  const delta = 0.008;
  const bbox = `${longitude - delta},${latitude - delta},${longitude + delta},${latitude + delta}`;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;
  const osmExternalUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=16/${latitude}/${longitude}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5 font-medium text-foreground">
          <MapPin className="w-4 h-4 text-primary shrink-0" />
          <span>
            {displayAddress}{displayArea !== displayAddress ? `, ${displayArea}` : ""}{displayCity !== displayArea ? `, ${displayCity}` : ""}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a href={osmExternalUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
              <span>OpenStreetMap</span>
              <ExternalLink className="w-3 h-3" />
            </Button>
          </a>
          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
              <span>Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </Button>
          </a>
        </div>
      </div>

      {/* Interactive Map Embed */}
      <div className="relative w-full h-72 sm:h-80 rounded-xl overflow-hidden border border-border/80 bg-slate-100 dark:bg-slate-800 shadow-xs">
        <iframe
          title={`Map location for ${address}`}
          src={osmEmbedUrl}
          className="w-full h-full border-0"
          loading="lazy"
        />
        {/* Pin Coordinates Badge */}
        <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs text-[11px] font-mono text-slate-700 dark:text-slate-300 border shadow-xs pointer-events-none">
          {latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E
        </div>
      </div>
    </div>
  );
}
