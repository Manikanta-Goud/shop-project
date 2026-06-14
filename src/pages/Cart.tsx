import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, ShoppingCart, Sparkles, Shield, Truck, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Cart = () => {
    const { user, setShowLoginModal } = useAuth();
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCart = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("cart")
                .select("id,product_id,quantity,products(*)")
                .eq("user_id", user.id);

            if (error) {
                console.error("Cart query error:", {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                });
                throw error;
            }
            setCartItems(data || []);
        } catch (error: any) {
            console.error("Error fetching cart:", error);
            toast.error("Failed to load your cart");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setLoading(false);
        }
    }, [user]);

    const updateQuantity = async (id: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        try {
            const { error } = await supabase
                .from("cart")
                .update({ quantity: newQuantity })
                .eq("id", id);

            if (error) throw error;
            setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
        } catch (error: any) {
            toast.error("Failed to update quantity");
        }
    };

    const removeFromCart = async (id: string) => {
        try {
            const { error } = await supabase
                .from("cart")
                .delete()
                .eq("id", id);

            if (error) throw error;

            setCartItems(prev => prev.filter(item => item.id !== id));
            toast.success("Removed from cart");
        } catch (error: any) {
            toast.error("Failed to remove item");
        }
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => {
            const price = parseFloat(item.products.price.replace(/[₹,]/g, ''));
            return total + (price * item.quantity);
        }, 0);
    };

    const subtotal = calculateSubtotal();
    const shipping = subtotal > 5000 ? 0 : 499;
    const total = subtotal + shipping;

    const handleWhatsAppCheckout = () => {
        if (cartItems.length === 0) return;

        const phoneNumber = "9676998183";
        let message = `*NEW ORDER ALERT* 🛍️\n\nHi! I would like to purchase the following items from my cart:\n\n`;

        cartItems.forEach((item, index) => {
            const productLink = `${window.location.origin}/product/${item.product_id}`;
            message += `${index + 1}. *${item.products.name}*\n`;
            message += `   Quantity: ${item.quantity}\n`;
            message += `   Price: ${item.products.price}\n`;
            message += `   Link: ${productLink}\n\n`;
        });

        message += `*Order Summary:*\n`;
        message += `Subtotal: ₹${subtotal.toLocaleString('en-IN')}\n`;
        if (shipping > 0) message += `Shipping: ₹${shipping.toLocaleString('en-IN')}\n`;
        message += `*Total Amount: ₹${total.toLocaleString('en-IN')}*\n\n`;
        message += `Please confirm my order and share payment details!`;

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    if (!user && !loading) {
        return (
            <div className="min-h-screen bg-primary">
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                    <ShoppingBag className="text-gold/20 w-24 h-24 mb-6" />
                    <h2 className="text-gold font-display text-3xl mb-4">Your Shopping Bag is Empty</h2>
                    <p className="text-muted-foreground/60 font-body mb-8 text-center max-w-sm">
                        Sign in to view items in your cart and continue your heritage journey.
                    </p>
                    <Button onClick={() => setShowLoginModal(true)} className="bg-gold-gradient px-8 py-6 h-auto text-lg uppercase font-display tracking-widest font-bold">
                        Continue Shopping
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
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-gold/10 pb-8">
                    <div>
                        <Button
                            variant="ghost"
                            onClick={() => navigate(-1)}
                            className="text-gold hover:text-muted-foreground hover:bg-gold/10 p-0 mb-4 flex items-center gap-2"
                        >
                            <ArrowLeft size={18} /> Back
                        </Button>
                        <h1 className="text-4xl lg:text-5xl font-display text-gold font-bold uppercase tracking-widest">
                            My Shopping Bag
                        </h1>
                        <p className="text-muted-foreground/60 font-body italic mt-2">
                            Your treasures are ready for their new home.
                        </p>
                    </div>
                    <div className="bg-secondary/40 border border-gold/20 px-6 py-4 rounded-2xl flex items-center gap-4">
                        <div className="text-center">
                            <span className="text-[10px] text-muted-foreground/40 uppercase tracking-widest block font-bold">Basket Items</span>
                            <span className="text-2xl font-display text-gold font-bold">{cartItems.length}</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-6">
                        {[1, 2].map(i => (
                            <div key={i} className="h-40 rounded-2xl bg-secondary/20 animate-pulse border border-gold/10" />
                        ))}
                    </div>
                ) : cartItems.length > 0 ? (
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                        {/* Cart Items List */}
                        <div className="xl:col-span-8 space-y-6">
                            <AnimatePresence mode="popLayout">
                                {cartItems.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Card className="bg-secondary/30 border-gold/20 hover:border-gold/30 transition-all overflow-hidden">
                                            <CardContent className="p-4 sm:p-6">
                                                <div className="flex flex-col sm:flex-row gap-6">
                                                    <div className="w-full sm:w-32 h-40 rounded-xl overflow-hidden shadow-gold-sm flex-shrink-0 cursor-pointer" onClick={() => navigate(`/product/${item.product_id}`)}>
                                                        <img
                                                            src={item.products.image}
                                                            alt={item.products.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1 flex flex-col justify-between">
                                                        <div className="flex justify-between items-start gap-2">
                                                            <div className="cursor-pointer" onClick={() => navigate(`/product/${item.product_id}`)}>
                                                                <h3 className="font-display text-xl text-foreground-foreground font-bold leading-snug">
                                                                    {item.products.name}
                                                                </h3>
                                                                <p className="text-muted-foreground/50 text-xs uppercase tracking-widest font-bold mt-1">
                                                                    {item.products.category} • {item.products.type}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() => removeFromCart(item.id)}
                                                                className="text-muted-foreground/30 hover:text-red-500 transition-colors p-1"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>

                                                        <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                                                            <div className="flex items-center gap-3 border border-gold/30 rounded-full px-3 py-1.5 bg-primary/20 backdrop-blur-sm">
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                    className="text-gold hover:text-white transition-colors p-1"
                                                                >
                                                                    <Minus size={14} />
                                                                </button>
                                                                <span className="font-display font-bold text-lg text-foreground-foreground min-w-[20px] text-center">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                    className="text-gold hover:text-white transition-colors p-1"
                                                                >
                                                                    <Plus size={14} />
                                                                </button>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-gold font-display text-2xl font-bold">
                                                                    {item.products.price}
                                                                </p>
                                                                <p className="text-muted-foreground/40 text-[10px] italic">Price per unit</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10">
                                <div className="flex items-center gap-3 text-muted-foreground/60 p-4 border border-gold/10 rounded-2xl bg-secondary/10">
                                    <Shield size={20} className="text-gold" />
                                    <span className="font-body text-xs font-medium italic">Authenticity Certified</span>
                                </div>
                                <div className="flex items-center gap-3 text-muted-foreground/60 p-4 border border-gold/10 rounded-2xl bg-secondary/10">
                                    <Truck size={20} className="text-gold" />
                                    <span className="font-body text-xs font-medium italic">Divine Delivery</span>
                                </div>
                                <div className="flex items-center gap-3 text-muted-foreground/60 p-4 border border-gold/10 rounded-2xl bg-secondary/10">
                                    <RefreshCw size={20} className="text-gold" />
                                    <span className="font-body text-xs font-medium italic">Easy Exchange</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="xl:col-span-4 h-fit">
                            <Card className="bg-secondary/40 border-gold/30 shadow-gold-lg overflow-hidden sticky top-32">
                                <CardContent className="p-8">
                                    <h2 className="font-display text-2xl text-gold font-bold uppercase tracking-widest mb-6 border-b border-gold/10 pb-4">
                                        Summary
                                    </h2>

                                    <div className="space-y-4 font-body">
                                        <div className="flex justify-between items-center text-foreground-foreground/80">
                                            <span className="text-sm">Subtotal</span>
                                            <span className="font-display font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-foreground-foreground/80">
                                            <span className="text-sm">Temple Shipping</span>
                                            <span className="font-body text-xs italic">
                                                {shipping === 0 ? <span className="text-green-500">FREE</span> : `₹${shipping}`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-foreground-foreground/80">
                                            <span className="text-sm">Gifts & Packaging</span>
                                            <span className="font-body text-xs text-green-500 italic">Complementary</span>
                                        </div>
                                    </div>

                                    <Separator className="my-6 bg-gold/20" />

                                    <div className="flex justify-between items-end mb-8">
                                        <div>
                                            <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest font-bold mb-1">Total Treasury Investment</p>
                                            <p className="text-3xl font-display text-gold font-bold tracking-tight">
                                                ₹{total.toLocaleString('en-IN')}
                                            </p>
                                        </div>
                                    </div>

                                    <Button 
                                        onClick={handleWhatsAppCheckout}
                                        className="w-full bg-[#25D366] text-white font-display font-bold h-14 uppercase tracking-[0.2em] rounded-xl shadow-lg hover:shadow-xl hover:bg-[#128C7E] hover:scale-[1.02] transition-all"
                                    >
                                        Checkout via WhatsApp
                                    </Button>

                                    <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground/40 font-body text-[10px] uppercase tracking-widest">
                                        <Sparkles size={12} className="text-gold" />
                                        Earn {Math.floor(total / 100)} Loyalty Points
                                        <Sparkles size={12} className="text-gold" />
                                    </div>

                                    {shipping > 0 && (
                                        <p className="text-[10px] text-center text-muted-foreground/50 mt-4 italic">
                                            Add ₹{(5000 - subtotal).toLocaleString('en-IN')} more for FREE shipping
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-secondary/10 rounded-3xl border border-dashed border-gold/20">
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="mb-6 inline-block opacity-20"
                        >
                            <ShoppingBag className="w-20 h-20 text-gold" />
                        </motion.div>
                        <h3 className="text-2xl font-display text-gold mb-3">Your Journey Hasn't Begun</h3>
                        <p className="text-muted-foreground/60 font-body mb-8">Your cart feels a bit light. Let's add some royal heritage.</p>
                        <Button onClick={() => navigate("/sarees")} className="bg-gold-gradient px-10 h-12 uppercase font-display font-bold tracking-widest">
                            Shop Collections
                        </Button>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Cart;
