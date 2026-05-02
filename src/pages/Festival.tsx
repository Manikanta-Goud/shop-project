import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";
import { motion } from "framer-motion";

const Festival = () => {
    return (
        <div className="min-h-screen bg-primary">
            <Navbar />
            <main className="pt-20">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-w-7xl mx-auto px-4 pt-6 pb-12"
                >
                    <h1 className="font-display text-xl lg:text-2xl text-gold uppercase tracking-[0.2em] mb-2 text-center">Festival Collections</h1>
                    <ProductGrid dark={true} type="Festival" realtime={true} />
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default Festival;
