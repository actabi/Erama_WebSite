import React, { useState } from 'react';

export default function SelectExpenses({ data, onSelect, onNext, onBack }) {
  const [selectedRows, setSelectedRows] = useState(new Set());

  const toggleRow = (index) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
    onSelect(Array.from(newSelected).map(i => data[i]));
  };

  const toggleAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
      onSelect([]);
    } else {
      setSelectedRows(new Set(data.map((_, i) => i)));
      onSelect(data);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          {selectedRows.size} lignes sélectionnées sur {data.length}
        </div>
        <button
          onClick={toggleAll}
          className="text-blue-500 hover:text-blue-700"
        >
          {selectedRows.size === data.length ? 'Tout désélectionner' : 'Tout sélectionner'}
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2">
                <input
                  type="checkbox"
                  checked={selectedRows.size === data.length}
                  onChange={toggleAll}
                />
              </th>
              {Object.keys(data[0] || {}).map(header => (
                <th key={header} className="p-2 text-left">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr 
                key={index}
                className={`border-t ${selectedRows.has(index) ? 'bg-blue-50' : ''}`}
              >
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(index)}
                    onChange={() => toggleRow(index)}
                  />
                </td>
                {Object.values(row).map((value, i) => (
                  <td key={i} className="p-2">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Retour
        </button>
        <button
          onClick={onNext}
          disabled={selectedRows.size === 0}
          className={`px-4 py-2 rounded ${
            selectedRows.size === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
