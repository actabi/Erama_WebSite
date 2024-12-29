import React from 'react';
import { format, isWeekend, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { jsPDF } from 'jspdf';

export default function PDFExporter({ missions, timeEntries, selectedMonth, showWeekends, consultant }) {
  const generatePDF = () => {
    console.log('Starting PDF generation');
    
    try {
      const doc = new jsPDF();
      
      // Générer les jours du mois
      const monthStart = startOfMonth(selectedMonth);
      const monthEnd = endOfMonth(selectedMonth);
      const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
      
      // Filtrer les jours selon l'option weekends
      const filteredDays = showWeekends ? days : days.filter(day => !isWeekend(day));

      missions.forEach((mission, index) => {
        if (index > 0) {
          doc.addPage();
        }

        // En-tête
        doc.setFontSize(16);
        doc.text('COMPTE RENDU D\'ACTIVITÉ', 105, 20, { align: 'center' });
        
        doc.setFontSize(14);
        doc.text(format(selectedMonth, 'MMMM yyyy', { locale: fr }), 105, 30, { align: 'center' });

        // Informations
        doc.setFontSize(12);
        doc.text(`Mission : ${mission.name}`, 20, 45);
        doc.text(`Consultant : ${consultant.name}`, 20, 55);
        doc.text(`Société : ${consultant.company}`, 20, 65);

        // Contenu
        let yPosition = 80;
        const lineHeight = 10;

        // Filtrer les entrées pour cette mission
        const missionEntries = timeEntries.filter(entry => entry.missionId === mission.id);

        // Créer le tableau des jours
        filteredDays.forEach(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const entry = missionEntries.find(e => e.date === dateStr);
          
          doc.text(format(day, 'dd/MM/yyyy'), 20, yPosition);
          doc.text(format(day, 'EEEE', { locale: fr }), 60, yPosition);
          doc.text(entry ? entry.duration.toString() : '-', 120, yPosition);
          
          yPosition += lineHeight;
        });

        // Total
        const total = missionEntries
          .filter(entry => {
            const entryDate = new Date(entry.date);
            return showWeekends || !isWeekend(entryDate);
          })
          .reduce((sum, entry) => sum + entry.duration, 0);

        yPosition += lineHeight;
        doc.text(`Total : ${total} jours`, 20, yPosition);

        // Signatures
        yPosition += lineHeight * 2;
        doc.text('Signature du consultant :', 20, yPosition);
        doc.text('Signature du client :', 120, yPosition);
      });

      const fileName = `CRA_${format(selectedMonth, 'yyyy-MM')}.pdf`;
      doc.save(fileName);
      console.log('PDF saved successfully');

    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <button
      onClick={generatePDF}
      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <svg 
        className="-ml-1 mr-2 h-5 w-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
        />
      </svg>
      Exporter
    </button>
  );
}
