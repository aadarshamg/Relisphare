import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import ProductFormModal from '@/components/ProductFormModal';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: prodData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    const { data: ordData } = await supabase.from('orders').select('*, users(email)').order('created_at', { ascending: false });
    
    setProducts(prodData || []);
    setOrders(ordData || []);
    setLoading(false);
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure?")) {
      await supabase.from('products').delete().eq('id', id);
      fetchData();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Helmet><title>Admin Dashboard | Relicsphere</title></Helmet>
      
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#2C2C2C]">Admin Dashboard</h1>
        
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">Product Management</h2>
              <ProductFormModal onProductAdded={fetchData} />
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-t">
                      <td className="p-4 font-medium">{p.name}</td>
                      <td className="p-4">${p.price}</td>
                      <td className="p-4">{p.stock}</td>
                      <td className="p-4">{p.category}</td>
                      <td className="p-4">
                        <Button variant="ghost" className="text-red-500" onClick={() => handleDeleteProduct(p.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="orders">
             <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">User</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} className="border-t">
                      <td className="p-4 font-mono text-sm">{o.id.slice(0,8)}...</td>
                      <td className="p-4">{o.users?.email || 'Guest'}</td>
                      <td className="p-4">${o.total_amount}</td>
                      <td className="p-4 uppercase text-xs font-bold">{o.status}</td>
                      <td className="p-4 text-sm text-gray-500">{new Date(o.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;