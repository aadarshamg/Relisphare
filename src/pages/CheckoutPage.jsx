
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { formatRupees } from '@/utils/currencyFormatter';
import { getOptimizedImageUrl } from '@/utils/imageCompression';

const CheckoutPage = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addOrder } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '', email: user?.email || '', phone: '', address: '', city: '', state: '', zip: '',
  });

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const totalAmount = getCartTotal() * 1.08;
      
      const orderItems = cart.map(item => ({
        product_id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image_url: item.image
      }));

      const newOrder = await addOrder({
        user_email: formData.email,
        total_price: totalAmount,
        status: 'pending',
        shipping_address: `${formData.full_name}, ${formData.address}, ${formData.city}, ${formData.state} ${formData.zip} (${formData.phone})`,
        items: orderItems
      });

      clearCart();
      toast({ title: "Order Placed!", description: "Thank you for your purchase." });
      navigate(`/order-confirmation/${newOrder.id}`);
    } catch (error) {
      toast({ title: "Checkout Failed", description: error.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF5EF] py-12">
      <Helmet><title>Checkout | Relicsphere</title></Helmet>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold text-[#2C2C2C] mb-8 text-center">Secure Checkout</h1>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Shipping Form */}
          <div className="bg-white p-8 rounded-xl shadow-sm">
            <h2 className="text-2xl font-serif font-bold mb-6">Shipping Details</h2>
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Full Name</Label><Input required name="full_name" value={formData.full_name} onChange={handleChange} /></div>
              <div><Label>Email</Label><Input required type="email" name="email" value={formData.email} onChange={handleChange} /></div>
              <div><Label>Phone</Label><Input required type="tel" name="phone" value={formData.phone} onChange={handleChange} /></div>
              <div><Label>Address</Label><Input required name="address" value={formData.address} onChange={handleChange} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>City</Label><Input required name="city" value={formData.city} onChange={handleChange} /></div>
                <div><Label>State</Label><Input required name="state" value={formData.state} onChange={handleChange} /></div>
              </div>
              <div><Label>ZIP Code</Label><Input required name="zip" value={formData.zip} onChange={handleChange} /></div>
            </form>
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-sm border-t-4 border-[#D4AF37]">
              <h2 className="text-2xl font-serif font-bold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm border-b pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                         {item.image && (
                           <img 
                             src={getOptimizedImageUrl(item.image, 100)} 
                             alt={item.name} 
                             loading="lazy"
                             className="w-full h-full object-cover" 
                           />
                         )}
                      </div>
                      <span className="text-gray-600 font-medium">{item.name} <span className="text-gray-400">x {item.quantity}</span></span>
                    </div>
                    <span className="font-semibold">{formatRupees(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total (Inc. Tax)</span>
                <span>{formatRupees(getCartTotal() * 1.08)}</span>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <Button type="submit" form="checkout-form" disabled={loading} className="w-full bg-[#8B4513] text-white py-6 text-lg hover:bg-[#5C4033]">
                {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                {loading ? 'Processing...' : 'Place Order'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
