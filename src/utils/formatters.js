export const formatCurrency = (amount) => {
  // S'assurer que le montant est un nombre
  const numericAmount = parseFloat(amount) || 0;
  
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numericAmount);
};
