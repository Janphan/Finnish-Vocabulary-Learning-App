// Re-export Firebase services for backward compatibility
export { db, COLLECTIONS } from './firebaseConfig';
export type { VocabularyWord, Category } from '../types';

// Vocabulary operations
export {
  uploadVocabulary,
  getVocabulary,
  getVocabularyByCategory,
  getVocabularyByDifficulty,
  getRandomWordsByCategory,
  listenToVocabulary,
  clearVocabularyData,
} from './vocabularyService';

// Category operations
export {
  uploadCategories,
  getCategories,
  listenToCategories,
  clearCategoriesData,
} from './categoryService';

// User operations
export {
  getUserData,
  updateUserFolders,
  updateUserFavorites,
  updateWord,
} from './userService';

// Legacy class for backward compatibility (deprecated - use individual functions)
export class FirebaseVocabularyService {
  static async getUserData(userId: string) {
    const { getUserData } = await import('./userService');
    return getUserData(userId);
  }

  static async updateUserFolders(userId: string, folders: any[]) {
    const { updateUserFolders } = await import('./userService');
    return updateUserFolders(userId, folders);
  }

  static async updateUserFavorites(userId: string, favorites: string[]) {
    const { updateUserFavorites } = await import('./userService');
    return updateUserFavorites(userId, favorites);
  }

  static async uploadVocabulary(words: any[]) {
    const { uploadVocabulary } = await import('./vocabularyService');
    return uploadVocabulary(words);
  }

  static async uploadCategories(categories: any[]) {
    const { uploadCategories } = await import('./categoryService');
    return uploadCategories(categories);
  }

  static async getVocabulary() {
    const { getVocabulary } = await import('./vocabularyService');
    return getVocabulary();
  }

  static async getVocabularyByCategory(categoryId: string) {
    const { getVocabularyByCategory } = await import('./vocabularyService');
    return getVocabularyByCategory(categoryId);
  }

  static async getVocabularyByDifficulty(difficulty: string) {
    const { getVocabularyByDifficulty } = await import('./vocabularyService');
    return getVocabularyByDifficulty(difficulty);
  }

  static async getRandomWordsByCategory(categoryId: string, count: number = 10) {
    const { getRandomWordsByCategory } = await import('./vocabularyService');
    return getRandomWordsByCategory(categoryId, count);
  }

  static async getCategories() {
    const { getCategories } = await import('./categoryService');
    return getCategories();
  }

  static listenToVocabulary(callback: (words: any[]) => void) {
    // For listeners, use direct import since dynamic import in sync function is problematic
    import('./vocabularyService').then(({ listenToVocabulary }) => {
      return listenToVocabulary(callback);
    });
  }

  static listenToCategories(callback: (categories: any[]) => void) {
    // For listeners, use direct import since dynamic import in sync function is problematic
    import('./categoryService').then(({ listenToCategories }) => {
      return listenToCategories(callback);
    });
  }

  static async clearAllData() {
    const { clearVocabularyData } = await import('./vocabularyService');
    const { clearCategoriesData } = await import('./categoryService');
    await clearVocabularyData();
    await clearCategoriesData();
  }

  static async updateWord(userId: string, wordId: string, data: any) {
    const { updateWord } = await import('./userService');
    return updateWord(userId, wordId, data);
  }
}

