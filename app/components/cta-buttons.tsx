'use client';

import styles from '../styles/cta.module.css';

export default function CtaButtons() {
  return (
    <div className={styles.ctaContainer}>
      <button 
        className={`${styles.ctaButton} ${styles.primary}`} 
        onClick={() => (window.location.href = '/store')}
      >
        BROWSE COLLECTION
      </button>

      <button 
        className={`${styles.ctaButton} ${styles.secondary}`} 
        onClick={() => (window.location.href = '/connect')}
      >
        JOIN COMMUNITY
      </button>
    </div>
  );
}