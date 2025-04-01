// app/components/Hero.tsx
import CtaButtons from './cta-buttons';
import styles from '../styles/hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <video className={styles.heroVideo} autoPlay muted loop playsInline>
        <source src="/videos/homepagevideo_1.mp4" type="video/mp4" />
      </video>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Aerial Creators Hub</h1>
        <p className={styles.heroSubtitle}>
          Connect with passionate drone creators, explore our signature presets, inspire through your aerial artistry
        </p>
        <CtaButtons />
        <div className={styles.heroSocialIcons}>
          <a
            href="https://www.instagram.com/travellers.beats"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIcon}
          >
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a
            href="https://www.youtube.com/@travellersbeats"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIcon}
          >
            <i className="fa-brands fa-youtube"></i>
          </a>
          <a
            href="https://www.tiktok.com/@travellers.beats"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialIcon}
          >
            <i className="fa-brands fa-tiktok"></i>
          </a>
        </div>
      </div>
    </section>
  );
}
