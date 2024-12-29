import React from 'react';
import { formatCurrency } from '../../utils/formatters';

export default function Summary({ results }) {
  // Ajout de logs pour le débogage
  console.log('Results:', results);

  // Vérification de sécurité pour les résultats
  if (!results || !results.tjm) {
    console.log('Résultats manquants ou invalides');
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg">
        Calcul des TJM en cours...
      </div>
    );
  }

  const { tjm, billableDays, expenses, taxRate, tvaRate } = results;

  return (
    <div className="space-y-8">
      {/* TJM Recommandés */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-6">TJM Recommandés</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TJM Minimum */}
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-sm text-red-600 font-medium">TJM Minimum</div>
              <div className="mt-1 space-y-1">
                <div className="text-2xl font-bold text-red-700">
                  {formatCurrency(tjm.ht.minimum)} HT
                </div>
                <div className="text-sm text-red-600">
                  {formatCurrency(tjm.ttc.minimum)} TTC
                </div>
              </div>
              <div className="text-sm text-red-600 mt-2">Seuil de rentabilité</div>
            </div>
            <div className="text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Charges ({(taxRate * 100).toFixed(0)}%)</span>
                <span>{formatCurrency(tjm.ht.minimum * taxRate)}</span>
              </div>
              <div className="flex justify-between">
                <span>TVA ({(tvaRate * 100).toFixed(0)}%)</span>
                <span>{formatCurrency(tjm.ht.minimum * tvaRate)}</span>
              </div>
            </div>
          </div>

          {/* TJM Confortable */}
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-sm text-yellow-600 font-medium">TJM Confortable</div>
              <div className="mt-1 space-y-1">
                <div className="text-2xl font-bold text-yellow-700">
                  {formatCurrency(tjm.ht.comfortable)} HT
                </div>
                <div className="text-sm text-yellow-600">
                  {formatCurrency(tjm.ttc.comfortable)} TTC
                </div>
              </div>
              <div className="text-sm text-yellow-600 mt-2">Marge de sécurité (+20%)</div>
            </div>
            <div className="text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Charges ({(taxRate * 100).toFixed(0)}%)</span>
                <span>{formatCurrency(tjm.ht.comfortable * taxRate)}</span>
              </div>
              <div className="flex justify-between">
                <span>TVA ({(tvaRate * 100).toFixed(0)}%)</span>
                <span>{formatCurrency(tjm.ht.comfortable * tvaRate)}</span>
              </div>
            </div>
          </div>

          {/* TJM Optimal */}
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600 font-medium">TJM Optimal</div>
              <div className="mt-1 space-y-1">
                <div className="text-2xl font-bold text-green-700">
                  {formatCurrency(tjm.ht.optimal)} HT
                </div>
                <div className="text-sm text-green-600">
                  {formatCurrency(tjm.ttc.optimal)} TTC
                </div>
              </div>
              <div className="text-sm text-green-600 mt-2">Marge confortable (+50%)</div>
            </div>
            <div className="text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Charges ({(taxRate * 100).toFixed(0)}%)</span>
                <span>{formatCurrency(tjm.ht.optimal * taxRate)}</span>
              </div>
              <div className="flex justify-between">
                <span>TVA ({(tvaRate * 100).toFixed(0)}%)</span>
                <span>{formatCurrency(tjm.ht.optimal * tvaRate)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">
            <p>Les TJM sont calculés sur la base de :</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>{billableDays} jours facturables par an</li>
              <li>TVA de {(tvaRate * 100).toFixed(0)}%</li>
              <li>Charges totales de {(taxRate * 100).toFixed(0)}% (impôts + charges sociales)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Statistiques</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Jours ouvrés</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {results.workingDays?.toFixed(0) || 0}
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-600">Jours facturables</div>
            <div className="text-2xl font-bold text-blue-700 mt-1">
              {results.billableDays?.toFixed(0) || 0}
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-green-600">Dépenses mensuelles</div>
            <div className="text-2xl font-bold text-green-700 mt-1">
              {formatCurrency(results.expenses?.monthly || 0)}
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-sm text-purple-600">Réserve coups durs</div>
            <div className="text-2xl font-bold text-purple-700 mt-1">
              {formatCurrency(results.hardshipReserve || 0)}
            </div>
          </div>
        </div>
      </div>

      {/* Répartition des dépenses */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium mb-4">Répartition des dépenses mensuelles</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Dépenses personnelles</span>
              <span className="font-medium">{formatCurrency(results.expenses?.personal || 0)}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500"
                style={{ 
                  width: `${results.expenses?.monthly ? (results.expenses.personal / results.expenses.monthly * 100) : 0}%`
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Dépenses professionnelles</span>
              <span className="font-medium">{formatCurrency(results.expenses?.professional || 0)}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500"
                style={{ 
                  width: `${results.expenses?.monthly ? (results.expenses.professional / results.expenses.monthly * 100) : 0}%`
                }}
              />
            </div>
          </div>

          <div className="pt-4 mt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total mensuel</span>
              <span className="font-bold text-lg">
                {formatCurrency(results.expenses?.monthly || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
