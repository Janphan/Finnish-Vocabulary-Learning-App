import {
  collection,
  doc,
  getDocs,
  writeBatch,
  onSnapshot,
} from 'firebase/firestore';
import { db, COLLECTIONS } from './firebaseConfig';
import { Category } from '../types';

// Upload categories to Firestore
export const uploadCategories = async (categories: Category[]): Promise<void> => {
  console.log(`🏷️ Uploading ${categories.length} categories to Firestore...`);

  const batch = writeBatch(db);
  const categoriesRef = collection(db, COLLECTIONS.CATEGORIES);

  categories.forEach((category) => {
    const docRef = doc(categoriesRef, category.id);
    batch.set(docRef, category);
  });

  await batch.commit();
  console.log("✅ All categories uploaded to Firestore!");
};

// Get all categories
export const getCategories = async (): Promise<Category[]> => {
  const categoriesRef = collection(db, COLLECTIONS.CATEGORIES);
  const snapshot = await getDocs(categoriesRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Category[];
};

// Real-time listener for categories
export const listenToCategories = (callback: (categories: Category[]) => void) => {
  const categoriesRef = collection(db, COLLECTIONS.CATEGORIES);

  return onSnapshot(categoriesRef, (snapshot) => {
    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Category[];

    callback(categories);
  });
};

// Clear categories data (for testing)
export const clearCategoriesData = async (): Promise<void> => {
  console.log("🗑️ Clearing categories data...");

  const categoriesSnapshot = await getDocs(
    collection(db, COLLECTIONS.CATEGORIES)
  );
  const batch = writeBatch(db);
  categoriesSnapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();

  console.log("✅ Categories data cleared!");
};