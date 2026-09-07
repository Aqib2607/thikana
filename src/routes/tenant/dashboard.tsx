import { useState, useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useCompare } from '@/contexts/CompareContext';
import { TenantLayout } from '@/components/layout/TenantLayout';
import { PropertiesService } from '@/services/api/properties.service';
import { MatchingService } from '@/services/api/matching.service';
import { InteractionsService } from '@/services/api/interactions.service';
import { Property, VisitRequest } from '@/types/thikana';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Heart,
  Scale,
  Calendar,
  MessageSquare,
  SlidersHorizontal,
  ArrowRight,
  MapPin,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const Route = createFileRoute('/tenant/dashboard')({
  component: TenantDashboardPage,
});

function TenantDashboardPage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { favoritesCount } = useFavorites();
  const { compareList } = useCompare();

  const [matchedProperties, setMatchedProperties] = useState<{ property: Property; score: number }[]>([]);
  const [upcomingVisits, setUpcomingVisits] = useState<VisitRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const tenantPrefs = MatchingService.getPreferences();
        const allProps = await PropertiesService.getProperties({ status: 'available', limit: 30 });
        
        // Calculate match scores
        const scored = allProps.properties
          .map((p) => {
            const res = MatchingService.calculateMatch(p, tenantPrefs);
            return { property: p, score: res.score };
          })
          .sort((a, b) => b.score - a.score)
          .slice(0, 4);

        setMatchedProperties(scored);

        const visits = await InteractionsService.getTenantVisitRequests(user?.id || 'tenant-1');
        setUpcomingVisits(visits.slice(0, 3));
      } catch (err) {
        console.error('Failed to load tenant dashboard data', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [user]);

  return (
    <TenantLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
              <span>{language === 'bn' ? 'ভাড়াটিয়া ড্যাশবোর্ড' : 'Tenant Overview'}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {language === 'bn' ? `স্বাগতম, ${user?.name || 'তানভীর আহমেদ'}` : `Welcome back, ${user?.name || 'Tanvir Ahmed'}`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {language === 'bn'
                ? 'আপনার পছন্দের নিয়ম অনুযায়ী সেরা প্রোপার্টি ও বর্তমান শিডিউল দেখুন।'
                : 'Review your personalized matches, scheduled visits, and saved favorites.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/tenant/preferences">
              <Button size="sm" variant="outline" className="border-slate-300 text-xs flex items-center gap-1.5">
                <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-600" />
                <span>{language === 'bn' ? 'পছন্দ পরিবর্তন করুন' : 'Edit Preferences'}</span>
              </Button>
            </Link>
            <Link to="/properties">
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs flex items-center gap-1.5">
                <span>{language === 'bn' ? 'বাসা খুঁজুন' : 'Search Rentals'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/tenant/preferences">
            <Card className="border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
              <CardContent className="p-4 sm:p-5 flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium">
                    {language === 'bn' ? 'সেরা ম্যাচ' : 'Top Matches'}
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-slate-900">
                    {matchedProperties.length > 0 && matchedProperties[0] ? `${matchedProperties[0].score}%` : 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/tenant/favorites">
            <Card className="border-slate-200 shadow-xs hover:border-rose-300 transition-colors">
              <CardContent className="p-4 sm:p-5 flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                  <Heart className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium">
                    {language === 'bn' ? 'সংরক্ষিত বাসা' : 'Saved Favorites'}
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-slate-900">{favoritesCount}</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/tenant/compare">
            <Card className="border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
              <CardContent className="p-4 sm:p-5 flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Scale className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium">
                    {language === 'bn' ? 'তুলনার তালিকা' : 'Comparing'}
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-slate-900">{compareList.length} / 3</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/tenant/visits">
            <Card className="border-slate-200 shadow-xs hover:border-purple-300 transition-colors">
              <CardContent className="p-4 sm:p-5 flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium">
                    {language === 'bn' ? 'ভিজিট রিকোয়েস্ট' : 'Active Visits'}
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-slate-900">{upcomingVisits.length}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Top Rule-Based Matches for Tenant */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <span>
                  {language === 'bn'
                    ? 'আপনার পছন্দের ভিত্তিতে শীর্ষ ম্যাচ (নিয়ম-ভিত্তিক)'
                    : 'Personalized Matches (Rule-Based)'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'bn'
                  ? 'আপনার সেট করা বাজেট ও পছন্দের খুলনার এলাকার ভিত্তিতে হিসেবকৃত'
                  : 'Calculated using deterministic 6-factor rules against your preferences'}
              </p>
            </div>
            <Link to="/properties">
              <span className="text-xs font-semibold text-emerald-600 hover:underline">
                {language === 'bn' ? 'সবগুলো দেখুন' : 'View all'}
              </span>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-80 bg-slate-200 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {matchedProperties.map(({ property }) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>

        {/* Scheduled Visits Mini Queue */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <span>{language === 'bn' ? 'আসন্ন বাসা পরিদর্শন' : 'Upcoming Visits'}</span>
            </h2>
            <Link to="/tenant/visits">
              <span className="text-xs font-semibold text-purple-600 hover:underline">
                {language === 'bn' ? 'ভিজিট হিস্ট্রি' : 'View Schedule'}
              </span>
            </Link>
          </div>

          {upcomingVisits.length === 0 ? (
            <Card className="border-slate-200">
              <CardContent className="p-6 text-center text-xs text-slate-500">
                {language === 'bn'
                  ? 'বর্তমানে কোনো নির্ধারিত ভিজিট নেই। পছন্দসই বাসার বিবরণী থেকে "বাসা পরিদর্শনের অনুরোধ" বাটনে ক্লিক করুন।'
                  : 'No scheduled visits yet. Click "Schedule a Visit" on any property detail page.'}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {upcomingVisits.map((visit) => (
                <Card key={visit.id} className="border-slate-200 shadow-xs">
                  <CardContent className="p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className={
                          visit.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }
                      >
                        {visit.status}
                      </Badge>
                      <span className="text-slate-400 font-mono text-[11px]">{visit.time}</span>
                    </div>
                    <p className="font-semibold text-slate-800 truncate">{visit.propertyTitle}</p>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>{visit.date}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </TenantLayout>
  );
}
