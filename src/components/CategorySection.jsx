
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { formatINR } from '@/utils/currencyFormatter';
import { getOptimizedImageUrl, getResponsiveImageSrcSet } from '@/utils/imageCompression';

const CategorySection = ({ title, products }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    if (product.stock <= 0) {
      toast({ title: "Out of Stock", description: "This item is currently unavailable.", variant: "destructive" });
      return;
    }
    const image = product.image_url;
    addToCart({ ...product, image, price: product.price / 100 }, 1);
  };

  const handleImageLoad = (e) => {
    e.target.classList.remove('image-lazy-loading');
    e.target.classList.add('image-lazy-loaded');
  };

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8 border-b border-[#D4AF37]/30 pb-4">
        <h2 className="text-3xl font-serif font-bold text-[#2C2C2C] capitalize">{title}</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => {
          const fallbackImg = 'https://images.unsplash.com/photo-1608062326349-42beaf01e920';
          const srcUrl = product.image_url || fallbackImg;
          
          return (
          <Link key={product.id} to={`/product/${product.id}`} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100">
            <div className="relative aspect-[4/3] responsive-image-container">
              <img 
                src={getOptimizedImageUrl(srcUrl, 400)} 
                srcSet={getResponsiveImageSrcSet(srcUrl, [300, 400, 600])}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                alt={product.name || 'Product Image'} 
                loading="lazy"
                onLoad={handleImageLoad}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 image-lazy-loading" 
                onError={(e) => { e.target.onerror = null; e.target.src = getOptimizedImageUrl(fallbackImg, 400); }}
              />
              {product.stock <= 0 && (
                <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Sold Out</div>
              )}
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-[#2C2C2C] mb-2 font-serif line-clamp-1 group-hover:text-[#8B4513] transition-colors">{product.name}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <span className="text-[#D4AF37] font-bold text-xl">{formatINR(product.price)}</span>
                <Button 
                  onClick={(e) => handleAddToCart(e, product)} 
                  disabled={product.stock <= 0}
                  className="bg-[#2C2C2C] hover:bg-[#8B4513] text-white rounded-full w-10 h-10 p-0 flex items-center justify-center transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Link>
        )})}
      </div>
    </section>
  );
};

export default CategorySection;
