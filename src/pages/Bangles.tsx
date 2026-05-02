import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGrid from "@/components/ProductGrid";

const Bangles = () => {
    return (
        <div className="min-h-screen bg-primary">
            <Navbar />
            <main>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="pt-24 pb-12"
                >
                    <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
                        <h1 className="font-display text-xl lg:text-2xl font-bold text-gold uppercase tracking-widest">
                            Bangles
                        </h1>
                    </div>
                    <ProductGrid dark={true} type="Bangles" realtime={true} />
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default Bangles;
