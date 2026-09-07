import { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { TenantLayout } from '@/components/layout/TenantLayout';
import { MatchingService, TenantPreferences } from '@/services/api/matching.service';
import { KHULNA_LOCATIONS, AMENITIES_LIST } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal, Save, RotateCcw, CheckCircle2, MapPin, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/tenant/preferences')({
  component: TenantPreferencesPage,
});

function TenantPreferencesPage() {
  const { t, language } = useLanguage();

  const [preferences, setPreferences] = useState<TenantPreferences>(() => {
    const p = MatchingService.getPreferences();
    return {
      ...p,
      preferredLocations: p.preferredLocations ?? p.locations ?? [],
      requiredAmenities: p.requiredAmenities ?? p.amenities ?? [],
    };
  });
  const [saved, setSaved] = useState(false);

  const handleLocationToggle = (locId: string) => {
    setPreferences((prev) => {
      const current = prev.preferredLocations ?? [];
      const exists = current.includes(locId);
      const updated = exists
        ? current.filter((l) => l !== locId)
        : [...current, locId];
      return { ...prev, preferredLocations: updated, locations: updated };
    });
  };

  const handleAmenityToggle = (amenityId: string) => {
    setPreferences((prev) => {
      const current = prev.requiredAmenities ?? [];
      const exists = current.includes(amenityId);
      const updated = exists
        ? current.filter((a) => a !== amenityId)
        : [...current, amenityId];
      return { ...prev, requiredAmenities: updated, amenities: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    MatchingService.savePreferences(preferences);
    setSaved(true);
    toast.success(
      language === 'bn'
        ? 'আপনার পছন্দসমূহ সফলভাবে সংরক্ষিত হয়েছে!'
        : 'Preferences saved! Match scores updated across all listings.'
    );
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    const defaultPrefs: TenantPreferences = {
      preferredLocations: ['sonadanga'],
      minRent: 8000,
      maxRent: 20000,
      propertyType: 'apartment',
      minBedrooms: 2,
      minBathrooms: 2,
      requiredAmenities: ['water_supply', 'cctv'],
    };
    setPreferences(defaultPrefs);
    MatchingService.savePreferences(defaultPrefs);
    toast.info(language === 'bn' ? 'ডিফল্ট মান সেট করা হয়েছে' : 'Reset to default preferences');
  };

  return (
    <TenantLayout>
      <div className="max-w-4xl space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>{language === 'bn' ? 'নিয়ম-ভিত্তিক পছন্দ কনফিগারেশন' : 'Rule-based Preference Engine'}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {language === 'bn' ? 'বাসা খোঁজার পছন্দসমূহ' : 'Tenant Search Preferences'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {language === 'bn'
                ? 'আপনার নির্দিষ্ট মানদণ্ড অনুযায়ী প্রতিটি বাসার ম্যাচ স্কোর (Match Score) স্বয়ংক্রিয়ভাবে হিসেব হবে।'
                : 'Thikana scores each property against these 6 factors with full mathematical explainability.'}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="text-xs border-slate-300 self-start sm:self-auto"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1" />
            <span>{language === 'bn' ? 'রিসেট' : 'Reset Defaults'}</span>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Factor 1: Location Preferences (30% weight) */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  <span>{language === 'bn' ? '১. পছন্দের এলাকা (খুলনা)' : '1. Preferred Khulna Locations'}</span>
                </CardTitle>
                <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {language === 'bn' ? '৩০% গুরুত্ব' : '30% Weight'}
                </Badge>
              </div>
              <CardDescription className="text-xs text-slate-500">
                {language === 'bn'
                  ? 'এক বা একাধিক এলাকা নির্বাচন করুন যেখানে আপনি বাসা খুঁজতে আগ্রহী'
                  : 'Select one or more areas you wish to live in.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {KHULNA_LOCATIONS.map((loc) => {
                  const isChecked = (preferences.preferredLocations ?? []).includes(loc.id);
                  return (
                    <label
                      key={loc.id}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleLocationToggle(loc.id)}
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="truncate">{language === 'bn' ? loc.nameBn : loc.nameEn}</span>
                    </label>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Factor 2: Budget (25% weight) */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900">
                  {language === 'bn' ? '২. বাজেট পরিসীমা (টাকা/মাস)' : '2. Budget Range (BDT/month)'}
                </CardTitle>
                <Badge className="bg-blue-100 text-blue-800 text-[10px] font-bold">
                  {language === 'bn' ? '২৫% গুরুত্ব' : '25% Weight'}
                </Badge>
              </div>
              <CardDescription className="text-xs text-slate-500">
                {language === 'bn'
                  ? 'আপনার মাসিক ভাড়ার সর্বনিম্ন ও সর্বোচ্চ সীমা নির্ধারণ করুন'
                  : 'Rent within this range gets maximum budget score.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">
                  {language === 'bn' ? 'সর্বনিম্ন ভাড়া (৳)' : 'Minimum Rent'}
                </Label>
                <Input
                  type="number"
                  value={preferences.minRent}
                  onChange={(e) => setPreferences({ ...preferences, minRent: Number(e.target.value) })}
                  className="text-sm bg-slate-50 border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">
                  {language === 'bn' ? 'সর্বোচ্চ ভাড়া (৳)' : 'Maximum Rent'}
                </Label>
                <Input
                  type="number"
                  value={preferences.maxRent}
                  onChange={(e) => setPreferences({ ...preferences, maxRent: Number(e.target.value) })}
                  className="text-sm bg-slate-50 border-slate-200"
                />
              </div>
            </CardContent>
          </Card>

          {/* Factor 3 & 5: Property Type & Specs (15% + 10% weight) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-slate-900">
                    {language === 'bn' ? '৩. প্রোপার্টি ধরন' : '3. Property Type'}
                  </CardTitle>
                  <Badge className="bg-purple-100 text-purple-800 text-[10px] font-bold">15%</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <select
                  value={preferences.propertyType}
                  onChange={(e) => setPreferences({ ...preferences, propertyType: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="apartment">{language === 'bn' ? 'ফ্ল্যাট / অ্যাপার্টমেন্ট' : 'Apartment'}</option>
                  <option value="bachelor_mess">{language === 'bn' ? 'ব্যাচেলর মেস' : 'Bachelor Mess'}</option>
                  <option value="sublet">{language === 'bn' ? 'সাবলেট / রুম' : 'Sublet / Room'}</option>
                  <option value="hostel">{language === 'bn' ? 'হোস্টেল' : 'Hostel'}</option>
                </select>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold text-slate-900">
                    {language === 'bn' ? '৪. রুম ও বাথ চাহিদা' : '4. Minimum Rooms & Baths'}
                  </CardTitle>
                  <Badge className="bg-amber-100 text-amber-800 text-[10px] font-bold">10%</Badge>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-slate-600 mb-1 block">
                    {language === 'bn' ? 'মিনিমাম বেডরুম' : 'Min Beds'}
                  </Label>
                  <select
                    value={preferences.minBedrooms}
                    onChange={(e) => setPreferences({ ...preferences, minBedrooms: Number(e.target.value) })}
                    className="w-full h-10 px-2 rounded-lg border border-slate-200 text-sm bg-slate-50"
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n} {language === 'bn' ? 'বেড' : 'Beds'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-xs text-slate-600 mb-1 block">
                    {language === 'bn' ? 'মিনিমাম বাথরুম' : 'Min Baths'}
                  </Label>
                  <select
                    value={preferences.minBathrooms}
                    onChange={(e) => setPreferences({ ...preferences, minBathrooms: Number(e.target.value) })}
                    className="w-full h-10 px-2 rounded-lg border border-slate-200 text-sm bg-slate-50"
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n} {language === 'bn' ? 'বাথ' : 'Baths'}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Factor 4: Required Amenities (15% weight) */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900">
                  {language === 'bn' ? '৫. আবশ্যকীয় সুবিধাসমূহ (Amenities)' : '5. Required Amenities'}
                </CardTitle>
                <Badge className="bg-teal-100 text-teal-800 text-[10px] font-bold">15%</Badge>
              </div>
              <CardDescription className="text-xs text-slate-500">
                {language === 'bn'
                  ? 'আপনার বাসায় যে সুবিধাগুলো থাকা আবশ্যক তা সিলেক্ট করুন'
                  : 'Properties having these amenities will receive full amenity weighting.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {AMENITIES_LIST.map((amenity) => {
                  const isChecked = (preferences.requiredAmenities ?? []).includes(amenity.id);
                  return (
                    <label
                      key={amenity.id}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-teal-50 border-teal-300 text-teal-900 font-medium'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleAmenityToggle(amenity.id)}
                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                      />
                      <span className="truncate">{language === 'bn' ? amenity.labelBn : amenity.labelEn}</span>
                    </label>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Submit CTA */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>
                {language === 'bn'
                  ? 'সংরক্ষণ করার পর সকল প্রোপার্টির ম্যাচ স্কোর স্বয়ংক্রিয়ভাবে আপডেট হবে।'
                  : 'Scores are evaluated deterministically in real-time.'}
              </span>
            </div>

            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm flex items-center gap-2 px-6"
            >
              <Save className="h-4 w-4" />
              <span>{language === 'bn' ? 'পছন্দসমূহ সংরক্ষণ করুন' : 'Save Preferences'}</span>
            </Button>
          </div>
        </form>
      </div>
    </TenantLayout>
  );
}
