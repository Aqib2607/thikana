import React, { useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import {
  ShieldCheck,
  CheckSquare,
  BadgeCheck,
  Building,
  Flag,
  Star,
  Users,
  MessageSquareQuote,
  BarChart3,
  History,
  Menu,
  X,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { t, language } = useLanguage();
  const { user, isAdmin, setPersona } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const navItems = [
    { to: '/admin/dashboard', label: t('admin.dashboard'), icon: ShieldCheck },
    { to: '/admin/approvals', label: t('admin.pendingApprovals'), icon: CheckSquare },
    { to: '/admin/verification', label: t('admin.verification'), icon: BadgeCheck },
    { to: '/admin/properties', label: t('admin.allProperties'), icon: Building },
    { to: '/admin/reports', label: t('admin.flaggedReports'), icon: Flag },
    { to: '/admin/reviews', label: t('admin.reviewModeration'), icon: Star },
    { to: '/admin/users', label: t('admin.users'), icon: Users },
    { to: '/admin/community', label: t('admin.communityNotes'), icon: MessageSquareQuote },
    { to: '/admin/analytics', label: t('admin.analytics'), icon: BarChart3 },
    { to: '/admin/audit-logs', label: t('admin.auditLogs'), icon: History },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Persona warning if user is not currently admin */}
      {!isAdmin && (
        <div className="bg-purple-50 border-b border-purple-200 px-4 py-2.5 text-xs text-purple-800 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
            <ShieldAlert className="h-4 w-4 text-purple-600 shrink-0" />
            <span>
              {language === 'bn'
                ? `আপনি বর্তমানে '${user?.name || 'অতিথি'}' হিসেবে লগইন আছেন। অ্যাডমিন ভিউ দেখতে ডেমো মোডে সুইচ করুন:`
                : `Currently viewing as '${user?.name || 'Guest'}'. Switch to Admin persona to moderate platform:`}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPersona('admin')}
              className="h-6 text-xs px-2 bg-white text-purple-900 border-purple-300 hover:bg-purple-100 ml-2"
            >
              {language === 'bn' ? 'অ্যাডমিন হিসেবে সুইচ করুন' : 'Switch to Admin'}
            </Button>
          </div>
        </div>
      )}

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-1">
              <div className="px-3 py-2 mb-2 border-b border-slate-100">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-600">
                  {language === 'bn' ? 'অ্যাডমিন কনসোল' : 'Admin Console'}
                </span>
                <p className="text-sm font-medium text-slate-800 truncate">{user?.name || 'Admin Moderator'}</p>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPath === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-purple-50 text-purple-700 font-semibold shadow-xs'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                      <span className="flex-1 truncate">{item.label}</span>
                      {isActive && <ChevronRight className="h-4 w-4 text-purple-600" />}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 mt-4 border-t border-slate-100 px-3">
                <div className="bg-purple-50/60 rounded-lg p-3 text-xs text-purple-900 border border-purple-100/80">
                  <p className="font-medium mb-1">
                    {language === 'bn' ? 'সিমুলেটেড অডিট ট্রেইল' : 'Simulated Audit Trail'}
                  </p>
                  <p className="text-purple-700 text-[11px] leading-relaxed">
                    {language === 'bn'
                      ? 'অনুমোদন, যাচাইকরণ ও মডারেশন সংক্রান্ত সকল অ্যাকশন অডিট লগে সংরক্ষিত হয়।'
                      : 'All approvals, simulated verification badge updates, and moderation actions are logged.'}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Top Drawer Trigger */}
          <div className="lg:hidden flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                {language === 'bn' ? 'অ্যাডমিন কনসোল' : 'Admin Console'}
              </Badge>
              <span className="text-xs text-slate-500 font-medium truncate">
                {navItems.find((n) => n.to === currentPath)?.label || t('admin.dashboard')}
              </span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="h-8 w-8 p-0"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-white p-3 rounded-xl border border-slate-200 shadow-lg space-y-1 mb-4 animate-in fade-in slide-in-from-top-2 duration-150">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                      isActive
                        ? 'bg-purple-50 text-purple-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Main Workspace */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
