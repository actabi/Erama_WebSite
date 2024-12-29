import React, { useState } from 'react';
import { useTJMCalculator } from '../../hooks/useTJMCalculator';
import Summary from './Summary';
import PersonalExpenses from './PersonalExpenses';
import ProfessionalExpenses from './ProfessionalExpenses';
import TimeManagement from './TimeManagement';
import TaxSettings from './TaxSettings';
import Loading from '../common/Loading';

export default function TJMCalculator() {
  const [activeTab, setActiveTab] = useState('summary');
  const { 
    expenses, 
    setExpenses, 
    parameters, 
    setParameters, 
    selectedYear,
    setSelectedYear,
    results,
    isLoading,
    error
  } = useTJMCalculator();

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        Une erreur est survenue lors du chargement des données: {error.message}
      </div>
    );
  }

  const tabs = [
    { 
      id: 'summary', 
      label: 'Synthèse',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    // ... autres onglets ...
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow">
          <nav className="flex p-2 space-x-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg flex-1 transition-colors duration-150 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'summary' && (
          <Summary 
            results={results}
            parameters={parameters}
            setParameters={setParameters}
          />
        )}

        {activeTab === 'personal' && (
          <PersonalExpenses
            expenses={expenses.personal}
            onChange={(personalExpenses) => setExpenses(prev => ({
              ...prev,
              personal: personalExpenses
            }))}
          />
        )}

        {activeTab === 'professional' && (
          <ProfessionalExpenses
            expenses={expenses.professional}
            onChange={(professionalExpenses) => setExpenses(prev => ({
              ...prev,
              professional: professionalExpenses
            }))}
          />
        )}

        {activeTab === 'taxes' && (
          <TaxSettings
            parameters={parameters}
            onChange={setParameters}
            results={results}
          />
        )}

        {activeTab === 'time' && (
          <TimeManagement
            parameters={parameters}
            onChange={setParameters}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            expenses={expenses}
          />
        )}
      </div>
    </div>
  );
}
