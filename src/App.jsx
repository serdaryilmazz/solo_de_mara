import menuData from './data/menu.json';
import Hero from './components/Hero/Hero';
import MenuSection from './components/MenuSection/MenuSection';
import Footer from './components/Footer/Footer';

function App() {
  const { restaurant, categories } = menuData;

  return (
    <>
      <Hero
        name={restaurant.name}
        slogan={restaurant.slogan}
        welcome={restaurant.welcome}
      />

      <main>
        {categories.map((category) => (
          <MenuSection key={category.id} category={category} />
        ))}
      </main>

      <Footer restaurantName={restaurant.name} />
    </>
  );
}

export default App;
