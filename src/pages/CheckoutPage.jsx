
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
import AsianPaySimulator from '@/components/AsianPaySimulator';

const CheckoutPage = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addOrder, updateOrderStatus } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('asianpay');
  const [showAsianPay, setShowAsianPay] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '', email: user?.email || '', phone: '', address: '', city: '', state: '', zip: '',
  });

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePaymentSuccess = async (paymentDetails) => {
    setShowAsianPay(false);
    if (showAsianPay) {
       await updateOrderStatus(showAsianPay, 'paid');
       clearCart();
       toast({ title: "Payment Verified!", description: "Thank you for your purchase." });
       navigate(`/order-confirmation/${showAsianPay}`);
    }
  };

  const processOrder = async (isAsianPayGateway = false) => {
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

      const orderNotes = ` | Payment: ${paymentMethod.toUpperCase()}`;

      const newOrder = await addOrder({
        user_email: formData.email,
        total_price: totalAmount,
        status: 'pending', // Starts as pending until gateway redirects back
        shipping_address: `${formData.full_name}, ${formData.address}, ${formData.city}, ${formData.state} ${formData.zip} (${formData.phone})${orderNotes}`,
        items: orderItems,
      });

      if (isAsianPayGateway) {
        // Instead of local success, we trigger production redirect with the new order ID
        setShowAsianPay(newOrder.id); 
      } else {
        clearCart();
        toast({ title: "Order Placed!", description: "Thank you for your purchase." });
        navigate(`/order-confirmation/${newOrder.id}`);
      }
    } catch (error) {
      toast({ title: "Checkout Failed", description: error.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentMethod === 'asianpay') {
      await processOrder(true);
      return;
    }
    await processOrder(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF5EF] py-12">
      <Helmet><title>Checkout | Relicsphere</title></Helmet>
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold text-[#2C2C2C] mb-8 text-center">Secure Checkout</h1>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
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

            {/* Payment Method */}
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h2 className="text-2xl font-serif font-bold mb-6">Payment Method</h2>
              <div className="space-y-4">
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'asianpay' ? 'border-[#8B4513] bg-[#8B4513]/5' : 'hover:border-gray-300'}`}>
                  <input type="radio" name="payment_method" value="asianpay" checked={paymentMethod === 'asianpay'} onChange={() => setPaymentMethod('asianpay')} className="mr-4 h-5 w-5 text-[#8B4513] focus:ring-[#8B4513]" />
                  <div className="flex-1 flex justify-between items-center">
                    <span className="font-medium text-lg">AsianPay Gateway</span>
                    <span className="text-sm font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded">Secure</span>
                  </div>
                </label>
                <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-[#8B4513] bg-[#8B4513]/5' : 'hover:border-gray-300'}`}>
                  <input type="radio" name="payment_method" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="mr-4 h-5 w-5 text-[#8B4513] focus:ring-[#8B4513]" />
                  <span className="font-medium text-lg">Cash on Delivery</span>
                </label>
              </div>
            </div>
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

      {showAsianPay && (
        <AsianPaySimulator 
          amount={getCartTotal() * 1.08}
          orderId={showAsianPay} // passed down as order ID
          userDetails={{ email: formData.email, phone: formData.phone }}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentCancel={() => setShowAsianPay(false)}
        />
      )}
    </div>
  );
};

export default CheckoutPage;
