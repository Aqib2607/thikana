import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Calendar } from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { sendVisitRequest } from "@/services/api/interactions.service";
import type { Property } from "@/types/thikana";

interface RequestVisitDialogProps {
  property: any;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

export function RequestVisitDialog({ property, trigger, isOpen, onClose }: RequestVisitDialogProps) {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isOpen !== undefined ? isOpen : internalOpen;
  const setOpen = (val: boolean) => {
    setInternalOpen(val);
    if (!val && onClose) {
      onClose();
    }
  };
  const [date, setDate] = useState("");
  const [time, setTime] = useState("16:00");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      toast.error(t("common.signInRequired"));
      return;
    }

    if (!date) {
      toast.error(t("validation.required"));
      return;
    }

    setLoading(true);
    try {
      await sendVisitRequest({
        propertyId: property.id,
        propertyTitle: property.titleBn || property.title || "Property",
        tenantId: user.id,
        tenantName: user.name,
        tenantPhone: user.phone,
        landlordId: property.landlord?.id ?? property.landlordId ?? "landlord-1",
        preferredDate: date,
        preferredTime: time,
        tenantNote: note.trim() || undefined,
      });
      toast.success(t("dialogs.visit.success"));
      setDate("");
      setNote("");
      setOpen(false);
    } catch {
      toast.error(t("states.errorBody"));
    } finally {
      setLoading(false);
    }
  };

  const areaStr = property.location?.area
    ? `${property.location.area}, ${property.location.city}`
    : (typeof property.location === "string" ? property.location : "");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : isOpen === undefined ? (
        <DialogTrigger asChild>
          <Button variant="default" className="gap-2">
            <Calendar className="w-4 h-4" />
            <span>{t("property.visit")}</span>
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("dialogs.visit.title")}</DialogTitle>
          <DialogDescription>
            {property.titleBn || property.title} {areaStr ? `• ${areaStr}` : ""}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="visit-date">{t("dialogs.visit.date")}</Label>
              <Input
                id="visit-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="visit-time">{t("dialogs.visit.time")}</Label>
              <Input
                id="visit-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="visit-note">{t("dialogs.visit.note")}</Label>
            <Textarea
              id="visit-note"
              rows={3}
              placeholder={t("dialogs.visit.notePlaceholder")}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t("auth.submitting") : t("dialogs.visit.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
