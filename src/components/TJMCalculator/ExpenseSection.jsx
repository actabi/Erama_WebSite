import React from 'react';

export default function ExpenseSection({ title, fields, values, onChange }) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-sm font-medium text-gray-700 mb-4">{title}</h3>
      
      <div className="space-y-4">
        {fields.map(field => (
          <div key={field.id}>
            <label className="block text-sm text-gray-600">
              {field.label}
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                min="0"
                step="0.01"
                value={values[field.id]}
                onChange={e => onChange(field.id, parseFloat(e.target.value) || 0)}
                className="block w-full pr-10 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">€</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700">Total</span>
          <span className="font-medium text-blue-600">
            {Object.values(values).reduce((sum, value) => sum + value, 0).toFixed(2)} €
          </span>
        </div>
      </div>
    </div>
  );
}
