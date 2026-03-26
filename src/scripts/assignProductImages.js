
import supabase from '@/lib/customSupabaseClient';
import { assignImagesToProducts } from '@/utils/imageAssignmentHelper';

export const runImageAssignment = async () => {
  try {
    console.log("Fetching products...");
    const { data: products, error: fetchError } = await supabase.from('products').select('*');
    
    if (fetchError) throw fetchError;
    if (!products || products.length === 0) {
      return { success: true, message: 'No products found to update.', summary: {} };
    }

    console.log(`Found ${products.length} products. Assigning images...`);
    const updatedProducts = assignImagesToProducts(products);
    const summary = {};
    let successCount = 0;
    let errorCount = 0;

    for (const product of updatedProducts) {
      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: product.image_url })
        .eq('id', product.id);

      if (updateError) {
        console.error(`Failed to update product ${product.id}:`, updateError);
        errorCount++;
      } else {
        successCount++;
        const cat = product.category || 'Uncategorized';
        summary[cat] = (summary[cat] || 0) + 1;
      }
    }

    console.log(`Image assignment complete. Success: ${successCount}, Errors: ${errorCount}`);
    return { 
      success: true, 
      message: `Updated ${successCount} products.`, 
      summary,
      errors: errorCount 
    };
  } catch (error) {
    console.error("Image assignment failed:", error);
    return { success: false, error: error.message };
  }
};
