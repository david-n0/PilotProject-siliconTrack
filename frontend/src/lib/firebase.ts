import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  projectId: "silicon-track",
  appId: "1:111112830450:web:ac9581014cfc5a8937bf6b",
  storageBucket: "silicon-track.firebasestorage.app",
  apiKey: "AIzaSyAEbe8bA4l3JZmcq3col0sHKT8hDDXCt1c",
  authDomain: "silicon-track.firebaseapp.com",
  messagingSenderId: "111112830450",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
  }
};
