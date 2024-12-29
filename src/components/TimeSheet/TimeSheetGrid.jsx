import React, { useRef } from 'react';
import { format, isWeekend, isToday, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale';
import styles from './styles/TimeSheetGrid.module.css';

export default function TimeSheetGrid({ 
  days,
  missions,
  timeEntries,
  onUpdateEntry,
  getTotalForDate,
  getDuration,
  showWeekends
}) {
  const inputRefs = useRef({});

  const getCellId = (date, missionId) => `${format(date, 'yyyy-MM-dd')}-${missionId}`;

  const handleKeyDown = (e, date, missionId) => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
      
      const currentDateStr = format(date, 'yyyy-MM-dd');
      const currentMissionIndex = missions.findIndex(m => m.id === missionId);
      const currentDayIndex = days.findIndex(d => format(d, 'yyyy-MM-dd') === currentDateStr);
      
      let nextDate, nextMissionId;

      switch(e.key) {
        case 'ArrowLeft':
          if (currentDayIndex > 0) {
            nextDate = days[currentDayIndex - 1];
            nextMissionId = missionId;
          }
          break;
        case 'ArrowRight':
          if (currentDayIndex < days.length - 1) {
            nextDate = days[currentDayIndex + 1];
            nextMissionId = missionId;
          }
          break;
        case 'ArrowUp':
          if (currentMissionIndex > 0) {
            nextDate = date;
            nextMissionId = missions[currentMissionIndex - 1].id;
          }
          break;
        case 'ArrowDown':
          if (currentMissionIndex < missions.length - 1) {
            nextDate = date;
            nextMissionId = missions[currentMissionIndex + 1].id;
          }
          break;
      }

      if (nextDate && nextMissionId) {
        const nextCellId = getCellId(nextDate, nextMissionId);
        const nextInput = inputRefs.current[nextCellId];
        if (nextInput) {
          nextInput.focus();
          nextInput.select();
        }
      }
    } else if (e.key >= '0' && e.key <= '1') {
      e.preventDefault();
      onUpdateEntry(date, missionId, e.key === '1' ? 1 : 0);
    } else if (e.key === '.') {
      e.preventDefault();
      onUpdateEntry(date, missionId, 0.5);
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      onUpdateEntry(date, missionId, '');
    }
  };

  const handleChange = (e, date, missionId) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(value) && value >= 0 && value <= 1)) {
      onUpdateEntry(date, missionId, value);
    }
  };

  const filteredDays = days.filter(day => showWeekends || !isWeekend(day));

  return (
    <div className={styles.gridContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.missionHeader}>Mission</th>
            {filteredDays.map(day => {
              const isWeekendDay = isWeekend(day);
              const isCurrentDay = isToday(day);
              return (
                <th 
                  key={day.toString()} 
                  className={`${styles.dayHeader} 
                    ${isWeekendDay ? styles.weekend : ''} 
                    ${isCurrentDay ? styles.today : ''}`}
                >
                  <div className={styles.dayNumber}>
                    {format(day, 'd')}
                  </div>
                  <div className={styles.dayName}>
                    {format(day, 'EEE', { locale: fr })}
                  </div>
                  <div className={styles.dayTotal}>
                    {getTotalForDate(day).toFixed(1)}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {missions.map(mission => (
            <tr key={mission.id}>
              <td className={styles.missionCell}>{mission.name}</td>
              {filteredDays.map(day => {
                const cellId = getCellId(day, mission.id);
                const totalForDay = getTotalForDate(day);
                const isDeadlinePassed = mission.type === 'forfait' && isBefore(day, new Date(mission.deadline));
                
                return (
                  <td 
                    key={day.toString()} 
                    className={`${styles.dayCell} 
                      ${isWeekend(day) ? styles.weekend : ''} 
                      ${isToday(day) ? styles.today : ''}
                      ${mission.type === 'forfait' ? (isDeadlinePassed ? styles.beforeDeadline : styles.afterDeadline) : ''}`}
                  >
                    <input
                      ref={el => inputRefs.current[cellId] = el}
                      type="text"
                      value={getDuration(day, mission.id)}
                      onChange={(e) => handleChange(e, day, mission.id)}
                      onKeyDown={(e) => handleKeyDown(e, day, mission.id)}
                      className={`${styles.timeInput} ${totalForDay > 1 ? styles.timeInputError : ''}`}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
