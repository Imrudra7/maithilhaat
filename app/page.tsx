import Hero from "@/components/sections/Hero";
import QuickCategories from "@/components/sections/QuickCategories";
import FeaturedProducts from "@/components/sections/FeaturedProducts";

export default function Home() {
  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* 1. Hero Banner */}
      <Hero />

      {/* 2. Quick Categories (Instamart Style) */}
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-2xl font-black mb-6 tracking-tight">
          Explore by Category
        </h2>
        <QuickCategories />
      </div>

      {/* 3. Featured Products */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-black tracking-tight">
            Trending in MaithilHaat
          </h2>
          <button className="text-primary font-bold text-sm hover:underline">
            View All
          </button>
        </div>
        <FeaturedProducts />
      </div>
    </div>
  );
}