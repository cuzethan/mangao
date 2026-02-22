import { useEffect, createContext, useContext, useState, type ReactNode } from 'react';
import { registerTokenSync, injectCsrfToken } from '../config/api';

interface AuthContextType {
  csrfToken: string | null;
  setCsrfTokenMaster: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
    
    const setCsrfTokenMaster = (token: string | null) => { //both for context and axios
        setCsrfToken(token);      
        injectCsrfToken(token); 
    };

    useEffect(() => {
        registerTokenSync(setCsrfTokenMaster);
    }, []);

  return (
    <AuthContext.Provider value={{ csrfToken, setCsrfTokenMaster }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};