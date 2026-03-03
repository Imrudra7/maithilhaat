// src/components/sections/QuickCategories.tsx
'use client';

import React from 'react';
import Link from 'next/link';

// Mock Data: Baad mein ise tum apne Backend (ENV URL) se fetch karoge
const categories = [
  { id: 1, name: 'Paintings', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=60&w=500', href: '/category/paintings' },
  { id: 2, name: 'Sarees', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=60&w=500', href: '/category/sarees' },
  { id: 3, name: 'Home Decor', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=60&w=500', href: '/category/home-decor' },
  { id: 4, name: 'Kitchen', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=60&w=500', href: '/category/kitchen' },
  { id: 5, name: 'Wall Art', image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=60&w=500', href: '/category/wall-art' },
  { id: 6, name: 'Gifts', image: 'https://images.unsplash.com/photo-1549465220-1d8c9d9c6703?auto=format&fit=crop&q=60&w=500', href: '/category/gifts' },
  { id: 7, name: 'Handloom', image: 'https://images.unsplash.com/photo-1617143777034-fe4c261ac738?auto=format&fit=crop&q=60&w=500', href: '/category/handloom' },
];

export default function QuickCategories() {
  return (
    <div className="flex flex-nowrap md:flex-wrap gap-6 md:gap-10 overflow-x-auto pb-4 md:pb-0 no-scrollbar">
      {categories.map((cat) => (
        <Link 
          key={cat.id} 
          href={cat.href} 
          className="group flex flex-col items-center gap-3 min-w-[80px] md:min-w-[100px]"
        >
          {/* Circle Image Container */}
          <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all duration-300 shadow-md group-hover:shadow-xl">
            <img 
              src={cat.image} 
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          
          {/* Category Name */}
          <span className="text-xs md:text-sm font-bold text-slate-700 group-hover:text-primary transition-colors text-center leading-tight">
            {cat.name}
          </span>
        </Link>
      ))}
    </div>
  );
}