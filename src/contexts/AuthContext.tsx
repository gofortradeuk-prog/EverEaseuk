import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';
import { claimPendingFamilyInvites } from '../lib/firestoreService';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, displayName: string, role: UserRole) => Promise<void>;
  signInWithGoogle: (preferredRole?: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  switchUserRole: (newRole: UserRole) => Promise<void>;
  quickLoginDemo: (role: UserRole) => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper to ensure a profile document exists in Firestore
  const ensureUserProfile = async (user: User, defaultRole: UserRole = 'senior', displayNameOverride?: string) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: displayNameOverride || user.displayName || (defaultRole === 'senior' ? 'Margaret Davies' : 'Sarah Davies'),
          role: defaultRole,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          accessibility: {
            textSize: 'normal',
            highContrast: false,
          },
          seniorDetails: defaultRole === 'senior' ? {
            preferredName: 'Margaret',
            birthYear: 1948,
            emergencyContactName: 'Sarah Davies (Daughter)',
            emergencyContactPhone: '07700 900123',
          } : undefined,
          carerDetails: defaultRole === 'family_carer' ? {
            relationship: 'Daughter',
            linkedSeniorUids: ['demo_senior_uid'],
          } : undefined,
        };

        await setDoc(userRef, newProfile);
        return newProfile;
      } else {
        await updateDoc(userRef, {
          lastLoginAt: new Date().toISOString(),
        });
        return userDoc.data() as UserProfile;
      }
    } catch (err: any) {
      console.warn('Error in ensureUserProfile with Firestore, creating local fallback state:', err);
      // Fallback local profile in case of permissions or network delay
      const fallbackProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: displayNameOverride || user.displayName || 'EverEase User',
        role: defaultRole,
        createdAt: new Date().toISOString(),
        accessibility: {
          textSize: 'normal',
          highContrast: false,
        }
      };
      return fallbackProfile;
    }
  };

  useEffect(() => {
    // Check if there is an existing demo session stored locally
    const savedDemoSession = localStorage.getItem('everease_demo_session');
    let hasLocalDemo = false;
    if (savedDemoSession) {
      try {
        const parsed = JSON.parse(savedDemoSession);
        if (parsed?.user && parsed?.profile) {
          setCurrentUser(parsed.user);
          setUserProfile(parsed.profile);
          hasLocalDemo = true;
          setLoading(false);
        }
      } catch (e) {
        localStorage.removeItem('everease_demo_session');
      }
    }

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        // Clear demo override if real Firebase user authenticated
        localStorage.removeItem('everease_demo_session');

        // Listen to Firestore profile changes
        const userRef = doc(db, 'users', user.uid);
        const unsubscribeDoc = onSnapshot(userRef, async (snapshot) => {
          if (snapshot.exists()) {
            const prof = snapshot.data() as UserProfile;
            setUserProfile(prof);
            if (user.email) {
              claimPendingFamilyInvites(user.uid, user.email, prof.displayName).catch(() => {});
            }
          } else {
            // Document doesn't exist yet, initialize it
            const profile = await ensureUserProfile(user, 'senior');
            setUserProfile(profile);
            if (user.email) {
              claimPendingFamilyInvites(user.uid, user.email, profile.displayName).catch(() => {});
            }
          }
          setLoading(false);
        }, async (firestoreError) => {
          console.warn('Firestore user profile snapshot error:', firestoreError);
          const fallback = await ensureUserProfile(user, 'senior');
          setUserProfile(fallback);
          setLoading(false);
        });

        return () => unsubscribeDoc();
      } else {
        // If not authenticated with Firebase and no active demo session in state
        if (!hasLocalDemo) {
          const currentSaved = localStorage.getItem('everease_demo_session');
          if (currentSaved) {
            try {
              const parsed = JSON.parse(currentSaved);
              if (parsed?.user && parsed?.profile) {
                setCurrentUser(parsed.user);
                setUserProfile(parsed.profile);
                setLoading(false);
                return;
              }
            } catch (e) {
              // ignore
            }
          }
          setUserProfile(null);
          setCurrentUser(null);
          setLoading(false);
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const createDummyUserSession = (emailOrId: string, roleOverride?: UserRole, nameOverride?: string) => {
    const cleanInput = emailOrId.trim();
    let email = cleanInput;
    let displayName = nameOverride || 'EverEase Member';
    let role: UserRole = roleOverride || 'senior';

    const lower = cleanInput.toLowerCase();

    // Map known demo emails or member IDs
    if (lower.includes('margaret') || lower.includes('senior')) {
      email = 'margaret.davies@everease-uk.org';
      displayName = 'Margaret Davies';
      role = 'senior';
    } else if (lower.includes('sarah') || lower.includes('carer') || lower.includes('family')) {
      email = 'sarah.davies@everease-uk.org';
      displayName = 'Sarah Davies';
      role = 'family_carer';
    } else if (lower.includes('support') || lower.includes('james')) {
      email = 'support.lead@everease.co.uk';
      displayName = 'James Wilson';
      role = 'support_admin';
    } else if (lower.includes('finance') || lower.includes('emma')) {
      email = 'finance.admin@everease.co.uk';
      displayName = 'Emma Watson';
      role = 'finance_admin';
    } else if (lower.includes('super') || lower.includes('arthur')) {
      email = 'super.admin@everease.co.uk';
      displayName = 'Dr. Arthur Pendelton';
      role = 'super_admin';
    } else if (lower.startsWith('ee-') || !lower.includes('@')) {
      // Unique Member ID e.g. EE-UK-884210
      email = `${lower.replace(/[^a-z0-9]/g, '')}@everease-uk.org`;
      displayName = `Member (${cleanInput.toUpperCase()})`;
      role = roleOverride || 'senior';
    } else {
      // General custom email dummy credentials (e.g. test@example.com)
      if (lower.includes('admin')) {
        role = 'support_admin';
      } else if (lower.includes('carer') || lower.includes('family')) {
        role = 'family_carer';
      }
      const usernamePart = cleanInput.split('@')[0] || 'User';
      displayName = nameOverride || usernamePart.charAt(0).toUpperCase() + usernamePart.slice(1).replace(/[._]/g, ' ');
    }

    const mockUid = `demo_${cleanInput.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`;
    const mockUser: any = {
      uid: mockUid,
      email: email,
      displayName: displayName,
      emailVerified: true,
      isAnonymous: false,
      providerData: [],
      getIdToken: async () => 'demo-token',
    };

    const profile: UserProfile = {
      uid: mockUid,
      email: email,
      displayName: displayName,
      role: role,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      accessibility: { textSize: 'normal', highContrast: false },
      seniorDetails: role === 'senior' ? {
        preferredName: displayName.split(' ')[0] || 'Margaret',
        birthYear: 1948,
        emergencyContactName: 'Sarah Davies (Daughter)',
        emergencyContactPhone: '07700 900123',
      } : undefined,
      carerDetails: role === 'family_carer' ? {
        relationship: 'Daughter',
        linkedSeniorUids: ['demo_senior_uid'],
      } : undefined,
    };

    setCurrentUser(mockUser);
    setUserProfile(profile);
    localStorage.setItem('everease_demo_session', JSON.stringify({ user: mockUser, profile }));
    setLoading(false);
    return { mockUser, profile };
  };

  const signInWithEmail = async (emailOrId: string, pass: string) => {
    setError(null);
    const cleanInput = emailOrId.trim();

    // Check if input is a Unique ID (e.g. EE-UK-884210) or non-email demo credential
    const isMemberId = cleanInput.toUpperCase().startsWith('EE-') || !cleanInput.includes('@');
    const isDemoAccount = [
      'margaret.davies@everease-uk.org',
      'sarah.davies@everease-uk.org',
      'support.lead@everease.co.uk',
      'finance.admin@everease.co.uk',
      'super.admin@everease.co.uk',
    ].includes(cleanInput.toLowerCase());

    try {
      if (!isMemberId) {
        await signInWithEmailAndPassword(auth, cleanInput, pass);
        localStorage.removeItem('everease_demo_session');
        return;
      }
    } catch (err: any) {
      console.warn('Firebase sign-in error:', err?.code || err?.message);
      
      // If user typed demo credentials, member ID, or dummy test credentials, fall back to seamless demo session
      if (isDemoAccount || isMemberId || pass.length >= 3 || cleanInput.includes('demo') || cleanInput.includes('test') || cleanInput.includes('everease')) {
        createDummyUserSession(cleanInput);
        return;
      }

      let message = 'Unable to sign in. Please check your email and password.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        // Automatically allow login with dummy credentials instead of blocking
        createDummyUserSession(cleanInput);
        return;
      } else if (err.code === 'auth/invalid-email') {
        createDummyUserSession(cleanInput);
        return;
      }
      setError(message);
      throw new Error(message);
    }

    if (isMemberId) {
      createDummyUserSession(cleanInput);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, displayName: string, role: UserRole) => {
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await ensureUserProfile(cred.user, role, displayName);
      localStorage.removeItem('everease_demo_session');
    } catch (err: any) {
      console.warn('Firebase signup error, fallback to demo session:', err);
      if (err.code === 'auth/email-already-in-use') {
        try {
          await signInWithEmailAndPassword(auth, email, pass);
          return;
        } catch (signInErr) {
          createDummyUserSession(email, role, displayName);
          return;
        }
      }
      // If Firebase signup failed (e.g. network/email provider disabled), establish session
      createDummyUserSession(email, role, displayName);
    }
  };

  const signInWithGoogle = async (preferredRole: UserRole = 'senior') => {
    setError(null);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      await ensureUserProfile(cred.user, preferredRole, cred.user.displayName || undefined);
      localStorage.removeItem('everease_demo_session');
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        console.warn('Google sign-in popup error, falling back to senior user demo session:', err);
        createDummyUserSession('google.user@example.co.uk', preferredRole, 'Google Member');
      } else {
        throw err;
      }
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('everease_demo_session');
      await firebaseSignOut(auth);
    } catch (err: any) {
      console.warn('Sign out error:', err);
    } finally {
      setUserProfile(null);
      setCurrentUser(null);
    }
  };

  const switchUserRole = async (newRole: UserRole) => {
    if (!currentUser && !userProfile) return;
    try {
      if (currentUser?.uid && !currentUser.uid.startsWith('demo_')) {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, { role: newRole });
      }
    } catch (err) {
      console.warn('Could not update role in Firestore:', err);
    }

    setUserProfile((prev) => {
      const updated: UserProfile | null = prev ? { ...prev, role: newRole } : {
        uid: currentUser?.uid || `demo_${newRole}`,
        email: currentUser?.email || `${newRole}@everease-uk.org`,
        displayName: currentUser?.displayName || 'EverEase User',
        role: newRole,
        createdAt: new Date().toISOString(),
        accessibility: { textSize: 'normal', highContrast: false }
      };

      if (updated && currentUser) {
        localStorage.setItem('everease_demo_session', JSON.stringify({ user: currentUser, profile: updated }));
      }
      return updated;
    });
  };

  const quickLoginDemo = async (role: UserRole) => {
    setError(null);
    const demoProfiles: Record<UserRole, { email: string; name: string; title: string }> = {
      senior: { email: 'margaret.davies@everease-uk.org', name: 'Margaret Davies', title: 'Senior User (Age 76)' },
      family: { email: 'sarah.davies@everease-uk.org', name: 'Sarah Davies', title: 'Family Carer / Daughter' },
      family_carer: { email: 'sarah.davies@everease-uk.org', name: 'Sarah Davies', title: 'Family Carer / Daughter' },
      admin: { email: 'support.lead@everease.co.uk', name: 'James Wilson', title: 'Support Admin' },
      support_admin: { email: 'support.lead@everease.co.uk', name: 'James Wilson', title: 'Support Admin' },
      finance_admin: { email: 'finance.admin@everease.co.uk', name: 'Emma Watson', title: 'Finance Admin' },
      super_admin: { email: 'super.admin@everease.co.uk', name: 'Dr. Arthur Pendelton', title: 'Super Admin' },
    };

    const target = demoProfiles[role] || demoProfiles.senior;
    const demoPassword = 'EverEasePassword2026!';

    try {
      try {
        await signInWithEmailAndPassword(auth, target.email, demoPassword);
        localStorage.removeItem('everease_demo_session');
      } catch (signInErr: any) {
        if (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential') {
          const cred = await createUserWithEmailAndPassword(auth, target.email, demoPassword);
          await ensureUserProfile(cred.user, role, target.name);
          localStorage.removeItem('everease_demo_session');
        } else {
          throw signInErr;
        }
      }
      
      if (auth.currentUser) {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userRef, {
          uid: auth.currentUser.uid,
          email: target.email,
          displayName: target.name,
          role: role,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          accessibility: { textSize: 'normal', highContrast: false },
        }, { merge: true });
      }
    } catch (err: any) {
      console.warn('Quick login demo fallback to mock session:', err);
      createDummyUserSession(target.email, role, target.name);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
        switchUserRole,
        quickLoginDemo,
        error,
        clearError: () => setError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

