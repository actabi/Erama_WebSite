import { eachDayOfInterval, isWeekend, getYear, setYear, startOfYear, endOfYear } from 'date-fns';
import { fr } from 'date-fns/locale';

// Liste des jours fériés en France (format MM-DD)
const FRENCH_HOLIDAYS = [
  '01-01', // Jour de l'an
  '05-01', // Fête du travail
  '05-08', // Victoire 1945
  '07-14', // Fête nationale
  '08-15', // Assomption
  '11-01', // Toussaint
  '11-11', // Armistice
  '12-25', // Noël
];

// Calcul de Pâques selon l'algorithme de Meeus/Jones/Butcher
function calculateEaster(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  
  return new Date(year, month - 1, day);
}

// Calcul des jours fériés variables pour une année donnée
function getVariableHolidays(year) {
  const easter = calculateEaster(year);
  const easterMonday = new Date(easter);
  easterMonday.setDate(easter.getDate() + 1);
  
  const ascension = new Date(easter);
  ascension.setDate(easter.getDate() + 39);
  
  const pentecost = new Date(easter);
  pentecost.setDate(easter.getDate() + 50);

  return [
    easter.toISOString().slice(0, 10),
    easterMonday.toISOString().slice(0, 10),
    ascension.toISOString().slice(0, 10),
    pentecost.toISOString().slice(0, 10)
  ];
}

// Vérifie si une date est un jour férié
function isHoliday(date) {
  const year = getYear(date);
  const monthDay = date.toISOString().slice(5, 10);
  const dateStr = date.toISOString().slice(0, 10);
  
  // Vérifier les jours fériés fixes
  if (FRENCH_HOLIDAYS.includes(monthDay)) {
    return true;
  }
  
  // Vérifier les jours fériés variables
  const variableHolidays = getVariableHolidays(year);
  return variableHolidays.includes(dateStr);
}

export function calculateWorkingDays(year = new Date().getFullYear()) {
  const startDate = startOfYear(setYear(new Date(), year));
  const endDate = endOfYear(setYear(new Date(), year));
  
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });
  
  // Filtrer les weekends et les jours fériés
  const workingDays = allDays.filter(date => {
    return !isWeekend(date) && !isHoliday(date);
  });

  return workingDays.length;
}

export function getWorkingDaysDetails(year = new Date().getFullYear()) {
  const totalDays = 365 + (year % 4 === 0 ? 1 : 0);
  const startDate = startOfYear(setYear(new Date(), year));
  const endDate = endOfYear(setYear(new Date(), year));
  
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });
  
  const weekends = allDays.filter(date => isWeekend(date)).length;
  const holidays = allDays.filter(date => !isWeekend(date) && isHoliday(date)).length;
  const workingDays = calculateWorkingDays(year);

  return {
    totalDays,
    weekends,
    holidays,
    workingDays,
    details: {
      year,
      message: `Pour l'année ${year} :
        - Nombre total de jours : ${totalDays}
        - Weekends : ${weekends} jours
        - Jours fériés (hors weekends) : ${holidays} jours
        - Jours ouvrés : ${workingDays} jours`
    }
  };
}
