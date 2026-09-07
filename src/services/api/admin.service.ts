import { mockDelay } from "./http";
import type { UserRole } from "@/types/thikana";
import { DEMO_USERS, type User } from "@/contexts/AuthContext";

export interface AuditLog {
  id: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entityType: string;
  entityId: string;
  timestamp: string;
  details?: string;
}

export interface AdminAnalytics {
  totalTenants: number;
  totalLandlords: number;
  totalProperties: number;
  pendingApprovals: number;
  availableProperties: number;
  rentedProperties: number;
  openReports: number;
  propertiesByType: { name: string; count: number }[];
  propertiesByStatus: { name: string; count: number }[];
  propertiesByArea: { name: string; count: number }[];
}

let mockAdminUsers: User[] = [
  DEMO_USERS.tenant,
  DEMO_USERS.landlord,
  DEMO_USERS.admin,
  {
    id: "u-tenant-2",
    name: "ফাহিমা আক্তার",
    email: "fahima.akhtar@example.com",
    phone: "01733445566",
    role: "tenant",
    createdAt: "2026-02-10",
  },
  {
    id: "u-landlord-2",
    name: "কাজী জহিরুল ইসলাম",
    email: "kazi.zahir@example.com",
    phone: "01744556677",
    role: "landlord",
    createdAt: "2026-01-20",
  },
  {
    id: "u-tenant-3",
    name: "মাহমুদ হাসান সাকিব",
    email: "sakib.student@example.com",
    phone: "01755667788",
    role: "tenant",
    createdAt: "2026-03-01",
  },
];

let mockAuditLogs: AuditLog[] = [
  {
    id: "log-1",
    actorName: "অ্যাডমিন মডারেটর",
    actorRole: "admin",
    action: "PROPERTY_APPROVED",
    entityType: "Property",
    entityId: "p-1001",
    timestamp: "2026-08-12 11:20 AM",
    details: "সোনাডাঙ্গায় ২ বেডরুমের ফ্ল্যাট অনুমোদন সম্পন্ন হয়েছে।",
  },
  {
    id: "log-2",
    actorName: "হাসান মাহমুদ",
    actorRole: "landlord",
    action: "PROPERTY_CREATED",
    entityType: "Property",
    entityId: "p-1001",
    timestamp: "2026-08-10 09:15 AM",
    details: "নতুন লিস্টিং জমা দেওয়া হয়েছে।",
  },
  {
    id: "log-3",
    actorName: "অ্যাডমিন মডারেটর",
    actorRole: "admin",
    action: "VERIFICATION_STATUS_UPDATED",
    entityType: "Property",
    entityId: "p-1001",
    timestamp: "2026-08-12 11:25 AM",
    details: "মালিকানা ও ফোন নম্বর যাচাইকরণ ব্যাজ যুক্ত হয়েছে।",
  },
  {
    id: "log-4",
    actorName: "তানভীর আহমেদ",
    actorRole: "tenant",
    action: "VISIT_REQUESTED",
    entityType: "VisitRequest",
    entityId: "vr-1",
    timestamp: "2026-08-12 04:30 PM",
    details: "২০ আগস্টের জন্য ভিজিট অনুরোধ পাঠানো হয়েছে।",
  },
];

export async function fetchAdminUsers(): Promise<User[]> {
  return mockDelay([...mockAdminUsers]);
}

export async function updateUserStatus(userId: string, _status: string): Promise<User> {
  const u = mockAdminUsers.find((user) => user.id === userId);
  if (!u) throw new Error("User not found");
  return mockDelay(u);
}

export async function fetchAuditLogs(): Promise<AuditLog[]> {
  return mockDelay([...mockAuditLogs]);
}

export async function addAuditLog(log: Omit<AuditLog, "id" | "timestamp">): Promise<AuditLog> {
  const newLog: AuditLog = {
    ...log,
    id: `log-${Date.now()}`,
    timestamp: new Date().toLocaleString(),
  };
  mockAuditLogs.unshift(newLog);
  return mockDelay(newLog);
}

export async function fetchAdminAnalytics(): Promise<AdminAnalytics> {
  return mockDelay({
    totalTenants: 142,
    totalLandlords: 48,
    totalProperties: 86,
    pendingApprovals: 4,
    availableProperties: 62,
    rentedProperties: 20,
    openReports: 3,
    propertiesByType: [
      { name: "অ্যাপার্টমেন্ট", count: 38 },
      { name: "ব্যাচেলর রুম", count: 24 },
      { name: "সাবলেট", count: 12 },
      { name: "বাড়ি", count: 8 },
      { name: "কমার্শিয়াল", count: 4 },
    ],
    propertiesByStatus: [
      { name: "খালি আছে (Available)", count: 62 },
      { name: "ভাড়া হয়ে গেছে (Rented)", count: 20 },
      { name: "সংরক্ষিত (Reserved)", count: 4 },
    ],
    propertiesByArea: [
      { name: "সোনাডাঙ্গা (Khulna)", count: 32 },
      { name: "বয়রা (Khulna)", count: 22 },
      { name: "গল্লামারী (Khulna)", count: 18 },
      { name: "খালিশপুর (Khulna)", count: 14 },
    ],
  });
}

export const AdminService = {
  fetchAdminUsers,
  updateUserStatus,
  fetchAuditLogs,
  addAuditLog,
  fetchAdminAnalytics,
};
