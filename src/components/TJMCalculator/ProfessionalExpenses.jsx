import React from 'react';
import { formatCurrency } from '../../utils/formatters';

const DEFAULT_EXPENSES = {
  production: {
    workspace: 0,
    equipment: 0,
    supplies: 0,
    software: 0,
    phone: 0,
    insurance: 0,
    other: 0
  },
  commercial: {
    travel: 0,
    marketing: 0
  },
  charges: {
    socialCharges: 0,
    accountant: 0
  }
};

export default function ProfessionalExpenses({ expenses = DEFAULT_EXPENSES, onChange }) {
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
      <h2 className="text-xl font-semibold">Dépenses professionnelles mensuelles</h2>

      {/* Production */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Production</h3>
        <div className="space-y-4">
          {Object.entries(DEFAULT_EXPENSES.production).map(([field, defaultValue]) => (
            <div key={field} className="flex items-center justify-between">
              <label className="text-sm text-gray-600">
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              <div className="relative w-32">
                <input
                  type="number"
                  value={expenses.production?.[field] || ''}
                  onChange={(e) => handleExpenseChange('production', field, e.target.value)}
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
              <span className="font-medium">Total Production</span>
              <span className="font-medium text-blue-600">
                {formatCurrency(calculateCategoryTotal('production'))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Commercial */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Commercial</h3>
        <div className="space-y-4">
          {Object.entries(DEFAULT_EXPENSES.commercial).map(([field, defaultValue]) => (
            <div key={field} className="flex items-center justify-between">
              <label className="text-sm text-gray-600">
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              <div className="relative w-32">
                <input
                  type="number"
                  value={expenses.commercial?.[field] || ''}
                  onChange={(e) => handleExpenseChange('commercial', field, e.target.value)}
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
              <span className="font-medium">Total Commercial</span>
              <span className="font-medium text-blue-600">
                {formatCurrency(calculateCategoryTotal('commercial'))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charges */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Charges</h3>
        <div className="space-y-4">
          {Object.entries(DEFAULT_EXPENSES.charges).map(([field, defaultValue]) => (
            <div key={field} className="flex items-center justify-between">
              <label className="text-sm text-gray-600">
                {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
              </label>
              <div className="relative w-32">
                <input
                  type="number"
                  value={expenses.charges?.[field] || ''}
                  onChange={(e) => handleExpenseChange('charges', field, e.target.value)}
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
              <span className="font-medium">Total Charges</span>
              <span className="font-medium text-blue-600">
                {formatCurrency(calculateCategoryTotal('charges'))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Total général */}
      <div className="bg-green-50 p-6 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium text-green-900">Total des dépenses professionnelles</span>
          <span className="text-xl font-semibold text-green-600">
            {formatCurrency(
              ['production', 'commercial', 'charges'].reduce(
                (total, category) => total + calculateCategoryTotal(category),
                0
              )
            )}
          </span>
        </div>
        <p className="mt-2 text-sm text-green-700">
          Ces dépenses sont déductibles de vos revenus professionnels
        </p>
      </div>
    </div>
  );
}
