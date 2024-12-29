import React, { useMemo } from 'react';
import { format, isWithinInterval, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { formatCurrency } from '../../utils/formatters';

export default function TravelPeriods({ expenses, missions, selectedMonth }) {
  // Détecter les périodes de déplacement basées sur les frais d'hébergement
  const travelPeriods = useMemo(() => {
    // Filtrer les frais d'hébergement du mois qui ont des dates de séjour
    const accommodationExpenses = expenses.filter(expense => 
      expense.category === 'hebergement' &&
      expense.stayStartDate &&
      expense.stayEndDate &&
      parseISO(expense.date).getMonth() === selectedMonth.getMonth() &&
      parseISO(expense.date).getFullYear() === selectedMonth.getFullYear()
    );

    // Créer les périodes directement à partir des dates de séjour
    const periods = accommodationExpenses.map(accommodation => ({
      startDate: accommodation.stayStartDate,
      endDate: accommodation.stayEndDate,
      missionId: accommodation.missionId,
      accommodations: [accommodation]
    }));

    // Fusionner les périodes qui se chevauchent pour la même mission
    const mergedPeriods = periods.reduce((acc, period) => {
      const overlappingPeriodIndex = acc.findIndex(p => 
        p.missionId === period.missionId &&
        (isWithinInterval(parseISO(period.startDate), {
          start: parseISO(p.startDate),
          end: parseISO(p.endDate)
        }) ||
        isWithinInterval(parseISO(period.endDate), {
          start: parseISO(p.startDate),
          end: parseISO(p.endDate)
        }))
      );

      if (overlappingPeriodIndex >= 0) {
        const overlappingPeriod = acc[overlappingPeriodIndex];
        acc[overlappingPeriodIndex] = {
          ...overlappingPeriod,
          startDate: new Date(Math.min(
            parseISO(period.startDate),
            parseISO(overlappingPeriod.startDate)
          )).toISOString().split('T')[0],
          endDate: new Date(Math.max(
            parseISO(period.endDate),
            parseISO(overlappingPeriod.endDate)
          )).toISOString().split('T')[0],
          accommodations: [...overlappingPeriod.accommodations, ...period.accommodations]
        };
      } else {
        acc.push(period);
      }
      return acc;
    }, []);

    // Ajouter tous les frais correspondant à chaque période
    return mergedPeriods.map(period => {
      const relatedExpenses = expenses.filter(expense => {
        const expenseDate = parseISO(expense.date);
        return expense.missionId === period.missionId &&
               isWithinInterval(expenseDate, {
                 start: parseISO(period.startDate),
                 end: parseISO(period.endDate)
               });
      });

      // Grouper les dépenses par catégorie
      const expensesByCategory = relatedExpenses.reduce((acc, expense) => {
        if (!acc[expense.category]) {
          acc[expense.category] = [];
        }
        acc[expense.category].push(expense);
        return acc;
      }, {});

      return {
        ...period,
        expenses: relatedExpenses,
        expensesByCategory
      };
    });
  }, [expenses, selectedMonth]);

  // ... reste du code d'affichage inchangé ...
}
