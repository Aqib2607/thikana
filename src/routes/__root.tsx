import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { LanguageProvider } from "../i18n/LanguageProvider";
import { AuthProvider } from "../contexts/AuthContext";
import { CompareProvider } from "../contexts/CompareContext";
import { FavoritesProvider } from "../contexts/FavoritesContext";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">পৃষ্ঠাটি পাওয়া যায়নি / Page Not Found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          আপনি যে পৃষ্ঠাটি খুঁজছেন তা সরানো হয়েছে অথবা লিংকটি ভুল।
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            হোমপেজে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          পৃষ্ঠাটি লোড করা সম্ভব হয়নি
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          কিছু একটা সমস্যা হয়েছে। আপনি পুনরায় চেষ্টা করতে পারেন অথবা হোমপেজে ফিরতে পারেন।
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            আবার চেষ্টা করুন
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            হোমে ফিরুন
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ঠিকানা — Thikana | Rental Property Discovery Platform" },
      {
        name: "description",
        content:
          "বাংলাদেশে ভাড়া বাসা খোঁজার সহজ ও পদ্ধতিগত ওয়েব প্ল্যাটফর্ম। খুলনা ও সারা দেশের ফ্ল্যাট, রুম, সাবলেট ও কমার্শিয়াল স্পেস খুঁজুন ও তুলনা করুন।",
      },
      { name: "author", content: "Thikana Team" },
      { property: "og:title", content: "ঠিকানা — Thikana | Rental Property Discovery Platform" },
      {
        property: "og:description",
        content: "বাংলাদেশে ভাড়া বাসা খোঁজার সহজ ও পদ্ধতিগত ওয়েব প্ল্যাটফর্ম।",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&family=Noto+Sans:wght@400;500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
        integrity: "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=",
        crossOrigin: "",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="bn">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <CompareProvider>
            <FavoritesProvider>
              <Outlet />
              <Toaster richColors position="top-right" />
            </FavoritesProvider>
          </CompareProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
