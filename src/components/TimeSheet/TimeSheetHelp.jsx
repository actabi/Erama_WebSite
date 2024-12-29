import React from 'react';
import styles from './styles/TimeSheetHelp.module.css';

export default function TimeSheetHelp() {
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Navigation</h3>
        <ul className={styles.helpList}>
          <li className={styles.helpItem}>
            <kbd className={styles.kbd}>←</kbd>
            <kbd className={styles.kbd}>→</kbd>
            <kbd className={styles.kbd}>↑</kbd>
            <kbd className={styles.kbd}>↓</kbd>
            <span className={styles.helpText}>pour naviguer dans la grille</span>
          </li>
          <li className={styles.helpItem}>
            <kbd className={styles.kbd}>Tab</kbd>
            <span className={styles.helpText}>pour passer à la cellule suivante</span>
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Raccourcis</h3>
        <ul className={styles.helpList}>
          <li className={styles.helpItem}>
            <kbd className={styles.kbd}>1</kbd>
            <span className={styles.helpText}>journée complète</span>
          </li>
          <li className={styles.helpItem}>
            <kbd className={styles.kbd}>0</kbd>
            <span className={styles.helpText}>aucun temps</span>
          </li>
          <li className={styles.helpItem}>
            <kbd className={styles.kbd}>.</kbd>
            <span className={styles.helpText}>demi-journée</span>
          </li>
          <li className={styles.helpItem}>
            <kbd className={styles.kbd}>Suppr</kbd>
            <span className={styles.helpText}>effacer l'entrée</span>
          </li>
        </ul>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Validation</h3>
        <ul className={styles.helpList}>
          <li className={styles.helpItem}>
            <span className={styles.indicator}>🔴</span>
            <span className={styles.helpText}>indique un dépassement (total &gt; 1 jour)</span>
          </li>
          <li className={styles.helpItem}>
            <span className={styles.indicator}>✓</span>
            <span className={styles.helpText}>sauvegarde automatique</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
