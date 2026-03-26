
import React, { useState, useMemo } from 'react';
import { useData } from '@/contexts/DataContext';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Edit, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import ProductFormModal from '@/components/ProductFormModal';
import ProductEditModal from '@/components/admin/ProductEditModal';
import Seed100ProductsButton from '@/components/admin/Seed100ProductsButton';
import SeedNewProductsButton from '@/components/admin/SeedNewProductsButton';
import { useToast } from '@/components/ui/use-toast';
import { useDebounce } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { updateProductImagesUnique } from '@/scripts/updateProductImagesUnique';

const AdminProductsPage = () => {
  const { products, deleteProduct, loading, fetchProducts } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null); 
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingImages, setIsUpdatingImages] = useState(false);
  const { toast } = useToast();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const handleSearch = (items) => {
    if (!debouncedSearchTerm) return items;
    return items.filter(product => 
      product.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  };

  const groupedProducts = useMemo(() => {
    const filtered = handleSearch(products || []);
    const groups = {};
    filtered.forEach(product => {
      const cat = product.category || 'Uncategorized';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(product);
    });
    return Object.keys(groups).sort().reduce((acc, key) => { acc[key] = groups[key]; return acc; }, {});
  }, [products, debouncedSearchTerm]);

  const handleDelete = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deletingProduct);
      toast({ title: "Product Deleted", description: "Product has been permanently removed.", className: "bg-green-600 text-white" });
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsDeleting(false);
      setDeletingProduct(null);
    }
  };

  const handleUpdateUniqueImages = async () => {
    setIsUpdatingImages(true);
    try {
      const response = await updateProductImagesUnique();
      if (response.success) {
        toast({ 
          title: "Images Updated", 
          description: response.message, 
          className: "bg-green-600 text-white" 
        });
        await fetchProducts(); // Refresh the list
      } else {
        toast({ title: "Update Failed", description: response.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsUpdatingImages(false);
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price / 100);

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-[#8B4513]" /></div>;

  return (
    <div className="space-y-8 p-6 bg-gray-50/50 min-h-screen">
      <Helmet><title>Products | Relicsphere Admin</title></Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-[#2C2C2C]">Product Catalog</h1>
          <p className="text-gray-500 mt-1">Manage store collection.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            onClick={handleUpdateUniqueImages} 
            disabled={isUpdatingImages}
            className="border-blue-600 text-blue-700 hover:bg-blue-50"
          >
            {isUpdatingImages ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ImageIcon className="w-4 h-4 mr-2" />}
            {isUpdatingImages ? 'Updating Images...' : 'Assign Unique Images'}
          </Button>
          <SeedNewProductsButton onSuccess={fetchProducts} />
          <Seed100ProductsButton onSuccess={fetchProducts} />
          <ProductFormModal />
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-0 z-10">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search products..." className="pl-10 border-gray-200 bg-gray-50" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {Object.keys(groupedProducts).length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 mb-4">No products found.</p>
          <div className="flex justify-center gap-3">
            <SeedNewProductsButton onSuccess={fetchProducts} />
            <Seed100ProductsButton onSuccess={fetchProducts} />
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedProducts).map(([category, items]) => (
            <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gray-50/80 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-bold text-[#2C2C2C] flex items-center gap-2">
                  <span className="w-2 h-6 bg-[#8B4513] rounded-full"></span>
                  {category} <span className="text-sm font-normal text-gray-500 ml-2">({items.length})</span>
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white border-b border-gray-100 text-xs uppercase text-gray-400 font-semibold tracking-wider">
                    <tr>
                      <th className="px-6 py-4 w-20">Image</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-6 py-4 w-32">Price</th>
                      <th className="px-6 py-4 w-24 text-center">Stock</th>
                      <th className="px-6 py-4 w-32 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {items.map(product => (
                      <tr key={product.id} className="hover:bg-gray-50/50 group">
                        <td className="px-6 py-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border">
                            {product.image_url ? (
                              <img src={product.image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
                            ) : (
                              <div className="flex items-center justify-center h-full text-xs">No Img</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500 truncate max-w-[250px]">{product.description?.substring(0, 80)}...</div>
                        </td>
                        <td className="px-6 py-3 font-semibold text-[#8B4513]">{formatPrice(product.price)}</td>
                        <td className="px-6 py-3 text-center">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${product.stock > 10 ? 'bg-green-100 text-green-700' : product.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="sm" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => setEditingProduct(product)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => setDeletingProduct(product.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      <ProductEditModal isOpen={!!editingProduct} onClose={() => setEditingProduct(null)} product={editingProduct} onProductUpdated={fetchProducts} />

      <Dialog open={!!deletingProduct} onOpenChange={(open) => !open && setDeletingProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingProduct(null)} disabled={isDeleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isDeleting ? 'Deleting...' : 'Delete Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProductsPage;
