// @ts-ignore
import { auth } from "@/firebase.config";
import {
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  Logout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextValue | any>({});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const Logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.error("Sign-out error", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, Logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
