import { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminService, AuditLog } from '@/services/api/admin.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { History, Download, Filter, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/audit-logs')({
  component: AdminAuditLogsPage,
});

function AdminAuditLogsPage() {
  const { t, language } = useLanguage();

  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filterRole, setFilterRole] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      setLoading(true);
      try {
        const list = await AdminService.fetchAuditLogs();
        setLogs(list);
      } catch (err) {
        console.error('Failed to load audit logs', err);
      } finally {
        setLoading(false);
      }
    }

    loadLogs();
  }, []);

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `thikana_audit_logs_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success(language === 'bn' ? 'অডিট লগ ডাউনলোড হয়েছে' : 'Audit logs exported as JSON');
  };

  const filteredLogs = logs.filter((l) => {
    if (filterRole !== 'all' && l.actorRole !== filterRole) return false;
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 uppercase tracking-wider mb-1">
              <History className="h-3.5 w-3.5" />
              <span>{language === 'bn' ? 'নিরাপত্তা ও নিরীক্ষা রেকর্ড' : 'Audit Trail & Transparency'}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {language === 'bn' ? 'সিস্টেম অডিট লগ ট্র্যাকার' : 'Platform Audit Logs'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {language === 'bn'
                ? 'অনুমোদন, যাচাইকরণ ও মডারেশন সংক্রান্ত সকল অ্যাকশনের সময়ভিত্তিক রেকর্ড।'
                : 'Immutable record of approvals, simulated badge verifications, and moderations.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="h-9 px-2.5 rounded-lg border border-slate-200 text-xs bg-slate-50 font-medium"
            >
              <option value="all">{language === 'bn' ? 'সকল রোল' : 'All Roles'}</option>
              <option value="admin">Admin</option>
              <option value="landlord">Landlord</option>
              <option value="tenant">Tenant</option>
            </select>

            <Button
              size="sm"
              variant="outline"
              onClick={handleExport}
              className="text-xs h-9 border-slate-300 flex items-center gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{language === 'bn' ? 'এক্সপোর্ট' : 'Export JSON'}</span>
            </Button>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                  <th className="p-4">{language === 'bn' ? 'সময়' : 'Timestamp'}</th>
                  <th className="p-4">{language === 'bn' ? 'কর্তা' : 'Actor'}</th>
                  <th className="p-4">{language === 'bn' ? 'ভূমিকা' : 'Role'}</th>
                  <th className="p-4">{language === 'bn' ? 'অ্যাকশন' : 'Action'}</th>
                  <th className="p-4">{language === 'bn' ? 'টার্গেট এন্টিটি' : 'Entity ID'}</th>
                  <th className="p-4">{language === 'bn' ? 'বিবরণ' : 'Details'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      Loading audit records...
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No logs found.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="p-4 font-mono text-slate-500 shrink-0 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="p-4 font-bold text-slate-800">{log.actorName}</td>
                      <td className="p-4">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold ${
                            log.actorRole === 'admin'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : log.actorRole === 'landlord'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {log.actorRole}
                        </Badge>
                      </td>
                      <td className="p-4 font-semibold text-slate-700 font-mono text-[11px]">
                        {log.action}
                      </td>
                      <td className="p-4 font-mono text-slate-500">
                        {log.entityType} #{log.entityId}
                      </td>
                      <td className="p-4 text-slate-600 max-w-xs truncate">
                        {log.details || '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
