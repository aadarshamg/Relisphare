
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { seed100Products } from '@/scripts/seed100Products';
import { Loader2, Database } from 'lucide-react';

export const Seed100ProductsButton = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSeed = async () => {
    const confirmed = window.confirm("This will add 100 products to the database. Continue?");
    if (!confirmed) return;
    
    setLoading(true);
    const result = await seed100Products();
    
    if (result.success) {
      toast({ 
        title: "Success", 
        description: "100 products successfully added to the database.",
        className: "bg-green-600 text-white"
      });
      if (onSuccess) {
        await onSuccess();
      }
    } else {
      toast({ 
        title: "Error Seeding Database", 
        description: result.error || "An unknown error occurred.", 
        variant: "destructive" 
      });
    }
    setLoading(false);
  };

  return (
    <Button 
      onClick={handleSeed} 
      disabled={loading} 
      variant="outline" 
      className="border-[#8B4513] text-[#8B4513] hover:bg-[#F5E6D3]"
    >
      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Database className="w-4 h-4 mr-2" />}
      {loading ? "Seeding products..." : "Seed 100 Products"}
    </Button>
  );
};

export default Seed100ProductsButton;
