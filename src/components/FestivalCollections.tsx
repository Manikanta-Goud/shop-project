import { motion } from "framer-motion";
import festivalDiwali from "@/assets/festival-diwali.jpg";
import { Link } from "react-router-dom";

const FestivalCollections = () => {
  return (
    <section className="py-16" id="festival">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h3 className="font-cursive text-gold-dark text-2xl mb-2">Celebrate in Style</h3>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-wider">
            Festival Collections
          </h2>
        </div>

        {/* Featured Festival Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden scalloped-border"
        >
          <img
            src={festivalDiwali}
            alt="Diwali Festival Collection"
            loading="lazy"
            decoding="async"
            className="w-full h-48 lg:h-72 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent flex items-center">
            <div className="p-8 lg:p-12">
              <p className="font-cursive text-muted-foreground text-xl lg:text-3xl mb-2">Celebrate</p>
              <h3 className="font-display text-2xl lg:text-4xl font-bold text-foreground-foreground tracking-wider mb-3">
                Diwali Collection 2026
              </h3>
              <p className="font-body text-foreground-foreground/70 mb-4 max-w-sm text-sm lg:text-base">
                Illuminate your festivities with our handpicked silk sarees and matching jewelry sets.
              </p>
              <Link
                to="/festival"
                className="inline-block px-8 py-2.5 bg-gold-gradient rounded-full font-display text-xs font-bold text-accent-foreground tracking-wider uppercase shadow-gold-lg"
              >
                Explore Now
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FestivalCollections;

