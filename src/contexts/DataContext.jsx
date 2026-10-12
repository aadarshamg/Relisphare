
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import supabase from '@/lib/customSupabaseClient';

const DataContext = createContext();

const PRODUCT_LIST_FIELDS = 'id,name,description,price,category,stock,created_at';

export const DataProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [productsError, setProductsError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const productsRequestId = useRef(0);

  // Some products store their photo inline as a multi-megabyte data URI, so the listing
  // and normal image links load first and the inline photos are merged in afterwards.
  const fetchInlineImages = useCallback(async (requestId) => {
    const { data, error } = await supabase.from('products').select('id,image_url').like('image_url', 'data:%');
    if (requestId !== productsRequestId.current) return;
    if (error) console.error('Failed to load product photos:', error);
    const imageById = new Map((data || []).map((row) => [row.id, row.image_url]));
    setProducts((prev) => prev.map((p) => {
      if (imageById.has(p.id)) return { ...p, image_url: imageById.get(p.id), image_pending: false };
      return p.image_pending ? { ...p, image_pending: false } : p;
    }));
  }, []);

  const fetchProducts = useCallback(async () => {
    const requestId = ++productsRequestId.current;
    try {
      const [listing, links] = await Promise.all([
        supabase.from('products').select(PRODUCT_LIST_FIELDS).order('created_at', { ascending: false }),
        supabase.from('products').select('id,image_url').not('image_url', 'like', 'data:%')
      ]);
      if (listing.error) throw listing.error;
      if (links.error) throw links.error;
      if (requestId !== productsRequestId.current) return;

      const linkById = new Map(links.data.map((row) => [row.id, row.image_url]));
      setProducts((prev) => {
        const prevById = new Map(prev.map((p) => [p.id, p]));
        return listing.data.map((row) => {
          if (linkById.has(row.id)) return { ...row, image_url: linkById.get(row.id) };
          const known = prevById.get(row.id)?.image_url;
          return known ? { ...row, image_url: known } : { ...row, image_url: null, image_pending: true };
        });
      });
      setProductsError(null);
      fetchInlineImages(requestId);
    } catch (error) {
      console.error('Failed to load products:', error);
      setProductsError(error);
    }
  }, [fetchInlineImages]);

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
      products, productsError, getProducts, getProductById, addProduct, updateProduct, deleteProduct, fetchProducts,
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
