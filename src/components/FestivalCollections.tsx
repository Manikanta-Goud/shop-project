import { motion } from "framer-motion";
import festivalDiwali from "@/assets/festival-diwali.jpg";

const festivals = [
  { name: "Diwali Collection", tag: "🪔 Festival of Lights" },
  { name: "Sankranti Special", tag: "🌾 Harvest Festival" },
  { name: "Ugadi Collection", tag: "🌸 New Beginnings" },
  { name: "Wedding Season", tag: "💒 Bridal Special" },
];

const FestivalCollections = () => {
  return (
    <section className="py-16" id="festival">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h3 className="font-cursive text-gold-dark text-2xl mb-2">Celebrate in Style</h3>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-primary tracking-wider">
            Festival Collections
          </h2>
        </div>

        {/* Featured Festival Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden mb-10 scalloped-border"
        >
          <img
            src={festivalDiwali}
            alt="Diwali Festival Collection"
            className="w-full h-48 lg:h-72 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent flex items-center">
            <div className="p-8 lg:p-12">
              <p className="font-cursive text-gold-light text-xl lg:text-3xl mb-2">Celebrate</p>
              <h3 className="font-display text-2xl lg:text-4xl font-bold text-primary-foreground tracking-wider mb-3">
                Diwali Collection 2026
              </h3>
              <p className="font-body text-primary-foreground/70 mb-4 max-w-sm text-sm lg:text-base">
                Illuminate your festivities with our handpicked silk sarees and matching jewelry sets.
              </p>
              <button className="px-8 py-2.5 bg-gold-gradient rounded-full font-display text-xs font-bold text-accent-foreground tracking-wider uppercase shadow-gold-lg">
                Explore Now
              </button>
            </div>
          </div>
        </motion.div>

        {/* Festival Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {festivals.map((festival, index) => (
            <motion.button
              key={festival.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-xl border border-gold/30 bg-background hover:bg-gold/5 hover:border-gold hover:shadow-card-hover transition-all duration-300 text-center group"
            >
              <span className="text-2xl mb-2 block">{festival.tag.split(" ")[0]}</span>
              <h4 className="font-display text-sm font-semibold text-primary group-hover:text-gold-dark transition-colors">
                {festival.name}
              </h4>
              <p className="font-body text-xs text-muted-foreground mt-1">
                {festival.tag.split(" ").slice(1).join(" ")}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FestivalCollections;
