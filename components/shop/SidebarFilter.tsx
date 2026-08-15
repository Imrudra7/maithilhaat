// src/components/shop/SidebarFilter.tsx
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { productService } from '@/lib/services/product-service';
import { CategoryResponse } from '@/types/product';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, SlidersHorizontal } from 'lucide-react';

export default function SidebarFilter() {
  const searchParams = useSearchParams();
  const selectedCategoryId = searchParams.get('categoryId');
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await productService.getCategoryTree();
        setCategories(data);
      } catch (error) {
        console.error("Categories load fail!", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-5 flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-black uppercase tracking-widest text-stone-500">Categories</h3>
        </div>
        {loading ? <Loader2 className="animate-spin text-primary" /> : (
          <div className="space-y-3">
            <Link
              href="/shop"
              className={`mh-tab-option mh-press flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors hover:bg-[#fff8e7]/70 ${!selectedCategoryId ? 'border-primary/15 bg-primary/10 text-primary' : 'border-transparent bg-white/20'}`}
              data-active={!selectedCategoryId}
            >
              <Checkbox id="all-products" checked={!selectedCategoryId} />
              <label htmlFor="all-products" className="text-sm font-bold text-stone-600 cursor-pointer hover:text-primary transition-colors">
                All Products
              </label>
            </Link>
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/shop?categoryId=${cat.id}`}
                className={`mh-tab-option mh-press flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors hover:bg-[#fff8e7]/70 ${selectedCategoryId === cat.id ? 'border-primary/15 bg-primary/10 text-primary' : 'border-transparent bg-white/20'}`}
                data-active={selectedCategoryId === cat.id}
              >
                <Checkbox id={cat.id} checked={selectedCategoryId === cat.id} />
                <label htmlFor={cat.id} className="text-sm font-bold text-stone-600 cursor-pointer hover:text-primary transition-colors">
                  {cat.name}
                </label>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
