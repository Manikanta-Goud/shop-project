import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BridalPlanning from "@/components/BridalPlanning";
import { motion } from "framer-motion";

const Bridal = () => {
    return (
        <div className="min-h-screen bg-primary">
            <Navbar />
            <main className="pt-20 text-primary-foreground">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-w-7xl mx-auto px-4 py-12"
                >
                    <header className="text-center mb-16">
                        <h1 className="font-display text-4xl lg:text-6xl text-gold mb-4 uppercase tracking-[0.2em]">Bridal Couture</h1>
                        <p className="font-body text-gold-light/80 max-w-2xl mx-auto italic">
                            Experience the divine grace of our bridal collection, designed for the modern bride who cherishes royal heritage.
                        </p>
                    </header>

                    <BridalPlanning />
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default Bridal;
