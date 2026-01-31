import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';
import { StickyActionBar } from '../industry/StickyActionBar.jsx';
import { getIndustries } from "../../services/industryService";
import { PageHeader } from '../shared/PageHeader';
import { useAuthStore } from "../../stores/authStore";
import { useIndustryStore } from "../../stores/industryStore";

/**
 * Convert industry name to ID (slug format)
 */
const generateIndustryId = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Transform API response to component format
 */
const transformIndustriesData = (apiData) => {
  const industries = [];
  const subIndustries = {};

  apiData.forEach((item) => {
    const id = generateIndustryId(item.industry);
    industries.push({
      id,
      name: item.industry,
      description: `${item.industry} operations`,
    });

    if (item.sub_industry && item.sub_industry.length > 0) {
      subIndustries[id] = item.sub_industry;
    }
  });

  return { industries, subIndustries };
};

export function IndustrySelectionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const signOut = useAuthStore((state) => state.signOut);
  const currentUser = useAuthStore((state) => state.currentUser);
  
  // Zustand store for industry state
  const selectedIndustry = useIndustryStore((state) => state.selectedIndustry);
  const selectedSubIndustry = useIndustryStore((state) => state.selectedSubIndustry);
  const industries = useIndustryStore((state) => state.industries);
  const subIndustries = useIndustryStore((state) => state.subIndustries);
  const isLoading = useIndustryStore((state) => state.isLoading);
  const error = useIndustryStore((state) => state.error);
  const setSelectedIndustry = useIndustryStore((state) => state.setSelectedIndustry);
  const setSelectedSubIndustry = useIndustryStore((state) => state.setSelectedSubIndustry);
  const setIndustries = useIndustryStore((state) => state.setIndustries);
  const setSubIndustries = useIndustryStore((state) => state.setSubIndustries);
  const setLoading = useIndustryStore((state) => state.setLoading);
  const setError = useIndustryStore((state) => state.setError);
  const canContinue = useIndustryStore((state) => state.canContinue);
  
  // Local UI state
  const [isOpen, setIsOpen] = useState(false);
  const [isSubIndustryOpen, setIsSubIndustryOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [industrySearch, setIndustrySearch] = useState('');
  const [subIndustrySearch, setSubIndustrySearch] = useState('');
  const industrySearchRef = useRef(null);
  const subIndustrySearchRef = useRef(null);

  // Redirect to offerings if onboarding is already complete
  useEffect(() => {
    if (currentUser?.is_onboarding_complete === true) {
      navigate("/offerings", { replace: true });
    }
  }, [currentUser?.is_onboarding_complete, navigate]);

  const handleIndustrySelect = (industry) => {
    setSelectedIndustry(industry);
    setIsOpen(false);
    setIndustrySearch('');
  };

  const handleSubIndustrySelect = (subIndustry) => {
    setSelectedSubIndustry(subIndustry);
    setIsSubIndustryOpen(false);
    setSubIndustrySearch('');
  };

  const handleContinue = () => {
    if (canContinue()) {
      navigate("/company-type");
    }
  };

  const handleSignOut = () => {
    signOut();
    // Use setTimeout to ensure state updates before navigation
    setTimeout(() => {
      navigate("/");
    }, 0);
  };

  // Fetch industries from API
  useEffect(() => {
    const fetchIndustries = async () => {
      setLoading(true);
      setError(null);
      
      const result = await getIndustries();
      
      if (result.success) {
        const transformed = transformIndustriesData(result.data);
        setIndustries(transformed.industries);
        setSubIndustries(transformed.subIndustries);
      } else {
        setError(result.error || 'Failed to load industries');
        // Fallback to empty arrays if API fails
        setIndustries([]);
        setSubIndustries({});
      }
      
      setLoading(false);
    };

    fetchIndustries();
  }, [setLoading, setError, setIndustries, setSubIndustries]);

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
      if (isOpen && !event.target.closest('.industry-dropdown-container')) {
        setIsOpen(false);
      }
      if (isSubIndustryOpen && !event.target.closest('.subindustry-dropdown-container')) {
        setIsSubIndustryOpen(false);
      }
    };

    if (isOpen || isSubIndustryOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, isSubIndustryOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      // Small delay so the input exists in DOM
      setTimeout(() => industrySearchRef.current?.focus?.(), 0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isSubIndustryOpen) {
      setTimeout(() => subIndustrySearchRef.current?.focus?.(), 0);
    }
  }, [isSubIndustryOpen]);

  // Get available sub-industries for selected industry
  const getAvailableSubIndustries = useIndustryStore((state) => state.getAvailableSubIndustries);
  const availableSubIndustries = getAvailableSubIndustries();

  return (
    <div className="min-h-screen bg-[#f3f2ed] text-gray-900 relative overflow-hidden">

      {/* Header */}
      <PageHeader />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:py-12 md:py-16 min-h-screen pt-24 pb-24">
        <div className="text-center mx-auto w-full px-2 sm:px-4 md:px-6">
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] xl:text-[4rem] tracking-[-0.05rem] font-regular leading-[1] mb-8 text-[#1a1a1a] mx-auto w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%]">
            What's your industry?
          </h1>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-[#46cdc6] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm max-w-md mx-auto">
              {error}
            </div>
          )}

          {/* Industry Dropdown */}
          {!isLoading && (
            <div className="relative w-[75%] sm:w-[65%] md:w-[55%] lg:w-[45%] xl:w-[35%] mx-auto industry-dropdown-container mb-4">
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
                {selectedIndustry ? selectedIndustry.name : "What's your industry?"}
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
                {/* Search box */}
                <div className="p-2 border-b border-gray-100 bg-white">
                  <input
                    ref={industrySearchRef}
                    value={industrySearch}
                    onChange={(e) => setIndustrySearch(e.target.value)}
                    placeholder="Type to search…"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46cdc6] focus:border-transparent"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto scrollbar-hide bg-white">
                  {[...industries]
                    .filter(industry => {
                      const id = generateIndustryId(industry.name);
                      return id !== 'other';
                    })
                    .filter(industry => industry.name.toLowerCase().includes(industrySearch.trim().toLowerCase()))
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .concat(
                      industries
                        .filter(industry => {
                          const id = generateIndustryId(industry.name);
                          return id === 'other';
                        })
                        .filter(industry => industry.name.toLowerCase().includes(industrySearch.trim().toLowerCase()))
                    )
                    .filter(Boolean)
                    .map((industry) => (
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
                  {industries.length > 0 &&
                    [...industries]
                      .filter(i => i.name.toLowerCase().includes(industrySearch.trim().toLowerCase()))
                      .length === 0 && (
                      <div className="px-4 py-3 text-sm text-gray-500">No matches found</div>
                    )}
                </div>
              </div>
            )}
            </div>
          )}

          {/* Sub-Industry Dropdown - Only show if industry is selected and not "Other" */}
          {!isLoading && selectedIndustry && availableSubIndustries.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-[75%] sm:w-[65%] md:w-[55%] lg:w-[45%] xl:w-[35%] mx-auto subindustry-dropdown-container"
            >
              <button
                onClick={() => setIsSubIndustryOpen(!isSubIndustryOpen)}
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
                  ${isSubIndustryOpen ? 'ring-2 ring-[#46cdc6]' : 'hover:border-[#46cdc6]'}
                `}
              >
                <span className={selectedSubIndustry ? 'text-[#1a1a1a]' : 'text-gray-400'}>
                  {selectedSubIndustry || 'Select Sub-Industry'}
                </span>
                <div className="bg-[#46cdc6] px-1.5 py-1 rounded">
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${isSubIndustryOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="white"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {isSubIndustryOpen && (
                <div className="absolute w-full mt-1 bg-gradient-to-b from-white via-white to-transparent rounded shadow-sm border border-gray-100 overflow-hidden z-[60]">
                  {/* Search box */}
                  <div className="p-2 border-b border-gray-100 bg-white">
                    <input
                      ref={subIndustrySearchRef}
                      value={subIndustrySearch}
                      onChange={(e) => setSubIndustrySearch(e.target.value)}
                      placeholder="Type to search…"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#46cdc6] focus:border-transparent"
                    />
                  </div>

                  <div className="max-h-48 overflow-y-auto scrollbar-hide bg-white">
                    {availableSubIndustries
                      .filter((s) => s.toLowerCase().includes(subIndustrySearch.trim().toLowerCase()))
                      .map((subIndustry) => (
                      <button
                        key={subIndustry}
                        className={`
                          w-full px-4 py-3
                          text-left
                          hover:bg-gray-50
                          transition-colors
                          ${selectedSubIndustry === subIndustry ? 'text-[#46cdc6]' : 'text-[#1a1a1a]'}
                        `}
                        onClick={() => handleSubIndustrySelect(subIndustry)}
                      >
                        {subIndustry}
                      </button>
                    ))}
                    {availableSubIndustries.length > 0 &&
                      availableSubIndustries.filter((s) =>
                        s.toLowerCase().includes(subIndustrySearch.trim().toLowerCase())
                      ).length === 0 && (
                      <div className="px-4 py-3 text-sm text-gray-500">No matches found</div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>

      <StickyActionBar 
        selectedIndustry={selectedIndustry}
        selectedSubIndustry={selectedSubIndustry}
        onContinue={handleContinue}
      />
    </div>
  );
}