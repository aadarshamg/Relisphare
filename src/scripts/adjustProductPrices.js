
import supabase from '@/lib/customSupabaseClient';

const GLOBAL_MIN_RUPEES = 200;
const GLOBAL_MAX_RUPEES = 200000;

const CATEGORY_RANGES = {
  'furniture': { min: 5000, max: 150000 },
  'coins': { min: 500, max: 50000 },
  'paintings': { min: 2000, max: 100000 },
  'sculptures': { min: 3000, max: 120000 },
  'jewelry': { min: 1000, max: 200000 },
  'watches': { min: 5000, max: 180000 }
};

const getTargetPrice = (currentPaise, category) => {
  const currentRupees = currentPaise / 100;
  const catKey = category ? category.toLowerCase() : '';
  
  let targetRupees = currentRupees;
  let range = CATEGORY_RANGES[catKey];

  if (range) {
    if (targetRupees < range.min) targetRupees = range.min;
    if (targetRupees > range.max) targetRupees = range.max;
  } else {
    if (targetRupees < GLOBAL_MIN_RUPEES) targetRupees = GLOBAL_MIN_RUPEES;
    if (targetRupees > GLOBAL_MAX_RUPEES) targetRupees = GLOBAL_MAX_RUPEES;
  }

  // Double check global bounds just in case
  if (targetRupees < GLOBAL_MIN_RUPEES) targetRupees = GLOBAL_MIN_RUPEES;
  if (targetRupees > GLOBAL_MAX_RUPEES) targetRupees = GLOBAL_MAX_RUPEES;

  return Math.round(targetRupees * 100); // return in paise
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
      const targetPaise = getTargetPrice(product.price, product.category);

      if (targetPaise !== product.price) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ price: targetPaise })
          .eq('id', product.id);

        if (updateError) {
          logs.push({
            id: product.id, name: product.name, category: product.category,
            oldPrice: product.price / 100, newPrice: targetPaise / 100, status: 'Failed'
          });
        } else {
          updatedCount++;
          logs.push({
            id: product.id, name: product.name, category: product.category,
            oldPrice: product.price / 100, newPrice: targetPaise / 100, status: 'Success'
          });
        }
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
