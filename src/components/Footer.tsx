import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from "lucide-react";


import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary/30 border-t border-gold/20 text-foreground py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="text-center md:text-left">
          <h3 className="font-display text-lg font-bold tracking-widest text-foreground">SRI DURGA</h3>
          <span className="font-body text-[10px] text-muted-foreground tracking-[0.3em] uppercase block mt-1">Sarees</span>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/sarees" className="font-body text-xs text-muted-foreground hover:text-gold transition-colors uppercase tracking-wider">Shop</Link>
          <Link to="/bridal" className="font-body text-xs text-muted-foreground hover:text-gold transition-colors uppercase tracking-wider">Bridal</Link>
          <a href="#" className="font-body text-xs text-muted-foreground hover:text-gold transition-colors uppercase tracking-wider">About Us</a>
          <a href="#" className="font-body text-xs text-muted-foreground hover:text-gold transition-colors uppercase tracking-wider">Contact</a>
        </div>

        {/* Copyright */}
        <div className="text-center md:text-right">
          <p className="font-body text-[10px] text-muted-foreground/60 uppercase tracking-widest">
            © 2026 Sri Durga Sarees.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
