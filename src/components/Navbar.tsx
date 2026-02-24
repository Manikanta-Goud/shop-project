import { useState } from "react";
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Sarees", href: "/sarees", children: ["Kanchipuram", "Banarasi", "Pochampally", "Chanderi", "Mysore Silk"] },
  { label: "Gajulu", href: "/gajulu", children: ["Temple Gold", "Diamond", "Silk Thread", "Glass Festive"] },
  { label: "Bridal", href: "/bridal" },
  { label: "Jewelry", href: "/jewelry" },
  { label: "Festival Collections", href: "/festival", children: ["Diwali", "Sankranti", "Ugadi", "Wedding Season"] },
  { label: "Virtual Try-On", href: "/virtual-tryon" },
  { label: "Community", href: "/community" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50">
      {/* Announcement Bar */}
      <div className="bg-secondary text-gold-light text-center py-1.5 text-sm font-body tracking-wider">
        ✦ Free Shipping on Orders Above ₹5,000 &nbsp;|&nbsp; 25,000+ Designs &nbsp;|&nbsp; World-Wide Shipping ✦
      </div>

      {/* Main Nav */}
      <nav className="bg-primary border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 lg:h-20">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-primary-foreground"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <span className="text-3xl lg:text-4xl text-gold">ॐ</span>
            <div className="text-center">
              <h1 className="font-display text-primary-foreground text-lg lg:text-xl font-bold tracking-wider leading-tight">
                SRI DURGA
              </h1>
              <span className="text-gold-light text-[10px] lg:text-xs tracking-[0.3em] font-body uppercase">
                Sarees
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={link.href}
                  className="font-display text-sm text-primary-foreground hover:text-gold transition-colors duration-300 flex items-center gap-1"
                >
                  {link.label}
                  {link.children && <ChevronDown size={12} />}
                </Link>
                {link.children && activeDropdown === link.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 mt-2 bg-primary border border-gold/30 rounded-lg shadow-gold-lg py-2 min-w-48"
                  >
                    {link.children.map((child) => (
                      <a
                        key={child}
                        href="#"
                        className="block px-4 py-2 text-sm font-body text-primary-foreground hover:text-gold hover:bg-secondary/50 transition-colors"
                      >
                        {child}
                      </a>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-primary-foreground hover:text-gold transition-colors"
            >
              <Search size={20} />
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="text-primary-foreground hover:text-gold transition-colors hidden sm:block"
            >
              <User size={20} />
            </button>
            <button className="text-primary-foreground hover:text-gold transition-colors relative">
              <Heart size={20} />
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                3
              </span>
            </button>
            <button className="text-primary-foreground hover:text-gold transition-colors relative">
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                2
              </span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gold/20 overflow-hidden"
            >
              <div className="max-w-2xl mx-auto px-4 py-3">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search for Kanchipuram, Banarasi, Bridal Sarees..."
                    className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-gold/30 rounded-full text-primary-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30"
                    autoFocus
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-0 top-[calc(2.5rem+4rem)] z-50 bg-primary lg:hidden"
          >
            <div className="p-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block font-display text-lg text-primary-foreground hover:text-gold py-2 border-b border-gold/10"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/profile"
                className="block font-display text-lg text-gold py-2 border-b border-gold/10"
                onClick={() => setMobileOpen(false)}
              >
                My Profile
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
