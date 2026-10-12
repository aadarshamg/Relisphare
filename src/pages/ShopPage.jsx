import React, { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Helmet } from 'react-helmet';
import { Filter, Search, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useDebounce } from '@/lib/utils';
import CategorySection from '@/components/CategorySection';

const BASE_CATEGORIES = ['Furniture', 'Coins', 'Paintings', 'Sculptures', 'Jewelry', 'Watches'];
const UNCATEGORIZED = 'Uncategorized';

const ShopPage = () => {
  const { products, productsError, loading, fetchProducts } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const debouncedMinPrice = useDebounce(minPriceInput, 500);
  const debouncedMaxPrice = useDebounce(maxPriceInput, 500);

  const cacheBuster = localStorage.getItem('imageCacheBuster') || '';

  const CATEGORIES = useMemo(() => {
    const list = [...BASE_CATEGORIES];
    (products || []).forEach((p) => {
      const cat = p.category?.trim() || UNCATEGORIZED;
      if (!list.some((c) => c.toLowerCase() === cat.toLowerCase())) list.push(cat);
    });
    return list;
  }, [products]);

  // Selected categories live in the URL so links like /shop?category=Coins work
  const selectedCategories = useMemo(() => {
    const fromUrl = searchParams.getAll('category').map((c) => c.toLowerCase());
    return CATEGORIES.filter((c) => fromUrl.includes(c.toLowerCase()));
  }, [searchParams, CATEGORIES]);

  const setSelectedCategories = useCallback(
    (categories) => {
      const next = new URLSearchParams(searchParams);
      next.delete('category');
      categories.forEach((c) => next.append('category', c));
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const handleCategoryChange = useCallback(
    (category) => {
      setSelectedCategories(
        selectedCategories.includes(category)
          ? selectedCategories.filter((c) => c !== category)
          : [...selectedCategories, category]
      );
    },
    [selectedCategories, setSelectedCategories]
  );

  const priceStats = useMemo(() => {
    if (!products || products.length === 0) return { min: 20000, max: 200000 };
    const prices = products.map((p) => p.price / 100);
    return {
      min: Math.max(20000, Math.floor(Math.min(...prices))),
      max: Math.min(200000, Math.ceil(Math.max(...prices)))
    };
  }, [products]);

  const groupedProducts = useMemo(() => {
    let filtered = products || [];

    if (debouncedSearchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          p.description?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
    }

    const currentMin = parseFloat(debouncedMinPrice) || 0;
    const currentMax = parseFloat(debouncedMaxPrice) || Infinity;

    if (currentMin > 0 || currentMax < Infinity) {
      filtered = filtered.filter((p) => {
        const priceInRupees = p.price / 100;
        return priceInRupees >= currentMin && (currentMax === Infinity || priceInRupees <= currentMax);
      });
    }

    const groups = {};
    const categoriesToShow = selectedCategories.length > 0 ? selectedCategories : CATEGORIES;

    categoriesToShow.forEach((cat) => {
      groups[cat] = [];
    });

    filtered.forEach((product) => {
      const bustedProduct = {
        ...product,
        image_url:
          product.image_url && cacheBuster && !product.image_url.startsWith('data:')
            ? `${product.image_url}${product.image_url.includes('?') ? '&' : '?'}v=${cacheBuster}`
            : product.image_url
      };

      const prodCat = bustedProduct.category?.trim() || UNCATEGORIZED;
      const match = categoriesToShow.find((c) => c.toLowerCase() === prodCat.toLowerCase());
      if (match) groups[match].push(bustedProduct);
    });

    return groups;
  }, [products, debouncedSearchTerm, selectedCategories, CATEGORIES, cacheBuster, debouncedMinPrice, debouncedMaxPrice]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setMinPriceInput('');
    setMaxPriceInput('');
  };

  const hasActiveFilters = Boolean(
    searchTerm || minPriceInput || maxPriceInput || selectedCategories.length
  );

  const renderFiltersPanel = (idPrefix) => (
    <div>
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 embassy-font border-b pb-2">
        <Filter className="w-5 h-5" /> Filters
      </h3>

      <div className="mb-6">
        <Label className="mb-2 block text-gray-700">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search treasures..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="mb-6">
        <Label className="mb-2 block text-gray-700">Price Range (INR)</Label>
        <div className="flex items-center gap-2 mb-2">
          <div className="relative flex-1">
            <IndianRupee className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
            <Input
              type="number"
              placeholder="Min"
              min="0"
              className="pl-8"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
            />
          </div>
          <span className="text-gray-400">-</span>
          <div className="relative flex-1">
            <IndianRupee className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
            <Input
              type="number"
              placeholder="Max"
              min="0"
              className="pl-8"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 px-1">
          <span>From INR {priceStats.min.toLocaleString('en-IN')}</span>
          <span>To INR {priceStats.max.toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="mb-6">
        <Label className="mb-3 block text-gray-700">Categories</Label>
        <div className="space-y-3">
          {CATEGORIES.map((cat) => {
            const checkboxId = `${idPrefix}-${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
            return (
              <div key={cat} className="flex items-center space-x-3">
                <Checkbox
                  id={checkboxId}
                  checked={selectedCategories.includes(cat)}
                  onCheckedChange={() => handleCategoryChange(cat)}
                />
                <label
                  htmlFor={checkboxId}
                  className="text-sm font-medium cursor-pointer text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {cat}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4 border-t mt-8">
        <Button
          variant="outline"
          className="w-full text-[#8B4513] border-[#8B4513] hover:bg-[#8B4513] hover:text-white transition-colors"
          onClick={resetFilters}
        >
          Reset All Filters
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF5EF] py-12">
      <Helmet>
        <title>Shop | Relicsphere</title>
        <meta name="description" content="E commerce stores for antique Shop" />
      </Helmet>

      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold text-[#2C2C2C] mb-8 text-center embassy-font">Our Collection</h1>

        <div className="lg:hidden mb-6 flex items-center gap-3">
          <Button
            variant="outline"
            className="text-[#8B4513] border-[#8B4513] hover:bg-[#8B4513] hover:text-white"
            onClick={() => setIsFilterSheetOpen(true)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              className="text-[#8B4513] hover:text-[#5C4033]"
              onClick={resetFilters}
            >
              Clear
            </Button>
          )}
        </div>

        <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
          <SheetContent side="left" className="w-[88vw] sm:max-w-sm overflow-y-auto bg-white">
            <SheetHeader className="mb-4">
              <SheetTitle className="text-[#2C2C2C]">Filters</SheetTitle>
            </SheetHeader>
            {renderFiltersPanel('mobile-filter')}
          </SheetContent>
        </Sheet>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-full lg:w-1/4 space-y-8 bg-white p-6 rounded-xl shadow-sm h-fit sticky top-24">
            {renderFiltersPanel('desktop-filter')}
          </aside>

          <main className="w-full lg:w-3/4 space-y-8">
            {productsError && products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-xl text-gray-600 mb-2">We couldn't load the collection right now.</p>
                <p className="text-sm text-gray-500 mb-4">Please check your connection and try again.</p>
                <Button variant="link" className="text-[#8B4513]" onClick={fetchProducts}>
                  Try again
                </Button>
              </div>
            ) : loading && products.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : Object.values(groupedProducts).every((group) => group.length === 0) ? (
              <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-xl text-gray-600 mb-4">No treasures found matching your criteria.</p>
                <Button variant="link" className="text-[#8B4513]" onClick={resetFilters}>
                  Clear filters
                </Button>
              </div>
            ) : (
              Object.entries(groupedProducts).map(([category, items]) =>
                items.length > 0 ? <CategorySection key={category} title={category} products={items} /> : null
              )
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
