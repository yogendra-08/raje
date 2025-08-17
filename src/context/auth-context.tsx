"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, isConfigured } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  isFirebaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const FirebaseNotConfigured = () => {
    return (
        <div className="container mx-auto p-4">
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Firebase Not Configured</AlertTitle>
                <AlertDescription>
                    Your Firebase credentials are not set up correctly. Please add them to the <strong>.env</strong> file to enable authentication and other Firebase features.
                </AlertDescription>
            </Alert>
        </div>
    )
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!auth) {
        setLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    if (auth) {
        await firebaseSignOut(auth);
    }
    router.push('/login');
  };

  const value = { user, loading, logout, isFirebaseConfigured: isConfigured };

  return (
    <AuthContext.Provider value={value}>
      {!isConfigured && <FirebaseNotConfigured />}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
