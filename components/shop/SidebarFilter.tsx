// src/components/shop/SidebarFilter.tsx
import { useEffect, useState } from 'react';
import { productService } from '@/lib/services/product-service';
import { CategoryResponse } from '@/types/product';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

export default function SidebarFilter() {
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await productService.getCategoryTree();
        setCategories(data);
      } catch (err) {
        console.error("Categories load fail!");
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Categories</h3>
        {loading ? <Loader2 className="animate-spin text-primary" /> : (
          <div className="space-y-3">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center gap-2">
                <Checkbox id={cat.id} />
                <label htmlFor={cat.id} className="text-sm font-bold text-slate-600 cursor-pointer hover:text-primary transition-colors">
                  {cat.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}