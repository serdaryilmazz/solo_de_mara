import styles from './CategoryNav.module.css';

/**
 * Category filter bar for QR menu.
 * "Tümü" shows all sections, selecting a category filters to show only that one.
 * Mobile-first: horizontal scrollable pill strip.
 */
function CategoryNav({ categories, activeFilter, onFilterChange }) {
  return (
    <nav
      className={styles.nav}
      role="navigation"
      aria-label="Menü kategorileri"
    >
      <div className={styles.track}>
        {/* "Tümü" pill — always first */}
        <button
          className={`${styles.pill} ${activeFilter === null ? styles.active : ''}`}
          onClick={() => onFilterChange(null)}
          aria-current={activeFilter === null ? 'true' : undefined}
          type="button"
        >
          Tümü
        </button>

        {categories.map((category) => (
          <button
            key={category.id}
            className={`${styles.pill} ${activeFilter === category.id ? styles.active : ''}`}
            onClick={() => onFilterChange(category.id)}
            aria-current={activeFilter === category.id ? 'true' : undefined}
            type="button"
          >
            {category.title}
          </button>
        ))}
      </div>
    </nav>
  );
}

export default CategoryNav;
