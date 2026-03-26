
import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Trash2, ExternalLink, Image as ImageIcon, IndianRupee, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductFormModal from '@/components/ProductFormModal';
import { formatINR } from '@/utils/currencyFormatter';
import { updatePricesToRange } from '@/scripts/updatePricesToRange';
import { useToast } from '@/components/ui/use-toast';

const AdminDashboard = () => {
  const { products, orders, deleteProduct, fetchProducts } = useData();
  const { toast } = useToast();
  const [isUpdatingPrices, setIsUpdatingPrices] = useState(false);

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteProduct(id);
        toast({ title: "Product deleted successfully." });
      } catch (error) {
        toast({ title: "Error deleting product", description: error.message, variant: "destructive" });
      }
    }
  };

  const handleUpdatePrices = async () => {
    if (!window.confirm("Are you sure you want to enforce the ₹200-₹200,000 price range on all products?")) return;
    
    setIsUpdatingPrices(true);
    try {
      const result = await updatePricesToRange();
      if (result.success) {
        toast({ 
          title: "Prices Updated", 
          description: `Successfully updated ${result.count} products to ₹200-₹200,000 range.`,
          className: "bg-green-600 text-white"
        });
        await fetchProducts(); // Refresh products list
      } else {
        toast({ title: "Update Failed", description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsUpdatingPrices(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Helmet><title>Admin Dashboard | Relicsphere</title></Helmet>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-[#2C2C2C]">Admin Dashboard</h1>
          <div className="flex flex-wrap gap-2">
            <Link to="/admin/image-compression">
               <Button variant="outline" className="border-blue-600 text-blue-700 hover:bg-blue-50">
                 <ImageIcon className="w-4 h-4 mr-2" /> Optimize Images
               </Button>
            </Link>
            <Link to="/admin/images-pricing">
               <Button variant="outline" className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white">
                 Update Images & Pricing <ExternalLink className="w-4 h-4 ml-2" />
               </Button>
            </Link>
          </div>
        </div>
        
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <h2 className="text-xl font-bold">Product Management</h2>
              <div className="flex items-center gap-3">
                <Button 
                  onClick={handleUpdatePrices} 
                  disabled={isUpdatingPrices}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isUpdatingPrices ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</>
                  ) : (
                    <><IndianRupee className="w-4 h-4 mr-2" /> Update All Prices (₹200-₹200k)</>
                  )}
                </Button>
                <ProductFormModal />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Price (₹)</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-t">
                      <td className="p-4 font-medium">{p.name}</td>
                      <td className="p-4">{formatINR(p.price)}</td>
                      <td className="p-4">{p.stock}</td>
                      <td className="p-4">{p.category}</td>
                      <td className="p-4">
                        <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteProduct(p.id)}>
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
                    <th className="p-4">Total (₹)</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} className="border-t">
                      <td className="p-4 font-mono text-sm">{o.id}</td>
                      <td className="p-4">{o.user_email || 'Guest'}</td>
                      <td className="p-4">{formatINR(o.total_amount * 100)}</td>
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
