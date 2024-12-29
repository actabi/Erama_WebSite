import React, { useState } from 'react';
import MissionForm from './MissionForm';

export default function MissionManagement({ clients, onAdd, onUpdate }) {
  const [editingMission, setEditingMission] = useState(null);

  const handleSaveMission = async (missionData) => {
    try {
      if (editingMission) {
        await onUpdate(editingMission.id, missionData);
      } else {
        await onAdd(missionData);
      }
      setEditingMission(null);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la mission:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingMission(null);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {editingMission ? 'Modifier la mission' : 'Ajouter une nouvelle mission'}
      </h2>
      <MissionForm
        mission={editingMission}
        clients={clients}
        onSave={handleSaveMission}
        onCancel={handleCancelEdit}
      />
    </div>
  );
}
