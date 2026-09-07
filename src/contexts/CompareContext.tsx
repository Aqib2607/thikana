import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { MOCK_PROPERTIES } from "@/data/mockData";
import type { Property } from "@/types/thikana";

const COMPARE_STORAGE_KEY = "thikana.compare.propertyIds";
export const MAX_COMPARE_LIMIT = 3;

interface CompareContextType {
  compareIds: string[];
  compareList: Property[];
  addToCompare: (propertyIdOrObject: string | { id: string }) => boolean;
  removeFromCompare: (propertyIdOrObject: string | { id: string }) => void;
  toggleCompare: (propertyIdOrObject: string | { id: string }) => void;
  clearCompare: () => void;
  isInCompare: (propertyIdOrObject: string | { id: string }) => boolean;
  canAddMore: boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

function extractId(target: string | { id: string }): string {
  return typeof target === "string" ? target : target.id;
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const [compareIds, setCompareIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = window.localStorage.getItem(COMPARE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed.slice(0, MAX_COMPARE_LIMIT);
      }
    } catch {
      // ignore error
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareIds));
    }
  }, [compareIds]);

  const addToCompare = (propertyIdOrObject: string | { id: string }): boolean => {
    const id = extractId(propertyIdOrObject);
    if (compareIds.includes(id)) return true;
    if (compareIds.length >= MAX_COMPARE_LIMIT) {
      toast.error(
        t("compare.limitReached", {
          defaultValue: `সর্বোচ্চ ${MAX_COMPARE_LIMIT}টি প্রপার্টি একসাথে তুলনা করা যায়।`,
        })
      );
      return false;
    }
    setCompareIds((prev) => [...prev, id]);
    toast.success(
      t("compare.added", {
        defaultValue: "তুলনার তালিকায় যোগ করা হয়েছে।",
      })
    );
    return true;
  };

  const removeFromCompare = (propertyIdOrObject: string | { id: string }) => {
    const id = extractId(propertyIdOrObject);
    setCompareIds((prev) => prev.filter((i) => i !== id));
    toast.info(
      t("compare.removed", {
        defaultValue: "তুলনা তালিকা থেকে সরানো হয়েছে।",
      })
    );
  };

  const toggleCompare = (propertyIdOrObject: string | { id: string }) => {
    const id = extractId(propertyIdOrObject);
    if (compareIds.includes(id)) {
      removeFromCompare(id);
    } else {
      addToCompare(id);
    }
  };

  const clearCompare = () => {
    setCompareIds([]);
    toast.info(
      t("compare.cleared", {
        defaultValue: "তুলনা তালিকা খালি করা হয়েছে।",
      })
    );
  };

  const isInCompare = (propertyIdOrObject: string | { id: string }) => {
    const id = extractId(propertyIdOrObject);
    return compareIds.includes(id);
  };

  const compareList: Property[] = compareIds
    .map((id) => (MOCK_PROPERTIES as Property[]).find((p) => p.id === id))
    .filter((p): p is Property => Boolean(p));

  return (
    <CompareContext.Provider
      value={{
        compareIds,
        compareList,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        clearCompare,
        isInCompare,
        canAddMore: compareIds.length < MAX_COMPARE_LIMIT,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}
