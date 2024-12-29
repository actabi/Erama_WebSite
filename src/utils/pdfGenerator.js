import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isWeekend, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

export function generateTimeSheet(mission, timeEntries, consultant, selectedMonth, includeWeekends = false) {
  // Filtrer les entrées de temps pour cette mission et ce mois
  const monthStart = startOfMonth(selectedMonth)
  const monthEnd = endOfMonth(selectedMonth)
  
  const missionTimeEntries = timeEntries.filter(entry => {
    const entryDate = new Date(entry.date)
    return entry.missionId === mission.id && 
           isSameMonth(entryDate, selectedMonth)
  })
  
  // Créer un nouveau document PDF
  const doc = new jsPDF()

  // Configuration des styles
  doc.setFont('helvetica')
  
  // En-tête
  doc.setFontSize(20)
  doc.text('ERAMA', 20, 20)
  
  doc.setFontSize(16)
  const title = 'Feuille de temps mensuelle'
  const titleWidth = doc.getStringUnitWidth(title) * doc.getFontSize() / doc.internal.scaleFactor
  const pageWidth = doc.internal.pageSize.width
  doc.text(title, (pageWidth - titleWidth) / 2, 20)

  doc.setFontSize(12)
  const subtitle = format(selectedMonth, 'MMMM yyyy', { locale: fr })
  const subtitleWidth = doc.getStringUnitWidth(subtitle) * doc.getFontSize() / doc.internal.scaleFactor
  doc.text(subtitle, (pageWidth - subtitleWidth) / 2, 30)

  // Informations du projet
  doc.setFontSize(10)
  doc.text(`Projet : ${mission.name}`, 20, 45)
  doc.text(`Consultant : ${consultant.name}`, 20, 52)
  doc.text(`Responsable : ${consultant.manager}`, 20, 59)

  // Statistiques à droite
  const statsX = 120
  doc.text(`Mois : ${format(selectedMonth, 'M/yyyy')}`, statsX, 45)
  
  const totalDaysWorked = missionTimeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0)
  const totalDaysWorkedAllTime = timeEntries
    .filter(entry => entry.missionId === mission.id)
    .reduce((sum, entry) => sum + (entry.duration || 0), 0)
  
  doc.text(`Jours travaillés ce mois : ${totalDaysWorked.toFixed(1)} jours`, statsX, 52)
  
  if (mission.type === 'regie') {
    const remainingDays = mission.maxDays - totalDaysWorkedAllTime
    doc.text(`Jours missionnés restants : ${remainingDays.toFixed(1)} jours`, statsX, 59)
    doc.text(`Nombre total de jours missionnés : ${mission.maxDays} jours`, statsX, 66)
  }

  // Préparation des données du tableau
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
    .filter(day => includeWeekends || !isWeekend(day))

  const tableData = days.map(day => {
    const entry = missionTimeEntries.find(e => e.date === format(day, 'yyyy-MM-dd'))
    
    // Calculer les jours travaillés jusqu'à cette date
    const daysWorkedUntilDate = timeEntries
      .filter(e => {
        const entryDate = parseISO(e.date)
        return e.missionId === mission.id && entryDate <= day
      })
      .reduce((sum, e) => sum + e.duration, 0)
    
    // Calculer les jours restants à cette date
    const remainingDays = mission.type === 'regie' 
      ? Math.max(0, mission.maxDays - daysWorkedUntilDate)
      : ''
    
    return [
      format(day, 'dd/MM/yyyy'),
      format(day, 'EEEE', { locale: fr }),
      entry ? entry.duration.toFixed(1) : '-',
      remainingDays ? remainingDays.toFixed(1) : ''
    ]
  })

  // Génération du tableau
  const tableWidth = pageWidth - 40 // 20mm de marge de chaque côté
  const columnWidths = {
    0: tableWidth * 0.25, // Date
    1: tableWidth * 0.35, // Jour
    2: tableWidth * 0.2,  // Présence
    3: tableWidth * 0.2   // Restant
  }

  doc.autoTable({
    startY: 75,
    head: [['Date', 'Jour', 'Présence', 'Restant']],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    columnStyles: {
      0: { cellWidth: columnWidths[0] },
      1: { cellWidth: columnWidths[1] },
      2: { cellWidth: columnWidths[2], halign: 'center' },
      3: { cellWidth: columnWidths[3], halign: 'center' },
    },
    margin: { left: 20, right: 20 },
    tableWidth: 'auto',
  })

  // Total en bas du tableau
  const finalY = doc.previousAutoTable.finalY + 10
  doc.text(`Total jours travaillés : ${totalDaysWorked.toFixed(1)} jours`, pageWidth - 60, finalY)
  if (mission.type === 'regie') {
    doc.text(`Jours restants : ${(mission.maxDays - totalDaysWorkedAllTime).toFixed(1)} jours`, pageWidth - 60, finalY + 7)
  }

  // Signatures
  const signatureY = finalY + 30
  doc.text('Signature du consultant :', 20, signatureY)
  doc.text('Signature du client :', 120, signatureY)

  // Retourner le PDF
  return doc.save(`${mission.name}_${format(selectedMonth, 'yyyy-MM')}.pdf`)
}
