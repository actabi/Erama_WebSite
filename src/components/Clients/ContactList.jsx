import React from 'react';

export default function ContactList({ contacts = [], companies = [], searchTerm = '', onEdit, onRemove }) {
  // Fonction de recherche améliorée
  const filteredContacts = contacts.filter(contact => {
    const searchTermLower = searchTerm.toLowerCase();
    const company = companies.find(c => c.id === contact.companyId);
    
    return (
      contact.name?.toLowerCase().includes(searchTermLower) ||
      contact.email?.toLowerCase().includes(searchTermLower) ||
      contact.phone?.includes(searchTermLower) ||
      contact.mobile?.includes(searchTermLower) ||
      contact.position?.toLowerCase().includes(searchTermLower) ||
      company?.name.toLowerCase().includes(searchTermLower)
    );
  });

  const getContactDetails = (contact) => {
    const company = companies.find(c => c.id === contact.companyId);
    return {
      ...contact,
      companyName: company?.name
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {filteredContacts.map(contact => {
        const details = getContactDetails(contact);
        return (
          <div
            key={contact.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{contact.name}</h3>
                {contact.position && (
                  <p className="text-sm text-gray-600">{contact.position}</p>
                )}
                {details.companyName && (
                  <p className="text-sm text-blue-600">{details.companyName}</p>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(contact)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Modifier
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) {
                      onRemove(contact.id);
                    }
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>

            <div className="mt-2 space-y-1 text-sm">
              {contact.email && (
                <p>
                  <a 
                    href={`mailto:${contact.email}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {contact.email}
                  </a>
                </p>
              )}
              {contact.phone && (
                <p>
                  <a 
                    href={`tel:${contact.phone}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    📞 {contact.phone}
                  </a>
                </p>
              )}
              {contact.mobile && (
                <p>
                  <a 
                    href={`tel:${contact.mobile}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    📱 {contact.mobile}
                  </a>
                </p>
              )}
            </div>
          </div>
        );
      })}

      {filteredContacts.length === 0 && (
        <div className="col-span-2 text-center text-gray-500 py-8">
          Aucun contact ne correspond à votre recherche
        </div>
      )}
    </div>
  );
}
