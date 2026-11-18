import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Menu, ShoppingBag, User, WifiOff, X } from 'lucide-react';
import { AdminDashboardView } from './components/AdminDashboardView';
import { AuthModal } from './components/AuthModal';
import { CatalogueView } from './components/CatalogueView';
import { CheckoutView } from './components/CheckoutView';
import { ErrorBoundary } from './components/ErrorBoundary';
import { InfoFaqView } from './components/InfoFaqView';
import { MyOrdersView } from './components/MyOrdersView';
import { OrderTrackingView } from './components/OrderTrackingView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { StorefrontHome } from './components/StorefrontHome';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SEED_PRODUCTS, SEED_REVIEWS, SEED_SETTINGS, SEED_SHIPPING_RATES, buildSeedCapacity } from './data/seedData';
import { t } from './i18n/translations';
import { testFirestoreConnection } from './lib/firebase';
import { formatMYR } from './lib/malaysia';
import { getAvailableDates, getEarliestAvailableDate } from './lib/scheduling';
import { fetchStoreBootstrap, seedDatabase } from './services/firestoreService';
import {
  CapacityDay,
  CartItem,
  Locale,
  Order,
  OrderTracking,
  Product,
  Review,
  ShippingRate,
  StoreSettings,
} from './types/domain';

type AppView = 'home' | 'catalogue' | 'checkout' | 'track' | 'info' | 'my-orders' | 'admin';

