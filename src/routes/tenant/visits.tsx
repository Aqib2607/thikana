import { useState, useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useAuth } from '@/contexts/AuthContext';
import { TenantLayout } from '@/components/layout/TenantLayout';
import { InteractionsService } from '@/services/api/interactions.service';
import { VisitRequest } from '@/types/thikana';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  XCircle,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/tenant/visits')({
  component: TenantVisitsPage,
});

function TenantVisitsPage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [visits, setVisits] = useState<VisitRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadVisits = async () => {
    setLoading(true);
    try {
      const list = await InteractionsService.getTenantVisitRequests(user?.id || 'tenant-1');
      setVisits(list as any);
    } catch (err) {
      console.error('Failed to load visits', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisits();
  }, [user]);

  const handleCancel = async (visitId: string) => {
    await InteractionsService.updateVisitStatus(visitId, 'rejected');
    toast.info(language === 'bn' ? 'ভিজিট অনুরোধ বাতিল করা হয়েছে' : 'Visit request cancelled');
    loadVisits();
  };

  return (
    <TenantLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 uppercase tracking-wider mb-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{language === 'bn' ? 'বাসা পরিদর্শন ট্র্যাকার' : 'Inspection Schedule'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'bn' ? 'নির্ধারিত ও অতীত ভিজিট অনুরোধসমূহ' : 'Scheduled Property Visits'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'আপনার প্রস্তাবিত তারিখ ও সময় অনুযায়ী বাড়িওয়ালাদের সিদ্ধান্ত ট্র্যাক করুন।'
              : 'Track status and timings of your on-site property inspection requests.'}
          </p>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : visits.length === 0 ? (
          <Card className="border-slate-200">
            <CardContent className="p-12 text-center space-y-3">
              <Calendar className="h-12 w-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                {language === 'bn' ? 'কোনো ভিজিট শিডিউল নেই' : 'No visits scheduled yet'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {language === 'bn'
                  ? 'যেকোনো প্রোপার্টির বিস্তারিত পাতায় গিয়ে "বাসা পরিদর্শনের অনুরোধ" বাটনে ক্লিক করে সুবিধাজনক সময় নির্ধারণ করুন।'
                  : 'Submit inspection requests on any property detail page to meet the landlord and verify the flat.'}
              </p>
              <Link to="/properties">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs mt-2">
                  {language === 'bn' ? 'বাসা খুঁজুন' : 'Explore Properties'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {visits.map((visit) => (
              <Card key={visit.id} className="border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-[11px] font-semibold ${
                          visit.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : visit.status === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {visit.status === 'confirmed'
                          ? language === 'bn' ? 'অনুমোদিত / নিশ্চিত' : 'Confirmed'
                          : visit.status === 'rejected'
                          ? language === 'bn' ? 'বাতিল' : 'Cancelled'
                          : language === 'bn' ? 'বিবেচনাধীন' : 'Pending'}
                      </Badge>
                      <span className="text-xs text-slate-400">ID: #{visit.id}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base">{visit.propertyTitle}</h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-purple-600" />
                        <span>{visit.preferredDate || visit.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-purple-600" />
                        <span>{visit.preferredTime || visit.time}</span>
                      </div>
                    </div>

                    {(visit.tenantNote || visit.notes) && (
                      <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        {visit.tenantNote || visit.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <Link to="/properties/$id" params={{ id: visit.propertyId }}>
                      <Button size="sm" variant="outline" className="text-xs h-8 border-slate-300">
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        <span>{language === 'bn' ? 'প্রোপার্টি দেখুন' : 'View Listing'}</span>
                      </Button>
                    </Link>

                    {visit.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCancel(visit.id)}
                        className="text-xs h-8 text-rose-600 hover:bg-rose-50"
                      >
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                        <span>{language === 'bn' ? 'বাতিল করুন' : 'Cancel'}</span>
                      </Button>
                    )}
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
