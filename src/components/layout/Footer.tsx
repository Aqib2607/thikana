import { Link } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { Building2, ShieldCheck, Heart, MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand & Purpose */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">ঠিকানা</span>
              <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-medium">
                Prototype
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {language === 'bn'
                ? 'খুলনা শহরের ভাড়াটিয়া ও বাড়িওয়ালাদের জন্য একটি আধুনিক, স্বচ্ছ ও নিয়ম-ভিত্তিক বাসা খোঁজার প্ল্যাটফর্ম।'
                : 'A modern, transparent, and rule-based rental property discovery platform focused on Khulna, Bangladesh.'}
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/60 border border-amber-800/60 p-2.5 rounded-md">
              <ShieldCheck className="h-4 w-4 shrink-0 text-amber-400" />
              <span>
                {language === 'bn'
                  ? 'একাডেমিক প্রোটোটাইপ — যাচাইকরণ ব্যাজ ও ডেটা সিমুলেটেড।'
                  : 'Academic prototype — verification badges and data are simulated.'}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {language === 'bn' ? 'দ্রুত লিঙ্ক' : 'Quick Links'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  {t('nav.properties')}
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  {t('nav.howItWorks')}
                </Link>
              </li>
              <li>
                <Link to="/tenant/compare" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  {t('nav.compare')}
                </Link>
              </li>
              <li>
                <Link to="/tenant/favorites" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  {t('nav.favorites')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Areas in Khulna */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {language === 'bn' ? 'খুলনার জনপ্রিয় এলাকা' : 'Popular Khulna Areas'}
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                <span>{language === 'bn' ? 'সোনাডাঙ্গা' : 'Sonadanga'}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                <span>{language === 'bn' ? 'খালিশপুর' : 'Khalishpur'}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                <span>{language === 'bn' ? 'বয়রা' : 'Boyra'}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                <span>{language === 'bn' ? 'দৌলতপুর' : 'Daulatpur'}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                <span>{language === 'bn' ? 'কুয়েট এলাকা (ফুলবাড়ীগেট)' : 'KUET Area (Fulbarigate)'}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                <span>{language === 'bn' ? 'শিববাড়ি মোড়' : 'Shibbari More'}</span>
              </li>
            </ul>
          </div>

          {/* Portals & Prototype Info */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {language === 'bn' ? 'ভূমিকা ভিত্তিক পোর্টাল' : 'Role Portals'}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/tenant/dashboard" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  {t('tenant.dashboard')}
                </Link>
              </li>
              <li>
                <Link to="/landlord/dashboard" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  {t('landlord.dashboard')}
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  {t('admin.dashboard')}
                </Link>
              </li>
              <li className="pt-2 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-500">
                <Mail className="h-3.5 w-3.5" />
                <span>support@thikana-khulna.ac.bd</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} ঠিকানা (Thikana). All rights reserved. Khulna, Bangladesh.
          </p>
          <div className="flex items-center gap-6">
            <span>{language === 'bn' ? 'গবেষণা ও শিক্ষামূলক প্রোটোটাইপ' : 'Academic Research Prototype'}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for Khulna
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
