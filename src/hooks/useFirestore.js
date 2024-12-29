import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebase';

export function useFirestore(collectionName) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const q = query(collection(db, collectionName));
      
      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const items = [];
          snapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
          });
          setData(items);
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching data:", err);
          setError(err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error("Error setting up listener:", err);
      setError(err);
      setLoading(false);
    }
  }, [collectionName]);

  const add = async (item) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), item);
      return docRef.id;
    } catch (err) {
      console.error("Error adding document:", err);
      throw err;
    }
  };

  const update = async (id, item) => {
    try {
      await updateDoc(doc(db, collectionName, id), item);
    } catch (err) {
      console.error("Error updating document:", err);
      throw err;
    }
  };

  const remove = async (id) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (err) {
      console.error("Error removing document:", err);
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    add,
    update,
    remove
  };
}
