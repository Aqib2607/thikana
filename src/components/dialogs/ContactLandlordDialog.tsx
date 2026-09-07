import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Send } from "lucide-react";

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
import { useAuth } from "@/contexts/AuthContext";
import { sendContactRequest } from "@/services/api/interactions.service";
import type { Property } from "@/types/thikana";

interface ContactLandlordDialogProps {
  property: Property | any;
  trigger?: React.ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

export function ContactLandlordDialog({ property, trigger, isOpen, onClose }: ContactLandlordDialogProps) {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [internalOpen, setInternalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const isControlled = isOpen !== undefined;
  const open = isControlled ? isOpen : internalOpen;
  const setOpen = (val: boolean) => {
    if (isControlled) {
      if (!val && onClose) onClose();
    } else {
      setInternalOpen(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      toast.error(t("common.signInRequired"));
      return;
    }

    if (!message.trim()) {
      toast.error(t("validation.required"));
      return;
    }

    setLoading(true);
    try {
      await sendContactRequest({
        propertyId: property.id,
        propertyTitle: property.title ?? property.titleBn ?? "Property",
        tenantId: user.id,
        tenantName: user.name,
        tenantPhone: user.phone,
        landlordId: property.landlord?.id ?? "landlord-1",
        message: message.trim(),
      });
      toast.success(t("dialogs.contact.success"));
      setMessage("");
      setOpen(false);
    } catch {
      toast.error(t("states.errorBody"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          {trigger ?? (
            <Button variant="outline" className="gap-2">
              <Send className="w-4 h-4 text-primary" />
              <span>{t("property.contact")}</span>
            </Button>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("dialogs.contact.title")}</DialogTitle>
          <DialogDescription>
            {property.title ?? property.titleBn ?? ""} • {property.landlord?.name ?? ""}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="contact-msg">{t("dialogs.contact.messageLabel")}</Label>
            <Textarea
              id="contact-msg"
              rows={4}
              placeholder={t("dialogs.contact.placeholder")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t("auth.submitting") : t("dialogs.contact.send")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
