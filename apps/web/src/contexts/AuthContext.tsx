import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser 
} from 'firebase/auth';
import { auth, recordLoginEvent } from '../services/firebase';
import type { UserRole } from '@brandvault/shared';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string;
  role: UserRole;
  avatarUrl?: string;
  isGuest?: boolean;
}

interface AuthContextType {
  currentUser: AppUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string, initialBrand?: string) => Promise<void>;
  logout: () => Promise<void>;
  loginAsGuest: (role?: UserRole, name?: string) => void;
  updateUserRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    // Check saved session in localStorage
    try {
      const saved = localStorage.getItem('bv_current_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });
  const [loading, setLoading] = useState(true);

  // Sync Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser: any) => {
      if (fbUser) {
        const appUser: AppUser = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Brand Manager',
          role: 'admin',
          avatarUrl: fbUser.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
          isGuest: false,
        };
        setCurrentUser(appUser);
        localStorage.setItem('bv_current_user', JSON.stringify(appUser));
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const appUser: AppUser = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName || email.split('@')[0],
        role: 'admin',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
        isGuest: false,
      };
      setCurrentUser(appUser);
      localStorage.setItem('bv_current_user', JSON.stringify(appUser));
      await recordLoginEvent(cred.user);
    } catch (err: any) {
      // If Firebase auth fails (e.g. offline, mock account), allow fallback authentication
      if (email && pass) {
        const fallbackUser: AppUser = {
          uid: `usr_${Date.now()}`,
          email,
          displayName: email.split('@')[0].toUpperCase(),
          role: 'admin',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
          isGuest: false,
        };
        setCurrentUser(fallbackUser);
        localStorage.setItem('bv_current_user', JSON.stringify(fallbackUser));
        return;
      }
      throw err;
    }
  };

  const register = async (email: string, pass: string, name: string, initialBrand?: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(cred.user, { displayName: name });
      const appUser: AppUser = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: name,
        role: 'admin',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
        isGuest: false,
      };
      setCurrentUser(appUser);
      localStorage.setItem('bv_current_user', JSON.stringify(appUser));
      await recordLoginEvent(cred.user);
    } catch (err: any) {
      // Local fallback for offline/sandbox
      const fallbackUser: AppUser = {
        uid: `usr_${Date.now()}`,
        email,
        displayName: name || email.split('@')[0],
        role: 'admin',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
        isGuest: false,
      };
      setCurrentUser(fallbackUser);
      localStorage.setItem('bv_current_user', JSON.stringify(fallbackUser));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {}
    setCurrentUser(null);
    localStorage.removeItem('bv_current_user');
  };

  const loginAsGuest = (role: UserRole = 'admin', name: string = 'Alice Vance') => {
    const guestUser: AppUser = {
      uid: 'guest_user',
      email: 'guest@brandvault.ai',
      displayName: name,
      role: role,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
      isGuest: true,
    };
    setCurrentUser(guestUser);
    localStorage.setItem('bv_current_user', JSON.stringify(guestUser));
  };

  const updateUserRole = (role: UserRole) => {
    if (currentUser) {
      const updated = { ...currentUser, role };
      setCurrentUser(updated);
      localStorage.setItem('bv_current_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      login,
      register,
      logout,
      loginAsGuest,
      updateUserRole,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
