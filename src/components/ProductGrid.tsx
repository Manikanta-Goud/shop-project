import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Eye, ShoppingBag } from "lucide-react";

import sareeRed from "@/assets/saree-red-gold.jpg";
import sareeBlue from "@/assets/saree-blue-gold.jpg";
import sareeGreen from "@/assets/saree-green-gold.jpg";
import sareePurple from "@/assets/saree-purple-gold.jpg";
import sareeOrange from "@/assets/saree-orange-gold.jpg";
import sareeBridal from "@/assets/bridal-collection.jpg";

const products = [
  { id: 1, name: "Royal Kanchipuram Silk", price: "₹12,999", originalPrice: "₹18,500", image: sareeRed, tag: "Bestseller", category: "Wedding" },
  { id: 2, name: "Royal Banarasi Blue", price: "₹9,999", originalPrice: "₹14,000", image: sareeBlue, tag: "New", category: "Festival" },
  { id: 3, name: "Emerald Pochampally Ikat", price: "₹7,499", originalPrice: "₹10,500", image: sareeGreen, tag: null, category: "Casual" },
  { id: 4, name: "Mysore Purple Heritage", price: "₹11,499", originalPrice: "₹16,000", image: sareePurple, tag: "Limited", category: "Wedding" },
  { id: 5, name: "Saffron Chanderi Silk", price: "₹8,999", originalPrice: "₹12,500", image: sareeOrange, tag: "Trending", category: "Festival" },
  { id: 6, name: "Bridal Dream Collection", price: "₹24,999", originalPrice: "₹35,000", image: sareeBridal, tag: "Exclusive", category: "Bridal" },
];

const categories = ["All", "Wedding", "Bridal", "Festival", "Casual"];

const ProductGrid = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [wishlist, setWishlist] = useState<number[]>([]);

  const filtered = activeCategory === "All"
    ? products
    : products.filter((p) => p.category === activeCategory);

  const toggleWishlist = (id: number) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-16 lg:py-20" id="products">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h3 className="font-cursive text-gold-dark text-2xl mb-2">Handpicked for You</h3>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-primary tracking-wider mb-6">
            Our Exquisite Collection
          </h2>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full font-display text-sm tracking-wider transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-gold-gradient text-accent-foreground shadow-gold"
                    : "border border-gold/40 text-primary hover:border-gold hover:bg-gold/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gold divider */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          <span className="text-gold text-lg">✿</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
          {filtered.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative overflow-hidden rounded-lg scalloped-border bg-background">
                {/* Tag */}
                {product.tag && (
                  <div className="absolute top-3 left-3 z-10 bg-gold-gradient px-3 py-1 rounded-full">
                    <span className="font-display text-[10px] font-bold text-accent-foreground tracking-wider uppercase">
                      {product.tag}
                    </span>
                  </div>
                )}

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
                >
                  <Heart
                    size={16}
                    className={wishlist.includes(product.id) ? "fill-crimson text-crimson" : "text-muted-foreground"}
                  />
                </button>

                {/* Image */}
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-3">
                  <button className="px-6 py-2.5 bg-gold-gradient rounded-full font-display text-xs font-bold text-accent-foreground tracking-wider uppercase shadow-gold-lg flex items-center gap-2">
                    <ShoppingBag size={14} />
                    Add to Cart
                  </button>
                  <button className="px-6 py-2 border border-gold/60 rounded-full font-display text-xs text-gold tracking-wider uppercase flex items-center gap-2 hover:bg-gold/10 transition-colors">
                    <Eye size={14} />
                    Quick View
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="mt-4 text-center">
                <h4 className="font-display text-sm lg:text-base font-semibold text-primary">
                  {product.name}
                </h4>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="font-display text-base lg:text-lg font-bold text-crimson">
                    {product.price}
                  </span>
                  <span className="font-body text-sm text-muted-foreground line-through">
                    {product.originalPrice}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <a
            href="#"
            className="inline-block px-10 py-3 border-2 border-gold rounded-full font-display text-sm font-semibold tracking-wider text-gold hover:bg-gold/10 transition-colors uppercase"
          >
            View All Collections
          </a>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
