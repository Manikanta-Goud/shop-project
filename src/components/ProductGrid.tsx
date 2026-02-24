import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Eye, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

import { useProducts } from "@/hooks/useProducts";
import { useProductsRealtime } from "@/hooks/useProductsRealtime";


const sareeCategories = [
  { name: "All", color: "bg-gold-gradient" },
  { name: "Kanchipuram", color: "bg-crimson" },
  { name: "Banarasi", color: "bg-accent" },
  { name: "Pochampally", color: "bg-[#722F37]" },
  { name: "Chanderi", color: "bg-[#DAA520]" },
  { name: "Mysore Silk", color: "bg-[#4D1A1A]" },
];

const gajuluCategories = [
  { name: "All", color: "bg-gold-gradient" },
  { name: "Temple Gold", color: "bg-crimson" },
  { name: "Diamond Studded", color: "bg-accent" },
  { name: "Silk Thread", color: "bg-[#722F37]" },
  { name: "Glass Festive", color: "bg-[#DAA520]" },
  { name: "Silver Antique", color: "bg-[#4D1A1A]" },
];

const jewelryCategories = [
  { name: "All", color: "bg-gold-gradient" },
  { name: "Temple Jewelry", color: "bg-crimson" },
  { name: "Bridal Sets", color: "bg-accent" },
  { name: "Antique Gold", color: "bg-[#722F37]" },
  { name: "Diamond Heritage", color: "bg-[#DAA520]" },
];

const festivalCategories = [
  { name: "All", color: "bg-gold-gradient" },
  { name: "Diwali Special", color: "bg-crimson" },
  { name: "Sankranti Special", color: "bg-accent" },
  { name: "Ugadi Special", color: "bg-[#722F37]" },
  { name: "Wedding Season", color: "bg-[#DAA520]" },
];

const ProductGrid = ({ dark = false, type = "Saree" }: { dark?: boolean, type?: "Saree" | "Gajulu" | "Jewelry" | "Festival" }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [wishlist, setWishlist] = useState<number[]>([]);
  const navigate = useNavigate();
  const { user, setShowLoginModal } = useAuth();

  // Enable real-time updates for products
  useProductsRealtime();

  const categories =
    type === "Saree" ? sareeCategories :
      type === "Gajulu" ? gajuluCategories :
        type === "Jewelry" ? jewelryCategories :
          festivalCategories;

  const { data: supabaseProducts, isLoading } = useProducts(type, activeCategory);

  // Fetch wishlist from Supabase on load
  useEffect(() => {
    if (user) {
      const fetchWishlist = async () => {
        const { data, error } = await supabase
          .from("wishlist")
          .select("product_id")
          .eq("user_id", user.id);

        if (data && !error) {
          setWishlist(data.map(item => item.product_id));
        }
      };
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  // Use only live data from Supabase
  const displayProducts = supabaseProducts || [];

  const toggleWishlist = async (id: number) => {
    if (!user) {
      toast.info("Please login to admire and save your favorites ✦");
      setShowLoginModal(true);
      return;
    }

    const isLiked = wishlist.includes(id);

    if (isLiked) {
      // Remove from DB
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", id);

      if (!error) {
        setWishlist(prev => prev.filter(item => item !== id));
        toast.success("Removed from wishlist");
      }
    } else {
      // Add to DB
      const { error } = await supabase
        .from("wishlist")
        .insert([{ user_id: user.id, product_id: id }]);

      if (!error) {
        setWishlist(prev => [...prev, id]);
        toast.success("Saved to your royal wishlist ✿");
      } else {
        toast.error("Could not save to wishlist");
      }
    }
  };

  const handleAddToCart = async (id: number) => {
    if (!user) {
      toast.info("Please login to add items to your royal collection ✦");
      setShowLoginModal(true);
      return;
    }

    try {
      const { error } = await supabase
        .from("cart")
        .insert([{ user_id: user.id, product_id: id, quantity: 1 }]);

      if (error) {
        if (error.code === "23505") {
          toast.info("This masterpiece is already in your cart ✿");
        } else {
          throw error;
        }
      } else {
        toast.success("Added to cart! ✿");
      }
    } catch (error: any) {
      toast.error("Could not add to cart: " + error.message);
    }
  };


  return (
    <section className={`py-16 lg:py-20 ${dark ? 'text-primary-foreground' : 'text-primary'}`} id="products">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <h3 className={`font-cursive text-2xl mb-2 ${dark ? 'text-gold-light' : 'text-gold-dark'}`}>Handpicked for You</h3>
          <h2 className={`font-display text-3xl lg:text-4xl font-bold tracking-wider mb-6 ${dark ? 'text-primary-foreground' : 'text-primary'}`}>
            Our Exquisite Collection
          </h2>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-5 py-2 rounded-full font-display text-sm tracking-wider transition-all duration-300 shadow-sm ${activeCategory === cat.name
                  ? `${cat.color} text-white shadow-gold-md scale-105`
                  : dark
                    ? "border border-gold/40 text-gold-light hover:border-gold hover:bg-gold/10"
                    : "border border-gold/40 text-primary hover:border-gold hover:bg-gold/5"
                  }`}
              >
                {cat.name}
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
          {displayProducts?.map((product, index) => (
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
                <div 
                  className="aspect-[3/4] overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-3">
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="px-6 py-2.5 bg-gold-gradient rounded-full font-display text-xs font-bold text-accent-foreground tracking-wider uppercase shadow-gold-lg flex items-center gap-2"
                  >
                    <ShoppingBag size={14} />
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="px-6 py-2 border border-gold/60 rounded-full font-display text-xs text-gold tracking-wider uppercase flex items-center gap-2 hover:bg-gold/10 transition-colors"
                  >
                    <Eye size={14} />
                    View Details
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div 
                className="mt-4 text-center cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <h4 className={`font-display text-sm lg:text-base font-semibold ${dark ? 'text-primary-foreground' : 'text-primary'}`}>
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
