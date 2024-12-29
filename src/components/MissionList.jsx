import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatCurrency } from '../utils/formatters';
import MissionForm from './MissionForm';

export default function MissionList({ 
  missions = [], 
  companies = [],
  contacts = [],
  timeEntries = [], 
  onAdd,
  onUpdate,
  onRemove
}) {
  const [editingMission, setEditingMission] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filtrer les missions
  const filteredMissions = missions.filter(mission => {
    const searchLower = searchTerm.toLowerCase();
    const company = companies.find(c => c.id === mission.companyId);
    return (
      mission.name?.toLowerCase().includes(searchLower) ||
      company?.name?.toLowerCase().includes(searchLower) ||
      mission.description?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      {/* Stats en haut */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm text-gray-500">Total missions</h3>
              <p className="text-2xl font-semibold">{missions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm text-gray-500">Missions actives</h3>
              <p className="text-2xl font-semibold">
                {missions.filter(m => m.status === 'active').length}
              </p>
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
              <h3 className="text-sm text-gray-500">En attente</h3>
              <p className="text-2xl font-semibold">
                {missions.filter(m => m.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-gray-100 text-gray-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-sm text-gray-500">Terminées</h3>
              <p className="text-2xl font-semibold">
                {missions.filter(m => m.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Barre d'actions */}
      <div className="flex justify-between items-center">
        <div className="flex-1 max-w-lg">
          <input
            type="text"
            placeholder="Rechercher une mission..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={() => {
            setEditingMission(null);
            setShowForm(true);
          }}
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Nouvelle mission
        </button>
      </div>

      {/* Liste des missions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMissions.map(mission => {
          const company = companies.find(c => c.id === mission.companyId);
          const missionEntries = timeEntries.filter(entry => entry.missionId === mission.id);
          const totalDays = missionEntries.reduce((sum, entry) => sum + (parseFloat(entry.duration) || 0), 0);
          const revenue = mission.type === 'regie' 
            ? totalDays * parseFloat(mission.rate)
            : parseFloat(mission.amount);

          return (
            <div 
              key={mission.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{mission.name}</h3>
                    <p className="text-sm text-gray-600">{company?.name}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    mission.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : mission.status === 'completed'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {mission.status === 'active' ? 'Active' : 
                     mission.status === 'completed' ? 'Terminée' : 'En attente'}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    {mission.type === 'regie' 
                      ? `${formatCurrency(mission.rate)}/jour - ${totalDays} jours`
                      : `Forfait: ${formatCurrency(mission.amount)}`}
                  </p>
                  <p className="text-gray-600">
                    Du {format(new Date(mission.startDate), 'dd MMM yyyy', { locale: fr })} au{' '}
                    {format(new Date(mission.deadline), 'dd MMM yyyy', { locale: fr })}
                  </p>
                </div>

                {mission.type === 'regie' && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progression</span>
                      <span className="text-gray-900 font-medium">
                        {Math.round((totalDays / mission.maxDays) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          totalDays >= mission.maxDays ? 'bg-red-500' :
                          totalDays >= mission.maxDays * 0.8 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(100, (totalDays / mission.maxDays) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm">
                    <span className="text-gray-600">Revenu:</span>{' '}
                    <span className="font-medium text-gray-900">{formatCurrency(revenue)}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingMission(mission);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette mission ?')) {
                          onRemove(mission.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredMissions.length === 0 && (
          <div className="col-span-2 text-center py-12 bg-white rounded-lg border border-gray-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune mission trouvée</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm 
                ? "Aucune mission ne correspond à votre recherche"
                : "Commencez par créer une nouvelle mission"}
            </p>
          </div>
        )}
      </div>

      {/* Modal de formulaire */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {editingMission ? 'Modifier la mission' : 'Nouvelle mission'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingMission(null);
                    setError(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}
              
              <MissionForm
                mission={editingMission}
                companies={companies}
                contacts={contacts}
                onSave={async (missionData) => {
                  setIsLoading(true);
                  setError(null);
                  try {
                    if (editingMission) {
                      await onUpdate(editingMission.id, missionData);
                    } else {
                      await onAdd({
                        ...missionData,
                        createdAt: new Date().toISOString()
                      });
                    }
                    setShowForm(false);
                    setEditingMission(null);
                  } catch (error) {
                    console.error('Erreur lors de la sauvegarde:', error);
                    setError(error.message || 'Une erreur est survenue lors de la sauvegarde');
                  } finally {
                    setIsLoading(false);
                  }
                }}
                onCancel={() => {
                  setShowForm(false);
                  setEditingMission(null);
                  setError(null);
                }}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
