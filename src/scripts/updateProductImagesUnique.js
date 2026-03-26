
import supabase from '@/lib/customSupabaseClient';

const UNIQUE_IMAGES = {
  Furniture: [
    'https://images.unsplash.com/photo-1670104344376-7288f45797a2',
    'https://images.unsplash.com/photo-1672501007889-c6383dbcc14d',
    'https://images.unsplash.com/photo-1589835449869-4557cc3ddab4',
    'https://images.unsplash.com/photo-1587495239509-fcaee288a6e9',
    'https://images.unsplash.com/photo-1559474520-fab4447997ce',
    'https://images.unsplash.com/photo-1680092918972-42b0ed598aa4',
    'https://images.unsplash.com/photo-1622126977176-bf029dbf6ed0',
    'https://images.unsplash.com/photo-1682662046471-b9c797feffd2',
    'https://images.unsplash.com/photo-1697228428504-36bc0c5efb05',
    'https://images.unsplash.com/photo-1516192245557-76e0181e28da'
  ],
  Coins: [
    'https://images.unsplash.com/photo-1686599596608-6be9a4426e96',
    'https://images.unsplash.com/photo-1617050331773-8d79dcd0feb6',
    'https://images.unsplash.com/photo-1542993196-1c2a5aee4d0a',
    'https://images.unsplash.com/photo-1653505517139-d1d3cea3c3a2',
    'https://images.unsplash.com/photo-1579983093077-6db76fab6477',
    'https://images.unsplash.com/photo-1643393670617-0915d3f6d1b8'
  ],
  Paintings: [
    'https://images.unsplash.com/photo-1542052472473-47eb350d4d6b',
    'https://images.unsplash.com/photo-1544374329-bf085d70d5da',
    'https://images.unsplash.com/photo-1566934083173-17ce2bf40c59',
    'https://images.unsplash.com/photo-1573107431483-041924947c02',
    'https://images.unsplash.com/photo-1600129737181-fac7cf5f2ed7',
    'https://images.unsplash.com/photo-1569708261611-a7ef73dc435d'
  ],
  Sculptures: [
    'https://images.unsplash.com/photo-1625224830149-7720ca5e4601',
    'https://images.unsplash.com/photo-1626416449318-9a7f940aa2bd',
    'https://images.unsplash.com/photo-1676474324215-62ffb18c30ba',
    'https://images.unsplash.com/photo-1702333927127-f64995ed1f22',
    'https://images.unsplash.com/photo-1695974165235-47280efe5cd6',
    'https://images.unsplash.com/photo-1670106553181-85eb5ec0bdcc'
  ],
  Jewelry: [
    'https://images.unsplash.com/photo-1678924721537-9d7902389c8e',
    'https://images.unsplash.com/photo-1691695862754-f3d5734a7ace',
    'https://images.unsplash.com/photo-1682629846138-7db022565bd5',
    'https://images.unsplash.com/photo-1659489755229-37b8a88bab3a',
    'https://images.unsplash.com/photo-1676485231005-7eaddf30156f',
    'https://images.unsplash.com/photo-1630871615202-aeadaf847f77',
    'https://images.unsplash.com/photo-1639575082080-bf84aff31250',
    'https://images.unsplash.com/photo-1626784213922-d9f1e050cf8f'
  ],
  Watches: [
    'https://images.unsplash.com/photo-1639565216143-55888cd7e73c',
    'https://images.unsplash.com/photo-1694562383035-3b527733e995',
    'https://images.unsplash.com/photo-1688573423366-40c82a32363f',
    'https://images.unsplash.com/photo-1584204159455-11ad2b12ebf8',
    'https://images.unsplash.com/photo-1671195828444-eb720226a961',
    'https://images.unsplash.com/photo-1636078360032-43fbe4ff562b'
  ]
};

export const updateProductImagesUnique = async (onProgress) => {
  try {
    const { data: products, error: fetchError } = await supabase.from('products').select('*');
    if (fetchError) throw fetchError;
    
    if (!products || products.length === 0) {
      return { success: true, count: 0, message: "No products found." };
    }

    // Group products by category
    const groupedProducts = {};
    products.forEach(p => {
      const cat = p.category || 'Uncategorized';
      if (!groupedProducts[cat]) groupedProducts[cat] = [];
      groupedProducts[cat].push(p);
    });

    let updatedCount = 0;
    const updatedProductsList = [];
    const usedImages = new Set();
    let totalProcessed = 0;

    for (const [category, items] of Object.entries(groupedProducts)) {
      const categoryImages = UNIQUE_IMAGES[category] || [];
      
      for (let i = 0; i < items.length; i++) {
        const product = items[i];
        let imageUrl = product.image_url;

        // Assign a unique image if available in the category pool
        if (categoryImages.length > 0) {
          // If we have more products than unique images, we cycle them, 
          // but we prioritize uniqueness for the first N items.
          const imageIndex = i % categoryImages.length;
          imageUrl = categoryImages[imageIndex];
          usedImages.add(imageUrl);
        } else {
          // Fallback if category not found in our unique lists
          imageUrl = 'https://images.unsplash.com/photo-1608062326349-42beaf01e920';
        }

        const { error: updateError } = await supabase
          .from('products')
          .update({ image_url: imageUrl })
          .eq('id', product.id);

        if (!updateError) {
          updatedCount++;
          updatedProductsList.push({ ...product, image_url: imageUrl });
        }

        totalProcessed++;
        if (onProgress) {
          onProgress(totalProcessed, products.length, product.name);
        }
      }
    }

    return { 
      success: true, 
      count: updatedCount, 
      uniqueImagesUsed: usedImages.size,
      products: updatedProductsList,
      message: `Successfully updated ${updatedCount} products with ${usedImages.size} unique images.` 
    };
  } catch (error) {
    console.error("Unique image update script failed:", error);
    return { success: false, error: error.message };
  }
};
