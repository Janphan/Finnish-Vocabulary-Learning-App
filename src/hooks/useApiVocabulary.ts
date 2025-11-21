// Simple hook to fetch vocabulary from API server
import { useState, useEffect } from 'react';
import { VocabularyWord } from '../App';

export interface Category {
  id: string;
  name: string;
  count: number;
  emoji: string;
  description?: string;
}

export interface UseApiVocabularyResult {
  words: VocabularyWord[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getRandomWordsByCategory: (categoryId: string, count?: number) => Promise<VocabularyWord[]>;
}

const API_BASE_URL = 'http://localhost:3002/api';

export function useApiVocabulary(options: {
  categoryFilter?: string;
  difficultyFilter?: string;
  pageSize?: number;
} = {}): UseApiVocabularyResult {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching vocabulary from API...', { options });

      // Build query parameters
      const params = new URLSearchParams();
      if (options.categoryFilter) params.set('category', options.categoryFilter);
      if (options.difficultyFilter && options.difficultyFilter !== 'all') {
        params.set('difficulty', options.difficultyFilter);
      }
      if (options.pageSize) params.set('limit', options.pageSize.toString());

      const url = `${API_BASE_URL}/vocabulary?${params}`;
      console.log('📡 API URL:', url);
      
      const response = await fetch(url);
      
      console.log('📥 API Response status:', response.status, response.ok);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('📊 API Data received:', { 
        wordsCount: data.words?.length || 0, 
        categoriesCount: data.categories?.length || 0 
      });
      
      setWords(data.words || []);
      setCategories(data.categories || []);

      console.log(`✅ Loaded ${data.words?.length || 0} words from API`);
    } catch (err) {
      console.error('❌ Failed to fetch vocabulary:', err);
      setError(err instanceof Error ? err.message : 'Failed to load vocabulary');
    } finally {
      setLoading(false);
    }
  };

  const getRandomWordsByCategory = async (categoryId: string, count: number = 20): Promise<VocabularyWord[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/vocabulary/random/${categoryId}?count=${count}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.error('Failed to fetch random words:', err);
      return [];
    }
  };

  useEffect(() => {
    fetchData();
  }, [options.categoryFilter, options.difficultyFilter]);

  return {
    words,
    categories,
    loading,
    error,
    refresh: fetchData,
    getRandomWordsByCategory
  };
}