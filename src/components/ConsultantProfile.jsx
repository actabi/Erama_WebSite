import { useState } from 'react'

export default function ConsultantProfile({ consultant, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState(consultant || {
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    phone: '',
    address: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onUpdate(profile)
    setEditing(false)
  }

  if (!editing) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">Profil Consultant</h2>
          <button
            onClick={() => setEditing(true)}
            className="text-blue-500 hover:text-blue-700"
          >
            Modifier
          </button>
        </div>

        <div className="space-y-2">
          <p><span className="font-medium">Nom :</span> {profile.lastName}</p>
          <p><span className="font-medium">Prénom :</span> {profile.firstName}</p>
          <p><span className="font-medium">Société :</span> {profile.company}</p>
          <p><span className="font-medium">Email :</span> {profile.email}</p>
          <p><span className="font-medium">Téléphone :</span> {profile.phone}</p>
          <p><span className="font-medium">Adresse :</span> {profile.address}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Modifier le profil</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom
            </label>
            <input
              type="text"
              value={profile.firstName}
              onChange={e => setProfile({...profile, firstName: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input
              type="text"
              value={profile.lastName}
              onChange={e => setProfile({...profile, lastName: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Société
          </label>
          <input
            type="text"
            value={profile.company}
            onChange={e => setProfile({...profile, company: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={profile.email}
            onChange={e => setProfile({...profile, email: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone
          </label>
          <input
            type="tel"
            value={profile.phone}
            onChange={e => setProfile({...profile, phone: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adresse
          </label>
          <textarea
            value={profile.address}
            onChange={e => setProfile({...profile, address: e.target.value})}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  )
}
