import React, { useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import {
  LayoutDashboard,
  Sliders,
  Heart,
  Scale,
  MessageSquare,
  Calendar,
  Star,
  User,
  Menu,
  X,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TenantLayoutProps {
  children: React.ReactNode;
}

export function TenantLayout({ children }: TenantLayoutProps) {
  const { t, language } = useLanguage();
  const { user, isTenant, setPersona } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const navItems = [
    { to: '/tenant/dashboard', label: t('tenant.dashboard'), icon: LayoutDashboard },
    { to: '/tenant/preferences', label: t('tenant.preferences'), icon: Sliders },
    { to: '/tenant/favorites', label: t('tenant.favorites'), icon: Heart },
    { to: '/tenant/compare', label: t('tenant.compare'), icon: Scale },
    { to: '/tenant/messages', label: t('tenant.messages'), icon: MessageSquare },
    { to: '/tenant/visits', label: t('tenant.visits'), icon: Calendar },
    { to: '/tenant/reviews', label: t('tenant.reviews'), icon: Star },
    { to: '/tenant/profile', label: t('tenant.profile'), icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Persona warning if user is not currently tenant */}
      {!isTenant && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-xs text-amber-800 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
            <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              {language === 'bn'
                ? `আপনি বর্তমানে '${user?.name || 'অতিথি'}' হিসেবে লগইন আছেন। ভাড়াটিয়া ভিউ দেখতে ডেমো মোডে সুইচ করুন:`
                : `Currently viewing as '${user?.name || 'Guest'}'. Switch to Tenant persona to test tenant features:`}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPersona('tenant')}
              className="h-6 text-xs px-2 bg-white text-amber-900 border-amber-300 hover:bg-amber-100 ml-2"
            >
              {language === 'bn' ? 'ভাড়াটিয়া হিসেবে সুইচ করুন' : 'Switch to Tenant'}
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
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {language === 'bn' ? 'ভাড়াটিয়া পোর্টাল' : 'Tenant Portal'}
                </span>
                <p className="text-sm font-medium text-slate-800 truncate">{user?.name || 'Tanvir Ahmed'}</p>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPath === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-xs'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <span className="flex-1 truncate">{item.label}</span>
                      {isActive && <ChevronRight className="h-4 w-4 text-emerald-600" />}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 mt-4 border-t border-slate-100 px-3">
                <div className="bg-emerald-50/60 rounded-lg p-3 text-xs text-emerald-900 border border-emerald-100/80">
                  <p className="font-medium mb-1">
                    {language === 'bn' ? 'নিয়ম-ভিত্তিক পছন্দ' : 'Rule-based Matches'}
                  </p>
                  <p className="text-emerald-700 text-[11px] leading-relaxed">
                    {language === 'bn'
                      ? 'আপনার বাজেট ও পছন্দের এলাকার সাথে প্রোপার্টির স্বয়ংক্রিয় স্কোরিং।'
                      : 'Deterministic scoring against your target budget and Khulna area.'}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Top Drawer Trigger */}
          <div className="lg:hidden flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                {language === 'bn' ? 'ভাড়াটিয়া ড্যাশবোর্ড' : 'Tenant Portal'}
              </Badge>
              <span className="text-xs text-slate-500 font-medium truncate">
                {navItems.find((n) => n.to === currentPath)?.label || t('tenant.dashboard')}
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
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
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
