import React, { useState } from 'react';

export default function ClientForm({ client, onSave, onCancel }) {
  const [formData, setFormData] = useState(() => {
    const defaultData = {
      name: '',
      company: '',
      siret: '',
      vatNumber: '',
      address: {
        street: '',
        postalCode: '',
        city: '',
        country: 'France'
      },
      contact: {
        name: '',
        email: '',
        phone: '',
        position: ''
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
      },
      notes: ''
    };

    if (client) {
      return {
        ...defaultData,
        ...client,
        address: {
          ...defaultData.address,
          ...(client.address || {})
        },
        contact: {
          ...defaultData.contact,
          ...(client.contact || {})
        },
        billing: {
          ...defaultData.billing,
          ...(client.billing || {}),
          billingAddress: {
            ...defaultData.billing.billingAddress,
            ...(client.billing?.billingAddress || {})
          }
        }
      };
    }

    return defaultData;
  });

  const handleChange = (e, section = null) => {
    const { name, value } = e.target;
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddressChange = (e, type = 'main') => {
    const { name, value } = e.target;
    if (type === 'billing') {
      setFormData(prev => ({
        ...prev,
        billing: {
          ...prev.billing,
          billingAddress: {
            ...prev.billing.billingAddress,
            [name]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value
        }
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations principales */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Informations principales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom du client</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Société</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">SIRET</label>
            <input
              type="text"
              name="siret"
              value={formData.siret}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Numéro de TVA</label>
            <input
              type="text"
              name="vatNumber"
              value={formData.vatNumber}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Adresse */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Adresse</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Rue</label>
            <input
              type="text"
              name="street"
              value={formData.address.street}
              onChange={(e) => handleAddressChange(e)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Code postal</label>
            <input
              type="text"
              name="postalCode"
              value={formData.address.postalCode}
              onChange={(e) => handleAddressChange(e)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ville</label>
            <input
              type="text"
              name="city"
              value={formData.address.city}
              onChange={(e) => handleAddressChange(e)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pays</label>
            <input
              type="text"
              name="country"
              value={formData.address.country}
              onChange={(e) => handleAddressChange(e)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Contact principal */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Contact principal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom du contact</label>
            <input
              type="text"
              name="name"
              value={formData.contact.name}
              onChange={(e) => handleChange(e, 'contact')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fonction</label>
            <input
              type="text"
              name="position"
              value={formData.contact.position}
              onChange={(e) => handleChange(e, 'contact')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.contact.email}
              onChange={(e) => handleChange(e, 'contact')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
            <input
              type="tel"
              name="phone"
              value={formData.contact.phone}
              onChange={(e) => handleChange(e, 'contact')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Informations de facturation */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Informations de facturation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Délai de paiement (jours)</label>
            <input
              type="number"
              name="paymentTerms"
              value={formData.billing.paymentTerms}
              onChange={(e) => handleChange(e, 'billing')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mode de paiement</label>
            <select
              name="paymentMethod"
              value={formData.billing.paymentMethod}
              onChange={(e) => handleChange(e, 'billing')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="transfer">Virement bancaire</option>
              <option value="check">Chèque</option>
              <option value="other">Autre</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email de facturation</label>
            <input
              type="email"
              name="billingEmail"
              value={formData.billing.billingEmail}
              onChange={(e) => handleChange(e, 'billing')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Notes</h3>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="4"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Notes additionnelles sur le client..."
        />
      </div>

      {/* Boutons */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {client ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>
    </form>
  );
}
