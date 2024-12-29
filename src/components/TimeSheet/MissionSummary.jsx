import React from 'react';
import RegieMissionSummary from './RegieMissionSummary';
import ForfaitMissionSummary from './ForfaitMissionSummary';

export default function MissionSummary({ mission, timeEntries, selectedMonth }) {
  if (mission.type === 'regie') {
    return (
      <RegieMissionSummary
        mission={mission}
        timeEntries={timeEntries}
        selectedMonth={selectedMonth}
      />
    );
  }
  
  if (mission.type === 'forfait') {
    return (
      <ForfaitMissionSummary
        mission={mission}
        timeEntries={timeEntries}
        selectedMonth={selectedMonth}
      />
    );
  }

  return null;
}
