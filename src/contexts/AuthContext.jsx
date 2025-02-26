import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const signIn = (credentials) => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser.email === credentials.email && storedUser.password === credentials.password) {
      setUser(storedUser);
      return true;
    }
    return false;
  };

  const signUp = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const signOut = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);