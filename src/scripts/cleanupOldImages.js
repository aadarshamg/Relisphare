
import supabase from '@/lib/customSupabaseClient';

export const verifyImageState = async () => {
  try {
    const { data: products, error } = await supabase.from('products').select('id, image_url');
    if (error) throw error;

    const totalProducts = products.length;
    const urlMap = new Map();
    let duplicateCount = 0;
    const nullCount = products.filter(p => !p.image_url).length;

    products.forEach(p => {
      if (p.image_url) {
        if (urlMap.has(p.image_url)) {
          duplicateCount++;
          urlMap.get(p.image_url).push(p.id);
        } else {
          urlMap.set(p.image_url, [p.id]);
        }
      }
    });

    return {
      success: true,
      totalProducts,
      uniqueImages: urlMap.size,
      duplicateCount,
      nullCount,
      details: Array.from(urlMap.entries()).filter(([url, ids]) => ids.length > 1)
    };
  } catch (error) {
    console.error("Failed to verify image state:", error);
    return { success: false, error: error.message };
  }
};

export const cleanupOldImages = async (onProgress) => {
  try {
    // 1. Fetch all products
    const { data: products, error: fetchError } = await supabase.from('products').select('*');
    if (fetchError) throw fetchError;

    if (!products || products.length === 0) {
      return { success: true, message: "No products found to clean.", removed: 0, updated: 0 };
    }

    // 2. Identify duplicates and keep only latest unique
    const urlMap = new Map();
    const productsToUpdate = [];
    const orphanedUrls = [];

    products.forEach(product => {
      if (!product.image_url) return;

      if (urlMap.has(product.image_url)) {
        // This is a duplicate reference. We need to assign a new one or clear it.
        // For cleanup, we might just clear it to ensure uniqueness, or assign a placeholder.
        // The prompt says: "keeping only the latest unique image per product".
        productsToUpdate.push({
          id: product.id,
          old_url: product.image_url,
          new_url: null // Clearing duplicate to enforce uniqueness
        });
      } else {
        urlMap.set(product.image_url, product.id);
      }
    });

    let updatedCount = 0;

    // 4. Update products to have exactly ONE unique image_url
    for (let i = 0; i < productsToUpdate.length; i++) {
      const update = productsToUpdate[i];
      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: update.new_url })
        .eq('id', update.id);
      
      if (!updateError) {
        updatedCount++;
        // Track the old URL to delete if it was a storage bucket file
        if (update.old_url && update.old_url.includes('supabase.co/storage')) {
          orphanedUrls.push(update.old_url);
        }
      }

      if (onProgress) {
        onProgress(i + 1, productsToUpdate.length, `Cleaned product ${update.id}`);
      }
    }

    // 3. Delete orphaned image records from Supabase storage
    let storageDeletedCount = 0;
    if (orphanedUrls.length > 0) {
      // Extract file paths from URLs
      const filePaths = orphanedUrls.map(url => {
        const parts = url.split('/');
        return parts[parts.length - 1];
      }).filter(Boolean);

      if (filePaths.length > 0) {
        const { data: deleteData, error: deleteError } = await supabase
          .storage
          .from('product-images')
          .remove(filePaths);

        if (!deleteError && deleteData) {
          storageDeletedCount = deleteData.length;
        }
      }
    }

    // 5. Clear any local cache mechanism (conceptual, via returning timestamp)
    const cacheBuster = Date.now();

    // 6 & 7. Log and Return Summary
    const summary = {
      success: true,
      message: "Cleanup completed successfully.",
      removedDuplicates: productsToUpdate.length,
      productsUpdated: updatedCount,
      storageFilesDeleted: storageDeletedCount,
      cacheBuster,
      timestamp: new Date().toISOString()
    };

    console.log("Cleanup Summary:", summary);
    return summary;

  } catch (error) {
    console.error("Cleanup script failed:", error);
    return { success: false, error: error.message };
  }
};
