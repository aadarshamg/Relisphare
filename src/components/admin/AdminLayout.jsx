
import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { adminUser, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: ImageIcon, label: 'Assign Images', path: '/admin/images' },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
    { icon: Users, label: 'Customers', path: '/admin/customers' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      <aside className={`hidden md:flex flex-col bg-[#2C2C2C] text-[#F5E6D3] transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} fixed h-full z-30`}>
        <div className="p-4 border-b border-[#D4AF37]/20 flex items-center justify-between h-16">
          {isSidebarOpen ? <span className="text-xl font-serif font-bold text-[#D4AF37]">Relicsphere Admin</span> : <span className="text-xl font-serif font-bold text-[#D4AF37] mx-auto">R</span>}
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path} className={`flex items-center p-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-[#D4AF37] text-[#2C2C2C] font-bold' : 'hover:bg-[#D4AF37]/20 text-[#F5E6D3]'}`}>
                  <item.icon className={`w-5 h-5 ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} />
                  {isSidebarOpen && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-[#D4AF37]/20">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-[#D4AF37]/20 text-[#F5E6D3]">
            {isSidebarOpen ? "Collapse" : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-[#2C2C2C]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}><Menu className="w-6 h-6" /></button>
            <h2 className="text-xl font-serif font-bold text-[#2C2C2C] hidden sm:block">
              {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">{adminUser?.email}</span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </header>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black z-40 md:hidden" />
              <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} className="fixed inset-y-0 left-0 w-64 bg-[#2C2C2C] z-50 md:hidden flex flex-col">
                <div className="p-4 flex justify-between items-center border-b border-[#D4AF37]/20">
                  <span className="text-xl font-serif font-bold text-[#D4AF37]">Relicsphere Admin</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-[#F5E6D3]"><X className="w-6 h-6" /></button>
                </div>
                <nav className="flex-1 py-4">
                  <ul className="space-y-2 px-2">
                    {navItems.map((item) => (
                      <li key={item.path}>
                        <Link to={item.path} onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center p-3 rounded-lg ${location.pathname === item.path ? 'bg-[#D4AF37] text-[#2C2C2C] font-bold' : 'text-[#F5E6D3]'}`}>
                          <item.icon className="w-5 h-5 mr-3" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
