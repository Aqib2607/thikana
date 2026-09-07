import { createFileRoute, Link } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useCompare } from '@/contexts/CompareContext';
import { TenantLayout } from '@/components/layout/TenantLayout';
import { MatchingService } from '@/services/api/matching.service';
import { AMENITIES_LIST } from '@/data/mockData';
import { PropertyStatusBadge } from '@/components/property/PropertyStatusBadge';
import { VerificationBadge } from '@/components/property/VerificationBadge';
import { MatchScoreBadge } from '@/components/property/MatchScoreBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Scale,
  Trash2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  MapPin,
  ExternalLink,
  Plus,
} from 'lucide-react';

export const Route = createFileRoute('/tenant/compare')({
  component: TenantComparePage,
});

function TenantComparePage() {
  const { t, language } = useLanguage();
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  const tenantPrefs = MatchingService.getPreferences();

  // Find lowest rent among selected properties to highlight value
  const minRent =
    compareList.length > 0 ? Math.min(...compareList.map((p) => p.rent ?? p.monthlyRent ?? 0)) : 0;

  return (
    <TenantLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
              <Scale className="h-3.5 w-3.5" />
              <span>{language === 'bn' ? 'পাশাপাশি তুলনা ইঞ্জিন' : 'Comparison Matrix'}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {language === 'bn' ? 'প্রোপার্টি পাশাপাশি তুলনা' : 'Side-by-Side Property Comparison'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {language === 'bn'
                ? `নির্বাচিত ${compareList.length}টি প্রোপার্টির বৈশিষ্ট্য ও ভাড়ার তুলনা (সর্বোচ্চ ৩টি)`
                : `Comparing ${compareList.length} of 3 properties across rent, specs, and match scores`}
            </p>
          </div>

          {compareList.length > 0 && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={clearCompare}
                className="text-xs text-slate-500 border-slate-300 hover:text-slate-900"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                <span>{language === 'bn' ? 'সব মুছুন' : 'Clear Comparison'}</span>
              </Button>
              {compareList.length < 3 && (
                <Link to="/properties">
                  <Button size="sm" variant="outline" className="text-xs border-dashed border-emerald-400 text-emerald-700 hover:bg-emerald-50">
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    <span>{language === 'bn' ? 'আরেকটি যোগ করুন' : 'Add Property'}</span>
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>

        {compareList.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto">
            <div className="h-16 w-16 rounded-full bg-blue-50 text-blue-400 flex items-center justify-center mx-auto">
              <Scale className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              {language === 'bn' ? 'কোনো প্রোপার্টি নির্বাচিত নেই' : 'No properties in comparison'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {language === 'bn'
                ? 'বাসার তালিকা ব্রাউজ করার সময় "তুলনা করুন" আইকনে ক্লিক করে সর্বোচ্চ ৩টি বাসা পাশাপাশি মূল্যায়ন করতে পারেন।'
                : 'Click the scale/compare icon on any property card to compare up to 3 listings simultaneously.'}
            </p>
            <Link to="/properties">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium mt-2">
                <span>{language === 'bn' ? 'প্রোপার্টি খুঁজুন' : 'Browse Properties'}</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        ) : (
          /* Comparison Table */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-48 shrink-0">
                    {language === 'bn' ? 'বৈশিষ্ট্য' : 'Attributes'}
                  </th>
                  {compareList.map((prop) => (
                    <th key={prop.id} className="p-4 align-top min-w-[240px]">
                      <div className="space-y-3">
                        <div className="relative aspect-16/10 rounded-lg overflow-hidden bg-slate-100">
                          <img
                            src={
                              (typeof prop.images[0] === 'string'
                                ? prop.images[0]
                                : prop.images[0]?.url) ||
                              'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600'
                            }
                            alt={prop.titleBn || prop.title}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => removeFromCompare(prop.id)}
                            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-slate-900/70 hover:bg-rose-600 text-white flex items-center justify-center transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 line-clamp-1">
                            {language === 'bn' ? (prop.titleBn || prop.title) : (prop.titleEn || prop.title)}
                          </h4>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
                            <span className="truncate">{prop.address || `${prop.location.area}, ${prop.location.city}`}</span>
                          </p>
                        </div>
                        <Link to="/properties/$id" params={{ id: prop.id }}>
                          <Button size="sm" variant="outline" className="w-full text-xs h-7 border-slate-300 flex items-center justify-center gap-1">
                            <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Full Details'}</span>
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-xs">
                {/* Rent Row */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-700 bg-slate-50/40">
                    {language === 'bn' ? 'মাসিক ভাড়া' : 'Monthly Rent'}
                  </td>
                  {compareList.map((p) => {
                    const rent = p.rent ?? p.monthlyRent ?? 0;
                    const isLowest = rent === minRent && compareList.length > 1;
                    return (
                      <td key={p.id} className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-base font-extrabold ${isLowest ? 'text-emerald-700' : 'text-slate-900'}`}>
                            ৳{rent.toLocaleString()}
                          </span>
                          {isLowest && (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                              {language === 'bn' ? 'সাশ্রয়ী' : 'Lowest'}
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* Match Score */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-700 bg-slate-50/40">
                    {language === 'bn' ? 'ম্যাচ স্কোর' : 'Deterministic Match'}
                  </td>
                  {compareList.map((p) => {
                    const res = MatchingService.calculateMatch(p, tenantPrefs);
                    return (
                      <td key={p.id} className="p-4">
                        <MatchScoreBadge score={res.score} explanation={res.explanation} />
                      </td>
                    );
                  })}
                </tr>

                {/* Availability */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-700 bg-slate-50/40">
                    {language === 'bn' ? 'প্রাপ্যতা স্ট্যাটাস' : 'Availability'}
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4">
                      <PropertyStatusBadge status={p.status || p.availabilityStatus || 'available'} />
                    </td>
                  ))}
                </tr>

                {/* Verification */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-700 bg-slate-50/40">
                    {language === 'bn' ? 'যাচাইকরণ (সিমুলেটেড)' : 'Verification (Simulated)'}
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4">
                      <VerificationBadge verification={p.verification || p.verifications} />
                    </td>
                  ))}
                </tr>

                {/* Size & Rooms */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-700 bg-slate-50/40">
                    {language === 'bn' ? 'আয়তন ও কক্ষ' : 'Size & Rooms'}
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4 space-y-1">
                      <p className="font-semibold text-slate-800">{p.bedrooms ?? p.rooms ?? 0} Beds, {p.bathrooms} Baths</p>
                      <p className="text-slate-500">{p.sizeSqFt ?? p.sizeSqft ?? 0} sq ft • {p.balconies ?? (p.balcony ? 1 : 0)} Balconies</p>
                    </td>
                  ))}
                </tr>

                {/* Floor */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-700 bg-slate-50/40">
                    {language === 'bn' ? 'ফ্লোর লেভেল' : 'Floor Level'}
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4">
                      Floor {p.floorNumber ?? p.floor ?? 1} (of {p.totalFloors})
                    </td>
                  ))}
                </tr>

                {/* Service Charge & Deposit */}
                <tr className="hover:bg-slate-50/50">
                  <td className="p-4 font-semibold text-slate-700 bg-slate-50/40">
                    {language === 'bn' ? 'সার্ভিস চার্জ ও অগ্রিম' : 'Service Charge & Deposit'}
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4 space-y-1">
                      <p>Service: ৳{p.serviceCharge ?? p.serviceChargeMonthly ?? 0}</p>
                      <p className="text-slate-500">Deposit: ৳{(p.depositAmount ?? p.securityDeposit ?? 0).toLocaleString()}</p>
                    </td>
                  ))}
                </tr>

                {/* Amenity Rows */}
                {AMENITIES_LIST.slice(0, 8).map((am) => (
                  <tr key={am.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-medium text-slate-600 bg-slate-50/40">
                      {language === 'bn' ? am.labelBn : am.labelEn}
                    </td>
                    {compareList.map((p) => {
                      const hasAmenity = (p.amenities ?? []).includes(am.id);
                      return (
                        <td key={p.id} className="p-4">
                          {hasAmenity ? (
                            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold">
                              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              <span>{language === 'bn' ? 'আছে' : 'Yes'}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-slate-400">
                              <XCircle className="h-4 w-4 text-slate-300" />
                              <span>{language === 'bn' ? 'নেই' : 'No'}</span>
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </TenantLayout>
  );
}
