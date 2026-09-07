import React from "react";
import { ArrowUpDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { PropertySort } from "@/types/thikana";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PropertySortDropdownProps {
  value: PropertySort;
  onChange: (value: PropertySort) => void;
  className?: string;
}

export function PropertySortDropdown({ value, onChange, className = "" }: PropertySortDropdownProps) {
  const { t } = useTranslation();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <Select value={value} onValueChange={(v) => onChange(v as PropertySort)}>
        <SelectTrigger className="w-[170px] sm:w-[190px] h-9 text-xs">
          <SelectValue placeholder={t("sort.label")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">{t("sort.relevance")}</SelectItem>
          <SelectItem value="newest">{t("sort.newest")}</SelectItem>
          <SelectItem value="rent_asc">{t("sort.rent_asc")}</SelectItem>
          <SelectItem value="rent_desc">{t("sort.rent_desc")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
