import { useState, useEffect } from 'react';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useLanguage } from '@/i18n/LanguageProvider';
import { useFavorites } from '@/contexts/FavoritesContext';
import { TenantLayout } from '@/components/layout/TenantLayout';
import { PropertiesService } from '@/services/api/properties.service';
import { Property } from '@/types/thikana';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight, Trash2, Home } from 'lucide-react';

export const Route = createFileRoute('/tenant/favorites')({
  component: TenantFavoritesPage,
});

function TenantFavoritesPage() {
  const { t, language } = useLanguage();
  const { favorites, clearFavorites } = useFavorites();
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      setLoading(true);
      try {
        const allProps = await PropertiesService.getProperties({ limit: 100 });
        const filtered = allProps.properties.filter((p) => favorites.includes(p.id));
        setFavoriteProperties(filtered);
      } catch (err) {
        console.error('Failed to load favorites', err);
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, [favorites]);

  return (
    <TenantLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 uppercase tracking-wider mb-1">
              <Heart className="h-3.5 w-3.5 fill-rose-600 text-rose-600" />
              <span>{language === 'bn' ? 'সংরক্ষিত তালিকা' : 'Saved Collection'}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {language === 'bn' ? 'প্রিয় বাসাসমূহ' : 'Favorite Properties'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {language === 'bn'
                ? `আপনার বুকমার্ক করা ${favorites.length}টি প্রোপার্টি সংরক্ষিত আছে`
                : `You have ${favorites.length} saved properties in your watchlist`}
            </p>
          </div>

          {favorites.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFavorites}
              className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50 self-start sm:self-auto"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              <span>{language === 'bn' ? 'সব মুছুন' : 'Clear All'}</span>
            </Button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-slate-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : favoriteProperties.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto">
            <div className="h-16 w-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
              <Heart className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              {language === 'bn' ? 'কোনো প্রিয় প্রোপার্টি নেই' : 'No favorites saved yet'}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {language === 'bn'
                ? 'লিস্টিং ব্রাউজ করার সময় হার্ট (Heart) আইকনে ক্লিক করে আপনার পছন্দের বাসা এখানে সেভ করতে পারেন।'
                : 'Click the heart icon on any property card to save it here for quick access later.'}
            </p>
            <Link to="/properties">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium mt-2">
                <span>{language === 'bn' ? 'প্রোপার্টি খুঁজুন' : 'Explore Properties'}</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </TenantLayout>
  );
}
