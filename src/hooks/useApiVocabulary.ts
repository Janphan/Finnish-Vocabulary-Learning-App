// Simplified hook to load vocabulary directly from JSON files (no API server needed!)
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

export function useApiVocabulary(options: {
  categoryFilter?: string;
  difficultyFilter?: string;
  pageSize?: number;
} = {}): UseApiVocabularyResult {
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate a simple Finnish example sentence
  const generateFinnishExample = (word: string, partOfSpeech: string, english: string): string => {
    const finnish = word.toLowerCase();
    
    switch(partOfSpeech) {
      case 'noun':
        if (english.includes('person') || english.includes('man') || english.includes('woman')) {
          return `${word} on mukava ihminen.`;
        }
        if (english.includes('house') || english.includes('building')) {
          return `${word} on iso ja kaunis.`;
        }
        if (english.includes('food') || english.includes('bread') || english.includes('water')) {
          return `${word} on herkullista.`;
        }
        if (english.includes('animal') || english.includes('cat') || english.includes('dog')) {
          return `${word} juoksee puistossa.`;
        }
        return `Tämä on ${finnish}.`;
        
      case 'verb':
        if (finnish.endsWith('ä') || finnish.endsWith('ä')) {
          return `Minä ${finnish}n joka päivä.`;
        }
        if (finnish.endsWith('da') || finnish.endsWith('tä')) {
          return `Haluan ${finnish}.`;
        }
        return `Opettelen ${finnish}maan.`;
        
      case 'adj':
        if (english.includes('good') || english.includes('nice') || english.includes('beautiful')) {
          return `Se on todella ${finnish}.`;
        }
        if (english.includes('big') || english.includes('small') || english.includes('large')) {
          return `Talo on ${finnish}.`;
        }
        return `Tämä on ${finnish}.`;
        
      default:
        return `Esimerkki: ${finnish}.`;
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Loading vocabulary from JSON files...');
      
      // Try to load the cleaned vocabulary dataset first (no problematic translations!)
      let vocabularyData: any[] = [];
      
      try {
        const response = await fetch('/finnish-vocab-cleaned.json');
        if (response.ok) {
          vocabularyData = await response.json();
          console.log(`📚 Loaded ${vocabularyData.length} words from cleaned Finnish vocabulary`);
        }
      } catch (err) {
        console.log('Cleaned vocabulary not found, trying backup...');
        
        // Fallback to full vocabulary if cleaned version not available
        try {
          const response = await fetch('/finnish-vocab-full.json');
          if (response.ok) {
            vocabularyData = await response.json();
            console.log(`📚 Loaded ${vocabularyData.length} words from full Finnish vocabulary`);
          }
        } catch (err) {
          console.log('Full vocabulary not found, trying other backups...');
        }
      }
      
      // Fallback to other vocabulary files if needed
      if (vocabularyData.length === 0) {
        try {
          const response = await fetch('/extracted-finnish-vocab.json');
          if (response.ok) {
            vocabularyData = await response.json();
            console.log(`📚 Loaded ${vocabularyData.length} words from extracted vocabulary`);
          }
        } catch (err) {
          const response = await fetch('/polished-vocabulary.json');
          if (response.ok) {
            vocabularyData = await response.json();
            console.log(`📚 Loaded ${vocabularyData.length} words from polished vocabulary`);
          }
        }
      }
      
      // Process vocabulary data
      const processedWords: VocabularyWord[] = vocabularyData.map((item, index) => {
        // Get primary category from categories array or fallback
        const primaryCategory = Array.isArray(item.categories) && item.categories.length > 0 
          ? item.categories[0] 
          : item.categoryId || 'general';
        
        // Map CEFR levels to difficulty
        const mapCEFRToDifficulty = (cefr: string) => {
          if (['A1', 'A2'].includes(cefr)) return 'beginner';
          if (['B1', 'B2'].includes(cefr)) return 'intermediate';
          if (['C1', 'C2'].includes(cefr)) return 'advanced';
          return 'beginner';
        };
        
        return {
          id: item.id || `vocab-${index}`,
          finnish: item.finnish,
          english: item.english,
          categoryId: primaryCategory,
          categories: item.categories || [primaryCategory],
          pronunciation: item.pronunciation,
          partOfSpeech: item.partOfSpeech,
          difficulty: item.cefr ? mapCEFRToDifficulty(item.cefr) : (item.difficulty || 'beginner'),
          frequency: item.frequency || 50,
          example: item.example || generateFinnishExample(item.finnish, item.partOfSpeech, item.english),
          examples: item.examples || [],
          cefr: item.cefr // Keep CEFR level for advanced sorting
        };
      });

      // Apply filters
      let filteredWords = processedWords;
      
      if (options.categoryFilter && options.categoryFilter !== 'all') {
        filteredWords = filteredWords.filter(word => 
          word.categories && word.categories.includes(options.categoryFilter!)
        );
      }
      
      if (options.difficultyFilter && options.difficultyFilter !== 'all') {
        filteredWords = filteredWords.filter(word => word.difficulty === options.difficultyFilter);
      }
      
      if (options.pageSize) {
        filteredWords = filteredWords.slice(0, options.pageSize);
      }

      setWords(filteredWords);
      
      // Generate categories with counts - count ALL categories that appear in vocabulary
      const categoryMap = new Map<string, number>();
      processedWords.forEach(word => {
        // Count each category the word belongs to
        if (word.categories && Array.isArray(word.categories)) {
          word.categories.forEach(category => {
            categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
          });
        } else if (word.categoryId) {
          // Fallback for words without categories array
          categoryMap.set(word.categoryId, (categoryMap.get(word.categoryId) || 0) + 1);
        }
      });

      const categoryEmojiMap: Record<string, string> = {
        // Our new semantic categories
        'Family & People': '👨‍👩‍👧‍👦',
        'Time & Numbers': '⏰',
        'Basic Actions': '🏃',
        'Nature & Weather': '🌦️',
        'Colors & Appearance': '🎨',
        'Body': '👤',
        'Food & Drink': '🍽️',
        'Animals': '🐾',
        'Work & Education': '🎓',
        'Transportation': '🚗',
        'Emotions & Mental States': '😊',
        'Home & Living': '🏠',
        
        // Part of speech categories  
        'noun': '📦',
        'verb': '🏃',
        'adjective': '🎨',
        'adverb': '⚡',
        'pronoun': '👤',
        'proper_noun': '🏷️',
        'preposition': '🔗',
        'interjection': '❗',
        
        // Legacy categories (fallback)
        'Family': '👨‍👩‍👧‍👦',
        'People': '👥',
        'Anatomy': '👤',
        'Food': '🍎',
        'Cooking': '🍳',
        'Sports': '⚽',
        'Music': '🎵',
        'Clothing': '👕',
        'Colors': '🌈',
        'Emotions': '😊',
        'Home': '🏠',
        'Weather': '☁️',
        'Time': '⏰',
        'Education': '🎓',
        'Work': '💼',
        'Chemistry': '⚗️',
        'Medicine': '🎭',
        'Computing': '💻',
        'Law': '⚖️',
        'Mathematics': '🗿',
        'Physics': '⚛️',
        'Biology': '🧬',
        'Botany': '🌿',
        'Astronomy': '🔭',
        'Geography': '🌍',
        'Military': '🪖',
        'Nautical': '⚓',
        'Geology': '🧯',
        'Linguistics': '🗣️',
        'Grammar': '📝',
        'Mushrooms': '🍄',
        
        // Fallback
        'general': '📚'
      };

      const generatedCategories: Category[] = Array.from(categoryMap.entries()).map(([id, count]) => ({
        id,
        name: id.charAt(0).toUpperCase() + id.slice(1),
        count,
        emoji: categoryEmojiMap[id] || '📖',
        description: `${count} words in ${id} category`
      }));

      setCategories(generatedCategories);
      
      console.log(`✅ Vocabulary loaded successfully: ${filteredWords.length} words displayed, ${generatedCategories.length} categories`);
      
    } catch (err) {
      console.error('❌ Failed to load vocabulary:', err);
      setError(err instanceof Error ? err.message : 'Failed to load vocabulary');
    } finally {
      setLoading(false);
    }
  };

  const getRandomWordsByCategory = async (categoryId: string, count: number = 20): Promise<VocabularyWord[]> => {
    const categoryWords = words.filter(word => 
      word.categories && word.categories.includes(categoryId)
    );
    const shuffled = [...categoryWords].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
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