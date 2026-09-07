import { useState } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Building2, User, Building, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const { t, language } = useLanguage();
  const { login, setPersona, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('tanvir@thikana.local');
  const [password, setPassword] = useState('••••••••');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email, password);
      toast.success(
        language === 'bn'
          ? 'সফলভাবে লগইন হয়েছে!'
          : 'Logged in successfully!'
      );
      setLoading(false);
      navigate({ to: '/' });
    }, 400);
  };

  const handleQuickSwitch = (persona: 'tenant' | 'landlord' | 'admin') => {
    setPersona(persona);
    toast.success(
      language === 'bn'
        ? `ডেমো মোড: ${persona} অ্যাকাউন্টে প্রবেশ করেছেন!`
        : `Switched to ${persona} demo persona!`
    );
    if (persona === 'tenant') navigate({ to: '/tenant/dashboard' });
    if (persona === 'landlord') navigate({ to: '/landlord/dashboard' });
    if (persona === 'admin') navigate({ to: '/admin/dashboard' });
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
              {language === 'bn' ? 'ঠিকানা অ্যাকাউন্টে লগইন করুন' : 'Sign In to Thikana'}
            </h1>
            <p className="text-xs text-slate-500">
              {language === 'bn'
                ? 'আপনার পছন্দের বাসা পরিচালনা অথবা লিস্টিং ম্যানেজ করুন'
                : 'Manage your saved preferences, inquiries, and properties'}
            </p>
          </div>

          {/* Quick Demo Persona Switcher Banner */}
          <Card className="border-emerald-200 bg-emerald-50/50 shadow-xs">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                <span>{language === 'bn' ? 'ডেমো দ্রুত লগইন (১-ক্লিক)' : 'Demo 1-Click Login'}</span>
              </div>
              <CardDescription className="text-[11px] text-emerald-800">
                {language === 'bn'
                  ? 'প্রোটোটাইপ পর্যালোচনার জন্য যেকোনো ভূমিকায় সরাসরি প্রবেশ করুন:'
                  : 'Select any role to test platform capabilities instantly:'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-1 grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickSwitch('tenant')}
                className="h-14 flex flex-col items-center justify-center p-1 bg-white border-emerald-200 hover:bg-emerald-100/50 text-slate-800"
              >
                <User className="h-4 w-4 text-emerald-600 mb-0.5" />
                <span className="text-xs font-semibold">{language === 'bn' ? 'ভাড়াটিয়া' : 'Tenant'}</span>
                <span className="text-[9px] text-slate-400">Tanvir</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickSwitch('landlord')}
                className="h-14 flex flex-col items-center justify-center p-1 bg-white border-blue-200 hover:bg-blue-100/50 text-slate-800"
              >
                <Building className="h-4 w-4 text-blue-600 mb-0.5" />
                <span className="text-xs font-semibold">{language === 'bn' ? 'বাড়িওয়ালা' : 'Landlord'}</span>
                <span className="text-[9px] text-slate-400">Hasan</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickSwitch('admin')}
                className="h-14 flex flex-col items-center justify-center p-1 bg-white border-purple-200 hover:bg-purple-100/50 text-slate-800"
              >
                <ShieldCheck className="h-4 w-4 text-purple-600 mb-0.5" />
                <span className="text-xs font-semibold">{language === 'bn' ? 'অ্যাডমিন' : 'Admin'}</span>
                <span className="text-[9px] text-slate-400">Moderator</span>
              </Button>
            </CardContent>
          </Card>

          {/* Standard Form */}
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">
                    {language === 'bn' ? 'ইমেইল বা মোবাইল নম্বর' : 'Email or Phone'}
                  </Label>
                  <Input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="text-sm bg-slate-50 border-slate-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-slate-700">
                      {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                    </Label>
                    <span className="text-[11px] text-emerald-600 hover:underline cursor-pointer">
                      {language === 'bn' ? 'ভুলে গেছেন?' : 'Forgot?'}
                    </span>
                  </div>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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
                      ? 'লগইন হচ্ছে...'
                      : 'Signing in...'
                    : language === 'bn'
                    ? 'লগইন করুন'
                    : 'Sign In'}
                </Button>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                {language === 'bn' ? 'অ্যাকাউন্ট নেই? ' : "Don't have an account? "}
                <Link to="/register" className="font-semibold text-emerald-600 hover:underline">
                  {language === 'bn' ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'Sign Up Free'}
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
