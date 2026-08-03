import MenuCard from '../MenuCard/MenuCard';
import { useInView } from '../../hooks/useInView';
import styles from './MenuSection.module.css';

function MenuSection({ category }) {
  const [sectionRef, isInView] = useInView({ threshold: 0.05, rootMargin: '0px 0px -60px 0px' });

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${isInView ? styles.visible : ''}`}
      id={category.id}
      aria-label={`${category.title} menü bölümü`}
    >
      <div className={styles.headerWrapper}>
        <span className={styles.dividerLine} aria-hidden="true" />
        <span className={styles.dividerDiamond} aria-hidden="true">◆</span>
        <h2 className={styles.title}>{category.title}</h2>
        <span className={styles.dividerDiamond} aria-hidden="true">◆</span>
        <span className={styles.dividerLine} aria-hidden="true" />
      </div>

      <div className={styles.grid} role="list" aria-label={`${category.title} ürünleri`}>
        {category.items.map((item, index) => (
          <MenuCard key={item.id} item={item} index={index} isVisible={isInView} />
        ))}
      </div>
    </section>
  );
}

export default MenuSection;
