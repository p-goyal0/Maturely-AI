import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { 
  Factory, 
  ShoppingBag, 
  Landmark, 
  Stethoscope, 
  GraduationCap, 
  Cpu,
  Truck,
  Building2,
  Plane,
  Wheat,
  Zap,
  Radio,
  LogOut
} from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import { SearchBar } from '../industry/SearchBar.jsx';
import { IndustryGrid } from '../industry/IndustryGrid.jsx';
import { StickyActionBar } from '../industry/StickyActionBar.jsx';

const industries = [
  { id: 'manufacturing', name: 'Manufacturing', description: 'Production & industrial operations', icon: Factory },
  { id: 'retail', name: 'Retail & E-commerce', description: 'Consumer goods & online sales', icon: ShoppingBag },
  { id: 'finance', name: 'Financial Services', description: 'Banking, insurance & investments', icon: Landmark },
  { id: 'healthcare', name: 'Healthcare', description: 'Medical services & pharmaceuticals', icon: Stethoscope },
  { id: 'education', name: 'Education', description: 'Learning institutions & EdTech', icon: GraduationCap },
  { id: 'technology', name: 'Technology', description: 'Software & IT services', icon: Cpu },
  { id: 'logistics', name: 'Logistics & Supply Chain', description: 'Transportation & warehousing', icon: Truck },
  { id: 'realestate', name: 'Real Estate', description: 'Property & construction', icon: Building2 },
  { id: 'travel', name: 'Travel & Hospitality', description: 'Tourism & accommodation', icon: Plane },
  { id: 'agriculture', name: 'Agriculture', description: 'Farming & food production', icon: Wheat },
  { id: 'energy', name: 'Energy & Utilities', description: 'Power generation & distribution', icon: Zap },
  { id: 'telecom', name: 'Telecommunications', description: 'Network & communication services', icon: Radio },
];

export function IndustrySelectionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const filteredIndustries = industries.filter(industry =>
    industry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    industry.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContinue = () => {
    if (selectedIndustry) {
      navigate("/assessments", { state: { industry: selectedIndustry } });
    }
  };

  const handleSignOut = () => {
    signOut();
    // Use setTimeout to ensure state updates before navigation
    setTimeout(() => {
      navigate("/");
    }, 0);
  };

  // Scroll detection for header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#46cdc6]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#46cdc6]/5 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <motion.div
        className={`fixed top-0 left-0 right-0 z-40 transition-transform duration-300 ${
          isScrolled ? "-translate-y-full" : "translate-y-0"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="pt-4 px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg px-6 lg:px-8 py-3 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/logo/wings.png" alt="Logo" className="h-10 w-10 lg:h-8 lg:w-12 transition-all duration-300 group-hover:scale-110" />
                <img src="/logo/maturely_logo.png" alt="MATURITY.AI" className="h-4 lg:h-5 transition-all duration-300 group-hover:scale-110" />
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-gray-900 font-semibold text-sm">
                  {currentUser?.username || 'User'}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity outline-none">
                      <Avatar className="h-10 w-10 bg-[#46cdc6]">
                        <AvatarFallback className="bg-[#46cdc6] text-white font-semibold">
                          {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 pt-32">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 relative"
        >
          <h1 className="text-4xl lg:text-6xl font-black mb-4 bg-gradient-to-r from-gray-900 to-[#46cdc6] bg-clip-text text-transparent">
            Select Your Industry
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Choose the industry that best represents your business to receive tailored AI recommendations and insights
          </p>
          
          {/* Animation Video - Top Right - Hidden for now */}
          {/* <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute top-0 right-0 w-32 h-32 lg:w-40 lg:h-40 overflow-hidden rounded-2xl"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover bg-transparent"
              style={{ backgroundColor: 'transparent' }}
            >
              <source src="/lottieFiles/industry.mp4" type="video/mp4" />
              <source src="/lottieFiles/industry.webm" type="video/webm" />
              Your browser does not support the video tag.
            </video>
          </motion.div> */}
        </motion.div>

        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />

        <IndustryGrid
          industries={filteredIndustries}
          selectedIndustry={selectedIndustry}
          setSelectedIndustry={setSelectedIndustry}
        />
      </div>

      <StickyActionBar 
        selectedIndustry={selectedIndustry}
        onContinue={handleContinue}
      />
    </div>
  );
}