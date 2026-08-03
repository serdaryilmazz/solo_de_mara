import { useInView } from '../../hooks/useInView';
import styles from './Footer.module.css';

function Footer({ restaurantName }) {
  const currentYear = new Date().getFullYear();
  const [footerRef, isInView] = useInView({ threshold: 0.2 });

  return (
    <footer
      ref={footerRef}
      className={`${styles.footer} ${isInView ? styles.visible : ''}`}
      role="contentinfo"
    >
      <div className={styles.dividerWrapper} aria-hidden="true">
        <span className={styles.dividerLine} />
        <span className={styles.dividerIcon}>☀</span>
        <span className={styles.dividerLine} />
      </div>

      <p className={styles.brand}>{restaurantName}</p>
      <p className={styles.tagline}>Where Mexico Meets Maraş</p>
      <p className={styles.copyright}>
        &copy; {currentYear} {restaurantName}. Tüm hakları saklıdır.
      </p>
    </footer>
  );
}

export default Footer;
