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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
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
                            <div className="h-24 bg-secondary/40 relative">
                                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/mandala.png')]" />
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
                                    <h2 className="text-2xl font-display text-foreground font-bold">{profile?.full_name || "Guest User"}</h2>
                                    <p className="text-gold/70 text-sm font-body mt-1 flex items-center justify-center gap-2">
                                        <Award size={14} /> Royal Heritage Member
                                    </p>
                                </div>

                                <Separator className="my-6 bg-gold/10" />

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <Mail size={18} className="text-gold/70" />
                                        <span className="text-sm font-body">{user?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <Phone size={18} className="text-gold/70" />
                                        <span className="text-sm font-body">{profile?.phone || "Not set"}</span>
                                    </div>
                                    <div className="flex items-start gap-3 text-muted-foreground">
                                        <MapPin size={18} className="text-gold/70 mt-1" />
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
                                            <DialogDescription className="text-gold-light/40 font-body text-xs italic">
                                                Update your details to personalize your royal membership experience.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-6 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="name" className="text-gold/70 font-body uppercase tracking-widest text-xs">Full Name</Label>
                                                <Input
                                                    id="name"
                                                    value={editForm.full_name}
                                                    onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                                                    className="bg-secondary/20 border-gold/20 text-foreground focus:border-gold/50"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="phone" className="text-gold/70 font-body uppercase tracking-widest text-xs">Phone Number</Label>
                                                <Input
                                                    id="phone"
                                                    value={editForm.phone}
                                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                    className="bg-secondary/20 border-gold/20 text-foreground focus:border-gold/50"
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="address" className="text-gold/70 font-body uppercase tracking-widest text-xs">Address</Label>
                                                <Input
                                                    id="address"
                                                    value={editForm.address}
                                                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                                    className="bg-secondary/20 border-gold/20 text-foreground focus:border-gold/50"
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
                            <Card
                                onClick={() => navigate("/wishlist")}
                                className="bg-secondary/30 border-gold/20 p-6 text-center hover:border-gold/50 transition-all cursor-pointer group"
                            >
                                <Heart className="mx-auto text-gold/70 mb-2 group-hover:scale-110 transition-transform" size={24} />
                                <p className="text-2xl font-display text-foreground">{wishlistCount}</p>
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-body font-bold">In Wishlist</p>
                            </Card>
                            <Card
                                onClick={() => navigate("/cart")}
                                className="bg-secondary/30 border-gold/20 p-6 text-center hover:border-gold/50 transition-all cursor-pointer group"
                            >
                                <ShoppingBag className="mx-auto text-gold/70 mb-2 group-hover:scale-110 transition-transform" size={24} />
                                <p className="text-2xl font-display text-foreground">{cartCount}</p>
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-body font-bold">In Cart</p>
                            </Card>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Loyalty Program Section */}
                        <Card className="bg-secondary/30 border-gold/20 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Award size={120} className="text-gold" />
                            </div>
                            <CardHeader>
                                <CardTitle className="font-display text-gold text-xl uppercase tracking-[0.2em]">Loyalty Rewards</CardTitle>
                                <CardDescription className="text-muted-foreground font-body">Your heritage points and exclusive benefits</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-sm text-gold/80 font-body uppercase tracking-widest mb-1">Available Points</p>
                                        <p className="text-4xl font-display text-foreground font-bold">{profile?.loyalty_points || 0}</p>
                                    </div>
                                    <Button variant="outline" className="border-gold/30 text-gold hover:bg-gold/10 font-body text-xs uppercase tracking-widest h-10 px-6">
                                        Redeem Points
                                    </Button>
                                </div>
                                <div className="mt-6 w-full h-2 bg-primary/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-gold/70" style={{ width: `${(profile?.loyalty_points || 0) % 100}%` }} />
                                </div>
                                <p className="text-[10px] text-muted-foreground mt-2 font-body italic text-right">
                                    {100 - ((profile?.loyalty_points || 0) % 100)} points more to reach next tier
                                </p>
                            </CardContent>
                        </Card>

                        {/* Recent Activities */}
                        <div className="space-y-4">
                            <h3 className="font-display text-foreground text-xl flex items-center gap-2">
                                <ShoppingBag className="text-gold/70" size={20} /> Recent Orders
                            </h3>
                            <div className="space-y-4">
                                {recentOrders.length > 0 ? recentOrders.map((order) => (
                                    <Card key={order.id} className="bg-secondary/20 border-gold/10 hover:border-gold/30 transition-all group">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded bg-primary/50 flex items-center justify-center text-gold/70 border border-gold/20">
                                                    <ShoppingBag size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-foreground font-display text-sm font-semibold">Order #{order.id.slice(0, 8)}</p>
                                                    <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">
                                                        {new Date(order.created_at).toLocaleDateString()} • {order.status}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-gold/80 font-display text-sm font-bold">{order.total_amount}</p>
                                                <p className="text-[10px] text-muted-foreground font-body uppercase tracking-widest">{order.status}</p>
                                            </div>
                                            <ChevronRight size={16} className="text-gold/50 group-hover:translate-x-1 transition-transform" />
                                        </CardContent>
                                    </Card>
                                )) : (
                                    <Card className="bg-secondary/20 border-gold/10 p-12 text-center italic text-muted-foreground font-body">
                                        No orders found yet. Start your royal journey!
                                    </Card>
                                )}
                            </div>
                            <Button variant="link" className="text-gold/70 hover:text-gold font-body text-sm p-0 flex items-center gap-2">
                                View all orders <ChevronRight size={14} />
                            </Button>
                        </div>

                        {/* Quick Access Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card
                                onClick={() => navigate("/wishlist")}
                                className="bg-secondary/20 border-gold/10 p-8 flex flex-col items-center justify-center text-center hover:border-gold/40 transition-all cursor-pointer relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Heart size={80} />
                                </div>
                                <Heart className="text-accent mb-4" size={32} />
                                <h4 className="text-primary-foreground font-display text-xl font-bold uppercase tracking-widest">My Wishlist</h4>
                                <p className="text-xs text-gold-light/60 font-body mt-2">View your saved treasures</p>
                                <ChevronRight className="mt-4 text-gold group-hover:translate-x-1 transition-transform" />
                            </Card>

                            <Card
                                onClick={() => navigate("/cart")}
                                className="bg-secondary/20 border-gold/10 p-8 flex flex-col items-center justify-center text-center hover:border-gold/40 transition-all cursor-pointer relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <ShoppingBag size={80} />
                                </div>
                                <ShoppingCart className="text-gold mb-4" size={32} />
                                <h4 className="text-primary-foreground font-display text-xl font-bold uppercase tracking-widest">My Cart</h4>
                                <p className="text-xs text-gold-light/60 font-body mt-2">Manage your shopping bag</p>
                                <ChevronRight className="mt-4 text-gold group-hover:translate-x-1 transition-transform" />
                            </Card>
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
