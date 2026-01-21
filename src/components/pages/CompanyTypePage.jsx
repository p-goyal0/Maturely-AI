import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { PageHeader } from '../shared/PageHeader';
import { useIndustryStore } from "../../stores/industryStore";
import { useCompanyStore } from "../../stores/companyStore";
import { useAuthStore } from "../../stores/authStore";
import { updateQuestionnaireAnswer, clearQuestionnaireByOwnership, getOnboardingDetails } from "../../utils/onboardingStorage";
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { searchStockTickers } from "../../services/commonService";

export function CompanyTypePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAuthStore((state) => state.currentUser);
  
  // Zustand stores
  const selectedIndustry = useIndustryStore((state) => state.selectedIndustry);
  const sectorType = useCompanyStore((state) => state.sectorType);
  const companyType = useCompanyStore((state) => state.companyType);
  const isListed = useCompanyStore((state) => state.isListed);
  const stockTicker = useCompanyStore((state) => state.stockTicker);
  const setSectorType = useCompanyStore((state) => state.setSectorType);
  const setCompanyType = useCompanyStore((state) => state.setCompanyType);
  const setIsListed = useCompanyStore((state) => state.setIsListed);
  const setStockTicker = useCompanyStore((state) => state.setStockTicker);
  const canContinueFromTypePage = useCompanyStore((state) => state.canContinueFromTypePage);

  // Public questions state
  const [publicDivision, setPublicDivision] = useState('');
  const [publicEmployeeSize, setPublicEmployeeSize] = useState('');
  const [publicRoleOptions, setPublicRoleOptions] = useState([]);
  const [publicReviewDetails, setPublicReviewDetails] = useState('');
  const [publicLinkedInUrl, setPublicLinkedInUrl] = useState('');

  // Private question state
  const [privateScope, setPrivateScope] = useState('');

  // Stock ticker search state
  const [stockSearchResults, setStockSearchResults] = useState([]);
  const [isStockSearchLoading, setIsStockSearchLoading] = useState(false);
  const [showStockDropdown, setShowStockDropdown] = useState(false);
  const stockSearchTimeoutRef = useRef(null);
  const stockInputRef = useRef(null);
  const stockDropdownRef = useRef(null);

  // Role options for public
  const publicRoleChoices = [
    "I am the highest level data and analytics leader within my division/government agency.",
    "I report directly to the highest level data and analytics leader within my division/government agency.",
    "I am a senior data and analytics professional within my division/government agency.",
    "Other (please specify)"
  ];

  // Scope options for private
  const privateScopeOptions = [
    "Enterprise-wide",
    "Business unit/division within an enterprise",
    "Region for a global enterprise",
    "Other"
  ];

  // Load existing answers from sessionStorage
  useEffect(() => {
    const details = getOnboardingDetails();
    const questionnaire = details.onboarding_org_questionaire || [];
    
    // Load public sector questions (division, employee size) when public sector is selected
    if (sectorType === 'public-sector') {
      questionnaire.forEach((q) => {
        if (q.ownership === 'public') {
          switch (q.order) {
            case 1:
              setPublicDivision(q.answer || '');
              break;
            case 2:
              setPublicEmployeeSize(q.answer || '');
              break;
          }
        }
      });
    }
    
    // Load public company questions (role, review details, LinkedIn) when public company is selected
    if (companyType === 'public') {
      questionnaire.forEach((q) => {
        if (q.ownership === 'public') {
          switch (q.order) {
            case 3:
              // Handle checkbox answers (comma-separated)
              setPublicRoleOptions(q.answer ? q.answer.split(',').map(s => s.trim()) : []);
              break;
            case 4:
              setPublicReviewDetails(q.answer || '');
              break;
            case 5:
              setPublicLinkedInUrl(q.answer || '');
              break;
          }
        }
      });
    } else if (companyType === 'private') {
      questionnaire.forEach((q) => {
        if (q.ownership === 'private' && q.order === 1) {
          setPrivateScope(q.answer || '');
        }
      });
    }
  }, [companyType, sectorType]);

  // Update questionnaire when public answers change
  useEffect(() => {
    if (sectorType === 'public-sector') {
      if (publicDivision) {
        updateQuestionnaireAnswer(
          "Which division/government agency are you responsible for within your public sector organization?",
          publicDivision,
          1,
          'public'
        );
      }
    }
  }, [publicDivision, sectorType]);

  useEffect(() => {
    if (sectorType === 'public-sector') {
      if (publicEmployeeSize) {
        updateQuestionnaireAnswer(
          "What is the employee size of your division/government agency within your public sector organization?",
          publicEmployeeSize,
          2,
          'public'
        );
      }
    }
  }, [publicEmployeeSize, sectorType]);

  useEffect(() => {
    if (companyType === 'public') {
      if (publicRoleOptions.length > 0) {
        updateQuestionnaireAnswer(
          "Which of the following best describes your current role? Check all that apply.",
          publicRoleOptions.join(', '),
          3,
          'public'
        );
      }
    }
  }, [publicRoleOptions, companyType]);

  useEffect(() => {
    if (companyType === 'public') {
      if (publicReviewDetails) {
        updateQuestionnaireAnswer(
          "Please provide any details that may be helpful in the review of your request to participate in the CDAO Circle Program",
          publicReviewDetails,
          4,
          'public'
        );
      }
    }
  }, [publicReviewDetails, companyType]);

  useEffect(() => {
    if (companyType === 'public') {
      if (publicLinkedInUrl) {
        updateQuestionnaireAnswer(
          "Please provide the URL to your LinkedIn profile",
          publicLinkedInUrl,
          5,
          'public'
        );
      }
    }
  }, [publicLinkedInUrl, companyType]);

  // Update questionnaire when private answer changes
  useEffect(() => {
    if (companyType === 'private') {
      if (privateScope) {
        updateQuestionnaireAnswer(
          "Please identify your scope of responsibility",
          privateScope,
          1,
          'private'
        );
      }
    }
  }, [privateScope, companyType]);

  // Clear opposite ownership questions when switching
  useEffect(() => {
    if (sectorType === 'public-sector') {
      clearQuestionnaireByOwnership('private');
      setPrivateScope('');
      // Clear company type when switching to public sector
      if (companyType) {
        setCompanyType(null);
      }
    } else if (sectorType === 'private-sector') {
      // Clear public sector questions (division, employee size) when switching to private sector
      setPublicDivision('');
      setPublicEmployeeSize('');
    }
    
    if (companyType === 'public') {
      clearQuestionnaireByOwnership('private');
      setPrivateScope('');
    } else if (companyType === 'private') {
      // Only clear public company questions (3, 4, 5), not public sector questions (1, 2)
      setPublicRoleOptions([]);
      setPublicReviewDetails('');
      setPublicLinkedInUrl('');
    }
  }, [companyType, sectorType]);

  const handlePublicRoleToggle = (role) => {
    setPublicRoleOptions((prev) => {
      if (prev.includes(role)) {
        return prev.filter((r) => r !== role);
      } else {
        return [...prev, role];
      }
    });
  };

  // Stock ticker search handler
  const handleStockTickerChange = (value) => {
    const upperValue = value.toUpperCase();
    setStockTicker(upperValue);
    setShowStockDropdown(false);
    setStockSearchResults([]);

    // Clear existing timeout
    if (stockSearchTimeoutRef.current) {
      clearTimeout(stockSearchTimeoutRef.current);
    }

    // Only search if checkbox is checked and value is at least 2 characters
    if (isListed && upperValue.length >= 2) {
      setIsStockSearchLoading(true);
      
      // Debounce API call
      stockSearchTimeoutRef.current = setTimeout(async () => {
        try {
          const result = await searchStockTickers(upperValue);
          if (result.success) {
            setStockSearchResults(result.data || []);
            setShowStockDropdown(true);
          } else {
            setStockSearchResults([]);
            setShowStockDropdown(false);
          }
        } catch (error) {
          console.error('Stock search error:', error);
          setStockSearchResults([]);
          setShowStockDropdown(false);
        } finally {
          setIsStockSearchLoading(false);
        }
      }, 300); // 300ms debounce
    } else {
      setIsStockSearchLoading(false);
      setStockSearchResults([]);
      setShowStockDropdown(false);
    }
  };

  // Handle stock selection from dropdown
  const handleStockSelect = (stock) => {
    setStockTicker(stock.ticker_symbol);
    setShowStockDropdown(false);
    setStockSearchResults([]);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        stockInputRef.current &&
        !stockInputRef.current.contains(event.target) &&
        stockDropdownRef.current &&
        !stockDropdownRef.current.contains(event.target)
      ) {
        setShowStockDropdown(false);
      }
    };

    if (showStockDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showStockDropdown]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (stockSearchTimeoutRef.current) {
        clearTimeout(stockSearchTimeoutRef.current);
      }
    };
  }, []);

  const handleContinue = () => {
    // Check if can continue from private sector (company type selected)
    if (canContinueFromTypePage()) {
      navigate("/company-info");
    }
    // Check if can continue from public sector (both fields filled)
    else if (sectorType === 'public-sector' && publicDivision.trim() !== '' && publicEmployeeSize.trim() !== '') {
      navigate("/company-info");
    }
  };


  // Redirect to offerings if onboarding is already complete
  useEffect(() => {
    if (currentUser?.is_onboarding_complete === true) {
      navigate("/offerings", { replace: true });
    }
  }, [currentUser?.is_onboarding_complete, navigate]);

  // Redirect if no industry selected
  useEffect(() => {
    if (!selectedIndustry) {
      navigate("/industry");
    }
  }, [selectedIndustry, navigate]);

  return (
    <div className="min-h-screen bg-[#f3f2ed] text-gray-900 relative overflow-hidden">
      {/* Header */}
      <PageHeader />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:py-12 md:py-16 min-h-screen pt-24 pb-24">
        <div className="text-center mx-auto w-full px-2 sm:px-4 md:px-6">
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] xl:text-[4rem] tracking-[-0.05rem] font-regular leading-[1] mb-8 mt-8 sm:mt-12 text-[#1a1a1a] mx-auto w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%]">
            {!sectorType 
              ? "Are you in the private sector or public sector?"
              : sectorType === 'private-sector'
              ? "Are you a public or private company?"
              : "Public Sector"
            }
          </h1>

          {/* Sector Type Selection - Always Visible */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-[75%] sm:w-[65%] md:w-[55%] lg:w-[45%] xl:w-[35%] mx-auto space-y-4 mb-8"
          >
              {/* Info Text */}
              <p className="text-sm text-gray-600 mb-6 text-center">
                We define "public sector" as owned and operated by the government, while "private sector" is owned by individuals or companies (corporate).
              </p>

              {/* Private Sector Option */}
              <button
                onClick={() => setSectorType('private-sector')}
                className={`
                  w-full px-6 py-4
                  bg-white
                  text-left
                  rounded-lg
                  shadow-sm
                  border-2
                  transition-all duration-200
                  flex items-center justify-between
                  ${sectorType === 'private-sector' 
                    ? 'border-[#46cdc6] ring-2 ring-[#46cdc6]' 
                    : 'border-gray-200 hover:border-[#46cdc6]'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${sectorType === 'private-sector' 
                      ? 'border-[#46cdc6] bg-[#46cdc6]' 
                      : 'border-gray-300'
                    }
                  `}>
                    {sectorType === 'private-sector' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </div>
                  <span className={`font-medium ${sectorType === 'private-sector' ? 'text-[#46cdc6]' : 'text-[#1a1a1a]'}`}>
                    Private Sector
                  </span>
                </div>
              </button>

              {/* Public Sector Option */}
              <button
                onClick={() => setSectorType('public-sector')}
                className={`
                  w-full px-6 py-4
                  bg-white
                  text-left
                  rounded-lg
                  shadow-sm
                  border-2
                  transition-all duration-200
                  flex items-center justify-between
                  ${sectorType === 'public-sector' 
                    ? 'border-[#46cdc6] ring-2 ring-[#46cdc6]' 
                    : 'border-gray-200 hover:border-[#46cdc6]'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${sectorType === 'public-sector' 
                      ? 'border-[#46cdc6] bg-[#46cdc6]' 
                      : 'border-gray-300'
                    }
                  `}>
                    {sectorType === 'public-sector' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </div>
                  <span className={`font-medium ${sectorType === 'public-sector' ? 'text-[#46cdc6]' : 'text-[#1a1a1a]'}`}>
                    Public Sector
                  </span>
                </div>
              </button>
          </motion.div>

          {/* Company Type Selection - Shown only for Private Sector */}
          {sectorType === 'private-sector' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-[75%] sm:w-[65%] md:w-[55%] lg:w-[45%] xl:w-[35%] mx-auto space-y-4 mt-8"
            >
              <h2 className="text-xl sm:text-2xl font-semibold text-[#1a1a1a] mb-4 text-center">
                Are you a public or private company?
              </h2>
              
              {/* Public Company Option */}
              <button
                onClick={() => setCompanyType('public')}
                className={`
                  w-full px-6 py-4
                  bg-white
                  text-left
                  rounded-lg
                  shadow-sm
                  border-2
                  transition-all duration-200
                  flex items-center justify-between
                  ${companyType === 'public' 
                    ? 'border-[#46cdc6] ring-2 ring-[#46cdc6]' 
                    : 'border-gray-200 hover:border-[#46cdc6]'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${companyType === 'public' 
                      ? 'border-[#46cdc6] bg-[#46cdc6]' 
                      : 'border-gray-300'
                    }
                  `}>
                    {companyType === 'public' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </div>
                  <span className={`font-medium ${companyType === 'public' ? 'text-[#46cdc6]' : 'text-[#1a1a1a]'}`}>
                    Public Company
                  </span>
                </div>
              </button>

              {/* Private Company Option */}
              <button
                onClick={() => setCompanyType('private')}
                className={`
                  w-full px-6 py-4
                  bg-white
                  text-left
                  rounded-lg
                  shadow-sm
                  border-2
                  transition-all duration-200
                  flex items-center justify-between
                  ${companyType === 'private' 
                    ? 'border-[#46cdc6] ring-2 ring-[#46cdc6]' 
                    : 'border-gray-200 hover:border-[#46cdc6]'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${companyType === 'private' 
                      ? 'border-[#46cdc6] bg-[#46cdc6]' 
                      : 'border-gray-300'
                    }
                  `}>
                    {companyType === 'private' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </div>
                  <span className={`font-medium ${companyType === 'private' ? 'text-[#46cdc6]' : 'text-[#1a1a1a]'}`}>
                    Private Company
                  </span>
                </div>
              </button>

              {/* Conditional Fields for Public Company - Only show for Private Sector */}
              {companyType === 'public' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 space-y-4"
              >
                {/* Listed on Stock Market Checkbox */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isListed}
                    onChange={(e) => setIsListed(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-[#46cdc6] focus:ring-[#46cdc6] focus:ring-2"
                  />
                  <span className="text-[#1a1a1a] font-medium">
                    Listed on stock market
                  </span>
                </label>

                {/* Stock Ticker Input */}
                {isListed && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                    ref={stockInputRef}
                  >
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                      Stock Ticker Symbol
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={stockTicker}
                        onChange={(e) => handleStockTickerChange(e.target.value)}
                        onFocus={() => {
                          if (stockSearchResults.length > 0) {
                            setShowStockDropdown(true);
                          }
                        }}
                        placeholder="e.g., AAPL"
                        className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-200 focus:border-[#46cdc6] focus:ring-2 focus:ring-[#46cdc6] outline-none transition-all duration-200"
                      />
                      {isStockSearchLoading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="w-4 h-4 border-2 border-[#46cdc6] border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    
                    {/* Stock Search Dropdown */}
                    {showStockDropdown && stockSearchResults.length > 0 && (
                      <div
                        ref={stockDropdownRef}
                        className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border-2 border-gray-200 max-h-60 overflow-y-auto"
                      >
                        {stockSearchResults.map((stock, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleStockSelect(stock)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            <div className="font-medium text-[#1a1a1a]">{stock.company_name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {stock.ticker_symbol} • {stock.exchange}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <p className="mt-1 text-xs text-gray-500">
                      {stockTicker.length >= 2 ? 'Type at least 2 characters to search' : 'You can overwrite this later if needed'}
                    </p>
                  </motion.div>
                )}

                {/* Public Questions */}
                <div className="mt-8 space-y-6 pt-6 border-t border-gray-200">
                  <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">Additional Information</h2>
                  
                  {/* Question 3: Current Role (Checkboxes) */}
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-3">
                      Which of the following best describes your current role? Check all that apply.
                    </label>
                    <div className="space-y-3">
                      {publicRoleChoices.map((role, index) => (
                        <label key={index} className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border-2 border-gray-200 hover:border-[#46cdc6] transition-all duration-200">
                          <input
                            type="checkbox"
                            checked={publicRoleOptions.includes(role)}
                            onChange={() => handlePublicRoleToggle(role)}
                            className="w-5 h-5 rounded border-gray-300 text-[#46cdc6] focus:ring-[#46cdc6] focus:ring-2 mt-0.5"
                          />
                          <span className={`text-sm flex-1 ${publicRoleOptions.includes(role) ? 'text-[#46cdc6] font-medium' : 'text-[#1a1a1a]'}`}>{role}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Question 4: Review Details */}
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                      Please provide any details that may be helpful in the review of your request to participate in the CDAO Circle Program
                    </label>
                    <textarea
                      value={publicReviewDetails}
                      onChange={(e) => setPublicReviewDetails(e.target.value)}
                      placeholder="Enter details"
                      rows={4}
                      className="w-full px-4 py-3 bg-white rounded-lg shadow-sm border-2 border-gray-200 focus:border-[#46cdc6] focus:ring-2 focus:ring-[#46cdc6] outline-none transition-all duration-200 resize-none text-[#1a1a1a] placeholder-gray-400"
                    />
                  </div>

                  {/* Question 5: LinkedIn URL */}
                  <div className="mb-8 sm:mb-12">
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                      Please provide the URL to your LinkedIn profile
                    </label>
                    <input
                      type="url"
                      value={publicLinkedInUrl}
                      onChange={(e) => setPublicLinkedInUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="w-full px-4 py-3 bg-white rounded-lg shadow-sm border-2 border-gray-200 focus:border-[#46cdc6] focus:ring-2 focus:ring-[#46cdc6] outline-none transition-all duration-200 text-[#1a1a1a] placeholder-gray-400"
                    />
                  </div>
                </div>
              </motion.div>
            )}

              {/* Conditional Fields for Private Company - Only show for Private Sector */}
              {companyType === 'private' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 space-y-4"
              >
                <p className="text-sm text-gray-600 mb-6">
                  Private companies are not publicly traded on stock exchanges.
                </p>

                {/* Private Question */}
                <div className="pt-6 border-t border-gray-200">
                  <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">Additional Information</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                      Please identify your scope of responsibility
                    </label>
                    <select
                      value={privateScope}
                      onChange={(e) => setPrivateScope(e.target.value)}
                      className="w-full px-4 py-3 bg-white rounded-lg shadow-sm border-2 border-gray-200 focus:border-[#46cdc6] focus:ring-2 focus:ring-[#46cdc6] outline-none transition-all duration-200 text-[#1a1a1a] cursor-pointer"
                    >
                      <option value="">Select Value</option>
                      {privateScopeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
              )}
            </motion.div>
          )}

          {/* Public Sector - Show questions */}
          {sectorType === 'public-sector' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-[75%] sm:w-[65%] md:w-[55%] lg:w-[45%] xl:w-[35%] mx-auto mt-8 space-y-6"
            >
              {/* Question 1: Division/Government Agency */}
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                  Which division/government agency are you responsible for within your public sector organization?
                </label>
                <input
                  type="text"
                  value={publicDivision}
                  onChange={(e) => setPublicDivision(e.target.value)}
                  placeholder="Enter division or agency name"
                  className="w-full px-4 py-3 bg-white rounded-lg shadow-sm border-2 border-gray-200 focus:border-[#46cdc6] focus:ring-2 focus:ring-[#46cdc6] outline-none transition-all duration-200 text-[#1a1a1a] placeholder-gray-400"
                />
              </div>

              {/* Question 2: Employee Size */}
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                  What is the employee size of your division/government agency within your public sector organization?
                </label>
                <input
                  type="text"
                  value={publicEmployeeSize}
                  onChange={(e) => setPublicEmployeeSize(e.target.value)}
                  placeholder="Enter employee size"
                  className="w-full px-4 py-3 bg-white rounded-lg shadow-sm border-2 border-gray-200 focus:border-[#46cdc6] focus:ring-2 focus:ring-[#46cdc6] outline-none transition-all duration-200 text-[#1a1a1a] placeholder-gray-400"
                />
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Sticky Action Bar */}
      {(canContinueFromTypePage() || (sectorType === 'public-sector' && publicDivision.trim() !== '' && publicEmployeeSize.trim() !== '')) && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          <div className="absolute inset-0 backdrop-blur-2xl bg-gradient-to-t from-gray-50/95 via-gray-50/90 to-transparent border-t border-gray-200" />
          <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-0.5">Company Type</p>
                <p className="text-gray-900 font-medium text-sm">Ready to continue</p>
              </div>
              <motion.button
                onClick={handleContinue}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="relative group px-6 py-2.5 rounded-xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#46cdc6] to-[#46cdc6]/80" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#46cdc6]/80 to-[#46cdc6]"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <div className="absolute inset-0 bg-[#46cdc6] blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                <div className="relative flex items-center gap-2 text-[#101010] font-semibold">
                  <span>Continue</span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

