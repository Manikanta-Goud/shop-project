import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Share2, ArrowLeft, Star, Truck, Shield, RefreshCw, ChevronRight, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, setShowLoginModal } = useAuth();

    const [product, setProduct] = useState<any>(null);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [inCart, setInCart] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        // Only fetch product data when the id changes — NOT when user changes
        const fetchProduct = async () => {
            try {
                setLoading(true);

                const { data: productData, error: productError } = await supabase
                    .from("products")
                    .select("*")
                    .eq("id", id)
                    .single();

                if (productError) throw productError;
                setProduct(productData);

                // Related products
                let { data: relatedData } = await supabase
                    .from("products")
                    .select("*")
                    .eq("category", productData.category)
                    .neq("id", id)
                    .limit(8);

                if (!relatedData || relatedData.length < 4) {
                    const { data: typeData } = await supabase
                        .from("products")
                        .select("*")
                        .eq("type", productData.type)
                        .neq("id", id)
                        .neq("category", productData.category)
                        .limit(8 - (relatedData?.length || 0));
                    relatedData = [...(relatedData || []), ...(typeData || [])];
                }

                setRelatedProducts(relatedData || []);
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Failed to load product details");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [id]); // ← only id, NOT user

    useEffect(() => {
        // Separately fetch user-specific data (wishlist / cart)
        // so auth state changes don't re-trigger the full product load
        if (!user || !id) return;

        const fetchUserData = async () => {
            const { data: wishlistData } = await supabase
                .from("wishlist")
                .select("id")
                .eq("user_id", user.id)
                .eq("product_id", id)
                .maybeSingle();
            setIsLiked(!!wishlistData);

            const { data: cartData } = await supabase
                .from("cart")
                .select("quantity")
                .eq("user_id", user.id)
                .eq("product_id", id)
                .maybeSingle();
            if (cartData) {
                setInCart(true);
                setQuantity(cartData.quantity);
            }
        };

        fetchUserData();
    }, [id, user]);

    const handleToggleLike = async () => {
        if (!user) {
            toast.info("Please login to save favorites ✦");
            setShowLoginModal(true);
            return;
        }

        if (isLiked) {
            const { error } = await supabase
                .from("wishlist")
                .delete()
                .eq("user_id", user.id)
                .eq("product_id", id);

            if (!error) {
                setIsLiked(false);
                toast.success("Removed from wishlist");
            } else {
                console.error("Error removing from wishlist:", error);
                toast.error(`Failed to remove: ${error.message}`);
            }
        } else {
            console.log("Adding to wishlist:", { user_id: user.id, product_id: id });
            const { data, error } = await supabase
                .from("wishlist")
                .insert({ user_id: user.id, product_id: id })
                .select();

            if (!error) {
                console.log("Successfully added to wishlist:", data);
                setIsLiked(true);
                toast.success("Added to wishlist ✦");
            } else {
                console.error("Error adding to wishlist:", {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                });
                toast.error(`Failed to add: ${error.message}`);
            }
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            toast.info("Please login to add items to cart ✦");
            setShowLoginModal(true);
            return;
        }

        try {
            if (inCart) {
                // Update quantity
                await supabase
                    .from("cart")
                    .update({ quantity: quantity + 1 })
                    .eq("user_id", user.id)
                    .eq("product_id", id);

                setQuantity(quantity + 1);
                toast.success("Cart updated!");
            } else {
                // Add to cart
                await supabase
                    .from("cart")
                    .insert({
                        user_id: user.id,
                        product_id: id,
                        quantity: 1
                    });

                setInCart(true);
                setQuantity(1);
                toast.success("Added to cart ✦");
            }
        } catch (error) {
            console.error("Cart error:", error);
            toast.error("Failed to add to cart");
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: product?.name || "Product",
                text: product?.description || "",
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        }
    };

    const handleWhatsAppInquiry = () => {
        const phoneNumber = "9676998183"; // Replace with your business WhatsApp number (country code + number, no + or spaces)
        const message = `Hi! I'm interested in the following product:\n\n*${product?.name}*\nPrice: ${product?.price}\nCategory: ${product?.category || 'N/A'}\n\nProduct Link: ${window.location.href}\n\nCan you please provide more details?`;
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-primary">
                <Navbar />
                <main className="max-w-7xl mx-auto px-4 py-8 lg:py-12 mt-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 animate-pulse">
                        {/* Image skeleton */}
                        <div className="aspect-square rounded-2xl bg-secondary/40 border border-gold/10" />
                        {/* Details skeleton */}
                        <div className="space-y-5 pt-4">
                            <div className="h-8 bg-secondary/40 rounded-lg w-3/4" />
                            <div className="h-5 bg-secondary/30 rounded-lg w-1/3" />
                            <div className="h-10 bg-secondary/40 rounded-lg w-1/2" />
                            <div className="h-px bg-gold/10" />
                            <div className="space-y-2">
                                <div className="h-4 bg-secondary/30 rounded w-full" />
                                <div className="h-4 bg-secondary/30 rounded w-5/6" />
                                <div className="h-4 bg-secondary/30 rounded w-4/6" />
                            </div>
                            <div className="h-14 bg-gold/10 border border-gold/20 rounded-xl" />
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center">
                <Navbar />
                <div className="text-center">
                    <h2 className="text-gold font-display text-2xl mb-4">Product not found</h2>
                    <Button onClick={() => navigate(-1)} className="bg-gold-gradient">Go Back</Button>
                </div>
            </div>
        );
    }

    const images = product.images || [product.image];

    return (
        <div className="min-h-screen bg-primary">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 py-8 lg:py-12 mt-16">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-6"
                >
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="text-gold hover:text-gold-light hover:bg-gold/10 font-body flex items-center gap-2"
                    >
                        <ArrowLeft size={18} /> Back
                    </Button>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left: Images */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        {/* Main Image */}
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary/30 border border-gold/20">
                            <img
                                src={images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />

                            {/* Like, WhatsApp & Share buttons on image */}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button
                                    onClick={handleToggleLike}
                                    className={`p-3 rounded-full backdrop-blur-md transition-all ${isLiked
                                        ? "bg-red-500 text-white"
                                        : "bg-white/90 text-gray-700 hover:bg-white"
                                        }`}
                                >
                                    <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                                </button>
                                <button
                                    onClick={handleWhatsAppInquiry}
                                    className="p-3 rounded-full bg-green-500 hover:bg-green-600 text-white backdrop-blur-md transition-all"
                                    title="Inquire on WhatsApp"
                                >
                                    <MessageCircle size={20} />
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="p-3 rounded-full bg-white/90 hover:bg-white text-gray-700 backdrop-blur-md transition-all"
                                >
                                    <Share2 size={20} />
                                </button>
                            </div>

                            {/* Badge */}
                            {product.category && (
                                <Badge className="absolute top-4 left-4 bg-gold text-accent-foreground font-display">
                                    {product.category}
                                </Badge>
                            )}
                        </div>

                        {/* Thumbnail Images */}
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-3">
                                {images.map((img: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx
                                            ? "border-gold shadow-gold-md"
                                            : "border-gold/20 hover:border-gold/50"
                                            }`}
                                    >
                                        <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Right: Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        <div>
                            <h1 className="font-display text-3xl lg:text-4xl text-primary-foreground font-bold mb-2">
                                {product.name}
                            </h1>
                            <p className="text-gold-light/70 font-body italic">
                                {product.type} Collection
                            </p>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={18} className="text-gold fill-gold" />
                                ))}
                            </div>
                            <span className="text-gold-light text-sm">(248 reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="font-display text-4xl text-gold font-bold">
                                {product.price}
                            </span>
                            {product.original_price && (
                                <>
                                    <span className="text-xl text-gold-light/50 line-through">
                                        {product.original_price}
                                    </span>
                                    <Badge className="bg-green-600 text-white">
                                        Save {Math.round(((parseFloat(product.original_price.replace(/[^0-9.]/g, '')) - parseFloat(product.price.replace(/[^0-9.]/g, ''))) / parseFloat(product.original_price.replace(/[^0-9.]/g, ''))) * 100)}%
                                    </Badge>
                                </>
                            )}
                        </div>

                        <Separator className="bg-gold/20" />

                        {/* Description */}
                        <div>
                            <h3 className="font-display text-lg text-gold mb-2">Description</h3>
                            <p className="text-gold-light/80 font-body leading-relaxed">
                                {product.description || "Exquisite handcrafted piece from our heritage collection. Each item is carefully curated to bring you the finest quality and timeless elegance."}
                            </p>
                        </div>

                        <Separator className="bg-gold/20" />

                        {/* Product Specifications */}
                        <div>
                            <h3 className="font-display text-lg text-gold mb-3">Product Specifications</h3>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="bg-secondary/20 rounded-lg p-3 border border-gold/10">
                                    <p className="text-gold-light/60 text-xs mb-1">Category</p>
                                    <p className="text-primary-foreground font-semibold">{product.category}</p>
                                </div>
                                <div className="bg-secondary/20 rounded-lg p-3 border border-gold/10">
                                    <p className="text-gold-light/60 text-xs mb-1">Type</p>
                                    <p className="text-primary-foreground font-semibold">{product.type}</p>
                                </div>
                                <div className="bg-secondary/20 rounded-lg p-3 border border-gold/10">
                                    <p className="text-gold-light/60 text-xs mb-1">Availability</p>
                                    <p className="text-primary-foreground font-semibold">
                                        {product.stock_count > 0 ? `${product.stock_count} in stock` : "Out of stock"}
                                    </p>
                                </div>
                                <div className="bg-secondary/20 rounded-lg p-3 border border-gold/10">
                                    <p className="text-gold-light/60 text-xs mb-1">SKU</p>
                                    <p className="text-primary-foreground font-semibold">SD-{product.id.toString().padStart(5, '0')}</p>
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-gold/20" />

                        {/* Material & Care */}
                        <div>
                            <h3 className="font-display text-lg text-gold mb-3">Material & Care Instructions</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex gap-2">
                                    <span className="text-gold">•</span>
                                    <p className="text-gold-light/80">
                                        {product.type === "Saree" ? "100% Pure Silk with authentic gold zari work" :
                                            product.type === "Jewelry" ? "22K Gold plated with semi-precious stones" :
                                                "Sterling Silver with traditional craftsmanship"}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-gold">•</span>
                                    <p className="text-gold-light/80">Dry clean only for best results</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-gold">•</span>
                                    <p className="text-gold-light/80">Store in a cool, dry place away from direct sunlight</p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-gold">•</span>
                                    <p className="text-gold-light/80">Avoid contact with perfumes and chemicals</p>
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-gold/20" />

                        {/* Features */}
                        <Card className="bg-secondary/30 border-gold/20">
                            <CardContent className="p-6">
                                <h3 className="font-display text-lg text-gold mb-4">Why Choose Us</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <Truck className="text-gold mt-1" size={20} />
                                        <div>
                                            <p className="text-primary-foreground font-semibold text-sm">Free Shipping</p>
                                            <p className="text-gold-light/60 text-xs">On orders above ₹5,000</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Shield className="text-gold mt-1" size={20} />
                                        <div>
                                            <p className="text-primary-foreground font-semibold text-sm">Authenticity</p>
                                            <p className="text-gold-light/60 text-xs">100% Genuine Products</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <RefreshCw className="text-gold mt-1" size={20} />
                                        <div>
                                            <p className="text-primary-foreground font-semibold text-sm">Easy Returns</p>
                                            <p className="text-gold-light/60 text-xs">7-day return policy</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Star className="text-gold mt-1" size={20} />
                                        <div>
                                            <p className="text-primary-foreground font-semibold text-sm">Premium Quality</p>
                                            <p className="text-gold-light/60 text-xs">Handpicked collection</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button
                                onClick={handleAddToCart}
                                className="flex-1 bg-gold-gradient hover:shadow-gold-lg text-accent-foreground font-display font-bold h-14 uppercase tracking-wider text-base"
                            >
                                <ShoppingCart size={20} className="mr-2" />
                                {inCart ? `In Cart (${quantity})` : "Add to Cart"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleToggleLike}
                                className={`h-14 px-6 border-2 transition-all ${isLiked
                                    ? "bg-red-500 border-red-500 text-white hover:bg-red-600"
                                    : "border-gold/30 text-gold hover:bg-gold/10"
                                    }`}
                            >
                                <Heart size={22} fill={isLiked ? "currentColor" : "none"} />
                            </Button>
                        </div>
                    </motion.div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-20"
                    >
                        <div className="text-center mb-10">
                            <h2 className="font-display text-3xl lg:text-4xl text-gold uppercase tracking-wider mb-2">
                                You May Also Like
                            </h2>
                            <p className="text-gold-light/70 font-body">
                                Explore more from our {product.type} collection
                            </p>
                        </div>

                        {/* Decorative divider */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                            <span className="text-gold text-xl">✿</span>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                            {relatedProducts.map((prod, index) => (
                                <motion.div
                                    key={prod.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -8 }}
                                    onClick={() => {
                                        navigate(`/product/${prod.id}`);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="cursor-pointer group"
                                >
                                    <Card className="bg-secondary/30 border-gold/20 hover:border-gold/60 hover:shadow-gold-lg transition-all overflow-hidden">
                                        <div className="aspect-square relative overflow-hidden">
                                            <img
                                                src={prod.image}
                                                alt={prod.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            {prod.tag && (
                                                <div className="absolute top-2 left-2 bg-gold-gradient px-2 py-1 rounded-full">
                                                    <span className="text-[8px] font-bold text-accent-foreground uppercase tracking-wider">
                                                        {prod.tag}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <CardContent className="p-3 lg:p-4">
                                            <h3 className="font-display text-sm lg:text-base text-primary-foreground font-semibold line-clamp-1 mb-1">
                                                {prod.name}
                                            </h3>
                                            <p className="text-gold-light/60 text-xs mb-2">{prod.category}</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-gold font-bold text-base lg:text-lg">{prod.price}</p>
                                                {prod.original_price && (
                                                    <p className="text-gold-light/40 text-xs line-through">{prod.original_price}</p>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {/* View All Button */}
                        <div className="text-center mt-10">
                            <Button
                                onClick={() => navigate(`/${product.type.toLowerCase()}s`)}
                                className="bg-transparent border-2 border-gold text-gold hover:bg-gold/10 font-display uppercase tracking-wider px-8"
                            >
                                View All {product.type}s <ChevronRight size={18} className="ml-2" />
                            </Button>
                        </div>
                    </motion.section>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default ProductDetail;
