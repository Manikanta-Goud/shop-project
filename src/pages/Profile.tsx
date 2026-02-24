import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, ShoppingBag, Heart, Settings, LogOut, ChevronRight, Award, Save, X, ArrowLeft, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
    const { user, profile, setProfile, signOut, setShowLoginModal } = useAuth();
    const [wishlistCount, setWishlistCount] = useState(0);
    const [ordersCount, setOrdersCount] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [wishlistItems, setWishlistItems] = useState<any[]>([]);
    const [cartItems, setCartItems] = useState<any[]>([]);

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        full_name: "",
        phone: "",
        address: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            return;
        }

        const fetchData = async () => {
            setLoading(true);

            // Fetch counts
            const { count: wCount } = await supabase.from("wishlist").select("*", { count: 'exact', head: true }).eq("user_id", user.id);
            const { count: oCount } = await supabase.from("orders").select("*", { count: 'exact', head: true }).eq("user_id", user.id);
            const { count: cCount } = await supabase.from("cart").select("*", { count: 'exact', head: true }).eq("user_id", user.id);

            setWishlistCount(wCount || 0);
            setOrdersCount(oCount || 0);
            setCartCount(cCount || 0);

            // Fetch recent orders
            const { data: oData } = await supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3);
            setRecentOrders(oData || []);

            // Fetch wishlist items with product details
            const { data: wishlistData } = await supabase
                .from("wishlist")
                .select(`
                    id,
                    product_id,
                    products (*)
                `)
                .eq("user_id", user.id);
            
            setWishlistItems(wishlistData || []);

            // Fetch cart items with product details
            const { data: cartData } = await supabase
                .from("cart")
                .select(`
                    id,
                    product_id,
                    quantity,
                    products (*)
                `)
                .eq("user_id", user.id);
            
            setCartItems(cartData || []);

            setLoading(false);
        };

        fetchData();
        if (profile) {
            setEditForm({
                full_name: profile.full_name || "",
                phone: profile.phone || "",
                address: profile.address || "",
            });
        }
    }, [user, profile]);

    const handleSave = async () => {
        try {
            const { error } = await supabase
                .from("profiles")
                .update({
                    full_name: editForm.full_name,
                    phone: editForm.phone,
                    address: editForm.address,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", user?.id);

            if (error) throw error;

            setProfile({ ...profile, ...editForm });
            setIsEditDialogOpen(false);
            toast.success("Profile completed successfully! Welcome to Sri Durga Sarees!");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-primary">
                <Navbar />
                <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        className="text-center max-w-md w-full"
                    >
                        {/* Decorative Om Symbol */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="mb-8"
                        >
                            <span className="text-7xl md:text-8xl text-gold inline-block italic drop-shadow-gold">ॐ</span>
                        </motion.div>

                        {/* Heading */}
                        <motion.h2 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-gold font-display text-3xl md:text-4xl mb-4 italic tracking-wide"
                        >
                            Awaiting Your<br />Presence
                        </motion.h2>

                        {/* Description */}
                        <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-gold-light/70 font-body mb-10 text-base md:text-lg leading-relaxed"
                        >
                            Please sign in to view your royal profile and access your precious collection
                        </motion.p>

                        {/* Sign In Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Button 
                                onClick={() => setShowLoginModal(true)} 
                                className="bg-gold-gradient hover:shadow-gold-lg text-accent-foreground font-bold font-display uppercase tracking-[0.15em] px-10 md:px-12 h-14 text-base md:text-lg rounded-xl transition-all hover:scale-105 w-full sm:w-auto"
                            >
                                Sign In
                            </Button>
                        </motion.div>

                        {/* Decorative Elements */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-12 flex items-center justify-center gap-3 text-gold/30"
                        >
                            <div className="h-px w-16 bg-gold/20"></div>
                            <User className="w-5 h-5" />
                            <div className="h-px w-16 bg-gold/20"></div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        );
    }



    return (
        <div className="min-h-screen bg-primary">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 py-12 lg:py-20 mt-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/")}
                        className="text-gold hover:text-gold-light hover:bg-gold/10 font-body text-sm flex items-center gap-2 p-0"
                    >
                        <ArrowLeft size={18} /> Back to Home
                    </Button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                    {/* Sidebar / Profile Summary */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="bg-secondary/30 border-gold/20 shadow-gold-sm overflow-hidden">
                            <div className="h-24 bg-gradient-to-r from-secondary-dark to-primary relative">
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/mandala.png')]" />
                            </div>
                            <CardContent className="relative pt-0 px-6 pb-8">
                                <div className="flex justify-center -mt-12 mb-4">
                                    <Avatar className="w-24 h-24 border-4 border-primary shadow-gold-md">
                                        <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || ""} />
                                        <AvatarFallback className="bg-primary text-gold text-xl font-display">
                                            {(profile?.full_name || user?.email || "U").slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="text-center">
                                    <h2 className="text-2xl font-display text-primary-foreground font-bold">{profile?.full_name || "Guest User"}</h2>
                                    <p className="text-gold-light text-sm font-body mt-1 flex items-center justify-center gap-2">
                                        <Award size={14} /> Royal Heritage Member
                                    </p>
                                </div>

                                <Separator className="my-6 bg-gold/10" />

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-primary-foreground/80">
                                        <Mail size={18} className="text-gold" />
                                        <span className="text-sm font-body">{user?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-primary-foreground/80">
                                        <Phone size={18} className="text-gold" />
                                        <span className="text-sm font-body">{profile?.phone || "Not set"}</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-primary-foreground/80">
                                        <MapPin size={18} className="text-gold mt-1" />
                                        <span className="text-sm font-body">{profile?.address || "Not set"}</span>
                                    </div>
                                </div>

                                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button
                                            className="w-full mt-8 bg-gold hover:bg-gold-light text-secondary font-display uppercase tracking-widest font-bold h-11"
                                        >
                                            Edit Profile
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-secondary border-gold/30 text-primary-foreground sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle className="font-display text-gold text-2xl">Edit Your Profile</DialogTitle>
                                        </DialogHeader>
                                        <div className="grid gap-6 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="name" className="text-gold-light font-body uppercase tracking-widest text-xs">Full Name</Label>
                                                <Input
                                                    id="name"
                                                    value={editForm.full_name}
                                                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                                                    className="bg-primary/50 border-gold/20 text-primary-foreground focus:border-gold"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="phone" className="text-gold-light font-body uppercase tracking-widest text-xs">Phone Number</Label>
                                                <Input
                                                    id="phone"
                                                    value={editForm.phone}
                                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                    className="bg-primary/50 border-gold/20 text-primary-foreground focus:border-gold"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="address" className="text-gold-light font-body uppercase tracking-widest text-xs">Address</Label>
                                                <Input
                                                    id="address"
                                                    value={editForm.address}
                                                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                                    className="bg-primary/50 border-gold/20 text-primary-foreground focus:border-gold"
                                                />
                                            </div>
                                        </div>
                                        <DialogFooter className="gap-2">
                                            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-gold/20 text-gold hover:bg-gold/10">
                                                Cancel
                                            </Button>
                                            <Button onClick={handleSave} className="bg-gold hover:bg-gold-light text-secondary font-bold">
                                                <Save className="mr-2" size={16} /> Save Changes
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-2 gap-4">
                            <Card className="bg-secondary/30 border-gold/20 p-4 text-center">
                                <Heart className="mx-auto text-accent mb-2" size={20} />
                                <p className="text-2xl font-display text-primary-foreground">{wishlistCount}</p>
                                <p className="text-[10px] uppercase tracking-wider text-gold-light font-body">Wishlist</p>
                            </Card>
                            <Card className="bg-secondary/30 border-gold/20 p-4 text-center">
                                <ShoppingBag className="mx-auto text-gold mb-2" size={20} />
                                <p className="text-2xl font-display text-primary-foreground">{cartCount}</p>
                                <p className="text-[10px] uppercase tracking-wider text-gold-light font-body">In Cart</p>
                            </Card>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Loyalty Program Section */}
                        <Card className="bg-gradient-to-br from-secondary/50 to-primary border-gold/30 shadow-gold-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Award size={120} className="text-gold" />
                            </div>
                            <CardHeader>
                                <CardTitle className="font-display text-gold text-xl uppercase tracking-[0.2em]">Loyalty Rewards</CardTitle>
                                <CardDescription className="text-primary-foreground/60 font-body">Your heritage points and exclusive benefits</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-sm text-gold-light font-body uppercase tracking-widest mb-1">Available Points</p>
                                        <p className="text-4xl font-display text-primary-foreground font-bold">{profile?.loyalty_points || 0}</p>
                                    </div>
                                    <Button variant="outline" className="border-gold/30 text-gold hover:bg-gold/10 font-body text-xs uppercase tracking-widest h-10 px-6">
                                        Redeem Points
                                    </Button>
                                </div>
                                <div className="mt-6 w-full h-2 bg-secondary rounded-full overflow-hidden">
                                    <div className="h-full bg-gold" style={{ width: `${(profile?.loyalty_points || 0) % 100}%` }} />
                                </div>
                                <p className="text-[10px] text-primary-foreground/40 mt-2 font-body italic text-right">
                                    {100 - ((profile?.loyalty_points || 0) % 100)} points more to reach next tier
                                </p>
                            </CardContent>
                        </Card>

                        {/* Recent Activities */}
                        <div className="space-y-4">
                            <h3 className="font-display text-primary-foreground text-xl flex items-center gap-2">
                                <ShoppingBag className="text-gold" size={20} /> Recent Orders
                            </h3>
                            <div className="space-y-4">
                                {recentOrders.length > 0 ? recentOrders.map((order) => (
                                    <Card key={order.id} className="bg-secondary/20 border-gold/10 hover:border-gold/30 transition-all group">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded bg-primary flex items-center justify-center text-gold border border-gold/20">
                                                    <ShoppingBag size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-primary-foreground font-display text-sm font-semibold">Order #{order.id.slice(0, 8)}</p>
                                                    <p className="text-[10px] text-primary-foreground/60 font-body uppercase tracking-wider">
                                                        {new Date(order.created_at).toLocaleDateString()} • {order.status}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-gold font-display text-sm font-bold">{order.total_amount}</p>
                                                <p className="text-[10px] text-accent font-body uppercase tracking-widest">{order.status}</p>
                                            </div>
                                            <ChevronRight size={16} className="text-gold/50 group-hover:translate-x-1 transition-transform" />
                                        </CardContent>
                                    </Card>
                                )) : (
                                    <Card className="bg-secondary/20 border-gold/10 p-12 text-center italic text-primary-foreground/40 font-body">
                                        No orders found yet. Start your royal journey!
                                    </Card>
                                )}
                            </div>
                            <Button variant="link" className="text-gold-light hover:text-gold font-body text-sm p-0 flex items-center gap-2">
                                View all orders <ChevronRight size={14} />
                            </Button>
                        </div>

                        {/* Wishlist Section */}
                        <div className="space-y-4">
                            <h3 className="font-display text-primary-foreground text-xl flex items-center gap-2">
                                <Heart className="text-accent" size={20} /> My Wishlist ({wishlistCount})
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {wishlistItems.length > 0 ? wishlistItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        whileHover={{ y: -5 }}
                                        onClick={() => navigate(`/product/${item.product_id}`)}
                                        className="cursor-pointer group"
                                    >
                                        <Card className="bg-secondary/20 border-gold/10 hover:border-gold/30 transition-all overflow-hidden">
                                            <div className="aspect-square relative overflow-hidden">
                                                <img
                                                    src={item.products.image}
                                                    alt={item.products.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <CardContent className="p-3">
                                                <h4 className="text-primary-foreground font-display font-semibold text-sm line-clamp-1">
                                                    {item.products.name}
                                                </h4>
                                                <p className="text-gold font-bold mt-1 text-sm">{item.products.price}</p>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                )) : (
                                    <Card className="col-span-full bg-secondary/20 border-gold/10 p-12 text-center italic text-primary-foreground/40 font-body">
                                        Your wishlist is empty. Start adding favorites!
                                    </Card>
                                )}
                            </div>
                        </div>

                        {/* Cart Section */}
                        <div className="space-y-4">
                            <h3 className="font-display text-primary-foreground text-xl flex items-center gap-2">
                                <ShoppingCart className="text-gold" size={20} /> My Cart ({cartCount})
                            </h3>
                            <div className="space-y-3">
                                {cartItems.length > 0 ? cartItems.map((item) => (
                                    <Card
                                        key={item.id}
                                        onClick={() => navigate(`/product/${item.product_id}`)}
                                        className="bg-secondary/20 border-gold/10 hover:border-gold/30 transition-all cursor-pointer"
                                    >
                                        <CardContent className="p-4 flex items-center gap-4">
                                            <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item.products.image}
                                                    alt={item.products.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-primary-foreground font-display font-semibold">
                                                    {item.products.name}
                                                </h4>
                                                <p className="text-gold-light/60 text-xs mt-1 font-body">
                                                    {item.products.type} • {item.products.category}
                                                </p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className="text-gold font-bold">{item.products.price}</span>
                                                    <span className="text-xs text-primary-foreground/60">Qty: {item.quantity}</span>
                                                </div>
                                            </div>
                                            <ChevronRight size={16} className="text-gold/50" />
                                        </CardContent>
                                    </Card>
                                )) : (
                                    <Card className="bg-secondary/20 border-gold/10 p-12 text-center italic text-primary-foreground/40 font-body">
                                        Your cart is empty. Start shopping!
                                    </Card>
                                )}
                            </div>
                        </div>

                        {/* Account Settings Shortcut */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="bg-secondary/20 border-gold/10 p-6 flex flex-col items-center justify-center text-center hover:border-gold/30 transition-all cursor-pointer">
                                <Settings className="text-gold mb-3" size={28} />
                                <h4 className="text-primary-foreground font-display font-bold">Preferences</h4>
                                <p className="text-xs text-primary-foreground/60 font-body mt-1">Manage notifications and language</p>
                            </Card>
                            <Card
                                onClick={signOut}
                                className="bg-secondary/20 border-gold/10 p-6 flex flex-col items-center justify-center text-center hover:border-accent/30 transition-all cursor-pointer"
                            >
                                <LogOut className="text-accent mb-3" size={28} />
                                <h4 className="text-primary-foreground font-display font-bold">Sign Out</h4>
                                <p className="text-xs text-primary-foreground/60 font-body mt-1">Safely exit your session</p>
                            </Card>
                        </div>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default Profile;
