
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { RefreshCw, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { updateProductImagesAndPricing } from '@/scripts/updateProductImagesAndPricing';
import { formatINR } from '@/utils/currencyFormatter';

const AdminImagePricingPage = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, currentName: '' });
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setResults(null);
    setProgress({ current: 0, total: 0, currentName: 'Starting...' });

    const response = await updateProductImagesAndPricing((current, total, name) => {
      setProgress({ current, total, currentName: name });
    });

    setLoading(false);

    if (response.success) {
      setResults(response);
      toast({
        title: "Update Complete",
        description: response.message,
        className: "bg-green-600 text-white"
      });
    } else {
      setError(response.error);
      toast({
        title: "Update Failed",
        description: response.error,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Helmet><title>Update Images & Pricing | Admin</title></Helmet>

      <div>
        <h1 className="text-3xl font-serif font-bold text-[#2C2C2C]">Mass Update: Images & Pricing</h1>
        <p className="text-gray-500 mt-2">Automatically assign high-quality category images and set realistic INR (₹) prices for all products.</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <Button 
            onClick={handleUpdate} 
            disabled={loading} 
            className="bg-[#8B4513] hover:bg-[#5C4033] text-white w-full sm:w-auto"
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            {loading ? 'Processing Update...' : 'Trigger Image & Pricing Update'}
          </Button>

          {loading && progress.total > 0 && (
            <div className="text-sm font-medium text-blue-700 bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 w-full sm:w-auto text-center">
              Updating {progress.current} / {progress.total}: <span className="font-bold">{progress.currentName}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold">Error Occurred</h3>
              <p>{error}</p>
              <Button variant="outline" size="sm" onClick={handleUpdate} className="mt-3 border-red-200 text-red-700 hover:bg-red-100">
                Retry Update
              </Button>
            </div>
          </div>
        )}

        {results && (
          <div className="space-y-6">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-bold text-green-800">Success!</h3>
                <p className="text-green-700">{results.message}</p>
              </div>
            </div>

            {results.products && results.products.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold text-lg mb-4 text-[#2C2C2C]">Updated Products Preview</h3>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="p-3 font-semibold text-gray-600 w-20">Image</th>
                        <th className="p-3 font-semibold text-gray-600">Product Name</th>
                        <th className="p-3 font-semibold text-gray-600">Category</th>
                        <th className="p-3 font-semibold text-gray-600 text-right">New Price (INR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {results.products.slice(0, 10).map(p => (
                        <tr key={p.id} className="hover:bg-gray-50/50">
                          <td className="p-3">
                            <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden">
                              <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="p-3 font-medium text-gray-900">{p.name}</td>
                          <td className="p-3 text-gray-500">{p.category}</td>
                          <td className="p-3 font-bold text-[#8B4513] text-right">{formatINR(p.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {results.products.length > 10 && (
                  <p className="text-sm text-gray-500 mt-3 text-center italic">Showing 10 of {results.products.length} updated products...</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminImagePricingPage;
