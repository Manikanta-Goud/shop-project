import { motion, AnimatePresence } from "framer-motion";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const AuthModal = () => {
    const { showLoginModal, setShowLoginModal } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);

    if (!showLoginModal) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowLoginModal(false)}
                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-full max-w-md bg-gradient-to-b from-secondary to-secondary/90 border border-gold/40 shadow-2xl shadow-gold/20 rounded-2xl sm:rounded-3xl overflow-hidden max-h-[95vh] overflow-y-auto"
                >
                    {/* Top accent */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gold-gradient"></div>

                    {/* Close button */}
                    <button
                        onClick={() => setShowLoginModal(false)}
                        className="absolute top-4 sm:top-5 right-4 sm:right-5 text-gold-light/40 hover:text-gold transition-colors z-20 p-1 hover:bg-gold/10 rounded-full"
                    >
                        <X size={20} className="sm:w-[22px] sm:h-[22px]" />
                    </button>

                    <div className="p-6 sm:p-10 pt-10 sm:pt-12">
                        {/* Header */}
                        <div className="text-center mb-6 sm:mb-8">
                            <motion.span 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl sm:text-5xl text-gold mb-3 sm:mb-4 inline-block italic drop-shadow-gold"
                            >
                                ॐ
                            </motion.span>
                            <h2 className="font-display text-2xl sm:text-3xl text-gold font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-2">
                                {isSignUp ? "Join Heritage" : "Member Login"}
                            </h2>
                            <p className="font-body text-gold-light/70 italic text-xs sm:text-sm px-2">
                                {isSignUp ? "Begin your journey with Sri Durga Sarees" : "Welcome back to your royal collection"}
                            </p>
                        </div>

                        {/* Clerk Auth Component */}
                        <div className="clerk-modal-wrapper">
                            {isSignUp ? (
                                <SignUp 
                                    appearance={{
                                        elements: {
                                            rootBox: "w-full",
                                            card: "bg-transparent shadow-none w-full",
                                            formButtonPrimary: "bg-gold-gradient hover:shadow-gold-lg text-secondary font-display font-bold uppercase tracking-wider py-2.5 transition-all duration-300",
                                            formFieldInput: "bg-black/20 border-gold/20 text-white focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-white/20",
                                            footerActionLink: "text-gold hover:text-gold-light font-semibold transition-colors",
                                            footerActionText: "text-white/60 font-body",
                                            identityPreviewText: "text-white",
                                            formFieldLabel: "text-gold/90 uppercase tracking-widest text-[11px] font-bold mb-1.5",
                                            headerTitle: "text-gold font-display text-xl sm:text-2xl font-bold tracking-tight",
                                            headerSubtitle: "text-white/70 font-body text-sm",
                                            dividerLine: "bg-gold/20",
                                            dividerText: "text-gold/40 text-[10px] uppercase font-bold tracking-[0.2em]",
                                            socialButtonsBlockButton: "bg-white/5 border-gold/10 hover:bg-gold/10 hover:border-gold/30 transition-all",
                                            socialButtonsBlockButtonText: "text-white/90 font-body font-medium",
                                            formFieldInputShowPasswordButton: "text-gold-light/40 hover:text-gold",
                                            footer: "hidden", // Hide Clerk's footer since we have a custom one
                                            breadcrumbs: "hidden"
                                        }
                                    }}
                                    routing="hash"
                                    afterSignUpUrl="/"
                                />
                            ) : (
                                <SignIn 
                                    appearance={{
                                        elements: {
                                            rootBox: "w-full",
                                            card: "bg-transparent shadow-none w-full",
                                            formButtonPrimary: "bg-gold-gradient hover:shadow-gold-lg text-secondary font-display font-bold uppercase tracking-wider py-2.5 transition-all duration-300",
                                            formFieldInput: "bg-black/20 border-gold/20 text-white focus:border-gold focus:ring-1 focus:ring-gold/30 transition-all placeholder:text-white/20",
                                            footerActionLink: "text-gold hover:text-gold-light font-semibold transition-colors",
                                            footerActionText: "text-white/60 font-body",
                                            identityPreviewText: "text-white",
                                            formFieldLabel: "text-gold/90 uppercase tracking-widest text-[11px] font-bold mb-1.5",
                                            headerTitle: "text-gold font-display text-xl sm:text-2xl font-bold tracking-tight",
                                            headerSubtitle: "text-white/70 font-body text-sm",
                                            dividerLine: "bg-gold/20",
                                            dividerText: "text-gold/40 text-[10px] uppercase font-bold tracking-[0.2em]",
                                            socialButtonsBlockButton: "bg-white/5 border-gold/10 hover:bg-gold/10 hover:border-gold/30 transition-all",
                                            socialButtonsBlockButtonText: "text-white/90 font-body font-medium",
                                            formFieldInputShowPasswordButton: "text-gold-light/40 hover:text-gold",
                                            footer: "hidden", // Hide Clerk's footer since we have a custom one
                                            breadcrumbs: "hidden"
                                        }
                                    }}
                                    routing="hash"
                                    afterSignInUrl="/"
                                />
                            )}
                        </div>

                        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-gold/20 text-center">
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                className="text-white/60 hover:text-gold transition-colors font-body text-xs sm:text-sm group"
                            >
                                {isSignUp ? (
                                    <>Already a member? <span className="text-gold font-bold group-hover:underline ml-1">Sign in</span></>
                                ) : (
                                    <>New to the temple? <span className="text-gold font-bold group-hover:underline ml-1">Create an account</span></>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AuthModal;
