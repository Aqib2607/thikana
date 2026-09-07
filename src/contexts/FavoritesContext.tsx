import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useAuth } from "./AuthContext";

const FAVORITES_STORAGE_KEY = "thikana.favorites.propertyIds";

interface FavoritesContextType {
  favoriteIds: string[];
  favorites: string[];
  favoritesCount: number;
  addFavorite: (propertyIdOrObject: string | { id: string }) => void;
  removeFavorite: (propertyIdOrObject: string | { id: string }) => void;
  toggleFavorite: (propertyIdOrObject: string | { id: string }) => void;
  isFavorite: (propertyIdOrObject: string | { id: string }) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

function extractId(target: string | { id: string }): string {
  return typeof target === "string" ? target : target.id;
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return ["p-1001", "p-1003"];
    try {
      const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return ["p-1001", "p-1003"]; // initial demo favorites
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
    }
  }, [favoriteIds]);

  const addFavorite = (propertyIdOrObject: string | { id: string }) => {
    const id = extractId(propertyIdOrObject);
    if (!isAuthenticated) {
      toast.error(t("common.signInRequired", { defaultValue: "এই কাজটি করতে লগইন করুন" }));
      return;
    }
    if (favoriteIds.includes(id)) return;
    setFavoriteIds((prev) => [...prev, id]);
    toast.success(t("favorites.added", { defaultValue: "পছন্দের তালিকায় সংরক্ষণ করা হয়েছে।" }));
  };

  const removeFavorite = (propertyIdOrObject: string | { id: string }) => {
    const id = extractId(propertyIdOrObject);
    setFavoriteIds((prev) => prev.filter((i) => i !== id));
    toast.info(t("favorites.removed", { defaultValue: "পছন্দ তালিকা থেকে সরানো হয়েছে।" }));
  };

  const toggleFavorite = (propertyIdOrObject: string | { id: string }) => {
    const id = extractId(propertyIdOrObject);
    if (favoriteIds.includes(id)) {
      removeFavorite(id);
    } else {
      addFavorite(id);
    }
  };

  const isFavorite = (propertyIdOrObject: string | { id: string }) => {
    const id = extractId(propertyIdOrObject);
    return favoriteIds.includes(id);
  };

  const clearFavorites = () => {
    setFavoriteIds([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        favorites: favoriteIds,
        favoritesCount: favoriteIds.length,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
