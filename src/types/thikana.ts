/**
 * Frontend domain models for Thikana.
 * These mirror the Database Architecture Document but stay frontend-only DTOs.
 */

export type UserRole = "tenant" | "landlord" | "admin";

export type AvailabilityStatus =
  | "available"
  | "reserved"
  | "rented"
  | "temporarily_unavailable"
  | "inactive";

export type PropertyStatus = AvailabilityStatus;

export type ApprovalStatus = "draft" | "submitted" | "approved" | "rejected";

export type FurnishedStatus = "unfurnished" | "semi_furnished" | "furnished";

export type PropertyTypeSlug =
  | "room"
  | "sublet"
  | "bachelor"
  | "apartment"
  | "house"
  | "commercial";

export type VerificationType = "owner_identity" | "phone" | "availability" | "documents" | "ownership" | "physical_inspection";

export type VerificationStatus = "pending" | "verified" | "rejected";

export interface PropertyVerification {
  type: VerificationType | string;
  status: VerificationStatus | string;
  verifiedAt?: string | undefined;
}

export interface PropertyLocation {
  division: string;
  district: string;
  city: string;
  area: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface PropertyImage {
  id: string;
  url: string;
  isMain: boolean;
  alt: string;
}

export interface Landlord {
  id: string;
  name: string;
  memberSince: string;
  phoneVerified: boolean;
  responseRateLabel?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
}

export interface Review {
  id: string;
  propertyId: string;
  authorName: string;
  userName?: string | undefined;
  userId?: string | undefined;
  rating: number;
  comment: string;
  createdAt: string;
}

export type CommunityCategory =
  | "transport"
  | "waterlogging"
  | "internet"
  | "noise"
  | "safety"
  | "general";

export interface CommunityNote {
  id: string;
  locationArea?: string | undefined;
  area?: string | undefined;
  locationId?: string | undefined;
  authorName?: string | undefined;
  author?: string | undefined;
  submittedBy?: string | undefined;
  category: CommunityCategory;
  note: string;
  contentBn?: string | undefined;
  contentEn?: string | undefined;
  upvotes?: number | undefined;
  downvotes?: number | undefined;
  date?: string | undefined;
  createdAt: string;
}

export interface MatchFactor {
  key: "location" | "budget" | "property_type" | "rooms" | "room_bathroom" | "amenities" | "availability";
  earned: number;
  weight: number;
}

export interface MatchResult {
  score: number;
  factors: MatchFactor[];
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
  status: "open" | "under_review" | "resolved" | "rejected";
  createdAt: string;
}

export interface Property {
  id: string;
  title: string;
  titleBn?: string | undefined;
  titleEn: string;
  type: PropertyTypeSlug;
  propertyType?: PropertyTypeSlug | string | undefined;
  description: string;
  descriptionBn?: string | undefined;
  descriptionEn?: string | undefined;
  rent?: number | undefined;
  monthlyRent?: number | undefined;
  advance?: number | undefined;
  additionalCharges?: number | undefined;
  serviceChargeMonthly?: number | undefined;
  serviceCharge?: number | undefined;
  depositAmount?: number | undefined;
  securityDeposit?: number | undefined;
  negotiable?: boolean | undefined;
  address?: string | undefined;
  bedrooms?: number | undefined;
  rooms?: number | undefined;
  bathrooms: number;
  floor: number;
  floorNumber?: number | undefined;
  totalFloors: number;
  sizeSqft: number;
  sizeSqFt?: number | undefined;
  furnished: FurnishedStatus;
  parking: boolean;
  balcony: boolean;
  balconies?: number | undefined;
  electricity: boolean;
  water: boolean;
  gas: boolean;
  internet: boolean;
  amenities?: string[] | undefined;
  rules?: string[] | undefined;
  coordinates?: { lat: number; lng: number } | undefined;
  availabilityStatus: AvailabilityStatus;
  status?: AvailabilityStatus | undefined;
  approvalStatus: ApprovalStatus;
  availableFrom: string;
  location: PropertyLocation;
  images: PropertyImage[];
  verifications: PropertyVerification[];
  verification?: any;
  landlord: Landlord;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  match?: MatchResult | undefined;
  rejectionReason?: string | undefined;
}

export type PropertySort = "relevance" | "newest" | "rent_asc" | "rent_desc";

export interface PropertyFilters {
  q?: string | undefined;
  division?: string | undefined;
  district?: string | undefined;
  city?: string | undefined;
  area?: string | undefined;
  type?: PropertyTypeSlug | undefined;
  minRent?: number | undefined;
  maxRent?: number | undefined;
  rooms?: number | undefined;
  bathrooms?: number | undefined;
  availableFrom?: string | undefined;
  furnished?: FurnishedStatus | undefined;
  parking?: boolean | undefined;
  balcony?: boolean | undefined;
  gas?: boolean | undefined;
  water?: boolean | undefined;
  electricity?: boolean | undefined;
  internet?: boolean | undefined;
  sort?: PropertySort | undefined;
  page?: number | undefined;
  perPage?: number | undefined;
}

export interface Paginated<T> {
  data: T[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export type { ContactRequest, VisitRequest, ChatMessage, Conversation } from "../services/api/interactions.service";
import type { ChatMessage } from "../services/api/interactions.service";

export type Message = ChatMessage;

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

export interface PropertyLandlord {
  id: string;
  name: string;
  phone: string;
}

export interface VerificationBadgeStatus {
  addressVerified: boolean;
  ownershipVerified: boolean;
  physicalInspection: boolean;
}
