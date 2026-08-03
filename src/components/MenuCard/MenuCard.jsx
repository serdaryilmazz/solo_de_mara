import { getImagePath } from '../../utils/imageMap';
import styles from './MenuCard.module.css';

function MenuCard({ item, index = 0, isVisible = false }) {
  const imageSrc = getImagePath(item.image);
  const staggerDelay = Math.min(index * 0.08, 0.4) + 0.2;

  return (
    <article
      className={`${styles.card} ${isVisible ? styles.visible : ''}`}
      style={{ transitionDelay: `${staggerDelay}s` }}
      role="listitem"
    >
      <div className={styles.imageWrapper}>
        <img
          className={styles.image}
          src={imageSrc}
          alt={item.name}
          loading="lazy"
          decoding="async"
          draggable="false"
        />
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{item.name}</h3>
        {item.subtitle && (
          <span className={styles.subtitle}>{item.subtitle}</span>
        )}
        {item.description && (
          <p className={styles.description}>{item.description}</p>
        )}
        <p className={styles.price} aria-label={`Fiyat: ${item.price} TL`}>
          {item.price} TL
        </p>
      </div>
    </article>
  );
}

export default MenuCard;
