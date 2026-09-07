import { useState, useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { InteractionsService, type PropertyReport } from '@/services/api/interactions.service';
import { PropertiesService } from '@/services/api/properties.service';
import { AdminService } from '@/services/api/admin.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flag, CheckCircle2, AlertTriangle, Eye, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/reports')({
  component: AdminReportsPage,
});

function AdminReportsPage() {
  const { t, language } = useLanguage();

  const [reports, setReports] = useState<PropertyReport[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    setLoading(true);
    try {
      const list = await InteractionsService.getAllReports();
      setReports(list);
    } catch (err) {
      console.error('Failed to load reports', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleResolve = async (reportId: string) => {
    await InteractionsService.resolveReport(reportId);
    await AdminService.addAuditLog({
      actorName: 'অ্যাডমিন মডারেটর',
      actorRole: 'admin',
      action: 'REPORT_RESOLVED',
      entityType: 'PropertyReport',
      entityId: reportId,
      details: 'Report reviewed and resolved with no violation found.',
    });
    toast.success(
      language === 'bn' ? 'রিপোর্টটি সমাধান করা হয়েছে' : 'Report resolved'
    );
    loadReports();
  };

  const handleTakeDown = async (report: PropertyReport) => {
    if (confirm(language === 'bn' ? 'প্রোপার্টিটি প্ল্যাটফর্ম থেকে প্রত্যাহার করতে চান?' : 'Take down this property?')) {
      await PropertiesService.updateAvailabilityStatus(report.propertyId, 'inactive');
      await InteractionsService.resolveReport(report.id);
      await AdminService.addAuditLog({
        actorName: 'অ্যাডমিন মডারেটর',
        actorRole: 'admin',
        action: 'PROPERTY_TAKEDOWN',
        entityType: 'Property',
        entityId: report.propertyId,
        details: `Property taken down due to report #${report.id} (${report.reason})`,
      });
      toast.info(
        language === 'bn'
          ? 'প্রোপার্টিটি নিষ্ক্রিয় করা হয়েছে এবং রিপোর্ট মীমাংসা হয়েছে'
          : 'Property taken down and report resolved'
      );
      loadReports();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1">
            <Flag className="h-3.5 w-3.5" />
            <span>{language === 'bn' ? 'অভিযোগ ও মডারেশন' : 'Report Moderation'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'bn' ? 'ফ্ল্যাগড প্রোপার্টি রিপোর্টসমূহ' : 'Flagged Property Reports'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'ভাড়াটিয়াদের দ্বারা দাখিলকৃত ভুয়া বিজ্ঞাপন, ভুল তথ্য বা দালাল সংক্রান্ত অভিযোগ নিরীক্ষা করুন।'
              : 'Investigate reported listings for policy violations, fake info, or broker spam.'}
          </p>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <Card className="border-slate-200">
            <CardContent className="p-12 text-center space-y-3">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                {language === 'bn' ? 'কোনো অমীমাংসিত রিপোর্ট নেই' : 'No active reports'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'bn'
                  ? 'সকল অভিযোগ পর্যালোচনা ও নিষ্পত্তি করা হয়েছে।'
                  : 'All user reports have been moderated.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <Card key={report.id} className="border-slate-200 shadow-xs">
                <CardContent className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`text-[11px] font-semibold ${
                          report.status === 'resolved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {report.status}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-700">
                        {report.reason}
                      </Badge>
                      <span className="text-xs text-slate-400 font-mono">ID: #{report.id}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base">{report.propertyTitle}</h3>

                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      "{report.details || report.description}"
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Reported by: {report.reporterName}</span>
                      <span>•</span>
                      <span>{report.createdAt}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
                    <Link to="/properties/$id" params={{ id: report.propertyId }}>
                      <Button size="sm" variant="outline" className="h-8 text-xs border-slate-300">
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        <span>{language === 'bn' ? 'প্রোপার্টি দেখুন' : 'View Listing'}</span>
                      </Button>
                    </Link>

                    {report.status === 'open' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleResolve(report.id)}
                          className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                          <span>{language === 'bn' ? 'নিষ্পত্তি করুন' : 'Dismiss & Resolve'}</span>
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleTakeDown(report)}
                          className="h-8 text-xs"
                        >
                          <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                          <span>{language === 'bn' ? 'বাসা সরিয়ে নিন' : 'Take Down Listing'}</span>
                        </Button>
                      </>
                    )}
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
