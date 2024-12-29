import React, { useState } from 'react';

export default function CompanyForm({ company, onSave, onCancel }) {
  const [formData, setFormData] = useState(company || {
    name: '',
    siret: '',
    vatNumber: '',
    address: {
      street: '',
      postalCode: '',
      city: '',
      country: 'France'
    },
    billing: {
      paymentTerms: 30,
      paymentMethod: 'transfer',
      billingEmail: '',
      billingAddress: {
        sameAsMain: true,
        street: '',
        postalCode: '',
        city: '',
        country: 'France'
      }
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div>
        <h3 className="text-lg font-medium mb-4">Informations de l'entreprise</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom de l'entreprise
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">SIRET</label>
            <input
              type="text"
              value={formData.siret}
              onChange={e => setFormData({...formData, siret: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Numéro de TVA
            </label>
            <input
              type="text"
              value={formData.vatNumber}
              onChange={e => setFormData({...formData, vatNumber: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Adresse</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Rue</label>
            <input
              type="text"
              value={formData.address.street}
              onChange={e => setFormData({
                ...formData,
                address: {...formData.address, street: e.target.value}
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Code postal
            </label>
            <input
              type="text"
              value={formData.address.postalCode}
              onChange={e => setFormData({
                ...formData,
                address: {...formData.address, postalCode: e.target.value}
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ville</label>
            <input
              type="text"
              value={formData.address.city}
              onChange={e => setFormData({
                ...formData,
                address: {...formData.address, city: e.target.value}
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pays</label>
            <input
              type="text"
              value={formData.address.country}
              onChange={e => setFormData({
                ...formData,
                address: {...formData.address, country: e.target.value}
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Informations de facturation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Délai de paiement (jours)
            </label>
            <input
              type="number"
              value={formData.billing.paymentTerms}
              onChange={e => setFormData({
                ...formData,
                billing: {...formData.billing, paymentTerms: parseInt(e.target.value)}
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Mode de paiement
            </label>
            <select
              value={formData.billing.paymentMethod}
              onChange={e => setFormData({
                ...formData,
                billing: {...formData.billing, paymentMethod: e.target.value}
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="transfer">Virement bancaire</option>
              <option value="check">Chèque</option>
              <option value="other">Autre</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email de facturation
            </label>
            <input
              type="email"
              value={formData.billing.billingEmail}
              onChange={e => setFormData({
                ...formData,
                billing: {...formData.billing, billingEmail: e.target.value}
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          {company ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>
    </form>
  );
}
