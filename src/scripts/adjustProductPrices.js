import supabase from '@/lib/customSupabaseClient';

const GLOBAL_MIN_RUPEES = 20000;
const GLOBAL_MAX_RUPEES = 200000;

const getRandomPriceInPaise = () => {
  const randomRupees = Math.floor(
    Math.random() * (GLOBAL_MAX_RUPEES - GLOBAL_MIN_RUPEES + 1)
  ) + GLOBAL_MIN_RUPEES;

  return randomRupees * 100;
};

export const adjustProductPrices = async (onProgress) => {
  try {
    const { data: products, error: fetchError } = await supabase.from('products').select('id, name, price, category');
    
    if (fetchError) throw fetchError;
    if (!products || products.length === 0) return { success: true, changes: [] };

    const logs = [];
    let updatedCount = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const targetPaise = getRandomPriceInPaise();
      const oldPriceRupees = Number(product.price || 0) / 100;
      const newPriceRupees = targetPaise / 100;

      const { error: updateError } = await supabase
        .from('products')
        .update({ price: targetPaise })
        .eq('id', product.id);

      if (updateError) {
        logs.push({
          id: product.id,
          name: product.name,
          category: product.category,
          oldPrice: oldPriceRupees,
          newPrice: newPriceRupees,
          status: 'Failed'
        });
      } else {
        updatedCount++;
        logs.push({
          id: product.id,
          name: product.name,
          category: product.category,
          oldPrice: oldPriceRupees,
          newPrice: newPriceRupees,
          status: 'Success'
        });
      }

      if (onProgress) {
        onProgress(i + 1, products.length);
      }
    }

    return { success: true, updatedCount, logs };
  } catch (error) {
    console.error('Failed to adjust prices:', error);
    return { success: false, error: error.message };
  }
};
