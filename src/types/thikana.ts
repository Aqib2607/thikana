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

export type ApprovalStatus = "draft" | "submitted" | "approved" | "rejected";

export type FurnishedStatus = "unfurnished" | "semi_furnished" | "furnished";

export type PropertyTypeSlug =
  | "room"
  | "sublet"
  | "bachelor"
  | "apartment"
  | "house"
  | "commercial";

export type VerificationType = "owner_identity" | "phone" | "availability" | "documents";

export type VerificationStatus = "pending" | "verified" | "rejected";

export interface PropertyVerification {
  type: VerificationType;
  status: VerificationStatus;
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
  responseRateLabel?: string;
}

export interface Review {
  id: string;
  propertyId: string;
  authorName: string;
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
  category: CommunityCategory;
  area: string;
  note: string;
  submittedBy: string;
  createdAt: string;
}

export interface MatchFactor {
  key: "location" | "budget" | "property_type" | "room_bathroom" | "amenities" | "availability";
  earned: number;
  weight: number;
}

export interface MatchResult {
  score: number;
  factors: MatchFactor[];
}

export interface Property {
  id: string;
  title: string;
  titleEn: string;
  type: PropertyTypeSlug;
  description: string;
  descriptionEn: string;
  monthlyRent: number;
  advance: number;
  additionalCharges: number;
  rooms: number;
  bathrooms: number;
  floor: number;
  totalFloors: number;
  sizeSqft: number;
  furnished: FurnishedStatus;
  parking: boolean;
  balcony: boolean;
  electricity: boolean;
  water: boolean;
  gas: boolean;
  internet: boolean;
  availabilityStatus: AvailabilityStatus;
  approvalStatus: ApprovalStatus;
  availableFrom: string;
  location: PropertyLocation;
  images: PropertyImage[];
  verifications: PropertyVerification[];
  landlord: Landlord;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  match?: MatchResult;
}

export type PropertySort = "relevance" | "newest" | "rent_asc" | "rent_desc";

export interface PropertyFilters {
  q?: string;
  division?: string;
  district?: string;
  city?: string;
  area?: string;
  type?: PropertyTypeSlug;
  minRent?: number;
  maxRent?: number;
  rooms?: number;
  bathrooms?: number;
  availableFrom?: string;
  furnished?: FurnishedStatus;
  parking?: boolean;
  balcony?: boolean;
  gas?: boolean;
  water?: boolean;
  electricity?: boolean;
  internet?: boolean;
  sort?: PropertySort;
  page?: number;
  perPage?: number;
}

export interface Paginated<T> {
  data: T[];
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}
