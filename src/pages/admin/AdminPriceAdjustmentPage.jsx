
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, IndianRupee, Download, AlertCircle } from 'lucide-react';
import { adjustProductPrices } from '@/scripts/adjustProductPrices';
import { formatRupees } from '@/utils/currencyFormatter';

const AdminPriceAdjustmentPage = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState(null);
  const { toast } = useToast();

  const handleRunAdjustment = async () => {
    if (!window.confirm("Are you sure you want to run the price adjustment script? This will modify product prices in the database.")) return;
    
    setIsRunning(true);
    setResults(null);
    setProgress({ current: 0, total: 0 });

    try {
      const res = await adjustProductPrices((current, total) => {
        setProgress({ current, total });
      });

      if (res.success) {
        setResults(res);
        toast({
          title: "Adjustment Complete",
          description: `Successfully updated ${res.updatedCount} products.`,
          className: "bg-green-600 text-white"
        });
      } else {
        toast({ title: "Failed", description: res.error, variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsRunning(false);
    }
  };

  const handleDownloadCSV = () => {
    if (!results || !results.logs) return;
    
    const headers = ["Product ID", "Name", "Category", "Old Price (₹)", "New Price (₹)", "Status"];
    const rows = results.logs.map(log => [
      log.id,
      `"${log.name.replace(/"/g, '""')}"`,
      log.category || 'N/A',
      log.oldPrice,
      log.newPrice,
      log.status
    ]);
    
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `price_adjustment_log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      <Helmet><title>Price Adjustment | Admin</title></Helmet>

      <div>
        <h1 className="text-3xl font-serif font-bold text-[#2C2C2C] flex items-center gap-3">
          <IndianRupee className="w-8 h-8 text-green-600" />
          Global Price Adjustment
        </h1>
        <p className="text-gray-500 mt-2">
          Enforce pricing policies across all products. This operation will scan the database and adjust prices to fall within specified min/max bounds for their respective categories.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-2">
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg flex items-start gap-3 text-sm">
             <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
             <div>
                <strong>Warning:</strong> This process will permanently overwrite product prices in the database if they fall outside the allowed ranges.
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Global Range: ₹200 to ₹200,000</li>
                  <li>Furniture: ₹5,000 - ₹150,000</li>
                  <li>Coins: ₹500 - ₹50,000</li>
                  <li>Paintings: ₹2,000 - ₹100,000</li>
                  <li>Sculptures: ₹3,000 - ₹120,000</li>
                  <li>Jewelry: ₹1,000 - ₹200,000</li>
                  <li>Watches: ₹5,000 - ₹180,000</li>
                </ul>
             </div>
          </div>

          <Button 
            onClick={handleRunAdjustment} 
            disabled={isRunning}
            className="w-full py-6 text-lg bg-[#8B4513] hover:bg-[#5C4033] text-white mb-6"
          >
            {isRunning ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Adjusting ({progress.current}/{progress.total})...</>
            ) : (
              <><IndianRupee className="w-5 h-5 mr-2" /> Run Price Adjustment</>
            )}
          </Button>

          {results && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border">
                <div>
                  <h3 className="font-bold text-gray-800">Adjustment Summary</h3>
                  <p className="text-sm text-gray-600">{results.updatedCount} products updated out of {progress.total} scanned.</p>
                </div>
                {results.logs.length > 0 && (
                  <Button variant="outline" onClick={handleDownloadCSV} className="flex items-center gap-2">
                    <Download className="w-4 h-4" /> Export CSV
                  </Button>
                )}
              </div>

              {results.logs.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <div className="max-h-96 overflow-y-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-100 sticky top-0">
                        <tr>
                          <th className="p-3">Product Name</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Old Price</th>
                          <th className="p-3">New Price</th>
                          <th className="p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {results.logs.map((log, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="p-3 font-medium truncate max-w-[200px]" title={log.name}>{log.name}</td>
                            <td className="p-3">{log.category || 'N/A'}</td>
                            <td className="p-3 text-red-600 line-through">{formatRupees(log.oldPrice)}</td>
                            <td className="p-3 text-green-600 font-bold">{formatRupees(log.newPrice)}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded text-xs ${log.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg text-gray-500 border border-dashed">
                  No prices needed adjustment. All products are within their allowed ranges.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPriceAdjustmentPage;
