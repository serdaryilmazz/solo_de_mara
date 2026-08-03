import heroImage from '../../assets/solo_de_mara_main.webp';
import styles from './Hero.module.css';

function Hero({ name, slogan, welcome }) {
  return (
    <header className={styles.hero} role="banner" aria-label="Sol de Mara restoran hero alanı">
      <img
        className={styles.backgroundImage}
        src={heroImage}
        alt=""
        aria-hidden="true"
        draggable="false"
        fetchPriority="high"
      />
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content}>
        <h1 className={styles.title}>{name}</h1>
        <span className={styles.titleDivider} aria-hidden="true" />
        <p className={styles.slogan}>{slogan}</p>
        <p className={styles.welcome}>{welcome}</p>
      </div>
    </header>
  );
}

export default Hero;
