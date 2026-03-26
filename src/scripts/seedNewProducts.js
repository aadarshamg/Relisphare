
import supabase from '@/lib/customSupabaseClient';

const generateProducts = () => {
  const products = [];
  let idCounter = 1;

  const addProduct = (cat, name, price, stock) => {
    products.push({
      name,
      description: `This is a premium ${name.toLowerCase()}. Meticulously crafted for the discerning collector or decorator. Add this exceptional piece to your collection today. Enjoy the timeless elegance and superior quality that this item brings.`,
      price,
      stock,
      category: cat,
      image_url: `https://picsum.photos/seed/relicnew${idCounter++}/400/400`
    });
  };

  // FURNITURE (16 products)
  const furnitureItems = ['Oak Desk', 'Leather Sofa', 'Dining Table', 'Armchair', 'Bookshelf', 'Coffee Table', 'Wardrobe', 'Bed Frame'];
  for(let i = 0; i < 16; i++) {
    const name = `Vintage ${furnitureItems[i % furnitureItems.length]} ${i + 1}`;
    const price = 200 + Math.floor(Math.random() * 2800);
    const stock = 5 + Math.floor(Math.random() * 16);
    addProduct('Furniture', name, price, stock);
  }

  // COINS (14 products)
  const coinItems = ['Roman Coin', 'Silver Dollar', 'Gold Doubloon', 'Ancient Drachma', 'Victorian Penny'];
  for(let i = 0; i < 14; i++) {
    const name = `Rare ${coinItems[i % coinItems.length]} ${i + 1}`;
    const price = 50 + Math.floor(Math.random() * 4950);
    const stock = 2 + Math.floor(Math.random() * 9);
    addProduct('Coins', name, price, stock);
  }

  // PAINTINGS (14 products)
  const paintingItems = ['Abstract Canvas', 'Landscape Oil', 'Watercolor Portrait', 'Modern Art Print'];
  for(let i = 0; i < 14; i++) {
    const name = `Original ${paintingItems[i % paintingItems.length]} ${i + 1}`;
    const price = 150 + Math.floor(Math.random() * 7850);
    const stock = 1 + Math.floor(Math.random() * 5);
    addProduct('Paintings', name, price, stock);
  }

  // SCULPTURES (11 products)
  const sculptureItems = ['Bronze Statue', 'Marble Bust', 'Stone Carving', 'Modern Metal Sculpture'];
  for(let i = 0; i < 11; i++) {
    const name = `Classic ${sculptureItems[i % sculptureItems.length]} ${i + 1}`;
    const price = 300 + Math.floor(Math.random() * 5700);
    const stock = 1 + Math.floor(Math.random() * 8);
    addProduct('Sculptures', name, price, stock);
  }

  // JEWELRY (14 products)
  const jewelryItems = ['Diamond Ring', 'Gold Necklace', 'Silver Bracelet', 'Pearl Earrings', 'Sapphire Pendant'];
  for(let i = 0; i < 14; i++) {
    const name = `Elegant ${jewelryItems[i % jewelryItems.length]} ${i + 1}`;
    const price = 100 + Math.floor(Math.random() * 3900);
    const stock = 3 + Math.floor(Math.random() * 13);
    addProduct('Jewelry', name, price, stock);
  }

  // WATCHES (9 products)
  const watchItems = ['Chronograph', 'Diver Watch', 'Dress Watch', 'Pilot Watch', 'Mechanical Timepiece'];
  for(let i = 0; i < 9; i++) {
    const name = `Luxury ${watchItems[i % watchItems.length]} ${i + 1}`;
    const price = 200 + Math.floor(Math.random() * 9800);
    const stock = 2 + Math.floor(Math.random() * 7);
    addProduct('Watches', name, price, stock);
  }

  return products;
};

export const seedNewProducts = async () => {
  try {
    console.log("Deleting existing products...");
    // Delete all existing products by using a condition that matches everything
    const { error: deleteError } = await supabase.from('products').delete().not('id', 'is', null);
    
    if (deleteError) {
      console.error("Error deleting old products:", deleteError);
      throw deleteError;
    }

    const products = generateProducts();
    console.log(`Inserting ${products.length} new products...`);
    
    const { data, error } = await supabase.from('products').insert(products).select();
    
    if (error) throw error;
    
    console.log(`Successfully inserted ${data?.length || products.length} products`);
    return { success: true, count: data?.length || products.length };
  } catch (error) {
    console.error("Seeding failed:", error);
    return { success: false, error: error.message };
  }
};
