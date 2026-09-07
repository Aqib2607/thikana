import { useState, useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { PropertiesService } from '@/services/api/properties.service';
import { Property, ApprovalStatus, PropertyStatus } from '@/types/thikana';
import { PropertyStatusBadge } from '@/components/property/PropertyStatusBadge';
import { ApprovalStatusBadge } from '@/components/property/ApprovalStatusBadge';
import { VerificationBadge } from '@/components/property/VerificationBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Eye, Trash2, MapPin, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/properties')({
  component: AdminPropertiesListPage,
});

function AdminPropertiesListPage() {
  const { t, language } = useLanguage();

  const [properties, setProperties] = useState<Property[]>([]);
  const [filterApproval, setFilterApproval] = useState<string>('all');
  const [filterAvailability, setFilterAvailability] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const loadProperties = async () => {
    setLoading(true);
    try {
      const res = await PropertiesService.getProperties({ limit: 100 });
      setProperties(res.properties);
    } catch (err) {
      console.error('Failed to load all properties', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleDelete = async (propertyId: string) => {
    if (confirm(language === 'bn' ? 'প্রোপার্টিটি স্থায়ীভাবে মুছে ফেলতে চান?' : 'Permanently delete this listing?')) {
      await PropertiesService.deleteProperty(propertyId);
      toast.success(language === 'bn' ? 'প্রোপার্টি মুছে ফেলা হয়েছে' : 'Property deleted');
      loadProperties();
    }
  };

  const filteredProperties = properties.filter((p) => {
    if (filterApproval !== 'all' && p.approvalStatus !== filterApproval) return false;
    if (filterAvailability !== 'all' && p.status !== filterAvailability) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        (p.titleBn || p.title || '').toLowerCase().includes(q) ||
        (p.titleEn || p.title || '').toLowerCase().includes(q) ||
        (p.address || p.location?.address || '').toLowerCase().includes(q) ||
        (p.landlord?.name || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 uppercase tracking-wider mb-1">
              <Building className="h-3.5 w-3.5" />
              <span>{language === 'bn' ? 'মাস্টার ইনভেন্টরি' : 'Master Database'}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {language === 'bn' ? 'প্ল্যাটফর্মের সকল প্রোপার্টি তালিকা' : 'All Platform Properties'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {language === 'bn'
                ? 'অনুমোদন ও প্রাপ্যতা ফিল্টার করে যেকোনো প্রোপার্টি নিরীক্ষা করুন।'
                : 'Inspect, moderate, or remove listings across all landlords and Khulna areas.'}
            </p>
          </div>

          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg self-start sm:self-auto">
            {filteredProperties.length} / {properties.length} {language === 'bn' ? 'টি প্রোপার্টি' : 'listings'}
          </span>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder={language === 'bn' ? 'শিরোনাম, ঠিকানা বা বাড়িওয়ালার নাম...' : 'Search by title, address or landlord...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs bg-slate-50 border-slate-200"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filterApproval}
              onChange={(e) => setFilterApproval(e.target.value)}
              className="h-9 px-2.5 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-800"
            >
              <option value="all">{language === 'bn' ? 'সকল অনুমোদন স্ট্যাটাস' : 'All Approval Statuses'}</option>
              <option value="approved">Approved</option>
              <option value="submitted">Submitted</option>
              <option value="draft">Draft</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value)}
              className="h-9 px-2.5 rounded-lg border border-slate-200 text-xs bg-slate-50 text-slate-800"
            >
              <option value="all">{language === 'bn' ? 'সকল প্রাপ্যতা স্ট্যাটাস' : 'All Availabilities'}</option>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="rented">Rented</option>
              <option value="temporarily_unavailable">Unavailable</option>
            </select>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredProperties.length === 0 ? (
          <Card className="border-slate-200">
            <CardContent className="p-8 text-center text-xs text-slate-400">
              {language === 'bn' ? 'কোনো প্রোপার্টি পাওয়া যায়নি' : 'No matching properties found'}
            </CardContent>
          </Card>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
            {filteredProperties.map((prop) => (
              <div key={prop.id} className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-slate-400">#{prop.id}</span>
                    <ApprovalStatusBadge status={prop.approvalStatus} />
                    <PropertyStatusBadge status={prop.status || prop.availabilityStatus} />
                    <VerificationBadge verification={prop.verification || prop.verifications} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm truncate">{prop.titleBn || prop.title}</h4>
                  <p className="text-slate-500 truncate flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
                    <span>{prop.address || prop.location?.address} • Landlord: {prop.landlord.name} {prop.landlord.phone ? `(${prop.landlord.phone})` : ''}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 self-start lg:self-center shrink-0">
                  <span className="font-extrabold text-emerald-700 text-sm">৳{(prop.rent ?? prop.monthlyRent ?? 0).toLocaleString()}</span>
                  <Link to="/properties/$id" params={{ id: prop.id }}>
                    <Button size="sm" variant="outline" className="h-7 text-xs border-slate-300">
                      <Eye className="h-3 w-3 mr-1" />
                      <span>{language === 'bn' ? 'দেখুন' : 'View'}</span>
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(prop.id)}
                    className="h-7 text-xs text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
