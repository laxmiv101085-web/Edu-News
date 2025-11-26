import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    signInWithPopup,
    GoogleAuthProvider,
    User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface User {
    id: string;
    name: string;
    email: string;
    firebaseUid: string;
}

interface AuthContextType {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    error: string | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    firebaseUser: null,
    loading: true,
    login: async () => { },
    register: async () => { },
    signInWithGoogle: async () => { },
    logout: async () => { },
    error: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Listen to Firebase auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setFirebaseUser(firebaseUser);

            if (firebaseUser) {
                // User is signed in - set user data from Firebase
                setUser({
                    id: firebaseUser.uid,
                    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                    email: firebaseUser.email || '',
                    firebaseUid: firebaseUser.uid
                });

                // Store token for potential API calls
                firebaseUser.getIdToken().then(token => {
                    localStorage.setItem('firebase_token', token);
                });
            } else {
                // User is signed out
                localStorage.removeItem('firebase_token');
                setUser(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // onAuthStateChanged will handle setting the user
        } catch (error: any) {
            const errorMessage = error.code === 'auth/invalid-credential'
                ? 'Invalid email or password'
                : error.code === 'auth/user-not-found'
                    ? 'No account found with this email'
                    : error.code === 'auth/wrong-password'
                        ? 'Incorrect password'
                        : error.message || 'Login failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const register = async (name: string, email: string, password: string) => {
        setError(null);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Update display name
            await updateProfile(userCredential.user, {
                displayName: name
            });

            // onAuthStateChanged will handle setting the user
        } catch (error: any) {
            const errorMessage = error.code === 'auth/email-already-in-use'
                ? 'An account with this email already exists'
                : error.code === 'auth/weak-password'
                    ? 'Password should be at least 6 characters'
                    : error.code === 'auth/invalid-email'
                        ? 'Invalid email address'
                        : error.message || 'Registration failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        }
    };

    const signInWithGoogle = async () => {
        setError(null);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            // onAuthStateChanged will handle setting the user
        } catch (error: any) {
            console.error('Google sign in error:', error);
            setError(error.message || 'Google sign in failed');
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('firebase_token');
            setUser(null);
            setFirebaseUser(null);
        } catch (error: any) {
            console.error('Logout error:', error);
            setError(error.message);
        }
    };

    return (
        <AuthContext.Provider value={{ user, firebaseUser, loading, login, register, signInWithGoogle, logout, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
