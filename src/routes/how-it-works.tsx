import { createFileRoute, Link } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import {
  Search,
  SlidersHorizontal,
  Scale,
  Heart,
  MessageSquare,
  CalendarCheck,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

export const Route = createFileRoute('/how-it-works')({
  component: HowItWorksPage,
});

function HowItWorksPage() {
  const { t, language } = useLanguage();

  const steps = [
    {
      num: '১',
      numEn: '1',
      titleBn: 'খুলনার এলাকা ও বাজেট অনুযায়ী সার্চ করুন',
      titleEn: 'Search by Khulna Location & Budget',
      descBn:
        'সোনাডাঙ্গা, খালিশপুর, বয়রা বা কুয়েট এলাকা নির্বাচন করুন। আপনার বাজেট, বেডরুম ও সুবিধার ফিল্টার প্রয়োগ করে কাঙ্ক্ষিত বাসা সহজেই খুঁজে নিন।',
      descEn:
        'Select your preferred area in Khulna. Filter by budget, bedroom count, and desired amenities to find relevant homes instantly.',
      icon: Search,
      color: 'bg-emerald-100 text-emerald-800',
    },
    {
      num: '২',
      numEn: '2',
      titleBn: 'স্বচ্ছ নিয়ম-ভিত্তিক ম্যাচ স্কোরিং (৬টি ফ্যাক্টর)',
      titleEn: 'Deterministic 6-Factor Match Scoring',
      descBn:
        'ঠিকানা প্ল্যাটফর্ম কোনো অস্পষ্ট বা মনগড়া AI ব্যবহার করে না। অবস্থান (৩০%), বাজেট (২৫%), ধরন (১৫%), সুবিধাসমূহ (১৫%), রুম (১০%) ও প্রাপ্যতা (৫%)—এর মাধ্যমে নিখুঁত সামঞ্জস্য হিসেব করা হয়।',
      descEn:
        'Thikana uses explainable rule-based logic: Location (30%), Budget (25%), Type (15%), Amenities (15%), Rooms (10%), and Availability (5%).',
      icon: SlidersHorizontal,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      num: '৩',
      numEn: '3',
      titleBn: 'পাশাপাশি ৩টি প্রোপার্টি তুলনা করুন',
      titleEn: 'Side-by-Side Comparison (Up to 3)',
      descBn:
        'একাধিক বাসার মধ্যে দ্বিধায় আছেন? ৩টি বাসা একসাথে পাশাপাশি রেখে তাদের ভাড়া, সার্ভিস চার্জ, ফ্লোর, গ্যাস ও পানির সুবিধা সরাসরি তুলনা করুন।',
      descEn:
        'Confused between multiple flats? Compare rent, service charge, floor level, utilities, and match scores side-by-side.',
      icon: Scale,
      color: 'bg-purple-100 text-purple-800',
    },
    {
      num: '৪',
      numEn: '4',
      titleBn: 'প্রিয় তালিকা সংরক্ষণ করুন',
      titleEn: 'Bookmark Your Favorite Properties',
      descBn:
        'পছন্দের বাসাগুলোকে ফেভারিট তালিকায় সেভ করে রাখুন যাতে পরবর্তীতে সহজে খুঁজে পান এবং বাড়িওয়ালা কোনো তথ্য বা স্ট্যাটাস পরিবর্তন করলে লক্ষ্য রাখতে পারেন।',
      descEn:
        'Bookmark your top choices in your favorites list to monitor availability updates and compare later with ease.',
      icon: Heart,
      color: 'bg-rose-100 text-rose-800',
    },
    {
      num: '৫',
      numEn: '5',
      titleBn: 'বাড়িওয়ালার সাথে সরাসরি যোগাযোগ',
      titleEn: 'Direct Landlord Communication',
      descBn:
        'কোনো মধ্যস্থতাকারী বা দালাল ছাড়া সরাসরি প্ল্যাটফর্মের মেসেজিং সিস্টেম ব্যবহার করে বাড়িওয়ালার সাথে কথা বলুন এবং প্রোপার্টির খুঁটিনাটি জেনে নিন।',
      descEn:
        'Zero brokers. Communicate directly with property owners via Thikana’s built-in inquiry and chat system.',
      icon: MessageSquare,
      color: 'bg-amber-100 text-amber-800',
    },
    {
      num: '৬',
      numEn: '6',
      titleBn: 'সুবিধাজনক সময়ে ভিজিট রিকোয়েস্ট পাঠান',
      titleEn: 'Schedule an On-site Inspection Visit',
      descBn:
        'বাসাটি সরাসরি দেখার জন্য আপনার সুবিধাজনক তারিখ ও সময় উল্লেখ করে বাড়িওয়ালাকে ভিজিট রিকোয়েস্ট পাঠান। বাড়িওয়ালা তা গ্রহণ করলে নোটিফিকেশন পাবেন।',
      descEn:
        'Submit a visit request with your preferred inspection date and time. Get confirmed appointments directly.',
      icon: CalendarCheck,
      color: 'bg-teal-100 text-teal-800',
    },
    {
      num: '৭',
      numEn: '7',
      titleBn: 'বাড়িওয়ালার সরাসরি প্রাপ্যতা নিয়ন্ত্রণ',
      titleEn: 'Direct Landlord Availability Control',
      descBn:
        'বাসা বুক বা ভাড়া হয়ে যাওয়া মাত্র বাড়িওয়ালা তাৎক্ষণিকভাবে স্ট্যাটাস পরিবর্তন করেন, ফলে ভাড়াটিয়াদের সময় নষ্ট হয় না।',
      descEn:
        'Property owners have direct control over listing status (Available, Reserved, Rented), preventing dead leads and outdated ads.',
      icon: CheckCircle2,
      color: 'bg-indigo-100 text-indigo-800',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      {/* Header */}
      <section className="bg-white border-b border-slate-200 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-semibold">
            <HelpCircle className="h-4 w-4 text-emerald-600" />
            <span>{language === 'bn' ? 'ঠিকানা ব্যবহারের সহজ নির্দেশিকা' : 'How Thikana Works'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {language === 'bn'
              ? 'কীভাবে ঠিকানা ব্যবহার করে সহজে বাসা খুঁজবেন ও ভাড়া দেবেন?'
              : 'How to Discover and Rent Homes with Confidence'}
          </h1>
          <p className="text-slate-600 text-base max-w-2xl mx-auto leading-relaxed">
            {language === 'bn'
              ? 'স্বচ্ছতা, নিয়ম-ভিত্তিক ফিল্টারিং এবং সরাসরি বাড়িওয়ালা যোগাযোগের মাধ্যমে খুলনায় নিরাপদ বাসা খোঁজার ৭টি ধাপ।'
              : '7 simple steps to discover, evaluate, and secure verified rental housing in Khulna with complete transparency.'}
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start gap-6"
              >
                {/* Step Number & Icon */}
                <div className="flex sm:flex-col items-center gap-3 shrink-0">
                  <span className="h-8 w-8 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center">
                    {language === 'bn' ? step.num : step.numEn}
                  </span>
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${step.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                    {language === 'bn' ? step.titleBn : step.titleEn}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {language === 'bn' ? step.descBn : step.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Academic Disclaimer & Callout */}
      <section className="py-12 bg-amber-50/60 border-y border-amber-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <div className="inline-flex items-center gap-2 text-amber-900 font-bold text-sm">
            <ShieldCheck className="h-5 w-5 text-amber-600" />
            <span>{language === 'bn' ? 'একাডেমিক প্রোটোটাইপ নোট' : 'Academic Prototype Scope Note'}</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-800 leading-relaxed max-w-2xl mx-auto">
            {language === 'bn'
              ? 'ঠিকানা প্ল্যাটফর্মটি একটি গবেষণা ও শিক্ষামূলক ওয়েব অ্যাপ্লিকেশন। এখানে প্রদর্শিত প্রোপার্টি ভেরিফিকেশন ব্যাজসমূহ এবং ম্যাচ স্কোরিং বাস্তবায়ন পরীক্ষা করার উদ্দেশ্যে প্ল্যাটফর্ম লেভেলে সিমুলেট করা হয়েছে।'
              : 'Thikana is developed as an academic and research prototype. Verification badges, audit logs, and matching evaluations are simulated at platform level for demonstration and defense.'}
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-white text-center">
        <div className="max-w-xl mx-auto px-4 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">
            {language === 'bn' ? 'বাসা খোঁজা শুরু করতে প্রস্তুত?' : 'Ready to find your rental home?'}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/properties">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6">
                {language === 'bn' ? 'প্রোপার্টি খুঁজুন' : 'Browse Properties'}
              </Button>
            </Link>
            <Link to="/landlord/properties/create">
              <Button variant="outline" className="border-slate-300">
                {language === 'bn' ? 'বাড়িওয়ালা হিসেবে লিস্টিং করুন' : 'List as Landlord'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
