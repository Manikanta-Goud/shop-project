import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BridalPlanning from "@/components/BridalPlanning";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Bell, Crown, Sparkles, Heart, Calendar, Star } from "lucide-react";
import { toast } from "sonner";

// Countdown target: 30 days from now
const TARGET_DATE = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

const getTimeLeft = () => {
    const diff = TARGET_DATE.getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
};

const upcomingFeatures = [
    { icon: Crown, label: "Virtual Bridal Try-On", desc: "See the saree on you before buying" },
    { icon: Sparkles, label: "AI Style Advisor", desc: "Personalised bridal recommendations" },
    { icon: Heart, label: "Wishlist Mood Board", desc: "Curate your dream bridal look" },
    { icon: Calendar, label: "Appointment Booking", desc: "Book a personal stylist session" },
];

const Bridal = () => {
    const [timeLeft, setTimeLeft] = useState(getTimeLeft());
    const [email, setEmail] = useState("");

    useEffect(() => {
        const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleNotify = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        toast.success("✦ You'll be the first to know when we launch!");
        setEmail("");
    };

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

                {/* ── Coming Soon Section ─────────────────────────────────────── */}
                <section className="relative py-20 overflow-hidden">
                    {/* Background */}
                    <div className="absolute inset-0 bg-gradient-to-b from-primary via-secondary to-primary" />
                    <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: `radial-gradient(circle, hsl(43,72%,55%) 1px, transparent 1px)`,
                        backgroundSize: "40px 40px"
                    }} />

                    {/* Glowing orbs */}
                    <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gold/5 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gold/5 blur-3xl pointer-events-none" />

                    <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">

                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gold/40 bg-gold/10 mb-8"
                        >
                            <Star size={14} className="text-gold fill-gold" />
                            <span className="font-display text-xs text-gold uppercase tracking-[0.25em] font-bold">Full Bridal Suite</span>
                            <Star size={14} className="text-gold fill-gold" />
                        </motion.div>

                        {/* Heading */}
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="font-cursive text-5xl lg:text-7xl text-gold mb-4"
                        >
                            Coming Soon
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="font-body text-gold-light/70 text-lg max-w-xl mx-auto mb-12 italic"
                        >
                            We're weaving something magical for every bride-to-be.
                            Our full bridal experience launches soon.
                        </motion.p>

                        {/* Countdown */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="flex justify-center gap-4 lg:gap-8 mb-14"
                        >
                            {Object.entries(timeLeft).map(([unit, value]) => (
                                <div key={unit} className="text-center">
                                    <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-2xl border-2 border-gold/30 bg-secondary/60 backdrop-blur flex items-center justify-center shadow-gold mb-2">
                                        <span className="font-display text-2xl lg:text-4xl font-bold text-gold">
                                            {String(value).padStart(2, "0")}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-gold-light/50 uppercase tracking-[0.2em] font-bold">{unit}</span>
                                </div>
                            ))}
                        </motion.div>

                        {/* Upcoming Features Grid */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14"
                        >
                            {upcomingFeatures.map(({ icon: Icon, label, desc }, i) => (
                                <motion.div
                                    key={label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                    className="bg-secondary/40 border border-gold/20 rounded-2xl p-5 text-center hover:border-gold/50 hover:bg-secondary/60 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-3">
                                        <Icon size={20} className="text-gold" />
                                    </div>
                                    <p className="font-display text-xs font-bold text-primary-foreground uppercase tracking-wide mb-1">{label}</p>
                                    <p className="font-body text-[11px] text-gold-light/50 italic">{desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Notify Me */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.6 }}
                        >
                            <p className="font-body text-gold-light/60 text-sm mb-4 italic">
                                Be the first bride to experience it — get notified on launch
                            </p>
                            <form onSubmit={handleNotify} className="flex gap-3 max-w-md mx-auto">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="flex-1 px-4 py-3 rounded-full bg-secondary/50 border border-gold/30 text-primary-foreground placeholder:text-gold-light/30 focus:outline-none focus:border-gold text-sm font-body"
                                />
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-6 py-3 bg-gold-gradient rounded-full font-display text-xs font-bold text-accent-foreground tracking-wider uppercase shadow-gold hover:shadow-gold-lg transition-all whitespace-nowrap"
                                >
                                    <Bell size={14} />
                                    Notify Me
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Bridal;

