import { motion } from "framer-motion";
import heroModel from "@/assets/hero-model.jpg";
import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";

const HeroBanner = () => {
  return (
    <section className="relative overflow-hidden bg-hero-gradient min-h-[70vh] lg:min-h-[85vh] flex items-center">
      {/* Background ornamental pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, hsl(43, 72%, 55%) 1px, transparent 1px),
                           radial-gradient(circle at 80% 50%, hsl(43, 72%, 55%) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left order-2 lg:order-1"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-cursive text-muted-foreground text-3xl lg:text-5xl xl:text-6xl mb-2"
          >
            Drape the Divine
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="font-display text-4xl lg:text-6xl xl:text-7xl font-bold text-foreground-foreground tracking-wider mb-6"
          >
            SRI DURGA
            <br />
            <span className="text-gold-gradient">SAREES</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="font-body text-lg lg:text-xl text-foreground-foreground/70 mb-8 max-w-md mx-auto lg:mx-0"
          >
            Handcrafted with devotion. Woven with heritage. Each thread tells a story of tradition and elegance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap gap-4 justify-center lg:justify-start"
          >
            <Link
              to="/sarees"
              className="px-8 py-3 bg-gold-gradient font-display text-sm font-semibold tracking-wider text-accent-foreground rounded-full shadow-gold-lg hover:shadow-gold transition-shadow duration-300 uppercase inline-flex items-center justify-center"
            >
              Explore Collection
            </Link>
            <a
              href="https://www.instagram.com/sri_durga_sarees_?igsh=MXFicm1neWN0b202NA=="
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-gold text-gold font-display text-sm font-semibold tracking-wider rounded-full hover:bg-gold/10 transition-colors duration-300 uppercase inline-flex items-center justify-center gap-2"
            >
              <Instagram size={18} />
              Instagram
            </a>
          </motion.div>
        </motion.div>

        {/* Right Hero Image Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="order-1 lg:order-2 flex justify-center"
        >
          <div className="relative">
            {/* Gold arch frame */}
            <div className="absolute -inset-4 temple-arch border-2 border-gold/40 rounded-b-2xl" />
            <div className="absolute -inset-6 temple-arch border border-gold/20 rounded-b-2xl" />
            <img
              src={heroModel}
              alt="Beautiful bridal model in silk saree"
              className="relative temple-arch rounded-b-2xl w-full max-w-lg object-cover h-[400px] lg:h-[550px] shadow-gold-lg"
            />
            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gold-gradient px-6 py-2 rounded-full shadow-gold-lg"
            >
              <span className="font-display text-sm font-bold text-accent-foreground tracking-wider">
                NEW ARRIVALS
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Decorative lotus bottom */}
      <div className="absolute bottom-0 left-0 right-0 text-center pb-4">
        <span className="text-gold/30 text-2xl tracking-[2rem]">✿ ✿ ✿</span>
      </div>
    </section>
  );
};

export default HeroBanner;
