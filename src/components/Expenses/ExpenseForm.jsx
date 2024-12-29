import React from 'react';
import { EXPENSE_CATEGORIES } from './constants';

export default function ExpenseForm({ 
  expense = null,  // Ajout d'une valeur par défaut
  setExpense,
  editingExpense,
  onSubmit,
  onCancel,
  missions 
}) {
  const defaultExpense = {
    date: new Date().toISOString().split('T')[0],
    type: 'mission',
    missionId: '',
    category: '',
    amount: '',
    description: '',
    stayEndDate: ''
  };

  // Utiliser soit l'expense fourni, soit les valeurs par défaut
  const currentExpense = expense || defaultExpense;
  const isAccommodation = currentExpense.type === 'mission' && currentExpense.category === 'hebergement';

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          {editingExpense ? 'Modifier un frais' : 'Ajouter un frais'}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-500"
        >
          ×
        </button>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isAccommodation ? "Date de début de séjour" : "Date"}
            </label>
            <input
              type="date"
              value={currentExpense.date}
              onChange={e => setExpense({...currentExpense, date: e.target.value})}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={currentExpense.type}
              onChange={e => setExpense({
                ...currentExpense,
                type: e.target.value,
                missionId: '',
                category: ''
              })}
              required
              className="w-full p-2 border rounded"
            >
              <option value="mission">Frais de mission</option>
              <option value="general">Frais généraux</option>
            </select>
          </div>

          {currentExpense.type === 'mission' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mission</label>
              <select
                value={currentExpense.missionId}
                onChange={e => setExpense({...currentExpense, missionId: e.target.value})}
                required
                className="w-full p-2 border rounded"
              >
                <option value="">Sélectionner une mission</option>
                {missions.map(mission => (
                  <option key={mission.id} value={mission.id}>
                    {mission.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
            <select
              value={currentExpense.category}
              onChange={e => setExpense({...currentExpense, category: e.target.value})}
              required
              className="w-full p-2 border rounded"
            >
              <option value="">Sélectionner une catégorie</option>
              {EXPENSE_CATEGORIES[currentExpense.type]?.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {isAccommodation && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin de séjour
              </label>
              <input
                type="date"
                value={currentExpense.stayEndDate || ''}
                onChange={e => setExpense({...currentExpense, stayEndDate: e.target.value})}
                required
                min={currentExpense.date}
                className="w-full p-2 border rounded"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Montant</label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={currentExpense.amount}
                onChange={e => setExpense({...currentExpense, amount: e.target.value})}
                required
                placeholder="0.00"
                className="w-full p-2 border rounded pr-8"
              />
              <span className="absolute right-3 top-2 text-gray-500">€</span>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={currentExpense.description}
              onChange={e => setExpense({...currentExpense, description: e.target.value})}
              required
              className="w-full p-2 border rounded"
              placeholder="Description du frais"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {editingExpense ? 'Mettre à jour' : 'Ajouter'} le frais
          </button>
        </div>
      </form>
    </div>
  );
}
