import { useState, useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { PropertiesService } from '@/services/api/properties.service';
import { AdminService } from '@/services/api/admin.service';
import { Property, type VerificationBadgeStatus as VerificationStatus } from '@/types/thikana';
import { VerificationBadge } from '@/components/property/VerificationBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BadgeCheck,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  MapPin,
  Building,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/verification')({
  component: AdminVerificationPage,
});

function AdminVerificationPage() {
  const { t, language } = useLanguage();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const res = await PropertiesService.getProperties({ limit: 50 });
      setProperties(res.properties);
    } catch (err) {
      console.error('Failed to load properties', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleToggleBadge = async (
    property: Property,
    badgeKey: keyof VerificationStatus
  ) => {
    const currentStatus = property.verification[badgeKey];
    const newStatus = !currentStatus;

    const updatedVerification: VerificationStatus = {
      ...property.verification,
      [badgeKey]: newStatus,
    };

    try {
      await PropertiesService.updateVerification(property.id, updatedVerification);
      await AdminService.addAuditLog({
        actorName: 'অ্যাডমিন মডারেটর',
        actorRole: 'admin',
        action: 'VERIFICATION_BADGE_TOGGLED',
        entityType: 'Property',
        entityId: property.id,
        details: `Toggled ${badgeKey} to ${newStatus} for property #${property.id} (${property.titleBn})`,
      });

      toast.success(
        language === 'bn'
          ? `যাচাইকরণ ব্যাজ পরিবর্তিত হয়েছে: ${badgeKey} -> ${newStatus ? 'সক্রিয়' : 'নিষ্ক্রিয়'}`
          : `Verification badge updated: ${badgeKey} -> ${newStatus ? 'ON' : 'OFF'}`
      );

      // Local state update
      setProperties((prev) =>
        prev.map((p) =>
          p.id === property.id ? { ...p, verification: updatedVerification } : p
        )
      );
    } catch (err) {
      toast.error('Failed to update verification badge');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <BadgeCheck className="h-3.5 w-3.5" />
            <span>{language === 'bn' ? 'সিমুলেটেড ভেরিফিকেশন কন্ট্রোল' : 'Verification Badges Engine'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'bn' ? 'প্রোপার্টি যাচাইকরণ ব্যাজ ব্যবস্থাপনা' : 'Property Verification Badge Management'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'গবেষণা প্রোটোটাইপের ৩টি মূল যাচাইকরণ প্যারামিটার (ঠিকানা, মালিকানা ও পরিদর্শন) নিয়ন্ত্রণ করুন।'
              : 'Control the 3 academic verification indicators: Address, Ownership, and Physical Inspection.'}
          </p>
        </div>

        {/* Academic Prototype Transparency Alert */}
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800 space-y-1">
            <p className="font-bold">
              {language === 'bn'
                ? 'PRD নিয়ম BR-06 স্বচ্ছতার নোটিশ:'
                : 'PRD BR-06 Transparency Requirement:'}
            </p>
            <p className="leading-relaxed">
              {language === 'bn'
                ? 'এখানে প্রদত্ত যাচাইকরণ ব্যাজসমূহ একাডেমিক গবেষণার অংশ হিসেবে প্ল্যাটফর্ম লেভেলে সিমুলেট করা। কোনো ব্যাজ টগল করা হলে তা সরাসরি অডিট ট্রেইলে যুক্ত হয় এবং পাবলিক সাইটের কার্ড ও ডিটেইল পেজে সাথে সাথে প্রতিফলিত হয়।'
                : 'Badges toggled here are simulated platform indicators designed to evaluate trust and transparency in rental discovery.'}
            </p>
          </div>
        </div>

        {/* Properties Verification Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              {language === 'bn' ? 'তালিকাভুক্ত প্রোপার্টি সমূহ' : 'Listings & Verification Status'}
            </h3>
            <span className="text-xs text-slate-500">{properties.length} properties</span>
          </div>

          <div className="divide-y divide-slate-100">
            {properties.map((prop) => (
              <div
                key={prop.id}
                className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Property Details */}
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-mono">#{prop.id}</span>
                    <VerificationBadge verification={prop.verification} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm truncate">
                    {language === 'bn' ? prop.titleBn : prop.titleEn}
                  </h4>
                  <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span>{prop.address} • Landlord: {prop.landlord.name}</span>
                  </p>
                </div>

                {/* 3 Verification Badges Toggles */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  {/* Badge 1: Address Verified */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleBadge(prop, 'addressVerified')}
                    className={`h-8 text-xs ${
                      prop.verification.addressVerified
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <CheckCircle2
                      className={`h-3.5 w-3.5 mr-1 ${
                        prop.verification.addressVerified ? 'text-emerald-600' : 'text-slate-300'
                      }`}
                    />
                    <span>{language === 'bn' ? 'ঠিকানা যাচাই' : 'Address Verified'}</span>
                  </Button>

                  {/* Badge 2: Ownership Verified */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleBadge(prop, 'ownershipVerified')}
                    className={`h-8 text-xs ${
                      prop.verification.ownershipVerified
                        ? 'bg-blue-50 border-blue-300 text-blue-800 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <CheckCircle2
                      className={`h-3.5 w-3.5 mr-1 ${
                        prop.verification.ownershipVerified ? 'text-blue-600' : 'text-slate-300'
                      }`}
                    />
                    <span>{language === 'bn' ? 'মালিকানা যাচাই' : 'Ownership Verified'}</span>
                  </Button>

                  {/* Badge 3: Physical Inspection */}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleBadge(prop, 'physicalInspection')}
                    className={`h-8 text-xs ${
                      prop.verification.physicalInspection
                        ? 'bg-purple-50 border-purple-300 text-purple-800 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <CheckCircle2
                      className={`h-3.5 w-3.5 mr-1 ${
                        prop.verification.physicalInspection ? 'text-purple-600' : 'text-slate-300'
                      }`}
                    />
                    <span>{language === 'bn' ? 'সরেজমিনে পরিদর্শন' : 'Physical Inspection'}</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
