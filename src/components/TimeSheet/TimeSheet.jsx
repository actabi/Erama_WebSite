import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import TimeSheetHeader from './TimeSheetHeader';
import TimeSheetToolbar from './TimeSheetToolbar';
import TimeSheetGrid from './TimeSheetGrid';
import TimeSheetHelp from './TimeSheetHelp';
import ExportModal from './ExportModal';
import MissionSummary from './MissionSummary';

export default function TimeSheet({ 
  missions = [], 
  timeEntries = [],
  selectedMonth,
  onMonthChange,
  onAddEntry, 
  onUpdateEntry, 
  onRemoveEntry 
}) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showInactiveMissions, setShowInactiveMissions] = useState(false);
  const [showWeekends, setShowWeekends] = useState(false);

  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTotalForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return timeEntries
      .filter(entry => entry.date === dateStr)
      .reduce((sum, entry) => sum + (entry.duration || 0), 0);
  };
