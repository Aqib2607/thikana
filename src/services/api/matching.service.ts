import type { MatchFactor, MatchResult, Property, PropertyFilters } from "@/types/thikana";

export interface TenantPreferences {
  division?: string | undefined;
  district?: string | undefined;
  city?: string | undefined;
  area?: string | undefined;
  preferredLocations?: string[] | undefined;
  locations?: string[] | undefined;
  type?: Property["type"] | undefined;
  propertyType?: string | undefined;
  minRent?: number | undefined;
  maxRent?: number | undefined;
  maxBudget?: number | undefined;
  minRooms?: number | undefined;
  minBedrooms?: number | undefined;
  bedrooms?: number | undefined;
  minBathrooms?: number | undefined;
  bathrooms?: number | undefined;
  furnished?: Property["furnished"] | undefined;
  parking?: boolean | undefined;
  balcony?: boolean | undefined;
  gas?: boolean | undefined;
  water?: boolean | undefined;
  electricity?: boolean | undefined;
  internet?: boolean | undefined;
  requiredAmenities?: string[] | undefined;
  amenities?: string[] | undefined;
  preferredAvailableFrom?: string | undefined;
}

export const PREFERENCES_STORAGE_KEY = "thikana.tenant.preferences";

export const DEFAULT_DEMO_PREFERENCES: TenantPreferences = {
  division: "খুলনা",
  district: "খুলনা",
  city: "খুলনা",
  area: "সোনাডাঙ্গা",
  type: "apartment",
  minRent: 8000,
  maxRent: 16000,
  minRooms: 2,
  minBathrooms: 1,
  furnished: "semi_furnished",
  parking: true,
  balcony: true,
  gas: true,
  water: true,
  electricity: true,
  internet: true,
};

export function getStoredPreferences(): TenantPreferences {
  if (typeof window === "undefined") return DEFAULT_DEMO_PREFERENCES;
  try {
    const stored = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore error
  }
  return DEFAULT_DEMO_PREFERENCES;
}

export function saveStoredPreferences(prefs: TenantPreferences) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(prefs));
  }
}

export function clearStoredPreferences() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(PREFERENCES_STORAGE_KEY);
  }
}

/**
 * Deterministic rule-based matching score calculation.
 * Exactly adheres to PRD Section 10.6 & Design Document Section 22:
 * Total = 100
 * - Location: 30%
 * - Budget: 25%
 * - Property Type: 15%
 * - Room / Bathroom: 10%
 * - Amenities: 15%
 * - Availability: 5%
 */
export function calculateMatchScore(property: Property, prefs: TenantPreferences): MatchResult {
  const factors: MatchFactor[] = [];

  // 1. Location (Weight: 30)
  let locationEarned = 0;
  const propArea = (property.location?.area ?? property.location ?? "").toString().toLowerCase();
  const propCity = (property.location?.city ?? "").toString().toLowerCase();

  if (prefs.preferredLocations && prefs.preferredLocations.length > 0) {
    const isPreferred = prefs.preferredLocations.some((loc) =>
      propArea.includes(loc.toLowerCase()) || loc.toLowerCase().includes(propArea)
    );
    locationEarned = isPreferred ? 30 : 10;
  } else if (prefs.area && propArea.includes(prefs.area.toLowerCase())) {
    locationEarned = 30;
  } else if (prefs.city && propCity.includes(prefs.city.toLowerCase())) {
    locationEarned = 20;
  } else {
    locationEarned = 10;
  }
  factors.push({ key: "location", earned: locationEarned, weight: 30 });

  // 2. Budget (Weight: 25)
  let budgetEarned = 0;
  const rent = property.monthlyRent ?? property.rent ?? 0;
  const maxRent = prefs.maxRent ?? 999999;
  const minRent = prefs.minRent ?? 0;
  if (rent >= minRent && rent <= maxRent) {
    budgetEarned = 25;
  } else if (rent > maxRent && rent <= maxRent * 1.15) {
    budgetEarned = 15; // slightly over budget
  } else if (rent > maxRent && rent <= maxRent * 1.3) {
    budgetEarned = 8;
  } else {
    budgetEarned = 0;
  }
  factors.push({ key: "budget", earned: budgetEarned, weight: 25 });

  // 3. Property Type (Weight: 15)
  let typeEarned = 0;
  const targetType = prefs.type || prefs.propertyType;
  if (!targetType || targetType === property.type || targetType === property.propertyType) {
    typeEarned = 15;
  } else {
    typeEarned = 0;
  }
  factors.push({ key: "property_type", earned: typeEarned, weight: 15 });

  // 4. Room & Bathroom (Weight: 10)
  let roomBathEarned = 0;
  const minRooms = prefs.minBedrooms ?? prefs.minRooms ?? 1;
  const minBaths = prefs.minBathrooms ?? 1;
  const propRooms = property.rooms ?? property.bedrooms ?? 1;
  const propBaths = property.bathrooms ?? 1;
  if (propRooms >= minRooms && propBaths >= minBaths) {
    roomBathEarned = 10;
  } else if (propRooms >= minRooms || propBaths >= minBaths) {
    roomBathEarned = 5;
  } else {
    roomBathEarned = 2;
  }
  factors.push({ key: "room_bathroom", earned: roomBathEarned, weight: 10 });

  // 5. Amenities (Weight: 15)
  let amenitiesEarned = 0;
  const checked = [
    { req: prefs.gas, has: property.gas },
    { req: prefs.internet, has: property.internet },
    { req: prefs.parking, has: property.parking },
    { req: prefs.balcony, has: property.balcony },
    { req: prefs.water, has: property.water },
  ];
  const requiredCount = checked.filter((c) => c.req).length;
  if (requiredCount === 0) {
    amenitiesEarned = 15;
  } else {
    const metCount = checked.filter((c) => c.req && c.has).length;
    amenitiesEarned = Math.round((metCount / requiredCount) * 15);
  }
  factors.push({ key: "amenities", earned: amenitiesEarned, weight: 15 });

  // 6. Availability (Weight: 5)
  let availEarned = 0;
  const availStatus = property.availabilityStatus ?? property.status;
  if (availStatus === "available") {
    availEarned = 5;
  } else if (availStatus === "reserved") {
    availEarned = 2;
  } else {
    availEarned = 0;
  }
  factors.push({ key: "availability", earned: availEarned, weight: 5 });

  const totalScore = factors.reduce((sum, f) => sum + f.earned, 0);

  return {
    score: Math.min(100, Math.max(0, totalScore)),
    factors,
  };
}

export const MatchingService = {
  getPreferences: getStoredPreferences,
  savePreferences: saveStoredPreferences,
  clearPreferences: clearStoredPreferences,
  calculateMatch: (property: Property, prefs: TenantPreferences) => {
    const res = calculateMatchScore(property, prefs);
    return {
      ...res,
      explanation: `${res.score}% ম্যাচ - নীতিমালার ভিত্তিতে গণনা করা হয়েছে`,
    };
  },
  calculateMatchScore,
};

