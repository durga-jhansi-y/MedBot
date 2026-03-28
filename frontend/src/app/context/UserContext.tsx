import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface UserProfile {
  name: string;
  age: string;
  allergies: string[];
  medicalConditions: string;
  emergencyContact: string;
  emergencyPhone: string;
  bloodType: string;
}

interface UserContextType {
  user: UserProfile | null;
  isSignedIn: boolean;
  signIn: (profile: UserProfile) => void;
  signOut: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("medbot_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const signIn = (profile: UserProfile) => {
    setUser(profile);
    localStorage.setItem("medbot_user", JSON.stringify(profile));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("medbot_user");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isSignedIn: !!user,
        signIn,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
