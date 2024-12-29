import React from 'react';

export default function ClientDetails({ client, onClose, onEdit }) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Détails du client</h2>
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="px-4 py-2 text-blue-500 hover:text-blue-700"
            >
              Modifier
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informations principales */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Informations générales</h3>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Nom :</span> {client.name}</p>
                <p><span className="font-medium">Société :</span> {client.company}</p>
                <p><span className="font-medium">SIRET :</span> {client.siret}</p>
                <p><span className="font-medium">N° TVA :</span> {client.vatNumber}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Adresse</h3>
              <div className="mt-2 space-y-1">
                <p>{client.address?.street}</p>
                <p>{client.address?.postalCode} {client.address?.city}</p>
                <p>{client.address?.country}</p>
              </div>
            </div>
          </div>

          {/* Contact et facturation */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Contact principal</h3>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Nom :</span> {client.contact?.name}</p>
                <p><span className="font-medium">Fonction :</span> {client.contact?.position}</p>
                <p><span className="font-medium">Email :</span> {client.contact?.email}</p>
                <p><span className="font-medium">Téléphone :</span> {client.contact?.phone}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium">Informations de facturation</h3>
              <div className="mt-2 space-y-2">
                <p>
                  <span className="font-medium">Délai de paiement :</span> {client.billing?.paymentTerms} jours
                </p>
                <p>
                  <span className="font-medium">Mode de paiement :</span>{' '}
                  {client.billing?.paymentMethod === 'transfer' ? 'Virement' : 
                   client.billing?.paymentMethod === 'check' ? 'Chèque' : 'Autre'}
                </p>
                <p>
                  <span className="font-medium">Email facturation :</span> {client.billing?.billingEmail}
                </p>
              </div>
            </div>
          </div>
        </div>

        {client.notes && (
          <div className="mt-6">
            <h3 className="text-lg font-medium">Notes</h3>
            <p className="mt-2 text-gray-600 whitespace-pre-line">{client.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
