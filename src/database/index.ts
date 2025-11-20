// Database exports - centralized database access
export { db, analytics } from './firebase';
export { firebaseVocabularyService } from './firebaseVocabularyService';
export { 
  useFirebaseVocabulary, 
  useFirebaseCategories, 
  useFirebaseConnection 
} from './useFirebaseVocabulary';
export type { FirestoreCategory, FirestoreVocabularyWord } from './firebaseVocabularyService';