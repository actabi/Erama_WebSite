import React from 'react';
import { formatCurrency } from '../../utils/formatters';

export default function RegieMissionSummary({ mission, timeEntries, selectedMonth }) {
  const monthlyEntries = timeEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate.getMonth() === selectedMonth.getMonth() &&
           entryDate.getFullYear() === selectedMonth.getFullYear() &&
           entry.missionId === mission.id;
  });

  const totalWorkedDays = timeEntries
    .filter(entry => entry.missionId === mission.id)
    .reduce((sum, entry) => sum + entry.duration, 0);

  const monthlyDays = monthlyEntries.reduce((sum, entry) => sum + entry.duration, 0);
  const plannedDays = mission.maxDays || 0;
  const availableDays = Math.max(0, plannedDays - totalWorkedDays);
  const progressPercentage = (totalWorkedDays / plannedDays) * 100;

  const getStatusColor = () => {
    if (availableDays < 5) return 'bg-red-100 text-red-800';
    if (availableDays < 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getProgressBarColor = () => {
    if (progressPercentage >= 90) return 'bg-red-500';
    if (progressPercentage >= 75) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">{mission.name}</h2>
          <span className="px-2 py-1 text-sm rounded bg-blue-100 text-blue-800">
            Régie
          </span>
        </div>
        <span className={`px-2 py-1 text-sm rounded ${getStatusColor()}`}>
          {availableDays < 5 ? 'Critique' :
           availableDays < 10 ? 'Attention' :
           'Normal'}
        </span>
      </div>

      <div className="space-y-6">
        {/* Analyse des jours */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Analyse des jours</h3>
          
          {/* Progression */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progression</span>
              <span>{totalWorkedDays.toFixed(1)} / {plannedDays} jours</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${getProgressBarColor()}`}
                style={{ width: `${Math.min(100, progressPercentage)}%` }}
              />
            </div>
          </div>

          {/* Statistiques détaillées */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-600">Jours ce mois</div>
              <div className="text-lg font-semibold">
                {monthlyDays.toFixed(1)} jours
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Jours disponibles</div>
              <div className={`text-lg font-semibold ${
                availableDays < 5 ? 'text-red-600' :
                availableDays < 10 ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {availableDays.toFixed(1)} jours
              </div>
            </div>
          </div>
        </div>

        {/* Analyse financière */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Analyse financière</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">TJM</div>
              <div className="text-lg font-semibold">
                {formatCurrency(mission.rate)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">CA réalisé</div>
              <div className="text-lg font-semibold text-green-600">
                {formatCurrency(totalWorkedDays * mission.rate)}
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="text-sm text-gray-600">CA prévisionnel</div>
            <div className="text-lg font-semibold text-blue-600">
              {formatCurrency(plannedDays * mission.rate)}
            </div>
          </div>
        </div>

        {/* Résumé du mois */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Taux d'occupation</span>
            <span className="font-medium">
              {((monthlyDays / 20) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
