import React from 'react';
import styles from './styles/ClientList.module.css';

export default function CompanyList({ 
  companies, 
  searchTerm,
  onEdit,
  onRemove 
}) {
  const filteredCompanies = companies.filter(company => {
    const searchLower = searchTerm.toLowerCase();
    return (
      company.name?.toLowerCase().includes(searchLower) ||
      company.siret?.toLowerCase().includes(searchLower) ||
      company.vatNumber?.toLowerCase().includes(searchLower) ||
      company.address?.city?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className={styles.itemsGrid}>
      {filteredCompanies.map(company => (
        <div key={company.id} className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>{company.name}</h3>
            <div className={styles.cardActions}>
              <button
                onClick={() => onEdit(company)}
                className={`${styles.actionButton} ${styles.editButton}`}
              >
                Modifier
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?')) {
                    onRemove(company.id);
                  }
                }}
                className={`${styles.actionButton} ${styles.deleteButton}`}
              >
                Supprimer
              </button>
            </div>
          </div>
          
          <div className={styles.cardContent}>
            {company.address && (
              <>
                <p>{company.address.street}</p>
                <p>{company.address.postalCode} {company.address.city}</p>
                <p>{company.address.country}</p>
              </>
            )}
            {company.siret && (
              <p className="mt-2">SIRET: {company.siret}</p>
            )}
            {company.vatNumber && (
              <p>TVA: {company.vatNumber}</p>
            )}
          </div>
        </div>
      ))}

      {filteredCompanies.length === 0 && (
        <div className={styles.emptyState}>
          Aucune entreprise ne correspond à votre recherche
        </div>
      )}
    </div>
  );
}
