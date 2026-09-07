import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/i18n/LanguageProvider';
import { LandlordLayout } from '@/components/layout/LandlordLayout';
import { PropertiesService } from '@/services/api/properties.service';
import { KHULNA_LOCATIONS, AMENITIES_LIST } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Building2,
  MapPin,
  DollarSign,
  Layers,
  Sparkles,
  Save,
  Send,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/landlord/properties/create')({
  component: LandlordPropertyCreatePage,
});

function LandlordPropertyCreatePage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [type, setType] = useState('apartment');
  const [location, setLocation] = useState('sonadanga');
  const [address, setAddress] = useState('');
  const [rent, setRent] = useState(15000);
  const [serviceCharge, setServiceCharge] = useState(1500);
  const [deposit, setDeposit] = useState(30000);
  const [negotiable, setNegotiable] = useState(false);
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);
  const [balconies, setBalconies] = useState(2);
  const [sizeSqFt, setSizeSqFt] = useState(1250);
  const [floorNumber, setFloorNumber] = useState(3);
  const [totalFloors, setTotalFloors] = useState(6);
  const [availableFrom, setAvailableFrom] = useState(new Date().toISOString().split('T')[0]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'water_supply',
    'cctv',
    'gas_line',
  ]);
  const [descriptionBn, setDescriptionBn] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'
  );
  const [loading, setLoading] = useState(false);

  const handleAmenityToggle = (amenityId: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId) ? prev.filter((a) => a !== amenityId) : [...prev, amenityId]
    );
  };

  const handleSave = async (asDraft: boolean) => {
    if (!titleBn || !address || !rent) {
      toast.error(
        language === 'bn' ? 'দয়া করে আবশ্যক ক্ষেত্রগুলো পূরণ করুন' : 'Please fill all required fields'
      );
      return;
    }

    setLoading(true);
    try {
      const locObj = KHULNA_LOCATIONS.find((l) => l.id === location);
      await PropertiesService.createProperty({
        titleBn,
        titleEn: titleEn || titleBn,
        descriptionBn: descriptionBn || 'খুলনার চমৎকার পরিবেশে খোলামেলা বাসা।',
        descriptionEn: 'Well-ventilated apartment in peaceful Khulna neighborhood.',
        type: type as any,
        location,
        address,
        coordinates: locObj?.coordinates || { lat: 22.82, lng: 89.54 },
        rent: Number(rent),
        serviceCharge: Number(serviceCharge),
        depositAmount: Number(deposit),
        negotiable,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        balconies: Number(balconies),
        sizeSqFt: Number(sizeSqFt),
        floorNumber: Number(floorNumber),
        totalFloors: Number(totalFloors),
        availableFrom,
        amenities: selectedAmenities,
        images: [
          imageUrl,
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        ],
        status: 'available',
        approvalStatus: asDraft ? 'draft' : 'submitted',
        verification: {
          addressVerified: false,
          ownershipVerified: false,
          physicalInspection: false,
        },
        landlord: {
          id: user?.id || 'landlord-1',
          name: user?.name || 'Hasan Mahmud',
          phone: user?.phone || '01711223344',
        },
        preferredTenants: ['family', 'bachelor'],
        rules: [
          'গেটের তালা রাত ১১ টায় বন্ধ হয় (Main gate closes at 11:00 PM)',
          'ধূমপান নিষেধ (No smoking in common areas)',
        ],
      });

      toast.success(
        asDraft
          ? language === 'bn' ? 'ড্রাফট হিসেবে সংরক্ষিত হয়েছে!' : 'Saved as draft!'
          : language === 'bn' ? 'অনুমোদনের জন্য জমা দেওয়া হয়েছে!' : 'Submitted for admin review!'
      );

      navigate({ to: '/landlord/properties' });
    } catch (err) {
      toast.error('Failed to save property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LandlordLayout>
      <div className="max-w-4xl space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
            <Building2 className="h-3.5 w-3.5" />
            <span>{language === 'bn' ? 'নতুন লিস্টিং তৈরি' : 'Create Listing'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'bn' ? 'নতুন প্রোপার্টি যোগ করুন' : 'Add New Rental Property'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'খুলনার ভাড়াটিয়াদের কাছে সরাসরি পৌঁছে যেতে আপনার বাসার সঠিক তথ্য পূরণ করুন।'
              : 'Complete the verified property details to list directly across Khulna.'}
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(false); }} className="space-y-6">
          {/* Section 1: Basic Information */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-900">
                {language === 'bn' ? '১. প্রাথমিক তথ্য ও ধরন' : '1. Basic Information & Type'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'শিরোনাম (বাংলায়) *' : 'Title (Bangla) *'}
                  </Label>
                  <Input
                    type="text"
                    required
                    placeholder="যেমন: সোনাডাঙ্গা আবাসিক এলাকায় আলো-বাতাসপূর্ণ ৩ বেডরুম ফ্ল্যাট"
                    value={titleBn}
                    onChange={(e) => setTitleBn(e.target.value)}
                    className="text-sm bg-slate-50 border-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'শিরোনাম (ইংরেজিতে)' : 'Title (English)'}
                  </Label>
                  <Input
                    type="text"
                    placeholder="e.g. Spacious 3-Bed Family Apartment in Sonadanga"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="text-sm bg-slate-50 border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">
                  {language === 'bn' ? 'প্রোপার্টি ধরন' : 'Property Type'}
                </Label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-slate-50 focus:bg-white"
                >
                  <option value="apartment">{language === 'bn' ? 'ফ্ল্যাট / অ্যাপার্টমেন্ট' : 'Apartment'}</option>
                  <option value="bachelor_mess">{language === 'bn' ? 'ব্যাচেলর মেস' : 'Bachelor Mess'}</option>
                  <option value="sublet">{language === 'bn' ? 'সাবলেট / রুম' : 'Sublet / Room'}</option>
                  <option value="hostel">{language === 'bn' ? 'হোস্টেল' : 'Hostel'}</option>
                  <option value="commercial">{language === 'bn' ? 'বাণিজ্যিক স্পেস' : 'Commercial Space'}</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Khulna Location */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-600" />
                <span>{language === 'bn' ? '২. খুলনা অবস্থান ও ঠিকানা' : '2. Khulna Location & Address'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'খুলনা এলাকা *' : 'Khulna Area *'}
                  </Label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-slate-50 focus:bg-white"
                  >
                    {KHULNA_LOCATIONS.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.nameBn} ({loc.nameEn})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'পূর্ণ ঠিকানা ও ল্যান্ডমার্ক *' : 'Detailed Address & Landmark *'}
                  </Label>
                  <Input
                    type="text"
                    required
                    placeholder="রোড নম্বর, বাড়ি নম্বর, ল্যান্ডমার্ক"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="text-sm bg-slate-50 border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'ফ্লোর নম্বর' : 'Floor Level'}
                  </Label>
                  <Input
                    type="number"
                    value={floorNumber}
                    onChange={(e) => setFloorNumber(Number(e.target.value))}
                    className="text-sm bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'মোট তলা' : 'Total Floors'}
                  </Label>
                  <Input
                    type="number"
                    value={totalFloors}
                    onChange={(e) => setTotalFloors(Number(e.target.value))}
                    className="text-sm bg-slate-50 border-slate-200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Rent, Deposit & Specs */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-900">
                {language === 'bn' ? '৩. ভাড়া ও স্পেসিফিকেশন' : '3. Rent & Specifications'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'মাসিক ভাড়া (৳) *' : 'Monthly Rent (BDT) *'}
                  </Label>
                  <Input
                    type="number"
                    required
                    value={rent}
                    onChange={(e) => setRent(Number(e.target.value))}
                    className="text-sm bg-slate-50 border-slate-200 font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'সার্ভিস চার্জ (৳)' : 'Service Charge'}
                  </Label>
                  <Input
                    type="number"
                    value={serviceCharge}
                    onChange={(e) => setServiceCharge(Number(e.target.value))}
                    className="text-sm bg-slate-50 border-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'সিকিউরিটি ডিপোজিট (৳)' : 'Security Deposit'}
                  </Label>
                  <Input
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(Number(e.target.value))}
                    className="text-sm bg-slate-50 border-slate-200"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="negotiable"
                  checked={negotiable}
                  onChange={(e) => setNegotiable(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="negotiable" className="text-xs text-slate-700 cursor-pointer font-medium">
                  {language === 'bn' ? 'ভাড়া আলোচনা সাপেক্ষ (Negotiable)' : 'Rent is negotiable'}
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'বেডরুম' : 'Bedrooms'}
                  </Label>
                  <Input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="text-sm bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'বাথরুম' : 'Bathrooms'}
                  </Label>
                  <Input
                    type="number"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="text-sm bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'বারান্দা' : 'Balconies'}
                  </Label>
                  <Input
                    type="number"
                    value={balconies}
                    onChange={(e) => setBalconies(Number(e.target.value))}
                    className="text-sm bg-slate-50 border-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'আয়তন (বর্গফুট)' : 'Size (sq ft)'}
                  </Label>
                  <Input
                    type="number"
                    value={sizeSqFt}
                    onChange={(e) => setSizeSqFt(Number(e.target.value))}
                    className="text-sm bg-slate-50 border-slate-200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Amenities */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-900">
                {language === 'bn' ? '৪. প্রদত্ত সুবিধাসমূহ' : '4. Amenities & Facilities'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {AMENITIES_LIST.map((am) => {
                  const isChecked = selectedAmenities.includes(am.id);
                  return (
                    <label
                      key={am.id}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-blue-50 border-blue-300 text-blue-900 font-medium'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleAmenityToggle(am.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="truncate">{language === 'bn' ? am.labelBn : am.labelEn}</span>
                    </label>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Photo URL & Details */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-900">
                {language === 'bn' ? '৫. ছবি ও বিবরণ' : '5. Photos & Description'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">
                  {language === 'bn' ? 'প্রধান ছবির লিঙ্ক (Image URL)' : 'Primary Image URL'}
                </Label>
                <Input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="text-sm bg-slate-50 border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">
                  {language === 'bn' ? 'বিস্তারিত বিবরণ' : 'Detailed Description'}
                </Label>
                <textarea
                  rows={4}
                  placeholder={
                    language === 'bn'
                      ? 'বাসার বিশেষ বৈশিষ্ট্য, পরিবেশ ও যাতায়াত সুবিধা লিখুন...'
                      : 'Describe the flat, surrounding area, accessibility...'
                  }
                  value={descriptionBn}
                  onChange={(e) => setDescriptionBn(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => handleSave(true)}
              className="w-full sm:w-auto text-xs border-slate-300"
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              <span>{language === 'bn' ? 'ড্রাফট হিসেবে সংরক্ষণ' : 'Save as Draft'}</span>
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              <span>{language === 'bn' ? 'অনুমোদনের জন্য জমা দিন' : 'Submit for Approval'}</span>
            </Button>
          </div>
        </form>
      </div>
    </LandlordLayout>
  );
}
