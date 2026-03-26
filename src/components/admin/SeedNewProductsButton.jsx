
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Database } from 'lucide-react';
import { seedNewProducts } from '@/scripts/seedNewProducts';

const SeedNewProductsButton = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSeed = async () => {
    setLoading(true);
    const result = await seedNewProducts();
    setLoading(false);

    if (result.success) {
      toast({ 
        title: "Database Seeded", 
        description: `Successfully cleared old data and seeded ${result.count} new products.`,
        className: "bg-green-600 text-white"
      });
      if (onSuccess) onSuccess();
    } else {
      toast({ 
        title: "Seeding Failed", 
        description: result.error, 
        variant: "destructive" 
      });
    }
  };

  return (
    <Button 
      onClick={handleSeed} 
      disabled={loading} 
      variant="outline" 
      className="border-blue-600 text-blue-700 hover:bg-blue-50"
    >
      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Database className="w-4 h-4 mr-2" />}
      {loading ? 'Seeding...' : 'Seed New Products (60-80)'}
    </Button>
  );
};

export default SeedNewProductsButton;
