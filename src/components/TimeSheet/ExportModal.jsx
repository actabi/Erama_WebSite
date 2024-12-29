import React, { useState } from 'react';
import styles from './styles/ExportModal.module.css';

export default function ExportModal({ isOpen, onClose, missions, onExport }) {
  const [selectedMissions, setSelectedMissions] = useState([]);
  const [includeWeekends, setIncludeWeekends] = useState(false);

  const handleExport = () => {
    onExport({
      missions: missions.filter(m => selectedMissions.includes(m.id)),
      includeWeekends
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Exporter les CRA</h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
          >
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.formGroup}>
            <h3 className={styles.label}>Sélectionner les missions</h3>
            <div className={styles.missionList}>
              {missions.map(mission => (
                <label key={mission.id} className={styles.missionItem}>
                  <input
                    type="checkbox"
                    checked={selectedMissions.includes(mission.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMissions([...selectedMissions, mission.id]);
                      } else {
                        setSelectedMissions(selectedMissions.filter(id => id !== mission.id));
                      }
                    }}
                    className={styles.checkbox}
                  />
                  <span className={styles.missionName}>{mission.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.optionLabel}>
              <input
                type="checkbox"
                checked={includeWeekends}
                onChange={(e) => setIncludeWeekends(e.target.checked)}
                className={styles.checkbox}
              />
              <span>Inclure les weekends</span>
            </label>
          </div>
        </div>

        <div className={styles.footer}>
          <button
            onClick={onClose}
            className={styles.cancelButton}
          >
            Annuler
          </button>
          <button
            onClick={handleExport}
            disabled={selectedMissions.length === 0}
            className={`${styles.exportButton} ${
              selectedMissions.length === 0 ? styles.exportButtonDisabled : styles.exportButtonEnabled
            }`}
          >
            Exporter
          </button>
        </div>
      </div>
    </div>
  );
}
