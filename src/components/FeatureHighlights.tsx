import { motion } from "framer-motion";
import { Sparkles, Palette, Heart, Scissors } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "Virtual Try-On",
    description: "AI-powered saree draping preview on different skin tones",
  },
  {
    icon: Palette,
    title: "AI Style Quiz",
    description: "Get personalized recommendations based on your preferences",
  },
  {
    icon: Heart,
    title: "Bridal Planner",
    description: "Complete bridal checklist with combo sets for every ceremony",
  },
  {
    icon: Scissors,
    title: "Custom Embroidery",
    description: "Design your own blouse patterns with instant price estimates",
  },
];

const FeatureHighlights = () => {
  return (
    <section className="py-16 bg-ivory-warm" id="virtual-tryon">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h3 className="font-cursive text-gold-dark text-2xl mb-2">Premium Features</h3>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground tracking-wider">
            Experience the Divine
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ y: -6 }}
              className="group text-center"
            >
              <div className="w-20 h-20 lg:w-24 lg:h-24 mx-auto mb-4 rounded-full border-2 border-gold/40 flex items-center justify-center bg-background group-hover:bg-gold/10 group-hover:border-gold group-hover:shadow-gold transition-all duration-500">
                <feature.icon className="w-8 h-8 lg:w-10 lg:h-10 text-gold group-hover:text-gold-dark transition-colors" />
              </div>
              <h4 className="font-display text-sm lg:text-base font-semibold text-foreground mb-2">
                {feature.title}
              </h4>
              <p className="font-body text-xs lg:text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
