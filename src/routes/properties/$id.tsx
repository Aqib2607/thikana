import { useState, useEffect } from 'react';
import { createFileRoute, Link, useParams } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useAuth } from '@/contexts/AuthContext';
import { useCompare } from '@/contexts/CompareContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PropertiesService } from '@/services/api/properties.service';
import { InteractionsService } from '@/services/api/interactions.service';
import { MatchingService } from '@/services/api/matching.service';
import { Property, Review, CommunityNote } from '@/types/thikana';
import { PropertyStatusBadge } from '@/components/property/PropertyStatusBadge';
import { VerificationBadge } from '@/components/property/VerificationBadge';
import { MatchScoreBadge } from '@/components/property/MatchScoreBadge';
import { PropertyGallery } from '@/components/property/PropertyGallery';
import { PropertyMapView } from '@/components/property/PropertyMapView';
import { ContactLandlordDialog } from '@/components/dialogs/ContactLandlordDialog';
import { RequestVisitDialog } from '@/components/dialogs/RequestVisitDialog';
import { ReportPropertyDialog } from '@/components/dialogs/ReportPropertyDialog';
import { ReviewPropertyDialog } from '@/components/dialogs/ReviewPropertyDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Heart,
  Scale,
  MapPin,
  Calendar,
  BedDouble,
  Bath,
  Maximize2,
  Building,
  CheckCircle2,
  XCircle,
  Phone,
  MessageSquare,
  Flag,
  Share2,
  ShieldCheck,
  Star,
  Info,
  ChevronLeft,
  Sparkles,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/properties/$id')({
  component: PropertyDetailPage,
});

