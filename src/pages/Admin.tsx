import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
    Trash2, Users, ClipboardList, ArrowLeft, Home,
    Gem, Sparkle, Camera, Star, Upload, Image as ImageIcon, Tag, Eye, EyeOff, Clock, Menu, X
} from "lucide-react";
import { useOffers, useAddOffer, useDeleteOffer, type Offer } from "@/hooks/useOffers";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

type CategoryType = "Saree" | "Bangles" | "Jewelry" | "Festival";

interface Product {
    id?: number;
    name: string;
    price: string;
    original_price: string;
    image: string;
    tag: string;
    category: string;
    type: CategoryType;
}

interface Customer {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    loyalty_points: number;
}

interface Order {
    id: string;
    user_id: string;
    total_amount: string;
    status: string;
    tracking_id: string;
    items: any[];
    created_at: string;
}

interface OfferFormData {
    title: string;
    description: string;
    image: string;
    price: string;
    original_price: string;
    discount_percentage: number;
    category: string;
    tag: string;
    is_active: boolean;
    is_featured: boolean;
    stock_count: number;
    countdown_end: string;
}

// Moved outside to prevent re-creation during re-renders
const CategoryView = ({
    type,
    products,
    loading,
    formData,
    onInputChange,
    onAddProduct,
    onDeleteProduct,
    onFileUpload,
    onDrag,
    onDrop,
    dragActive,
    uploading,
    setFormData
}: {
    type: CategoryType;
    products: Product[];
    loading: boolean;
    formData: Product;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAddProduct: (e: React.FormEvent, type: CategoryType) => void;
    onDeleteProduct: (id: number) => void;
    onFileUpload: (file: File) => void;
    onDrag: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent) => void;
    dragActive: boolean;
    uploading: boolean;
    setFormData: React.Dispatch<React.SetStateAction<Product>>;
}) => (
    <motion.div
        key={`category-view-${type}`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-8"
    >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
            <div>
                <h1 className="font-display text-2xl md:text-4xl font-bold text-gold">Manage {type}s</h1>
                <p className="text-gold-light/60 font-body mt-2 italic text-sm md:text-base">Curate your royal collection of {type.toLowerCase()} masterpieces.</p>
            </div>
            <div className="bg-secondary/40 border border-gold/20 p-3 md:p-4 px-6 md:px-8 rounded-2xl flex items-center gap-6">
                <div className="text-center">
                    <div className="text-[9px] md:text-[10px] text-gold-light/40 uppercase tracking-widest mb-1 font-bold">Stock Count</div>
                    <div className="text-xl md:text-2xl font-display text-gold font-bold">
                        {products.filter(p => p.type === type).length}
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <Card className="lg:col-span-1 bg-secondary border-gold/30 shadow-gold-lg h-fit">
                <CardHeader>
                    <CardTitle className="text-gold font-display text-lg md:text-xl uppercase tracking-widest">Add New {type}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => onAddProduct(e, type)} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label className="text-[10px] text-gold-light/60 uppercase tracking-widest font-bold">Item Name</Label>
                            <Input name="name" required value={formData.name} onChange={onInputChange} className="bg-primary/40 border-gold/20 h-11 text-gold-light" placeholder="e.g. Royal Heritage" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] text-gold-light/60 uppercase tracking-widest font-bold">Price</Label>
                            <Input name="price" required value={formData.price} onChange={onInputChange} className="bg-primary/40 border-gold/20 h-11 text-gold-light" placeholder="₹12,000" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] text-gold-light/60 uppercase tracking-widest font-bold">Collection/Category</Label>
                            <Input name="category" required value={formData.category} onChange={onInputChange} className="bg-primary/40 border-gold/20 h-11 text-gold-light" placeholder="e.g. Traditional" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-[10px] text-gold-light/60 uppercase tracking-widest font-bold">Tag (e.g. New Arrival, Trending)</Label>
                            <Input name="tag" value={formData.tag} onChange={onInputChange} className="bg-primary/40 border-gold/20 h-11 text-gold-light" placeholder="e.g. Handmade" />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-[10px] text-gold-light/60 uppercase tracking-widest font-bold">Masterpiece Image</Label>
                            <div
                                className={`relative border-2 border-dashed rounded-xl p-6 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer
                                    ${dragActive ? 'border-gold bg-gold/5' : 'border-gold/20 bg-primary/20 hover:border-gold/40'}
                                    ${formData.image ? 'h-32' : 'h-48'}`}
                                onDragEnter={onDrag}
                                onDragLeave={onDrag}
                                onDragOver={onDrag}
                                onDrop={onDrop}
                                onClick={() => document.getElementById('file-upload')?.click()}
                            >
                                {uploading ? (
                                    <div className="animate-pulse text-gold flex flex-col items-center gap-2">
                                        <Upload className="animate-bounce" size={24} />
                                        <span className="text-[10px] uppercase font-bold tracking-widest">Uploading...</span>
                                    </div>
                                ) : formData.image ? (
                                    <div className="relative w-full h-full flex items-center justify-center gap-4 px-4 overflow-hidden">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-gold/30 shrink-0">
                                            <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] text-gold-light truncate">{formData.image}</p>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); setFormData(prev => ({ ...prev, image: "" })); }}
                                                className="text-[10px] text-red-400 hover:underline mt-1"
                                            >
                                                Remove and replace
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-2">
                                            <ImageIcon size={24} />
                                        </div>
                                        <p className="text-xs text-gold-light font-medium">Drag & drop your photo or <span className="text-gold">browse</span></p>
                                        <p className="text-[10px] text-gold-light/40 uppercase tracking-widest font-bold">JPG, PNG up to 10MB</p>
                                    </>
                                )}
                                <input
                                    id="file-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => e.target.files?.[0] && onFileUpload(e.target.files[0])}
                                />
                            </div>
                            <div className="pt-2">
                                <Label className="text-[10px] text-gold-light/40 uppercase tracking-widest font-bold">Or enter Image URL manually</Label>
                                <Input name="image" required value={formData.image} onChange={onInputChange} className="bg-primary/40 border-gold/20 h-11 text-gold-light mt-1.5" placeholder="https://..." />
                            </div>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full bg-gold-gradient text-accent-foreground font-display font-bold h-12 uppercase tracking-widest mt-4 rounded-xl shadow-gold-sm hover:scale-[1.02] transition-transform">
                            {loading ? "Recording..." : `Add to ${type} Treasury`}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2 bg-secondary/20 border-gold/20 backdrop-blur-sm overflow-hidden min-h-[500px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-body min-w-[600px]">
                        <thead className="bg-gold/10 text-gold-light text-[10px] uppercase tracking-[0.2em] font-bold">
                            <tr>
                                <th className="px-3 md:px-6 py-4">Image</th>
                                <th className="px-3 md:px-6 py-4">Details</th>
                                <th className="px-3 md:px-6 py-4">Price</th>
                                <th className="px-3 md:px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gold/10">
                            {products.filter(p => p.type === type).map((p) => (
                                <tr key={`prod-${p.id || Math.random()}`} className="hover:bg-gold/5 transition-colors group">
                                    <td className="px-3 md:px-6 py-4">
                                        <div className="w-10 h-14 md:w-14 md:h-20 rounded border border-gold/20 overflow-hidden shadow-gold-sm">
                                            <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                        </div>
                                    </td>
                                    <td className="px-3 md:px-6 py-4">
                                        <div className="font-display text-xs md:text-sm font-bold text-gold-light">{p.name}</div>
                                        <div className="text-[9px] md:text-[10px] text-gold-light/40 uppercase tracking-widest mt-1 font-bold">{p.category}</div>
                                    </td>
                                    <td className="px-3 md:px-6 py-4">
                                        <div className="font-display font-bold text-gold text-xs md:text-base">{p.price}</div>
                                    </td>
                                    <td className="px-3 md:px-6  py-4 text-right">
                                        <Button variant="ghost" size="icon" onClick={() => p.id && onDeleteProduct(p.id)} className="text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-full h-9 w-9">
                                            <Trash2 size={16} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {products.filter(p => p.type === type).length === 0 && (
                        <div className="flex flex-col items-center justify-center h-64 text-gold-light/20">
                            <Sparkle size={48} className="mb-4 opacity-10" />
                            <p className="font-display text-sm uppercase tracking-widest">No masterpieces found in this category</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    </motion.div>
);

const AdminPortal = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [products, setProducts] = useState<Product[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [adminEmail, setAdminEmail] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [activeTab, setActiveTab] = useState<string>("Saree");

    // Offers state and hooks
    const { data: offers = [], isLoading: offersLoading } = useOffers();
    const addOfferMutation = useAddOffer();
    const deleteOfferMutation = useDeleteOffer();
    
    const [offerFormData, setOfferFormData] = useState<OfferFormData>({
        title: "",
        description: "",
        image: "",
        price: "",
        original_price: "",
        discount_percentage: 0,
        category: "Sarees",
        tag: "",
        is_active: true,
        is_featured: false,
        stock_count: 0,
        countdown_end: "",
    });

    const [formData, setFormData] = useState<Product>({
        name: "",
        price: "",
        original_price: "",
        image: "",
        tag: "",
        category: "",
        type: "Saree"
    });

    const handleAdminLogin = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple local check for development
        // For production: Use supabase.auth.signInWithPassword()
        if (adminEmail === "admin@gmail.com" && adminPassword === "123456") {
            setIsAdminAuthenticated(true);
            toast.success("Welcome, Divine Administrator ✦");
        } else {
            toast.error("Invalid credentials.");
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch products - always works as long as table exists
            const { data: pData } = await supabase.from("products").select("*").order("id", { ascending: false });
            if (pData) setProducts(pData);

            // Fetch profiles - handle gracefully if table structure differs
            const { data: cData, error: cError } = await supabase
                .from("profiles")
                .select("*");

            if (!cError && cData) setCustomers(cData);

            // Fetch orders
            const { data: oData } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
            if (oData) setOrders(oData);

        } catch (error) {
            console.error("Graceful fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAdminAuthenticated) {
            fetchData();
        }
    }, [isAdminAuthenticated]);

    // Sync formData.type with activeTab when tab changes
    useEffect(() => {
        if (["Saree", "Bangles", "Jewelry", "Festival"].includes(activeTab)) {
            console.log("Tab changed to:", activeTab);
            setFormData(prev => ({ 
                ...prev, 
                type: activeTab as CategoryType,
                // Reset the form when changing tabs
                name: "",
                price: "",
                original_price: "",
                image: "",
                tag: "",
                category: ""
            }));
        }
    }, [activeTab]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddProduct = async (e: React.FormEvent, type: CategoryType) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.from("products").insert([{ ...formData, type }]);

        if (error) {
            toast.error("Error adding product: " + error.message);
        } else {
            toast.success(`${type} added successfully! ✦`);
            setFormData({
                name: "",
                price: "",
                original_price: "",
                image: "",
                tag: "",
                category: "",
                type: type
            });
            fetchData();
            // Invalidate all product queries to trigger refetch in frontend
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["sarees"] });
        }
        setLoading(false);
    };

    const handleDeleteProduct = async (id: number) => {
        if (!confirm("Are you sure you want to remove this item?")) return;
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) toast.error("Error deleting: " + error.message);
        else {
            toast.success("Removed successfully.");
            fetchData();
            // Invalidate all product queries to trigger refetch in frontend
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["sarees"] });
        }
    };

    const handleUpdateOrderStatus = async (orderId: string, newStatus: string, trackingId?: string) => {
        const { error } = await supabase
            .from("orders")
            .update({ status: newStatus, tracking_id: trackingId })
            .eq("id", orderId);

        if (error) toast.error(error.message);
        else {
            toast.success(`Order status: ${newStatus}`);
            fetchData();
        }
    };

    const handleFileUpload = async (file: File) => {
        try {
            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${activeTab.toLowerCase()}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) {
                if (uploadError.message.includes('bucket not found')) {
                    throw new Error("Storage 'product-images' bucket not found. Please create it in Supabase dashboard.");
                }
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image: publicUrl }));
            toast.success("Divine image uploaded successfully! ✦");
        } catch (error: any) {
            toast.error("Upload Error: " + error.message);
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    };

    // Helper function to calculate discounted price
    const calculateDiscountedPrice = (originalPrice: string, discountPercent: number): string => {
        if (!originalPrice || discountPercent <= 0) return originalPrice;
        
        // Remove ₹ and commas, convert to number
        const priceNumber = parseFloat(originalPrice.replace(/[₹,]/g, ''));
        if (isNaN(priceNumber)) return originalPrice;
        
        // Calculate discounted price
        const discountedPrice = priceNumber - (priceNumber * discountPercent / 100);
        
        // Format back to Indian currency
        return `₹${Math.round(discountedPrice).toLocaleString('en-IN')}`;
    };

    // Offer handlers
    const handleOfferInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setOfferFormData(prev => ({ ...prev, [name]: checked }));
        } else if (name === "discount_percentage") {
            const discountValue = parseInt(value) || 0;
            setOfferFormData(prev => {
                const calculatedPrice = calculateDiscountedPrice(prev.original_price, discountValue);
                return { 
                    ...prev, 
                    discount_percentage: discountValue,
                    price: calculatedPrice
                };
            });
        } else if (name === "original_price") {
            setOfferFormData(prev => {
                const calculatedPrice = calculateDiscountedPrice(value, prev.discount_percentage);
                return { 
                    ...prev, 
                    original_price: value,
                    price: calculatedPrice
                };
            });
        } else if (name === "stock_count") {
            setOfferFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
        } else {
            setOfferFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleAddOffer = async (e: React.FormEvent) => {
        e.preventDefault();
        addOfferMutation.mutate(offerFormData, {
            onSuccess: () => {
                setOfferFormData({
                    title: "",
                    description: "",
                    image: "",
                    price: "",
                    original_price: "",
                    discount_percentage: 0,
                    category: "Sarees",
                    tag: "",
                    is_active: true,
                    is_featured: false,
                    stock_count: 0,
                    countdown_end: "",
                });
            }
        });
    };

    const handleDeleteOffer = (id: number) => {
        if (!confirm("Are you sure you want to delete this offer?")) return;
        deleteOfferMutation.mutate(id);
    };

    const handleOfferFileUpload = async (file: File) => {
        try {
            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `offers/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) {
                if (uploadError.message.includes('bucket not found')) {
                    throw new Error("Storage 'product-images' bucket not found. Please create it in Supabase dashboard.");
                }
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            setOfferFormData(prev => ({ ...prev, image: publicUrl }));
            toast.success("Divine image uploaded successfully! ✦");
        } catch (error: any) {
            toast.error("Upload Error: " + error.message);
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleOfferDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleOfferFileUpload(e.dataTransfer.files[0]);
        }
    };

    if (!isAdminAuthenticated) {
        return (
            <div className="min-h-screen bg-[#1a0f0f] flex items-center justify-center p-4 overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/mandala.png')] opacity-10 pointer-events-none" />
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="w-full max-w-md bg-secondary border-2 border-gold/30 p-10 rounded-3xl shadow-gold-lg relative z-10"
                >
                    <div className="text-center mb-8">
                        <span className="text-5xl text-gold mb-4 inline-block italic font-display">ॐ</span>
                        <h2 className="font-display text-3xl text-gold font-bold uppercase tracking-widest">Admin Sanctuary</h2>
                        <p className="font-body text-gold-light/60 italic mt-3 text-sm italic">Manage the Treasury of Sri Durga</p>
                    </div>
                    <form onSubmit={handleAdminLogin} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-gold-light uppercase tracking-widest text-[10px] font-bold">Divine ID</Label>
                            <Input
                                type="email"
                                value={adminEmail}
                                onChange={(e) => setAdminEmail(e.target.value)}
                                className="bg-primary/40 border-gold/20 text-white focus:border-gold h-12 rounded-xl"
                                placeholder="admin@gmail.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-gold-light uppercase tracking-widest text-[10px] font-bold">Sanctuary Key</Label>
                            <Input
                                type="password"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                className="bg-primary/40 border-gold/20 text-white focus:border-gold h-12 rounded-xl"
                                placeholder="••••••••"
                            />
                        </div>
                        <Button type="submit" className="w-full bg-gold-gradient text-accent-foreground font-display font-bold h-14 uppercase tracking-[0.2em] mt-2 rounded-xl shadow-gold-md hover:scale-[1.02] transition-transform">
                            Enter Sanctuary
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => navigate("/")}
                            className="w-full text-gold-light/40 hover:text-gold text-xs flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={14} /> Return to Public Shop
                        </Button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="min-h-screen bg-[#1a0f0f] text-white flex flex-col">
            {/* Mobile Header */}
            <div className="lg:hidden sticky top-0 z-50 bg-secondary border-b-2 border-gold/20 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-2xl text-gold italic">ॐ</span>
                    <div className="font-display">
                        <h2 className="text-gold font-bold tracking-tighter text-base leading-tight uppercase">Sri Durga</h2>
                        <p className="text-[9px] text-gold-light/60 uppercase tracking-widest font-bold">Admin Portal</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(true)}
                    className="text-gold hover:bg-gold/10"
                >
                    <Menu size={24} />
                </Button>
            </div>

            {/* Mobile Menu Sheet */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 z-50 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed left-0 top-0 bottom-0 w-72 bg-secondary border-r-2 border-gold/20 z-50 lg:hidden overflow-y-auto"
                        >
                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl text-gold italic">ॐ</span>
                                        <div className="font-display">
                                            <h2 className="text-gold font-bold tracking-tighter text-lg leading-tight uppercase">Sri Durga</h2>
                                            <p className="text-[10px] text-gold-light/60 uppercase tracking-widest font-bold">Admin Portal</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-gold hover:bg-gold/10"
                                    >
                                        <X size={20} />
                                    </Button>
                                </div>

                                <nav className="space-y-2">
                                    <button 
                                        onClick={() => {
                                            navigate("/");
                                            setMobileMenuOpen(false);
                                        }} 
                                        className="w-full flex items-center gap-3 px-4 py-3 text-gold-light/60 hover:text-gold hover:bg-gold/5 rounded-xl transition-all font-display text-[10px] uppercase tracking-[0.2em] font-bold"
                                    >
                                        <Home size={18} /> Exit to Website
                                    </button>

                                    <div className="pt-4 pb-2 text-[10px] text-gold-light/20 uppercase tracking-[0.2em] font-bold px-4">Management</div>

                                    <TabsList className="flex flex-col w-full bg-transparent h-auto gap-1 p-0 border-none shadow-none">
                                        <TabsTrigger 
                                            value="Saree" 
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="w-full flex items-center justify-start gap-4 px-4 py-4 rounded-xl text-gold-light/60 data-[state=active]:bg-gold-gradient data-[state=active]:text-accent-foreground font-display text-[11px] uppercase tracking-[0.1em] font-bold transition-all shadow-none border-none cursor-pointer"
                                        >
                                            <Sparkle size={18} /> Sarees
                                        </TabsTrigger>
                                        <TabsTrigger 
                                            value="Bangles" 
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="w-full flex items-center justify-start gap-4 px-4 py-4 rounded-xl text-gold-light/60 data-[state=active]:bg-gold-gradient data-[state=active]:text-accent-foreground font-display text-[11px] uppercase tracking-[0.1em] font-bold transition-all shadow-none border-none cursor-pointer"
                                        >
                                            <Gem size={18} /> Bangles
                                        </TabsTrigger>
                                        <TabsTrigger 
                                            value="Jewelry" 
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="w-full flex items-center justify-start gap-4 px-4 py-4 rounded-xl text-gold-light/60 data-[state=active]:bg-gold-gradient data-[state=active]:text-accent-foreground font-display text-[11px] uppercase tracking-[0.1em] font-bold transition-all shadow-none border-none cursor-pointer"
                                        >
                                            <Star size={18} /> Jewelry
                                        </TabsTrigger>
                                        <TabsTrigger 
                                            value="Festival" 
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="w-full flex items-center justify-start gap-4 px-4 py-4 rounded-xl text-gold-light/60 data-[state=active]:bg-gold-gradient data-[state=active]:text-accent-foreground font-display text-[11px] uppercase tracking-[0.1em] font-bold transition-all shadow-none border-none cursor-pointer"
                                        >
                                            <Camera size={18} /> Festival
                                        </TabsTrigger>
                                        
                                        <div className="pt-4 pb-2 text-[10px] text-gold-light/20 uppercase tracking-[0.2em] font-bold px-4 select-none">
                                            PROMOTIONS
                                        </div>
                                        
                                        <TabsTrigger 
                                            value="Offers" 
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="w-full flex items-center justify-start gap-4 px-4 py-4 rounded-xl text-gold-light/60 data-[state=active]:bg-gold-gradient data-[state=active]:text-accent-foreground font-display text-[11px] uppercase tracking-[0.1em] font-bold transition-all shadow-none border-none cursor-pointer"
                                        >
                                            <Tag size={18} /> Offers
                                        </TabsTrigger>

                                        <div className="pt-6 pb-2 text-[10px] text-gold-light/20 uppercase tracking-[0.2em] font-bold px-4 select-none">
                                            TREASURY
                                        </div>

                                        <TabsTrigger 
                                            value="customers" 
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="w-full flex items-center justify-start gap-4 px-4 py-4 rounded-xl text-gold-light/60 data-[state=active]:bg-gold-gradient data-[state=active]:text-accent-foreground font-display text-[11px] uppercase tracking-[0.1em] font-bold transition-all shadow-none border-none cursor-pointer"
                                        >
                                            <Users size={18} /> Customers
                                        </TabsTrigger>
                                        <TabsTrigger 
                                            value="orders" 
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="w-full flex items-center justify-start gap-4 px-4 py-4 rounded-xl text-gold-light/60 data-[state=active]:bg-gold-gradient data-[state=active]:text-accent-foreground font-display text-[11px] uppercase tracking-[0.1em] font-bold transition-all shadow-none border-none cursor-pointer"
                                        >
                                            <ClipboardList size={18} /> Orders
                                        </TabsTrigger>
                                    </TabsList>
                                </nav>

                                <div className="pt-8 border-t border-gold/10">
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setIsAdminAuthenticated(false);
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full flex justify-start gap-3 text-red-400/60 hover:text-red-400 hover:bg-red-500/5 px-4 font-display text-[10px] uppercase tracking-widest font-bold"
                                    >
                                        <ArrowLeft size={16} /> Logout Sanctuary
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <div className="flex flex-1 overflow-hidden">
                <aside className="w-64 bg-secondary border-r-2 border-gold/20 flex flex-col p-6 space-y-8 hidden lg:flex shrink-0">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl text-gold italic">ॐ</span>
                        <div className="font-display">
                            <h2 className="text-gold font-bold tracking-tighter text-lg leading-tight uppercase">Sri Durga</h2>
                            <p className="text-[10px] text-gold-light/60 uppercase tracking-widest font-bold">Admin Portal</p>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-2">
                        <button onClick={() => navigate("/")} className="w-full flex items-center gap-3 px-4 py-3 text-gold-light/60 hover:text-gold hover:bg-gold/5 rounded-xl transition-all font-display text-[10px] uppercase tracking-[0.2em] font-bold">
                            <Home size={18} /> Exit to Website
                        </button>

                        <div className="pt-4 pb-2 text-[10px] text-gold-light/20 uppercase tracking-[0.2em] font-bold px-4">Management</div>

                        <TabsList className="flex flex-col w-full bg-transparent h-auto gap-1 p-0 border-none shadow-none">
                            <TabsTrigger value="Saree" className="w-full flex items-center justify-start gap-4 px-4 py-4 rounded-xl text-gold-light/60 data-[state=active]:bg-gold-gradient data-[state=active]:text-accent-foreground font-display text-[11px] uppercase tracking-[0.1em] font-bold transition-all shadow-none border-none cursor-pointer">
                                <Sparkle size={18} /> Sarees
                            </TabsTrigger>
                            <TabsTrigger value="Bangles" className="w-full flex items-center justify-start gap-4 px-4 py-4 rounded-xl text-gold-light/60 data-[state=active]:bg-gold-gradient data-[state=active]:text-accent-foreground font-display text-[11px] uppercase tracking-[0.1em] font-bold transition-all shadow-none border-none cursor-pointer">
                                <Gem size={18} /> Bangles
                            </TabsTrigger>
                            <TabsTrigger value="Jewelry" className="w-full flex items-center justify-start gap-4 px-4 py-4 rounded-xl text-gold-light/60 data-[state=active]:bg-gold-gradient data-[state=active]:text-accent-foreground font-display text-[11px] uppercase tracking-[0.1em] font-bold transition-all shadow-none border-none cursor-pointer">
                                <Star size={18} /> Jewelry
                            </TabsTrigger>
                            <TabsTrigger value="Festival" className="w-full flex items-center justify-start gap-4 px-4 py-4 rounded-xl text-gold-light/60 data-[state=active]:bg-gold-gradient data-[state=active]:text-accent-foreground font-display text-[11px] uppercase tracking-[0.1em] font-bold transition-all shadow-none border-none cursor-pointer">
                                <Camera size={18} /> Festival
                            </TabsTrigger>
                            
                            <div className="pt-4 pb-2 text-[10px] text-gold-light/20 uppercase tracking-[0.2em] font-bold px-4 select-none">
                                PROMOTIONS
                            </div>
                            
                            <TabsTrigger value="Offers" className="w-full flex items-center justify-start gap-4 px-4 py-4 rounded-xl text-gold-light/60 data-[state=active]:bg-gold-gradient data-[state=active]:text-accent-foreground font-display text-[11px] uppercase tracking-[0.1em] font-bold transition-all shadow-none border-none cursor-pointer">
                                <Tag size={18} /> Offers
                            </TabsTrigger>

                            <div className="pt-6 pb-2 text-[10px] text-gold-light/20 uppercase tracking-[0.2em] font-bold px-4 select-none">
                                TREASURY
                            </div>

                            <TabsTrigger value="customers" className="w-full flex items-center justify-start gap-4 px-4 py-4 rounded-xl text-gold-light/60 data-[state=active]:bg-gold-gradient data-[state=active]:text-accent-foreground font-display text-[11px] uppercase tracking-[0.1em] font-bold transition-all shadow-none border-none cursor-pointer">
                                <Users size={18} /> Customers
                            </TabsTrigger>
                            <TabsTrigger value="orders" className="w-full flex items-center justify-start gap-4 px-4 py-4 rounded-xl text-gold-light/60 data-[state=active]:bg-gold-gradient data-[state=active]:text-accent-foreground font-display text-[11px] uppercase tracking-[0.1em] font-bold transition-all shadow-none border-none cursor-pointer">
                                <ClipboardList size={18} /> Orders
                            </TabsTrigger>
                        </TabsList>
                    </nav>

                    <div className="mt-auto pt-8 border-t border-gold/10">
                        <Button
                            variant="ghost"
                            onClick={() => setIsAdminAuthenticated(false)}
                            className="w-full flex justify-start gap-3 text-red-400/60 hover:text-red-400 hover:bg-red-500/5 px-4 font-display text-[10px] uppercase tracking-widest font-bold"
                        >
                            <ArrowLeft size={16} /> Logout Sanctuary
                        </Button>
                    </div>
                </aside>

                <main className="flex-1 overflow-y-auto bg-primary/20 p-4 md:p-6 lg:px-12 relative min-h-screen lg:h-screen">
                    {/* Saree Tab */}
                    <TabsContent value="Saree" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                        <CategoryView
                            type="Saree"
                            products={products}
                            loading={loading}
                            formData={formData}
                            onInputChange={handleInputChange}
                            onAddProduct={handleAddProduct}
                            onDeleteProduct={handleDeleteProduct}
                            onFileUpload={handleFileUpload}
                            onDrag={handleDrag}
                            onDrop={handleDrop}
                            dragActive={dragActive}
                            uploading={uploading}
                            setFormData={setFormData}
                        />
                    </TabsContent>

                    {/* Bangles Tab */}
                    <TabsContent value="Bangles" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                        <CategoryView
                            type="Bangles"
                            products={products}
                            loading={loading}
                            formData={formData}
                            onInputChange={handleInputChange}
                            onAddProduct={handleAddProduct}
                            onDeleteProduct={handleDeleteProduct}
                            onFileUpload={handleFileUpload}
                            onDrag={handleDrag}
                            onDrop={handleDrop}
                            dragActive={dragActive}
                            uploading={uploading}
                            setFormData={setFormData}
                        />
                    </TabsContent>

                    {/* Jewelry Tab */}
                    <TabsContent value="Jewelry" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                        <CategoryView
                            type="Jewelry"
                            products={products}
                            loading={loading}
                            formData={formData}
                            onInputChange={handleInputChange}
                            onAddProduct={handleAddProduct}
                            onDeleteProduct={handleDeleteProduct}
                            onFileUpload={handleFileUpload}
                            onDrag={handleDrag}
                            onDrop={handleDrop}
                            dragActive={dragActive}
                            uploading={uploading}
                            setFormData={setFormData}
                        />
                    </TabsContent>

                    {/* Festival Tab */}
                    <TabsContent value="Festival" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                        <CategoryView
                            type="Festival"
                            products={products}
                            loading={loading}
                            formData={formData}
                            onInputChange={handleInputChange}
                            onAddProduct={handleAddProduct}
                            onDeleteProduct={handleDeleteProduct}
                            onFileUpload={handleFileUpload}
                            onDrag={handleDrag}
                            onDrop={handleDrop}
                            dragActive={dragActive}
                            uploading={uploading}
                            setFormData={setFormData}
                        />
                    </TabsContent>

                    {/* Offers Tab */}
                    <TabsContent value="Offers" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
                                <div>
                                    <h1 className="font-display text-2xl md:text-4xl font-bold text-gold">Manage Offers</h1>
                                    <p className="text-gold-light/60 font-body mt-2 italic text-sm md:text-base">Create exclusive promotional offers to attract customers.</p>
                                </div>
                                <div className="bg-secondary/40 border border-gold/20 p-3 md:p-4 px-4 md:px-8 rounded-2xl flex items-center gap-3 md:gap-6">
                                    <div className="text-center">
                                        <div className="text-[9px] md:text-[10px] text-gold-light/40 uppercase tracking-widest mb-1 font-bold">Total Offers</div>
                                        <div className="text-xl md:text-2xl font-display text-gold font-bold">{offers.length}</div>
                                    </div>
                                    <div className="w-px h-6 md:h-8 bg-gold/20" />
                                    <div className="text-center">
                                        <div className="text-[9px] md:text-[10px] text-gold-light/40 uppercase tracking-widest mb-1 font-bold">Active</div>
                                        <div className="text-xl md:text-2xl font-display text-green-500 font-bold">
                                            {offers.filter(o => o.is_active).length}
                                        </div>
                                    </div>
                                    <div className="w-px h-6 md:h-8 bg-gold/20" />
                                    <div className="text-center">
                                        <div className="text-[9px] md:text-[10px] text-gold-light/40 uppercase tracking-widest mb-1 font-bold">Featured</div>
                                        <div className="text-xl md:text-2xl font-display text-blue-500 font-bold">
                                            {offers.filter(o => o.is_featured).length}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                                <Card className="lg:col-span-1 bg-secondary border-gold/30 shadow-gold-lg h-fit">
                                    <CardHeader>
                                        <CardTitle className="text-gold font-display text-lg md:text-xl uppercase tracking-widest">Add New Offer</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleAddOffer} className="space-y-4">
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] text-gold-light/60 uppercase tracking-widest font-bold">Offer Title</Label>
                                                <Input
                                                    name="title"
                                                    required
                                                    value={offerFormData.title}
                                                    onChange={handleOfferInputChange}
                                                    className="bg-primary/40 border-gold/20 h-11 text-gold-light"
                                                    placeholder="e.g. Heritage Temple Border Silk"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] text-gold-light/60 uppercase tracking-widest font-bold">Description</Label>
                                                <Input
                                                    name="description"
                                                    value={offerFormData.description}
                                                    onChange={handleOfferInputChange}
                                                    className="bg-primary/40 border-gold/20 h-11 text-gold-light"
                                                    placeholder="Brief description"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] text-gold-light/60 uppercase tracking-widest font-bold">Original Price (Required)</Label>
                                                <Input
                                                    name="original_price"
                                                    required
                                                    value={offerFormData.original_price}
                                                    onChange={handleOfferInputChange}
                                                    className="bg-primary/40 border-gold/20 h-11 text-gold-light"
                                                    placeholder="₹24,999"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-1.5">
                                                    <Label className="text-[10px] text-gold-light/60 uppercase tracking-widest font-bold">Discount % (0-100)</Label>
                                                    <Input
                                                        name="discount_percentage"
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        value={offerFormData.discount_percentage}
                                                        onChange={handleOfferInputChange}
                                                        className="bg-primary/40 border-gold/20 h-11 text-gold-light"
                                                        placeholder="24"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <Label className="text-[10px] text-gold-light/60 uppercase tracking-widest font-bold">Stock Count</Label>
                                                    <Input
                                                        name="stock_count"
                                                        type="number"
                                                        min="0"
                                                        value={offerFormData.stock_count}
                                                        onChange={handleOfferInputChange}
                                                        className="bg-primary/40 border-gold/20 h-11 text-gold-light"
                                                        placeholder="5"
                                                    />
                                                </div>
                                            </div>

                                            {/* Auto-calculated Price Display */}
                                            {offerFormData.original_price && offerFormData.discount_percentage > 0 && (
                                                <div className="p-4 bg-gold/10 border border-gold/30 rounded-xl">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-[10px] text-gold-light/60 uppercase tracking-widest font-bold mb-1">Final Offer Price</p>
                                                            <p className="font-display text-2xl font-bold text-gold">{offerFormData.price}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xs text-gold-light/40 line-through">{offerFormData.original_price}</p>
                                                            <p className="text-sm text-green-400 font-bold">{offerFormData.discount_percentage}% OFF</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] text-gold-light/60 uppercase tracking-widest font-bold">Category</Label>
                                                <Input
                                                    name="category"
                                                    required
                                                    value={offerFormData.category}
                                                    onChange={handleOfferInputChange}
                                                    className="bg-primary/40 border-gold/20 h-11 text-gold-light"
                                                    placeholder="e.g. Sarees, Jewelry, Bangles"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] text-gold-light/60 uppercase tracking-widest font-bold">Tag</Label>
                                                <Input
                                                    name="tag"
                                                    value={offerFormData.tag}
                                                    onChange={handleOfferInputChange}
                                                    className="bg-primary/40 border-gold/20 h-11 text-gold-light"
                                                    placeholder="e.g. TRENDING, NEW ARRIVAL"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] text-gold-light/60 uppercase tracking-widest font-bold">Countdown End (Optional)</Label>
                                                <Input
                                                    name="countdown_end"
                                                    type="datetime-local"
                                                    value={offerFormData.countdown_end}
                                                    onChange={handleOfferInputChange}
                                                    className="bg-primary/40 border-gold/20 h-11 text-gold-light"
                                                />
                                            </div>

                                            <div className="space-y-3 pt-2">
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        id="is_active"
                                                        name="is_active"
                                                        checked={offerFormData.is_active}
                                                        onChange={handleOfferInputChange}
                                                        className="w-4 h-4 rounded border-gold/30 text-gold focus:ring-gold"
                                                    />
                                                    <Label htmlFor="is_active" className="text-xs text-gold-light cursor-pointer">Active (visible to customers)</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        id="is_featured"
                                                        name="is_featured"
                                                        checked={offerFormData.is_featured}
                                                        onChange={handleOfferInputChange}
                                                        className="w-4 h-4 rounded border-gold/30 text-gold focus:ring-gold"
                                                    />
                                                    <Label htmlFor="is_featured" className="text-xs text-gold-light cursor-pointer">Featured (show in Limited Edition Drops)</Label>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] text-gold-light/60 uppercase tracking-widest font-bold">Offer Image</Label>
                                                <div
                                                    className={`relative border-2 border-dashed rounded-xl p-6 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer
                                                        ${dragActive ? 'border-gold bg-gold/5' : 'border-gold/20 bg-primary/20 hover:border-gold/40'}
                                                        ${offerFormData.image ? 'h-32' : 'h-48'}`}
                                                    onDragEnter={handleDrag}
                                                    onDragLeave={handleDrag}
                                                    onDragOver={handleDrag}
                                                    onDrop={handleOfferDrop}
                                                    onClick={() => document.getElementById('offer-file-upload')?.click()}
                                                >
                                                    {uploading ? (
                                                        <div className="animate-pulse text-gold flex flex-col items-center gap-2">
                                                            <Upload className="animate-bounce" size={24} />
                                                            <span className="text-[10px] uppercase font-bold tracking-widest">Uploading...</span>
                                                        </div>
                                                    ) : offerFormData.image ? (
                                                        <div className="relative w-full h-full flex items-center justify-center gap-4 px-4 overflow-hidden">
                                                            <div className="w-16 h-16 rounded-lg overflow-hidden border border-gold/30 shrink-0">
                                                                <img src={offerFormData.image} className="w-full h-full object-cover" alt="Preview" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-[10px] text-gold-light truncate">{offerFormData.image}</p>
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => { e.stopPropagation(); setOfferFormData(prev => ({ ...prev, image: "" })); }}
                                                                    className="text-[10px] text-red-400 hover:underline mt-1"
                                                                >
                                                                    Remove and replace
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold mb-2">
                                                                <ImageIcon size={24} />
                                                            </div>
                                                            <p className="text-xs text-gold-light font-medium">Drag & drop your photo or <span className="text-gold">browse</span></p>
                                                            <p className="text-[10px] text-gold-light/40 uppercase tracking-widest font-bold">JPG, PNG up to 10MB</p>
                                                        </>
                                                    )}
                                                    <input
                                                        id="offer-file-upload"
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => e.target.files?.[0] && handleOfferFileUpload(e.target.files[0])}
                                                    />
                                                </div>
                                                <div className="pt-2">
                                                    <Label className="text-[10px] text-gold-light/40 uppercase tracking-widest font-bold">Or enter Image URL manually</Label>
                                                    <Input
                                                        name="image"
                                                        required
                                                        value={offerFormData.image}
                                                        onChange={handleOfferInputChange}
                                                        className="bg-primary/40 border-gold/20 h-11 text-gold-light mt-1.5"
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={addOfferMutation.isPending}
                                                className="w-full bg-gold-gradient text-accent-foreground font-display font-bold h-12 uppercase tracking-widest mt-4 rounded-xl shadow-gold-sm hover:scale-[1.02] transition-transform"
                                            >
                                                {addOfferMutation.isPending ? "Adding..." : "Add Offer"}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>

                                <Card className="lg:col-span-2 bg-secondary/20 border-gold/20 backdrop-blur-sm overflow-hidden min-h-[500px]">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left font-body min-w-[700px]">
                                            <thead className="bg-gold/10 text-gold-light text-[10px] uppercase tracking-[0.2em] font-bold">
                                                <tr>
                                                    <th className="px-2 md:px-4 py-4">Image</th>
                                                    <th className="px-2 md:px-4 py-4">Details</th>
                                                    <th className="px-2 md:px-4 py-4">Price</th>
                                                    <th className="px-2 md:px-4 py-4">Status</th>
                                                    <th className="px-2 md:px-4 py-4 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gold/10">
                                                {offers.map((offer) => (
                                                    <tr key={`offer-${offer.id}`} className="hover:bg-gold/5 transition-colors group">
                                                        <td className="px-2 md:px-4 py-4">
                                                            <div className="w-10 h-14 md:w-14 md:h-20 rounded border border-gold/20 overflow-hidden shadow-gold-sm">
                                                                <img
                                                                    src={offer.image}
                                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                                    alt={offer.title}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td className="px-2 md:px-4 py-4">
                                                            <div className="font-display text-xs md:text-sm font-bold text-gold-light">{offer.title}</div>
                                                            <div className="text-[9px] md:text-[10px] text-gold-light/40 uppercase tracking-widest mt-1 font-bold">
                                                                {offer.category}
                                                            </div>
                                                            {offer.tag && (
                                                                <span className="inline-block mt-1 px-2 py-0.5 text-[8px] bg-gold/10 text-gold rounded uppercase tracking-wider font-bold">
                                                                    {offer.tag}
                                                                </span>
                                                            )}
                                                            {offer.countdown_end && (
                                                                <div className="flex items-center gap-1 mt-1 text-[9px] text-blue-400">
                                                                    <Clock size={10} />
                                                                    {new Date(offer.countdown_end).toLocaleDateString()}
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="font-display font-bold text-gold">{offer.price}</div>
                                                            {offer.original_price && (
                                                                <div className="text-xs text-gold-light/40 line-through">{offer.original_price}</div>
                                                            )}
                                                            {offer.discount_percentage > 0 && (
                                                                <div className="text-[10px] text-green-500 font-bold">{offer.discount_percentage}% OFF</div>
                                                            )}
                                                            <div className="text-[10px] text-gold-light/40 mt-1">Stock: {offer.stock_count}</div>
                                                        </td>
                                                        <td className="px-4 py-4">
                                                            <div className="flex flex-col gap-1">
                                                                <div className="flex items-center gap-1.5">
                                                                    {offer.is_active ? (
                                                                        <Eye size={12} className="text-green-500" />
                                                                    ) : (
                                                                        <EyeOff size={12} className="text-red-400" />
                                                                    )}
                                                                    <span className={`text-[10px] font-bold ${offer.is_active ? 'text-green-500' : 'text-red-400'}`}>
                                                                        {offer.is_active ? 'Active' : 'Inactive'}
                                                                    </span>
                                                                </div>
                                                                {offer.is_featured && (
                                                                    <span className="text-[9px] text-blue-400 font-bold flex items-center gap-1">
                                                                        <Star size={10} /> Featured
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-4 text-right">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => offer.id && handleDeleteOffer(offer.id)}
                                                                className="text-red-400 hover:text-red-500 hover:bg-red-500/10 rounded-full h-9 w-9"
                                                            >
                                                                <Trash2 size={16} />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {offers.length === 0 && (
                                            <div className="flex flex-col items-center justify-center h-64 text-gold-light/20">
                                                <Tag size={48} className="mb-4 opacity-10" />
                                                <p className="font-display text-sm uppercase tracking-widest">No offers created yet</p>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        </motion.div>
                    </TabsContent>

                    {/* Customers Tab */}
                    <TabsContent value="customers" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <h1 className="font-display text-4xl font-bold text-gold mb-8 uppercase tracking-widest">Customer Registry</h1>
                                    <Card className="bg-secondary/20 border-gold/20 backdrop-blur-sm overflow-hidden border-2 border-gold/10">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left font-body">
                                                <thead className="bg-gold/10 text-gold-light text-xs uppercase tracking-widest font-bold">
                                                    <tr>
                                                        <th className="px-6 py-4">Name</th>
                                                        <th className="px-6 py-4">Contact</th>
                                                        <th className="px-6 py-4">Points</th>
                                                        <th className="px-6 py-4 text-right">Loyalty Rewarding</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gold/10">
                                                    {customers.map((c) => (
                                                        <tr key={`cust-${c.id}`} className="hover:bg-gold/5 transition-colors">
                                                            <td className="px-6 py-4 font-bold text-gold-light font-display uppercase tracking-wider">{c.full_name || "Guest User"}</td>
                                                            <td className="px-6 py-4 text-xs font-mono">
                                                                <div className="text-gold-light/60">{c.email}</div>
                                                                <div className="text-gold-light/30">{c.phone || "No contact"}</div>
                                                            </td>
                                                            <td className="px-6 py-4"><span className="text-2xl font-display text-gold font-bold">{c.loyalty_points}</span></td>
                                                            <td className="px-6 py-4 text-right">
                                                                <Button onClick={async () => {
                                                                    const { error } = await supabase.rpc('increment_loyalty', { row_id: c.id, x: 10 });
                                                                    if (!error) { toast.success(`Rewarded ${c.full_name}! ✿`); fetchData(); }
                                                                }} className="bg-gold/5 text-gold border border-gold/20 h-9 font-display text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-gold-gradient hover:text-accent-foreground transition-all px-6">
                                                                    Give +10 Points
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {customers.length === 0 && (
                                                <div className="flex flex-col items-center justify-center h-64 text-gold-light/20">
                                                    <Users size={48} className="mb-4 opacity-10" />
                                                    <p className="font-display text-sm uppercase tracking-widest">No customers registered yet</p>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                </motion.div>
                            </TabsContent>

                    {/* Orders Tab */}
                    <TabsContent value="orders" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <h1 className="font-display text-4xl font-bold text-gold mb-8 uppercase tracking-widest">Order Management</h1>
                                    <Card className="bg-secondary/20 border-gold/20 backdrop-blur-sm overflow-hidden border-2 border-gold/10">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left font-body">
                                                <thead className="bg-gold/10 text-gold-light text-xs uppercase tracking-widest font-bold">
                                                    <tr>
                                                        <th className="px-6 py-4">ID / Date</th>
                                                        <th className="px-6 py-4">Amount</th>
                                                        <th className="px-6 py-4">Status</th>
                                                        <th className="px-6 py-4">Tracking ID</th>
                                                        <th className="px-6 py-4 text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gold/10">
                                                    {orders.map((o) => (
                                                        <tr key={`ord-${o.id}`} className="hover:bg-gold/5 transition-colors">
                                                            <td className="px-6 py-4 text-xs font-mono">
                                                                <div className="text-gold-light font-bold">#{o.id.slice(0, 8).toUpperCase()}</div>
                                                                <div className="text-gold-light/40 mt-1">{new Date(o.created_at).toLocaleDateString()}</div>
                                                            </td>
                                                            <td className="px-6 py-4 text-gold font-bold font-display">{o.total_amount}</td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-4 py-1.5 rounded-full text-[9px] uppercase font-bold tracking-[0.2em] border shadow-sm ${o.status === 'Pending' ? 'bg-yellow-500/5 text-yellow-500 border-yellow-500/20' :
                                                                    o.status === 'Shipped' ? 'bg-blue-500/5 text-blue-500 border-blue-500/20' :
                                                                        'bg-green-500/5 text-green-500 border-green-500/20'
                                                                    }`}>{o.status}</span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <Input
                                                                    defaultValue={o.tracking_id}
                                                                    onBlur={(e) => handleUpdateOrderStatus(o.id, o.status, e.target.value)}
                                                                    className="h-9 w-40 bg-primary/20 border-gold/20 text-xs font-mono text-gold-light"
                                                                    placeholder="No Tracking ID"
                                                                />
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <div className="flex justify-end gap-1.5">
                                                                    {['Pending', 'Shipped', 'Delivered'].map(s => (
                                                                        <Button
                                                                            key={`btn-${o.id}-${s}`}
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            onClick={() => handleUpdateOrderStatus(o.id, s, o.tracking_id)}
                                                                            className={`text-[9px] h-8 px-3 uppercase tracking-widest font-bold font-display rounded-lg transition-all ${o.status === s ? 'bg-gold-gradient text-accent-foreground' : 'text-gold-light/20 hover:text-gold hover:bg-gold/5'}`}
                                                                        >
                                                                            {s[0]}
                                                                        </Button>
                                                                    ))}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            {orders.length === 0 && (
                                                <div className="flex flex-col items-center justify-center h-64 text-gold-light/20">
                                                    <ClipboardList size={48} className="mb-4 opacity-10" />
                                                    <p className="font-display text-sm uppercase tracking-widest">No orders yet</p>
                                                </div>
                                            )}
                                        </div>
                                    </Card>
                                </motion.div>
                            </TabsContent>
                </main>
            </div>
        </Tabs>
    );
};

export default AdminPortal;
