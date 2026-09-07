import React from "react";
import { Badge } from "@/components/ui/badge";
import type { AvailabilityStatus } from "@/types/thikana";
import { useTranslation } from "react-i18next";

interface PropertyStatusBadgeProps {
  status: AvailabilityStatus;
  className?: string;
}

export function PropertyStatusBadge({ status, className = "" }: PropertyStatusBadgeProps) {
  const { t } = useTranslation();

  const config: Record<AvailabilityStatus, { labelKey: string; variantClass: string }> = {
    available: {
      labelKey: "availability.available",
      variantClass: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300",
    },
    reserved: {
      labelKey: "availability.reserved",
      variantClass: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300",
    },
    rented: {
      labelKey: "availability.rented",
      variantClass: "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300",
    },
    temporarily_unavailable: {
      labelKey: "availability.temporarily_unavailable",
      variantClass: "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border-rose-300",
    },
    inactive: {
      labelKey: "availability.inactive",
      variantClass: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-300",
    },
  };

  const current = config[status] ?? config.available;

  return (
    <Badge variant="outline" className={`font-medium px-2.5 py-0.5 rounded-full text-xs ${current.variantClass} ${className}`}>
      {t(current.labelKey)}
    </Badge>
  );
}
