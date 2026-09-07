import { useState, useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminService, AdminAnalytics, AuditLog } from '@/services/api/admin.service';
import { PropertiesService } from '@/services/api/properties.service';
import { InteractionsService, type PropertyReport } from '@/services/api/interactions.service';
import { Property } from '@/types/thikana';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ShieldCheck,
  CheckSquare,
  BadgeCheck,
  Building,
  Flag,
  Users,
  History,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

export const Route = createFileRoute('/admin/dashboard')({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const { t, language } = useLanguage();

  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [pendingProperties, setPendingProperties] = useState<Property[]>([]);
  const [recentReports, setRecentReports] = useState<PropertyReport[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      setLoading(true);
      try {
        const stats = await AdminService.fetchAdminAnalytics();
        setAnalytics(stats);

        const pending = await PropertiesService.getPendingProperties();
        setPendingProperties(pending);

        const reports = await InteractionsService.getAllReports();
        setRecentReports(reports);

        const logs = await AdminService.fetchAuditLogs();
        setAuditLogs(logs.slice(0, 5));
      } catch (err) {
        console.error('Failed to load admin dashboard data', err);
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 uppercase tracking-wider mb-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{language === 'bn' ? 'অ্যাডমিনিস্ট্রেটর কনসোল' : 'Administration & Moderation'}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {language === 'bn' ? 'ঠিকানা নিয়ন্ত্রণ ও নিরীক্ষণ ড্যাশবোর্ড' : 'Platform Operations & Oversight'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {language === 'bn'
                ? 'লিস্টিং অনুমোদন, সিমুলেটেড যাচাইকরণ এবং প্ল্যাটফর্মের স্বচ্ছতা নিয়ন্ত্রণ করুন।'
                : 'Manage pending approvals, review verification badges, and monitor moderation logs.'}
            </p>
          </div>

          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 self-start sm:self-auto text-xs py-1 px-3">
            {language === 'bn' ? 'মডারেটর মোড সক্রিয়' : 'Moderator Active'}
          </Badge>
        </div>

        {/* Quick KPI Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/approvals">
            <Card className="border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
              <CardContent className="p-4 sm:p-5 flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <CheckSquare className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium">
                    {language === 'bn' ? 'অনুমোদন অপেক্ষমাণ' : 'Pending Approvals'}
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-amber-600">
                    {pendingProperties.length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/reports">
            <Card className="border-slate-200 shadow-xs hover:border-rose-300 transition-colors">
              <CardContent className="p-4 sm:p-5 flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <Flag className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium">
                    {language === 'bn' ? 'ফ্ল্যাগড রিপোর্ট' : 'Flagged Reports'}
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-rose-600">
                    {recentReports.filter((r) => r.status === 'open').length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/properties">
            <Card className="border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
              <CardContent className="p-4 sm:p-5 flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Building className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium">
                    {language === 'bn' ? 'মোট প্রোপার্টি' : 'Total Listings'}
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-slate-900">
                    {analytics?.totalProperties || 86}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/admin/users">
            <Card className="border-slate-200 shadow-xs hover:border-purple-300 transition-colors">
              <CardContent className="p-4 sm:p-5 flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium">
                    {language === 'bn' ? 'মোট ব্যবহারকারী' : 'Total Users'}
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-slate-900">
                    {(analytics?.totalTenants || 142) + (analytics?.totalLandlords || 48)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Pending Approvals Queue Widget */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-amber-600" />
              <span>{language === 'bn' ? 'অনুমোদনের জন্য অপেক্ষমাণ লিস্টিং' : 'Pending Property Approvals'}</span>
            </h2>
            <Link to="/admin/approvals">
              <span className="text-xs font-semibold text-purple-600 hover:underline">
                {language === 'bn' ? 'অনুমোদন কিউতে যান' : 'Go to Approvals Queue'}
              </span>
            </Link>
          </div>

          {pendingProperties.length === 0 ? (
            <Card className="border-slate-200">
              <CardContent className="p-6 text-center text-xs text-slate-500">
                {language === 'bn'
                  ? 'বর্তমানে কোনো প্রোপার্টি অনুমোদনের অপেক্ষায় নেই।'
                  : 'All submitted listings have been reviewed and approved.'}
              </CardContent>
            </Card>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100">
              {pendingProperties.map((prop) => (
                <div key={prop.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200">
                        {language === 'bn' ? 'অনুমোদন অপেক্ষমাণ' : 'Pending Review'}
                      </Badge>
                      <span className="text-xs text-slate-400">ID: #{prop.id}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{prop.titleBn}</h4>
                    <p className="text-xs text-slate-500">{prop.address} • Landlord: {prop.landlord.name}</p>
                  </div>
                  <Link to="/admin/approvals">
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-8">
                      <span>{language === 'bn' ? 'পর্যালোচনা ও সিদ্ধান্ত' : 'Review & Decide'}</span>
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Audit Logs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <History className="h-4 w-4 text-slate-600" />
              <span>{language === 'bn' ? 'সাম্প্রতিক অডিট লগ' : 'Recent Audit Activity'}</span>
            </h2>
            <Link to="/admin/audit-logs">
              <span className="text-xs font-semibold text-purple-600 hover:underline">
                {language === 'bn' ? 'সম্পূর্ণ লগ দেখুন' : 'View Full Logs'}
              </span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <Badge variant="outline" className="text-[10px] bg-slate-50 text-slate-600">
                      {log.actorRole}
                    </Badge>
                  </div>
                  <p className="text-slate-600">{log.details || log.entityId}</p>
                </div>
                <span className="text-[11px] text-slate-400 font-mono self-start sm:self-center shrink-0">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
