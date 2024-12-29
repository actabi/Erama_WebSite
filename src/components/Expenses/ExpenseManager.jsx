import React, { useState, useMemo } from 'react';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatCurrency } from '../../utils/formatters';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import ExpenseFilters from './ExpenseFilters';
import TravelExpensesSummary from './TravelExpensesSummary';
import { ImportModal } from '../ExpenseImport';

export default function ExpenseManager({ missions = [], expenses = [], onAdd, onUpdate, onRemove }) {
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [activeTab, setActiveTab] = useState('list');
  const [filters, setFilters] = useState({
    search: '',
    dateFrom: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    dateTo: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    type: 'all',
    missionId: 'all',
    category: 'all',
    minAmount: '',
    maxAmount: ''
  });

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      // Recherche textuelle
      const searchLower = filters.search.toLowerCase();
      if (searchLower && !expense.description?.toLowerCase().includes(searchLower)) {
        return false;
      }

      // Dates
      const expenseDate = parseISO(expense.date);
      if (filters.dateFrom && expenseDate < parseISO(filters.dateFrom)) {
        return false;
      }
      if (filters.dateTo && expenseDate > parseISO(filters.dateTo)) {
        return false;
      }

      // Type
      if (filters.type !== 'all' && expense.type !== filters.type) {
        return false;
      }

      // Mission
      if (filters.missionId !== 'all' && expense.missionId !== filters.missionId) {
        return false;
      }

      // Catégorie
      if (filters.category !== 'all' && expense.category !== filters.category) {
        return false;
      }

      // Montants
      if (filters.minAmount && expense.amount < parseFloat(filters.minAmount)) {
        return false;
      }
      if (filters.maxAmount && expense.amount > parseFloat(filters.maxAmount)) {
        return false;
      }

      return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, filters]);

  // Calcul des totaux
  const totals = useMemo(() => {
    return filteredExpenses.reduce((acc, expense) => {
      if (expense.type === 'mission') {
        acc.mission += expense.amount;
      } else {
        acc.general += expense.amount;
      }
      return acc;
    }, { mission: 0, general: 0 });
  }, [filteredExpenses]);

  return (
    <div className="space-y-6">
      {/* Stats en haut */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm text-gray-500">Total des frais</h3>
              <p className="text-2xl font-semibold">
                {formatCurrency(totals.mission + totals.general)}
              </p>
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
              <h3 className="text-sm text-gray-500">Frais de mission</h3>
              <p className="text-2xl font-semibold">
                {formatCurrency(totals.mission)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm text-gray-500">Frais généraux</h3>
              <p className="text-2xl font-semibold">
                {formatCurrency(totals.general)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Barre d'actions */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'list'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Liste des frais
          </button>
          <button
            onClick={() => setActiveTab('travel')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'travel'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Déplacements
          </button>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Importer
          </button>
          <button
            onClick={() => {
              setEditingExpense(null);
              setShowForm(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Nouveau frais
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="bg-white rounded-lg shadow">
        {activeTab === 'list' && (
          <div className="p-6">
            <ExpenseFilters
              filters={filters}
              setFilters={setFilters}
              missions={missions}
            />
            <ExpenseList
              expenses={filteredExpenses}
              missions={missions}
              onEdit={expense => {
                setEditingExpense(expense);
                setShowForm(true);
              }}
              onRemove={onRemove}
            />
          </div>
        )}

        {activeTab === 'travel' && (
          <div className="p-6">
            <TravelExpensesSummary
              expenses={expenses}
              missions={missions}
            />
          </div>
        )}
      </div>

      {/* Modales */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ExpenseForm
              expense={editingExpense}
              missions={missions}
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  if (editingExpense?.id) {
                    await onUpdate(editingExpense.id, editingExpense);
                  } else {
                    await onAdd({
                      ...editingExpense,
                      createdAt: new Date().toISOString()
                    });
                  }
                  setShowForm(false);
                  setEditingExpense(null);
                } catch (error) {
                  console.error('Erreur lors de la sauvegarde:', error);
                }
              }}
              onCancel={() => {
                setShowForm(false);
                setEditingExpense(null);
              }}
            />
          </div>
        </div>
      )}

      {showImportModal && (
        <ImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImport={async (expenses) => {
            try {
              for (const expense of expenses) {
                await onAdd(expense);
              }
            } catch (error) {
              console.error('Erreur lors de l\'import:', error);
            }
          }}
        />
      )}
    </div>
  );
}
