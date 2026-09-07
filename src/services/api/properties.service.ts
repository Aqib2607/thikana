import type {
  Paginated,
  Property,
  PropertyFilters,
  AvailabilityStatus,
  ApprovalStatus,
  PropertyVerification,
} from "@/types/thikana";
import { mockProperties } from "../mock/properties.mock";
import { apiRequest, mockDelay, USING_MOCK_API } from "./http";
import { calculateMatchScore, getStoredPreferences } from "./matching.service";

const PROPERTIES_STORE_KEY = "thikana.mock.properties";

// Initialize in-memory / localStorage mutable store from seeded properties
function getMockStore(): Property[] {
  if (typeof window === "undefined") return mockProperties;
  try {
    const raw = window.localStorage.getItem(PROPERTIES_STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  // Store initial seeds
  window.localStorage.setItem(PROPERTIES_STORE_KEY, JSON.stringify(mockProperties));
  return mockProperties;
}

function saveMockStore(properties: Property[]) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(PROPERTIES_STORE_KEY, JSON.stringify(properties));
  }
}

export async function fetchProperties(filters: PropertyFilters = {}): Promise<Paginated<Property>> {
  if (!USING_MOCK_API) {
    return apiRequest<Paginated<Property>>("/properties", { query: filters as any });
  }

  const all = getMockStore();
  const prefs = getStoredPreferences();

  let filtered = all.filter((p) => {
    // Public search only returns approved properties (PRD BR-03)
    if (p.approvalStatus !== "approved") return false;

    // Search query (title, area, city, description)
    if (filters.q) {
      const q = filters.q.toLowerCase().trim();
      const matchText =
        p.title.toLowerCase().includes(q) ||
        p.titleEn.toLowerCase().includes(q) ||
        p.location.area.toLowerCase().includes(q) ||
        p.location.city.toLowerCase().includes(q) ||
        p.location.address.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q);
      if (!matchText) return false;
    }

    // Location hierarchy
    if (filters.division && !p.location.division.toLowerCase().includes(filters.division.toLowerCase()))
      return false;
    if (filters.district && !p.location.district.toLowerCase().includes(filters.district.toLowerCase()))
      return false;
    if (filters.city && !p.location.city.toLowerCase().includes(filters.city.toLowerCase()))
      return false;
    if (filters.area && !p.location.area.toLowerCase().includes(filters.area.toLowerCase()))
      return false;

    // Type
    if (filters.type && p.type !== filters.type) return false;

    // Rent range
    const pRent = p.monthlyRent ?? p.rent ?? 0;
    if (filters.minRent !== undefined && pRent < filters.minRent) return false;
    if (filters.maxRent !== undefined && pRent > filters.maxRent) return false;

    // Rooms & Bathrooms
    const pRooms = p.rooms ?? p.bedrooms ?? 0;
    if (filters.rooms !== undefined && pRooms < filters.rooms) return false;
    if (filters.bathrooms !== undefined && p.bathrooms < filters.bathrooms) return false;

    // Furnished
    if (filters.furnished && p.furnished !== filters.furnished) return false;

    // Amenities
    if (filters.parking && !p.parking) return false;
    if (filters.balcony && !p.balcony) return false;
    if (filters.gas && !p.gas) return false;
    if (filters.water && !p.water) return false;
    if (filters.electricity && !p.electricity) return false;
    if (filters.internet && !p.internet) return false;

    return true;
  });

  // Calculate matching scores
  filtered = filtered.map((p) => ({
    ...p,
    match: calculateMatchScore(p, prefs),
  }));

  // Sorting
  const sort = filters.sort ?? "relevance";
  filtered.sort((a, b) => {
    if (sort === "relevance") {
      return (b.match?.score ?? 0) - (a.match?.score ?? 0);
    }
    if (sort === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sort === "rent_asc") {
      return (a.monthlyRent ?? a.rent ?? 0) - (b.monthlyRent ?? b.rent ?? 0);
    }
    if (sort === "rent_desc") {
      return (b.monthlyRent ?? b.rent ?? 0) - (a.monthlyRent ?? a.rent ?? 0);
    }
    return 0;
  });

  // Pagination
  const page = Math.max(1, filters.page ?? 1);
  const perPage = Math.max(1, filters.perPage ?? 9);
  const total = filtered.length;
  const totalPages = Math.ceil(total / perPage);
  const startIndex = (page - 1) * perPage;
  const data = filtered.slice(startIndex, startIndex + perPage);

  return mockDelay({
    data,
    page,
    perPage,
    total,
    totalPages,
  });
}

