import { 
  collection, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  writeBatch,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';

// Collection references
export const COLLECTIONS = {
  VOCABULARY: 'vocabulary',
  CATEGORIES: 'categories',
  METADATA: 'metadata',
  USERS: 'users',
} as const;

// Types
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
  // Computed fields (added by upload script or app)
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

export interface UserFolder {
  id: string;
  name: string;
  wordIds: string[];
}

export interface UserData {
  folders: UserFolder[];
  favorites: string[];
}

// Service class for Firestore operations
export class FirestoreService {
  
  // Upload vocabulary data to Firestore (for initial setup)
  static async uploadVocabulary(words: VocabularyWord[]): Promise<void> {
    console.log(`🔥 Uploading ${words.length} words to Firestore...`);
    
    const batch = writeBatch(db);
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
    
    console.log('🎉 All vocabulary uploaded to Firestore!');
  }
  
  // Upload categories to Firestore
  static async uploadCategories(categories: Category[]): Promise<void> {
    console.log(`🏷️ Uploading ${categories.length} categories to Firestore...`);
    
    const batch = writeBatch(db);
    const categoriesRef = collection(db, COLLECTIONS.CATEGORIES);
    
    categories.forEach((category) => {
      const docRef = doc(categoriesRef, category.id);
      batch.set(docRef, category);
    });
    
    await batch.commit();
    console.log('✅ All categories uploaded to Firestore!');
  }
  
  // Get all vocabulary words
  static async getVocabulary(): Promise<VocabularyWord[]> {
    const vocabularyRef = collection(db, COLLECTIONS.VOCABULARY);
    const snapshot = await getDocs(vocabularyRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as VocabularyWord[];
  }
  
  // Get vocabulary by category
  static async getVocabularyByCategory(categoryId: string): Promise<VocabularyWord[]> {
    const vocabularyRef = collection(db, COLLECTIONS.VOCABULARY);
    const q = query(
      vocabularyRef,
      where('categories', 'array-contains', categoryId),
      orderBy('frequency', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as VocabularyWord[];
  }
  
  // Get vocabulary by difficulty
  static async getVocabularyByDifficulty(difficulty: string): Promise<VocabularyWord[]> {
    const vocabularyRef = collection(db, COLLECTIONS.VOCABULARY);
    const q = query(
      vocabularyRef,
      where('difficulty', '==', difficulty),
      orderBy('frequency', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as VocabularyWord[];
  }
  
  // Get random words from a category
  static async getRandomWordsByCategory(categoryId: string, count: number = 10): Promise<VocabularyWord[]> {
    const vocabularyRef = collection(db, COLLECTIONS.VOCABULARY);
    const q = query(
      vocabularyRef,
      where('categories', 'array-contains', categoryId),
      limit(count * 3) // Get more to randomize from
    );
    
    const snapshot = await getDocs(q);
    const words = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as VocabularyWord[];
    
    // Shuffle and return requested count
    const shuffled = words.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }
  
  // Get all categories
  static async getCategories(): Promise<Category[]> {
    const categoriesRef = collection(db, COLLECTIONS.CATEGORIES);
    const snapshot = await getDocs(categoriesRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Category[];
  }
  
  // Real-time listener for vocabulary updates
  static listenToVocabulary(callback: (words: VocabularyWord[]) => void) {
    const vocabularyRef = collection(db, COLLECTIONS.VOCABULARY);
    
    return onSnapshot(vocabularyRef, (snapshot) => {
      const words = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as VocabularyWord[];
      
      callback(words);
    });
  }
  
  // Real-time listener for categories
  static listenToCategories(callback: (categories: Category[]) => void) {
    const categoriesRef = collection(db, COLLECTIONS.CATEGORIES);
    
    return onSnapshot(categoriesRef, (snapshot) => {
      const categories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      
      callback(categories);
    });
  }
  
  // Clear all data (for testing)
  static async clearAllData(): Promise<void> {
    console.log('🗑️ Clearing all Firestore data...');
    
    // Clear vocabulary
    const vocabularySnapshot = await getDocs(collection(db, COLLECTIONS.VOCABULARY));
    const batch1 = writeBatch(db);
    vocabularySnapshot.docs.forEach(doc => batch1.delete(doc.ref));
    await batch1.commit();
    
    // Clear categories
    const categoriesSnapshot = await getDocs(collection(db, COLLECTIONS.CATEGORIES));
    const batch2 = writeBatch(db);
    categoriesSnapshot.docs.forEach(doc => batch2.delete(doc.ref));
    await batch2.commit();
    
    console.log('✅ All Firestore data cleared!');
  }
}