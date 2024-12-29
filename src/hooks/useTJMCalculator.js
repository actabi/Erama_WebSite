import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { calculateWorkingDays } from '../utils/workingDaysCalculator';

// Structure initiale des dépenses
const INITIAL_EXPENSES = {
  personal: {
    housing: {
      rent: 0,
      charges: 0,
      insurance: 0,
      propertyTax: 0,
      internet: 0,
      phone: 0,
      other: 0
    },
    transport: {
      card: 0,
      fuel: 0,
      insurance: 0,
      maintenance: 0
    },
    food: {
      groceries: 0,
      restaurants: 0
    },
    leisure: {
      entertainment: 0,
      subscriptions: 0,
      sports: 0,
      shopping: 0
    }
  },
  professional: {
    production: {
      workspace: 0,
      equipment: 0,
      supplies: 0,
      software: 0,
      phone: 0,
      insurance: 0,
      other: 0
    },
    commercial: {
      travel: 0,
      marketing: 0
    },
    charges: {
      socialCharges: 0,
      accountant: 0
    }
  }
};

// Structure initiale des paramètres
const INITIAL_PARAMETERS = {
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
};

export function useTJMCalculator() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [parameters, setParameters] = useState(INITIAL_PARAMETERS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les données au démarrage
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Charger les dépenses
        const expensesDoc = await getDoc(doc(db, 'tjmCalculator', 'expenses'));
        if (expensesDoc.exists()) {
          const loadedExpenses = expensesDoc.data();
          setExpenses(prevExpenses => ({
            personal: {
              housing: { ...prevExpenses.personal.housing, ...loadedExpenses.personal?.housing },
              transport: { ...prevExpenses.personal.transport, ...loadedExpenses.personal?.transport },
              food: { ...prevExpenses.personal.food, ...loadedExpenses.personal?.food },
              leisure: { ...prevExpenses.personal.leisure, ...loadedExpenses.personal?.leisure }
            },
            professional: {
              production: { ...prevExpenses.professional.production, ...loadedExpenses.professional?.production },
              commercial: { ...prevExpenses.professional.commercial, ...loadedExpenses.professional?.commercial },
              charges: { ...prevExpenses.professional.charges, ...loadedExpenses.professional?.charges }
            }
          }));
        }

        // Charger les paramètres
        const parametersDoc = await getDoc(doc(db, 'tjmCalculator', 'parameters'));
        if (parametersDoc.exists()) {
          const loadedParameters = parametersDoc.data();
          setParameters(prevParameters => ({
            timeOff: { ...prevParameters.timeOff, ...loadedParameters.timeOff },
            taxes: { ...prevParameters.taxes, ...loadedParameters.taxes }
          }));
        }

        // Charger l'année sélectionnée
        const yearDoc = await getDoc(doc(db, 'tjmCalculator', 'selectedYear'));
        if (yearDoc.exists()) {
          setSelectedYear(yearDoc.data().year);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Sauvegarder les dépenses
  useEffect(() => {
    const saveExpenses = async () => {
      if (isLoading) return;
      
      try {
        await setDoc(doc(db, 'tjmCalculator', 'expenses'), expenses);
        console.log('Dépenses sauvegardées avec succès');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des dépenses:', error);
        setError(error);
      }
    };

    const debounceTimer = setTimeout(saveExpenses, 500);
    return () => clearTimeout(debounceTimer);
  }, [expenses, isLoading]);

  // Sauvegarder les paramètres
  useEffect(() => {
    const saveParameters = async () => {
      if (isLoading) return;

      try {
        await setDoc(doc(db, 'tjmCalculator', 'parameters'), parameters);
        console.log('Paramètres sauvegardés avec succès');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des paramètres:', error);
        setError(error);
      }
    };

    const debounceTimer = setTimeout(saveParameters, 500);
    return () => clearTimeout(debounceTimer);
  }, [parameters, isLoading]);

  // Sauvegarder l'année sélectionnée
  useEffect(() => {
    const saveSelectedYear = async () => {
      if (isLoading) return;

      try {
        await setDoc(doc(db, 'tjmCalculator', 'selectedYear'), { year: selectedYear });
        console.log('Année sélectionnée sauvegardée avec succès');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'année:', error);
        setError(error);
      }
    };

    const debounceTimer = setTimeout(saveSelectedYear, 500);
    return () => clearTimeout(debounceTimer);
  }, [selectedYear, isLoading]);

  // Fonction pour mettre à jour les dépenses
  const updateExpenses = (category, subcategory, field, value) => {
    setExpenses(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [subcategory]: {
          ...prev[category][subcategory],
          [field]: parseFloat(value) || 0
        }
      }
    }));
  };

  // Fonction pour mettre à jour les paramètres
  const updateParameters = (section, field, value) => {
    setParameters(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: parseFloat(value) || 0
      }
    }));
  };

  // Calcul des résultats
  const results = calculateResults(expenses, parameters, selectedYear);

  return {
    expenses,
    setExpenses,
    updateExpenses,
    parameters,
    setParameters,
    updateParameters,
    selectedYear,
    setSelectedYear,
    results,
    isLoading,
    error
  };
}

// ... reste du code de calcul inchangé ...
