import React, { useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import {
  LayoutDashboard,
  Building,
  PlusCircle,
  Inbox,
  MessageSquare,
  Calendar,
  User,
  Menu,
  X,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface LandlordLayoutProps {
  children: React.ReactNode;
}

export function LandlordLayout({ children }: LandlordLayoutProps) {
  const { t, language } = useLanguage();
  const { user, isLandlord, setPersona } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const navItems = [
    { to: '/landlord/dashboard', label: t('landlord.dashboard'), icon: LayoutDashboard },
    { to: '/landlord/properties', label: t('landlord.properties'), icon: Building },
    { to: '/landlord/properties/create', label: t('landlord.addProperty'), icon: PlusCircle },
    { to: '/landlord/requests', label: t('landlord.requests'), icon: Inbox },
    { to: '/landlord/messages', label: t('tenant.messages'), icon: MessageSquare },
    { to: '/landlord/visits', label: t('tenant.visits'), icon: Calendar },
    { to: '/landlord/profile', label: t('tenant.profile'), icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* Persona warning if user is not currently landlord */}
      {!isLandlord && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-xs text-amber-800 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full">
            <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              {language === 'bn'
                ? `আপনি বর্তমানে '${user?.name || 'অতিথি'}' হিসেবে লগইন আছেন। বাড়িওয়ালা ভিউ দেখতে ডেমো মোডে সুইচ করুন:`
                : `Currently viewing as '${user?.name || 'Guest'}'. Switch to Landlord persona to manage properties:`}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPersona('landlord')}
              className="h-6 text-xs px-2 bg-white text-amber-900 border-amber-300 hover:bg-amber-100 ml-2"
            >
              {language === 'bn' ? 'বাড়িওয়ালা হিসেবে সুইচ করুন' : 'Switch to Landlord'}
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
                  {language === 'bn' ? 'বাড়িওয়ালা পোর্টাল' : 'Landlord Portal'}
                </span>
                <p className="text-sm font-medium text-slate-800 truncate">{user?.name || 'Hasan Mahmud'}</p>
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
                          ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span className="flex-1 truncate">{item.label}</span>
                      {isActive && <ChevronRight className="h-4 w-4 text-blue-600" />}
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 mt-4 border-t border-slate-100 px-3">
                <div className="bg-blue-50/60 rounded-lg p-3 text-xs text-blue-900 border border-blue-100/80">
                  <p className="font-medium mb-1">
                    {language === 'bn' ? 'প্রোপার্টি নিয়ন্ত্রণ' : 'Listing Controls'}
                  </p>
                  <p className="text-blue-700 text-[11px] leading-relaxed">
                    {language === 'bn'
                      ? 'বাড়িওয়ালা নিজেই যেকোনো মুহূর্তে প্রোপার্টির প্রাপ্যতা (ভাড়া হয়েছে / উন্মুক্ত) পরিবর্তন করতে পারেন।'
                      : 'Landlords have direct, instantaneous control over property availability state.'}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Top Drawer Trigger */}
          <div className="lg:hidden flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                {language === 'bn' ? 'বাড়িওয়ালা পোর্টাল' : 'Landlord Portal'}
              </Badge>
              <span className="text-xs text-slate-500 font-medium truncate">
                {navItems.find((n) => n.to === currentPath)?.label || t('landlord.dashboard')}
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
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
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
