import React, { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatCurrency } from '../utils/formatters';

export default function Dashboard({ missions, timeEntries, expenses }) {
  const currentMonth = useMemo(() => new Date(), []);
  const monthInterval = useMemo(() => ({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  }), [currentMonth]);

  // Calcul des statistiques du mois
  const monthlyStats = useMemo(() => {
    const monthlyTimeEntries = timeEntries.filter(entry => 
      isWithinInterval(new Date(entry.date), monthInterval)
    );

    const monthlyExpenses = expenses.filter(expense =>
      isWithinInterval(new Date(expense.date), monthInterval)
    );

    const totalDays = monthlyTimeEntries.reduce((sum, entry) => sum + entry.duration, 0);
    
    const revenue = monthlyTimeEntries.reduce((sum, entry) => {
      const mission = missions.find(m => m.id === entry.missionId);
      if (!mission) return sum;
      return sum + (mission.type === 'regie' ? entry.duration * mission.rate : 0);
    }, 0);

    const totalExpenses = monthlyExpenses.reduce((sum, expense) => 
      sum + expense.amount, 0
    );

    return {
      totalDays,
      revenue,
      totalExpenses,
      profit: revenue - totalExpenses
    };
  }, [missions, timeEntries, expenses, monthInterval]);

  // Statistiques des missions actives
  const missionStats = useMemo(() => {
    const activeMissions = missions.filter(m => m.status === 'active');
    
    return activeMissions.map(mission => {
      const missionEntries = timeEntries.filter(entry => entry.missionId === mission.id);
      const totalDays = missionEntries.reduce((sum, entry) => sum + entry.duration, 0);
      const revenue = mission.type === 'regie' 
        ? totalDays * mission.rate 
        : mission.amount;

      return {
        ...mission,
        totalDays,
        revenue,
        progress: mission.type === 'regie' 
          ? (totalDays / mission.maxDays) * 100 
          : (totalDays / mission.estimatedDays) * 100
      };
    });
  }, [missions, timeEntries]);

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Tableau de bord
        </h1>
        <div className="text-sm text-gray-500">
          {format(currentMonth, 'MMMM yyyy', { locale: fr })}
        </div>
      </div>

      {/* Statistiques du mois */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card stat-card-primary">
          <div className="text-sm font-medium opacity-75">Jours travaillés</div>
          <div className="mt-2 flex justify-between items-end">
            <div className="text-3xl font-bold">{monthlyStats.totalDays.toFixed(1)}</div>
            <div className="text-sm opacity-75">jours</div>
          </div>
        </div>

        <div className="stat-card stat-card-success">
          <div className="text-sm font-medium opacity-75">Chiffre d'affaires</div>
          <div className="mt-2 flex justify-between items-end">
            <div className="text-3xl font-bold">{formatCurrency(monthlyStats.revenue)}</div>
            <div className="text-sm opacity-75">ce mois</div>
          </div>
        </div>

        <div className="stat-card from-orange-500 to-orange-600 text-white">
          <div className="text-sm font-medium opacity-75">Dépenses</div>
          <div className="mt-2 flex justify-between items-end">
            <div className="text-3xl font-bold">{formatCurrency(monthlyStats.totalExpenses)}</div>
            <div className="text-sm opacity-75">ce mois</div>
          </div>
        </div>

        <div className="stat-card from-purple-500 to-purple-600 text-white">
          <div className="text-sm font-medium opacity-75">Bénéfice</div>
          <div className="mt-2 flex justify-between items-end">
            <div className="text-3xl font-bold">{formatCurrency(monthlyStats.profit)}</div>
            <div className="text-sm opacity-75">ce mois</div>
          </div>
        </div>
      </div>

      {/* Missions actives */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Missions actives</h2>
          <span className="badge badge-success">
            {missionStats.length} mission{missionStats.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="space-y-4">
          {missionStats.map(mission => (
            <div key={mission.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">{mission.name}</h3>
                  <p className="text-sm text-gray-500">
                    {mission.type === 'regie' 
                      ? `${formatCurrency(mission.rate)}/jour` 
                      : `Forfait: ${formatCurrency(mission.amount)}`}
                  </p>
                </div>
                <span className={`badge ${
                  mission.progress >= 90 ? 'badge-danger' :
                  mission.progress >= 75 ? 'badge-warning' :
                  'badge-success'
                }`}>
                  {mission.progress.toFixed(0)}%
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    mission.progress >= 90 ? 'bg-red-500' :
                    mission.progress >= 75 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(100, mission.progress)}%` }}
                />
              </div>

              <div className="mt-2 flex justify-between text-sm text-gray-500">
                <span>{mission.totalDays.toFixed(1)} jours</span>
                <span>{formatCurrency(mission.revenue)}</span>
              </div>
            </div>
          ))}

          {missionStats.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune mission active</h3>
              <p className="mt-1 text-sm text-gray-500">
                Commencez par créer une nouvelle mission pour voir les statistiques ici.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Évolution du CA</h2>
          </div>
          {/* Ici nous pourrions ajouter un graphique d'évolution du CA */}
          <div className="h-64 flex items-center justify-center text-gray-500">
            Graphique à venir
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Répartition des dépenses</h2>
          </div>
          {/* Ici nous pourrions ajouter un graphique de répartition des dépenses */}
          <div className="h-64 flex items-center justify-center text-gray-500">
            Graphique à venir
          </div>
        </div>
      </div>
    </div>
  );
}
