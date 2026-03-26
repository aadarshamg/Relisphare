import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Database, Loader2 } from 'lucide-react';
import { seedProducts } from '@/scripts/seedProducts';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ProductSeedButton = ({ onSeedComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleSeed = async () => {
    setIsLoading(true);
    setProgress(0);
    
    try {
      const result = await seedProducts((count) => {
        setProgress(count);
      });

      if (result.success) {
        toast({
          title: "Database Seeded Successfully",
          description: `Added ${result.count} new products to the catalog.`,
          variant: "default",
          className: "bg-green-600 text-white"
        });
        setIsOpen(false);
        if (onSeedComplete) onSeedComplete();
      } else {
        // Use the error message from the result if available
        throw new Error(result.error?.message || "Seeding operation reported failure.");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Seeding Failed",
        description: error.message || "An error occurred while adding products. Check console for details.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 hover:text-orange-800">
          <Database className="w-4 h-4" />
          Seed Database
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Seed Product Database</DialogTitle>
          <DialogDescription>
            This action will add 200 sample products across 10 categories to your catalog. 
            This is intended for development and demonstration purposes.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading && (
          <div className="py-6 space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Generating treasures...</span>
              <span>{progress} / 200</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-orange-500 transition-all duration-300 ease-out"
                style={{ width: `${(progress / 200) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSeed} disabled={isLoading} className="bg-orange-600 hover:bg-orange-700 text-white">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Seeding...
              </>
            ) : (
              'Confirm & Seed'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductSeedButton;