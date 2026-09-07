import type {
  Property as ThikanaProperty,
  PropertyTypeSlug,
  AvailabilityStatus,
  ApprovalStatus as ThikanaApprovalStatus,
  CommunityNote as ThikanaCommunityNote,
  Review as ThikanaReview,
} from './thikana';

export type PropertyStatus = AvailabilityStatus;
export type ApprovalStatus = ThikanaApprovalStatus;

export interface VerificationStatus {
  addressVerified: boolean;
  ownershipVerified: boolean;
  physicalInspection: boolean;
}

export interface PropertyLandlord {
  id: string;
  name: string;
  phone: string;
}

export type Property = ThikanaProperty;

export interface PropertyFilterState {
  location?: string | undefined;
  propertyType?: string | undefined;
  minRent?: number | undefined;
  maxRent?: number | undefined;
  bedrooms?: number | undefined;
  bathrooms?: number | undefined;
  amenities?: string[] | undefined;
  verifiedOnly?: boolean | undefined;
  availableOnly?: boolean | undefined;
  category?: string | undefined;
  q?: string | undefined;
}

export interface Review {
  id: string;
  propertyId: string;
  userId?: string | undefined;
  userName?: string | undefined;
  authorName?: string | undefined;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CommunityNote {
  id: string;
  locationArea?: string | undefined;
  area?: string | undefined;
  locationId?: string | undefined;
  authorName?: string | undefined;
  author?: string | undefined;
  submittedBy?: string | undefined;
  category?: any;
  note?: string | undefined;
  contentBn?: string | undefined;
  contentEn?: string | undefined;
  upvotes?: number | undefined;
  downvotes?: number | undefined;
  date?: string | undefined;
  createdAt?: string | undefined;
}

export interface ContactRequest {
  id: string;
  propertyId: string;
  tenantName: string;
  tenantPhone: string;
  tenantEmail?: string | undefined;
  message: string;
  createdAt: string;
  status: 'pending' | 'contacted' | 'closed' | 'accepted' | 'declined';
}

export interface VisitRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  tenantId?: string | undefined;
  tenantName: string;
  tenantPhone: string;
  landlordId?: string | undefined;
  date?: string | undefined;
  time?: string | undefined;
  preferredDate?: string | undefined;
  preferredTime?: string | undefined;
  notes?: string | undefined;
  tenantNote?: string | undefined;
  landlordNote?: string | undefined;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'requested' | 'accepted' | 'cancelled';
  createdAt: string;
}

export interface PropertyReport {
  id: string;
  propertyId: string;
  propertyTitle: string;
  reporterId?: string | undefined;
  reporterName: string;
  reporterPhone?: string | undefined;
  reason: string;
  description?: string | undefined;
  details?: string | undefined;
  createdAt: string;
  status: 'open' | 'under_review' | 'resolved' | 'rejected';
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole?: 'tenant' | 'landlord' | undefined;
  content: string;
  message?: string | undefined;
  timestamp?: string | undefined;
  createdAt?: string | undefined;
}

export interface Conversation {
  id: string;
  propertyId: string;
  propertyTitle: string;
  tenantId: string;
  tenantName: string;
  landlordId: string;
  landlordName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number | undefined;
}
