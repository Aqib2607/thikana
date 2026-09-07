import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Flag } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { submitPropertyReport, type PropertyReport } from "@/services/api/interactions.service";
import type { Property } from "@/types/thikana";

interface ReportPropertyDialogProps {
  property: any;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

export function ReportPropertyDialog({ property, trigger, isOpen, onClose }: ReportPropertyDialogProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = (val: boolean) => {
    setInternalOpen(val);
    if (!val && onClose) {
      onClose();
    }
  };
  const [reason, setReason] = useState<PropertyReport["reason"]>("incorrect");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error(t("validation.required"));
      return;
    }

    setLoading(true);
    try {
      await submitPropertyReport({
        propertyId: property.id,
        propertyTitle: property.titleBn || property.title || "Property",
        reporterId: user?.id ?? "guest-reporter",
        reporterName: user?.name ?? "ভিজিটর",
        reason,
        description: description.trim(),
      });
      toast.success(t("dialogs.report.success"));
      setDescription("");
      setOpen(false);
    } catch {
      toast.error(t("states.errorBody"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : isOpen === undefined ? (
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive gap-1.5 text-xs">
            <Flag className="w-3.5 h-3.5" />
            <span>{t("property.report")}</span>
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("dialogs.report.title")}</DialogTitle>
          <DialogDescription>{property.titleBn || property.title}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="report-reason">{t("dialogs.report.reason")}</Label>
            <Select value={reason} onValueChange={(v) => setReason(v as PropertyReport["reason"])}>
              <SelectTrigger id="report-reason" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fake">{t("dialogs.report.fake")}</SelectItem>
                <SelectItem value="rented">{t("dialogs.report.rented")}</SelectItem>
                <SelectItem value="incorrect">{t("dialogs.report.incorrect")}</SelectItem>
                <SelectItem value="suspicious">{t("dialogs.report.suspicious")}</SelectItem>
                <SelectItem value="inappropriate">{t("dialogs.report.inappropriate")}</SelectItem>
                <SelectItem value="other">{t("dialogs.report.other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="report-desc">{t("dialogs.report.description")}</Label>
            <Textarea
              id="report-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="সমস্যাটির বিস্তারিত বিবরণ দিন…"
              required
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" variant="destructive" disabled={loading}>
              {loading ? t("auth.submitting") : t("dialogs.report.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
