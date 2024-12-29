import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import TimeSheetGrid from './TimeSheet/TimeSheetGrid';
import TimeSheetHelp from './TimeSheet/TimeSheetHelp';
import ExportModal from './TimeSheet/ExportModal';
import MissionSummary from './TimeSheet/MissionSummary';
import { formatCurrency } from '../utils/formatters';

export default function TimeSheet({ 
  missions = [], 
  timeEntries = [],
  selectedMonth,
  onMonthChange,
  onAddEntry, 
  onUpdateEntry, 
  onRemoveEntry 
}) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showInactiveMissions, setShowInactiveMissions] = useState(false);
  const [showWeekends, setShowWeekends] = useState(false);

  // Filtrer les missions actives
  const activeMissions = missions.filter(mission => 
    showInactiveMissions || mission.status !== 'completed'
  );

  // Calcul des statistiques du mois
  const monthInterval = {
    start: startOfMonth(selectedMonth),
    end: endOfMonth(selectedMonth)
  };

  const monthlyTimeEntries = timeEntries.filter(entry => 
    isWithinInterval(new Date(entry.date), monthInterval)
  );

  const stats = {
    totalDays: monthlyTimeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0),
    activeMissions: activeMissions.length,
    totalRevenue: monthlyTimeEntries.reduce((sum, entry) => {
      const mission = missions.find(m => m.id === entry.missionId);
      return sum + ((entry.duration || 0) * (mission?.rate || 0));
    }, 0),
    averageDailyRate: monthlyTimeEntries.length > 0 
      ? monthlyTimeEntries.reduce((sum, entry) => {
          const mission = missions.find(m => m.id === entry.missionId);
          return sum + ((entry.duration || 0) * (mission?.rate || 0));
        }, 0) / monthlyTimeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0)
      : 0
  };

  const days = eachDayOfInterval(monthInterval);

  const getTotalForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return timeEntries
      .filter(entry => entry.date === dateStr)
      .reduce((sum, entry) => sum + (entry.duration || 0), 0);
  };

  const getDuration = (date, missionId) => {
    const entry = timeEntries.find(
      entry => entry.date === format(date, 'yyyy-MM-dd') && entry.missionId === missionId
    );
    return entry ? entry.duration : '';
  };

  const handleUpdateEntry = async (date, missionId, duration) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const existingEntry = timeEntries.find(
      entry => entry.date === dateStr && entry.missionId === missionId
    );

    try {
      if (duration === '') {
        if (existingEntry) {
          await onRemoveEntry(existingEntry.id);
        }
      } else {
        if (existingEntry) {
          await onUpdateEntry(existingEntry.id, { duration });
        } else {
          await onAddEntry({
            date: dateStr,
            missionId,
            duration,
            createdAt: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats en haut */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm text-gray-500">Jours travaillés</h3>
              <p className="text-2xl font-semibold">{stats.totalDays.toFixed(1)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm text-gray-500">Missions actives</h3>
              <p className="text-2xl font-semibold">{stats.activeMissions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm text-gray-500">Revenu du mois</h3>
              <p className="text-2xl font-semibold">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm text-gray-500">TJM moyen</h3>
              <p className="text-2xl font-semibold">{formatCurrency(stats.averageDailyRate)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Barre d'actions */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onMonthChange(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg flex items-center justify-center w-10 h-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-semibold min-w-[200px] text-center">
            {format(selectedMonth, 'MMMM yyyy', { locale: fr })}
          </h2>
          <button
            onClick={() => onMonthChange(1)}
            className="p-2 hover:bg-gray-100 rounded-lg flex items-center justify-center w-10 h-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showWeekends}
              onChange={(e) => setShowWeekends(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Weekends</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showInactiveMissions}
              onChange={(e) => setShowInactiveMissions(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Missions inactives</span>
          </label>
          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Exporter
          </button>
        </div>
      </div>

      {/* Résumé des missions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeMissions.map(mission => (
          <MissionSummary
            key={mission.id}
            mission={mission}
            timeEntries={timeEntries}
            selectedMonth={selectedMonth}
          />
        ))}
      </div>

      {/* Grille de saisie */}
      <div className="bg-white rounded-lg shadow">
        <TimeSheetGrid
          days={days}
          missions={activeMissions}
          timeEntries={timeEntries}
          onUpdateEntry={handleUpdateEntry}
          getTotalForDate={getTotalForDate}
          getDuration={getDuration}
          showWeekends={showWeekends}
        />

        <div className="p-4 border-t border-gray-100">
          <TimeSheetHelp />
        </div>
      </div>

      {/* Modal d'export */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          missions={activeMissions}
          onExport={({ missions: selectedMissions, includeWeekends }) => {
            setShowExportModal(false);
          }}
        />
      )}
    </div>
  );
}
