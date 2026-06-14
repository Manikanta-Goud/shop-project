import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useOffers } from "@/hooks/useOffers";
import { Tag, Clock, Flame, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Offers = () => {
    const navigate = useNavigate();
    const { data: offers = [], isLoading } = useOffers();
    const [selectedCategory, setSelectedCategory] = useState<string>("All");

    const activeOffers = offers.filter(offer => offer.is_active);
    
    const filteredOffers = selectedCategory === "All" 
        ? activeOffers 
        : activeOffers.filter(offer => offer.category === selectedCategory);

    const categories = ["All", ...Array.from(new Set(activeOffers.map(offer => offer.category)))];

    return (
        <div className="min-h-screen bg-primary">
            <Navbar />
            <main className="pt-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-w-7xl mx-auto px-4 py-12"
                >
                    {/* Header */}
                    <header className="text-center mb-16">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Flame className="text-gold animate-glow-pulse" size={32} />
                            <h1 className="font-display text-4xl lg:text-6xl text-gold uppercase tracking-[0.2em]">
                                Special Offers
                            </h1>
                            <Flame className="text-gold animate-glow-pulse" size={32} />
                        </div>
                        <p className="font-body text-muted-foreground/80 max-w-2xl mx-auto italic text-lg">
                            Exclusive deals and limited-time promotions on our finest collections.
                            Don't miss out on these incredible offers!
                        </p>
                    </header>

                    {/* Category Filter */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2.5 rounded-full font-display text-sm uppercase tracking-wider transition-all
                                    ${selectedCategory === category
                                        ? "bg-gold-gradient text-accent-foreground shadow-gold-md"
                                        : "bg-secondary/40 text-muted-foreground border border-gold/20 hover:border-gold/50"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gold border-t-transparent"></div>
                            <p className="text-muted-foreground mt-4 font-body">Loading divine offers...</p>
                        </div>
                    )}

                    {/* No Offers State */}
                    {!isLoading && filteredOffers.length === 0 && (
                        <div className="text-center py-20">
                            <Tag className="mx-auto text-muted-foreground/20 mb-4" size={64} />
                            <h3 className="font-display text-2xl text-muted-foreground/60 mb-2">No Offers Available</h3>
                            <p className="text-muted-foreground/40 font-body">Check back soon for exciting deals!</p>
                        </div>
                    )}

                    {/* Offers Grid */}
                    {!isLoading && filteredOffers.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredOffers.map((offer, index) => (
                                <motion.div
                                    key={offer.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="group bg-secondary/40 border border-gold/20 rounded-xl overflow-hidden hover:border-gold/50 hover:shadow-gold-lg transition-all duration-500 cursor-pointer"
                                    onClick={() => offer.product_id && navigate(`/product/${offer.product_id}`)}
                                >
                                    {/* Image */}
                                    <div className="relative aspect-square overflow-hidden">
                                        <img
                                            src={offer.image}
                                            alt={offer.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        {/* Badges */}
                                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                                            {offer.tag && (
                                                <span className="px-3 py-1 bg-gold-gradient text-accent-foreground text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                                                    {offer.tag}
                                                </span>
                                            )}
                                            {offer.discount_percentage && offer.discount_percentage > 0 && (
                                                <span className="px-3 py-1 bg-crimson text-foreground-foreground text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                                                    {offer.discount_percentage}% OFF
                                                </span>
                                            )}
                                        </div>
                                        {offer.is_featured && (
                                            <div className="absolute top-3 right-3">
                                                <Star className="text-gold fill-gold animate-pulse" size={24} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className="font-display text-lg font-bold text-foreground-foreground leading-tight">
                                                {offer.title}
                                            </h3>
                                        </div>
                                        
                                        {offer.description && (
                                            <p className="text-muted-foreground/60 font-body text-sm mb-3 line-clamp-2">
                                                {offer.description}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-[10px] px-2.5 py-1 bg-gold/10 text-gold border border-gold/20 rounded uppercase tracking-wider font-bold">
                                                {offer.category}
                                            </span>
                                            {offer.stock_count > 0 && offer.stock_count <= 10 && (
                                                <span className="text-[10px] px-2.5 py-1 bg-crimson/20 text-crimson border border-crimson/30 rounded uppercase tracking-wider font-bold">
                                                    Only {offer.stock_count} left
                                                </span>
                                            )}
                                        </div>

                                        {/* Countdown */}
                                        {offer.countdown_end && new Date(offer.countdown_end) > new Date() && (
                                            <div className="flex items-center gap-2 mb-3 text-blue-400 text-xs">
                                                <Clock size={14} />
                                                <span className="font-body">
                                                    Ends: {new Date(offer.countdown_end).toLocaleDateString('en-IN', { 
                                                        month: 'short', 
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        )}

                                        {/* Price */}
                                        <div className="flex items-baseline gap-3 mb-4">
                                            <span className="font-display text-2xl font-bold text-gold">
                                                {offer.price}
                                            </span>
                                            {offer.original_price && (
                                                <span className="font-body text-sm text-muted-foreground/40 line-through">
                                                    {offer.original_price}
                                                </span>
                                            )}
                                        </div>

                                        {/* CTA Button */}
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (offer.product_id) {
                                                  navigate(`/product/${offer.product_id}`);
                                                }
                                            }}
                                            className="w-full py-3 bg-gold-gradient rounded-full font-display text-sm font-bold text-accent-foreground tracking-wider uppercase shadow-gold hover:shadow-gold-lg hover:scale-[1.02] transition-all"
                                        >
                                            Shop Now
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Info Section */}
                    {!isLoading && filteredOffers.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-16 text-center bg-secondary/20 border border-gold/20 rounded-2xl p-8"
                        >
                            <h3 className="font-display text-2xl text-gold mb-3 uppercase tracking-wider">
                                Limited Time Only
                            </h3>
                            <p className="font-body text-muted-foreground/70 max-w-2xl mx-auto">
                                These exclusive offers won't last forever. Grab your favorites while stocks last 
                                and elevate your wardrobe with our handpicked collection of traditional elegance.
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default Offers;
