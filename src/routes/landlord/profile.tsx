import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useAuth } from '@/contexts/AuthContext';
import { LandlordLayout } from '@/components/layout/LandlordLayout';
import { KHULNA_LOCATIONS } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Save, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/landlord/profile')({
  component: LandlordProfilePage,
});

function LandlordProfilePage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || 'হাসান মাহমুদ (Hasan Mahmud)');
  const [email, setEmail] = useState(user?.email || 'hasan@thikana.local');
  const [phone, setPhone] = useState(user?.phone || '01711223344');
  const [altPhone, setAltPhone] = useState('01988776655');
  const [address, setAddress] = useState('রোড #৪, সোনাডাঙ্গা আবাসিক এলাকা, খুলনা');
  const [nidNumber, setNidNumber] = useState('198547284918234');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      language === 'bn' ? 'বাড়িওয়ালার প্রোফাইল তথ্য সফলভাবে সংরক্ষিত হয়েছে!' : 'Landlord profile updated!'
    );
  };

  return (
    <LandlordLayout>
      <div className="max-w-3xl space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-2xl shrink-0 shadow-xs">
            {name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{name}</h1>
              <Badge className="bg-blue-100 text-blue-800 text-[10px] font-semibold">
                {language === 'bn' ? 'বাড়িওয়ালা অ্যাকাউন্ট' : 'Verified Landlord'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{email} • Khulna, Bangladesh</p>
          </div>
        </div>

        {/* Profile Edit Form */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">
              {language === 'bn' ? 'বাড়িওয়ালার যোগাযোগ ও পরিচয়' : 'Landlord Contact & Identity'}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              {language === 'bn'
                ? 'এই তথ্যগুলো আপনার লিস্টিংয়ে সরাসরি যোগাযোগের মাধ্যম হিসেবে প্রদর্শিত হবে'
                : 'Contact details displayed to verified prospective tenants.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'বাড়িওয়ালার নাম' : 'Landlord Full Name'}
                  </Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="text-sm bg-slate-50 border-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'প্রধান মোবাইল নম্বর' : 'Primary Phone Number'}
                  </Label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="text-sm bg-slate-50 border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
                  </Label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="text-sm bg-slate-50 border-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'বিকল্প জরুরি নম্বর' : 'Alternate Emergency Phone'}
                  </Label>
                  <Input
                    type="tel"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    className="text-sm bg-slate-50 border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">
                  {language === 'bn' ? 'বাসস্থান / অফিসের ঠিকানা (খুলনা)' : 'Residence / Office Address (Khulna)'}
                </Label>
                <Input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="text-sm bg-slate-50 border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                  <span>{language === 'bn' ? 'জাতীয় পরিচয়পত্র নম্বর (এনআইডি - সিমুলেটেড)' : 'National ID (Simulated)'}</span>
                </Label>
                <Input
                  type="text"
                  value={nidNumber}
                  onChange={(e) => setNidNumber(e.target.value)}
                  className="text-sm bg-slate-50 border-slate-200 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5">
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  <span>{language === 'bn' ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Profile'}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </LandlordLayout>
  );
}
