
import React, { useState, memo } from 'react';
import { useData } from '@/contexts/DataContext';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const OrderDetailsModal = memo(({ order, onStatusUpdate }) => {
  const [status, setStatus] = useState(order.status);
  const [updating, setUpdating] = useState(false);
  
  const handleUpdate = async () => {
    setUpdating(true);
    await onStatusUpdate(order.id, status);
    setUpdating(false);
  };

  return (
    <DialogContent className="max-w-3xl bg-white">
      <DialogHeader><DialogTitle className="font-serif text-2xl">Order #{order.id.slice(0, 8)}...</DialogTitle></DialogHeader>
      <div className="grid grid-cols-2 gap-6 py-4">
        <div><h4 className="font-bold text-gray-500 text-xs uppercase mb-2">Customer</h4><p className="font-semibold">{order.user_email || 'Guest User'}</p><p className="text-sm text-gray-600 mt-1">{order.shipping_address}</p></div>
        <div><h4 className="font-bold text-gray-500 text-xs uppercase mb-2">Order Info</h4><p className="text-sm">Date: {new Date(order.created_at).toLocaleDateString()}</p><p className="text-sm">Total: <span className="font-bold text-[#8B4513]">₹{order.total_price?.toLocaleString('en-IN')}</span></p></div>
      </div>
      <div className="border-y border-gray-100 py-4 my-2"><h4 className="font-bold text-sm mb-3">Items</h4><div className="space-y-2 max-h-60 overflow-y-auto">
        {order.items?.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-sm"><span className="flex-1">{item.name || 'Unknown Item'}</span><span className="w-20 text-center">x{item.quantity}</span><span className="w-24 text-right">₹{item.price?.toLocaleString('en-IN')}</span></div>
        ))}
      </div></div>
      <div className="flex items-end gap-4 mt-4">
        <div className="flex-1"><label className="text-sm font-semibold mb-2 block">Update Status</label><Select value={status} onValueChange={setStatus}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent className="bg-white"><SelectItem value="pending">Pending</SelectItem><SelectItem value="processing">Processing</SelectItem><SelectItem value="shipped">Shipped</SelectItem><SelectItem value="delivered">Delivered</SelectItem><SelectItem value="cancelled">Cancelled</SelectItem></SelectContent></Select></div>
        <Button onClick={handleUpdate} disabled={updating} className="bg-[#8B4513] text-white">{updating ? 'Saving...' : 'Save Changes'}</Button>
      </div>
    </DialogContent>
  );
});

const AdminOrdersPage = () => {
  const { orders, updateOrderStatus, loading } = useData();
  const { toast } = useToast();

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      toast({ title: "Order Updated", description: `Order status changed to ${newStatus}` });
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6 p-6">
      <Helmet><title>Orders | Relicsphere Admin</title></Helmet>
      <div><h1 className="text-3xl font-serif font-bold text-[#2C2C2C]">Orders Management</h1><p className="text-gray-500">Track and fulfill customer orders</p></div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50"><tr><th className="p-4">Order ID</th><th className="p-4">Customer</th><th className="p-4">Date</th><th className="p-4">Total</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {orders.length === 0 ? (<tr><td colSpan="6" className="p-8 text-center">No orders found.</td></tr>) : (
              orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="p-4 font-mono text-sm" title={order.id}>#{order.id.slice(0, 8)}</td>
                  <td className="p-4 text-sm">{order.user_email || 'Guest'}</td>
                  <td className="p-4 text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="p-4 font-bold text-[#8B4513]">₹{order.total_price?.toLocaleString('en-IN')}</td>
                  <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full uppercase font-bold ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{order.status}</span></td>
                  <td className="p-4 text-right">
                    <Dialog><DialogTrigger asChild><Button variant="outline" size="sm"><Eye className="w-4 h-4 mr-2" /> Details</Button></DialogTrigger><OrderDetailsModal order={order} onStatusUpdate={handleStatusUpdate} /></Dialog>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
