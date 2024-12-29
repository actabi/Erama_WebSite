import React, { useMemo } from 'react';
import { formatCurrency } from '../../utils/formatters';
import { differenceInBusinessDays, differenceInDays } from 'date-fns';

export default function ForfaitMissionSummary({ mission, timeEntries, selectedMonth }) {
  const tjmResults = useMemo(() => {
    try {
      const stored = localStorage.getItem('tjmCalculatorResults');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Erreur lors de la lecture des résultats TJM:', error);
      return null;
    }
  }, []);

  const startDate = new Date(mission.startDate);
  const deadline = new Date(mission.deadline);

  // Calcul des jours en fonction de l'option includeWeekends
  const calculateDaysBetweenDates = (start, end) => {
    if (mission.includeWeekends) {
      return differenceInDays(end, start) + 1;
    }
    return differenceInBusinessDays(end, start) + 1;
  };

  const totalMissionDays = calculateDaysBetweenDates(startDate, deadline);

  // Calcul des jours travaillés
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

  // Calculs des TJM
  const minimumTJM = tjmResults?.minimumTJM || 0;
  const comfortableTJM = tjmResults?.comfortableTJM || 0;

  // TJM projetés
  const projectedMinimumTJM = totalWorkedDays > 0 ? mission.amount / totalWorkedDays : 0;
  const projectedComfortableTJM = totalWorkedDays > 0 ? (mission.amount * 1.2) / totalWorkedDays : 0;

  const isWithinBudget = projectedMinimumTJM >= minimumTJM;
  const isComfortable = projectedMinimumTJM >= comfortableTJM;
  const progressPercentage = (totalWorkedDays / mission.estimatedDays) * 100;

  const getStatusColor = () => {
    if (isComfortable) return 'bg-green-100 text-green-800';
    if (isWithinBudget) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getProgressBarColor = () => {
    if (progressPercentage > 100) return 'bg-red-500';
    if (progressPercentage > 80) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold">{mission.name}</h2>
          <span className="px-2 py-1 text-sm rounded bg-green-100 text-green-800">
            Forfait {mission.includeWeekends ? '(WE inclus)' : ''}
          </span>
        </div>
        <span className={`px-2 py-1 text-sm rounded ${getStatusColor()}`}>
          {isComfortable ? 'Confortable' :
           isWithinBudget ? 'Budget respecté' :
           'Budget dépassé'}
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
              <span>{totalWorkedDays.toFixed(1)} / {mission.estimatedDays} jours</span>
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
              <div className="text-sm text-gray-600">Jours restants</div>
              <div className="text-lg font-semibold">
                {Math.max(0, mission.estimatedDays - totalWorkedDays).toFixed(1)} jours
              </div>
            </div>
          </div>
        </div>

        {/* Analyse financière */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Analyse financière</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">TJM minimum projeté</div>
              <div className={`text-lg font-semibold ${
                projectedMinimumTJM >= minimumTJM ? 'text-green-600' : 'text-red-600'
              }`}>
                {projectedMinimumTJM > 0 ? formatCurrency(projectedMinimumTJM) : '-'}
              </div>
              <div className="text-xs text-gray-500">
                Minimum requis : {formatCurrency(minimumTJM)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">TJM confortable projeté</div>
              <div className={`text-lg font-semibold ${
                projectedComfortableTJM >= comfortableTJM ? 'text-green-600' : 'text-red-600'
              }`}>
                {projectedComfortableTJM > 0 ? formatCurrency(projectedComfortableTJM) : '-'}
              </div>
              <div className="text-xs text-gray-500">
                Confortable requis : {formatCurrency(comfortableTJM)}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="text-sm text-gray-600">Montant forfait</div>
            <div className="text-lg font-semibold">
              {formatCurrency(mission.amount)}
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
