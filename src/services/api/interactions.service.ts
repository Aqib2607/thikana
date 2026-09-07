import { mockCommunityNotes, mockReviews } from "../mock/properties.mock";
import { mockDelay } from "./http";
import type { CommunityNote, Review } from "@/types/thikana";

export interface ContactRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  tenantId: string;
  tenantName: string;
  tenantPhone: string;
  landlordId: string;
  tenantEmail?: string | undefined;
  message: string;
  status: "pending" | "accepted" | "declined" | "contacted" | "closed";
  createdAt: string;
}

export interface VisitRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  tenantId: string;
  tenantName: string;
  tenantPhone: string;
  landlordId: string;
  preferredDate: string;
  preferredTime: string;
  date?: string | undefined;
  time?: string | undefined;
  notes?: string | undefined;
  tenantNote?: string | undefined;
  landlordNote?: string | undefined;
  status: "requested" | "accepted" | "rejected" | "cancelled" | "pending" | "confirmed" | "completed";
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  message: string;
  content?: string | undefined;
  timestamp: string;
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
  unreadCount: number;
}

export interface PropertyReport {
  id: string;
  propertyId: string;
  propertyTitle: string;
  reporterId: string;
  reporterName: string;
  reporterPhone?: string | undefined;
  reason: "fake" | "rented" | "incorrect" | "suspicious" | "inappropriate" | "other" | string;
  description: string;
  details?: string | undefined;
  status: "open" | "under_review" | "resolved" | "rejected";
  createdAt: string;
}

// Initial mock state
let contactRequests: ContactRequest[] = [
  {
    id: "cr-1",
    propertyId: "p-1001",
    propertyTitle: "সোনাডাঙ্গায় ২ বেডরুমের ফ্ল্যাট",
    tenantId: "u-tenant-1",
    tenantName: "তানভীর আহমেদ",
    tenantPhone: "01711223344",
    landlordId: "l-p-1001",
    message: "আসসালামু আলাইকুম। এই ফ্ল্যাটে কি ২৪ ঘণ্টা পানির সুবিধা আছে? পরিবার নিয়ে উঠতে আগ্রহী।",
    status: "pending",
    createdAt: "2026-08-10",
  },
  {
    id: "cr-2",
    propertyId: "p-1003",
    propertyTitle: "বয়রায় আধুনিক ব্যাচেলর রুম",
    tenantId: "u-tenant-1",
    tenantName: "তানভীর আহমেদ",
    tenantPhone: "01711223344",
    landlordId: "l-p-1003",
    message: "আগামী মাস থেকে সিট খালি হবে কি না জানতে চাচ্ছি।",
    status: "accepted",
    createdAt: "2026-08-01",
  },
];

let visitRequests: VisitRequest[] = [
  {
    id: "vr-1",
    propertyId: "p-1001",
    propertyTitle: "সোনাডাঙ্গায় ২ বেডরুমের ফ্ল্যাট",
    tenantId: "u-tenant-1",
    tenantName: "তানভীর আহমেদ",
    tenantPhone: "01711223344",
    landlordId: "l-p-1001",
    preferredDate: "2026-08-20",
    preferredTime: "16:30",
    tenantNote: "শুক্রবার বিকেলে সপরিবারে বাসাটি দেখতে আসব।",
    landlordNote: "স্বাগতম, শুক্রবারে আমি বাসায় থাকব।",
    status: "accepted",
    createdAt: "2026-08-12",
  },
  {
    id: "vr-2",
    propertyId: "p-1002",
    propertyTitle: "খুলনা বিশ্ববিদ্যালয়ের কাছে সাবলেট রুম",
    tenantId: "u-tenant-1",
    tenantName: "তানভীর আহমেদ",
    tenantPhone: "01711223344",
    landlordId: "l-p-1002",
    preferredDate: "2026-08-25",
    preferredTime: "11:00",
    tenantNote: "সকালে ক্লাস শেষে বাসা দেখে আসব।",
    status: "requested",
    createdAt: "2026-08-14",
  },
];

