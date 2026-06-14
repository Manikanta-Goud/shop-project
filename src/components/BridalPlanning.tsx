import { motion } from "framer-motion";
import { Download, CheckCircle } from "lucide-react";
import bridalImage from "@/assets/bridal-collection.jpg";
import { toast } from "sonner";

const checklist = [
  "Wedding Day Saree",
  "Engagement Outfit",
  "Haldi Ceremony",
  "Reception Lehenga",
  "Bridal Jewelry Set",
  "Matching Bangles",
];

const BridalPlanning = () => {
  return (
    <section className="py-16 bg-ivory-warm bg-secondary/30" id="bridal">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h3 className="font-cursive text-gold-dark text-2xl mb-2">Your Perfect Day</h3>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-wider">
            Bridal Planning 👰
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Bridal Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="scalloped-border rounded-2xl overflow-hidden">
              <img
                src={bridalImage}
                alt="Beautiful Indian bride"
                className="w-full h-[400px] lg:h-[500px] object-cover"
              />
            </div>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-gold-gradient px-6 py-2 rounded-full shadow-gold-lg"
            >
              <span className="font-display text-xs font-bold text-accent-foreground tracking-wider">
                COMPLETE BRIDAL SETS
              </span>
            </motion.div>
          </motion.div>

          {/* Planning Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-display text-xl font-bold text-foreground mb-2">
              Bridal Checklist
            </h3>
            <p className="font-body text-muted-foreground mb-6 text-sm">
              Everything you need for your special day, curated by our expert stylists.
            </p>

            <div className="space-y-3 mb-8">
              {checklist.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gold/20 bg-background hover:bg-gold/5 transition-colors"
                >
                  <CheckCircle className="text-gold shrink-0" size={18} />
                  <span className="font-body text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => toast.info("📄 PDF Checklist — Coming Soon! We're polishing this for you ✦")}
                className="px-6 py-2.5 bg-gold-gradient rounded-full font-display text-xs font-bold text-accent-foreground tracking-wider uppercase shadow-gold flex items-center gap-2"
              >
                <Download size={14} />
                Download Checklist PDF
              </button>
              <button
                onClick={() => toast.info("💍 Bridal Combos — Launching Soon! Stay tuned ✦")}
                className="px-6 py-2.5 border border-gold/50 rounded-full font-display text-xs font-semibold text-gold tracking-wider uppercase hover:bg-gold/10 transition-colors"
              >
                View Bridal Combos
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BridalPlanning;
