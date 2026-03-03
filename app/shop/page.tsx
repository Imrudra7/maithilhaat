// src/app/shop/page.tsx (Logic Update)
'use client';

import React, { useState, useEffect } from 'react';
import SidebarFilter from '@/components/shop/SidebarFilter';
import ProductCard from '@/components/cards/ProductCard'; 
import { ChevronRight, SlidersHorizontal, Loader2, PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { productService } from '@/lib/services/product-service';
import { ProductResponse } from '@/types/product';

export default function ShopPage() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // Backend pe humne discuss kiya tha GET /product/api/public/all banane ka
        const data = await productService.getAllProducts(); 
        setProducts(data);
      } catch (err) {
        console.error("Products load fail!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs (Static as of now) */}
      <nav className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
        <span className="hover:text-primary cursor-pointer text-slate-600">Home</span>
        <ChevronRight size={12} />
        <span className="text-slate-900 font-black tracking-tighter">Shop All</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <SidebarFilter />
        </aside>

        <main className="flex-1">
          <div className="flex items-center justify-between mb-8 border-b pb-4">
            <h1 className="text-3xl font-black tracking-tighter text-slate-900">
              Browse Art <span className="text-sm font-normal text-slate-400 ml-2">({products.length} items)</span>
            </h1>
            <Button variant="outline" className="lg:hidden gap-2 rounded-xl font-bold border-2">
              <SlidersHorizontal size={18} /> Filters
            </Button>
          </div>

          {isLoading ? (
            <div className="h-[40vh] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="h-[40vh] flex flex-col items-center justify-center text-slate-400 gap-4 bg-slate-50 rounded-3xl border-2 border-dashed">
              <PackageOpen size={48} />
              <p className="font-bold">Bhai, abhi koi paintings nahi hain!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {products.map((product) => (
                // Humein ProductCard ko dynamic props ke sath pass karna hoga
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}