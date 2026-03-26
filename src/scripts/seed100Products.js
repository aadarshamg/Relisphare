
import supabase from '@/lib/customSupabaseClient';

const generateProducts = () => {
  const categories = [
    { name: 'Electronics', count: 13, keywords: ['Wireless', 'Smart', 'Bluetooth', 'Portable', 'Digital', 'Advanced'] },
    { name: 'Fashion', count: 13, keywords: ['Cotton', 'Silk', 'Designer', 'Casual', 'Elegant', 'Premium'] },
    { name: 'Home & Garden', count: 13, keywords: ['Ceramic', 'Wooden', 'Eco-friendly', 'Minimalist', 'Cozy', 'Rustic'] },
    { name: 'Sports', count: 13, keywords: ['Pro', 'Durable', 'Lightweight', 'Heavy-duty', 'Extreme', 'Active'] },
    { name: 'Books', count: 12, keywords: ['Hardcover', 'Paperback', 'Illustrated', 'Classic', 'Modern', 'Bestseller'] },
    { name: 'Beauty', count: 12, keywords: ['Organic', 'Natural', 'Hydrating', 'Anti-aging', 'Premium', 'Essential'] },
    { name: 'Toys', count: 12, keywords: ['Educational', 'Interactive', 'Plush', 'Creative', 'Building', 'Action'] },
    { name: 'Food & Beverage', count: 12, keywords: ['Gourmet', 'Artisan', 'Organic', 'Spicy', 'Sweet', 'Premium'] }
  ];

  const productTypes = {
    'Electronics': ['Headphones', 'Speaker', 'Watch', 'Camera', 'Tablet', 'Monitor'],
    'Fashion': ['Jacket', 'Scarf', 'Bag', 'Shoes', 'Hat', 'Sweater'],
    'Home & Garden': ['Planter', 'Lamp', 'Vase', 'Cushion', 'Rug', 'Wall Art'],
    'Sports': ['Backpack', 'Water Bottle', 'Tent', 'Mat', 'Gloves', 'Tracker'],
    'Books': ['Novel', 'Biography', 'Cookbook', 'History Book', 'Sci-Fi Novel', 'Poetry Collection'],
    'Beauty': ['Lotion', 'Serum', 'Cleanser', 'Mask', 'Perfume', 'Balm'],
    'Toys': ['Block Set', 'Puzzle', 'Robot', 'Doll', 'Board Game', 'Car'],
    'Food & Beverage': ['Coffee', 'Tea', 'Chocolate', 'Hot Sauce', 'Olive Oil', 'Snack Mix']
  };

  const products = [];
  let idCounter = 1;

  categories.forEach(cat => {
    for (let i = 0; i < cat.count; i++) {
      const keyword = cat.keywords[Math.floor(Math.random() * cat.keywords.length)];
      // Price ranging from $9.99 to $299.99
      const price = +(Math.random() * (299.99 - 9.99) + 9.99).toFixed(2);
      // Stock ranging from 10 to 500 units
      const stock = Math.floor(Math.random() * (500 - 10 + 1)) + 10;
      
      const itemType = productTypes[cat.name][Math.floor(Math.random() * productTypes[cat.name].length)];

      products.push({
        name: `${keyword} ${itemType} - Premium Edition`,
        description: `Experience the best with this ${keyword.toLowerCase()} ${itemType.toLowerCase()}. Detailed specifications include high durability, premium materials, and excellent craftsmanship. Perfect for everyday use. Designed to offer top-tier performance and style in the ${cat.name} category.`,
        price: price,
        stock: stock,
        category: cat.name,
        image_url: `https://picsum.photos/seed/relicsphere${idCounter}/400/400`
      });
      
      idCounter++;
    }
  });

  return products;
};

export const seed100Products = async () => {
  try {
    const products = generateProducts();
    console.log("Inserting 100 products...");
    
    // Supabase insert supports batch array insertion
    const { data, error } = await supabase.from('products').insert(products).select();
    
    if (error) throw error;
    
    console.log(`Successfully inserted ${data?.length || 100} products`);
    return { success: true, count: data?.length || 100 };
  } catch (error) {
    console.error("Seeding failed:", error);
    return { success: false, error: error.message };
  }
};
