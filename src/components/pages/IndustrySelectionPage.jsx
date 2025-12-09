import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import { StickyActionBar } from '../industry/StickyActionBar.jsx';

const industries = [
  { id: 'aerospace-defense', name: 'Aerospace & Defense', description: 'Aerospace & defense operations' },
  { id: 'agriculture-forestry', name: 'Agriculture & Forestry', description: 'Farming, forestry & food production' },
  { id: 'architecture-engineering', name: 'Architecture & Engineering', description: 'Design & engineering services' },
  { id: 'automotive-mobility', name: 'Automotive & Mobility', description: 'Automotive & transportation solutions' },
  { id: 'construction', name: 'Construction', description: 'Building & infrastructure development' },
  { id: 'education', name: 'Education', description: 'Learning institutions & EdTech' },
  { id: 'energy-oil-gas-mining', name: 'Energy: Oil, Gas & Mining', description: 'Oil, gas & mining operations' },
  { id: 'energy-utilities-renewables', name: 'Energy: Utilities & Renewables', description: 'Power generation & renewable energy' },
  { id: 'financial-services', name: 'Financial Services', description: 'Banking, insurance & investments' },
  { id: 'government-public-sector', name: 'Government & Public Sector', description: 'Government & public services' },
  { id: 'healthcare', name: 'Healthcare', description: 'Medical services & pharmaceuticals' },
  { id: 'hospitality-travel-leisure', name: 'Hospitality, Travel & Leisure', description: 'Tourism, hospitality & leisure' },
  { id: 'insurance', name: 'Insurance', description: 'Insurance services' },
  { id: 'legal-professional-services', name: 'Legal & Professional Services', description: 'Legal & professional consulting' },
  { id: 'life-sciences', name: 'Life Sciences', description: 'Biotechnology & life sciences' },
  { id: 'manufacturing', name: 'Manufacturing', description: 'Production & industrial operations' },
  { id: 'media-entertainment-gaming', name: 'Media, Entertainment & Gaming', description: 'Media, entertainment & gaming' },
  { id: 'non-profit-ngo', name: 'Non-Profit & NGO', description: 'Non-profit organizations & NGOs' },
  { id: 'real-estate', name: 'Real Estate', description: 'Property & real estate services' },
  { id: 'retail-ecommerce', name: 'Retail & E-Commerce', description: 'Consumer goods & online sales' },
  { id: 'technology-software', name: 'Technology & Software', description: 'Software & IT services' },
  { id: 'telecommunications', name: 'Telecommunications', description: 'Network & communication services' },
  { id: 'transportation-logistics', name: 'Transportation & Logistics', description: 'Transportation & warehousing' },
  { id: 'other', name: 'Other', description: 'Other industries' },
];

export function IndustrySelectionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, currentUser } = useAuth();
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleIndustrySelect = (industry) => {
    setSelectedIndustry(industry);
    setIsOpen(false);
  };

  const handleContinue = () => {
    if (selectedIndustry) {
      navigate("/company-type", { state: { industry: selectedIndustry } });
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.dropdown-container')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="min-h-screen bg-[#f3f2ed] text-gray-900 relative overflow-hidden">

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
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:py-12 md:py-16 min-h-screen pt-24 pb-24">
        <div className="text-center mx-auto w-full px-2 sm:px-4 md:px-6">
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] xl:text-[4rem] tracking-[-0.05rem] font-regular leading-[1] mb-8 text-[#1a1a1a] mx-auto w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%]">
            Which industry your<br />
            company operates in?
          </h1>

          {/* Dropdown */}
          <div className="relative w-[75%] sm:w-[65%] md:w-[55%] lg:w-[45%] xl:w-[35%] mx-auto dropdown-container">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`
                w-full px-4 py-3
                bg-white
                text-left
                rounded
                shadow-sm
                tracking-[0.05rem]
                border border-gray-100
                flex justify-between items-center
                transition-all duration-200
                ${isOpen ? 'ring-2 ring-[#46cdc6]' : 'hover:border-[#46cdc6]'}
              `}
            >
              <span className={selectedIndustry ? 'text-[#1a1a1a]' : 'text-gray-400'}>
                {selectedIndustry ? selectedIndustry.name : 'Select Industry'}
              </span>
              <div className="bg-[#46cdc6] px-1.5 py-1 rounded">
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="white"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            {isOpen && (
              <div className="absolute w-full mt-1 bg-gradient-to-b from-white via-white to-transparent rounded shadow-sm border border-gray-100 overflow-hidden z-[60]">
                <div className="max-h-48 overflow-y-auto scrollbar-hide">
                  {[...industries].sort((a, b) => a.name.localeCompare(b.name)).map((industry) => (
                    <button
                      key={industry.id}
                      className={`
                        w-full px-4 py-3
                        text-left
                        hover:bg-gray-50
                        transition-colors
                        ${selectedIndustry?.id === industry.id ? 'text-[#46cdc6]' : 'text-[#1a1a1a]'}
                      `}
                      onClick={() => handleIndustrySelect(industry)}
                    >
                      {industry.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
      </div>
      </main>

      <StickyActionBar 
        selectedIndustry={selectedIndustry}
        onContinue={handleContinue}
      />
    </div>
  );
}