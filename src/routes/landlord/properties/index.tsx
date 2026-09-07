import { useState, useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { Property, PropertyStatus } from '@/types/thikana';
import { useAuth } from '@/contexts/AuthContext';
import { LandlordLayout } from '@/components/layout/LandlordLayout';
import { PropertiesService } from '@/services/api/properties.service';
import { PropertyStatusBadge } from '@/components/property/PropertyStatusBadge';
import { ApprovalStatusBadge } from '@/components/property/ApprovalStatusBadge';
import { VerificationBadge } from '@/components/property/VerificationBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Building,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sliders,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/landlord/properties/')({
  component: LandlordPropertiesListPage,
});

function LandlordPropertiesListPage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const list = await PropertiesService.getLandlordProperties(user?.id || 'landlord-1');
      setProperties(list);
    } catch (err) {
      console.error('Failed to load landlord properties', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [user]);

  // Handle direct availability toggle
  const handleAvailabilityChange = async (propertyId: string, newStatus: PropertyStatus) => {
    try {
      await PropertiesService.updateAvailabilityStatus(propertyId, newStatus);
      toast.success(
        language === 'bn'
          ? 'প্রোপার্টির প্রাপ্যতা সফলভাবে পরিবর্তিত হয়েছে!'
          : `Availability changed to ${newStatus}`
      );
      loadProperties();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (propertyId: string) => {
    if (confirm(language === 'bn' ? 'আপনি কি নিশ্চিত যে প্রোপার্টিটি মুছে ফেলতে চান?' : 'Are you sure you want to delete this listing?')) {
      await PropertiesService.deleteProperty(propertyId);
      toast.success(language === 'bn' ? 'প্রোপার্টি মুছে ফেলা হয়েছে' : 'Property deleted');
      loadProperties();
    }
  };

  return (
    <LandlordLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
              <Building className="h-3.5 w-3.5" />
              <span>{language === 'bn' ? 'প্রোপার্টি ইনভেন্টরি' : 'Property Management'}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {language === 'bn' ? 'আমার লিস্টিংসহ প্রাপ্যতা নিয়ন্ত্রণ' : 'My Listings & Availability'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {language === 'bn'
                ? 'বাসা ভাড়া হয়ে গেলে বা বুকিং হলে সরাসরি ড্রপডাউন থেকে স্ট্যাটাস আপডেট করুন।'
                : 'Direct landlord control over listing availability to prevent outdated ads.'}
            </p>
          </div>

          <Link to="/landlord/properties/create">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs flex items-center gap-1.5 self-start sm:self-auto shadow-xs">
              <PlusCircle className="h-4 w-4" />
              <span>{language === 'bn' ? 'নতুন প্রোপার্টি যোগ করুন' : 'Add New Listing'}</span>
            </Button>
          </Link>
        </div>

        {/* Listings Table / Cards */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : properties.length === 0 ? (
          <Card className="border-slate-200">
            <CardContent className="p-12 text-center space-y-3">
              <Building className="h-12 w-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                {language === 'bn' ? 'কোনো প্রোপার্টি তালিকাভুক্ত নেই' : 'No properties listed yet'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {language === 'bn'
                  ? 'আপনার বাসা, ফ্ল্যাট বা মেসের তথ্য সরাসরি আপলোড করে অবিলম্বে ভাড়াটিয়াদের কাছে পৌঁছান।'
                  : 'Add your flat or house listing to connect directly with tenants looking in Khulna.'}
              </p>
              <Link to="/landlord/properties/create">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs mt-2">
                  {language === 'bn' ? 'প্রথম প্রোপার্টি যোগ করুন' : 'Create First Listing'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {properties.map((property) => (
              <Card key={property.id} className="border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
                <CardContent className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    <img
                      src={
                        (typeof property.images[0] === 'string'
                          ? property.images[0]
                          : property.images[0]?.url) ||
                        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300'
                      }
                      alt=""
                      className="h-20 w-28 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <ApprovalStatusBadge status={property.approvalStatus} />
                        <VerificationBadge verification={property.verification || property.verifications} />
                      </div>

                      <h3 className="font-bold text-slate-900 text-base truncate">
                        {language === 'bn' ? (property.titleBn || property.title) : (property.titleEn || property.title)}
                      </h3>

                      <p className="text-xs text-slate-500 truncate">{property.address}</p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-0.5">
                        <span className="font-extrabold text-emerald-700 text-sm">৳{(property.rent ?? property.monthlyRent ?? 0).toLocaleString()}</span>
                        <span>•</span>
                        <span>{property.bedrooms} Beds, {property.bathrooms} Baths</span>
                        <span>•</span>
                        <span>{property.sizeSqFt} sq ft</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Direct Availability Control & Actions */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 self-start lg:self-center shrink-0">
                    {/* Direct Availability Dropdown */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {language === 'bn' ? 'প্রাপ্যতা স্ট্যাটাস' : 'Availability'}
                      </span>
                      <select
                        value={property.status}
                        onChange={(e) => handleAvailabilityChange(property.id, e.target.value as PropertyStatus)}
                        className="h-9 px-2.5 rounded-lg border border-slate-200 text-xs font-semibold bg-slate-50 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-colors"
                      >
                        <option value="available">{language === 'bn' ? '🟢 উন্মুক্ত (Available)' : '🟢 Available'}</option>
                        <option value="reserved">{language === 'bn' ? '🟡 বুক করা (Reserved)' : '🟡 Reserved'}</option>
                        <option value="rented">{language === 'bn' ? '🔴 ভাড়া হয়েছে (Rented)' : '🔴 Rented'}</option>
                        <option value="temporarily_unavailable">{language === 'bn' ? '⏸ সাময়িক বন্ধ' : '⏸ Unavailable'}</option>
                        <option value="inactive">{language === 'bn' ? '⚪ নিষ্ক্রিয় (Inactive)' : '⚪ Inactive'}</option>
                      </select>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 pt-4 sm:pt-0">
                      <Link to="/properties/$id" params={{ id: property.id }}>
                        <Button size="sm" variant="outline" className="h-9 px-2.5 text-xs border-slate-300">
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          <span>{language === 'bn' ? 'প্রিভিউ' : 'View'}</span>
                        </Button>
                      </Link>

                      <Link to="/landlord/properties/$id/edit" params={{ id: property.id }}>
                        <Button size="sm" variant="outline" className="h-9 px-2.5 text-xs border-slate-300 text-blue-700 hover:bg-blue-50">
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          <span>{language === 'bn' ? 'এডিট' : 'Edit'}</span>
                        </Button>
                      </Link>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(property.id)}
                        className="h-9 px-2 text-xs text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </LandlordLayout>
  );
}
