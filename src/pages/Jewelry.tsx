import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import ProductGrid from "@/components/ProductGrid";

const Jewelry = () => {
    return (
        <div className="min-h-screen bg-primary">
            <Navbar />
            <main className="pt-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-w-7xl mx-auto px-4 py-12"
                >
                    <header className="text-center mb-16">
                        <h1 className="font-display text-4xl lg:text-6xl text-gold mb-4 uppercase tracking-[0.2em]">Divine Jewelry</h1>
                        <p className="font-body text-gold-light/80 max-w-2xl mx-auto italic">
                            Adorn yourself with pieces that transcend time. Our heritage jewelry collection is handcrafted to complement your divine grace.
                        </p>
                    </header>

                    <ProductGrid dark={true} type="Jewelry" />
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default Jewelry;