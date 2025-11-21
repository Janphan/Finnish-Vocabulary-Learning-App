import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  DocumentSnapshot,
  QueryConstraint
} from 'firebase/firestore';
import { db } from './firebase';
import { VocabularyWord } from '../App';

// Firestore document interfaces
export interface FirestoreVocabularyWord {
  id?: string;
  english: string;
  finnish: string;
  pronunciation: string;
  partOfSpeech: string;
  examples: string[];
  categories: string[]; // Legacy field for backward compatibility
  categoryId?: string; // New field used in seeded data
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  frequency: number;
  createdAt: any; // Firestore timestamp
}

export interface FirestoreCategory {
  id: string;
  name: string;
  count: number;
  emoji: string;
  description?: string;
}

class FirebaseVocabularyService {
  private readonly VOCABULARY_COLLECTION = 'vocabulary';
  private readonly CATEGORIES_COLLECTION = 'categories';

  // Get paginated vocabulary words - Fixed to avoid index requirements
  async getVocabularyWords(
    pageSize: number = 50,
    lastDoc?: DocumentSnapshot,
    categoryFilter?: string,
    difficultyFilter?: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<{ words: VocabularyWord[]; lastDoc: DocumentSnapshot | null }> {
    try {
      if (categoryFilter) {
        // For category filtering, use the dedicated method
        const words = await this.getWordsByCategory(categoryFilter, pageSize, difficultyFilter);
        return { words, lastDoc: null };
      }

      // For general queries, use simple ordering
      const constraints: QueryConstraint[] = [
        orderBy('frequency', 'desc'),
        limit(pageSize)
      ];

      if (lastDoc) {
        constraints.push(startAfter(lastDoc));
      }

      const q = query(collection(db, this.VOCABULARY_COLLECTION), ...constraints);
      const snapshot = await getDocs(q);

      let words: VocabularyWord[] = snapshot.docs.map(doc => {
        const data = doc.data() as FirestoreVocabularyWord;
        return this.convertToVocabularyWord(doc.id, data);
      });

      // Filter by difficulty in memory if specified
      if (difficultyFilter) {
        words = words.filter(word => (word as any).difficulty === difficultyFilter);
      }

      const newLastDoc = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

      return { words, lastDoc: newLastDoc };
    } catch (error) {
      console.error('Error fetching vocabulary words:', error);
      throw new Error('Failed to fetch vocabulary words');
    }
  }

  // Get words by category - Fixed to avoid index requirements
  async getWordsByCategory(
    categoryId: string, 
    pageSize: number = 20,
    difficultyFilter?: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<VocabularyWord[]> {
    try {
      // Use simple query without compound ordering to avoid index requirements
      const q = query(
        collection(db, this.VOCABULARY_COLLECTION),
        where('categories', 'array-contains', categoryId),
        limit(pageSize)
      );

      const snapshot = await getDocs(q);
      let words = snapshot.docs.map(doc => {
        const data = doc.data() as FirestoreVocabularyWord;
        return this.convertToVocabularyWord(doc.id, data);
      });

      // Filter by difficulty in memory to avoid complex Firebase queries
      if (difficultyFilter) {
        words = words.filter(word => (word as any).difficulty === difficultyFilter);
      }

      // Sort by frequency in memory to avoid index requirement
      return words.sort((a, b) => (b as any).frequency - (a as any).frequency);
    } catch (error) {
      console.error('Error fetching words by category:', error);
      
      // Fallback: try with categoryId field instead
      try {
        const fallbackQ = query(
          collection(db, this.VOCABULARY_COLLECTION),
          where('categoryId', '==', categoryId),
          limit(pageSize)
        );
        
        const fallbackSnapshot = await getDocs(fallbackQ);
        const fallbackWords = fallbackSnapshot.docs.map(doc => {
          const data = doc.data() as FirestoreVocabularyWord;
          return this.convertToVocabularyWord(doc.id, data);
        });
        
        return fallbackWords.sort((a, b) => (b as any).frequency - (a as any).frequency);
      } catch (fallbackError) {
        console.error('Fallback query also failed:', fallbackError);
        return [];
      }
    }
  }

  // Search words
  async searchWords(searchTerm: string, pageSize: number = 20): Promise<VocabularyWord[]> {
    try {
      // Note: Firestore doesn't support full-text search natively
      // This is a simple prefix search - for production, consider using Algolia or similar
      const englishQuery = query(
        collection(db, this.VOCABULARY_COLLECTION),
        where('english', '>=', searchTerm.toLowerCase()),
        where('english', '<=', searchTerm.toLowerCase() + '\uf8ff'),
        limit(pageSize)
      );

      const finnishQuery = query(
        collection(db, this.VOCABULARY_COLLECTION),
        where('finnish', '>=', searchTerm.toLowerCase()),
        where('finnish', '<=', searchTerm.toLowerCase() + '\uf8ff'),
        limit(pageSize)
      );

      const [englishSnapshot, finnishSnapshot] = await Promise.all([
        getDocs(englishQuery),
        getDocs(finnishQuery)
      ]);

      const wordsMap = new Map<string, VocabularyWord>();

      // Combine results and deduplicate
      [...englishSnapshot.docs, ...finnishSnapshot.docs].forEach(doc => {
        if (!wordsMap.has(doc.id)) {
          const data = doc.data() as FirestoreVocabularyWord;
          wordsMap.set(doc.id, this.convertToVocabularyWord(doc.id, data));
        }
      });

      return Array.from(wordsMap.values()).slice(0, pageSize);
    } catch (error) {
      console.error('Error searching words:', error);
      return [];
    }
  }

  // Get all categories with dynamic word counts
  async getCategories(): Promise<FirestoreCategory[]> {
    try {
      const [categoriesSnapshot, vocabularySnapshot] = await Promise.all([
        getDocs(query(collection(db, this.CATEGORIES_COLLECTION))),
        getDocs(collection(db, this.VOCABULARY_COLLECTION))
      ]);
      
      // Count words per category dynamically
      const categoryCounts = new Map<string, number>();
      vocabularySnapshot.docs.forEach(doc => {
        const data = doc.data() as FirestoreVocabularyWord;
        const categoryId = data.categoryId || data.categories?.[0];
        if (categoryId) {
          categoryCounts.set(categoryId, (categoryCounts.get(categoryId) || 0) + 1);
        }
      });
      
      // Return categories with actual word counts
      return categoriesSnapshot.docs.map(doc => {
        const data = doc.data();
        const categoryId = data.id || doc.id;
        return {
          id: doc.id,
          name: data.name,
          count: categoryCounts.get(categoryId) || 0, // Use actual count
          emoji: data.emoji,
          description: data.description
        } as FirestoreCategory;
      }).sort((a, b) => b.count - a.count); // Sort by actual word count
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  // Add a vocabulary word
  async addVocabularyWord(word: Omit<FirestoreVocabularyWord, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.VOCABULARY_COLLECTION), {
        ...word,
        createdAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding vocabulary word:', error);
      throw new Error('Failed to add vocabulary word');
    }
  }

  // Batch upload vocabulary words (for initial data seeding)
  async batchUploadWords(words: Omit<FirestoreVocabularyWord, 'id' | 'createdAt'>[]): Promise<void> {
    try {
      console.log(`🚀 Starting batch upload of ${words.length} words...`);
      
      // Upload in chunks of 50 (to avoid rate limits)
      const chunkSize = 50;
      for (let i = 0; i < words.length; i += chunkSize) {
        const chunk = words.slice(i, i + chunkSize);
        const promises = chunk.map(word => this.addVocabularyWord(word));
        await Promise.all(promises);
        
        console.log(`📝 Uploaded ${Math.min(i + chunkSize, words.length)}/${words.length} words`);
        
        // Brief delay to avoid overwhelming Firestore
        if (i + chunkSize < words.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      console.log(`✅ Successfully uploaded all ${words.length} words!`);
    } catch (error) {
      console.error('Error in batch upload:', error);
      throw new Error('Failed to batch upload words');
    }
  }

  // Helper method to convert Firestore data to VocabularyWord
  private convertToVocabularyWord(id: string, data: FirestoreVocabularyWord): VocabularyWord & { frequency: number } {
    return {
      id,
      finnish: data.finnish,
      english: data.english,
      categoryId: data.categoryId || data.categories?.[0] || 'general',
      categories: data.categories || [data.categoryId || 'general'],
      pronunciation: data.pronunciation,
      example: data.examples?.[0] || `${data.english} - ${data.finnish}`,
      difficulty: data.difficulty || 'beginner',
      frequency: data.frequency || 0 // Preserve frequency for sorting
    };
  }

  // Get random words from a category
  async getRandomWordsByCategory(categoryId: string, count: number = 20): Promise<VocabularyWord[]> {
    try {
      // Get total count first
      const words = await this.getWordsByCategory(categoryId, count * 2);
      
      // Shuffle and return requested count
      const shuffled = words.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    } catch (error) {
      console.error('Error getting random words:', error);
      return [];
    }
  }

  // Health check
  async isConnected(): Promise<boolean> {
    try {
      const testDoc = doc(db, 'test', 'connection');
      await getDoc(testDoc);
      return true;
    } catch (error) {
      console.error('Firebase connection test failed:', error);
      return false;
    }
  }
}

export const firebaseVocabularyService = new FirebaseVocabularyService();