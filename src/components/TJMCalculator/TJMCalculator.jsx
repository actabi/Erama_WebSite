import React, { useState } from 'react';
import { useTJMCalculator } from './useTJMCalculator';
import Summary from './Summary';
import PersonalExpenses from './PersonalExpenses';
import ProfessionalExpenses from './ProfessionalExpenses';
import TimeManagement from './TimeManagement';
import TaxSettings from './TaxSettings';

export default function TJMCalculator() {
  const [activeTab, setActiveTab] = useState('summary');
  const { 
    expenses, 
    setExpenses, 
    parameters, 
    setParameters, 
    selectedYear,
    setSelectedYear,
    results 
  } = useTJMCalculator();

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
    { 
      id: 'personal', 
      label: 'Dépenses personnelles',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      id: 'professional', 
      label: 'Dépenses professionnelles',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      id: 'taxes', 
      label: 'Impôts et charges',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
        </svg>
      )
    },
    { 
      id: 'time', 
      label: 'Gestion du temps',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
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
