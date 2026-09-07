import { useState, useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { Property, ContactRequest, VisitRequest } from '@/types/thikana';
import { useAuth } from '@/contexts/AuthContext';
import { LandlordLayout } from '@/components/layout/LandlordLayout';
import { PropertiesService } from '@/services/api/properties.service';
import { InteractionsService } from '@/services/api/interactions.service';
import { PropertyStatusBadge } from '@/components/property/PropertyStatusBadge';
import { ApprovalStatusBadge } from '@/components/property/ApprovalStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Building,
  PlusCircle,
  Inbox,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const Route = createFileRoute('/landlord/dashboard')({
  component: LandlordDashboardPage,
});

function LandlordDashboardPage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [properties, setProperties] = useState<Property[]>([]);
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [visits, setVisits] = useState<VisitRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const landlordProps = await PropertiesService.getLandlordProperties(user?.id || 'landlord-1');
        setProperties(landlordProps);

        const contactReqs = await InteractionsService.getLandlordContactRequests(user?.id || 'landlord-1');
        setRequests(contactReqs);

        const visitReqs = await InteractionsService.getLandlordVisitRequests(user?.id || 'landlord-1');
        setVisits(visitReqs);
      } catch (err) {
        console.error('Failed to load landlord dashboard data', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [user]);

  const availableCount = properties.filter((p) => p.status === 'available').length;
  const rentedCount = properties.filter((p) => p.status === 'rented').length;

  return (
    <LandlordLayout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
              <span>{language === 'bn' ? 'বাড়িওয়ালা কন্ট্রোল প্যানেল' : 'Landlord Portal'}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {language === 'bn'
                ? `স্বাগতম, ${user?.name || 'হাসান মাহমুদ'}`
                : `Welcome, ${user?.name || 'Hasan Mahmud'}`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {language === 'bn'
                ? 'আপনার প্রোপার্টির প্রাপ্যতা, ভাড়াটিয়ার ইনকোয়ারি ও ভিজিট শিডিউল পরিচালনা করুন।'
                : 'Manage availability statuses, tenant inquiries, and scheduled visits in real-time.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/landlord/properties/create">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs flex items-center gap-1.5 shadow-xs">
                <PlusCircle className="h-4 w-4" />
                <span>{language === 'bn' ? 'নতুন প্রোপার্টি যোগ করুন' : 'Add New Property'}</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/landlord/properties">
            <Card className="border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
              <CardContent className="p-4 sm:p-5 flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <Building className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium">
                    {language === 'bn' ? 'মোট লিস্টিং' : 'Total Listings'}
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-slate-900">{properties.length}</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/landlord/properties">
            <Card className="border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
              <CardContent className="p-4 sm:p-5 flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium">
                    {language === 'bn' ? 'উন্মুক্ত বাসা' : 'Available'}
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-emerald-700">{availableCount}</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/landlord/requests">
            <Card className="border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
              <CardContent className="p-4 sm:p-5 flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Inbox className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium">
                    {language === 'bn' ? 'ইনকোয়ারি রিকোয়েস্ট' : 'Inquiries'}
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-slate-900">{requests.length}</p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/landlord/visits">
            <Card className="border-slate-200 shadow-xs hover:border-purple-300 transition-colors">
              <CardContent className="p-4 sm:p-5 flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 font-medium">
                    {language === 'bn' ? 'ভিজিট শিডিউল' : 'Visit Requests'}
                  </p>
                  <p className="text-lg sm:text-xl font-bold text-slate-900">{visits.length}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* My Properties Mini Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-600" />
              <span>{language === 'bn' ? 'আপনার প্রোপার্টি তালিকা' : 'My Listings Overview'}</span>
            </h2>
            <Link to="/landlord/properties">
              <span className="text-xs font-semibold text-blue-600 hover:underline">
                {language === 'bn' ? 'সবগুলো পরিচালনা করুন' : 'Manage All'}
              </span>
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="divide-y divide-slate-100">
              {properties.slice(0, 3).map((prop) => (
                <div key={prop.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={(typeof prop.images[0] === 'string' ? prop.images[0] : prop.images[0]?.url) || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=200'}
                      alt=""
                      className="h-12 w-16 rounded-lg object-cover bg-slate-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {language === 'bn' ? prop.titleBn : prop.titleEn}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">{prop.address}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-extrabold text-emerald-700">৳{(prop.rent ?? prop.monthlyRent ?? 0).toLocaleString()}</span>
                        <PropertyStatusBadge status={prop.status || prop.availabilityStatus} />
                        <ApprovalStatusBadge status={prop.approvalStatus} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <Link to="/properties/$id" params={{ id: prop.id }}>
                      <Button size="sm" variant="outline" className="h-7 text-xs border-slate-300">
                        <Eye className="h-3 w-3 mr-1" />
                        <span>{language === 'bn' ? 'প্রিভিউ' : 'View'}</span>
                      </Button>
                    </Link>
                    <Link to="/landlord/properties/$id/edit" params={{ id: prop.id }}>
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-blue-700 hover:bg-blue-50">
                        {language === 'bn' ? 'সম্পাদনা' : 'Edit'}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Inquiries & Visits Mini Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Inquiries */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Inbox className="h-4 w-4 text-amber-600" />
                <span>{language === 'bn' ? 'সাম্প্রতিক ইনকোয়ারি' : 'Recent Inquiries'}</span>
              </h3>
              <Link to="/landlord/requests">
                <span className="text-xs font-medium text-blue-600 hover:underline">
                  {language === 'bn' ? 'সব ইনকোয়ারি' : 'View All'}
                </span>
              </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
              {requests.slice(0, 3).map((req) => (
                <div key={req.id} className="p-3.5 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{req.tenantName}</span>
                    <span className="text-[10px] text-slate-400">{req.createdAt}</span>
                  </div>
                  <p className="text-slate-600 line-clamp-1">{req.message}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-blue-700 font-medium">{req.tenantPhone}</span>
                    <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200">
                      {req.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scheduled Visits */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-600" />
                <span>{language === 'bn' ? 'আসন্ন ভিজিট শিডিউল' : 'Scheduled Visits'}</span>
              </h3>
              <Link to="/landlord/visits">
                <span className="text-xs font-medium text-blue-600 hover:underline">
                  {language === 'bn' ? 'সব ভিজিট' : 'View All'}
                </span>
              </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
              {visits.slice(0, 3).map((v) => (
                <div key={v.id} className="p-3.5 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{v.tenantName}</span>
                    <span className="text-[10px] text-purple-700 font-semibold">{v.date} • {v.time}</span>
                  </div>
                  <p className="text-slate-600 truncate">{v.propertyTitle}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">{v.tenantPhone}</span>
                    <Badge variant="outline" className="text-[10px] bg-purple-50 text-purple-700 border-purple-200">
                      {v.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LandlordLayout>
  );
}
