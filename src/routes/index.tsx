import { useState, useEffect } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { Property } from '@/types/thikana';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PropertiesService } from '@/services/api/properties.service';
import { PropertyCard } from '@/components/property/PropertyCard';
import { KHULNA_LOCATIONS } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  MapPin,
  Home,
  Users,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  SlidersHorizontal,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Building2,
  CalendarCheck,
} from 'lucide-react';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  // Search form state
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  // Featured properties
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const response = await PropertiesService.getProperties({
          status: 'available',
          limit: 6,
          sort: 'featured',
        });
        setFeaturedProperties(response.properties);
      } catch (err) {
        console.error('Failed to load featured properties', err);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams: Record<string, string> = {};
    if (selectedArea) queryParams['location'] = selectedArea;
    if (selectedType) queryParams['type'] = selectedType;
    if (maxRent) queryParams['maxRent'] = maxRent;
    if (bedrooms) queryParams['bedrooms'] = bedrooms;

    navigate({
      to: '/properties',
      search: queryParams,
    });
  };

  const categories = [
    {
      id: 'family',
      titleBn: 'পারিবারিক ফ্ল্যাট',
      titleEn: 'Family Apartments',
      descBn: 'শান্তিপূর্ণ পরিবেশ ও পর্যাপ্ত আলো-বাতাস',
      descEn: 'Peaceful living with good ventilation',
      icon: Home,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'bachelor',
      titleBn: 'ব্যাচেলর মেস ও রুম',
      titleEn: 'Bachelor & Shared',
      descBn: 'চাকরিজীবী ও শিক্ষার্থীদের জন্য সাশ্রয়ী',
      descEn: 'Affordable for working professionals & students',
      icon: Users,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      id: 'female_student',
      titleBn: 'ছাত্রী হোস্টেল / সাবলেট',
      titleEn: 'Female Student Sublets',
      descBn: 'কুয়েট ও বিশ্ববিদ্যালয় সংলগ্ন নিরাপদ পরিবেশ',
      descEn: 'Secure near KUET & Khulna University',
      icon: GraduationCap,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      id: 'commercial',
      titleBn: 'অফিস ও বাণিজ্যিক স্পেস',
      titleEn: 'Commercial & Office',
      descBn: 'খুলনার বাণিজ্যিক কেন্দ্র ও মেইন রোড',
      descEn: 'Commercial hubs & main roadside',
      icon: Briefcase,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-emerald-900 via-emerald-800 to-slate-900 text-white pt-16 pb-24 md:py-24 overflow-hidden">
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium text-emerald-200 backdrop-blur-xs">
            <Sparkles className="h-4 w-4 text-emerald-300" />
            <span>
              {language === 'bn'
                ? 'খুলনার একমাত্র স্বচ্ছ ও নিয়ম-ভিত্তিক বাসা খোঁজার প্ল্যাটফর্ম'
                : 'Khulna’s Rule-Based Rental Discovery Platform'}
            </span>
          </div>

          {/* Heading */}
          <div className="max-w-3xl mx-auto space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              {language === 'bn' ? (
                <>
                  খুলনায় আপনার মনের মতো <br className="hidden sm:inline" />
                  <span className="text-emerald-300">নিরাপদ বাসা</span> খুঁজুন সহজেই
                </>
              ) : (
                <>
                  Find Your Ideal Rental Home in <br className="hidden sm:inline" />
                  <span className="text-emerald-300">Khulna City</span> with Confidence
                </>
              )}
            </h1>
            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl mx-auto">
              {language === 'bn'
                ? 'সোনাডাঙ্গা, খালিশপুর, বয়রা কিংবা কুয়েট এলাকা — কোনো ভুয়া বিজ্ঞাপন নয়, বাড়িওয়ালার সরাসরি প্রাপ্যতা নিশ্চিতকরণ এবং স্বচ্ছ তথ্যের ঠিকানা।'
                : 'Sonadanga, Khalishpur, Boyra or near KUET — transparent listings, verified landlord availability, and 6-factor deterministic match scoring.'}
            </p>
          </div>

          {/* Quick Search Box */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-100 text-slate-800 text-left">
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Location */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                  {language === 'bn' ? 'এলাকা (খুলনা)' : 'Khulna Area'}
                </label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                >
                  <option value="">{language === 'bn' ? 'সব এলাকা' : 'All Areas'}</option>
                  {KHULNA_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.nameBn} ({loc.nameEn})
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Type */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <Home className="h-3.5 w-3.5 text-emerald-600" />
                  {language === 'bn' ? 'ধরন' : 'Type'}
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                >
                  <option value="">{language === 'bn' ? 'সব ধরন' : 'All Types'}</option>
                  <option value="apartment">{language === 'bn' ? 'ফ্ল্যাট / অ্যাপার্টমেন্ট' : 'Apartment'}</option>
                  <option value="bachelor_mess">{language === 'bn' ? 'ব্যাচেলর মেস' : 'Bachelor Mess'}</option>
                  <option value="sublet">{language === 'bn' ? 'সাবলেট / রুম' : 'Sublet / Room'}</option>
                  <option value="hostel">{language === 'bn' ? 'হোস্টেল' : 'Hostel'}</option>
                  <option value="commercial">{language === 'bn' ? 'বাণিজ্যিক' : 'Commercial'}</option>
                </select>
              </div>

              {/* Max Rent */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                  {language === 'bn' ? 'সর্বোচ্চ ভাড়া (৳)' : 'Max Rent (BDT)'}
                </label>
                <Input
                  type="number"
                  placeholder="যেমন: ১৫০০০"
                  value={maxRent}
                  onChange={(e) => setMaxRent(e.target.value)}
                  className="h-10 text-sm bg-slate-50 focus:bg-white border-slate-200"
                />
              </div>

              {/* Submit Button */}
              <div className="flex items-end">
                <Button
                  type="submit"
                  className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  <span>{language === 'bn' ? 'বাসা খুঁজুন' : 'Search Rentals'}</span>
                </Button>
              </div>
            </form>
          </div>

          {/* Quick Stats */}
          <div className="pt-4 flex flex-wrap justify-center items-center gap-6 sm:gap-12 text-xs sm:text-sm text-emerald-200/80 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{language === 'bn' ? '১০০% সরাসরি বাড়িওয়ালা' : '100% Direct Landlords'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{language === 'bn' ? 'কোনো মধ্যস্থতাকারী ফি নেই' : 'Zero Brokerage Fee'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>{language === 'bn' ? 'নিয়ম-ভিত্তিক ম্যাচ স্কোরিং' : 'Rule-Based Match Scoring'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tiles */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-2xl font-bold text-slate-900">
              {language === 'bn' ? 'আপনার প্রয়োজন অনুযায়ী বেছে নিন' : 'Choose by Your Living Need'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {language === 'bn'
                ? 'পরিবার, ছাত্র বা কর্মজীবী — প্রতিটি বিভাগের জন্য সুনির্দিষ্ট প্রোপার্টি'
                : 'Dedicated listings tailored for families, bachelors, and students'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  to="/properties"
                  search={{ category: cat.id }}
                  className={`p-5 rounded-xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${cat.color} group`}
                >
                  <div className="h-10 w-10 rounded-lg bg-white/80 flex items-center justify-center mb-3 shadow-xs">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {language === 'bn' ? cat.titleBn : cat.titleEn}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">{language === 'bn' ? cat.descBn : cat.descEn}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                <Building2 className="h-3.5 w-3.5" />
                <span>{language === 'bn' ? 'সরাসরি প্রাপ্ত প্রোপার্টি' : 'Direct Listings'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {language === 'bn' ? 'খুলনার সাম্প্রতিক বাসাসমূহ' : 'Available Rentals in Khulna'}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {language === 'bn'
                  ? 'সরাসরি বাড়িওয়ালার দ্বারা আপডেটকৃত উন্মুক্ত বাসার তালিকা'
                  : 'Freshly updated, directly manageable availability by landlords'}
              </p>
            </div>
            <Link to="/properties">
              <Button variant="outline" className="text-sm border-slate-300 hover:bg-white flex items-center gap-1.5">
                <span>{language === 'bn' ? 'সব প্রোপার্টি দেখুন' : 'Browse All Listings'}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 rounded-xl bg-slate-200 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Deterministic Matching Rule Spotlight */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold">
                <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-600" />
                <span>{language === 'bn' ? 'নিয়ম-ভিত্তিক পছন্দ ইঞ্জিন' : 'Deterministic 6-Factor Matching'}</span>
              </div>

              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {language === 'bn' ? (
                  <>
                    স্বচ্ছ ও নির্ভরযোগ্য <br />
                    <span className="text-emerald-600">ম্যাচ স্কোরিং পদ্ধতি</span>
                  </>
                ) : (
                  <>
                    Explainable & Reliable <br />
                    <span className="text-emerald-600">Rule-Based Match Scoring</span>
                  </>
                )}
              </h2>

              <p className="text-slate-600 text-sm leading-relaxed">
                {language === 'bn'
                  ? 'ঠিকানা কোনো অযৌক্তিক বা কাল্পনিক AI ব্যবহার করে না। আমাদের ইঞ্জিন সম্পূর্ণ স্বচ্ছ গাণিতিক মডেলের মাধ্যমে আপনার পছন্দের সাথে প্রতিটি বাসার সামঞ্জস্য যাচাই করে।'
                  : 'Thikana uses no opaque AI guesswork. We calculate deterministic match scores based on a transparent 6-factor model configured to your preferences.'}
              </p>

              {/* 6 Factors Progress Breakdown */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-700">{language === 'bn' ? 'এলাকার নৈকট্য (Location)' : 'Location Match'}</span>
                  <span className="text-emerald-700 font-bold">৩০% গুরুত্ব (30% weight)</span>
                </div>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-700">{language === 'bn' ? 'বাজেট সামঞ্জস্য (Budget Range)' : 'Budget Match'}</span>
                  <span className="text-emerald-700 font-bold">২৫% গুরুত্ব (25% weight)</span>
                </div>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-700">{language === 'bn' ? 'প্রোপার্টি ধরন (Property Type)' : 'Property Type'}</span>
                  <span className="text-emerald-700 font-bold">১৫% গুরুত্ব (15% weight)</span>
                </div>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-700">{language === 'bn' ? 'সুবিধাসমূহ (Amenities)' : 'Amenities Required'}</span>
                  <span className="text-emerald-700 font-bold">১৫% গুরুত্ব (15% weight)</span>
                </div>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-700">{language === 'bn' ? 'বেডরুম ও বাথরুম (Rooms)' : 'Bed & Bath Count'}</span>
                  <span className="text-emerald-700 font-bold">১০% গুরুত্ব (10% weight)</span>
                </div>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-700">{language === 'bn' ? 'তাৎক্ষণিক প্রাপ্যতা (Availability)' : 'Current Availability'}</span>
                  <span className="text-emerald-700 font-bold">৫% গুরুত্ব (5% weight)</span>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/tenant/preferences">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm">
                    {language === 'bn' ? 'আপনার পছন্দ সেট করুন' : 'Configure Your Preferences'}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Visual Box */}
            <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute -right-12 -top-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div>
                  <h4 className="font-semibold text-white">
                    {language === 'bn' ? 'নমুনা স্কোর গণনা' : 'Sample Match Calculation'}
                  </h4>
                  <p className="text-xs text-slate-400">Sonadanga 3-Bed Family Flat</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-emerald-400">92%</span>
                  <p className="text-[11px] text-emerald-300 font-medium">
                    {language === 'bn' ? 'উচ্চ সামঞ্জস্য' : 'High Match'}
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-slate-300">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-800">
                  <span>✓ এলাকা: সোনাডাঙ্গা (নিখুঁত মিল)</span>
                  <span className="text-emerald-400 font-mono">30/30 pts</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-800">
                  <span>✓ বাজেট: ৳১৮,০০০ (বাজেটের মধ্যে)</span>
                  <span className="text-emerald-400 font-mono">25/25 pts</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-800">
                  <span>✓ ধরন: ফ্যামিলি অ্যাপার্টমেন্ট</span>
                  <span className="text-emerald-400 font-mono">15/15 pts</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-800">
                  <span>✓ ৩ বেডরুম ও ২ বাথরুম</span>
                  <span className="text-emerald-400 font-mono">10/10 pts</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-800">
                  <span>⚠ গ্যাস সিলিন্ডার (লাইনের বদলে)</span>
                  <span className="text-amber-400 font-mono">7/15 pts</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-800">
                  <span>✓ প্রাপ্যতা: উন্মুক্ত (Available)</span>
                  <span className="text-emerald-400 font-mono">5/5 pts</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>{language === 'bn' ? 'সরাসরি ব্যাখ্যাযোগ্য' : '100% Explainable'}</span>
                <span>{language === 'bn' ? 'নিয়ম ভঙ্গের কোনো সুযোগ নেই' : 'Deterministic Protocol'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Academic Prototype Disclaimer */}
      <section className="py-12 bg-amber-50/50 border-b border-amber-200/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center justify-center p-2 rounded-full bg-amber-100 text-amber-700 mb-1">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-amber-950">
            {language === 'bn'
              ? 'একাডেমিক প্রোটোটাইপ ও স্বচ্ছতার অঙ্গীকার'
              : 'Academic Research Prototype Transparency'}
          </h3>
          <p className="text-xs sm:text-sm text-amber-800 max-w-2xl mx-auto leading-relaxed">
            {language === 'bn'
              ? 'ঠিকানা প্ল্যাটফর্মে প্রদর্শিত প্রোপার্টি ভেরিফিকেশন ব্যাজসমূহ (ঠিকানা যাচাই, মালিকানা যাচাই, ভিজিট পরিদর্শন) এই গবেষণা প্রোটোটাইপের জন্য কৃত্রিমভাবে সিমুলেট করা হয়েছে। এটি কোনো সরকারি সনদের বিকল্প নয়।'
              : 'All property verification badges shown on Thikana (Address Verified, Ownership Verified, Physical Inspection) are simulated at academic platform level and do not represent government certifications.'}
          </p>
        </div>
      </section>

      {/* Dual CTA Section for Landlords & Tenants */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Landlord Card */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {language === 'bn' ? 'আপনি কি খুলনায় বাড়িওয়ালা?' : 'Are you a Landlord in Khulna?'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {language === 'bn'
                  ? 'কোনো ব্রোকার ঝামেলা ছাড়াই আপনার ফ্ল্যাট বা মেসের তথ্য সরাসরি পোস্ট করুন। ভাড়া হয়ে গেলে যেকোনো সময় এক ক্লিকে স্ট্যাটাস পরিবর্তন করুন।'
                  : 'Post your rental listing directly without broker fees. Enjoy 1-click availability toggling when reserved or rented.'}
              </p>
              <div className="pt-2">
                <Link to="/landlord/properties/create">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm">
                    {language === 'bn' ? 'ফ্রি প্রোপার্টি লিস্টিং করুন' : 'List Your Property Free'}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Tenant Card */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <CalendarCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {language === 'bn' ? 'পরিকল্পিত বাসা পরিদর্শন করুন' : 'Schedule Property Visits'}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {language === 'bn'
                  ? 'বাড়িওয়ালার সাথে সরাসরি মেসেজে যোগাযোগ করুন এবং নির্ধারিত সুবিধাজনক সময়ে বাসা পরিদর্শনের রিকোয়েস্ট পাঠান।'
                  : 'Directly contact verified landlords and request convenient inspection visits before deciding.'}
              </p>
              <div className="pt-2">
                <Link to="/properties">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm">
                    {language === 'bn' ? 'সব বাসা খুঁজে দেখুন' : 'Explore All Rentals'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
