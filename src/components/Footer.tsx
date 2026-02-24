import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Gold divider */}
      <div className="h-1 bg-gold-gradient" />

      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl text-gold">ॐ</span>
              <div>
                <h3 className="font-display text-lg font-bold text-primary-foreground tracking-wider">SRI DURGA</h3>
                <span className="font-body text-[10px] text-gold-light tracking-[0.3em] uppercase">Sarees</span>
              </div>
            </div>
            <p className="font-cursive text-gold-light text-lg mb-4">Drape the Divine</p>
            <p className="font-body text-sm text-primary-foreground/60 leading-relaxed">
              Handcrafted silk sarees woven with devotion and heritage since 1985.
            </p>
            <div className="flex gap-3 mt-4">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full border border-gold/30 flex items-center justify-center hover:bg-gold/10 hover:border-gold transition-colors"
                >
                  <Icon size={16} className="text-gold" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-bold text-gold tracking-wider mb-4 uppercase">Shop</h4>
            <ul className="space-y-2">
              {[
                { label: "Kanchipuram Silk", path: "/sarees" },
                { label: "Banarasi Silk", path: "/sarees" },
                { label: "Pochampally", path: "/sarees" },
                { label: "Bridal Collection", path: "/bridal" },
                { label: "Festival Specials", path: "/festival" },
                { label: "Jewelry", path: "/jewelry" },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="font-body text-sm text-primary-foreground/60 hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-sm font-bold text-gold tracking-wider mb-4 uppercase">Services</h4>
            <ul className="space-y-2">
              {[
                { label: "Virtual Try-On", path: "/virtual-tryon" },
                { label: "Custom Embroidery", path: "/virtual-tryon" },
                { label: "Bridal Planner", path: "/bridal" },
                { label: "AI Style Quiz", path: "/virtual-tryon" },
                { label: "Community", path: "/community" },
                { label: "Royal Queen Club", path: "/profile" },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="font-body text-sm text-primary-foreground/60 hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-bold text-gold tracking-wider mb-4 uppercase">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-gold mt-1 shrink-0" />
                <span className="font-body text-sm text-primary-foreground/60">
                  T. Nagar, Chennai, Tamil Nadu 600017
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-gold shrink-0" />
                <span className="font-body text-sm text-primary-foreground/60">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gold shrink-0" />
                <span className="font-body text-sm text-primary-foreground/60">hello@sridurgasarees.com</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="font-display text-xs font-semibold text-gold tracking-wider uppercase mb-2">Newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 rounded-full bg-secondary/30 border border-gold/20 text-sm font-body text-primary-foreground placeholder:text-primary-foreground/30 focus:outline-none focus:border-gold"
                />
                <button className="px-4 py-2 bg-gold-gradient rounded-full font-display text-[10px] font-bold text-accent-foreground shadow-gold">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-gold/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-primary-foreground/40">
            © 2026 Sri Durga Sarees. All rights reserved. Woven with ❤️ in India.
          </p>
          <div className="flex gap-4">
            {["Privacy Policy", "Terms", "Returns"].map((link) => (
              <a key={link} href="#" className="font-body text-xs text-primary-foreground/40 hover:text-gold transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
