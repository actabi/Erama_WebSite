import { parse, format, isValid } from 'date-fns';

const DATE_FORMATS = [
  'dd-MM-yyyy HH:mm:ss',
  'dd/MM/yyyy HH:mm:ss',
  'yyyy-MM-dd HH:mm:ss',
  'dd-MM-yyyy',
  'dd/MM/yyyy',
  'yyyy-MM-dd',
  'MM/dd/yyyy',
  'yyyy/MM/dd',
  'dd.MM.yyyy',
  'yyyy.MM.dd',
  // Formats avec heures
  'dd-MM-yyyy HH:mm',
  'dd/MM/yyyy HH:mm',
  'yyyy-MM-dd HH:mm',
  // Formats américains
  'MM-dd-yyyy',
  'MM/dd/yyyy',
  // Formats ISO
  "yyyy-MM-dd'T'HH:mm:ss.SSSX",
  "yyyy-MM-dd'T'HH:mm:ssX",
  "yyyy-MM-dd'T'HH:mm:ss"
];

export const parseDate = (dateValue) => {
  if (!dateValue) return null;

  // Si c'est déjà un objet Date valide
  if (dateValue instanceof Date && isValid(dateValue)) {
    return format(dateValue, 'yyyy-MM-dd');
  }

  // Si c'est un nombre (format Excel)
  if (typeof dateValue === 'number') {
    try {
      const excelEpoch = new Date(1899, 11, 30);
      const date = new Date(excelEpoch.getTime() + dateValue * 24 * 60 * 60 * 1000);
      if (isValid(date)) {
        return format(date, 'yyyy-MM-dd');
      }
    } catch (error) {
      console.log('Erreur parsing date Excel:', error);
    }
  }

  // Si c'est une chaîne de caractères
  if (typeof dateValue === 'string') {
    const dateString = dateValue.trim();

    // Essayer chaque format connu
    for (const dateFormat of DATE_FORMATS) {
      try {
        const parsedDate = parse(dateString, dateFormat, new Date());
        if (isValid(parsedDate)) {
          return format(parsedDate, 'yyyy-MM-dd');
        }
      } catch (error) {
        continue;
      }
    }

    // Essayer le parsing natif en dernier recours
    try {
      const nativeDate = new Date(dateString);
      if (isValid(nativeDate)) {
        return format(nativeDate, 'yyyy-MM-dd');
      }
    } catch (error) {
      console.log('Erreur parsing date native:', error);
    }
  }

  return null;
};
