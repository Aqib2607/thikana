import { useState, useEffect, useMemo } from 'react';
import { createFileRoute, Link, useSearch } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useCompare } from '@/contexts/CompareContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PropertiesService } from '@/services/api/properties.service';
import { PropertyGrid } from '@/components/property/PropertyGrid';
import { PropertyFilters } from '@/components/property/PropertyFilters';
import { MobileFilterDrawer } from '@/components/property/MobileFilterDrawer';
import { PropertySortDropdown } from '@/components/property/PropertySortDropdown';
import { Property, PropertyFilterState } from '@/types/thikana';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Scale,
  MapPin,
  ArrowRight,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';

export const Route = createFileRoute('/properties/')({
  component: PropertiesSearchPage,
  validateSearch: (search: Record<string, unknown>): Record<string, string> => {
    const result: Record<string, string> = {};
    if (typeof search['location'] === 'string') result['location'] = search['location'];
    if (typeof search['type'] === 'string') result['type'] = search['type'];
    if (typeof search['category'] === 'string') result['category'] = search['category'];
    if (typeof search['maxRent'] === 'string') result['maxRent'] = search['maxRent'];
    if (typeof search['bedrooms'] === 'string') result['bedrooms'] = search['bedrooms'];
    if (typeof search['q'] === 'string') result['q'] = search['q'];
    return result;
  },
});

function PropertiesSearchPage() {
  const { t, language } = useLanguage();
  const searchParams = useSearch({ from: '/properties/' }) as Record<string, string | undefined>;
  const { compareList, clearCompare, canAddMore } = useCompare();

  // Filter state
  const [filters, setFilters] = useState<PropertyFilterState>({
    location: searchParams['location'] || '',
    propertyType: searchParams['type'] || '',
    minRent: undefined,
    maxRent: searchParams['maxRent'] ? Number(searchParams['maxRent']) : undefined,
    bedrooms: searchParams['bedrooms'] ? Number(searchParams['bedrooms']) : undefined,
    bathrooms: undefined,
    amenities: [],
    verifiedOnly: false,
    availableOnly: true,
  });

  const [searchQuery, setSearchQuery] = useState(searchParams['q'] || '');
  const [sortOption, setSortOption] = useState<any>('newest');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.location) count++;
    if (filters.propertyType) count++;
    if (filters.minRent) count++;
    if (filters.maxRent) count++;
    if (filters.bedrooms) count++;
    if (filters.bathrooms) count++;
    if (filters.amenities && filters.amenities.length > 0) count += filters.amenities.length;
    if (filters.verifiedOnly) count++;
    if (filters.availableOnly) count++;
    return count;
  }, [filters]);

  // Load properties with filtering
  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      try {
        const response = await PropertiesService.getProperties({
          search: searchQuery,
          location: filters.location,
          propertyType: filters.propertyType,
          minRent: filters.minRent,
          maxRent: filters.maxRent,
          bedrooms: filters.bedrooms,
          bathrooms: filters.bathrooms,
          amenities: filters.amenities,
          verifiedOnly: filters.verifiedOnly,
          status: filters.availableOnly ? 'available' : undefined,
          sort: sortOption as any,
          limit: 50,
        });
        setProperties(response.properties);
      } catch (err) {
        console.error('Failed to query properties', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, [filters, searchQuery, sortOption]);

  const handleResetFilters = () => {
    setFilters({
      location: '',
      propertyType: '',
      minRent: undefined,
      maxRent: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      amenities: [],
      verifiedOnly: false,
      availableOnly: true,
    });
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      {/* Top Banner / Search Bar */}
      <div className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {language === 'bn' ? 'খুলনায় ভাড়া প্রোপার্টি সমূহ' : 'Rental Properties in Khulna'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {language === 'bn'
                  ? `${properties.length}টি প্রোপার্টি পাওয়া গেছে`
                  : `Showing ${properties.length} available listings`}
              </p>
            </div>

            {/* Top Search Input */}
            <div className="flex items-center gap-2 max-w-md w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder={
                    language === 'bn'
                      ? 'এলাকা বা শিরোনাম দিয়ে খুঁজুন...'
                      : 'Search by area, title or keyword...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 text-sm bg-slate-50 border-slate-200"
                />
              </div>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  {language === 'bn' ? 'মুছুন' : 'Clear'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Filter & Results Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Bar for Mobile & Sort */}
        <div className="flex items-center justify-between gap-4 mb-6">
          {/* Mobile Filter Button */}
          <div className="lg:hidden flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 text-xs font-medium border-slate-300"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>{language === 'bn' ? 'ফিল্টার' : 'Filters'}</span>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-emerald-100 text-emerald-800">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>

            {activeFilterCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-8 px-2 text-xs text-slate-500"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                {language === 'bn' ? 'রিসেট' : 'Reset'}
              </Button>
            )}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                {activeFilterCount} {language === 'bn' ? 'টি ফিল্টার সক্রিয়' : 'active filters'}
              </Badge>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 ml-auto">
            <PropertySortDropdown value={sortOption} onChange={setSortOption} />
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <PropertyFilters
                filters={filters}
                onChange={setFilters}
                onReset={handleResetFilters}
              />
            </div>
          </aside>

          {/* Property Grid Results */}
          <main className="flex-1 min-w-0">
            <PropertyGrid
              properties={properties}
              isLoading={loading}
            />
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        onChange={setFilters}
        onReset={handleResetFilters}
        activeCount={activeFilterCount}
      />

      {/* Sticky Compare Tray (if properties selected) */}
      {compareList.length > 0 && (
        <div className="sticky bottom-0 z-40 bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white shadow-sm">
                <Scale className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">
                  {language === 'bn'
                    ? `${compareList.length}টি প্রোপার্টি তুলনার জন্য নির্বাচিত`
                    : `${compareList.length} properties selected for comparison`}
                </p>
                <p className="text-[11px] text-slate-400">
                  {canAddMore
                    ? language === 'bn'
                      ? 'সর্বোচ্চ ৩টি প্রোপার্টি তুলনা করতে পারবেন'
                      : 'You can compare up to 3 properties side-by-side'
                    : language === 'bn'
                    ? 'সর্বোচ্চ সীমা পূর্ণ হয়েছে'
                    : 'Maximum limit reached'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCompare}
                className="text-xs text-slate-400 hover:text-white"
              >
                {language === 'bn' ? 'মুছে ফেলুন' : 'Clear'}
              </Button>
              <Link to="/tenant/compare">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5">
                  <span>{language === 'bn' ? 'তুলনা করুন' : 'Compare Now'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
