import React from 'react';
import { formatCurrency } from '../../utils/formatters';

export default function MissionOverview({ mission, timeEntries, selectedMonth }) {
  // Calcul des statistiques pour le mois sélectionné
  const monthlyEntries = timeEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate.getMonth() === selectedMonth.getMonth() &&
           entryDate.getFullYear() === selectedMonth.getFullYear() &&
           entry.missionId === mission.id;
  });

  const monthlyDays = monthlyEntries.reduce((sum, entry) => sum + entry.duration, 0);
  const totalWorkedDays = timeEntries
    .filter(entry => entry.missionId === mission.id)
    .reduce((sum, entry) => sum + entry.duration, 0);
  
  const plannedDays = mission.maxDays || 0;
  const availableDays = Math.max(0, plannedDays - totalWorkedDays);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium">{mission.name}</h3>
          <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
            {mission.type === 'regie' ? 'Régie' : 'Forfait'}
          </span>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Ce mois :</span>
          <span className="font-medium">{monthlyDays.toFixed(1)} jours</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Jours travaillés :</span>
          <span className="font-medium text-blue-600">{totalWorkedDays.toFixed(1)} j</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Jours planifiés :</span>
          <span className="font-medium text-green-600">{plannedDays.toFixed(1)} j</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Jours disponibles :</span>
          <span className={`font-medium ${availableDays < 5 ? 'text-red-600' : ''}`}>
            {availableDays.toFixed(1)} j
          </span>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="flex h-full">
          <div 
            className="bg-blue-500"
            style={{ width: `${(totalWorkedDays / plannedDays) * 100}%` }}
          />
          <div 
            className="bg-green-500"
            style={{ width: `${(availableDays / plannedDays) * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between">
          <span className="text-gray-600">TJM :</span>
          <span className="font-medium">{formatCurrency(mission.rate)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Montant total :</span>
          <span className="font-medium">{formatCurrency(totalWorkedDays * mission.rate)}</span>
        </div>
      </div>
    </div>
  );
}
