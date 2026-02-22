import { motion } from "framer-motion";
import { Bell, TrendingDown, Eye } from "lucide-react";

const SmartFeatures = () => {
  return (
    <section className="py-16 bg-ivory-warm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h3 className="font-cursive text-gold-dark text-2xl mb-2">Smart Shopping</h3>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-primary tracking-wider">
            Personalized for You
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Notify Me */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-xl border border-gold/30 bg-background hover:shadow-card-hover transition-all duration-300 text-center"
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-full border-2 border-gold/40 flex items-center justify-center bg-gold/5">
              <Bell className="w-6 h-6 text-gold" />
            </div>
            <h4 className="font-display text-base font-semibold text-primary mb-2">
              Notify Me When Back
            </h4>
            <p className="font-body text-sm text-muted-foreground mb-4">
              Never miss your favorite saree. Get notified instantly when it's restocked.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-full border border-gold/30 bg-background text-sm font-body focus:outline-none focus:border-gold text-foreground"
              />
              <button className="px-4 py-2 bg-gold-gradient rounded-full font-display text-xs font-bold text-accent-foreground shadow-gold">
                Notify
              </button>
            </div>
          </motion.div>

          {/* Price Drop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl border border-gold/30 bg-background hover:shadow-card-hover transition-all duration-300 text-center"
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-full border-2 border-gold/40 flex items-center justify-center bg-gold/5">
              <TrendingDown className="w-6 h-6 text-gold" />
            </div>
            <h4 className="font-display text-base font-semibold text-primary mb-2">
              Price Drop Alerts
            </h4>
            <p className="font-body text-sm text-muted-foreground mb-4">
              Set your budget and we'll alert you when your wishlist items drop in price.
            </p>
            <button className="px-6 py-2.5 border border-gold/50 rounded-full font-display text-xs font-semibold text-gold tracking-wider uppercase hover:bg-gold/10 transition-colors">
              Set Price Alert
            </button>
          </motion.div>

          {/* Recently Viewed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl border border-gold/30 bg-background hover:shadow-card-hover transition-all duration-300 text-center"
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-full border-2 border-gold/40 flex items-center justify-center bg-gold/5">
              <Eye className="w-6 h-6 text-gold" />
            </div>
            <h4 className="font-display text-base font-semibold text-primary mb-2">
              Gift Packaging 🎁
            </h4>
            <p className="font-body text-sm text-muted-foreground mb-4">
              Send as a royal gift with custom messages and premium packaging options.
            </p>
            <button className="px-6 py-2.5 border border-gold/50 rounded-full font-display text-xs font-semibold text-gold tracking-wider uppercase hover:bg-gold/10 transition-colors">
              Add Gift Message
            </button>
          </motion.div>
        </div>

        {/* Live Purchase Popup Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 max-w-sm mx-auto"
        >
          <div className="flex items-center gap-3 p-3 rounded-lg border border-gold/20 bg-background shadow-card">
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
              <span className="text-sm">🛍️</span>
            </div>
            <div>
              <p className="font-body text-xs text-foreground">
                <strong>Priya from Hyderabad</strong> just purchased
              </p>
              <p className="font-body text-xs text-gold-dark">Royal Kanchipuram Silk Saree</p>
              <p className="font-body text-[10px] text-muted-foreground">2 minutes ago</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SmartFeatures;
