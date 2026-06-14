import { motion } from "framer-motion";
import { Crown, Gift, Star, Share2 } from "lucide-react";

const tiers = [
  { name: "Silver", points: "0 - 999", benefits: "5% off all orders", color: "text-muted-foreground" },
  { name: "Gold", points: "1,000 - 4,999", benefits: "10% off + free shipping", color: "text-gold" },
  { name: "Diamond", points: "5,000+", benefits: "15% off + priority access", color: "text-gold-shimmer" },
];

const earnMethods = [
  { icon: ShoppingBagIcon, text: "₹1 spent = 1 point" },
  { icon: Star, text: "Write a review = 50 points" },
  { icon: Share2, text: "Share on Instagram = 25 points" },
  { icon: Gift, text: "Birthday bonus = 200 points" },
];

function ShoppingBagIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
}

const RewardsProgram = () => {
  return (
    <section className="py-16 bg-maroon-gradient relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `radial-gradient(circle, hsl(43, 72%, 55%) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <Crown className="w-10 h-10 text-gold mx-auto mb-3" />
          <h3 className="font-cursive text-muted-foreground text-3xl mb-1">Royal Queen Club</h3>
          <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground-foreground tracking-wider mb-2">
            Rewards & Loyalty Program
          </h2>
          <p className="font-body text-foreground-foreground/60 text-sm">
            Earn points with every purchase and unlock royal benefits 🎁
          </p>
        </div>

        {/* Tiers */}
        <div className="grid grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="text-center p-4 rounded-xl border border-gold/20 bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <Crown className={`w-6 h-6 mx-auto mb-2 ${tier.color}`} />
              <h4 className="font-display text-sm font-bold text-foreground-foreground">{tier.name}</h4>
              <p className="font-body text-[10px] text-foreground-foreground/50 mt-1">{tier.points} pts</p>
              <p className="font-body text-xs text-gold mt-2">{tier.benefits}</p>
            </motion.div>
          ))}
        </div>

        {/* Earn Methods */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {earnMethods.map((method, index) => (
            <motion.div
              key={method.text}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-lg border border-gold/15 bg-secondary/20"
            >
              <method.icon className="w-5 h-5 text-gold shrink-0" />
              <span className="font-body text-xs text-foreground-foreground/80">{method.text}</span>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="px-8 py-3 bg-gold-gradient rounded-full font-display text-sm font-bold text-accent-foreground tracking-wider uppercase shadow-gold-lg hover:shadow-gold transition-shadow">
            Join the Royal Queen Club
          </button>
        </div>
      </div>
    </section>
  );
};

export default RewardsProgram;
