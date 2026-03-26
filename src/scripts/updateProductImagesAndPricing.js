
import supabase from '@/lib/customSupabaseClient';

const IMAGE_POOLS = {
  Furniture: {
    sofa: [
      'https://images.unsplash.com/photo-1670104344376-7288f45797a2',
      'https://images.unsplash.com/photo-1549187774-b4e9b0445b41',
      'https://images.unsplash.com/photo-1648881806148-e5c51179c826'
    ],
    dining: [
      'https://images.unsplash.com/photo-1587495239509-fcaee288a6e9',
      'https://images.unsplash.com/photo-1680169256615-19edb85cb7db',
      'https://images.unsplash.com/photo-1677514600243-8680aef6ad35'
    ],
    cabinet: [
      'https://images.unsplash.com/photo-1486160263960-980720ad70a2',
      'https://images.unsplash.com/photo-1646061142332-452a42f0a93e'
    ],
    default: [
      'https://images.unsplash.com/photo-1670104344376-7288f45797a2'
    ]
  },
  Coins: {
    default: [
      'https://images.unsplash.com/photo-1494122474412-aeaf73d11da8',
      'https://images.unsplash.com/photo-1686599596608-6be9a4426e96',
      'https://images.unsplash.com/photo-1617050331773-8d79dcd0feb6',
      'https://images.unsplash.com/photo-1643393670617-0915d3f6d1b8'
    ]
  },
  Paintings: {
    default: [
      'https://images.unsplash.com/photo-1542052472473-47eb350d4d6b',
      'https://images.unsplash.com/photo-1644220618668-402f543a3dc6',
      'https://images.unsplash.com/photo-1544374329-bf085d70d5da'
    ]
  },
  Sculptures: {
    default: [
      'https://images.unsplash.com/photo-1641678189245-f7eade30f8b0',
      'https://images.unsplash.com/photo-1604482080369-432ffd53fe9f',
      'https://images.unsplash.com/photo-1686210259133-f1ac4b5a2fe7'
    ]
  },
  Jewelry: {
    ring: [
      'https://images.unsplash.com/photo-1449641673563-547bf1a27d20',
      'https://images.unsplash.com/photo-1702155963993-cb25ce393c9f',
      'https://images.unsplash.com/photo-1697713465161-d872b22723a2'
    ],
    necklace: [
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071',
      'https://images.unsplash.com/photo-1689775707172-cceca4ce565a',
      'https://images.unsplash.com/photo-1653465393585-2595df80b769'
    ],
    default: [
      'https://images.unsplash.com/photo-1449641673563-547bf1a27d20'
    ]
  },
  Watches: {
    luxury: [
      'https://images.unsplash.com/photo-1639565216143-55888cd7e73c',
      'https://images.unsplash.com/photo-1677389689443-c052ae3cbb2f',
      'https://images.unsplash.com/photo-1699985915093-5aa3e2accbf1'
    ],
    vintage: [
      'https://images.unsplash.com/photo-1550814013-02210c39b148',
      'https://images.unsplash.com/photo-1672845340958-18ca0bc090dd'
    ],
    default: [
      'https://images.unsplash.com/photo-1639565216143-55888cd7e73c'
    ]
  }
};

const getRandomPrice = (min, max) => {
  // Return price in cents (multiply rupees by 100)
  const priceInRupees = Math.floor(Math.random() * (max - min + 1)) + min;
  return priceInRupees * 100; 
};

const determineImageAndPrice = (product) => {
  const name = (product.name || '').toLowerCase();
  const cat = product.category || 'Uncategorized';
  
  let imageUrl = '';
  let newPrice = 0;

  if (cat === 'Furniture') {
    newPrice = getRandomPrice(5000, 150000);
    if (name.includes('sofa') || name.includes('couch')) imageUrl = IMAGE_POOLS.Furniture.sofa[Math.floor(Math.random() * IMAGE_POOLS.Furniture.sofa.length)];
    else if (name.includes('dining') || name.includes('table')) imageUrl = IMAGE_POOLS.Furniture.dining[Math.floor(Math.random() * IMAGE_POOLS.Furniture.dining.length)];
    else if (name.includes('cabinet') || name.includes('wardrobe')) imageUrl = IMAGE_POOLS.Furniture.cabinet[Math.floor(Math.random() * IMAGE_POOLS.Furniture.cabinet.length)];
    else imageUrl = IMAGE_POOLS.Furniture.default[0];
  } 
  else if (cat === 'Coins') {
    newPrice = getRandomPrice(500, 50000);
    imageUrl = IMAGE_POOLS.Coins.default[Math.floor(Math.random() * IMAGE_POOLS.Coins.default.length)];
  }
  else if (cat === 'Paintings') {
    newPrice = getRandomPrice(2000, 100000);
    imageUrl = IMAGE_POOLS.Paintings.default[Math.floor(Math.random() * IMAGE_POOLS.Paintings.default.length)];
  }
  else if (cat === 'Sculptures') {
    newPrice = getRandomPrice(3000, 120000);
    imageUrl = IMAGE_POOLS.Sculptures.default[Math.floor(Math.random() * IMAGE_POOLS.Sculptures.default.length)];
  }
  else if (cat === 'Jewelry') {
    newPrice = getRandomPrice(1000, 200000);
    if (name.includes('ring')) imageUrl = IMAGE_POOLS.Jewelry.ring[Math.floor(Math.random() * IMAGE_POOLS.Jewelry.ring.length)];
    else if (name.includes('necklace') || name.includes('pendant')) imageUrl = IMAGE_POOLS.Jewelry.necklace[Math.floor(Math.random() * IMAGE_POOLS.Jewelry.necklace.length)];
    else imageUrl = IMAGE_POOLS.Jewelry.default[0];
  }
  else if (cat === 'Watches') {
    newPrice = getRandomPrice(5000, 180000);
    if (name.includes('luxury') || name.includes('chronograph')) imageUrl = IMAGE_POOLS.Watches.luxury[Math.floor(Math.random() * IMAGE_POOLS.Watches.luxury.length)];
    else if (name.includes('vintage') || name.includes('pilot')) imageUrl = IMAGE_POOLS.Watches.vintage[Math.floor(Math.random() * IMAGE_POOLS.Watches.vintage.length)];
    else imageUrl = IMAGE_POOLS.Watches.default[0];
  } else {
    // Default fallback
    newPrice = getRandomPrice(1000, 50000);
    imageUrl = 'https://images.unsplash.com/photo-1608062326349-42beaf01e920';
  }

  return { imageUrl, newPrice };
};

export const updateProductImagesAndPricing = async (onProgress) => {
  try {
    const { data: products, error: fetchError } = await supabase.from('products').select('*');
    if (fetchError) throw fetchError;
    
    if (!products || products.length === 0) {
      return { success: true, count: 0, message: "No products found." };
    }

    let updatedCount = 0;
    const updatedProductsList = [];

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const { imageUrl, newPrice } = determineImageAndPrice(product);
      
      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: imageUrl, price: newPrice })
        .eq('id', product.id);

      if (!updateError) {
        updatedCount++;
        updatedProductsList.push({ ...product, image_url: imageUrl, price: newPrice });
      }

      if (onProgress) {
        onProgress(i + 1, products.length, product.name);
      }
    }

    return { 
      success: true, 
      count: updatedCount, 
      products: updatedProductsList,
      message: `Successfully updated ${updatedCount} products with new INR pricing and images.` 
    };
  } catch (error) {
    console.error("Update script failed:", error);
    return { success: false, error: error.message };
  }
};
