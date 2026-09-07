import { useState, useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useAuth } from '@/contexts/AuthContext';
import { TenantLayout } from '@/components/layout/TenantLayout';
import { InteractionsService } from '@/services/api/interactions.service';
import { Review } from '@/types/thikana';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MessageSquare, ExternalLink, ArrowRight } from 'lucide-react';

export const Route = createFileRoute('/tenant/reviews')({
  component: TenantReviewsPage,
});

function TenantReviewsPage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReviews() {
      setLoading(true);
      try {
        const allReviews = await InteractionsService.getAllReviews();
        // Filter reviews created by tenant
        const userRevs = allReviews.filter(
          (r: any) => r.userId === (user?.id || 'tenant-1') || r.authorName === (user?.name || 'তানভীর আহমেদ')
        );
        setReviews(userRevs as any);
      } catch (err) {
        console.error('Failed to load user reviews', err);
      } finally {
        setLoading(false);
      }
    }
    loadReviews();
  }, [user]);

  return (
    <TenantLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span>{language === 'bn' ? 'রিভিউ ও প্রতিক্রিয়া' : 'My Reviews'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'bn' ? 'আপনার প্রদত্ত রিভিউসমূহ' : 'Submitted Property Reviews'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'অন্যান্য ভাড়াটিয়াদের সহায়তার জন্য প্রোপার্টি ও পরিবেশ সম্পর্কে আপনার সত্যানুভূতি।'
              : 'Feedback shared to help fellow Khulna tenants choose suitable accommodation.'}
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-28 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <Card className="border-slate-200">
            <CardContent className="p-12 text-center space-y-3">
              <Star className="h-12 w-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                {language === 'bn' ? 'কোনো রিভিউ জমা দেওয়া হয়নি' : 'No reviews written yet'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {language === 'bn'
                  ? 'আপনি পরিদর্শন করা বা থাকার অভিজ্ঞতা সম্পন্ন বাসার পাতায় গিয়ে "রিভিউ লিখুন" বাটনে ক্লিক করতে পারেন।'
                  : 'You can write genuine reviews on any property detail page after visiting.'}
              </p>
              <Link to="/properties">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs mt-2">
                  {language === 'bn' ? 'বাসা ব্রাউজ করুন' : 'Browse Properties'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <Card key={rev.id} className="border-slate-200 shadow-xs">
                <CardContent className="p-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-4 w-4 ${
                            s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">{rev.createdAt}</span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    "{rev.comment}"
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-500 font-medium">Property ID: #{rev.propertyId}</span>
                    <Link to="/properties/$id" params={{ id: rev.propertyId }}>
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-emerald-700 hover:bg-emerald-50">
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        <span>{language === 'bn' ? 'প্রোপার্টিতে যান' : 'View Property'}</span>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </TenantLayout>
  );
}
