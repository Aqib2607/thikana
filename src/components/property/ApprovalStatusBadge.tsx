import React from "react";
import { Badge } from "@/components/ui/badge";
import type { ApprovalStatus } from "@/types/thikana";
import { useTranslation } from "react-i18next";

interface ApprovalStatusBadgeProps {
  status: ApprovalStatus;
  className?: string;
}

export function ApprovalStatusBadge({ status, className = "" }: ApprovalStatusBadgeProps) {
  const { t } = useTranslation();

  const config: Record<ApprovalStatus, { labelKey: string; variantClass: string }> = {
    draft: {
      labelKey: "approval.draft",
      variantClass: "bg-slate-100 text-slate-700 border-slate-300",
    },
    submitted: {
      labelKey: "approval.submitted",
      variantClass: "bg-blue-100 text-blue-800 border-blue-300",
    },
    approved: {
      labelKey: "approval.approved",
      variantClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
    },
    rejected: {
      labelKey: "approval.rejected",
      variantClass: "bg-red-100 text-red-800 border-red-300",
    },
  };

  const current = config[status] ?? config.draft;

  return (
    <Badge variant="outline" className={`font-medium px-2.5 py-0.5 rounded-full text-xs ${current.variantClass} ${className}`}>
      {t(current.labelKey)}
    </Badge>
  );
}
