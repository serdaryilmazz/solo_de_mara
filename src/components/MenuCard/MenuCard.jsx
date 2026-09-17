import { getImagePath } from '../../utils/imageMap';
import { formatItemPrice, formatPrice } from '../../utils/formatPrice';
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
      {item.hasDetailPage ? (
        <a className={styles.cardLink} href={`#product=${item.id}`} aria-label={`${item.name} detaylarını görüntüle`}>
          <CardContent item={item} imageSrc={imageSrc} />
        </a>
      ) : (
        <CardContent item={item} imageSrc={imageSrc} />
      )}
    </article>
  );
}

function CardContent({ item, imageSrc }) {
  return (
    <>
      <div className={styles.imageWrapper}>
        {imageSrc ? (
          <img className={styles.image} src={imageSrc} alt={item.name} loading="lazy" decoding="async" draggable="false" />
        ) : (
          <div className={styles.imageFallback} aria-label={item.name}>
            <span>Sol de Mara</span>
            <strong>{item.name}</strong>
          </div>
        )}
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{item.name}</h3>
        {item.subtitle && <span className={styles.subtitle}>{item.subtitle}</span>}
        {!item.hasDetailPage && item.description && <p className={styles.description}>{item.description}</p>}
        <p
          className={`${styles.price} ${item.prices?.length ? styles.variantPrices : ''}`}
          aria-label={`Fiyat: ${formatItemPrice(item)}`}
        >
          {item.prices?.length
            ? item.prices.map(({ label, amount }) => (
              <span key={label}>{label}: {formatPrice(amount)}</span>
            ))
            : formatItemPrice(item)}
        </p>
        {item.hasDetailPage && <span className={styles.detailHint}>Detayları görüntüle <span aria-hidden="true">→</span></span>}
      </div>
    </>
  );
}

export default MenuCard;
