import { useState } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { KHULNA_LOCATIONS } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, User, Building, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/register')({
  component: RegisterPage,
});

function RegisterPage() {
  const { t, language } = useLanguage();
  const { setPersona } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<'tenant' | 'landlord'>('tenant');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('sonadanga');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setPersona(role);
      toast.success(
        language === 'bn'
          ? `স্বাগতম! আপনার ${role === 'tenant' ? 'ভাড়াটিয়া' : 'বাড়িওয়ালা'} অ্যাকাউন্ট সফলভাবে সক্রিয় হয়েছে।`
          : `Welcome! Your ${role} account has been activated.`
      );
      setLoading(false);
      if (role === 'tenant') navigate({ to: '/tenant/dashboard' });
      else navigate({ to: '/landlord/dashboard' });
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 rounded-xl bg-emerald-600 items-center justify-center text-white shadow-md mb-1">
              <Building2 className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {language === 'bn' ? 'ঠিকানায় নতুন অ্যাকাউন্ট খুলুন' : 'Create a Thikana Account'}
            </h1>
            <p className="text-xs text-slate-500">
              {language === 'bn'
                ? 'খুলনায় নিরাপদ বাসা খুঁজতে বা লিস্টিং পোস্ট করতে যোগ দিন'
                : 'Join to discover or list rental homes across Khulna'}
            </p>
          </div>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              {/* Role Selector Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg mb-6">
                <button
                  type="button"
                  onClick={() => setRole('tenant')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-md text-xs font-semibold transition-all ${
                    role === 'tenant'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User className="h-3.5 w-3.5" />
                  <span>{language === 'bn' ? 'আমি ভাড়াটিয়া' : 'I am a Tenant'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('landlord')}
                  className={`flex items-center justify-center gap-2 py-2 rounded-md text-xs font-semibold transition-all ${
                    role === 'landlord'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building className="h-3.5 w-3.5" />
                  <span>{language === 'bn' ? 'আমি বাড়িওয়ালা' : 'I am a Landlord'}</span>
                </button>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'পূর্ণ নাম' : 'Full Name'}
                  </Label>
                  <Input
                    type="text"
                    required
                    placeholder="যেমন: তানভীর আহমেদ"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-sm bg-slate-50 border-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                  </Label>
                  <Input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="text-sm bg-slate-50 border-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
                  </Label>
                  <Input
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-sm bg-slate-50 border-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'পছন্দের এলাকা (খুলনা)' : 'Preferred Khulna Area'}
                  </Label>
                  <select
                    value={preferredLocation}
                    onChange={(e) => setPreferredLocation(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                    {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                  </Label>
                  <Input
                    type="password"
                    required
                    placeholder="কমপক্ষে ৬ অক্ষর"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="text-sm bg-slate-50 border-slate-200"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm shadow-xs"
                >
                  {loading
                    ? language === 'bn'
                      ? 'অ্যাকাউন্ট তৈরি হচ্ছে...'
                      : 'Registering...'
                    : language === 'bn'
                    ? 'নিবন্ধন সম্পন্ন করুন'
                    : 'Complete Registration'}
                </Button>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                {language === 'bn' ? 'ইতিমধ্যে অ্যাকাউন্ট আছে? ' : 'Already have an account? '}
                <Link to="/login" className="font-semibold text-emerald-600 hover:underline">
                  {language === 'bn' ? 'লগইন করুন' : 'Sign In'}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
