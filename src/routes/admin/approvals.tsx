import { useState, useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { PropertiesService } from '@/services/api/properties.service';
import { AdminService } from '@/services/api/admin.service';
import { Property } from '@/types/thikana';
import { ApprovalStatusBadge } from '@/components/property/ApprovalStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  Eye,
  Building,
  User,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/admin/approvals')({
  component: AdminApprovalsPage,
});

function AdminApprovalsPage() {
  const { t, language } = useLanguage();

  const [pendingProperties, setPendingProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Rejection dialog state
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [targetPropertyId, setTargetPropertyId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const loadPending = async () => {
    setLoading(true);
    try {
      const list = await PropertiesService.getPendingProperties();
      setPendingProperties(list);
    } catch (err) {
      console.error('Failed to load pending properties', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  const handleApprove = async (property: Property) => {
    try {
      await PropertiesService.updateApprovalStatus(property.id, 'approved');
      await AdminService.addAuditLog({
        actorName: 'অ্যাডমিন মডারেটর',
        actorRole: 'admin',
        action: 'PROPERTY_APPROVED',
        entityType: 'Property',
        entityId: property.id,
        details: `Approved property: ${property.titleBn} in ${property.address}`,
      });

      toast.success(
        language === 'bn'
          ? 'প্রোপার্টি সফলভাবে অনুমোদিত হয়েছে!'
          : 'Property listing approved!'
      );
      loadPending();
    } catch (err) {
      toast.error('Failed to approve listing');
    }
  };

  const handleOpenReject = (propertyId: string) => {
    setTargetPropertyId(propertyId);
    setRejectReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!targetPropertyId) return;
    try {
      await PropertiesService.updateApprovalStatus(
        targetPropertyId,
        'rejected',
        rejectReason || 'তথ্য অসম্পূর্ণ বা অস্পষ্ট'
      );
      await AdminService.addAuditLog({
        actorName: 'অ্যাডমিন মডারেটর',
        actorRole: 'admin',
        action: 'PROPERTY_REJECTED',
        entityType: 'Property',
        entityId: targetPropertyId,
        details: `Rejected listing with reason: ${rejectReason || 'Incomplete details'}`,
      });

      toast.info(
        language === 'bn' ? 'লিস্টিংটি প্রত্যাখ্যান করা হয়েছে' : 'Listing has been rejected'
      );
      setRejectModalOpen(false);
      loadPending();
    } catch (err) {
      toast.error('Failed to reject listing');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 uppercase tracking-wider mb-1">
            <CheckSquare className="h-3.5 w-3.5" />
            <span>{language === 'bn' ? 'অনুমোদন কিউ' : 'Approvals Queue'}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'bn' ? 'নতুন প্রোপার্টি অনুমোদন ও পর্যালোচনা' : 'Listing Verification & Approvals'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {language === 'bn'
              ? 'বাড়িওয়ালাদের দাখিলকৃত নতুন লিস্টিং পাবলিক সাইটে উন্মুক্ত করার আগে নিরীক্ষা করুন।'
              : 'Review submitted listings before making them publicly discoverable.'}
          </p>
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : pendingProperties.length === 0 ? (
          <Card className="border-slate-200">
            <CardContent className="p-12 text-center space-y-3">
              <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                {language === 'bn' ? 'কোনো অপেক্ষমাণ লিস্টিং নেই' : 'All clear! No pending approvals'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'bn'
                  ? 'সকল দাখিলকৃত প্রোপার্টি পর্যালোচনা করা হয়েছে।'
                  : 'All submitted properties have been processed.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingProperties.map((property) => (
              <Card key={property.id} className="border-slate-200 shadow-xs">
                <CardContent className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left: Thumbnail & Data */}
                  <div className="flex items-start sm:items-center gap-4 min-w-0">
                    <img
                      src={(typeof property.images[0] === 'string' ? property.images[0] : property.images[0]?.url) || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300'}
                      alt=""
                      className="h-20 w-28 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <ApprovalStatusBadge status={property.approvalStatus} />
                        <span className="text-xs text-slate-400 font-mono">ID: #{property.id}</span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-base truncate">
                        {language === 'bn' ? property.titleBn : property.titleEn}
                      </h3>

                      <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>{property.address}</span>
                      </p>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                        <span className="font-bold text-emerald-700">৳{(property.rent ?? property.monthlyRent ?? 0).toLocaleString()}</span>
                        <span>•</span>
                        <span>{property.bedrooms} Beds, {property.bathrooms} Baths</span>
                        <span>•</span>
                        <span>{property.sizeSqFt} sq ft</span>
                        <span>•</span>
                        <span className="text-blue-700 font-medium">Landlord: {property.landlord.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Approve / Reject / Preview */}
                  <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
                    <Link to="/properties/$id" params={{ id: property.id }}>
                      <Button size="sm" variant="outline" className="h-8 text-xs border-slate-300">
                        <Eye className="h-3.5 w-3.5 mr-1" />
                        <span>{language === 'bn' ? 'প্রিভিউ' : 'Preview'}</span>
                      </Button>
                    </Link>

                    <Button
                      size="sm"
                      onClick={() => handleApprove(property)}
                      className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      <span>{language === 'bn' ? 'অনুমোদন করুন' : 'Approve'}</span>
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenReject(property.id)}
                      className="h-8 text-xs text-rose-600 hover:bg-rose-50"
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1" />
                      <span>{language === 'bn' ? 'প্রত্যাখ্যান' : 'Reject'}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Reject Reason Modal */}
        <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-slate-900">
                {language === 'bn' ? 'লিস্টিং প্রত্যাখ্যানের কারণ' : 'Reason for Rejection'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <p className="text-slate-600">
                {language === 'bn'
                  ? 'বাড়িওয়ালাকে জানানোর জন্য কারণ উল্লেখ করুন (যেমন: অসম্পূর্ণ ঠিকানা বা ভুয়া ছবি):'
                  : 'Please specify the reason to be sent to the landlord:'}
              </p>
              <textarea
                rows={3}
                placeholder="যেমন: প্রোপার্টির সঠিক ঠিকানা ও স্পষ্ট ছবি প্রয়োজন..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRejectModalOpen(false)}
                className="text-xs"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleConfirmReject}
                className="text-xs"
              >
                {language === 'bn' ? 'প্রত্যাখ্যান নিশ্চিত করুন' : 'Confirm Rejection'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
