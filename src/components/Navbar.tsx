import { useState, useEffect, useCallback } from "react";
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const navLinks = [
  { label: "Home", href: "/", protected: false },
  { label: "Sarees", href: "/sarees", protected: false, children: ["Silk", "Cotton", "Banarasi", "Gadget", "Chanderi", "Sofia", "Fancy"] },
  { label: "Bangles", href: "/bangles", protected: false, children: ["Temple Gold", "Diamond", "Silk Thread", "Glass Festive"] },
  { label: "Bridal", href: "/bridal", protected: false },
  { label: "Jewelry", href: "/jewelry", protected: false },
  { label: "Festival Collections", href: "/festival", protected: false, children: ["Diwali", "Sankranti", "Ugadi", "Wedding Season"] },
  { label: "Offers", href: "/offers", protected: false },
  { label: "Community", href: "/community", protected: false },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
  const { user, profile, setShowLoginModal, signOut } = useAuth();

  const fetchCounts = useCallback(async () => {
    if (!user) return;
    
    // Fetch wishlist count
    const { count: wCount } = await supabase
      .from('wishlist')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    
    // Fetch cart count
    const { count: cCount } = await supabase
      .from('cart')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);
    
    setWishlistCount(wCount || 0);
    setCartCount(cCount || 0);
  }, [user]);

  // Fetch wishlist and cart counts
  useEffect(() => {
    if (user) {
      fetchCounts();
    } else {
      setWishlistCount(0);
      setCartCount(0);
    }
  }, [user, fetchCounts]);

  const handleUserIconClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      setShowLoginModal(true);
    }
  };



  const handleNavigation = (href: string, isProtected: boolean, e: React.MouseEvent) => {
    // Only block navigation if user is logged in but hasn't completed profile
    if (isProtected && user && (!profile?.full_name?.trim())) {
      e.preventDefault();
      navigate("/profile");
      return;
    }
    // No login required to browse — let them navigate freely
  };

  return (
    <header className="sticky top-0 z-50">


      {/* Main Nav */}
      <nav className="bg-primary border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 lg:h-20">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-foreground-foreground"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="text-center">
              <h1 className="font-display text-foreground text-lg lg:text-xl font-bold tracking-wider leading-tight">
                SRI DURGA
              </h1>
              <span className="text-muted-foreground text-[10px] lg:text-xs tracking-[0.3em] font-body uppercase">
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
                  onClick={(e) => handleNavigation(link.href, link.protected, e)}
                  className={`font-display text-sm transition-colors duration-300 flex items-center gap-1 ${
                    link.protected && user && !profile?.full_name?.trim() 
                      ? 'text-gold/50 cursor-not-allowed' 
                      : 'text-foreground-foreground hover:text-gold'
                  }`}
                  title={
                    link.protected && user && !profile?.full_name?.trim() 
                      ? 'Please complete your profile first' 
                      : ''
                  }
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
                        className="block px-4 py-2 text-sm font-body text-foreground-foreground hover:text-gold hover:bg-secondary/50 transition-colors"
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
              className="text-foreground-foreground hover:text-gold transition-colors"
            >
              <Search size={20} />
            </button>
            <button
              onClick={handleUserIconClick}
              className="text-foreground-foreground hover:text-gold transition-colors hidden sm:flex items-center gap-2 group"
              title={user ? `Signed in as ${profile?.full_name || user.email}` : "Sign in"}
            >
              <User size={20} className={user ? "text-gold" : ""} />
              {user && profile?.full_name && (
                <span className="text-xs text-muted-foreground/80 hidden lg:block max-w-[100px] truncate">
                  {profile.full_name}
                </span>
              )}
            </button>
            <button 
              onClick={() => navigate('/wishlist')}
              className="text-foreground-foreground hover:text-gold transition-colors relative"
              title="Wishlist"
            >
              <Heart size={20} className={wishlistCount > 0 ? 'fill-gold text-gold' : ''} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => navigate('/cart')}
              className="text-foreground-foreground hover:text-gold transition-colors relative"
              title="Shopping Bag"
            >
              <ShoppingBag size={20} className={cartCount > 0 ? 'text-gold' : ''} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
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
                    placeholder="Search for Silk, Banarasi, Cotton, Chanderi..."
                    className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-gold/30 rounded-full text-foreground-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/30"
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
                  onClick={(e) => {
                    setMobileOpen(false);
                    handleNavigation(link.href, link.protected, e);
                  }}
                  className={`block font-display text-lg py-2 border-b border-gold/10 ${
                    link.protected && user && !profile?.full_name?.trim() 
                      ? 'text-gold/50 cursor-not-allowed' 
                      : 'text-foreground-foreground hover:text-gold'
                  }`}
                >
                  {link.label}
                  {link.protected && user && !profile?.full_name?.trim() && (
                    <span className="block text-xs text-gold/40 mt-1">Complete profile to access</span>
                  )}
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
