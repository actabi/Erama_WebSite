import React from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatCurrency } from '../../utils/formatters';
import { EXPENSE_CATEGORIES } from './constants';

export default function ExpenseList({ expenses, missions, onEdit, onRemove }) {
  const formatDate = (dateString) => {
    try {
      // Log pour debug
      console.log('Date à formater:', dateString, 'Type:', typeof dateString);

      // Si la date est undefined ou null
      if (!dateString) {
        console.log('Date invalide (null ou undefined)');
        return 'Date non définie';
      }

      let date;
      
      // Si c'est déjà un objet Date
      if (dateString instanceof Date) {
        date = dateString;
      } 
      // Si c'est un timestamp (nombre)
      else if (typeof dateString === 'number') {
        date = new Date(dateString);
      }
      // Si c'est une chaîne de caractères
      else if (typeof dateString === 'string') {
        // Essayer d'abord parseISO pour les dates ISO
        date = parseISO(dateString);
        
        // Si parseISO échoue, essayer new Date()
        if (!isValid(date)) {
          date = new Date(dateString);
        }
      }

      // Vérifier si la date est valide
      if (!isValid(date)) {
        console.log('Date invalide après parsing');
        return 'Date invalide';
      }

      return format(date, 'dd/MM/yyyy', { locale: fr });
    } catch (error) {
      console.error('Erreur de formatage de date:', error, 'pour la date:', dateString);
      return 'Date invalide';
    }
  };

  // Log pour debug
  console.log('Expenses:', expenses);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max">
        <thead>
          <tr className="bg-gray-50">
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Mission/Catégorie</th>
            <th className="p-2 text-left">Description</th>
            <th className="p-2 text-right">Montant</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(expenses) && expenses.map(expense => {
            // Log pour debug
            console.log('Expense:', expense);
            
            return (
              <tr key={expense.id} className="border-t hover:bg-gray-50">
                <td className="p-2">
                  {formatDate(expense.date)}
                </td>
                <td className="p-2">
                  {expense.type === 'mission' ? 'Mission' : 'Général'}
                </td>
                <td className="p-2">
                  {expense.type === 'mission'
                    ? missions.find(m => m.id === expense.missionId)?.name || 'Mission inconnue'
                    : EXPENSE_CATEGORIES.general.find(cat => cat.id === expense.category)?.label || expense.category
                  }
                </td>
                <td className="p-2">{expense.description}</td>
                <td className="p-2 text-right font-medium">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="p-2">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => onEdit(expense)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce frais ?')) {
                          onRemove(expense.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {(!Array.isArray(expenses) || expenses.length === 0) && (
            <tr>
              <td colSpan="6" className="p-4 text-center text-gray-500">
                Aucun frais enregistré
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
