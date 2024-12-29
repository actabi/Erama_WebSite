import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isAfter } from 'date-fns';
import { fr } from 'date-fns/locale';
import MissionSummary from './MissionSummary';
import TimeSheetGrid from './TimeSheetGrid';
import TimeSheetHelp from './TimeSheetHelp';
import ExportModal from './ExportModal';
import { generatePDF } from './pdfGenerator';

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
  const activeMissions = missions.filter(mission => {
    if (showInactiveMissions) {
      return true;
    }

    if (mission.status === 'completed') {
      return false;
    }

    const today = new Date();

    if (mission.type === 'regie') {
      // Pour les missions en régie, vérifier les jours restants
      const totalWorkedDays = timeEntries
        .filter(entry => entry.missionId === mission.id)
        .reduce((sum, entry) => sum + entry.duration, 0);
      return totalWorkedDays < (mission.maxDays || 0);
    } else {
      // Pour les missions forfait, vérifier la date de fin
      const endDate = mission.deadline ? new Date(mission.deadline) : null;
      return endDate ? isAfter(endDate, today) : true;
    }
  });

  // Générer les jours du mois
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Calculer le total pour une date donnée
  const getTotalForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return timeEntries
      .filter(entry => entry.date === dateStr)
      .reduce((sum, entry) => sum + (entry.duration || 0), 0);
  };

  // Obtenir la durée pour une date et une mission données
  const getDuration = (date, missionId) => {
    const entry = timeEntries.find(
      entry => entry.date === format(date, 'yyyy-MM-dd') && entry.missionId === missionId
    );
    return entry ? entry.duration : '';
  };

  // Gérer l'export
  const handleExport = ({ missions: selectedMissions, includeWeekends }) => {
    selectedMissions.forEach(mission => {
      generatePDF({
        mission,
        timeEntries: timeEntries.filter(entry => entry.missionId === mission.id),
        selectedMonth,
        includeWeekends,
        consultant: {
          name: "Consultant", // À remplacer par les vraies données du consultant
          company: "Société"
        }
      });
    });
  };

  return (
    <div className="space-y-8">
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
      {activeMissions.length > 0 ? (
        <div className="space-y-4">
          {activeMissions.map(mission => (
            <MissionSummary
              key={mission.id}
              mission={mission}
              timeEntries={timeEntries}
              selectedMonth={selectedMonth}
            />
          ))}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
          Aucune mission active pour ce mois. 
          {!showInactiveMissions && (
            <button
              onClick={() => setShowInactiveMissions(true)}
              className="ml-2 text-yellow-600 underline hover:text-yellow-800"
            >
              Afficher les missions inactives
            </button>
          )}
        </div>
      )}

      {/* Grille de saisie */}
      {activeMissions.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <TimeSheetGrid
            days={days}
            missions={activeMissions}
            timeEntries={timeEntries}
            onUpdateEntry={onUpdateEntry}
            getTotalForDate={getTotalForDate}
            getDuration={getDuration}
            showWeekends={showWeekends}
          />

          <div className="p-4 border-t border-gray-100">
            <TimeSheetHelp />
          </div>
        </div>
      )}

      {/* Modal d'export */}
      {showExportModal && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          missions={activeMissions}
          onExport={handleExport}
        />
      )}
    </div>
  );
}
