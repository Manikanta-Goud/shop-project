import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const AuthModal = () => {
    const { showLoginModal, setShowLoginModal } = useAuth();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);

    if (!showLoginModal) return null;

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            phone: phone,
                            address: address,
                        }
                    }
                });
                if (error) throw error;

                if (data.session) {
                    toast.success("Account created! Welcome to our heritage collection ✦");
                    setShowLoginModal(false);
                } else {
                    toast.success("Account created! You can now sign in.");
                    setIsSignUp(false);
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) {
                    if (error.message.includes("Invalid login credentials")) {
                        toast.error("Account not found or invalid credentials. If you haven't joined yet, please create an account below! ✦");
                    } else {
                        throw error;
                    }
                } else {
                    toast.success("Welcome back!");
                    setShowLoginModal(false);
                }
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowLoginModal(false)}
                    className="absolute inset-0 bg-primary/80 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-secondary border-2 border-gold/30 shadow-gold-lg rounded-2xl overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient" />

                    <button
                        onClick={() => setShowLoginModal(false)}
                        className="absolute top-4 right-4 text-gold-light/60 hover:text-gold transition-colors z-20"
                    >
                        <X size={20} />
                    </button>

                    <div className="p-8">
                        <div className="text-center mb-8">
                            <span className="text-4xl text-gold mb-4 inline-block italic">ॐ</span>
                            <h2 className="font-display text-2xl text-gold font-bold uppercase tracking-wider">
                                {isSignUp ? "Join Heritage" : "Member Login"}
                            </h2>
                            <p className="font-body text-gold-light/60 italic mt-2">
                                {isSignUp ? "Begin your journey with Sri Durga Sarees" : "Welcome back to your royal collection"}
                            </p>
                        </div>

                        <form onSubmit={handleAuth} className="space-y-4">
                            {isSignUp && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="modal-name" className="text-gold-light uppercase tracking-widest text-[10px]">Full Name</Label>
                                        <Input
                                            id="modal-name"
                                            type="text"
                                            placeholder="Your Divine Name"
                                            required={isSignUp}
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="bg-primary/50 border-gold/20 text-primary-foreground focus:border-gold placeholder:text-primary-foreground/20 h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="modal-phone" className="text-gold-light uppercase tracking-widest text-[10px]">Phone Number</Label>
                                        <Input
                                            id="modal-phone"
                                            type="tel"
                                            placeholder="+91 XXXXX XXXXX"
                                            required={isSignUp}
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="bg-primary/50 border-gold/20 text-primary-foreground focus:border-gold placeholder:text-primary-foreground/20 h-11"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="modal-address" className="text-gold-light uppercase tracking-widest text-[10px]">Address</Label>
                                        <Input
                                            id="modal-address"
                                            type="text"
                                            placeholder="City, State, Country"
                                            required={isSignUp}
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="bg-primary/50 border-gold/20 text-primary-foreground focus:border-gold placeholder:text-primary-foreground/20 h-11"
                                        />
                                    </div>
                                </>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="modal-email" className="text-gold-light uppercase tracking-widest text-[10px]">Email Address</Label>
                                <Input
                                    id="modal-email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-primary/50 border-gold/20 text-primary-foreground focus:border-gold placeholder:text-primary-foreground/20 h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="modal-password" className="text-gold-light uppercase tracking-widest text-[10px]">Password</Label>
                                <Input
                                    id="modal-password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="bg-primary/50 border-gold/20 text-primary-foreground focus:border-gold h-11"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gold-gradient hover:shadow-gold text-accent-foreground font-display font-bold h-12 uppercase tracking-[0.2em] mt-2"
                            >
                                {loading ? "Processing..." : (isSignUp ? "Create Account" : "Let me in")}
                            </Button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-gold/10 text-center">
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-gold-light/80 hover:text-gold transition-colors font-body italic text-sm"
                            >
                                {isSignUp ? "Already a member? Sign in" : "New to the temple? Create an account"}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AuthModal;
