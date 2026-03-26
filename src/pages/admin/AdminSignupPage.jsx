
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ShieldAlert, Loader2 } from 'lucide-react';

const AdminSignupPage = () => {
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '', fullName: '', secretKey: ''
  });
  const [loading, setLoading] = useState(false);
  const { signup } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
    }

    setLoading(true);
    try {
      // In a real app, verify a secret key to prevent unauthorized admin signups
      await signup(formData.email, formData.password, formData.fullName);
      toast({ title: "Admin Account Created", description: "Please log in with your credentials." });
      navigate('/admin/login');
    } catch (error) {
      toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2C2C2C] px-4 font-sans">
      <Helmet><title>Admin Registration | Relicsphere</title></Helmet>
      
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-[#8B4513] p-6 text-center text-white">
          <ShieldAlert className="w-12 h-12 mx-auto mb-2 opacity-80" />
          <h1 className="text-2xl font-serif font-bold">Admin Registration</h1>
          <p className="opacity-80 text-sm">Internal Use Only</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input name="fullName" required value={formData.fullName} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input name="email" type="email" required value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input name="password" type="password" required value={formData.password} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[#8B4513] hover:bg-[#A0522D] text-white py-6 mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
              {loading ? 'Creating Account...' : 'Register Administrator'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/admin/login" className="text-sm text-gray-500 hover:text-[#8B4513]">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignupPage;
