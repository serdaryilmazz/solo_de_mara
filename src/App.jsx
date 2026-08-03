import { useState } from 'react';
import menuData from './data/menu.json';
import Hero from './components/Hero/Hero';
import CategoryNav from './components/CategoryNav/CategoryNav';
import MenuSection from './components/MenuSection/MenuSection';
import Footer from './components/Footer/Footer';

function App() {
  const { restaurant, categories } = menuData;

  /** null = "Tümü" (show all), string = specific category id */
  const [activeFilter, setActiveFilter] = useState(null);

  /** Filter categories based on active selection */
  const visibleCategories = activeFilter
    ? categories.filter((cat) => cat.id === activeFilter)
    : categories;

  return (
    <>
      <Hero
        name={restaurant.name}
        slogan={restaurant.slogan}
        welcome={restaurant.welcome}
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
    </>
  );
}

export default App;
