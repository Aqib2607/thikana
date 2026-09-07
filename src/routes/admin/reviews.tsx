import { useState, useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { InteractionsService } from '@/services/api/interactions.service';
import { AdminService } from '@/services/api/admin.service';
import { Review } from '@/types/thikana';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Trash2, CheckCircle2, Eye, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/reviews')({
  component: AdminReviewsModerationPage,
});

function AdminReviewsModerationPage() {
  const { t, language } = useLanguage();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const list = await InteractionsService.getAllReviews();
      setReviews(list);
    } catch (err) {
      console.error('Failed to load reviews', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleDeleteReview = async (reviewId: string) => {
    if (confirm(language === 'bn' ? 'রিভিউটি মুছে ফেলতে চান?' : 'Delete this review?')) {
      await InteractionsService.deleteReview(reviewId);
      await AdminService.addAuditLog({
        actorName: 'অ্যাডমিন মডারেটর',
        actorRole: 'admin',
        action: 'REVIEW_DELETED',
        entityType: 'Review',
        entityId: reviewId,
        details: 'Review removed due to moderation criteria.',
      });
      toast.success(language === 'bn' ? 'রিভিউ মুছে ফেলা হয়েছে' : 'Review removed');
      loadReviews();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span>{language === 'bn' ? 'রিভিউ মডারেশন' : 'Review Moderation'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'bn' ? 'ভাড়াটিয়াদের রিভিউ ও মতামত নিরীক্ষণ' : 'Community Reviews Moderation'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'প্ল্যাটফর্মে দাখিলকৃত সকল প্রোপার্টি রিভিউ পরীক্ষা ও আপত্তিকর মন্তব্য সরিয়ে ফেলুন।'
              : 'Moderate tenant ratings and comments to ensure authentic, constructive feedback.'}
          </p>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <Card className="border-slate-200">
            <CardContent className="p-8 text-center text-xs text-slate-400">
              {language === 'bn' ? 'কোনো রিভিউ পাওয়া যায়নি' : 'No reviews recorded yet'}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <Card key={rev.id} className="border-slate-200 shadow-xs">
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-3.5 w-3.5 ${
                              s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-800">{rev.userName}</span>
                      <span className="text-xs text-slate-400 font-mono">#{rev.id}</span>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      "{rev.comment}"
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500">
                      <span>Property ID: #{rev.propertyId}</span>
                      <span>•</span>
                      <span>{rev.createdAt}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <Link to="/properties/$id" params={{ id: rev.propertyId }}>
                      <Button size="sm" variant="outline" className="h-8 text-xs border-slate-300">
                        <Eye className="h-3 w-3 mr-1" />
                        <span>{language === 'bn' ? 'প্রোপার্টি' : 'Property'}</span>
                      </Button>
                    </Link>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteReview(rev.id)}
                      className="h-8 text-xs text-rose-600 hover:bg-rose-50"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      <span>{language === 'bn' ? 'মুছে ফেলুন' : 'Remove'}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
