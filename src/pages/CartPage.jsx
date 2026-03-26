
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { formatRupees } from '@/utils/currencyFormatter';
import { getOptimizedImageUrl } from '@/utils/imageCompression';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const handleImageLoad = (e) => {
    e.target.classList.remove('image-lazy-loading');
    e.target.classList.add('image-lazy-loaded');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 bg-[#FAF5EF]">
        <Helmet><title>Cart | Relicsphere</title></Helmet>
        <h2 className="text-3xl font-serif text-[#2C2C2C]">Your cart is empty</h2>
        <p className="text-[#8B4513]">Looks like you haven't found your treasure yet.</p>
        <Link to="/shop">
          <Button className="bg-[#D4AF37] text-black hover:bg-[#B8860B]">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF5EF] py-12">
      <Helmet><title>Cart | Relicsphere</title></Helmet>
      
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-serif font-bold text-[#2C2C2C] mb-8">Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="lg:w-2/3 space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm flex gap-6 items-center">
                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 responsive-image-container">
                  {item.image ? (
                    <img 
                      src={getOptimizedImageUrl(item.image, 150)} 
                      alt={item.name} 
                      loading="lazy"
                      onLoad={handleImageLoad}
                      className="w-full h-full object-cover image-lazy-loading" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                  )}
                </div>
                
                <div className="flex-grow">
                  <h3 className="text-xl font-serif font-bold text-[#2C2C2C]">{item.name}</h3>
                  <p className="text-[#8B4513] font-semibold">{formatRupees(item.price)}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded-full hover:bg-gray-100 text-[#8B4513]"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-full hover:bg-gray-100 text-[#8B4513]"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="text-right min-w-[100px]">
                  <p className="font-bold text-lg">{formatRupees(item.price * item.quantity)}</p>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            
            <div className="flex justify-between items-center mt-6">
               <Button variant="outline" onClick={clearCart} className="text-red-500 border-red-200 hover:bg-red-50">
                Clear Cart
               </Button>
               <Link to="/shop" className="text-[#8B4513] hover:underline">Continue Shopping</Link>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white p-8 rounded-xl shadow-lg sticky top-24 border-t-4 border-[#D4AF37]">
              <h3 className="text-2xl font-serif font-bold mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 text-[#5C4033]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatRupees(getCartTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Estimate</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax Estimate (8%)</span>
                  <span>{formatRupees(getCartTotal() * 0.08)}</span>
                </div>
                <div className="h-px bg-gray-200 my-4"></div>
                <div className="flex justify-between text-xl font-bold text-[#2C2C2C]">
                  <span>Total</span>
                  <span>{formatRupees(getCartTotal() * 1.08)}</span>
                </div>
              </div>
              
              <Link to="/checkout">
                <Button className="w-full bg-[#8B4513] hover:bg-[#5C4033] text-white py-6 text-lg">
                  Proceed to Checkout <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
