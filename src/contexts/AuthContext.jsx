import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as fbSignOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../firebase/config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);

  useEffect(() => {
    // Firebase 미설정 시 데모 모드 (교사로 자동 로그인)
    if (!isFirebaseConfigured) {
      setFirebaseUser({ uid: 'demo-teacher', displayName: '박사랑 선생님', email: 'demo@jesusclass.com' });
      setUserRole('teacher');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists()) {
            const data = snap.data();
            setUserRole(data.role);
            setFirebaseUser({ ...user, displayName: data.name || user.displayName });
            setNeedsRoleSelection(false);
          } else {
            // 새 사용자 → 역할 선택 필요
            setFirebaseUser(user);
            setNeedsRoleSelection(true);
          }
        } catch (err) {
          console.error('사용자 정보 조회 실패:', err);
          setFirebaseUser(user);
          setNeedsRoleSelection(true);
        }
      } else {
        setFirebaseUser(null);
        setUserRole(null);
        setNeedsRoleSelection(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // 구글 로그인
  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured) return;
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    await signInWithPopup(auth, provider);
  };

  // 역할 선택 (최초 1회)
  const selectRole = async (role) => {
    if (!firebaseUser || !isFirebaseConfigured) return;
    const userData = {
      role,
      name: firebaseUser.displayName || '사용자',
      email: firebaseUser.email || '',
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', firebaseUser.uid), userData);
    setUserRole(role);
    setNeedsRoleSelection(false);
  };

  // 로그아웃
  const signOut = async () => {
    if (!isFirebaseConfigured) return;
    await fbSignOut(auth);
  };

  const value = {
    firebaseUser,
    userRole,
    loading,
    needsRoleSelection,
    signInWithGoogle,
    selectRole,
    signOut,
    isConfigured: isFirebaseConfigured,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