export async function fetchPropertyById(id: string): Promise<Property> {
  if (!USING_MOCK_API) {
    return apiRequest<Property>(`/properties/${id}`);
  }

  const all = getMockStore();
  const found = all.find((p) => p.id === id);
  if (!found) {
    throw new Error(`Property with id ${id} not found`);
  }

  const prefs = getStoredPreferences();
  return mockDelay({
    ...found,
    match: calculateMatchScore(found, prefs),
  });
}

export async function fetchLandlordProperties(landlordId: string): Promise<Property[]> {
  if (!USING_MOCK_API) {
    return apiRequest<Property[]>(`/landlord/properties`);
  }

  const all = getMockStore();
  // If specific landlord, filter by landlordId or return demo properties if matched
  const list = all.filter((p) => p.landlord.id === landlordId || landlordId === "l-p-1001");
  return mockDelay(list);
}

export async function fetchAllAdminProperties(): Promise<Property[]> {
  if (!USING_MOCK_API) {
    return apiRequest<Property[]>(`/admin/properties`);
  }

  const all = getMockStore();
  return mockDelay(all);
}

export async function createProperty(payload: Omit<Property, "id" | "createdAt" | "updatedAt">): Promise<Property> {
  if (!USING_MOCK_API) {
    return apiRequest<Property>("/properties", { method: "POST", body: payload });
  }

  const all = getMockStore();
  const newProp: Property = {
    ...payload,
    id: `p-${Date.now()}`,
    approvalStatus: "submitted", // starts in submitted state awaiting admin approval
    createdAt: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10),
  };

  const updated = [newProp, ...all];
  saveMockStore(updated);
  return mockDelay(newProp, 500);
}

export async function updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
  if (!USING_MOCK_API) {
    return apiRequest<Property>(`/properties/${id}`, { method: "PATCH", body: updates });
  }

  const all = getMockStore();
  const index = all.findIndex((p) => p.id === id);
  if (index === -1) throw new Error("Property not found");

  const current = all[index]!;
  const updatedProp: Property = {
    ...current,
    ...updates,
    id: current.id,
    updatedAt: new Date().toISOString().slice(0, 10),
  };

  all[index] = updatedProp;
  saveMockStore(all);
  return mockDelay(updatedProp);
}

export async function updatePropertyAvailability(id: string, status: AvailabilityStatus): Promise<Property> {
  return updateProperty(id, { availabilityStatus: status, status });
}

export async function updatePropertyApproval(
  id: string,
  approvalStatus: ApprovalStatus,
  rejectionReason?: string
): Promise<Property> {
  return updateProperty(id, { approvalStatus, rejectionReason });
}

export async function updatePropertyVerification(
  id: string,
  verifications: PropertyVerification[]
): Promise<Property> {
  return updateProperty(id, { verifications });
}

export async function deleteProperty(id: string): Promise<boolean> {
  if (!USING_MOCK_API) {
    await apiRequest(`/properties/${id}`, { method: "DELETE" });
    return true;
  }

  const all = getMockStore();
  const filtered = all.filter((p) => p.id !== id);
  saveMockStore(filtered);
  return mockDelay(true);
}

export const PropertiesService = {
  getProperties: async (filters: any = {}) => {
    const res = await fetchProperties({
      ...filters,
      perPage: filters.limit ?? filters.perPage,
    });
    return {
      ...res,
      properties: res.data,
    };
  },
  getPropertyById: fetchPropertyById,
  getLandlordProperties: fetchLandlordProperties,
  getPendingProperties: async () => {
    const all = await fetchAllAdminProperties();
    return all.filter((p) => p.approvalStatus === "submitted" || (p.approvalStatus as string) === "pending");
  },
  createProperty: async (payload: any) => {
    return createProperty(payload);
  },
  updateProperty,
  updateAvailabilityStatus: updatePropertyAvailability,
  updateApprovalStatus: updatePropertyApproval,
  updateVerification: async (id: string, verificationsOrSingle: any) => {
    if (Array.isArray(verificationsOrSingle)) {
      return updatePropertyVerification(id, verificationsOrSingle);
    }
    return updateProperty(id, { verification: verificationsOrSingle });
  },
  deleteProperty,
};

