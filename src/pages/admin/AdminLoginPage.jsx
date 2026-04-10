
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Lock, Info } from 'lucide-react';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast({ title: "Admin Access Granted", description: "Welcome back." });
      navigate(from, { replace: true });
    } catch (error) {
      toast({ 
        title: "Access Denied", 
        description: error.message || "Invalid credentials or insufficient permissions.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2C2C2C] px-4 font-sans py-12">
      <Helmet>
        <title>Admin Login | Relicsphere</title>
        <meta name="description" content="E commerce stores for antique Shop" />
      </Helmet>
      
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-[#D4AF37] p-6 text-center">
          <Lock className="w-12 h-12 text-[#2C2C2C] mx-auto mb-2" />
          <h1 className="text-2xl font-serif font-bold text-[#2C2C2C]">Admin Portal</h1>
          <p className="text-[#2C2C2C]/80 text-sm">Restricted Access Area</p>
        </div>

        <div className="p-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-800 flex items-start">
            <Info className="w-5 h-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold mb-1">Default Credentials</p>
              <p>Email: <span className="font-mono bg-white px-1 rounded">admin@relicsphere.com</span></p>
              <p>Pass: <span className="font-mono bg-white px-1 rounded">Admin@123456</span></p>
              <p className="mt-2 text-xs text-blue-600 font-medium">Please change your password after first login.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@relicsphere.com"
                className="mt-1"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="password">Password</Label>
                <Link to="#" className="text-xs text-[#8B4513] hover:underline">Forgot password?</Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#2C2C2C] hover:bg-[#404040] text-white py-6"
            >
              {loading ? 'Authenticating...' : 'Secure Login'}
            </Button>
          </form>

          <div className="mt-6 text-center pt-6 border-t border-gray-100 flex flex-col gap-2">
            <p className="text-sm text-gray-500">System not initialized? <Link to="/admin/setup" className="text-[#D4AF37] font-bold hover:underline">Go to Setup</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
