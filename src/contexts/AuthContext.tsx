import { createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  user: { id: string; email: string } | null;
  session: any;
  loading: false;
}

const AuthContext = createContext<AuthContextType>({
  user: { id: 'mock-user-id', email: 'demo@example.com' },
  session: {},
  loading: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={{
      user: { id: 'mock-user-id', email: 'demo@example.com' },
      session: {},
      loading: false,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
