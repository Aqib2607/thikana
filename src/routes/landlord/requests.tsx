import { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useAuth } from '@/contexts/AuthContext';
import { LandlordLayout } from '@/components/layout/LandlordLayout';
import { InteractionsService } from '@/services/api/interactions.service';
import { ContactRequest } from '@/types/thikana';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Inbox,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/landlord/requests')({
  component: LandlordRequestsPage,
});

function LandlordRequestsPage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const list = await InteractionsService.getLandlordContactRequests(user?.id || 'landlord-1');
      setRequests(list as any);
    } catch (err) {
      console.error('Failed to load requests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [user]);

  const handleStatusChange = async (reqId: string, status: any) => {
    await InteractionsService.updateContactRequestStatus(reqId, status);
    toast.success(
      language === 'bn' ? `স্ট্যাটাস পরিবর্তিত হয়েছে: ${status}` : `Status updated to ${status}`
    );
    loadRequests();
  };

  return (
    <LandlordLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
            <Inbox className="h-3.5 w-3.5" />
            <span>{language === 'bn' ? 'ভাড়াটিয়ার অনুসন্ধান' : 'Inquiries & Contact Requests'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'bn' ? 'ভাড়াটিয়াদের সরাসরি যোগাযোগের অনুরোধ' : 'Direct Tenant Inquiries'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'ভাড়াটিয়ারা আপনার প্রোপার্টির জন্য যেসব ইনকোয়ারি ও যোগাযোগের তথ্য পাঠিয়েছেন।'
              : 'Direct leads from interested tenants across Khulna.'}
          </p>
        </div>

        {/* Requests List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <Card className="border-slate-200">
            <CardContent className="p-12 text-center space-y-3">
              <Inbox className="h-12 w-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                {language === 'bn' ? 'কোনো নতুন ইনকোয়ারি নেই' : 'No inquiries received yet'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'bn'
                  ? 'ভাড়াটিয়ারা যোগাযোগ করলে তাদের নাম, মোবাইল ও বার্তা এখানে প্রদর্শিত হবে।'
                  : 'Tenant inquiries submitted via property pages will appear here.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <Card key={req.id} className="border-slate-200 shadow-xs">
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          req.status === 'contacted'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : req.status === 'closed'
                            ? 'bg-slate-100 text-slate-600 border-slate-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }
                      >
                        {req.status}
                      </Badge>
                      <span className="text-xs text-slate-400">{req.createdAt}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base">{req.tenantName}</h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 font-mono text-emerald-700 font-semibold">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{req.tenantPhone}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        <span>{req.tenantEmail}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      "{req.message}"
                    </p>
                  </div>

                  {/* Status update buttons */}
                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(req.id, 'contacted')}
                      className="text-xs h-8 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      <span>{language === 'bn' ? 'কথা বলেছি' : 'Contacted'}</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleStatusChange(req.id, 'closed')}
                      className="text-xs h-8 text-slate-500 hover:bg-slate-100"
                    >
                      <span>{language === 'bn' ? 'ক্লোজ' : 'Close'}</span>
                    </Button>
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
