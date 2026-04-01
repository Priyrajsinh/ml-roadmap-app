'use client';

import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async (): Promise<void> => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error('Sign in failed:', e);
    }
  };

  const signOutUser = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Sign out failed:', e);
    }
  };

  return { user, loading, signIn, signOut: signOutUser };
}
