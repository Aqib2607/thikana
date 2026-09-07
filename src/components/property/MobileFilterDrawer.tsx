import React, { useState } from "react";
import { Filter } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PropertyFiltersPanel } from "./PropertyFilters";
import type { PropertyFilters } from "@/types/thikana";

interface MobileFilterDrawerProps {
  filters: any;
  onChange: (filters: any) => void;
  onClear?: () => void;
  onReset?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  activeCount?: number;
}

export function MobileFilterDrawer({
  filters,
  onChange,
  onClear,
  onReset,
  isOpen,
  onClose,
  activeCount: rawActiveCount,
}: MobileFilterDrawerProps) {
  const { t } = useTranslation();
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = isOpen !== undefined;
  const open = isControlled ? isOpen : internalOpen;
  const setOpen = (val: boolean) => {
    if (isControlled) {
      if (!val && onClose) onClose();
    } else {
      setInternalOpen(val);
    }
  };

  const clearHandler = () => {
    if (onClear) onClear();
    if (onReset) onReset();
  };

  // Calculate count of active filters if not explicitly passed
  const activeCount = rawActiveCount ?? Object.entries(filters || {}).filter(
    ([key, value]) => value !== undefined && value !== "" && key !== "sort" && key !== "page" && key !== "perPage"
  ).length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="lg:hidden flex items-center gap-2">
            <Filter className="w-4 h-4 text-primary" />
            <span>{t("filters.title")}</span>
            {activeCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {activeCount}
              </span>
            )}
          </Button>
        </SheetTrigger>
      )}
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl p-4">
        <SheetHeader className="pb-3 border-b">
          <SheetTitle className="text-left text-base font-semibold">{t("filters.title")}</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <PropertyFiltersPanel
            filters={filters}
            onChange={(newFilters) => {
              onChange(newFilters);
            }}
            onClear={clearHandler}
            className="border-0 shadow-none p-0 bg-transparent"
          />
        </div>
        <div className="pt-2 border-t flex gap-2">
          <Button
            className="flex-1"
            onClick={() => {
              setOpen(false);
            }}
          >
            {t("common.apply")}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              clearHandler();
              setOpen(false);
            }}
          >
            {t("common.clear")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
