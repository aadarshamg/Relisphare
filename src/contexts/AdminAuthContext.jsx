
import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '@/lib/customSupabaseClient';

const AdminAuthContext = createContext({});

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAdminRole = (user) => {
    return user?.app_metadata?.role === 'admin' || user?.email === 'admin@relicsphere.com';
  };

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user && checkAdminRole(session.user)) {
        setAdminUser({ ...session.user, role: 'admin' });
      } else {
        setAdminUser(null);
      }
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user && checkAdminRole(session.user)) {
        setAdminUser({ ...session.user, role: 'admin' });
      } else {
        setAdminUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    
    if (!checkAdminRole(data.user)) {
      await supabase.auth.signOut();
      throw new Error("Unauthorized: Admin access required. App metadata role is not 'admin'.");
    }
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const signup = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });
    if (error) throw error;
    return data;
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, loading, login, logout, signup }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
