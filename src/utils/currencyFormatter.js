
export const formatINR = (priceInPaise) => {
  if (priceInPaise === null || priceInPaise === undefined) return '';
  // Ensure strict bounding if needed, though DB should handle it.
  const price = Number(priceInPaise) / 100;
  return new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR', 
    currencyDisplay: 'symbol',
    maximumFractionDigits: 0 
  }).format(price);
};

export const formatRupees = (priceInRupees) => {
  if (priceInRupees === null || priceInRupees === undefined) return '';
  return new Intl.NumberFormat('en-IN', { 
    style: 'currency', 
    currency: 'INR',
    currencyDisplay: 'symbol', 
    maximumFractionDigits: 2 
  }).format(Number(priceInRupees));
};
