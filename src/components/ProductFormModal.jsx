
import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const ProductFormModal = ({ onProductAdded }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { addProduct } = useData();
  
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', stock: '', category: '',
    era: '', material: '', condition: '', origin: '', imageUrl: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleValueChange = (name, value) => setFormData({ ...formData, [name]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      addProduct({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) * 100, // store in paise
        stock: parseInt(formData.stock),
        category: formData.category,
        era: formData.era,
        material: formData.material,
        condition: formData.condition,
        origin: formData.origin,
        product_images: formData.imageUrl ? [{ id: `img-${Date.now()}`, image_url: formData.imageUrl }] : []
      });

      toast({ title: "Success", description: "Product created successfully" });
      setOpen(false);
      if (onProductAdded) onProductAdded();
      setFormData({ name: '', description: '', price: '', stock: '', category: '', era: '', material: '', condition: '', origin: '', imageUrl: '' });
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#8B4513] text-white">Add New Product</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Product Name</Label>
              <Input name="name" required value={formData.name} onChange={handleChange} />
            </div>
            <div>
              <Label>Category</Label>
              <Select name="category" onValueChange={(val) => handleValueChange('category', val)}>
                <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                <SelectContent className="bg-white">
                  {['Furniture', 'Coins', 'Paintings', 'Sculptures', 'Jewelry', 'Watches'].map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label>Description</Label>
            <Textarea name="description" required value={formData.description} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><Label>Price (₹)</Label><Input type="number" name="price" required value={formData.price} onChange={handleChange} /></div>
            <div><Label>Stock</Label><Input type="number" name="stock" required value={formData.stock} onChange={handleChange} /></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><Label>Era</Label><Input name="era" value={formData.era} onChange={handleChange} /></div>
            <div><Label>Origin</Label><Input name="origin" value={formData.origin} onChange={handleChange} /></div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Material</Label><Input name="material" value={formData.material} onChange={handleChange} /></div>
            <div><Label>Condition</Label><Input name="condition" value={formData.condition} onChange={handleChange} /></div>
          </div>

          <div>
            <Label>Image URL</Label>
            <Input name="imageUrl" placeholder="https://..." value={formData.imageUrl} onChange={handleChange} />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-[#8B4513] text-white">
            {loading ? 'Saving...' : 'Create Product'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormModal;
