import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, ArrowLeft, Trash2, ShoppingCart, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Wishlist = () => {
    const { user, setShowLoginModal } = useAuth();
    const [wishlistItems, setWishlistItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchWishlist = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("wishlist")
                .select("id,product_id,products(*)")
                .eq("user_id", user.id);

            if (error) {
                console.error("Wishlist query error:", {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                });
                throw error;
            }
            setWishlistItems(data || []);
        } catch (error: any) {
            console.error("Error fetching wishlist:", error);
            toast.error("Failed to load your treasures");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setLoading(false);
        }
    }, [user]);

    const removeFromWishlist = async (id: string) => {
        try {
            const { error } = await supabase
                .from("wishlist")
                .delete()
                .eq("id", id);

            if (error) throw error;

            setWishlistItems(prev => prev.filter(item => item.id !== id));
            toast.success("Removed from wishlist");
        } catch (error: any) {
            toast.error("Failed to remove item");
        }
    };

    const addToCart = async (productId: string) => {
        if (!user) return;
        try {
            const { data: existingCart } = await supabase
                .from("cart")
                .select("id, quantity")
                .eq("user_id", user.id)
                .eq("product_id", productId)
                .maybeSingle();

            if (existingCart) {
                await supabase
                    .from("cart")
                    .update({ quantity: existingCart.quantity + 1 })
                    .eq("id", existingCart.id);
            } else {
                await supabase
                    .from("cart")
                    .insert({ user_id: user.id, product_id: productId, quantity: 1 });
            }
            toast.success("Added to cart! ✦");
        } catch (error) {
            toast.error("Failed to add to cart");
        }
    };

    if (!user && !loading) {
        return (
            <div className="min-h-screen bg-primary">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                    <Heart className="text-gold/20 w-24 h-24 mb-6" />
                    <h2 className="text-gold font-display text-3xl mb-4">Your Wishlist Awaits</h2>
                    <p className="text-gold-light/60 font-body mb-8 text-center max-w-sm">
                        Sign in to save your favorite pieces and build your dream collection.
                    </p>
                    <Button onClick={() => setShowLoginModal(true)} className="bg-gold-gradient px-8 py-6 h-auto text-lg uppercase font-display tracking-widest font-bold">
                        Sign In Now
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-primary">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-12 lg:py-20 mt-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <Button
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            className="text-gold hover:text-gold-light hover:bg-gold/10 p-0 mb-4 flex items-center gap-2"
                        >
                            <ArrowLeft size={18} /> Back
                        </Button>
                        <h1 className="text-4xl lg:text-5xl font-display text-gold font-bold uppercase tracking-widest">
                            My Wishlist
                        </h1>
                        <p className="text-gold-light/60 font-body italic mt-2">
                            A curated sanctuary of your favorite heritage pieces.
                        </p>
                    </div>
                    <div className="bg-secondary/40 border border-gold/20 px-6 py-4 rounded-2xl flex items-center gap-4">
                        <div className="text-center">
                            <span className="text-[10px] text-gold-light/40 uppercase tracking-widest block font-bold">Saved Treasures</span>
                            <span className="text-2xl font-display text-gold font-bold">{wishlistItems.length}</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-[3/4] rounded-2xl bg-secondary/20 animate-pulse border border-gold/10" />
                        ))}
                    </div>
                ) : wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                        <AnimatePresence mode="popLayout">
                            {wishlistItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card className="bg-secondary/30 border-gold/20 hover:border-gold/50 hover:shadow-gold-lg transition-all overflow-hidden group">
                                        <div className="aspect-[3/4] relative overflow-hidden">
                                            <img
                                                src={item.products.image}
                                                alt={item.products.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute top-3 right-3 flex flex-col gap-2">
                                                <Button
                                                    size="icon"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeFromWishlist(item.id);
                                                    }}
                                                    className="bg-black/40 hover:bg-red-500 text-white rounded-full h-10 w-10 border border-white/10 backdrop-blur-md"
                                                >
                                                    <Trash2 size={18} />
                                                </Button>
                                            </div>
                                            {item.products.tag && (
                                                <div className="absolute top-3 left-3 bg-gold-gradient px-3 py-1 rounded-full shadow-lg">
                                                    <span className="text-[10px] font-bold text-accent-foreground uppercase tracking-widest">
                                                        {item.products.tag}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <CardContent className="p-5">
                                            <div onClick={() => navigate(`/product/${item.product_id}`)} className="cursor-pointer">
                                                <h3 className="font-display text-lg text-primary-foreground font-bold line-clamp-1 mb-1">
                                                    {item.products.name}
                                                </h3>
                                                <p className="text-gold-light/50 text-[10px] uppercase tracking-widest font-bold mb-3">
                                                    {item.products.category}
                                                </p>
                                                <div className="flex items-center gap-3 mb-5">
                                                    <span className="text-gold font-bold text-xl font-display">{item.products.price}</span>
                                                    {item.products.original_price && (
                                                        <span className="text-gold-light/30 line-through text-sm">{item.products.original_price}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() => addToCart(item.product_id)}
                                                className="w-full bg-transparent border border-gold hover:bg-gold-gradient hover:text-accent-foreground text-gold font-display font-bold uppercase tracking-widest h-11 rounded-lg transition-all"
                                            >
                                                <ShoppingCart size={16} className="mr-2" /> Add to Cart
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-secondary/10 rounded-3xl border border-dashed border-gold/20">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="mb-6 inline-block opacity-20"
                        >
                            <Heart className="w-20 h-20 text-gold" />
                        </motion.div>
                        <h3 className="text-2xl font-display text-gold mb-3">Your Collection is Pure</h3>
                        <p className="text-gold-light/60 font-body mb-8">No favorites have been chosen yet. Explore our temple of sarees and jewelry.</p>
                        <Button onClick={() => navigate("/sarees")} className="bg-gold-gradient px-10 h-12 uppercase font-display font-bold tracking-widest">
                            Explore Treasures
                        </Button>
                    </div>
                )}

                {/* Related Suggestion */}
                {wishlistItems.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="mt-20 text-center"
                    >
                        <Sparkles className="text-gold mx-auto mb-4" />
                        <h2 className="text-2xl font-display text-gold mb-2 uppercase tracking-widest">Complete Your Look</h2>
                        <p className="text-gold-light/60 font-body italic">Add matching jewelry or bangles to your favorite sarees.</p>
                    </motion.div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Wishlist;
