import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit,
  onSnapshot,
  Unsubscribe 
} from 'firebase/firestore';
import { db } from '../services/firebaseVocabulary';

// Use the updated VocabularyWord interface from App.tsx  
export interface VocabularyWord {
  id: string;
  finnish: string;
  english: string;
  partOfSpeech?: string;
  categories: string[];
  cefr?: string;
  pronunciation?: string;
  audio?: string | null;
  examples?: string[];
  difficultyScore?: number;
  frequency?: number;
  example?: string;
  aiGenerated?: boolean;
  generatedAt?: string;
  aiService?: string | null;
  // Computed fields
  categoryId?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  fallbackUsed?: boolean;
}

export interface Category {
  id: string;
  name: string;
  count: number;
  emoji: string;
  description?: string;
}

export interface UseFirestoreVocabularyResult {
  words: VocabularyWord[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getRandomWordsByCategory: (categoryId: string, count?: number) => Promise<VocabularyWord[]>;
}

export function useFirestoreVocabulary(options: {
  categoryFilter?: string;
  difficultyFilter?: string;
  pageSize?: number;
  realtime?: boolean;
} = {}): UseFirestoreVocabularyResult {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { categoryFilter, difficultyFilter, pageSize = 5000, realtime = false } = options;

  const loadVocabulary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔥 Loading vocabulary from Firestore...');

      // Build vocabulary query
      const vocabularyRef = collection(db, 'vocabulary');
      let vocabularyQuery = query(vocabularyRef);

      // Add filters
      if (categoryFilter) {
        vocabularyQuery = query(vocabularyQuery, where('categories', 'array-contains', categoryFilter));
      }
      
      if (difficultyFilter && difficultyFilter !== 'all') {
        vocabularyQuery = query(vocabularyQuery, where('difficulty', '==', difficultyFilter));
      }

      // Add ordering and limit
      vocabularyQuery = query(
        vocabularyQuery,
        orderBy('frequency', 'desc'),
        firestoreLimit(pageSize)
      );

      // Get vocabulary data
      const vocabularySnapshot = await getDocs(vocabularyQuery);
      const vocabularyData = vocabularySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as VocabularyWord[];

      console.log(`📚 Loaded ${vocabularyData.length} words from Firestore`);

      // Get categories
      const categoriesRef = collection(db, 'categories');
      const categoriesSnapshot = await getDocs(categoriesRef);
      const categoriesData = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];

      console.log(`🏷️ Loaded ${categoriesData.length} categories from Firestore`);

      setWords(vocabularyData);
      setCategories(categoriesData);

    } catch (err) {
      console.error('❌ Failed to load vocabulary from Firestore:', err);
      setError(err instanceof Error ? err.message : 'Failed to load vocabulary');
      
      // Fallback to empty data
      setWords([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, difficultyFilter, pageSize]);

  const getRandomWordsByCategory = useCallback(async (categoryId: string, count: number = 10): Promise<VocabularyWord[]> => {
    try {
      const vocabularyRef = collection(db, 'vocabulary');
      const q = query(
        vocabularyRef,
        where('categories', 'array-contains', categoryId),
        firestoreLimit(count * 3) // Get more to randomize from
      );

      const snapshot = await getDocs(q);
      const categoryWords = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as VocabularyWord[];

      // Shuffle and return requested count
      const shuffled = categoryWords.sort(() => Math.random() - 0.5);
      return shuffled.slice(0, count);

    } catch (err) {
      console.error('Failed to get random words:', err);
      return [];
    }
  }, []);

  const refresh = useCallback(() => loadVocabulary(), [loadVocabulary]);

  // Setup real-time listeners if requested
  useEffect(() => {
    let vocabularyUnsubscribe: Unsubscribe | null = null;
    let categoriesUnsubscribe: Unsubscribe | null = null;

    if (realtime) {
      console.log('🔥 Setting up real-time Firestore listeners...');

      // Real-time vocabulary updates
      const vocabularyRef = collection(db, 'vocabulary');
      let vocabularyQuery = query(vocabularyRef);

      if (categoryFilter) {
        vocabularyQuery = query(vocabularyQuery, where('categories', 'array-contains', categoryFilter));
      }
      
      if (difficultyFilter && difficultyFilter !== 'all') {
        vocabularyQuery = query(vocabularyQuery, where('difficulty', '==', difficultyFilter));
      }

      vocabularyQuery = query(
        vocabularyQuery,
        orderBy('frequency', 'desc'),
        firestoreLimit(pageSize)
      );

      vocabularyUnsubscribe = onSnapshot(vocabularyQuery, 
        (snapshot) => {
          const vocabularyData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as VocabularyWord[];
          
          console.log(`🔥 Real-time update: ${vocabularyData.length} words`);
          setWords(vocabularyData);
        },
        (err) => {
          console.error('Real-time vocabulary error:', err);
          setError(err.message);
        }
      );

      // Real-time categories updates
      const categoriesRef = collection(db, 'categories');
      categoriesUnsubscribe = onSnapshot(categoriesRef,
        (snapshot) => {
          const categoriesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Category[];
          
          console.log(`🔥 Real-time update: ${categoriesData.length} categories`);
          setCategories(categoriesData);
        },
        (err) => {
          console.error('Real-time categories error:', err);
        }
      );

      setLoading(false);

    } else {
      // One-time load
      loadVocabulary();
    }

    // Cleanup listeners on unmount
    return () => {
      if (vocabularyUnsubscribe) {
        vocabularyUnsubscribe();
      }
      if (categoriesUnsubscribe) {
        categoriesUnsubscribe();
      }
    };
  }, [categoryFilter, difficultyFilter, pageSize, realtime, loadVocabulary]);

  return {
    words,
    categories,
    loading,
    error,
    refresh,
    getRandomWordsByCategory
  };
}