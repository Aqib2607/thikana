import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Star } from "lucide-react";

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
import { submitReview } from "@/services/api/interactions.service";

interface ReviewPropertyDialogProps {
  propertyId: string;
  propertyTitle: string;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function ReviewPropertyDialog({
  propertyId,
  propertyTitle,
  trigger,
  onSuccess,
  isOpen,
  onClose,
}: ReviewPropertyDialogProps) {
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
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      toast.error(t("common.signInRequired"));
      return;
    }

    if (!comment.trim()) {
      toast.error(t("validation.required"));
      return;
    }

    setLoading(true);
    try {
      await submitReview({
        propertyId,
        authorName: user.name,
        rating,
        comment: comment.trim(),
      });
      toast.success(t("dialogs.review.success"));
      setComment("");
      setOpen(false);
      onSuccess?.();
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
          <Button variant="outline" size="sm" className="gap-1.5">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>{t("dialogs.review.title")}</span>
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("dialogs.review.title")}</DialogTitle>
          <DialogDescription>{propertyTitle}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Star Selector */}
          <div className="space-y-1.5">
            <Label>{t("dialogs.review.rating")}</Label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 cursor-pointer transition-transform hover:scale-110 focus:outline-hidden"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? "text-amber-500 fill-amber-500" : "text-slate-300 dark:text-slate-600"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 font-semibold text-sm">{rating}/5</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rev-comment">{t("dialogs.review.comment")}</Label>
            <Textarea
              id="rev-comment"
              rows={4}
              placeholder={t("dialogs.review.placeholder")}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t("auth.submitting") : t("dialogs.review.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
