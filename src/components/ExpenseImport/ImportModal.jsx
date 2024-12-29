import React, { useState } from 'react';
import { read, utils } from 'xlsx';
import { format } from 'date-fns';
import { parseDate } from '../../utils/dateParser';
import SelectExpenses from './SelectExpenses';
import MapFields from './MapFields';

export default function ImportModal({ isOpen, onClose, onImport }) {
  const [step, setStep] = useState(1);
  const [rawData, setRawData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [mappings, setMappings] = useState({
    date: '',
    amount: '',
    description: '',
    category: ''
  });

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const workbook = read(event.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = utils.sheet_to_json(worksheet, { header: 1 });

      // Convert first row to headers, rest to data
      const headers = data[0];
      const rows = data.slice(1).map(row => {
        return headers.reduce((acc, header, index) => {
          acc[header] = row[index];
          return acc;
        }, {});
      });

      setRawData(rows);
      setStep(2);
    };

    reader.readAsBinaryString(file);
  };

  const handleImport = () => {
    const processedExpenses = selectedRows.map(row => {
      const expense = {
        date: parseDate(row[mappings.date]),
        amount: parseFloat(row[mappings.amount]),
        description: row[mappings.description],
        category: mappings.category ? row[mappings.category] : 'autres',
        type: 'general', // Par défaut, peut être ajusté
        createdAt: new Date().toISOString()
      };
      return expense;
    });

    onImport(processedExpenses);
    onClose();
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                Import des frais bancaires - Étape {step}/3
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-auto">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer text-blue-500 hover:text-blue-700"
                    >
                      Cliquez pour sélectionner votre fichier bancaire
                      <br />
                      <span className="text-sm text-gray-500">
                        (Formats acceptés: .xlsx, .xls)
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {step === 2 && rawData.length > 0 && (
                <SelectExpenses
                  data={rawData}
                  onSelect={setSelectedRows}
                  onNext={() => setStep(3)}
                  onBack={() => setStep(1)}
                />
              )}

              {step === 3 && (
                <MapFields
                  headers={Object.keys(rawData[0] || {})}
                  onMap={setMappings}
                  onBack={() => setStep(2)}
                  onFinish={handleImport}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
