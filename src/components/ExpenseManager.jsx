import { useState } from 'react'
import { format, addMonths, addDays, addYears, isBefore } from 'date-fns'
import { fr } from 'date-fns/locale'

const EXPENSE_CATEGORIES = {
  mission: [
    { id: 'transport', label: 'Transport' },
    { id: 'restaurant', label: 'Restaurant' },
    { id: 'materiel', label: 'Matériel' },
    { id: 'hebergement', label: 'Hébergement' },
    { id: 'autres', label: 'Autres' }
  ],
  general: [
    { id: 'bureau', label: 'Bureau/Location' },
    { id: 'logiciel', label: 'Logiciels/Abonnements' },
    { id: 'formation', label: 'Formation' },
    { id: 'comptabilite', label: 'Comptabilité' },
    { id: 'assurance', label: 'Assurance' },
    { id: 'autres', label: 'Autres' }
  ]
}

const RECURRENCE_TYPES = [
  { id: 'none', label: 'Pas de récurrence' },
  { id: 'monthly', label: 'Mensuel' },
  { id: 'quarterly', label: 'Trimestriel' },
  { id: 'yearly', label: 'Annuel' }
]

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

export default function ExpenseManager({ missions, expenses, onAdd, onUpdate, onRemove }) {
  const [editingExpense,
