import React from 'react';
import styles from './styles/TimeSheetToolbar.module.css';

export default function TimeSheetToolbar({ 
  onExport, 
  showInactiveMissions,
  onToggleInactiveMissions,
  showWeekends,
  onToggleWeekends
}) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolGroup}>
        <button
          onClick={onExport}
          className={styles.button}
          title="Exporter en PDF"
        >
          <svg 
            className={styles.buttonIcon} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          Exporter
        </button>

        <div className={styles.optionsGroup}>
          <label className={styles.optionLabel}>
            <input
              type="checkbox"
              checked={showWeekends}
              onChange={onToggleWeekends}
              className={styles.checkbox}
            />
            Weekends
          </label>

          <label className={styles.optionLabel}>
            <input
              type="checkbox"
              checked={showInactiveMissions}
              onChange={onToggleInactiveMissions}
              className={styles.checkbox}
            />
            Missions inactives
          </label>
        </div>
      </div>
    </div>
  );
}
