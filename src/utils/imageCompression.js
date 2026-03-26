
export const getOptimizedImageUrl = (originalUrl, width = 800, quality = 80, format = 'webp') => {
  if (!originalUrl) return '';
  
  // Handle Unsplash images natively
  if (originalUrl.includes('images.unsplash.com')) {
    try {
      const url = new URL(originalUrl);
      url.searchParams.set('w', width);
      url.searchParams.set('q', quality);
      url.searchParams.set('fm', format);
      url.searchParams.set('fit', 'crop');
      return url.toString();
    } catch (e) {
      return originalUrl;
    }
  }
  
  // Add logic here for other CDNs (e.g., Cloudinary, Imgix) if needed
  // For standard URLs without a known CDN, return the original
  return originalUrl;
};

export const getResponsiveImageSrcSet = (originalUrl, widths = [300, 600, 800, 1200]) => {
  if (!originalUrl) return '';
  return widths
    .map(w => `${getOptimizedImageUrl(originalUrl, w)} ${w}w`)
    .join(', ');
};

export const getImageDimensions = (context) => {
  switch (context) {
    case 'thumbnail': return { width: 300, height: 300 };
    case 'detail': return { width: 800, height: 800 };
    case 'cart': return { width: 150, height: 150 };
    case 'hero': return { width: 1600, height: 900 };
    default: return { width: 800, height: 800 };
  }
};

export const compressImageLocally = (file, maxWidth = 1920, maxHeight = 1080, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.match(/image.*/)) {
      reject(new Error('Not an image file'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const image = new Image();
      image.onload = () => {
        let width = image.width;
        let height = image.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const newFile = new File([blob], file.name, {
                type: 'image/webp',
                lastModified: Date.now(),
              });
              resolve(newFile);
            } else {
              reject(new Error('Canvas to Blob failed'));
            }
          },
          'image/webp',
          quality
        );
      };
      image.onerror = (err) => reject(err);
      image.src = readerEvent.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};
