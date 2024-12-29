import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import styles from './styles/TimeSheetHeader.module.css';

export default function TimeSheetHeader({ selectedMonth, onChangeMonth }) {
  return (
    <div className={styles.header}>
      <button
        onClick={() => onChangeMonth(-1)}
        className={styles.navButton}
      >
        ←
      </button>
      
      <h2 className={styles.monthTitle}>
        CRA - {format(selectedMonth, 'MMMM yyyy', { locale: fr })}
      </h2>
      
      <button
        onClick={() => onChangeMonth(1)}
        className={styles.navButton}
      >
        →
      </button>
    </div>
  );
}
