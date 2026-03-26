
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Image as ImageIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { runImageAssignment } from '@/scripts/assignProductImages';
import supabase from '@/lib/customSupabaseClient';

const AdminImageAssignmentPage = () => {
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [results, setResults] = useState(null);
  const [verificationStats, setVerificationStats] = useState(null);
  const { toast } = useToast();

  const handleAssignImages = async () => {
    setLoading(true);
    setResults(null);
    try {
      const res = await runImageAssignment();
      if (res.success) {
        setResults(res);
        toast({ title: "Success", description: res.message, className: "bg-green-600 text-white" });
      } else {
        toast({ title: "Error", description: res.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Unexpected Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyImages = async () => {
    setVerifying(true);
    setVerificationStats(null);
    try {
      const { data: products, error } = await supabase.from('products').select('id, name, image_url');
      if (error) throw error;
      
      let valid = 0;
      let missing = 0;
      
      products.forEach(p => {
        if (p.image_url && p.image_url.startsWith('http')) valid++;
        else missing++;
      });
      
      setVerificationStats({ total: products.length, valid, missing });
      toast({ title: "Verification Complete", description: `Valid: ${valid}, Missing: ${missing}` });
    } catch (error) {
      toast({ title: "Verification Failed", description: error.message, variant: "destructive" });
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Helmet><title>Image Assignment | Relicsphere Admin</title></Helmet>

      <div>
        <h1 className="text-3xl font-serif font-bold text-[#2C2C2C]">Product Image Assignment</h1>
        <p className="text-gray-500 mt-2">Automatically assign high-quality stock images to products based on their categories.</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex gap-4">
          <Button onClick={handleAssignImages} disabled={loading || verifying} className="bg-[#8B4513] hover:bg-[#5C4033] text-white">
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ImageIcon className="w-4 h-4 mr-2" />}
            {loading ? 'Assigning Images...' : 'Run Image Assignment'}
          </Button>
          <Button onClick={handleVerifyImages} disabled={loading || verifying} variant="outline" className="border-blue-600 text-blue-700 hover:bg-blue-50">
            {verifying ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
            {verifying ? 'Verifying...' : 'Verify Images'}
          </Button>
        </div>

        {results && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Assignment Results</h3>
            <p className="text-green-700 mb-4">{results.message}</p>
            {results.summary && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.entries(results.summary).map(([cat, count]) => (
                  <div key={cat} className="bg-white p-3 rounded shadow-sm border border-green-100 text-center">
                    <p className="text-sm text-gray-500">{cat}</p>
                    <p className="text-xl font-bold text-green-700">{count}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {verificationStats && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2"><AlertCircle className="w-5 h-5" /> Verification Stats</h3>
            <ul className="space-y-2 text-blue-700">
              <li>Total Products: <strong>{verificationStats.total}</strong></li>
              <li>Valid Image URLs: <strong>{verificationStats.valid}</strong></li>
              <li>Missing/Invalid URLs: <strong>{verificationStats.missing}</strong></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminImageAssignmentPage;
