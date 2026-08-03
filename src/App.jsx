import { useState, useMemo } from 'react';
import menuData from './data/menu.json';
import Hero from './components/Hero/Hero';
import CategoryNav from './components/CategoryNav/CategoryNav';
import MenuSection from './components/MenuSection/MenuSection';
import WheelModal from './components/WheelModal/WheelModal';
import Footer from './components/Footer/Footer';

function App() {
  const { restaurant, categories } = menuData;

  /** null = "Tümü" (show all), string = specific category id */
  const [activeFilter, setActiveFilter] = useState(null);

  /** State for "Bugün Ne Yesem?" Wheel Modal */
  const [isWheelOpen, setIsWheelOpen] = useState(false);

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
