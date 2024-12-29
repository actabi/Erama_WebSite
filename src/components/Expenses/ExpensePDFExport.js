import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatCurrency } from '../../utils/formatters';
import { EXPENSE_CATEGORIES } from './constants';

export function generateExpensePDF({ expenses, missions, dateRange, totals }) {
  // Créer un nouveau document PDF
  const doc = new jsPDF();
  
  // En-tête
  doc.setFontSize(20);
  doc.text('Note de frais', 105, 20, { align: 'center' });
  
  // Période
  doc.setFontSize(12);
  doc.text(`Période : du ${format(new Date(dateRange.from), 'dd/MM/yyyy', { locale: fr })} ` +
          `au ${format(new Date(dateRange.to), 'dd/MM/yyyy', { locale: fr })}`, 20, 40);

  // Totaux
  doc.text(`Total frais de mission : ${formatCurrency(totals.mission)}`, 20, 50);
  doc.text(`Total frais généraux : ${formatCurrency(totals.general)}`, 20, 60);
  doc.text(`Total général : ${formatCurrency(totals.mission + totals.general)}`, 20, 70);

  // Préparer les données du tableau
  const tableData = expenses.map(expense => {
    const mission = expense.missionId ? missions.get(expense.missionId) : null;
    const categoryLabel = expense.type === 'mission' 
      ? EXPENSE_CATEGORIES.mission.find(c => c.id === expense.category)?.label
      : EXPENSE_CATEGORIES.general.find(c => c.id === expense.category)?.label;

    return [
      format(new Date(expense.date), 'dd/MM/yyyy'),
      expense.type === 'mission' ? 'Mission' : 'Général',
      mission?.name || '-',
      categoryLabel || expense.category,
      expense.description,
      formatCurrency(expense.amount)
    ];
  });

  // Ajouter le tableau
  doc.autoTable({
    startY: 80,
    head: [['Date', 'Type', 'Mission', 'Catégorie', 'Description', 'Montant']],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontSize: 8,
      fontStyle: 'bold'
    },
    columnStyles: {
      5: { halign: 'right' }
    },
    footStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    },
    foot: [[
      '', '', '', '', 'Total',
      formatCurrency(totals.mission + totals.general)
    ]]
  });

  // Ajouter les signatures
  const finalY = doc.previousAutoTable.finalY + 20;
  doc.text('Signature du consultant :', 20, finalY);
  doc.text('Signature du client :', 120, finalY);

  // Sauvegarder le PDF
  doc.save(`Note_de_frais_${format(new Date(), 'yyyy-MM')}.pdf`);
}
