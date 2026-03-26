
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Image as ImageIcon, Zap, CheckCircle } from 'lucide-react';
import supabase from '@/lib/customSupabaseClient';

const AdminImageCompressionPage = () => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [results, setResults] = useState(null);
  const { toast } = useToast();

  const handleCompressImages = async () => {
    setIsCompressing(true);
    setResults(null);
    try {
      const { data, error } = await supabase.functions.invoke('compress-product-images', {
        body: JSON.stringify({ action: 'compress', targetIds: 'all' })
      });

      if (error) throw error;

      setResults(data);
      toast({
        title: "Compression Completed",
        description: data.message,
        className: "bg-green-600 text-white"
      });
    } catch (error) {
      console.error("Compression failed:", error);
      toast({
        title: "Compression Failed",
        description: error.message || "An unexpected error occurred during edge function execution.",
        variant: "destructive"
      });
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6">
      <Helmet><title>Image Compression | Admin</title></Helmet>

      <div>
        <h1 className="text-3xl font-serif font-bold text-[#2C2C2C] flex items-center gap-3">
          <Zap className="w-8 h-8 text-amber-500" />
          Image Optimization Studio
        </h1>
        <p className="text-gray-500 mt-2">
          Batch compress and generate responsive image sets for all products using Edge Functions.
          This will update the database to use optimized CDN delivery formats (WebP, proper scaling).
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-2">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-gray-400" />
            Batch Operation
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            Triggering this action will scan all products in the database, extract their image URLs, and generate optimized parameters for fast delivery. 
          </p>
          
          <Button 
            onClick={handleCompressImages} 
            disabled={isCompressing}
            className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isCompressing ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Optimizing Library...</>
            ) : (
              <><Zap className="w-5 h-5 mr-2" /> Start Bulk Compression</>
            )}
          </Button>

          {results && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-800 font-bold mb-2">
                <CheckCircle className="w-5 h-5" />
                {results.message}
              </div>
              {results.results && results.results.length > 0 && (
                <div className="mt-4 text-sm bg-white p-3 rounded border overflow-auto max-h-40">
                  <p className="font-semibold mb-2">Sample Processing Log:</p>
                  <ul className="space-y-1 text-gray-600 font-mono text-xs">
                    {results.results.map((r, i) => (
                      <li key={i}>ID {r.id}: {r.status}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Estimates</h2>
          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-500">Format</span>
              <span className="font-bold">WebP</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-500">Avg. Savings</span>
              <span className="font-bold text-green-600">~60-80%</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-500">Responsive SrcSet</span>
              <span className="font-bold text-blue-600">Enabled</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-gray-500">Lazy Loading</span>
              <span className="font-bold text-blue-600">Enabled</span>
            </div>
          </div>
          <div className="mt-6 p-3 bg-blue-50 text-blue-800 rounded text-xs leading-relaxed">
            <strong>Note:</strong> Since images are sourced from Unsplash, optimization occurs dynamically via URL parameters. This tool updates the DB to use these efficient URLs by default.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminImageCompressionPage;
