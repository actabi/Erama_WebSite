import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatCurrency } from '../../utils/formatters';

export default function TravelExpensesSummary({ expenses, missions }) {
  // Grouper les dépenses par déplacement (basé sur les hébergements)
  const travelPeriods = expenses
    .filter(e => e.category === 'hebergement' && e.stayStartDate && e.stayEndDate)
    .sort((a, b) => new Date(b.stayStartDate) - new Date(a.stayStartDate))
    .map(hotel => {
      const mission = missions.find(m => m.id === hotel.missionId);
      const periodExpenses = expenses.filter(expense =>
        expense.missionId === hotel.missionId &&
        expense.id !== hotel.id &&
        new Date(expense.date) >= new Date(hotel.stayStartDate) &&
        new Date(expense.date) <= new Date(hotel.stayEndDate)
      );

      const totalExpenses = parseFloat(hotel.amount) +
        periodExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

      const nights = Math.round(
        (new Date(hotel.stayEndDate) - new Date(hotel.stayStartDate)) / (1000 * 60 * 60 * 24)
      );

      return {
        mission,
        hotel,
        expenses: periodExpenses,
        totalExpenses,
        nights
      };
    });

  if (travelPeriods.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        Aucun déplacement trouvé. Ajoutez des frais d'hébergement avec des dates de séjour pour voir le récapitulatif ici.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {travelPeriods.map((period, index) => (
        <div key={index} className="bg-white rounded-lg shadow border border-gray-200">
          <div className="bg-gray-50 px-4 py-3 rounded-t-lg border-b">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-lg">{period.mission?.name}</h3>
                <p className="text-sm text-gray-600">
                  Du {format(new Date(period.hotel.stayStartDate), 'dd MMMM', { locale: fr })} au{' '}
                  {format(new Date(period.hotel.stayEndDate), 'dd MMMM yyyy', { locale: fr })}
                </p>
                <p className="text-sm text-gray-600">
                  {period.nights} nuit{period.nights > 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-medium">{formatCurrency(period.totalExpenses)}</div>
                <div className="text-sm text-gray-600">Total déplacement</div>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{period.hotel.description}</div>
                  <div className="text-sm text-gray-600">Hébergement</div>
                  <div className="text-sm text-gray-600">
                    {format(new Date(period.hotel.date), 'dd/MM/yyyy')}
                  </div>
                </div>
                <div className="font-medium">{formatCurrency(period.hotel.amount)}</div>
              </div>
            </div>

            {period.expenses.map((expense, i) => (
              <div 
                key={i}
                className="flex justify-between items-start p-3 border-b border-gray-100 last:border-0"
              >
                <div>
                  <div className="font-medium">{expense.description}</div>
                  <div className="text-sm text-gray-600">
                    {expense.category === 'transport' ? 'Transport' :
                     expense.category === 'restaurant' ? 'Restaurant' :
                     expense.category === 'autres' ? 'Autre' : 
                     expense.category}
                  </div>
                  <div className="text-sm text-gray-600">
                    {format(new Date(expense.date), 'dd/MM/yyyy')}
                  </div>
                </div>
                <div className="font-medium">{formatCurrency(expense.amount)}</div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 px-4 py-3 rounded-b-lg border-t">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Coût moyen par jour</div>
                <div className="font-medium">
                  {formatCurrency(period.totalExpenses / (period.nights + 1))}
                </div>
              </div>
              <div className="text-right">
                <div className="text-gray-600">Coût par nuit</div>
                <div className="font-medium">
                  {formatCurrency(period.hotel.amount / period.nights)}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
