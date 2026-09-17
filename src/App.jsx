import { useState, useMemo, useEffect } from 'react';
import menuData from './data/menu.json';
import Hero from './components/Hero/Hero';
import CategoryNav from './components/CategoryNav/CategoryNav';
import MenuSection from './components/MenuSection/MenuSection';
import WheelModal from './components/WheelModal/WheelModal';
import Footer from './components/Footer/Footer';
import ProductDetail from './components/ProductDetail/ProductDetail';

function getProductIdFromHash() {
  return new URLSearchParams(window.location.hash.slice(1)).get('product');
}

function runPageTransition(update) {
  if (typeof document.startViewTransition === 'function') {
    document.startViewTransition(update);
    return;
  }

  update();
}

function App() {
  const { restaurant, categories } = menuData;

  /** null = "Tümü" (show all), string = specific category id */
  const [activeFilter, setActiveFilter] = useState(null);

  /** State for "Bugün Ne Yesem?" Wheel Modal */
  const [isWheelOpen, setIsWheelOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(getProductIdFromHash);

  const allProducts = useMemo(
    () => categories.flatMap((category) => category.items.map((item) => ({ ...item, category }))),
    [categories],
  );

  useEffect(() => {
    const syncProductFromUrl = () => {
      runPageTransition(() => setSelectedProductId(getProductIdFromHash()));
    };
    window.addEventListener('hashchange', syncProductFromUrl);
    return () => window.removeEventListener('hashchange', syncProductFromUrl);
  }, []);

  useEffect(() => {
    const preventImageContextMenu = (event) => {
      if (event.target instanceof HTMLImageElement) {
        event.preventDefault();
      }
    };

    document.addEventListener('contextmenu', preventImageContextMenu);
    return () => document.removeEventListener('contextmenu', preventImageContextMenu);
  }, []);

  /** Filter categories based on active selection */
  const visibleCategories = activeFilter
    ? categories.filter((cat) => cat.id === activeFilter)
    : categories;

  /**
   * Filter items for the Wheel:
   * Exclude Desserts ("desserts") and Beverages ("beverages")
   * Include only main food items (Burgers & Mexican Street Food)
   */
  const foodItemsForWheel = useMemo(() => {
    const excludedIds = ['desserts', 'beverages'];
    const eligibleCategories = categories.filter(
      (cat) => !excludedIds.includes(cat.id)
    );
    return eligibleCategories.flatMap((cat) => cat.items);
  }, [categories]);

  const selectedProduct = allProducts.find((item) => item.id === selectedProductId && item.hasDetailPage);

  if (selectedProduct) {
    return (
      <ProductDetail
        item={selectedProduct}
        category={selectedProduct.category}
        onBack={() => { window.location.hash = ''; }}
      />
    );
  }

  return (
    <>
      <Hero
        name={restaurant.name}
        slogan={restaurant.slogan}
        welcome={restaurant.welcome}
        onOpenWheel={() => setIsWheelOpen(true)}
      />

      <CategoryNav
        categories={categories}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <main>
        {visibleCategories.map((category) => (
          <MenuSection key={category.id} category={category} />
        ))}
      </main>

      <Footer restaurantName={restaurant.name} />

      {/* "Bugün Ne Yesem?" Wheel Modal */}
      <WheelModal
        isOpen={isWheelOpen}
        onClose={() => setIsWheelOpen(false)}
        items={foodItemsForWheel}
      />
    </>
  );
}

export default App;
