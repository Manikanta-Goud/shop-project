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
                    <header className="max-w-7xl mx-auto px-4 mb-12 text-center lg:text-left">
                        <h1 className="font-display text-4xl lg:text-6xl font-bold text-gold mb-4 uppercase tracking-tighter">
                            Bangles <span className="text-primary-foreground/20 italic">Collection</span>
                        </h1>
                        <p className="font-body text-gold-light/60 text-lg lg:text-xl max-w-2xl italic">
                            Adorn your wrists with the symphony of tradition. From temple gold bangles to contemporary festive designs.
                        </p>
                    </header>

                    <ProductGrid dark={true} type="Bangles" realtime={true} />
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default Bangles;
