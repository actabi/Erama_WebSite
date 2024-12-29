import React from 'react';
import { EXPENSE_CATEGORIES } from './constants';

export default function ExpenseFilters({ filters, setFilters, missions }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Rechercher</label>
        <input
          type="text"
          value={filters.search}
          onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
          placeholder="Rechercher dans les descriptions..."
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Date début</label>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={e => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Date fin</label>
        <input
          type="date"
          value={filters.dateTo}
          onChange={e => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Type</label>
        <select
          value={filters.type}
          onChange={e => setFilters(prev => ({ ...prev, type: e.target.value }))}
          className="w-full p-2 border rounded"
        >
          <option value="all">Tous les types</option>
          <option value="mission">Frais de mission</option>
          <option value="general">Frais généraux</option>
        </select>
      </div>

      {filters.type === 'mission' && (
        <div>
          <label className="block text-sm text-gray-600 mb-1">Mission</label>
          <select
            value={filters.missionId}
            onChange={e => setFilters(prev => ({ ...prev, missionId: e.target.value }))}
            className="w-full p-2 border rounded"
          >
            <option value="all">Toutes les missions</option>
            {missions.map(mission => (
              <option key={mission.id} value={mission.id}>
                {mission.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm text-gray-600 mb-1">Catégorie</label>
        <select
          value={filters.category}
          onChange={e => setFilters(prev => ({ ...prev, category: e.target.value }))}
          className="w-full p-2 border rounded"
        >
          <option value="all">Toutes les catégories</option>
          {filters.type === 'mission' 
            ? EXPENSE_CATEGORIES.mission.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))
            : EXPENSE_CATEGORIES.general.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))
          }
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Montant min</label>
        <input
          type="number"
          value={filters.minAmount}
          onChange={e => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
          placeholder="Montant minimum"
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Montant max</label>
        <input
          type="number"
          value={filters.maxAmount}
          onChange={e => setFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
          placeholder="Montant maximum"
          className="w-full p-2 border rounded"
        />
      </div>
    </div>
  );
}
