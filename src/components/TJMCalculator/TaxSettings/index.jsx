import React from 'react';
import { formatCurrency } from '../../../utils/formatters';

export default function TaxSettings({ parameters, onChange, results }) {
  const handleChange = (field, value) => {
    onChange({
      ...parameters,
      taxes: {
        ...parameters.taxes,
        [field]: parseFloat(value) || 0
      }
    });
  };

  // Calcul des montants d'impôts et charges
  const calculateTaxAmount = (amount, percentage) => {
    return (amount * percentage) / 100;
  };

  const annualRevenue = results.annualRevenue || 0;
  const incomeTaxAmount = calculateTaxAmount(annualRevenue, parameters.taxes?.incomeTax || 0);
  const socialChargesAmount = calculateTaxAmount(annualRevenue, parameters.taxes?.socialCharges || 0);
  const otherTaxesAmount = calculateTaxAmount(annualRevenue, parameters.taxes?.otherTaxes || 0);
  const totalTaxes = incomeTaxAmount + socialChargesAmount + otherTaxesAmount;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Impôts et charges</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Taux d'imposition</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Impôt sur le revenu (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={parameters.taxes?.incomeTax || ''}
                  onChange={(e) => handleChange('incomeTax', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  min="0"
                  max="100"
                  step="0.1"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">%</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Charges sociales (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={parameters.taxes?.socialCharges || ''}
                  onChange={(e) => handleChange('socialCharges', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  min="0"
                  max="100"
                  step="0.1"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">%</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Autres taxes (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={parameters.taxes?.otherTaxes || ''}
                  onChange={(e) => handleChange('otherTaxes', e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  min="0"
                  max="100"
                  step="0.1"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">Impact sur le revenu</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Revenu annuel brut</span>
              <span className="font-medium">{formatCurrency(annualRevenue)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Impôt sur le revenu</span>
              <span className="font-medium text-red-600">
                - {formatCurrency(incomeTaxAmount)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Charges sociales</span>
              <span className="font-medium text-red-600">
                - {formatCurrency(socialChargesAmount)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Autres taxes</span>
              <span className="font-medium text-red-600">
                - {formatCurrency(otherTaxesAmount)}
              </span>
            </div>

            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total des prélèvements</span>
                <span className="font-medium text-red-600">
                  {formatCurrency(totalTaxes)}
                </span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-medium">Revenu net après impôts</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(annualRevenue - totalTaxes)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              À propos des impôts et charges
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>Ces taux sont utilisés pour estimer vos prélèvements obligatoires et ajuster votre TJM en conséquence. Consultez votre comptable pour des taux plus précis adaptés à votre situation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
