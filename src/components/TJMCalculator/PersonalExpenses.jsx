import React from 'react';
import { formatCurrency } from '../../utils/formatters';

const DEFAULT_EXPENSES = {
  housing: {
    rent: 0,
    charges: 0,
    insurance: 0,
    propertyTax: 0,
    internet: 0,
    phone: 0,
    other: 0
  },
  transport: {
    card: 0,
    fuel: 0,
    insurance: 0,
    maintenance: 0
  },
  food: {
    groceries: 0,
    restaurants: 0
  },
  leisure: {
    entertainment: 0,
    subscriptions: 0,
    sports: 0,
    shopping: 0
  }
};

export default function PersonalExpenses({ expenses = DEFAULT_EXPENSES, onChange }) {
  const handleExpenseChange = (category, field, value) => {
    const updatedExpenses = {
      ...expenses,
      [category]: {
        ...(expenses[category] || {}),
        [field]: parseFloat(value) || 0
      }
    };
    onChange(updatedExpenses);
  };

  const calculateCategoryTotal = (category) => {
    if (!expenses[category]) return 0;
    return Object.values(expenses[category]).reduce((sum, value) => sum + (parseFloat(value) || 0), 0);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Dépenses personnelles mensuelles</h2>

      {/* Logement */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Logement</h3>
        <div className="space-y-4">
          {Object.entries(DEFAULT_EXPENSES.housing).map(([field, defaultValue]) => (
            <div key={field} className="flex items-center justify-between">
              <label className="text-sm text-gray-600">
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              <div className="relative w-32">
                <input
                  type="number"
                  value={expenses.housing?.[field] || ''}
                  onChange={(e) => handleExpenseChange('housing', field, e.target.value)}
                  className="w-full px-3 py-1 border rounded text-right"
                  min="0"
                  step="0.01"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  €
                </span>
              </div>
            </div>
          ))}
          <div className="pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Total Logement</span>
              <span className="font-medium text-blue-600">
                {formatCurrency(calculateCategoryTotal('housing'))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Transport */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Transport</h3>
        <div className="space-y-4">
          {Object.entries(DEFAULT_EXPENSES.transport).map(([field, defaultValue]) => (
            <div key={field} className="flex items-center justify-between">
              <label className="text-sm text-gray-600">
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              <div className="relative w-32">
                <input
                  type="number"
                  value={expenses.transport?.[field] || ''}
                  onChange={(e) => handleExpenseChange('transport', field, e.target.value)}
                  className="w-full px-3 py-1 border rounded text-right"
                  min="0"
                  step="0.01"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  €
                </span>
              </div>
            </div>
          ))}
          <div className="pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Total Transport</span>
              <span className="font-medium text-blue-600">
                {formatCurrency(calculateCategoryTotal('transport'))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Alimentation */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Alimentation</h3>
        <div className="space-y-4">
          {Object.entries(DEFAULT_EXPENSES.food).map(([field, defaultValue]) => (
            <div key={field} className="flex items-center justify-between">
              <label className="text-sm text-gray-600">
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              <div className="relative w-32">
                <input
                  type="number"
                  value={expenses.food?.[field] || ''}
                  onChange={(e) => handleExpenseChange('food', field, e.target.value)}
                  className="w-full px-3 py-1 border rounded text-right"
                  min="0"
                  step="0.01"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  €
                </span>
              </div>
            </div>
          ))}
          <div className="pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Total Alimentation</span>
              <span className="font-medium text-blue-600">
                {formatCurrency(calculateCategoryTotal('food'))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Loisirs */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Loisirs</h3>
        <div className="space-y-4">
          {Object.entries(DEFAULT_EXPENSES.leisure).map(([field, defaultValue]) => (
            <div key={field} className="flex items-center justify-between">
              <label className="text-sm text-gray-600">
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              <div className="relative w-32">
                <input
                  type="number"
                  value={expenses.leisure?.[field] || ''}
                  onChange={(e) => handleExpenseChange('leisure', field, e.target.value)}
                  className="w-full px-3 py-1 border rounded text-right"
                  min="0"
                  step="0.01"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  €
                </span>
              </div>
            </div>
          ))}
          <div className="pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Total Loisirs</span>
              <span className="font-medium text-blue-600">
                {formatCurrency(calculateCategoryTotal('leisure'))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Total général */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-blue-900">Total des dépenses personnelles</span>
          <span className="text-xl font-semibold text-blue-600">
            {formatCurrency(
              ['housing', 'transport', 'food', 'leisure'].reduce(
                (total, category) => total + calculateCategoryTotal(category),
                0
              )
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
