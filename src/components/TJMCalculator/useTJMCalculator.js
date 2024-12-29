import { useState, useEffect } from 'react';
import { calculateWorkingDays } from '../../utils/workingDaysCalculator';

export function useTJMCalculator() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [expenses, setExpenses] = useState({
    personal: {},
    professional: {}
  });
  const [parameters, setParameters] = useState({
    timeOff: {
      workingTimeRatio: 100,
      vacation: 5,
      training: 1,
      prospecting: 10,
      hardshipReserve: 3
    },
    taxes: {
      incomeTax: 30,
      socialCharges: 22,
      otherTaxes: 3
    }
  });

  const calculateResults = () => {
    // Calcul des dépenses mensuelles
    const monthlyPersonalExpenses = Object.values(expenses.personal).reduce((sum, category) => {
      if (typeof category === 'object') {
        return sum + Object.values(category).reduce((catSum, value) => catSum + (parseFloat(value) || 0), 0);
      }
      return sum;
    }, 0);

    const monthlyProfessionalExpenses = Object.values(expenses.professional).reduce((sum, category) => {
      if (typeof category === 'object') {
        return sum + Object.values(category).reduce((catSum, value) => catSum + (parseFloat(value) || 0), 0);
      }
      return sum;
    }, 0);

    const totalMonthlyExpenses = monthlyPersonalExpenses + monthlyProfessionalExpenses;
    const annualExpenses = totalMonthlyExpenses * 12;

    // Calcul des jours travaillés
    const workingDays = calculateWorkingDays(selectedYear);
    const workingTimeRatio = parameters.timeOff.workingTimeRatio / 100;
    
    // Calcul des jours non travaillés
    const vacationDays = Number(parameters.timeOff.vacation || 0) * 5;
    const trainingDays = Number(parameters.timeOff.training || 0) * 5;

    // Calcul des jours ajustés selon le rythme de travail
    const adjustedWorkingDays = Math.floor(workingDays * workingTimeRatio);
    const adjustedVacationDays = Math.floor(vacationDays * workingTimeRatio);
    const adjustedTrainingDays = Math.floor(trainingDays * workingTimeRatio);

    // Calcul des jours de prospection
    const prospectingDays = Math.round(adjustedWorkingDays * (parameters.timeOff.prospecting / 100));

    // Calcul des jours facturables
    const billableDays = Math.max(1, 
      adjustedWorkingDays - 
      adjustedVacationDays - 
      adjustedTrainingDays - 
      prospectingDays
    );
    
    // Calcul de la réserve pour coups durs
    const hardshipReserve = totalMonthlyExpenses * parameters.timeOff.hardshipReserve;

    // Calcul du total requis incluant les dépenses annuelles et la réserve
    const totalRequired = annualExpenses + hardshipReserve;

    // Calcul des impôts et charges
    const taxRate = (
      (parameters.taxes?.incomeTax || 0) + 
      (parameters.taxes?.socialCharges || 0) + 
      (parameters.taxes?.otherTaxes || 0)
    ) / 100;
    
    // Calcul du TJM en tenant compte des impôts
    const minimumTJM = Math.ceil(totalRequired / (1 - taxRate) / billableDays);
    const comfortableTJM = Math.ceil(minimumTJM * 1.2);
    const optimalTJM = Math.ceil(minimumTJM * 1.5);

    // Calcul du revenu annuel basé sur le TJM optimal
    const annualRevenue = optimalTJM * billableDays;

    return {
      minimumTJM,
      comfortableTJM,
      optimalTJM,
      billableDays,
      workingDays: adjustedWorkingDays,
      monthlyRevenue: annualRevenue / 12,
      annualRevenue,
      hardshipReserve,
      expenses: {
        monthly: totalMonthlyExpenses,
        annual: annualExpenses,
        personal: monthlyPersonalExpenses,
        professional: monthlyProfessionalExpenses
      }
    };
  };

  const results = calculateResults();

  useEffect(() => {
    try {
      localStorage.setItem('tjmCalculatorResults', JSON.stringify(results));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des résultats:', error);
    }
  }, [results]);

  return {
    expenses,
    setExpenses,
    parameters,
    setParameters,
    selectedYear,
    setSelectedYear,
    results
  };
}
