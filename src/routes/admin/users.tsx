import { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { AdminService } from '@/services/api/admin.service';
import { User } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, UserCheck, Phone, Mail, Clock } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/users')({
  component: AdminUsersPage,
});

function AdminUsersPage() {
  const { t, language } = useLanguage();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const list = await AdminService.fetchAdminUsers();
      setUsers(list);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const nextRole = currentRole === 'tenant' ? 'landlord' : currentRole === 'landlord' ? 'admin' : 'tenant';
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: nextRole as any } : u))
    );
    await AdminService.addAuditLog({
      actorName: 'অ্যাডমিন মডারেটর',
      actorRole: 'admin',
      action: 'USER_ROLE_CHANGED',
      entityType: 'User',
      entityId: userId,
      details: `Role updated from ${currentRole} to ${nextRole}`,
    });
    toast.success(
      language === 'bn' ? `ব্যবহারকারীর রোল পরিবর্তিত হয়েছে: ${nextRole}` : `User role changed to ${nextRole}`
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 uppercase tracking-wider mb-1">
              <Users className="h-3.5 w-3.5" />
              <span>{language === 'bn' ? 'ব্যবহারকারী ও অনুমতি' : 'User Accounts & Roles'}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {language === 'bn' ? 'নিবন্ধিত ব্যবহারকারী ব্যবস্থাপনা' : 'Platform User Directory'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {language === 'bn'
                ? 'ভাড়াটিয়া, বাড়িওয়ালা ও অ্যাডমিনদের অ্যাকাউন্ট এবং ভূমিকার বিবরণী।'
                : 'Monitor registered personas, contacts, and grant role permissions.'}
            </p>
          </div>

          <Badge variant="outline" className="text-xs bg-slate-50 border-slate-200 self-start sm:self-auto py-1 px-3">
            {users.length} {language === 'bn' ? 'জন ব্যবহারকারী' : 'Total Accounts'}
          </Badge>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="divide-y divide-slate-100">
            {users.map((u) => (
              <div
                key={u.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-11 w-11 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">
                    {u.name.charAt(0)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{u.name}</h4>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold ${
                          u.role === 'admin'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : u.role === 'landlord'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {u.role.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-slate-500 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {u.email}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Phone className="h-3 w-3" />
                        {u.phone || '017XXXXXXXX'}
                      </span>
                      <span className="text-slate-400">ID: #{u.id}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRoleToggle(u.id, u.role)}
                    className="h-8 text-xs border-slate-300"
                  >
                    <UserCheck className="h-3.5 w-3.5 mr-1" />
                    <span>{language === 'bn' ? 'ভূমিকা পরিবর্তন' : 'Cycle Role'}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
