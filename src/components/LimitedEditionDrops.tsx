import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Flame } from "lucide-react";
import sareeRed from "@/assets/saree-red-gold.jpg";
import sareePurple from "@/assets/saree-purple-gold.jpg";

const drops = [
  { id: 1, name: "Heritage Temple Border Silk", price: "₹18,999", image: sareeRed, remaining: 7 },
  { id: 2, name: "Royal Purple Pattu Silk", price: "₹22,499", image: sareePurple, remaining: 3 },
];

const LimitedEditionDrops = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-maroon-gradient relative overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle, hsl(43, 72%, 55%) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Flame className="text-gold animate-glow-pulse" size={24} />
            <h3 className="font-display text-2xl lg:text-3xl font-bold text-primary-foreground tracking-wider">
              Limited Edition Drops
            </h3>
            <Flame className="text-gold animate-glow-pulse" size={24} />
          </div>
          <p className="font-body text-primary-foreground/60 mb-6">This week's exclusive — only few pieces left!</p>

          {/* Countdown */}
          <div className="flex items-center justify-center gap-4">
            <Clock className="text-gold" size={20} />
            {Object.entries(timeLeft).map(([label, value]) => (
              <div key={label} className="text-center">
                <div className="w-14 h-14 bg-secondary/80 border border-gold/30 rounded-lg flex items-center justify-center">
                  <span className="font-display text-2xl font-bold text-gold">
                    {String(value).padStart(2, "0")}
                  </span>
                </div>
                <span className="font-body text-[10px] text-primary-foreground/50 uppercase mt-1 block">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {drops.map((drop, index) => (
            <motion.div
              key={drop.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group bg-secondary/40 border border-gold/20 rounded-xl overflow-hidden hover:border-gold/50 transition-all duration-500"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={drop.image}
                  alt={drop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-4 text-center">
                <h4 className="font-display text-sm font-semibold text-primary-foreground">{drop.name}</h4>
                <p className="font-display text-lg font-bold text-gold mt-1">{drop.price}</p>
                <p className="font-body text-xs text-crimson mt-1">
                  Only {drop.remaining} pieces left!
                </p>
                <button className="mt-3 w-full py-2.5 bg-gold-gradient rounded-full font-display text-xs font-bold text-accent-foreground tracking-wider uppercase shadow-gold hover:shadow-gold-lg transition-shadow">
                  Shop Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LimitedEditionDrops;
