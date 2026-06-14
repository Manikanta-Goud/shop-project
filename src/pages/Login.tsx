import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();

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
                        }
                    }
                });
                if (error) throw error;

                if (data.session) {
                    toast.success("Account created! Let's complete your profile ✦");
                    navigate("/profile");
                } else {
                    toast.success("Account created! Please verify your email, then complete your profile.");
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
                    toast.success("Welcome back! ✦");
                    navigate("/profile");
                }
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-primary flex flex-col">
            <Navbar />

            <main className="flex-1 flex items-center justify-center p-4 py-12 lg:py-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <Card className="bg-secondary/40 border-gold/30 shadow-gold-lg backdrop-blur-md overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient" />
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <span className="text-8xl text-gold">ॐ</span>
                        </div>

                        <CardHeader className="text-center relative z-10">
                            <CardTitle className="font-display text-3xl text-gold">
                                {isSignUp ? "Join Heritage" : "Member Login"}
                            </CardTitle>
                            <CardDescription className="text-muted-foreground/60 font-body italic text-lg mt-2">
                                {isSignUp ? "Begin your journey with Sri Durga Sarees" : "Welcome back to your royal collection"}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4 pt-6">
                            <form onSubmit={handleAuth} className="space-y-4">
                                {isSignUp && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="space-y-2"
                                    >
                                        <Label htmlFor="name" className="text-muted-foreground uppercase tracking-widest text-xs">Full Name</Label>
                                        <Input
                                            id="name"
                                            type="text"
                                            required={isSignUp}
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="bg-primary/50 border-gold/20 text-foreground-foreground focus:border-gold h-11"
                                        />
                                    </motion.div>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-muted-foreground uppercase tracking-widest text-xs">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="bg-primary/50 border-gold/20 text-foreground-foreground focus:border-gold h-11"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-muted-foreground uppercase tracking-widest text-xs">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="bg-primary/50 border-gold/20 text-foreground-foreground focus:border-gold h-11"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gold-gradient hover:shadow-gold text-accent-foreground font-display font-bold h-12 uppercase tracking-[0.2em]"
                                >
                                    {loading ? "Processing..." : (isSignUp ? "Create Account" : "Let me in")}
                                </Button>
                            </form>
                        </CardContent>

                        <CardFooter className="flex flex-col gap-4 border-t border-gold/10 pt-6">
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-muted-foreground/80 hover:text-gold transition-colors font-body italic text-sm"
                            >
                                {isSignUp ? "Already a member? Sign in" : "New to the temple? Create an account"}
                            </button>

                            <div className="flex items-center gap-4 w-full">
                                <div className="h-px bg-gold/10 flex-1" />
                                <span className="text-[10px] text-muted-foreground/30 uppercase tracking-[0.5em]">Heritage</span>
                                <div className="h-px bg-gold/10 flex-1" />
                            </div>
                        </CardFooter>
                    </Card>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default Login;
