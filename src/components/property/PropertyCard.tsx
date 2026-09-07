import React from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Scale, MapPin, BedDouble, Bath, Maximize2, Flame, Wifi, Car, Check } from "lucide-react";
import { useTranslation } from "react-i18next";

import type { Property } from "@/types/thikana";
import { Button } from "@/components/ui/button";
import { PropertyStatusBadge } from "./PropertyStatusBadge";
import { VerificationBadge } from "./VerificationBadge";
import { MatchScoreBadge } from "./MatchScoreBadge";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCompare } from "@/contexts/CompareContext";
import { useLanguage } from "@/i18n/LanguageProvider";

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export function PropertyCard({ property, className = "" }: PropertyCardProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, toggleCompare } = useCompare();

  const isFav = isFavorite(property.id);
  const inComp = isInCompare(property.id);

  const displayTitle = language === "en" && property.titleEn ? property.titleEn : property.title;
  const mainImage = property.images.find((img) => img.isMain)?.url ?? property.images[0]?.url;

  return (
    <div
      className={`group relative flex flex-col bg-card rounded-xl border border-border/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 ${
        property.availabilityStatus !== "available" ? "opacity-90" : ""
      } ${className}`}
    >
      {/* Media & Overlay badges */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Link to="/properties/$id" params={{ id: property.id }} className="block w-full h-full">
          <img
            src={mainImage}
            alt={displayTitle}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            loading="lazy"
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 items-center pointer-events-none">
          <PropertyStatusBadge status={property.availabilityStatus} />
          <VerificationBadge verifications={property.verifications} />
        </div>

        {/* Top Right Actions (Favorite & Compare) */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleCompare(property.id);
            }}
            title={inComp ? t("common.removeFromCompare") : t("common.addToCompare")}
            className={`h-8 w-8 rounded-full shadow-md backdrop-blur-xs transition-colors ${
              inComp
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-white/90 text-slate-700 hover:bg-white dark:bg-slate-900/90 dark:text-slate-200"
            }`}
          >
            <Scale className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            size="icon"
            variant="secondary"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(property.id);
            }}
            title={isFav ? t("common.removeFromFavorites") : t("common.saveToFavorites")}
            className={`h-8 w-8 rounded-full shadow-md backdrop-blur-xs transition-colors ${
              isFav
                ? "bg-rose-500 text-white hover:bg-rose-600"
                : "bg-white/90 text-slate-700 hover:bg-white dark:bg-slate-900/90 dark:text-slate-200"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFav ? "fill-white" : ""}`} />
          </Button>
        </div>

        {/* Matching Score Pill (Bottom Left of media) */}
        {property.match && (
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <MatchScoreBadge match={property.match} />
          </div>
        )}

        {/* Property Type Pill (Bottom Right of media) */}
        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium">
          {t(`types.${property.type}`)}
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Pricing & Location */}
        <div className="flex items-baseline justify-between gap-2 mb-1.5">
          <div className="text-xl font-bold text-primary">
            ৳{(property.monthlyRent ?? property.rent ?? 0).toLocaleString()}
            <span className="text-xs font-normal text-muted-foreground">{t("common.perMonth")}</span>
          </div>
          <div className="text-xs text-muted-foreground capitalize font-medium">
            {t(`furnished.${property.furnished}`)}
          </div>
        </div>

        {/* Title */}
        <Link
          to="/properties/$id"
          params={{ id: property.id }}
          className="font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors text-base mb-1"
          title={displayTitle}
        >
          {displayTitle}
        </Link>

        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
          <span className="line-clamp-1">
            {property.location.area}, {property.location.city}
          </span>
        </div>

        {/* Key Specifications (Rooms, Baths, Size) */}
        <div className="grid grid-cols-3 gap-2 py-2 border-y border-border/60 text-xs text-slate-600 dark:text-slate-300 mb-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <BedDouble className="w-3.5 h-3.5 text-primary/70" />
            <span>
              {property.rooms} {t("property.rooms")}
            </span>
          </div>
          <div className="flex items-center justify-center gap-1 border-x border-border/60">
            <Bath className="w-3.5 h-3.5 text-primary/70" />
            <span>
              {property.bathrooms} {t("property.bathrooms")}
            </span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <Maximize2 className="w-3.5 h-3.5 text-primary/70" />
            <span>
              {property.sizeSqft} {t("property.sqft")}
            </span>
          </div>
        </div>

        {/* Key Amenities Badges */}
        <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground mb-4">
          {property.gas && (
            <span className="inline-flex items-center gap-0.5 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded">
              <Flame className="w-3 h-3" /> {t("filters.gas")}
            </span>
          )}
          {property.internet && (
            <span className="inline-flex items-center gap-0.5 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded">
              <Wifi className="w-3 h-3" /> {t("filters.internet")}
            </span>
          )}
          {property.parking && (
            <span className="inline-flex items-center gap-0.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">
              <Car className="w-3 h-3" /> {t("filters.parking")}
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-1 flex items-center gap-2">
          <Link to="/properties/$id" params={{ id: property.id }} className="flex-1">
            <Button variant="default" size="sm" className="w-full font-medium">
              {t("common.viewDetails")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
