
import supabase from '@/lib/customSupabaseClient';

export const updatePricesToRange = async () => {
  try {
    const { data: products, error } = await supabase.from('products').select('id, price');
    
    if (error) throw error;
    if (!products || products.length === 0) return { success: true, count: 0 };

    let updatedCount = 0;
    const MIN_PAISE = 200 * 100; // ₹200
    const MAX_PAISE = 200000 * 100; // ₹200,000

    for (const product of products) {
      let currentPaise = product.price || 0;
      let newPrice = currentPaise;

      if (currentPaise < MIN_PAISE) {
        newPrice = MIN_PAISE;
      } else if (currentPaise > MAX_PAISE) {
        newPrice = MAX_PAISE;
      }

      if (newPrice !== currentPaise) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ price: newPrice })
          .eq('id', product.id);

        if (updateError) throw updateError;
        updatedCount++;
      }
    }

    return { success: true, count: updatedCount };
  } catch (error) {
    console.error('Failed to update prices to range:', error);
    return { success: false, error: error.message };
  }
};
