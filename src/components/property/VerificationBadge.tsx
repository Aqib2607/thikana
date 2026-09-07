import React from "react";
import { ShieldCheck, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { PropertyVerification } from "@/types/thikana";
import { useTranslation } from "react-i18next";

interface VerificationBadgeProps {
  verifications?: PropertyVerification[] | undefined;
  verification?: any | undefined;
  className?: string | undefined;
  showDetails?: boolean | undefined;
}

export function VerificationBadge({
  verifications,
  verification,
  className = "",
  showDetails = false,
}: VerificationBadgeProps) {
  const { t } = useTranslation();

  const list: PropertyVerification[] = verifications ?? (
    typeof verification === "string" && verification === "verified"
      ? [
          { type: "ownership", status: "verified", verifiedAt: "2026-01-01" },
          { type: "phone", status: "verified", verifiedAt: "2026-01-01" },
        ]
      : verification?.addressVerified || verification?.ownershipVerified || verification?.physicalInspection
      ? [
          ...(verification.ownershipVerified ? [{ type: "ownership" as const, status: "verified" as const, verifiedAt: "2026-01-01" }] : []),
          ...(verification.addressVerified ? [{ type: "phone" as const, status: "verified" as const, verifiedAt: "2026-01-01" }] : []),
          ...(verification.physicalInspection ? [{ type: "physical_inspection" as const, status: "verified" as const, verifiedAt: "2026-01-01" }] : []),
        ]
      : []
  );

  const verifiedCount = list.filter((v) => v.status === "verified").length;
  const isAnyVerified = verifiedCount > 0;

  if (!isAnyVerified) {
    return (
      <Badge variant="outline" className={`bg-slate-50 text-slate-500 border-slate-200 text-xs ${className}`}>
        {t("verification.pending")}
      </Badge>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <div
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium cursor-help transition-colors bg-teal-50 text-teal-800 border border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800 ${className}`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>{t("verification.label")}</span>
            {showDetails && <span className="opacity-75">({verifiedCount}/4)</span>}
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-3 text-xs space-y-2 bg-popover text-popover-foreground border shadow-md">
          <div className="font-semibold text-teal-700 dark:text-teal-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>{t("verification.label")}</span>
          </div>
          <ul className="space-y-1 text-slate-600 dark:text-slate-300">
            {list.map((v) => (
              <li key={v.type} className="flex items-center justify-between">
                <span>{t(`verification.${v.type}`)}</span>
                <span className={v.status === "verified" ? "text-emerald-600 font-medium" : "text-slate-400"}>
                  {v.status === "verified" ? "✓ " + t("verification.verified") : t("verification.pending")}
                </span>
              </li>
            ))}
          </ul>
          <div className="pt-1.5 border-t border-border/60 text-[11px] text-muted-foreground flex items-start gap-1">
            <Info className="w-3 h-3 mt-0.5 shrink-0 text-amber-600" />
            <span>{t("verification.disclaimer")}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
