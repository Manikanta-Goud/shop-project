import { motion } from "framer-motion";
import { Instagram, Camera } from "lucide-react";
import communityImage from "@/assets/community-styled.jpg";

const CommunitySection = () => {
  return (
    <section className="py-16" id="community">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h3 className="font-cursive text-gold-dark text-2xl mb-2">Our Beautiful Queens</h3>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-wider mb-3">
            Styled by Our Queens 📸
          </h2>
          <p className="font-body text-muted-foreground text-sm max-w-md mx-auto">
            Real customers, real stories. Share your look and get featured on our page!
          </p>
        </div>

        {/* Community Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
        >
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="group relative aspect-square rounded-xl overflow-hidden scalloped-border">
              <img
                src={communityImage}
                alt={`Customer styled look ${i}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                style={{ objectPosition: `${i * 20}% center` }}
              />
              <div className="absolute inset-0 bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center">
                  <Instagram className="w-6 h-6 text-gold mx-auto mb-1" />
                  <span className="font-display text-xs text-foreground-foreground">@queen_style_{i}</span>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <div className="text-center flex flex-wrap justify-center gap-4">
          <button className="px-8 py-3 bg-gold-gradient rounded-full font-display text-sm font-bold text-accent-foreground tracking-wider uppercase shadow-gold flex items-center gap-2">
            <Camera size={16} />
            Tag & Get Featured
          </button>
          <button className="px-8 py-3 border border-gold/50 rounded-full font-display text-sm font-semibold text-gold tracking-wider uppercase hover:bg-gold/10 transition-colors flex items-center gap-2">
            <Instagram size={16} />
            Follow @SriDurgaSarees
          </button>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
