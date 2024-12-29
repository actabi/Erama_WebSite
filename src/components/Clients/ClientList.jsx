import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import CompanyList from './CompanyList';
import ContactList from './ContactList';
import CompanyForm from './CompanyForm';
import ContactForm from './ContactForm';
import { useFirestore } from '../../hooks/useFirestore';

export default function ClientList() {
  const [activeTab, setActiveTab] = useState('companies');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const {
    data: companies,
    loading: loadingCompanies,
    add: addCompany,
    update: updateCompany,
    remove: removeCompany
  } = useFirestore('companies');

  const {
    data: contacts,
    loading: loadingContacts,
    add: addContact,
    update: updateContact,
    remove: removeContact
  } = useFirestore('contacts');

  // Statistiques
  const stats = {
    totalCompanies: companies?.length || 0,
    totalContacts: contacts?.length || 0,
    activeCompanies: companies?.filter(c => c.status === 'active')?.length || 0,
    recentContacts: contacts?.filter(c => {
      const date = new Date(c.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return date > thirtyDaysAgo;
    })?.length || 0
  };

  const handleAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleSave = async (data) => {
    try {
      if (activeTab === 'companies') {
        if (editingItem) {
          await updateCompany(editingItem.id, data);
        } else {
          await addCompany({
            ...data,
            createdAt: new Date().toISOString()
          });
        }
      } else {
        if (editingItem) {
          await updateContact(editingItem.id, data);
        } else {
          await addContact({
            ...data,
            createdAt: new Date().toISOString()
          });
        }
      }
      setShowModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  if (loadingCompanies || loadingContacts) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm text-gray-500">Entreprises</h3>
              <p className="text-2xl font-semibold">{stats.totalCompanies}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm text-gray-500">Contacts</h3>
              <p className="text-2xl font-semibold">{stats.totalContacts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm text-gray-500">Entreprises actives</h3>
              <p className="text-2xl font-semibold">{stats.activeCompanies}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm text-gray-500">Nouveaux contacts (30j)</h3>
              <p className="text-2xl font-semibold">{stats.recentContacts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Barre d'actions */}
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-lg">
          <input
            type="text"
            placeholder={`Rechercher ${activeTab === 'companies' ? 'une entreprise' : 'un contact'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={handleAdd}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {activeTab === 'companies' ? 'Nouvelle entreprise' : 'Nouveau contact'}
        </button>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow">
        <nav className="flex space-x-4 px-6 py-4 border-b">
          <button
            onClick={() => setActiveTab('companies')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              activeTab === 'companies'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>Entreprises</span>
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
              activeTab === 'contacts'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Contacts</span>
          </button>
        </nav>

        <div className="p-6">
          {activeTab === 'companies' ? (
            <CompanyList
              companies={companies}
              searchTerm={searchTerm}
              onEdit={handleEdit}
              onRemove={removeCompany}
            />
          ) : (
            <ContactList
              contacts={contacts}
              companies={companies}
              searchTerm={searchTerm}
              onEdit={handleEdit}
              onRemove={removeContact}
            />
          )}
        </div>
      </div>

      {/* Modal pour création/modification */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingItem ? 
                  `Modifier ${activeTab === 'companies' ? 'l\'entreprise' : 'le contact'}` : 
                  `Nouveau ${activeTab === 'companies' ? 'entreprise' : 'contact'}`}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingItem(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {activeTab === 'companies' ? (
              <CompanyForm
                company={editingItem}
                onSave={handleSave}
                onCancel={() => {
                  setShowModal(false);
                  setEditingItem(null);
                }}
              />
            ) : (
              <ContactForm
                contact={editingItem}
                companies={companies}
                onSave={handleSave}
                onCancel={() => {
                  setShowModal(false);
                  setEditingItem(null);
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
