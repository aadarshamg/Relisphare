
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/contexts/DataContext';
import { Loader2, Trash2, CheckCircle, AlertTriangle, RefreshCw, Database } from 'lucide-react';
import { verifyImageState, cleanupOldImages } from '@/scripts/cleanupOldImages';

const AdminImageCleanupPage = () => {
  const [stats, setStats] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, text: '' });
  const [summary, setSummary] = useState(null);
  const { fetchProducts } = useData();
  const { toast } = useToast();

  const handleVerify = async () => {
    setIsVerifying(true);
    setSummary(null);
    try {
      const result = await verifyImageState();
      if (result.success) {
        setStats(result);
        toast({ title: "Verification Complete", description: "Database image state analyzed." });
      } else {
        toast({ title: "Verification Failed", description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCleanup = async () => {
    if (!window.confirm("Are you sure you want to remove duplicate images and clean orphaned files? This cannot be undone.")) return;
    
    setIsCleaning(true);
    setSummary(null);
    try {
      const result = await cleanupOldImages((current, total, text) => {
        setProgress({ current, total, text });
      });

      if (result.success) {
        setSummary(result);
        toast({ 
          title: "Cleanup Successful", 
          description: `Removed ${result.removedDuplicates} duplicate references.`,
          className: "bg-green-600 text-white" 
        });
        
        // Refresh context data and update cache buster
        await fetchProducts();
        localStorage.setItem('imageCacheBuster', result.cacheBuster.toString());
        
        // Re-verify to show updated stats
        await handleVerify();
      } else {
        toast({ title: "Cleanup Failed", description: result.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsCleaning(false);
      setProgress({ current: 0, total: 0, text: '' });
    }
  };

  useEffect(() => {
    handleVerify();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6">
      <Helmet><title>Image Cleanup | Admin</title></Helmet>

      <div>
        <h1 className="text-3xl font-serif font-bold text-[#2C2C2C] flex items-center gap-3">
          <Database className="w-8 h-8 text-indigo-600" />
          Database Image Cleanup
        </h1>
        <p className="text-gray-500 mt-2">
          Scan and remove duplicate image references, delete orphaned storage files, and enforce unique product images.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {/* Status Panel */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Current State
            </h2>
            <Button variant="outline" size="sm" onClick={handleVerify} disabled={isVerifying || isCleaning}>
              {isVerifying ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Verify Now
            </Button>
          </div>

          {stats ? (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg border text-center">
                <p className="text-sm text-gray-500 mb-1">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-center">
                <p className="text-sm text-blue-600 mb-1">Unique Images</p>
                <p className="text-2xl font-bold text-blue-900">{stats.uniqueImages}</p>
              </div>
              <div className={`p-4 rounded-lg border text-center ${stats.duplicateCount > 0 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
                <p className={`text-sm mb-1 ${stats.duplicateCount > 0 ? 'text-amber-700' : 'text-green-700'}`}>Duplicates</p>
                <p className={`text-2xl font-bold ${stats.duplicateCount > 0 ? 'text-amber-900' : 'text-green-900'}`}>{stats.duplicateCount}</p>
              </div>
            </div>
          ) : (
             <div className="py-8 text-center text-gray-400">Loading statistics...</div>
          )}

          {stats?.duplicateCount > 0 && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg flex items-start gap-3 text-sm">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p>Found <strong>{stats.duplicateCount}</strong> duplicate image references. Running cleanup will clear duplicates to ensure each product has a unique image, and delete orphaned files from storage.</p>
            </div>
          )}

          <Button 
            onClick={handleCleanup} 
            disabled={isCleaning || (stats && stats.duplicateCount === 0)}
            className="w-full py-6 text-lg bg-red-600 hover:bg-red-700 text-white"
          >
            {isCleaning ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Cleaning Database ({progress.current}/{progress.total})...</>
            ) : (
              <><Trash2 className="w-5 h-5 mr-2" /> Run Image Cleanup</>
            )}
          </Button>

          {summary && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-sm">
              <h3 className="font-bold text-green-800 mb-2">Cleanup Summary Report</h3>
              <ul className="space-y-1 text-green-700">
                <li>• Duplicates Removed: <strong>{summary.removedDuplicates}</strong></li>
                <li>• Products Updated: <strong>{summary.productsUpdated}</strong></li>
                <li>• Orphaned Files Deleted: <strong>{summary.storageFilesDeleted}</strong></li>
                <li>• Cache Buster: <strong>{summary.cacheBuster}</strong></li>
              </ul>
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Operations</h2>
          <ul className="space-y-4 text-sm text-gray-600">
            <li className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">1</div>
              <p>Scans the `products` table for identical `image_url` values across multiple rows.</p>
            </li>
            <li className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">2</div>
              <p>Keeps the first occurrence and clears the duplicate references.</p>
            </li>
            <li className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">3</div>
              <p>Identifies any removed URLs that point to Supabase Storage and deletes the files.</p>
            </li>
            <li className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">4</div>
              <p>Generates a new cache-buster token to force clients to refetch clean images.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminImageCleanupPage;
