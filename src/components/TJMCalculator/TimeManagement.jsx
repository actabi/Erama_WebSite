import React from 'react';
import { getWorkingDaysDetails } from '../../utils/workingDaysCalculator';
import { formatCurrency } from '../../utils/formatters';

export default function TimeManagement({ 
  parameters, 
  onChange, 
  selectedYear, 
  onYearChange,
  expenses = { personal: {}, professional: {} }
}) {
  const workingDaysInfo = getWorkingDaysDetails(selectedYear);
  const workingTimeOptions = [
    { value: 100, label: 'Temps plein (5/5)' },
    { value: 80, label: 'Temps partiel (4/5)' },
    { value: 60, label: 'Temps partiel (3/5)' },
    { value: 40, label: 'Temps partiel (2/5)' },
    { value: 20, label: 'Temps partiel (1/5)' }
  ];

  const calculateTotalMonthlyExpenses = () => {
    try {
      const personalTotal = Object.values(expenses.personal || {}).reduce((sum, category) => {
        if (typeof category === 'object') {
          return sum + Object.values(category).reduce((catSum, value) => 
            catSum + (parseFloat(value) || 0), 0);
        }
        return sum;
      }, 0);

      const professionalTotal = Object.values(expenses.professional || {}).reduce((sum, category) => {
        if (typeof category === 'object') {
          return sum + Object.values(category).reduce((catSum, value) => 
            catSum + (parseFloat(value) || 0), 0);
        }
        return sum;
      }, 0);

      return personalTotal + professionalTotal;
    } catch (error) {
      console.error('Erreur dans le calcul des dépenses:', error);
      return 0;
    }
  };

  const effectiveWorkingDays = Math.round(workingDaysInfo.workingDays * parameters.timeOff.workingTimeRatio / 100);
  const prospectingDays = Math.round(effectiveWorkingDays * (parameters.timeOff.prospecting / 100));

  return (
    <div className="space-y-8">
      {/* Année de référence */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Année de référence</h3>
        <div className="flex items-center gap-4">
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(parseInt(e.target.value))}
            className="w-48 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i - 2).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <div className="text-sm text-gray-500">
            Sélectionnez l'année pour laquelle vous souhaitez calculer votre TJM
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Jours totaux</div>
            <div className="text-2xl font-bold text-blue-700 mt-1">{workingDaysInfo.totalDays}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 font-medium">Weekends</div>
            <div className="text-2xl font-bold text-gray-700 mt-1">{workingDaysInfo.weekends}</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-sm text-yellow-600 font-medium">Jours fériés</div>
            <div className="text-2xl font-bold text-yellow-700 mt-1">{workingDaysInfo.holidays}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Jours ouvrés</div>
            <div className="text-2xl font-bold text-green-700 mt-1">{workingDaysInfo.workingDays}</div>
          </div>
        </div>
      </div>

      {/* Temps de travail */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Temps de travail</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rythme de travail
            </label>
            <select
              value={parameters.timeOff.workingTimeRatio}
              onChange={(e) => onChange(prev => ({
                ...prev,
                timeOff: { ...prev.timeOff, workingTimeRatio: parseInt(e.target.value) }
              }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {workingTimeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-3">Impact sur le temps de travail</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Temps de travail</span>
                <span className="font-medium">{parameters.timeOff.workingTimeRatio}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Jours par an</span>
                <span className="font-medium">
                  {Math.round((workingDaysInfo.workingDays * parameters.timeOff.workingTimeRatio) / 100)} jours
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Jours par semaine</span>
                <span className="font-medium">
                  {Math.round((parameters.timeOff.workingTimeRatio / 100) * 5)} jours
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Congés et absences */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Congés et absences</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Congés annuels
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={parameters.timeOff.vacation}
                onChange={(e) => onChange(prev => ({
                  ...prev,
                  timeOff: { ...prev.timeOff, vacation: parseInt(e.target.value) || 0 }
                }))}
                className="w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
              />
              <span className="text-gray-600">semaines</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formation
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={parameters.timeOff.training}
                onChange={(e) => onChange(prev => ({
                  ...prev,
                  timeOff: { ...prev.timeOff, training: parseInt(e.target.value) || 0 }
                }))}
                className="w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
              />
              <span className="text-gray-600">semaines</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prospection
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={parameters.timeOff.prospecting}
                onChange={(e) => onChange(prev => ({
                  ...prev,
                  timeOff: { ...prev.timeOff, prospecting: Math.min(Math.max(parseInt(e.target.value) || 0, 0), 100) }
                }))}
                className="w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
              />
              <span className="text-gray-600">% du temps</span>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <span className="font-medium text-gray-600">{prospectingDays} jours</span>
              <span className="ml-2">dédiés à la recherche de nouveaux clients</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Réserve coups durs
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={parameters.timeOff.hardshipReserve}
                onChange={(e) => onChange(prev => ({
                  ...prev,
                  timeOff: { ...prev.timeOff, hardshipReserve: parseInt(e.target.value) || 0 }
                }))}
                className="w-24 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                min="0"
              />
              <span className="text-gray-600">mois</span>
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Dépenses mensuelles :</span>
                <span className="font-medium">{formatCurrency(calculateTotalMonthlyExpenses())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Montant de la réserve :</span>
                <span className="font-medium text-blue-600">
                  {formatCurrency(calculateTotalMonthlyExpenses() * parameters.timeOff.hardshipReserve)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Récapitulatif */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-blue-900 mb-4">Récapitulatif annuel</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Jours ouvrés total</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {workingDaysInfo.workingDays}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-600">Jours effectifs</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">
              {effectiveWorkingDays}
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {[
            {
              label: 'Congés',
              value: Math.round(parameters.timeOff.vacation * 5 * parameters.timeOff.workingTimeRatio / 100)
            },
            {
              label: 'Formation',
              value: Math.round(parameters.timeOff.training * 5 * parameters.timeOff.workingTimeRatio / 100)
            },
            {
              label: 'Prospection',
              value: prospectingDays
            }
          ].map(item => (
            <div key={item.label} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.label}</span>
              <span className="font-medium">-{item.value} jours</span>
            </div>
          ))}
          
          <div className="pt-2 mt-2 border-t border-blue-200">
            <div className="flex justify-between text-blue-900">
              <span className="font-medium">Jours facturables</span>
              <span className="font-bold">
                {Math.round(
                  effectiveWorkingDays -
                  (parameters.timeOff.vacation * 5 * parameters.timeOff.workingTimeRatio / 100) -
                  (parameters.timeOff.training * 5 * parameters.timeOff.workingTimeRatio / 100) -
                  prospectingDays
                )} jours
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
