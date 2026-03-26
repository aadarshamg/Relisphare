
export const CATEGORY_IMAGES = {
  Furniture: [
    'https://images.unsplash.com/photo-1608062326349-42beaf01e920',
    'https://images.unsplash.com/photo-1599780951615-fb547d2ba103',
    'https://images.unsplash.com/photo-1670954951803-6647275cc82f',
    'https://images.unsplash.com/photo-1694852503762-e8d30e1a8f58',
    'https://images.unsplash.com/photo-1672501007889-c6383dbcc14d',
    'https://images.unsplash.com/photo-1688728981543-df24d24d0116',
    'https://images.unsplash.com/photo-1464029902023-f42eba355bde',
    'https://images.unsplash.com/photo-1531904300735-5f40721f712f'
  ],
  Coins: [
    'https://images.unsplash.com/photo-1686599596608-6be9a4426e96',
    'https://images.unsplash.com/photo-1542993196-1c2a5aee4d0a',
    'https://images.unsplash.com/photo-1617050331773-8d79dcd0feb6',
    'https://images.unsplash.com/photo-1653505517139-d1d3cea3c3a2',
    'https://images.unsplash.com/photo-1682776839954-2b131f0d6e70',
    'https://images.unsplash.com/photo-1525177357676-a16802575be8'
  ],
  Paintings: [
    'https://images.unsplash.com/photo-1542372153-b7f8cbff58ec',
    'https://images.unsplash.com/photo-1617234112618-337d8fb28d42',
    'https://images.unsplash.com/photo-1539983612828-7ebdf2fe8eae',
    'https://images.unsplash.com/photo-1497770536946-04bb7055c28c',
    'https://images.unsplash.com/photo-1650226555183-898880afe79c',
    'https://images.unsplash.com/photo-1650296804450-2466e5b44f37',
    'https://images.unsplash.com/photo-1503436155788-4c4e5643aa91',
    'https://images.unsplash.com/photo-1638299663023-e61805c5c3ae'
  ],
  Sculptures: [
    'https://images.unsplash.com/photo-1561526608-f030a5a9a276',
    'https://images.unsplash.com/photo-1639435342381-7ed9e5eaa39d',
    'https://images.unsplash.com/photo-1632092306589-14288ec6e02a',
    'https://images.unsplash.com/photo-1699408562061-3935fab8b26e',
    'https://images.unsplash.com/photo-1662112577214-2ff58a6e8243',
    'https://images.unsplash.com/photo-1692293560491-6e26a165b0bc'
  ],
  Jewelry: [
    'https://images.unsplash.com/photo-1629212094419-82e3649aaf51',
    'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d',
    'https://images.unsplash.com/photo-1624157342892-ae7ae9466593',
    'https://images.unsplash.com/photo-1682823544362-b751e260e33c',
    'https://images.unsplash.com/photo-1692188668706-492e080bd71c',
    'https://images.unsplash.com/photo-1550118355-96e3157d1e08',
    'https://images.unsplash.com/photo-1678013970849-aa87e27bbf49',
    'https://images.unsplash.com/photo-1597441816027-7c38d6aa5686'
  ],
  Watches: [
    'https://images.unsplash.com/photo-1690220108593-3e1f8afb4d6b',
    'https://images.unsplash.com/photo-1600003014637-ff82a275e191',
    'https://images.unsplash.com/photo-1494287395193-32bc36247149',
    'https://images.unsplash.com/photo-1603035944709-d8b69bae588a',
    'https://images.unsplash.com/photo-1599860355291-5da2cc22e8d9',
    'https://images.unsplash.com/photo-1689599863333-28d062fddeec'
  ]
};

export const getImagesForCategory = (category) => {
  return CATEGORY_IMAGES[category] || [];
};

export const assignImagesToProducts = (products) => {
  const categoryCounters = {};
  
  return products.map(product => {
    const category = product.category;
    const images = getImagesForCategory(category);
    
    if (images.length === 0) return product;
    
    if (categoryCounters[category] === undefined) {
      categoryCounters[category] = 0;
    }
    
    const assignedImage = images[categoryCounters[category] % images.length];
    categoryCounters[category]++;
    
    return {
      ...product,
      image_url: assignedImage
    };
  });
};
