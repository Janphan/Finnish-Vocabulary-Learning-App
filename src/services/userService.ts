import {
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { db, COLLECTIONS } from './firebaseConfig';
import { UserFolder, VocabularyWord } from '../types';

// Get user data (folders and favorites)
export const getUserData = async (
  userId: string
): Promise<{ folders: UserFolder[]; favorites: string[] }> => {
  const userDocRef = doc(db, COLLECTIONS.USERS, userId);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    const data = userDocSnap.data();
    return {
      folders: data.folders || [],
      favorites: data.favorites || [],
    };
  } else {
    // Return default structure for new users
    return { folders: [], favorites: [] };
  }
};

// Update user folders
export const updateUserFolders = async (
  userId: string,
  folders: UserFolder[]
): Promise<void> => {
  const userDocRef = doc(db, COLLECTIONS.USERS, userId);
  await setDoc(userDocRef, { folders }, { merge: true });
};

// Update user favorites
export const updateUserFavorites = async (
  userId: string,
  favorites: string[]
): Promise<void> => {
  const userDocRef = doc(db, COLLECTIONS.USERS, userId);
  await setDoc(userDocRef, { favorites }, { merge: true });
};

// Update word (for SRS)
export const updateWord = async (
  userId: string,
  wordId: string,
  data: Partial<VocabularyWord>
): Promise<void> => {
  const wordRef = doc(db, "users", userId, "srsWords", wordId);
  await setDoc(wordRef, data, { merge: true });
};