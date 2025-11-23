import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";

export const authService = {
  // Sign up a new user
  async signUp(email: string, password: string): Promise<User> {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  },

  // Sign in an existing user
  async signIn(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  },

  // Sign in with Google
  async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential.user;
  },

  // Sign out the current user
  async signOut(): Promise<void> {
    await signOut(auth);
  },

  // Listen for authentication state changes
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },
};
