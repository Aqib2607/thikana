import { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useAuth } from '@/contexts/AuthContext';
import { TenantLayout } from '@/components/layout/TenantLayout';
import { KHULNA_LOCATIONS } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Briefcase, Save, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/tenant/profile')({
  component: TenantProfilePage,
});

function TenantProfilePage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || 'তানভীর আহমেদ (Tanvir Ahmed)');
  const [email, setEmail] = useState(user?.email || 'tanvir@thikana.local');
  const [phone, setPhone] = useState(user?.phone || '01712345678');
  const [preferredArea, setPreferredArea] = useState('sonadanga');
  const [occupation, setOccupation] = useState(
    language === 'bn' ? 'সফটওয়্যার ইঞ্জিনিয়ার / শিক্ষার্থী' : 'Software Engineer / Student'
  );
  const [bio, setBio] = useState(
    language === 'bn'
      ? 'খুলনার সোনাডাঙ্গা বা বয়রা এলাকায় শান্ত পরিবেশে ফ্যামিলি অথবা ব্যাচেলর ফ্ল্যাট খুঁজছি।'
      : 'Looking for a peaceful, well-ventilated apartment in Sonadanga or Boyra.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      language === 'bn' ? 'প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!' : 'Profile updated successfully!'
    );
  };

  return (
    <TenantLayout>
      <div className="max-w-3xl space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-2xl shrink-0 shadow-xs">
            {name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{name}</h1>
              <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                {language === 'bn' ? 'ভাড়াটিয়া অ্যাকাউন্ট' : 'Tenant Account'}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{email} • Khulna, Bangladesh</p>
          </div>
        </div>

        {/* Profile Edit Form */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader>
            <CardTitle className="text-base font-bold text-slate-900">
              {language === 'bn' ? 'ব্যক্তিগত তথ্য ও যোগাযোগ' : 'Personal & Contact Information'}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              {language === 'bn'
                ? 'বাড়িওয়ালার সাথে যোগাযোগের সময় এই তথ্যগুলো প্রস্তাবনায় ব্যবহৃত হবে'
                : 'This info is provided during direct inquiry and visit scheduling.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'পূর্ণ নাম' : 'Full Name'}
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
                    {language === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
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
                    {language === 'bn' ? 'পেশা বা শিক্ষা' : 'Occupation / Study'}
                  </Label>
                  <Input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="text-sm bg-slate-50 border-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">
                  {language === 'bn' ? 'পছন্দের প্রধান এলাকা (খুলনা)' : 'Primary Khulna Area'}
                </Label>
                <select
                  value={preferredArea}
                  onChange={(e) => setPreferredArea(e.target.value)}
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
                  {language === 'bn' ? 'সংক্ষিপ্ত পরিচয় / বায়ো' : 'Bio / Living Preferences'}
                </Label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5">
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  <span>{language === 'bn' ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </TenantLayout>
  );
}
