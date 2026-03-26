
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package } from 'lucide-react';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const { getOrders } = useData();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const orders = getOrders();
    const foundOrder = orders.find(o => o.id === orderId);
    setOrder(foundOrder);
  }, [orderId, getOrders]);

  if (!order) return <div className="min-h-screen flex items-center justify-center">Loading order details...</div>;

  return (
    <div className="min-h-screen bg-[#FAF5EF] py-16 flex items-center justify-center">
      <Helmet><title>Order Confirmed | Relicsphere</title></Helmet>
      
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg max-w-2xl w-full text-center border-t-8 border-[#D4AF37]">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-20 h-20 text-green-600" />
        </div>
        
        <h1 className="text-4xl font-serif font-bold text-[#2C2C2C] mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your purchase. Your order <span className="font-mono font-bold text-[#8B4513]">#{orderId}</span> has been received.
        </p>

        <div className="bg-gray-50 p-6 rounded-lg text-left mb-8">
          <h3 className="font-bold mb-4 flex items-center gap-2"><Package className="w-5 h-5"/> Shipping to:</h3>
          <p className="text-gray-700">{order.shipping_address}</p>
          <p className="text-sm text-gray-500 mt-4">Estimated Delivery: 3-5 Business Days</p>
        </div>

        <Link to="/shop">
          <Button className="bg-[#8B4513] hover:bg-[#5C4033] text-white px-8 py-3">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
