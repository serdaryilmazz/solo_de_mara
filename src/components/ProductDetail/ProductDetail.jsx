import { useEffect } from 'react';
import { getImagePath } from '../../utils/imageMap';
import { formatPrice } from '../../utils/formatPrice';
import styles from './ProductDetail.module.css';

function ProductDetail({ item, category, onBack }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [item.id]);

  return (
    <main className={styles.page}>
      <header className={styles.topBar}>
        <button className={styles.backButton} onClick={onBack} type="button">
          <span aria-hidden="true">←</span> Menüye dön
        </button>
        <span className={styles.brand}>Sol de Mara</span>
      </header>

      <article className={styles.detail}>
        <div className={styles.imageFrame}>
          <img
            src={getImagePath(item.image)}
            alt={item.name}
            className={styles.image}
            draggable="false"
            onContextMenu={(event) => event.preventDefault()}
          />
          <div className={styles.imageOverlay} aria-hidden="true" />
          <span className={styles.category}>{category.title}</span>
        </div>

        <div className={styles.content}>
          <p className={styles.eyebrow}>Sol de Mara seçkisi</p>
          <h1 className={styles.title}>{item.name}</h1>
          {item.subtitle && <p className={styles.slogan}>“{item.subtitle}”</p>}
          <span className={styles.divider} aria-hidden="true" />
          <p className={styles.description}>{item.description}</p>

          <section className={styles.prices} aria-label="Fiyat seçenekleri">
            <h2>{item.prices?.length ? 'Seçenekler' : 'Fiyat'}</h2>
            {item.prices?.length ? (
              item.prices.map(({ label, amount }) => (
                <div className={styles.priceRow} key={label}>
                  <span>{label}</span>
                  <strong>{formatPrice(amount)}</strong>
                </div>
              ))
            ) : (
              <div className={styles.priceRow}>
                <span>{item.name}</span>
                <strong>{formatPrice(item.price)}</strong>
              </div>
            )}
          </section>

          {item.allergens?.length > 0 && (
            <section className={styles.allergens} aria-label="Alerjen bilgisi">
              <h2>Alerjenler</h2>
              <p>{item.allergens.join(', ')}</p>
            </section>
          )}
        </div>
      </article>
    </main>
  );
}

export default ProductDetail;
