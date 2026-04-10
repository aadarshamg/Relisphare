import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const SignupPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', fullName: '' });
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
    }
    if (formData.password.length < 8) {
      return toast({ title: "Error", description: "Password must be at least 8 characters", variant: "destructive" });
    }

    setLoading(true);
    try {
      await signUp(formData.email, formData.password, formData.fullName);
      toast({ title: "Account Created!", description: "Please log in with your new account." });
      navigate('/login');
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
      <Helmet>
        <title>Sign Up | Relicsphere</title>
        <meta name="description" content="E commerce stores for antique Shop" />
      </Helmet>

      <div className="w-full max-w-md bg-[#F5E6D3] p-8 rounded-xl shadow-2xl border-2 border-[#D4AF37]">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-[#8B4513] mb-2">Relicsphere</h1>
          <p className="text-[#5C4033]">Join the Collection</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName" className="text-[#8B4513]">Full Name</Label>
            <Input id="fullName" name="fullName" required value={formData.fullName} onChange={handleChange} className="bg-white/50 border-[#8B4513]/30 text-black" />
          </div>
          <div>
            <Label htmlFor="email" className="text-[#8B4513]">Email</Label>
            <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="bg-white/50 border-[#8B4513]/30 text-black" />
          </div>
          <div>
            <Label htmlFor="password" className="text-[#8B4513]">Password</Label>
            <Input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className="bg-white/50 border-[#8B4513]/30 text-black" />
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="text-[#8B4513]">Confirm Password</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className="bg-white/50 border-[#8B4513]/30 text-black" />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-[#8B4513] hover:bg-[#5C4033] text-white mt-4">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-[#5C4033]">
          Already have an account? <Link to="/login" className="font-bold hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;