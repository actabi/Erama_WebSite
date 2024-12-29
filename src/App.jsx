import React, { useState, useEffect } from 'react';
import { addMonths } from 'date-fns';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ClientList from './components/Clients/ClientList';
import MissionList from './components/MissionList';
import TimeSheet from './components/TimeSheet';
import ExpenseManager from './components/Expenses/ExpenseManager';
import TJMCalculator from './components/TJMCalculator';
import Loading from './components/common/Loading';
import { useFirestore } from './hooks/useFirestore';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const {
    data: companies,
    loading: loadingCompanies,
    error: errorCompanies,
    add: addCompany,
    update: updateCompany,
    remove: removeCompany
  } = useFirestore('companies');

  const {
    data: contacts,
    loading: loadingContacts,
    error: errorContacts,
    add: addContact,
    update: updateContact,
    remove: removeContact
  } = useFirestore('contacts');

  const {
    data: missions,
    loading: loadingMissions,
    error: errorMissions,
    add: addMission,
    update: updateMission,
    remove: removeMission
  } = useFirestore('missions');

  const {
    data: timeEntries,
    loading: loadingTimeEntries,
    error: errorTimeEntries,
    add: addTimeEntry,
    update: updateTimeEntry,
    remove: removeTimeEntry
  } = useFirestore('timeEntries');

  const {
    data: expenses,
    loading: loadingExpenses,
    error: errorExpenses,
    add: addExpense,
    update: updateExpense,
    remove: removeExpense
  } = useFirestore('expenses');

  const isLoading = loadingCompanies || loadingContacts || loadingMissions || 
                   loadingTimeEntries || loadingExpenses;

  const errors = [errorCompanies, errorContacts, errorMissions, errorTimeEntries, errorExpenses]
    .filter(Boolean);

  const handleMonthChange = (delta) => {
    setSelectedMonth(prevMonth => addMonths(prevMonth, delta));
  };

  if (errors.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h1 className="text-xl font-bold text-red-600 mb-4">
            Une erreur est survenue
          </h1>
          <ul className="text-sm text-gray-600">
            {errors.map((error, index) => (
              <li key={index} className="mb-2">
                {error.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loading fullScreen />
      </div>
    );
  }

  const navigationItems = [
    { 
      id: 'dashboard', 
      label: 'Tableau de bord',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      id: 'clients', 
      label: 'Clients',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    { 
      id: 'missions', 
      label: 'Missions',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      id: 'cra', 
      label: 'CRA',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      id: 'expenses', 
      label: 'Frais',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      )
    },
    { 
      id: 'tjm', 
      label: 'TJM',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      )
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Navigation */}
        <nav className="tab-container">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`tab flex items-center space-x-2 ${
                activeTab === item.id ? 'tab-active' : 'tab-inactive'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Contenu principal */}
        <div className="space-y-6">
          {activeTab === 'dashboard' && (
            <Dashboard 
              missions={missions || []}
              timeEntries={timeEntries || []}
              expenses={expenses || []}
            />
          )}

          {activeTab === 'clients' && (
            <ClientList />
          )}

          {activeTab === 'missions' && (
            <MissionList 
              missions={missions || []}
              companies={companies || []}
              contacts={contacts || []}
              timeEntries={timeEntries || []}
              onAdd={addMission}
              onUpdate={updateMission}
              onRemove={removeMission}
            />
          )}

          {activeTab === 'cra' && (
            <TimeSheet 
              missions={missions || []}
              timeEntries={timeEntries || []}
              selectedMonth={selectedMonth}
              onMonthChange={handleMonthChange}
              onAddEntry={addTimeEntry}
              onUpdateEntry={updateTimeEntry}
              onRemoveEntry={removeTimeEntry}
            />
          )}

          {activeTab === 'expenses' && (
            <ExpenseManager 
              missions={missions || []}
              expenses={expenses || []}
              onAdd={addExpense}
              onUpdate={updateExpense}
              onRemove={removeExpense}
            />
          )}

          {activeTab === 'tjm' && (
            <TJMCalculator />
          )}
        </div>
      </div>
    </Layout>
  );
}
