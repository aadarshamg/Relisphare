
import React, { useState, useEffect } from 'react';
import { useData } from '@/contexts/DataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const ProductEditModal = ({ product, isOpen, onClose, onProductUpdated }) => {
  const [loading, setLoading] = useState(false);
  const { updateProduct } = useData();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', category: '', imageUrl: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price ? (product.price / 100).toString() : '',
        category: product.category || '',
        imageUrl: product.product_images?.[0]?.image_url || ''
      });
    }
  }, [product]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleValueChange = (name, value) => setFormData({ ...formData, [name]: value });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      updateProduct(product.id, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) * 100,
        category: formData.category,
        product_images: formData.imageUrl ? [{ id: `img-${Date.now()}`, image_url: formData.imageUrl }] : []
      });

      toast({
        title: "Success",
        description: "Product updated successfully.",
        className: "bg-green-600 text-white"
      });
      
      if (onProductUpdated) onProductUpdated();
      onClose();
    } catch (error) {
      console.error('Update failed:', error);
      toast({ title: "Error", description: "Failed to update product.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product: {product.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSave} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" value={formData.category} onValueChange={(val) => handleValueChange('category', val)}>
                <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                <SelectContent className="bg-white">
                  {['Furniture', 'Paintings', 'Sculptures', 'Jewelry', 'Watches'].map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-[#8B4513] text-white">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditModal;
