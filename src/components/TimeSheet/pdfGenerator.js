import { format, isWeekend } from 'date-fns';
import { fr } from 'date-fns/locale';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generatePDF = ({ 
  missions, 
  timeEntries, 
  selectedMonth, 
  includeWeekends,
  consultant = { name: "Consultant", company: "Société" }
}) => {
  const doc = new jsPDF();
  
  // En-tête
  doc.setFontSize(20);
  doc.text('Compte Rendu d\'Activité', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(format(selectedMonth, 'MMMM yyyy', { locale: fr }), 105, 30, { align: 'center' });

  // Informations du consultant
  doc.setFontSize(10);
  doc.text('Consultant :', 20, 45);
  doc.text(consultant.name, 60, 45);
  doc.text(consultant.company, 60, 52);
  
  const monthStart = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
  const monthEnd = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
  
  doc.text('Période :', 20, 65);
  doc.text(`Du ${format(monthStart, 'dd/MM/yyyy')} au ${format(monthEnd, 'dd/MM/yyyy')}`, 60, 65);

  // Tableau des temps
  const days = Array.from(
    { length: monthEnd.getDate() },
    (_, i) => new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), i + 1)
  ).filter(day => includeWeekends || !isWeekend(day));

  const tableData = days.map(day => {
    const dateStr = format(day, 'yyyy-MM-dd');
    const row = [
      format(day, 'dd/MM/yyyy'),
      format(day, 'EEEE', { locale: fr }),
    ];

    missions.forEach(mission => {
      const entry = timeEntries.find(
        e => e.date === dateStr && e.missionId === mission.id
      );
      row.push(entry ? entry.duration.toString() : '');
    });

    return row;
  });

  const headers = [
    'Date',
    'Jour',
    ...missions.map(mission => mission.name)
  ];

  doc.autoTable({
    startY: 75,
    head: [headers],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontSize: 8,
    },
  });

  // Totaux
  const finalY = doc.previousAutoTable.finalY + 10;
  missions.forEach((mission, index) => {
    const total = timeEntries
      .filter(entry => entry.missionId === mission.id)
      .reduce((sum, entry) => sum + entry.duration, 0);
    
    doc.text(`${mission.name} : ${total.toFixed(1)} jours`, 20, finalY + (index * 7));
  });

  // Signatures
  const signatureY = finalY + (missions.length * 7) + 20;
  doc.text('Signature du consultant :', 20, signatureY);
  doc.text('Signature du client :', 120, signatureY);

  // Sauvegarder le PDF
  doc.save(`CRA_${format(selectedMonth, 'yyyy-MM')}.pdf`);
};
