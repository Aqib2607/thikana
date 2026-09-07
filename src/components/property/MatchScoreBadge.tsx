import React from "react";
import { Sparkles, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import type { MatchResult } from "@/types/thikana";
import { useTranslation } from "react-i18next";

interface MatchScoreBadgeProps {
  match?: MatchResult | undefined;
  score?: number | undefined;
  explanation?: string | undefined;
  className?: string | undefined;
  showBreakdown?: boolean | undefined;
}

export function MatchScoreBadge({
  match,
  score: rawScore,
  explanation,
  className = "",
  showBreakdown = true,
}: MatchScoreBadgeProps) {
  const { t } = useTranslation();

  const effectiveMatch: MatchResult | undefined = match ?? (rawScore !== undefined ? { score: rawScore, factors: [] } : undefined);
  if (!effectiveMatch) return null;

  const score = effectiveMatch.score;

  // Color gradient based on score
  let badgeColor = "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300";
  let iconColor = "text-emerald-600 dark:text-emerald-400";
  if (score < 50) {
    badgeColor = "bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300";
    iconColor = "text-amber-600 dark:text-amber-400";
  } else if (score < 75) {
    badgeColor = "bg-teal-50 text-teal-800 border-teal-300 dark:bg-teal-950/40 dark:text-teal-300";
    iconColor = "text-teal-600 dark:text-teal-400";
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={150}>
        <TooltipTrigger asChild>
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-help border shadow-xs transition-transform hover:scale-105 ${badgeColor} ${className}`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${iconColor}`} />
            <span>{t("match.score", { score })}</span>
          </div>
        </TooltipTrigger>
        {showBreakdown && match && (
          <TooltipContent className="w-64 p-3 text-xs space-y-2.5 bg-popover text-popover-foreground border shadow-lg">
            <div className="flex items-center justify-between border-b pb-1.5">
              <span className="font-semibold text-sm">{t("match.score", { score })}</span>
              <span className="text-[10px] text-muted-foreground font-mono">{t("match.why")}</span>
            </div>

            <div className="space-y-1.5">
              {match.factors.map((f) => {
                const percent = Math.round((f.earned / f.weight) * 100);
                return (
                  <div key={f.key} className="space-y-0.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span>{t(`match.${f.key}`)}</span>
                      <span className="font-mono text-muted-foreground">
                        {f.earned}/{f.weight}
                      </span>
                    </div>
                    <Progress value={percent} className="h-1.5" />
                  </div>
                );
              })}
            </div>

            <div className="pt-1 border-t text-[10px] text-muted-foreground flex items-start gap-1">
              <Info className="w-3 h-3 mt-0.5 shrink-0 text-slate-400" />
              <span>{t("match.ruleBasedExplanation")}</span>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
