import React from "react";
import { PropertyCard } from "./PropertyCard";
import type { Property } from "@/types/thikana";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SearchX, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PropertyGridProps {
  properties: Property[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onClearFilters?: () => void;
}

export function PropertyGrid({
  properties,
  isLoading = false,
  isError = false,
  onRetry,
  onClearFilters,
}: PropertyGridProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3 rounded-xl border p-4 bg-card">
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="grid grid-cols-3 gap-2 py-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-9 w-full mt-2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-xl bg-card">
        <AlertCircle className="w-12 h-12 text-destructive mb-3" />
        <h3 className="text-lg font-semibold mb-1">{t("states.errorTitle")}</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">{t("states.errorBody")}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            {t("common.retry")}
          </Button>
        )}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-xl bg-card">
        <SearchX className="w-12 h-12 text-muted-foreground/60 mb-3" />
        <h3 className="text-lg font-semibold mb-1">{t("states.emptyTitle")}</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-sm">{t("states.emptyBody")}</p>
        {onClearFilters && (
          <Button onClick={onClearFilters} variant="secondary" size="sm">
            {t("common.clear")}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
