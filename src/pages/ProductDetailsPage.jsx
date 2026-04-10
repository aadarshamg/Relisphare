
import React, { useState, useEffect, useCallback, memo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useCart } from '@/contexts/CartContext';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowLeft, Package, Clock, Globe } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { formatINR } from '@/utils/currencyFormatter';
import { getOptimizedImageUrl, getResponsiveImageSrcSet } from '@/utils/imageCompression';

const ProductImage = memo(({ src, alt, isActive }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const fallbackSrc = 'https://images.unsplash.com/photo-1608062326349-42beaf01e920';
  const imgUrl = src || fallbackSrc;
  
  return (
    <div className={`absolute inset-0 transition-opacity duration-500 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'} responsive-image-container`}>
      <img 
        src={getOptimizedImageUrl(imgUrl, 800)} 
        srcSet={getResponsiveImageSrcSet(imgUrl, [400, 800, 1200])}
        sizes="(max-width: 768px) 100vw, 50vw"
        alt={alt || 'Product Image'} 
        loading="lazy" 
        onLoad={() => setIsLoaded(true)}
        onError={(e) => { e.target.onerror = null; e.target.src = getOptimizedImageUrl(fallbackSrc, 800); }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'image-lazy-loaded' : 'image-lazy-loading'}`} 
      />
    </div>
  );
});

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { getProductById } = useData();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const found = getProductById(id);
    if (found) setProduct(found);
  }, [id, getProductById]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    if (product.stock < quantity) {
      toast({ title: "Stock Limit", description: `Only ${product.stock} items available.`, variant: "destructive" });
      return;
    }
    const image = product.image_url || product.product_images?.[0]?.image_url;
    addToCart({ ...product, image, price: product.price / 100 }, quantity);
  }, [product, quantity, addToCart, toast]);

  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;

  const images = product.image_url ? [{ id: 'main', image_url: product.image_url }] : (product.product_images || []);

  return (
    <div className="min-h-screen bg-[#FAF5EF] py-12">
      <Helmet>
        <title>{product.name} | Relicsphere</title>
        <meta name="description" content="E commerce stores for antique Shop" />
      </Helmet>
      <div className="container mx-auto px-4">
        <Link to="/shop" className="inline-flex items-center text-[#8B4513] hover:underline mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-lg border relative">
              {images.length > 0 ? images.map((img, idx) => (
                <ProductImage key={img.id} src={img.image_url} alt={product.name} isActive={activeImage === idx} />
              )) : <ProductImage src={null} alt={product.name} isActive={true} />}
            </div>
            {/* Gallery Thumbnails could go here if multiple images */}
          </div>
          {/* Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-serif font-bold text-[#2C2C2C] mb-2">{product.name}</h1>
              <p className="text-[#D4AF37] font-bold text-3xl">{formatINR(product.price)}</p>
            </div>
            <div className="prose text-[#5C4033]"><p>{product.description}</p></div>
            <div className="grid grid-cols-2 gap-4 py-6 border-y border-[#D4AF37]/20">
              <div className="flex items-center gap-3"><Clock className="w-5 h-5 text-[#8B4513]" /><div><p className="text-xs uppercase">Category</p><p className="font-serif">{product.category || 'Various'}</p></div></div>
              <div className="flex items-center gap-3"><Globe className="w-5 h-5 text-[#8B4513]" /><div><p className="text-xs uppercase">Origin</p><p className="font-serif">{product.origin || 'Unknown'}</p></div></div>
              <div className="flex items-center gap-3"><Package className="w-5 h-5 text-[#8B4513]" /><div><p className="text-xs uppercase">Material</p><p className="font-serif">{product.material || 'Various'}</p></div></div>
              <div className="flex items-center gap-3"><div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-600' : 'bg-red-600'}`}></div><div><p className="text-xs uppercase">Status</p><p className="font-serif">{product.stock > 0 ? `${product.stock} in stock` : 'Sold Out'}</p></div></div>
            </div>
            {product.stock > 0 ? (
              <div className="flex gap-4 items-end">
                <div className="w-24">
                  <label className="text-sm font-bold text-[#2C2C2C] mb-1 block">Quantity</label>
                  <input type="number" min="1" max={product.stock} value={quantity} onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#D4AF37]" />
                </div>
                <Button onClick={handleAddToCart} className="flex-1 bg-[#8B4513] hover:bg-[#5C4033] text-white py-6 text-lg"><ShoppingCart className="mr-2" /> Add to Cart</Button>
              </div>
            ) : (
              <Button disabled className="w-full bg-gray-300 py-6 text-lg">Currently Unavailable</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
