import { useState, useEffect } from 'react';
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { Property, PropertyStatus } from '@/types/thikana';
import { LandlordLayout } from '@/components/layout/LandlordLayout';
import { PropertiesService } from '@/services/api/properties.service';
import { KHULNA_LOCATIONS, AMENITIES_LIST } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/landlord/properties/$id/edit')({
  component: LandlordPropertyEditPage,
});

function LandlordPropertyEditPage() {
  const { id } = useParams({ from: '/landlord/properties/$id/edit' });
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [property, setProperty] = useState<Property | null>(null);
  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [rent, setRent] = useState(0);
  const [serviceCharge, setServiceCharge] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [status, setStatus] = useState<PropertyStatus>('available');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const prop = await PropertiesService.getPropertyById(id);
        if (prop) {
          setProperty(prop);
          setTitleBn(prop.titleBn || prop.title || '');
          setTitleEn(prop.titleEn || prop.title || '');
          setRent(prop.rent || prop.monthlyRent || 0);
          setServiceCharge(prop.serviceCharge || prop.serviceChargeMonthly || 0);
          setDeposit(prop.depositAmount || prop.securityDeposit || 0);
          setStatus(prop.status || prop.availabilityStatus || 'available');
          setDescriptionBn(prop.descriptionBn || prop.description || '');
          setSelectedAmenities(prop.amenities || []);
        }
      } catch (err) {
        console.error('Failed to load property', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleAmenityToggle = (amenityId: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId) ? prev.filter((a) => a !== amenityId) : [...prev, amenityId]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await PropertiesService.updateProperty(id, {
        titleBn,
        titleEn,
        rent: Number(rent),
        serviceCharge: Number(serviceCharge),
        depositAmount: Number(deposit),
        status,
        descriptionBn,
        amenities: selectedAmenities,
      });

      toast.success(
        language === 'bn' ? 'প্রোপার্টি সফলভাবে আপডেট হয়েছে!' : 'Property updated successfully!'
      );
      navigate({ to: '/landlord/properties' });
    } catch (err) {
      toast.error('Failed to update property');
    }
  };

  if (loading) {
    return (
      <LandlordLayout>
        <div className="h-96 flex items-center justify-center text-xs text-slate-400">
          Loading...
        </div>
      </LandlordLayout>
    );
  }

  return (
    <LandlordLayout>
      <div className="max-w-4xl space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate({ to: '/landlord/properties' })}
              className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {language === 'bn' ? 'প্রোপার্টি সম্পাদনা করুন' : 'Edit Rental Property'}
              </h1>
              <p className="text-xs text-slate-500">ID: #{id} • {property?.address}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-900">
                {language === 'bn' ? 'মূল বিবরণ ও প্রাপ্যতা' : 'Key Details & Availability'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'শিরোনাম (বাংলা)' : 'Title (Bangla)'}
                  </Label>
                  <Input
                    type="text"
                    required
                    value={titleBn}
                    onChange={(e) => setTitleBn(e.target.value)}
                    className="text-sm bg-slate-50 border-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'প্রাপ্যতা স্ট্যাটাস' : 'Availability Status'}
                  </Label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-slate-50 focus:bg-white font-semibold"
                  >
                    <option value="available">🟢 Available (উন্মুক্ত)</option>
                    <option value="reserved">🟡 Reserved (বুক করা)</option>
                    <option value="rented">🔴 Rented (ভাড়া হয়েছে)</option>
                    <option value="temporarily_unavailable">⏸ Unavailable (সাময়িক বন্ধ)</option>
                    <option value="inactive">⚪ Inactive (নিষ্ক্রিয়)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'মাসিক ভাড়া (৳)' : 'Monthly Rent'}
                  </Label>
                  <Input
                    type="number"
                    value={rent}
                    onChange={(e) => setRent(Number(e.target.value))}
                    className="text-sm bg-slate-50 border-slate-200 font-bold text-emerald-700"
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

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">
                  {language === 'bn' ? 'বিবরণ' : 'Description'}
                </Label>
                <textarea
                  rows={4}
                  value={descriptionBn}
                  onChange={(e) => setDescriptionBn(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-200 text-sm bg-slate-50 focus:bg-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-900">
                {language === 'bn' ? 'সুবিধাসমূহ' : 'Amenities'}
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

          <div className="flex justify-end pt-4">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-6">
              <Save className="h-3.5 w-3.5 mr-1.5" />
              <span>{language === 'bn' ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}</span>
            </Button>
          </div>
        </form>
      </div>
    </LandlordLayout>
  );
}
