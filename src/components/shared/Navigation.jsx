import { Button } from "../ui/button";
import { Menu, X, Sparkles, LogOut } from 'lucide-react';
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, currentUser, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        // At the top, always show
        setIsScrolled(false);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down, hide nav
        setIsScrolled(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up, show nav
        setIsScrolled(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { label: "Home", path: "/" },
  ];

  // Check if we're on a page that should have the white strip (not landing page)
  const isLandingPage = location.pathname === '/';
  
  return (
    <motion.nav 
      className={isLandingPage ? "fixed top-0 left-0 right-0 z-50 bg-transparent" : "relative z-10 bg-transparent"}
      initial={{ y: 0 }}
      animate={{ y: isLandingPage && isScrolled ? -100 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className={isLandingPage ? "container mx-auto px-4 sm:px-6 lg:px-8" : ""}>
        <div className="flex items-center justify-between h-12 lg:h-14">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-3 group relative"
          >
            <img 
              src="/logo/wings.png" 
              alt="AI Maturity Platform Logo" 
              className="h-8 w-10 lg:h-8 lg:w-12 transition-all duration-300 group-hover:scale-110"
            />
            <img 
              src="/logo/maturely_logo.png" 
              alt="MATURITY.AI" 
              className="h-4 lg:h-5 transition-all duration-300 group-hover:scale-110"
            />
          </motion.button>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <Button
                  variant="ghost"
                  onClick={() => navigate(item.path)}
                  className={`text-sm relative group transition-colors duration-300 ${
                    location.pathname === item.path
                      ? "text-blue-400"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="navUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <span className="text-sm text-slate-300">Welcome, <span className="text-blue-400 font-semibold">{currentUser?.username}</span></span>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 }} whileHover={{ scale: 1.05 }}>
                  <Button
                    variant="outline"
                    onClick={() => {
                      signOut();
                      navigate("/");
                    }}
                    className="text-sm border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/signin")}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Sign In
                  </Button>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 }}>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/signup")}
                    className="text-sm border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                  >
                    Sign Up
                  </Button>
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} whileHover={{ scale: 1.05 }}>
                  <Button
                    onClick={() => navigate("/signin")}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-sm glow-primary shadow-lg"
                  >
                    Get Started
                  </Button>
                </motion.div>
              </>
            )}
          </div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div animate={{ rotate: mobileMenuOpen ? 90 : 0 }} transition={{ duration: 0.3 }}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={mobileMenuOpen ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden overflow-hidden border-t border-white/10"
        >
          <div className="py-4 space-y-2">
            {navItems.map((item, index) => (
              <motion.button
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={mobileMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 rounded-lg transition-all ${
                  location.pathname === item.path
                    ? "bg-blue-500/10 text-blue-400"
                    : "text-muted-foreground hover:bg-white/5"
                }`}
              >
                {item.label}
              </motion.button>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm text-slate-300">
                    Welcome, <span className="text-blue-400 font-semibold">{currentUser?.username}</span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      signOut();
                      navigate("/");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => { navigate("/signin"); setMobileMenuOpen(false); }} className="w-full">Sign In</Button>
                  <Button variant="outline" onClick={() => { navigate("/signup"); setMobileMenuOpen(false); }} className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10">Sign Up</Button>
                  <Button onClick={() => { navigate("/signin"); setMobileMenuOpen(false); }} className="w-full bg-gradient-to-r from-blue-600 to-cyan-500">Get Started</Button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
}
