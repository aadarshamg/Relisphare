
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ShieldCheck, Copy, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import supabase from '@/lib/customSupabaseClient';

const AdminSetupPage = () => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const email = "admin@relicsphere.com";
  const password = "Admin@123456";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!", description: "Email copied to clipboard." });
  };

  const handleSetup = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-admin-user');
      
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({ 
        title: "Admin Account Created", 
        description: "You can now log in with the default credentials.",
        className: "bg-green-600 text-white"
      });
      navigate('/admin/login');
    } catch (err) {
      toast({ 
        title: "Setup Failed", 
        description: err.message || "Could not create admin account.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2C2C2C] px-4 font-sans">
      <Helmet><title>Admin Setup | Relicsphere</title></Helmet>
      
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-[#D4AF37] p-6 text-center">
          <ShieldCheck className="w-12 h-12 text-[#2C2C2C] mx-auto mb-2" />
          <h1 className="text-2xl font-serif font-bold text-[#2C2C2C]">System Initialization</h1>
          <p className="text-[#2C2C2C]/80 text-sm">Create Default Administrator Account</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700 font-medium">
                  Important Security Warning
                </p>
                <p className="text-sm text-yellow-600 mt-1">
                  You MUST change this default password immediately after your first login to secure the system.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Default Credentials</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500">Email Address</label>
                <div className="flex items-center justify-between bg-white border border-gray-200 rounded p-2 mt-1">
                  <span className="font-mono text-gray-800">{email}</span>
                  <button onClick={handleCopy} className="text-gray-400 hover:text-gray-600">
                    {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="text-xs text-gray-500">Temporary Password</label>
                <div className="bg-white border border-gray-200 rounded p-2 mt-1">
                  <span className="font-mono text-gray-800">{password}</span>
                </div>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleSetup} 
            disabled={loading}
            className="w-full bg-[#2C2C2C] hover:bg-[#404040] text-white py-6"
          >
            {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <ShieldCheck className="w-5 h-5 mr-2" />}
            {loading ? 'Creating Account...' : 'Initialize Admin Account'}
          </Button>

          <div className="text-center pt-4">
            <button onClick={() => navigate('/admin/login')} className="text-sm text-gray-500 hover:text-[#D4AF37] hover:underline">
              Already have an account? Go to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSetupPage;