let conversations: Conversation[] = [
  {
    id: "conv-1",
    propertyId: "p-1001",
    propertyTitle: "সোনাডাঙ্গায় ২ বেডরুমের ফ্ল্যাট",
    tenantId: "u-tenant-1",
    tenantName: "তানভীর আহমেদ",
    landlordId: "l-p-1001",
    landlordName: "হাসান মাহমুদ",
    lastMessage: "জি, শুক্রবারে আপনি এসে সরাসরি দেখে যেতে পারেন।",
    lastMessageTime: "2:45 PM",
    unreadCount: 0,
  },
  {
    id: "conv-2",
    propertyId: "p-1003",
    propertyTitle: "বয়রায় আধুনিক ব্যাচেলর রুম",
    tenantId: "u-tenant-1",
    tenantName: "তানভীর আহমেদ",
    landlordId: "l-p-1003",
    landlordName: "আনোয়ারুল ইসলাম",
    lastMessage: "হ্যাঁ, ১লা সেপ্টেম্বর থেকে সিট খালি হচ্ছে।",
    lastMessageTime: "গতকাল",
    unreadCount: 1,
  },
];

let messages: Record<string, ChatMessage[]> = {
  "conv-1": [
    {
      id: "m-1",
      conversationId: "conv-1",
      senderId: "u-tenant-1",
      senderName: "তানভীর আহমেদ",
      message: "আসসালামু আলাইকুম। বাসাটিতে কি গ্যাস সিলিন্ডার নাকি পাইপলাইন?",
      timestamp: "2:30 PM",
    },
    {
      id: "m-2",
      conversationId: "conv-1",
      senderId: "l-p-1001",
      senderName: "হাসান মাহমুদ",
      message: "ওয়ালাইকুম আসসালাম। সিলিন্ডার গ্যাস ব্যবহার করতে হবে, তবে লাইন ক্লিয়ার আছে।",
      timestamp: "2:38 PM",
    },
    {
      id: "m-3",
      conversationId: "conv-1",
      senderId: "l-p-1001",
      senderName: "হাসান মাহমুদ",
      message: "জি, শুক্রবারে আপনি এসে সরাসরি দেখে যেতে পারেন।",
      timestamp: "2:45 PM",
    },
  ],
};

let propertyReports: PropertyReport[] = [
  {
    id: "rep-1",
    propertyId: "p-1002",
    propertyTitle: "খুলনা বিশ্ববিদ্যালয়ের কাছে সাবলেট রুম",
    reporterId: "u-tenant-1",
    reporterName: "তানভীর আহমেদ",
    reason: "rented",
    description: "বাড়িওয়ালার সাথে কথা বলে জানা গেল এই রুমটি গত সপ্তাহে ভাড়া হয়ে গেছে, কিন্তু লিস্টিং এখনও এভেইলেবল দেখাচ্ছে।",
    status: "open",
    createdAt: "2026-08-11",
  },
];

let storedReviews: Review[] = [...mockReviews];
let storedCommunityNotes: CommunityNote[] = [...mockCommunityNotes];

