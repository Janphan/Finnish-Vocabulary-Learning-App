import {
  collection,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  writeBatch,
  onSnapshot,
} from 'firebase/firestore';
import { db, COLLECTIONS } from './firebaseConfig';
import { VocabularyWord } from '../types';

// Upload vocabulary data to Firestore (for initial setup)
export const uploadVocabulary = async (words: VocabularyWord[]): Promise<void> => {
  console.log(`🔥 Uploading ${words.length} words to Firestore...`);

  const vocabularyRef = collection(db, COLLECTIONS.VOCABULARY);

  // Split into batches of 500 (Firestore limit)
  const batchSize = 500;
  let uploadedCount = 0;

  for (let i = 0; i < words.length; i += batchSize) {
    const batchWords = words.slice(i, i + batchSize);
    const currentBatch = writeBatch(db);

    batchWords.forEach((word) => {
      const docRef = doc(vocabularyRef, word.id);
      currentBatch.set(docRef, word);
    });

    await currentBatch.commit();
    uploadedCount += batchWords.length;
    console.log(`✅ Uploaded batch: ${uploadedCount}/${words.length} words`);
  }

  console.log("🎉 All vocabulary uploaded to Firestore!");
};

// Get all vocabulary words
export const getVocabulary = async (): Promise<VocabularyWord[]> => {
  const vocabularyRef = collection(db, COLLECTIONS.VOCABULARY);
  const snapshot = await getDocs(vocabularyRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as VocabularyWord[];
};

// Get vocabulary by category
export const getVocabularyByCategory = async (
  categoryId: string
): Promise<VocabularyWord[]> => {
  const vocabularyRef = collection(db, COLLECTIONS.VOCABULARY);
  const q = query(
    vocabularyRef,
    where("categories", "array-contains", categoryId),
    orderBy("frequency", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as VocabularyWord[];
};

// Get vocabulary by difficulty
export const getVocabularyByDifficulty = async (
  difficulty: string
): Promise<VocabularyWord[]> => {
  const vocabularyRef = collection(db, COLLECTIONS.VOCABULARY);
  const q = query(
    vocabularyRef,
    where("difficulty", "==", difficulty),
    orderBy("frequency", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as VocabularyWord[];
};

// Get random words from a category
export const getRandomWordsByCategory = async (
  categoryId: string,
  count: number = 10
): Promise<VocabularyWord[]> => {
  const vocabularyRef = collection(db, COLLECTIONS.VOCABULARY);
  const q = query(
    vocabularyRef,
    where("categories", "array-contains", categoryId),
    limit(count * 3) // Get more to randomize from
  );

  const snapshot = await getDocs(q);
  const words = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as VocabularyWord[];

  // Fisher-Yates shuffle algorithm for uniform distribution
  const shuffled = [...words];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
};

// Real-time listener for vocabulary updates
export const listenToVocabulary = (callback: (words: VocabularyWord[]) => void) => {
  const vocabularyRef = collection(db, COLLECTIONS.VOCABULARY);

  return onSnapshot(vocabularyRef, (snapshot) => {
    const words = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as VocabularyWord[];

    callback(words);
  });
};

// Clear vocabulary data (for testing)
export const clearVocabularyData = async (): Promise<void> => {
  console.log("🗑️ Clearing vocabulary data...");

  const vocabularySnapshot = await getDocs(
    collection(db, COLLECTIONS.VOCABULARY)
  );
  const batch = writeBatch(db);
  vocabularySnapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();

  console.log("✅ Vocabulary data cleared!");
};