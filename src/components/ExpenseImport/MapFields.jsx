import React, { useState } from 'react';

const REQUIRED_FIELDS = {
  date: 'Date de l\'opération',
  amount: 'Montant',
  description: 'Description/Libellé',
  category: 'Catégorie (optionnel)'
};

export default function MapFields({ headers, onMap, onBack, onFinish }) {
  const [mappings, setMappings] = useState({
    date: '',
    amount: '',
    description: '',
    category: ''
  });

  const handleMapping = (field, header) => {
    setMappings(prev => ({
      ...prev,
      [field]: header
    }));
  };

  const isValid = () => {
    return mappings.date && mappings.amount && mappings.description;
  };

  const handleFinish = () => {
    onMap(mappings);
    onFinish();
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-600 mb-4">
        Associez les champs de votre fichier avec les champs requis
      </div>

      {Object.entries(REQUIRED_FIELDS).map(([field, label]) => (
        <div key={field} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {label}
            {field !== 'category' && <span className="text-red-500">*</span>}
          </label>
          <select
            value={mappings[field]}
            onChange={(e) => handleMapping(field, e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Sélectionner un champ</option>
            {headers.map(header => (
              <option key={header} value={header}>
                {header}
              </option>
            ))}
          </select>
        </div>
      ))}

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Retour
        </button>
        <button
          onClick={handleFinish}
          disabled={!isValid()}
          className={`px-4 py-2 rounded ${
            !isValid()
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Importer
        </button>
      </div>
    </div>
  );
}
