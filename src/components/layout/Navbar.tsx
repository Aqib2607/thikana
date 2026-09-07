import React, { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  Home,
  Search,
  HelpCircle,
  Heart,
  Scale,
  Globe,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  Building2,
  ShieldCheck,
  Menu,
  ChevronDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/i18n/LanguageProvider";
import { useCompare } from "@/contexts/CompareContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import type { UserRole } from "@/types/thikana";

export function Navbar() {
  const { t } = useTranslation();
  const { user, role, isAuthenticated, logout, switchRole } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { compareIds } = useCompare();
  const { favoriteIds } = useFavorites();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentPath = useRouterState({ select: (s) => s.location.pathname });

  const toggleLang = () => {
    setLanguage(language === "bn" ? "en" : "bn");
  };

  const dashboardRoute =
    role === "admin"
      ? "/admin/dashboard"
      : role === "landlord"
      ? "/landlord/dashboard"
      : "/tenant/dashboard";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md transition-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-xs group-hover:scale-105 transition-transform">
              <Home className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-foreground tracking-tight group-hover:text-primary transition-colors leading-none">
                {t("brand.name")}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium mt-0.5 hidden sm:inline-block">
                {t("brand.tagline")}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/properties"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentPath.startsWith("/properties")
                  ? "bg-accent/15 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
              }`}
            >
              {t("nav.browse")}
            </Link>
            <Link
              to="/how-it-works"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentPath === "/how-it-works"
                  ? "bg-accent/15 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
              }`}
            >
              {t("nav.howItWorks")}
            </Link>
          </nav>
        </div>

        {/* Right Section Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Compare Badge Link */}
          <Link to="/tenant/compare" title={t("compare.title")}>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 text-slate-700 dark:text-slate-200"
            >
              <Scale className="w-4 h-4" />
              {compareIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {compareIds.length}
                </span>
              )}
            </Button>
          </Link>

          {/* Favorites Link */}
          <Link to="/tenant/favorites" title={t("favorites.title")}>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 text-slate-700 dark:text-slate-200"
            >
              <Heart className="w-4 h-4" />
              {favoriteIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {favoriteIds.length}
                </span>
              )}
            </Button>
          </Link>

          {/* Language Switcher */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleLang}
            className="h-8 px-2.5 text-xs font-semibold gap-1.5 border-border/80"
          >
            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
            <span>{language === "bn" ? "English" : "বাংলা"}</span>
          </Button>

          {/* Quick Role Persona Switcher (Crucial for Prototype Demonstration) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                className="hidden lg:flex h-8 px-2.5 text-xs font-medium gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="capitalize">{role ?? "Guest"}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 text-xs">
              <DropdownMenuLabel className="text-[11px] font-mono text-muted-foreground">
                {t("nav.switchRole")}
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => switchRole("tenant")}>
                <UserIcon className="w-3.5 h-3.5 mr-2 text-primary" />
                <span>{t("auth.tenant")} (তানভীর)</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchRole("landlord")}>
                <Building2 className="w-3.5 h-3.5 mr-2 text-amber-600" />
                <span>{t("auth.landlord")} (হাসান)</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => switchRole("admin")}>
                <ShieldCheck className="w-3.5 h-3.5 mr-2 text-rose-600" />
                <span>অ্যাডমিন (Admin)</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile / Portal Link or Auth Buttons */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 px-2 gap-2">
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <span className="text-xs font-medium max-w-[100px] truncate hidden sm:inline-block">
                    {user.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 text-xs">
                <DropdownMenuLabel>
                  <div className="font-semibold text-sm line-clamp-1">{user.name}</div>
                  <div className="text-[11px] text-muted-foreground line-clamp-1">{user.email}</div>
                  <div className="mt-1 inline-block px-1.5 py-0.2 rounded bg-primary/10 text-primary text-[10px] font-semibold uppercase">
                    {user.role}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={dashboardRoute} className="cursor-pointer">
                    <LayoutDashboard className="w-4 h-4 mr-2 text-primary" />
                    <span>{t("nav.dashboard")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>{t("nav.logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="h-8 text-xs font-medium">
                  {t("nav.login")}
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="default" size="sm" className="h-8 text-xs font-medium">
                  {t("nav.register")}
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Navigation Toggle Button */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-9 w-9">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-5 flex flex-col justify-between">
              <div>
                <SheetHeader className="pb-4 border-b text-left">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                      <Home className="w-4 h-4" />
                    </div>
                    <span>{t("brand.name")}</span>
                  </SheetTitle>
                </SheetHeader>

                <div className="py-4 space-y-2">
                  <Link
                    to="/"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent/10"
                  >
                    <Home className="w-4 h-4 text-primary" />
                    <span>{t("nav.home")}</span>
                  </Link>
                  <Link
                    to="/properties"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent/10"
                  >
                    <Search className="w-4 h-4 text-primary" />
                    <span>{t("nav.browse")}</span>
                  </Link>
                  <Link
                    to="/how-it-works"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent/10"
                  >
                    <HelpCircle className="w-4 h-4 text-primary" />
                    <span>{t("nav.howItWorks")}</span>
                  </Link>
                  <Link
                    to="/tenant/compare"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent/10"
                  >
                    <div className="flex items-center gap-3">
                      <Scale className="w-4 h-4 text-primary" />
                      <span>{t("compare.title")}</span>
                    </div>
                    {compareIds.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {compareIds.length}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/tenant/favorites"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium hover:bg-accent/10"
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>{t("favorites.title")}</span>
                    </div>
                    {favoriteIds.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold">
                        {favoriteIds.length}
                      </span>
                    )}
                  </Link>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground px-3">
                    {t("nav.switchRole")}
                  </div>
                  <div className="grid grid-cols-3 gap-1 px-3">
                    {(["tenant", "landlord", "admin"] as UserRole[]).map((r) => (
                      <Button
                        key={r}
                        variant={role === r ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          switchRole(r);
                          setMobileOpen(false);
                        }}
                        className="text-xs capitalize h-7 px-1"
                      >
                        {r}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Auth Bottom Action */}
              <div className="pt-4 border-t">
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    <Link
                      to={dashboardRoute}
                      onClick={() => setMobileOpen(false)}
                      className="w-full block"
                    >
                      <Button variant="default" className="w-full text-xs">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        {t("nav.dashboard")} ({user.name})
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="w-full text-xs text-destructive"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t("nav.logout")}
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link to="/login" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full text-xs">
                        {t("nav.login")}
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)}>
                      <Button variant="default" className="w-full text-xs">
                        {t("nav.register")}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