const InnerApp: React.FC<{ locale: Locale; setLocale: (l: Locale) => void }> = ({
  locale,
  setLocale,
}) => {
  const { firebaseUser, account, isOwner, isStaff, isOffline } = useAuth();

  const [view, setView] = useState<AppView>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'admin') return 'admin';
    if (hash === 'catalogue') return 'catalogue';
    if (hash === 'track') return 'track';
    if (hash === 'checkout') return 'checkout';
    return 'home';
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>(SEED_SHIPPING_RATES);
  const [settings, setSettings] = useState<StoreSettings>(SEED_SETTINGS);
  const [capacity, setCapacity] = useState<CapacityDay[]>(() => buildSeedCapacity());
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS);
  const [storeLoading, setStoreLoading] = useState(true);
  const [dbOfflineWarning, setDbOfflineWarning] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('dmayra_cart_v1');
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });
  const [cartToast, setCartToast] = useState<string | null>(null);

  const [activeTracking, setActiveTracking] = useState<OrderTracking | null>(null);
  const [activeTrackingQuery, setActiveTrackingQuery] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem('dmayra_cart_v1', JSON.stringify(cart));
    } catch {
      // ignore storage quota
    }
  }, [cart]);

  const navigate = useCallback((next: AppView) => {
    setView(next);
    setMobileMenuOpen(false);
    window.location.hash = next === 'home' ? '' : next;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const loadStoreData = useCallback(async () => {
    setStoreLoading(true);
    try {
      const data = await fetchStoreBootstrap(isStaff);
      setProducts(data.products);
      setShippingRates(data.shippingRates);
      setSettings(data.settings);
      setCapacity(data.capacity);
      setReviews(data.reviews);

      // If Owner signs in and Firestore hasn't been seeded yet, seed demo data automatically
      if (!data.fromFirestore && isOwner) {
        const res = await seedDatabase(false);
        if (res.seeded) {
          const refreshed = await fetchStoreBootstrap(true);
          setProducts(refreshed.products);
          setShippingRates(refreshed.shippingRates);
          setSettings(refreshed.settings);
          setCapacity(refreshed.capacity);
          setReviews(refreshed.reviews);
        }
      }
    } finally {
      setStoreLoading(false);
    }
  }, [isStaff, isOwner]);

  useEffect(() => {
    testFirestoreConnection().then((res) => {
      if (res.offline) setDbOfflineWarning(true);
    });
  }, []);

  useEffect(() => {
    loadStoreData();
  }, [loadStoreData]);

  const earliestCourierDate = useMemo(() => {
    const capMap = new Map(capacity.map((c) => [c.date, c]));
    const avail = getAvailableDates({
      leadTimeDays: settings.defaultLeadTimeDays,
      requiredSlots: 1,
      fulfilmentMethod: 'courier',
      settings,
      capacityMap: capMap,
      horizonDays: 21,
    });
    return getEarliestAvailableDate(avail)?.date || null;
  }, [capacity, settings]);

  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
    setCartToast(`${item.productName[locale]} · ${t(locale, 'addedToCart')}`);
    window.setTimeout(() => setCartToast(null), 3200);
  };

  const handleUpdateQty = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev.map((it) => {
        if (it.id !== itemId) return it;
        const nextQty = Math.max(1, Math.min(10, it.quantity + delta));
        const unitSlots = it.capacitySlots / it.quantity;
        const unitWeight = it.packedWeightGrams / it.quantity;
        return {
          ...it,
          quantity: nextQty,
          lineTotalSen: it.unitPriceSen * nextQty,
          capacitySlots: Number((unitSlots * nextQty).toFixed(2)),
          packedWeightGrams: Math.round(unitWeight * nextQty),
        };
      })
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((it) => it.id !== itemId));
  };

  const handleReorder = (order: Order) => {
    const rebuilt: CartItem[] = order.items.map((it, idx) => {
      const prod = products.find((p) => p.id === it.productId);
      return {
        id: `${it.productId}-reorder-${Date.now()}-${idx}`,
        productId: it.productId,
        productName: it.productName,
        imageUrl: prod?.imageUrl || SEED_PRODUCTS[0].imageUrl,
        range: prod?.range || 'classic',
        baseFat: prod?.baseFat || 'butter',
        leadTimeDays: prod?.leadTimeDays || settings.defaultLeadTimeDays,
        format: it.format,
        quantity: it.quantity,
        comboPicks: it.comboPicks,
        notes: it.notes,
        unitPriceSen: it.unitPriceSen,
        lineTotalSen: it.lineTotalSen,
        capacitySlots: it.capacitySlots,
        packedWeightGrams: it.packedWeightGrams,
      };
    });
    setCart(rebuilt);
    navigate('checkout');
  };

  const cartCount = cart.reduce((acc, it) => acc + it.quantity, 0);
  const cartSubtotalSen = cart.reduce((acc, it) => acc + it.lineTotalSen, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#292524]">
      {/* Offline Banner */}
      {(isOffline || dbOfflineWarning) && (
        <div className="bg-[#93000A] text-white text-xs px-4 py-2 flex items-center justify-center gap-2 no-print">
          <WifiOff className="w-3.5 h-3.5 shrink-0" />
          <span>
            {locale === 'ms'
              ? 'Sambungan internet terhad atau luar talian. Sesetengah data langsung mungkin tertangguh.'
              : 'Network offline or limited connectivity. Live database updates may be delayed.'}
          </span>
        </div>
      )}

      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-40 border-b border-[#E7DDD3] bg-[#FAF7F2]/92 backdrop-blur-md no-print">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => navigate('home')}
            className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#292524] whitespace-nowrap shrink-0 text-left"
          >
            D&apos;Mayra Layer Cake
          </button>

          {/* Zone 2: 4-5 clean single-line text nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#554336]">
            <button
              type="button"
              onClick={() => navigate('home')}
              className={`hover:text-[#292524] transition-colors whitespace-nowrap shrink-0 ${
                view === 'home' ? 'text-[#831843] font-semibold underline underline-offset-4' : ''
              }`}
            >
              {t(locale, 'navHome')}
            </button>
            <button
              type="button"
              onClick={() => navigate('catalogue')}
              className={`hover:text-[#292524] transition-colors whitespace-nowrap shrink-0 ${
                view === 'catalogue'
                  ? 'text-[#831843] font-semibold underline underline-offset-4'
                  : ''
              }`}
            >
              {t(locale, 'navCatalogue')}
            </button>
            <button
              type="button"
              onClick={() => navigate('track')}
              className={`hover:text-[#292524] transition-colors whitespace-nowrap shrink-0 ${
                view === 'track' ? 'text-[#831843] font-semibold underline underline-offset-4' : ''
              }`}
            >
              {t(locale, 'navTrack')}
            </button>
            <button
              type="button"
              onClick={() => navigate('info')}
              className={`hover:text-[#292524] transition-colors whitespace-nowrap shrink-0 ${
                view === 'info' ? 'text-[#831843] font-semibold underline underline-offset-4' : ''
              }`}
            >
              {t(locale, 'navInfo')}
            </button>
            <button
              type="button"
              onClick={() => (firebaseUser ? navigate('my-orders') : setAuthModalOpen(true))}
              className={`hover:text-[#292524] transition-colors whitespace-nowrap shrink-0 ${
                view === 'my-orders'
                  ? 'text-[#831843] font-semibold underline underline-offset-4'
                  : ''
              }`}
            >
              {firebaseUser ? t(locale, 'navMyOrders') : t(locale, 'signInGoogle')}
            </button>
            {isStaff && (
              <button
                type="button"
                onClick={() => navigate('admin')}
                className={`hover:text-[#292524] transition-colors whitespace-nowrap shrink-0 ${
                  view === 'admin'
                    ? 'text-[#831843] font-semibold underline underline-offset-4'
                    : ''
                }`}
              >
                {t(locale, 'navAdmin')}
              </button>
            )}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => navigate('checkout')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D97706] text-white text-xs font-semibold hover:bg-[#B45309] transition-colors whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="tabular-nums">
                {t(locale, 'navCart')} ({cartCount})
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-[#292524] hover:bg-[#F5ECEA]"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E7DDD3] bg-[#FFFDF9] px-4 py-3 space-y-2 text-sm">
            <button
              type="button"
              onClick={() => navigate('home')}
              className="block w-full text-left py-2 font-medium text-[#292524]"
            >
              {t(locale, 'navHome')}
            </button>
            <button
              type="button"
              onClick={() => navigate('catalogue')}
              className="block w-full text-left py-2 font-medium text-[#292524]"
            >
              {t(locale, 'navCatalogue')}
            </button>
            <button
              type="button"
              onClick={() => navigate('track')}
              className="block w-full text-left py-2 font-medium text-[#292524]"
            >
              {t(locale, 'navTrack')}
            </button>
            <button
              type="button"
              onClick={() => navigate('info')}
              className="block w-full text-left py-2 font-medium text-[#292524]"
            >
              {t(locale, 'navInfo')}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setAuthModalOpen(true);
              }}
              className="block w-full text-left py-2 font-semibold text-[#831843]"
            >
              {firebaseUser ? `${account?.displayName || 'Akaun'}` : t(locale, 'signInGoogle')}
            </button>
            {isStaff && (
              <button
                type="button"
                onClick={() => navigate('admin')}
                className="block w-full text-left py-2 font-semibold text-[#831843]"
              >
                {t(locale, 'navAdmin')}
              </button>
            )}
          </div>
        )}
      </header>

      {/* Secondary Workspace Toolbar (Language & Account Quick Switcher below Header) */}
      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#554336] no-print">
        <div>
          {storeLoading ? (
            <span>{locale === 'ms' ? 'Menyegerakkan katalog...' : 'Syncing catalogue...'}</span>
          ) : (
            <span>
              Balik Pulau, Pulau Pinang · {t(locale, 'leadTimeNotice')}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {firebaseUser && account && (
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-[#831843] font-semibold hover:underline"
            >
              <User className="w-3.5 h-3.5" />
              <span>{account.displayName}</span>
            </button>
          )}
          <div className="inline-flex items-center rounded-lg bg-[#EFE6E4] p-0.5">
            <button
              type="button"
              onClick={() => setLocale('ms')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                locale === 'ms' ? 'bg-white text-[#292524] shadow-sm' : 'text-[#554336]'
              }`}
            >
              BM
            </button>
            <button
              type="button"
              onClick={() => setLocale('en')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                locale === 'en' ? 'bg-white text-[#292524] shadow-sm' : 'text-[#554336]'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </div>

      {/* Cart Toast */}
      {cartToast && (
        <div className="fixed top-20 right-4 z-50 rounded-xl bg-[#831843] text-white px-4 py-2.5 text-xs font-semibold shadow-lg no-print">
          {cartToast}
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {view === 'home' && (
          <StorefrontHome
            locale={locale}
            products={products}
            settings={settings}
            reviews={reviews}
            earliestCourierDate={earliestCourierDate}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onNavigate={(v) => navigate(v)}
          />
        )}

        {view === 'catalogue' && (
          <CatalogueView
            locale={locale}
            products={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
          />
        )}

        {view === 'checkout' && (
          <CheckoutView
            locale={locale}
            cart={cart}
            products={products}
            shippingRates={shippingRates}
            settings={settings}
            capacity={capacity}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onClearCart={() => setCart([])}
            onBrowseCatalogue={() => navigate('catalogue')}
            onOrderCompleted={(tracking) => {
              setActiveTracking(tracking);
              setActiveTrackingQuery(tracking.orderNo);
              navigate('track');
            }}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {view === 'track' && (
          <OrderTrackingView
            locale={locale}
            initialTracking={activeTracking}
            initialQuery={activeTrackingQuery}
          />
        )}

        {view === 'info' && <InfoFaqView locale={locale} settings={settings} />}

        {view === 'my-orders' && (
          <MyOrdersView
            locale={locale}
            onOpenAuth={() => setAuthModalOpen(true)}
            onReorder={handleReorder}
            onTrackOrder={(tr, tok) => {
              setActiveTracking(tr);
              setActiveTrackingQuery(tok);
              navigate('track');
            }}
          />
        )}

        {view === 'admin' && (
          <AdminDashboardView
            locale={locale}
            products={products}
            shippingRates={shippingRates}
            settings={settings}
            capacity={capacity}
            reviews={reviews}
            onRefreshStore={loadStoreData}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}
      </main>

      {/* Mobile Compact Sticky Cart Bar (kept <15% viewport height) */}
      {cartCount > 0 && view !== 'checkout' && view !== 'admin' && (
        <div className="md:hidden fixed inset-x-0 bottom-0 z-30 border-t border-[#E5A93C]/30 bg-[#FAF7F2]/92 backdrop-blur-md px-4 py-2.5 flex items-center justify-between gap-3 no-print">
          <div className="text-xs">
            <span className="font-semibold text-[#554336] block">
              {cartCount} {locale === 'ms' ? 'kek dalam troli' : 'items in cart'}
            </span>
            <span className="font-bold text-sm text-[#292524] tabular-nums">
              {formatMYR(cartSubtotalSen)}
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate('checkout')}
            className="px-4 py-2 rounded-lg bg-[#D97706] text-white text-xs font-semibold whitespace-nowrap shrink-0"
          >
            {locale === 'ms' ? 'Tempah Sekarang' : 'Checkout Now'}
          </button>
        </div>
      )}

      {/* Quiet Footer */}
      <footer className="border-t border-[#E7DDD3] bg-[#FFFDF9] mt-12 py-8 px-4 sm:px-6 lg:px-8 no-print">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#554336]">
          <div className="space-y-1">
            <p className="font-display text-base font-bold text-[#292524]">{settings.storeName}</p>
            <p>
              {settings.ssmNo} · {settings.contactPhone} · {settings.contactEmail}
            </p>
          </div>
          <div className="flex flex-wrap gap-4 font-medium">
            <button type="button" onClick={() => navigate('catalogue')} className="hover:underline">
              {t(locale, 'navCatalogue')}
            </button>
            <button type="button" onClick={() => navigate('track')} className="hover:underline">
              {t(locale, 'navTrack')}
            </button>
            <button type="button" onClick={() => navigate('info')} className="hover:underline">
              {locale === 'ms' ? 'Terma & Privasi PDPA' : 'Terms & PDPA'}
            </button>
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="hover:underline text-[#831843] font-semibold"
            >
              {firebaseUser ? t(locale, 'navMyOrders') : t(locale, 'signInGoogle')}
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ProductDetailModal
        key={selectedProduct?.id || 'closed'}
        product={selectedProduct}
        locale={locale}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        locale={locale}
        onNavigate={(v) => navigate(v)}
      />
    </div>
  );
};

export default function App() {
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      const saved = localStorage.getItem('dmayra_locale');
      return saved === 'en' ? 'en' : 'ms';
    } catch {
      return 'ms';
    }
  });

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem('dmayra_locale', next);
    } catch {
      // ignore
    }
  };

  return (
    <ErrorBoundary>
      <AuthProvider locale={locale}>
        <InnerApp locale={locale} setLocale={setLocale} />
      </AuthProvider>
    </ErrorBoundary>
  );
}
