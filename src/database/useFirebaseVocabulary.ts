import { useState, useEffect, useCallback } from 'react';
import { DocumentSnapshot } from 'firebase/firestore';
import { firebaseVocabularyService, FirestoreCategory } from './firebaseVocabularyService';
import { VocabularyWord } from '../App';

interface UseFirebaseVocabularyOptions {
  category?: string;
  pageSize?: number;
  autoLoad?: boolean;
}

interface FirebaseVocabularyState {
  words: VocabularyWord[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  lastDoc: DocumentSnapshot | null;
}

export function useFirebaseVocabulary(options: UseFirebaseVocabularyOptions = {}) {
  const { category, pageSize = 50, autoLoad = true } = options;

  const [state, setState] = useState<FirebaseVocabularyState>({
    words: [],
    isLoading: false,
    error: null,
    hasMore: true,
    lastDoc: null
  });

  const loadWords = useCallback(async (reset: boolean = true) => {
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      ...(reset && { words: [], lastDoc: null, hasMore: true })
    }));

    try {
      const { words: newWords, lastDoc } = await firebaseVocabularyService.getVocabularyWords(
        pageSize,
        reset ? undefined : state.lastDoc || undefined,
        category
      );

      setState(prev => ({
        ...prev,
        words: reset ? newWords : [...prev.words, ...newWords],
        lastDoc,
        hasMore: newWords.length === pageSize,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load vocabulary'
      }));
    }
  }, [category, pageSize, state.lastDoc]);

  const loadMore = useCallback(() => {
    if (!state.isLoading && state.hasMore) {
      loadWords(false);
    }
  }, [loadWords, state.isLoading, state.hasMore]);

  const searchWords = useCallback(async (searchTerm: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const words = await firebaseVocabularyService.searchWords(searchTerm);
      setState(prev => ({
        ...prev,
        words,
        isLoading: false,
        hasMore: false // Search results don't support pagination
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Search failed'
      }));
    }
  }, []);

  const getRandomWordsByCategory = useCallback(async (categoryId: string, count: number = 20) => {
    try {
      return await firebaseVocabularyService.getRandomWordsByCategory(categoryId, count);
    } catch (error) {
      console.error('Error getting random words:', error);
      return [];
    }
  }, []);

  useEffect(() => {
    if (autoLoad) {
      loadWords();
    }
  }, [autoLoad, category]); // Reload when category changes

  return {
    ...state,
    loadWords: () => loadWords(true),
    loadMore,
    searchWords,
    getRandomWordsByCategory
  };
}

export function useFirebaseCategories() {
  const [state, setState] = useState<{
    categories: FirestoreCategory[];
    isLoading: boolean;
    error: string | null;
  }>({
    categories: [],
    isLoading: false,
    error: null
  });

  const loadCategories = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const categories = await firebaseVocabularyService.getCategories();
      setState({
        categories,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setState({
        categories: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load categories'
      });
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return {
    ...state,
    refresh: loadCategories
  };
}

// Hook for checking Firebase connection
export function useFirebaseConnection() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      const connected = await firebaseVocabularyService.isConnected();
      setIsConnected(connected);
    };

    checkConnection();
  }, []);

  return { isConnected };
}

// Hook specifically for loading all vocabulary words for category counting
export function useAllVocabularyWords() {
  const [state, setState] = useState<{
    words: VocabularyWord[];
    isLoading: boolean;
    error: string | null;
  }>({
    words: [],
    isLoading: false,
    error: null
  });

  const loadAllWords = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Load all words with a large page size
      const { words } = await firebaseVocabularyService.getVocabularyWords(500);
      setState({
        words,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setState({
        words: [],
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load all vocabulary'
      });
    }
  }, []);

  useEffect(() => {
    loadAllWords();
  }, [loadAllWords]);

  return {
    ...state,
    refresh: loadAllWords
  };
}