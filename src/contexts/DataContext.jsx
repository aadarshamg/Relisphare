
import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '@/lib/customSupabaseClient';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error && data) setProducts(data);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!error && data) setOrders(data);
  };

  const fetchContacts = async () => {
    const { data, error } = await supabase.from('contact_submissions').select('*').order('created_at', { ascending: false });
    if (!error && data) setContacts(data);
  };

  const fetchSettings = async () => {
    const { data, error } = await supabase.from('settings').select('*').limit(1).single();
    if (!error && data) setSettings(data);
  };

  useEffect(() => {
    Promise.all([fetchProducts(), fetchOrders(), fetchContacts(), fetchSettings()]).then(() => setLoading(false));
  }, []);

  // Products
  const getProducts = () => products;
  const getProductById = (id) => products.find(p => p.id === id);
  const addProduct = async (product) => {
    const { data, error } = await supabase.from('products').insert([product]).select().single();
    if (error) throw error;
    setProducts([data, ...products]);
    return data;
  };
  const updateProduct = async (id, updates) => {
    const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
    if (error) throw error;
    setProducts(products.map(p => p.id === id ? data : p));
    return data;
  };
  const deleteProduct = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    setProducts(products.filter(p => p.id !== id));
  };

  // Orders
  const getOrders = () => orders;
  const addOrder = async (orderData) => {
    const { data, error } = await supabase.from('orders').insert([orderData]).select().single();
    if (error) throw error;
    setOrders([data, ...orders]);
    return data;
  };
  const updateOrderStatus = async (id, status) => {
    const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select().single();
    if (error) throw error;
    setOrders(orders.map(o => o.id === id ? data : o));
    return data;
  };

  // Contacts
  const getContactSubmissions = () => contacts;
  const addContactSubmission = async (data) => {
    const { data: res, error } = await supabase.from('contact_submissions').insert([data]).select().single();
    if (error) throw error;
    setContacts([res, ...contacts]);
    return res;
  };

  // Settings
  const getSettings = () => settings;
  const updateSettings = async (newSettings) => {
    if (!settings?.id) return;
    const { data, error } = await supabase.from('settings').update(newSettings).eq('id', settings.id).select().single();
    if (error) throw error;
    setSettings(data);
    return data;
  };

  return (
    <DataContext.Provider value={{
      products, getProducts, getProductById, addProduct, updateProduct, deleteProduct, fetchProducts,
      orders, getOrders, addOrder, updateOrderStatus,
      contacts, getContactSubmissions, addContactSubmission,
      settings, getSettings, updateSettings,
      loading
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
