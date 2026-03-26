
import React from 'react';
import { useData } from '@/contexts/DataContext';
import { Helmet } from 'react-helmet';
import { Mail, Calendar } from 'lucide-react';

const AdminCustomersPage = () => {
  const { contacts } = useData();

  return (
    <div className="space-y-6">
      <Helmet><title>Customers & Inquiries | Relicsphere Admin</title></Helmet>
      <div><h1 className="text-3xl font-serif font-bold text-[#2C2C2C]">Customer Inquiries</h1><p className="text-gray-500">View recent contact form submissions</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.length === 0 ? (
          <p className="col-span-3 text-center py-10 text-gray-500">No recent inquiries.</p>
        ) : (
          contacts.map(contact => (
            <div key={contact.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#F5E6D3] rounded-full flex items-center justify-center text-[#8B4513] font-bold text-xl">{contact.name?.[0] || '?'}</div>
                <div><h3 className="font-bold text-lg text-[#2C2C2C]">{contact.name}</h3><span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Inquiry</span></div>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#D4AF37]" /><span>{contact.email}</span></div>
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#D4AF37]" /><span>{new Date(contact.created_at).toLocaleDateString()}</span></div>
                <div className="mt-4 p-3 bg-gray-50 rounded-lg"><p className="font-semibold text-xs text-gray-500 uppercase mb-1">Message</p><p className="text-gray-800 line-clamp-3">{contact.message}</p></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminCustomersPage;