// Contact Requests
export async function sendContactRequest(payload: Omit<ContactRequest, "id" | "status" | "createdAt">): Promise<ContactRequest> {
  const newReq: ContactRequest = {
    ...payload,
    id: `cr-${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString().slice(0, 10),
  };
  contactRequests.unshift(newReq);
  return mockDelay(newReq, 400);
}

export async function fetchTenantContactRequests(tenantId: string): Promise<ContactRequest[]> {
  return mockDelay(contactRequests.filter((r) => r.tenantId === tenantId));
}

export async function fetchLandlordContactRequests(landlordId: string): Promise<ContactRequest[]> {
  return mockDelay(contactRequests.filter((r) => r.landlordId === landlordId || landlordId === "l-p-1001"));
}

export async function updateContactRequestStatus(id: string, status: ContactRequest["status"]): Promise<ContactRequest> {
  const req = contactRequests.find((r) => r.id === id);
  if (!req) throw new Error("Request not found");
  req.status = status;
  return mockDelay(req);
}

// Visit Requests
export async function sendVisitRequest(payload: Omit<VisitRequest, "id" | "status" | "createdAt">): Promise<VisitRequest> {
  const newReq: VisitRequest = {
    ...payload,
    id: `vr-${Date.now()}`,
    status: "requested",
    createdAt: new Date().toISOString().slice(0, 10),
  };
  visitRequests.unshift(newReq);
  return mockDelay(newReq, 400);
}

export async function fetchTenantVisits(tenantId: string): Promise<VisitRequest[]> {
  return mockDelay(visitRequests.filter((v) => v.tenantId === tenantId));
}

export async function fetchLandlordVisits(landlordId: string): Promise<VisitRequest[]> {
  return mockDelay(visitRequests.filter((v) => v.landlordId === landlordId || landlordId === "l-p-1001"));
}

export async function updateVisitStatus(
  id: string,
  status: VisitRequest["status"],
  landlordNote?: string
): Promise<VisitRequest> {
  const req = visitRequests.find((v) => v.id === id);
  if (!req) throw new Error("Visit request not found");
  req.status = status;
  if (landlordNote !== undefined) req.landlordNote = landlordNote;
  return mockDelay(req);
}

// Messaging
export async function fetchConversations(userId: string): Promise<Conversation[]> {
  return mockDelay(conversations);
}

export async function fetchMessages(conversationId: string): Promise<ChatMessage[]> {
  return mockDelay(messages[conversationId] ?? []);
}

export async function sendMessage(conversationId: string, senderId: string, senderName: string, text: string): Promise<ChatMessage> {
  const newMsg: ChatMessage = {
    id: `m-${Date.now()}`,
    conversationId,
    senderId,
    senderName,
    message: text,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };

  if (!messages[conversationId]) {
    messages[conversationId] = [];
  }
  messages[conversationId].push(newMsg);

  const conv = conversations.find((c) => c.id === conversationId);
  if (conv) {
    conv.lastMessage = text;
    conv.lastMessageTime = newMsg.timestamp;
  }

  return mockDelay(newMsg, 250);
}

// Reviews
export async function fetchPropertyReviews(propertyId: string): Promise<Review[]> {
  return mockDelay(storedReviews.filter((r) => r.propertyId === propertyId));
}

export async function submitReview(payload: Omit<Review, "id" | "createdAt">): Promise<Review> {
  const newRev: Review = {
    ...payload,
    id: `r-${Date.now()}`,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  storedReviews.unshift(newRev);
  return mockDelay(newRev, 400);
}

export async function fetchAllReviews(): Promise<Review[]> {
  return mockDelay(storedReviews);
}

// Community Notes
export async function fetchCommunityNotes(area?: string): Promise<CommunityNote[]> {
  if (area) {
    return mockDelay(storedCommunityNotes.filter((n) => (n.area || n.locationArea || "").toLowerCase().includes(area.toLowerCase())));
  }
  return mockDelay(storedCommunityNotes);
}

export async function submitCommunityNote(payload: Omit<CommunityNote, "id" | "createdAt">): Promise<CommunityNote> {
  const newNote: CommunityNote = {
    ...payload,
    id: `c-${Date.now()}`,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  storedCommunityNotes.unshift(newNote);
  return mockDelay(newNote, 400);
}

// Reports
export async function submitPropertyReport(payload: Omit<PropertyReport, "id" | "status" | "createdAt">): Promise<PropertyReport> {
  const newRep: PropertyReport = {
    ...payload,
    id: `rep-${Date.now()}`,
    status: "open",
    createdAt: new Date().toISOString().slice(0, 10),
  };
  propertyReports.unshift(newRep);
  return mockDelay(newRep, 400);
}

export async function fetchAllReports(): Promise<PropertyReport[]> {
  return mockDelay(propertyReports);
}

export async function updateReportStatus(id: string, status: PropertyReport["status"]): Promise<PropertyReport> {
  const rep = propertyReports.find((r) => r.id === id);
  if (!rep) throw new Error("Report not found");
  rep.status = status;
  return mockDelay(rep);
}

export const InteractionsService = {
  getTenantConversations: fetchConversations,
  getLandlordConversations: fetchConversations,
  getConversationMessages: fetchMessages,
  sendMessage,
  getTenantVisitRequests: fetchTenantVisits,
  getLandlordVisitRequests: fetchLandlordVisits,
  updateVisitStatus,
  getAllReviews: fetchAllReviews,
  getPropertyReviews: fetchPropertyReviews,
  deleteReview: async (id: string) => {
    storedReviews = storedReviews.filter((r) => r.id !== id);
    return mockDelay(true);
  },
  getLandlordContactRequests: fetchLandlordContactRequests,
  updateContactRequestStatus,
  getCommunityNotes: async (location?: any) => {
    const area = typeof location === "string" ? location : location?.area;
    return fetchCommunityNotes(area);
  },
  addCommunityNote: async (note: any) => {
    return submitCommunityNote({
      category: note.category ?? "general",
      area: note.locationId ?? note.area ?? "Khulna",
      note: note.contentBn ?? note.note ?? "",
      submittedBy: note.author ?? "Admin",
    });
  },
  getAllReports: fetchAllReports,
  resolveReport: async (id: string) => {
    return updateReportStatus(id, "resolved");
  },
};

