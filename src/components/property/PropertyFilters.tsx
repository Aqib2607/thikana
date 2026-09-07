import React from "react";
import { useTranslation } from "react-i18next";
import { Filter, RotateCcw } from "lucide-react";

import type { PropertyFilters as PropertyFiltersType, PropertyTypeSlug, FurnishedStatus } from "@/types/thikana";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface PropertyFiltersProps {
  filters: any;
  onChange: (filters: any) => void;
  onClear?: () => void;
  onReset?: () => void;
  className?: string;
}

const KHULNA_AREAS = [
  "সোনাডাঙ্গা",
  "বয়রা",
  "গল্লামারী",
  "খালিশপুর",
  "দৌলতপুর",
  "নিরালা",
  "শিববাড়ি",
  "মুজগুন্নী",
  "খুলনা বিশ্ববিদ্যালয় এলাকা",
];

export function PropertyFiltersPanel({ filters, onChange, onClear, onReset, className = "" }: PropertyFiltersProps) {
  const { t } = useTranslation();
  const handleClear = () => {
    if (onReset) onReset();
    else if (onClear) onClear();
  };

  const update = (key: keyof PropertyFiltersType, value: any) => {
    onChange({
      ...filters,
      [key]: value === "" || value === "all" ? undefined : value,
      page: 1, // reset page on filter change
    });
  };

  return (
    <div className={`space-y-5 bg-card p-5 rounded-xl border border-border/80 shadow-xs ${className}`}>
      <div className="flex items-center justify-between pb-3 border-b">
        <div className="flex items-center gap-2 font-semibold text-base">
          <Filter className="w-4 h-4 text-primary" />
          <span>{t("filters.title")}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-xs text-muted-foreground gap-1">
          <RotateCcw className="w-3 h-3" />
          {t("common.clear")}
        </Button>
      </div>

      {/* Area / Location */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">{t("filters.area")}</Label>
        <Select value={filters.area ?? "all"} onValueChange={(v) => update("area", v)}>
          <SelectTrigger className="w-full text-xs">
            <SelectValue placeholder={t("filters.area")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.all")} এলাকা (Khulna)</SelectItem>
            {KHULNA_AREAS.map((area) => (
              <SelectItem key={area} value={area}>
                {area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Property Type */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">{t("filters.type")}</Label>
        <Select value={filters.type ?? "all"} onValueChange={(v) => update("type", v as PropertyTypeSlug)}>
          <SelectTrigger className="w-full text-xs">
            <SelectValue placeholder={t("filters.type")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.all")} ধরন</SelectItem>
            <SelectItem value="apartment">{t("types.apartment")}</SelectItem>
            <SelectItem value="bachelor">{t("types.bachelor")}</SelectItem>
            <SelectItem value="room">{t("types.room")}</SelectItem>
            <SelectItem value="sublet">{t("types.sublet")}</SelectItem>
            <SelectItem value="house">{t("types.house")}</SelectItem>
            <SelectItem value="commercial">{t("types.commercial")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rent Range */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">{t("property.rent")} (৳)</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder={t("filters.minRent")}
            value={filters.minRent ?? ""}
            onChange={(e) => update("minRent", e.target.value ? Number(e.target.value) : undefined)}
            className="text-xs h-9"
          />
          <Input
            type="number"
            placeholder={t("filters.maxRent")}
            value={filters.maxRent ?? ""}
            onChange={(e) => update("maxRent", e.target.value ? Number(e.target.value) : undefined)}
            className="text-xs h-9"
          />
        </div>
      </div>

      {/* Rooms & Bathrooms */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium">{t("filters.rooms")}</Label>
          <Select
            value={filters.rooms ? String(filters.rooms) : "all"}
            onValueChange={(v) => update("rooms", v === "all" ? undefined : Number(v))}
          >
            <SelectTrigger className="text-xs h-9">
              <SelectValue placeholder={t("filters.rooms")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")}</SelectItem>
              <SelectItem value="1">১+ রুম</SelectItem>
              <SelectItem value="2">২+ রুম</SelectItem>
              <SelectItem value="3">৩+ রুম</SelectItem>
              <SelectItem value="4">৪+ রুম</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium">{t("filters.bathrooms")}</Label>
          <Select
            value={filters.bathrooms ? String(filters.bathrooms) : "all"}
            onValueChange={(v) => update("bathrooms", v === "all" ? undefined : Number(v))}
          >
            <SelectTrigger className="text-xs h-9">
              <SelectValue placeholder={t("filters.bathrooms")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")}</SelectItem>
              <SelectItem value="1">১+ বাথ</SelectItem>
              <SelectItem value="2">২+ বাথ</SelectItem>
              <SelectItem value="3">৩+ বাথ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Furnishing Status */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium">{t("filters.furnished")}</Label>
        <Select
          value={filters.furnished ?? "all"}
          onValueChange={(v) => update("furnished", v as FurnishedStatus)}
        >
          <SelectTrigger className="w-full text-xs h-9">
            <SelectValue placeholder={t("filters.furnished")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.all")}</SelectItem>
            <SelectItem value="unfurnished">{t("furnished.unfurnished")}</SelectItem>
            <SelectItem value="semi_furnished">{t("furnished.semi_furnished")}</SelectItem>
            <SelectItem value="furnished">{t("furnished.furnished")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Utilities & Amenities */}
      <div className="space-y-2.5 pt-2 border-t">
        <Label className="text-xs font-medium block">{t("filters.utilities")}</Label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={!!filters.gas}
              onCheckedChange={(checked) => update("gas", checked ? true : undefined)}
            />
            <span>{t("filters.gas")}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={!!filters.internet}
              onCheckedChange={(checked) => update("internet", checked ? true : undefined)}
            />
            <span>{t("filters.internet")}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={!!filters.parking}
              onCheckedChange={(checked) => update("parking", checked ? true : undefined)}
            />
            <span>{t("filters.parking")}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={!!filters.balcony}
              onCheckedChange={(checked) => update("balcony", checked ? true : undefined)}
            />
            <span>{t("filters.balcony")}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={!!filters.water}
              onCheckedChange={(checked) => update("water", checked ? true : undefined)}
            />
            <span>{t("filters.water")}</span>
          </label>
        </div>
      </div>
    </div>
  );
}

export const PropertyFilters = PropertyFiltersPanel;