function PropertyDetailPage() {
  const { id } = useParams({ from: '/properties/$id' });
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const { isInCompare, toggleCompare } = useCompare();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [property, setProperty] = useState<Property | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [communityNotes, setCommunityNotes] = useState<CommunityNote[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog open states
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [visitDialogOpen, setVisitDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  useEffect(() => {
    async function loadDetails() {
      setLoading(true);
      try {
        const prop = await PropertiesService.getPropertyById(id);
        setProperty(prop);

        if (prop) {
          const revs = await InteractionsService.getPropertyReviews(id);
          setReviews(revs);
          const notes = await InteractionsService.getCommunityNotes(prop.location);
          setCommunityNotes(notes);
        }
      } catch (err) {
        console.error('Failed to load property details', err);
      } finally {
        setLoading(false);
      }
    }
    loadDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-12 space-y-6">
          <div className="h-8 w-48 bg-slate-200 rounded-md animate-pulse" />
          <div className="h-96 w-full bg-slate-200 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-72 bg-slate-200 rounded-xl animate-pulse" />
            <div className="h-72 bg-slate-200 rounded-xl animate-pulse" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <div className="flex-1 max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-slate-400 mx-auto" />
          <h2 className="text-2xl font-bold text-slate-800">
            {language === 'bn' ? 'প্রোপার্টিটি খুঁজে পাওয়া যায়নি' : 'Property Not Found'}
          </h2>
          <p className="text-sm text-slate-500">
            {language === 'bn'
              ? 'অনুরোধকৃত প্রোপার্টিটি নিষ্ক্রিয় বা মুছে ফেলা হতে পারে।'
              : 'The requested listing may be inactive, rented, or removed.'}
          </p>
          <Link to="/properties">
            <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white">
              {language === 'bn' ? 'অন্যান্য প্রোপার্টি দেখুন' : 'Browse Other Rentals'}
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const title = (language === 'bn' ? property.titleBn : property.titleEn) || property.title;
  const description = (language === 'bn' ? property.descriptionBn : property.descriptionEn) || property.description;
  const inCompare = isInCompare(property.id);
  const favorited = isFavorite(property.id);

  // Calculate match score against current user preferences
  const tenantPrefs = MatchingService.getPreferences();
  const matchResult = MatchingService.calculateMatch(property, tenantPrefs);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success(
        language === 'bn' ? 'লিঙ্ক কপি করা হয়েছে!' : 'Property link copied to clipboard!'
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      {/* Back Navigation Bar */}
      <div className="bg-white border-b border-slate-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            to="/properties"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-emerald-700 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>{language === 'bn' ? 'সকল প্রোপার্টিতে ফিরুন' : 'Back to Listings'}</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="h-8 px-2.5 text-xs text-slate-600 border-slate-200 hover:bg-slate-50"
            >
              <Share2 className="h-3.5 w-3.5 mr-1" />
              <span>{language === 'bn' ? 'শেয়ার' : 'Share'}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleCompare(property)}
              className={`h-8 px-2.5 text-xs border-slate-200 ${
                inCompare
                  ? 'bg-blue-50 text-blue-700 border-blue-200 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Scale className="h-3.5 w-3.5 mr-1" />
              <span>{inCompare ? (language === 'bn' ? 'তুলায় যুক্ত' : 'Comparing') : language === 'bn' ? 'তুলনা' : 'Compare'}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleFavorite(property.id)}
              className={`h-8 px-2.5 text-xs border-slate-200 ${
                favorited
                  ? 'bg-rose-50 text-rose-600 border-rose-200 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 mr-1 ${favorited ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span>{favorited ? (language === 'bn' ? 'সংরক্ষিত' : 'Saved') : language === 'bn' ? 'সংরক্ষণ' : 'Save'}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <PropertyStatusBadge status={property.status || property.availabilityStatus || 'available'} />
              <VerificationBadge verification={property.verification || property.verifications} />
              {matchResult && matchResult.score > 50 && (
                <MatchScoreBadge score={matchResult.score} explanation={matchResult.explanation} />
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{property.address || `${property.location.area}, ${property.location.city}`}</span>
            </div>
          </div>

          {/* Price Box */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs md:text-right shrink-0">
            <div className="text-xs text-slate-500 font-medium">
              {language === 'bn' ? 'মাসিক ভাড়া' : 'Monthly Rent'}
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">
              ৳{(property.rent || property.monthlyRent || 0).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 space-x-2">
              {(property.serviceCharge ?? property.serviceChargeMonthly ?? 0) > 0 && (
                <span>
                  {language === 'bn' ? 'সার্ভিস চার্জ:' : 'Service:'} ৳{property.serviceCharge ?? property.serviceChargeMonthly}
                </span>
              )}
              {property.negotiable && (
                <Badge variant="outline" className="text-[10px] bg-slate-100 text-slate-700 border-slate-300">
                  {language === 'bn' ? 'আলোচনা সাপেক্ষ' : 'Negotiable'}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Gallery */}
        <PropertyGallery images={property.images} title={title || property.title} />

        {/* Two-Column Details Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Specs, Amenities, Description, Map, Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Specs Grid */}
            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                  {language === 'bn' ? 'প্রোপার্টি সংক্ষিপ্ত তথ্য' : 'Property Overview'}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <BedDouble className="h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="text-xs text-slate-500">{language === 'bn' ? 'বেডরুম' : 'Bedrooms'}</p>
                      <p className="text-sm font-bold text-slate-800">{property.bedrooms}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <Bath className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-xs text-slate-500">{language === 'bn' ? 'বাথরুম' : 'Bathrooms'}</p>
                      <p className="text-sm font-bold text-slate-800">{property.bathrooms}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <Maximize2 className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-xs text-slate-500">{language === 'bn' ? 'আয়তন' : 'Area Size'}</p>
                      <p className="text-sm font-bold text-slate-800">{property.sizeSqFt} {language === 'bn' ? 'বর্গফুট' : 'sq ft'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <Building className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="text-xs text-slate-500">{language === 'bn' ? 'ফ্লোর' : 'Floor'}</p>
                      <p className="text-sm font-bold text-slate-800">
                        {property.floorNumber} ({property.totalFloors} {language === 'bn' ? 'তলার মধ্যে' : 'total'})
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>
                      {language === 'bn' ? 'ভাড়া শুরুর তারিখ:' : 'Available From:'}{' '}
                      <strong className="text-slate-800">{property.availableFrom}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span>
                      {language === 'bn' ? 'সিকিউরিটি ডিপোজিট:' : 'Security Deposit:'}{' '}
                      <strong className="text-slate-800">৳{(property.depositAmount ?? property.securityDeposit ?? 0).toLocaleString()}</strong>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amenities Section */}
            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
                  {language === 'bn' ? 'প্রদত্ত সুবিধাসমূহ' : 'Amenities & Features'}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(property.amenities ?? []).map((amenity: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100/60 text-xs font-medium text-slate-700"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span className="capitalize">{amenity.replace('_', ' ')}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Description */}
            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                  {language === 'bn' ? 'বিস্তারিত বিবরণ' : 'Description'}
                </h3>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {description}
                </div>

                {/* House Rules */}
                {property.rules && property.rules.length > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                      {language === 'bn' ? 'বাড়ির নিয়মাবলী' : 'House Rules'}
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {(property.rules ?? []).map((rule: string, i: number) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          <span>{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location & Map View */}
            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                      {language === 'bn' ? 'অবস্থান ও মানচিত্র' : 'Location & Map'}
                    </h3>
                    <p className="text-xs text-slate-500">{property.address || `${property.location.area}, ${property.location.city}`}</p>
                  </div>
                  <Badge variant="outline" className="text-xs bg-slate-50 border-slate-200">
                    Khulna, BD
                  </Badge>
                </div>

                <PropertyMapView
                  coordinates={property.coordinates || { lat: property.location.latitude, lng: property.location.longitude }}
                  title={title || property.title}
                  address={property.address || `${property.location.area}, ${property.location.city}`}
                />
              </CardContent>
            </Card>

            {/* Community Notes */}
            {communityNotes.length > 0 && (
              <Card className="border-amber-200 bg-amber-50/40 shadow-xs">
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm">
                    <Info className="h-4 w-4 text-amber-600" />
                    <span>
                      {language === 'bn'
                        ? 'খুলনা স্থানীয় কমিউনিটি নোট'
                        : 'Khulna Local Community Insights'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {communityNotes.map((note) => (
                      <div
                        key={note.id}
                        className="bg-white p-3 rounded-lg border border-amber-200/80 text-xs text-slate-700"
                      >
                        <p className="leading-relaxed">
                          {language === 'bn' ? note.contentBn : note.contentEn}
                        </p>
                        <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                          <span>{note.author}</span>
                          <span>{note.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Reviews Section */}
            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                      {language === 'bn' ? 'ভাড়াটিয়াদের মতামত ও রিভিউ' : 'Tenant Reviews & Ratings'}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="flex text-amber-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= Math.round(property.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-700">{property.rating.toFixed(1)}</span>
                      <span className="text-xs text-slate-400">({reviews.length} {language === 'bn' ? 'টি রিভিউ' : 'reviews'})</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReviewDialogOpen(true)}
                    className="text-xs border-slate-300"
                  >
                    {language === 'bn' ? 'রিভিউ লিখুন' : 'Write Review'}
                  </Button>
                </div>

                {reviews.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">
                    {language === 'bn' ? 'এখনো কোনো রিভিউ জমা পড়েনি।' : 'No reviews submitted yet for this listing.'}
                  </p>
                ) : (
                  <div className="space-y-3 pt-2">
                    {reviews.map((rev) => (
                      <div key={rev.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800">{rev.userName}</span>
                          <div className="flex text-amber-500">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`h-3 w-3 ${
                                  s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{rev.comment}</p>
                        <span className="text-[10px] text-slate-400 block">{rev.createdAt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Landlord Card & Direct Actions */}
          <div className="space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Landlord Profile Box */}
              <Card className="border-slate-200 shadow-md">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-base">
                      {property.landlord.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-slate-900 truncate">{property.landlord.name}</h4>
                      <p className="text-xs text-slate-500">
                        {language === 'bn' ? 'বাড়িওয়ালা (খুলনা)' : 'Property Owner (Khulna)'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span>{language === 'bn' ? 'সরাসরি রেসপন্স হার:' : 'Response Rate:'}</span>
                      <strong className="text-emerald-700">98%</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{language === 'bn' ? 'মোট লিস্টিং:' : 'Total Listings:'}</span>
                      <strong className="text-slate-800">4 properties</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{language === 'bn' ? 'সদস্য মেয়াদ:' : 'Member Since:'}</span>
                      <span className="text-slate-500">2024</span>
                    </div>
                  </div>

                  {/* Primary CTAs */}
                  <div className="space-y-2.5 pt-2">
                    <Button
                      onClick={() => setContactDialogOpen(true)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm flex items-center justify-center gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>{language === 'bn' ? 'বাড়িওয়ালার সাথে যোগাযোগ' : 'Contact Landlord'}</span>
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setVisitDialogOpen(true)}
                      className="w-full border-slate-300 hover:bg-slate-50 text-slate-800 font-medium flex items-center justify-center gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>{language === 'bn' ? 'বাসা পরিদর্শনের অনুরোধ' : 'Schedule a Visit'}</span>
                    </Button>
                  </div>

                  {/* Flag Property */}
                  <div className="pt-2 text-center">
                    <button
                      onClick={() => setReportDialogOpen(true)}
                      className="text-[11px] text-slate-400 hover:text-rose-600 inline-flex items-center gap-1 transition-colors"
                    >
                      <Flag className="h-3 w-3" />
                      <span>{language === 'bn' ? 'এই বিজ্ঞাপনে অসঙ্গতি থাকলে রিপোর্ট করুন' : 'Report this listing'}</span>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Safety & Academic Verification Note */}
              <div className="bg-slate-100 rounded-xl p-4 border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2 font-semibold text-slate-800">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{language === 'bn' ? 'ভাড়াটিয়াদের জন্য নিরাপত্তা টিপস' : 'Tenant Safety Guidelines'}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  {language === 'bn'
                    ? 'বাসা সশরীরে পরিদর্শন না করে কাউকে কোনো অগ্রিম টাকা প্রদান করবেন না। ঠিকানা প্ল্যাটফর্ম কোনো ব্রোকার চার্জ গ্রহণ করে না।'
                    : 'Never transfer advance money before physically visiting the property and verifying ownership.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Dialogs */}
      {property && (
        <>
          <ContactLandlordDialog
            property={property}
            isOpen={contactDialogOpen}
            onClose={() => setContactDialogOpen(false)}
          />
          <RequestVisitDialog
            property={property}
            isOpen={visitDialogOpen}
            onClose={() => setVisitDialogOpen(false)}
          />
          <ReportPropertyDialog
            property={property}
            isOpen={reportDialogOpen}
            onClose={() => setReportDialogOpen(false)}
          />
          <ReviewPropertyDialog
            propertyId={property.id}
            propertyTitle={title || property.title}
            isOpen={reviewDialogOpen}
            onClose={() => setReviewDialogOpen(false)}
            onSuccess={() => {
              InteractionsService.getPropertyReviews(property.id).then(setReviews);
            }}
          />
        </>
      )}

      <Footer />
    </div>
  );
}
