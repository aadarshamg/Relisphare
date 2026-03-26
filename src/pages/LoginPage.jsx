import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast({ title: "Welcome back!", description: "Successfully logged in." });
      navigate('/shop');
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2C2C2C] px-4" 
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1642027180032-f66feee943d8)', backgroundSize: 'cover', backgroundBlendMode: 'multiply' }}
    >
      <Helmet><title>Login | Relicsphere</title></Helmet>

      <div className="w-full max-w-md bg-[#F5E6D3] p-8 rounded-xl shadow-2xl border-2 border-[#D4AF37]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-[#8B4513] mb-2">Relicsphere</h1>
          <p className="text-[#5C4033]">Member Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-[#8B4513]">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/50 border-[#8B4513]/30 focus:border-[#8B4513] text-black"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-[#8B4513]">Password</Label>
            <Input 
              id="password" 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/50 border-[#8B4513]/30 focus:border-[#8B4513] text-black"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#8B4513] hover:bg-[#5C4033] text-white"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-[#5C4033]">
          Don't have an account? <Link to="/signup" className="font-bold hover:underline">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;