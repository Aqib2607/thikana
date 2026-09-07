import { useState, useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useAuth } from '@/contexts/AuthContext';
import { LandlordLayout } from '@/components/layout/LandlordLayout';
import { InteractionsService } from '@/services/api/interactions.service';
import { VisitRequest } from '@/types/thikana';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  Phone,
  User,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/landlord/visits')({
  component: LandlordVisitsPage,
});

function LandlordVisitsPage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [visits, setVisits] = useState<VisitRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadVisits = async () => {
    setLoading(true);
    try {
      const list = await InteractionsService.getLandlordVisitRequests(user?.id || 'landlord-1');
      setVisits(list);
    } catch (err) {
      console.error('Failed to load landlord visits', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisits();
  }, [user]);

  const handleUpdateStatus = async (visitId: string, newStatus: 'confirmed' | 'rejected' | 'completed') => {
    await InteractionsService.updateVisitStatus(visitId, newStatus);
    toast.success(
      language === 'bn'
        ? `ভিজিট স্ট্যাটাস আপডেট হয়েছে: ${newStatus}`
        : `Visit status changed to ${newStatus}`
    );
    loadVisits();
  };

  return (
    <LandlordLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 uppercase tracking-wider mb-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{language === 'bn' ? 'পরিদর্শন ব্যবস্থাপনা' : 'Visit Scheduling'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'bn' ? 'বাসা পরিদর্শনের অনুরোধসমূহ' : 'Tenant Inspection Requests'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'ভাড়াটিয়াদের সুবিধাজনক সময় প্রস্তাবনা পর্যালোচনা ও অনুমোদন করুন।'
              : 'Review and confirm prospective tenant on-site visit appointments.'}
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
                {language === 'bn' ? 'কোনো ভিজিট শিডিউল নেই' : 'No visit requests received yet'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {language === 'bn'
                  ? 'ভাড়াটিয়ারা বাসা পরিদর্শনের প্রস্তাব পাঠালে আপনি এখানে নোটিফিকেশন দেখতে পাবেন।'
                  : 'Inspection appointments booked by tenants will appear here for your confirmation.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {visits.map((visit) => (
              <Card key={visit.id} className="border-slate-200 shadow-xs">
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          visit.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : visit.status === 'rejected'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }
                      >
                        {visit.status}
                      </Badge>
                      <span className="text-xs text-slate-400">ID: #{visit.id}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base">{visit.propertyTitle}</h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <User className="h-3.5 w-3.5 text-blue-600" />
                        <span>{visit.tenantName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-mono text-emerald-700">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{visit.tenantPhone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-purple-600" />
                        <span>{visit.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-purple-600" />
                        <span>{visit.time}</span>
                      </div>
                    </div>

                    {visit.notes && (
                      <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        "{visit.notes}"
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    {visit.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleUpdateStatus(visit.id, 'confirmed')}
                          className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          <span>{language === 'bn' ? 'অনুমোদন' : 'Accept'}</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUpdateStatus(visit.id, 'rejected')}
                          className="text-xs h-8 text-rose-600 hover:bg-rose-50"
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                          <span>{language === 'bn' ? 'প্রত্যাখ্যান' : 'Decline'}</span>
                        </Button>
                      </>
                    )}

                    {visit.status === 'confirmed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(visit.id, 'completed')}
                        className="text-xs h-8 border-slate-300"
                      >
                        <span>{language === 'bn' ? 'সম্পন্ন চিহ্নিত করুন' : 'Mark Completed'}</span>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </LandlordLayout>
  );
}
