import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { PageHeader } from '../shared/PageHeader';
import { ChevronDown } from 'lucide-react';
import { useIndustryStore } from "../../stores/industryStore";
import { useCompanyStore } from "../../stores/companyStore";
import { useAuthStore } from "../../stores/authStore";
import { updateOnboardingDetails, getOnboardingDetails } from "../../utils/onboardingStorage";
import { submitOnboarding } from "../../services/onboardingService";
import { AlertCircle } from 'lucide-react';

export function CompanyInfoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAuthStore((state) => state.currentUser);
  
  // Zustand stores
  const selectedIndustry = useIndustryStore((state) => state.selectedIndustry);
  const companyType = useCompanyStore((state) => state.companyType);
  const totalHeadcountRange = useCompanyStore((state) => state.totalHeadcountRange);
  const marketCapRange = useCompanyStore((state) => state.marketCapRange);
  const annualRevenueRange = useCompanyStore((state) => state.annualRevenueRange);
  const setTotalHeadcountRange = useCompanyStore((state) => state.setTotalHeadcountRange);
  const setMarketCapRange = useCompanyStore((state) => state.setMarketCapRange);
  const setAnnualRevenueRange = useCompanyStore((state) => state.setAnnualRevenueRange);
  const canContinueFromInfoPage = useCompanyStore((state) => state.canContinueFromInfoPage);
  
  // Additional fields state
  const [currentJobTitle, setCurrentJobTitle] = useState('');
  const [reportingPersonName, setReportingPersonName] = useState('');
  const [reportingPersonDesignation, setReportingPersonDesignation] = useState('');
  
  // Onboarding submission state
  const [isSubmittingOnboarding, setIsSubmittingOnboarding] = useState(false);
  const [onboardingError, setOnboardingError] = useState('');

  // Load existing values from sessionStorage
  useEffect(() => {
    const details = getOnboardingDetails();
    if (details.current_job_title) setCurrentJobTitle(details.current_job_title);
    if (details.reporting_person_name) setReportingPersonName(details.reporting_person_name);
    if (details.reporting_person_designation) setReportingPersonDesignation(details.reporting_person_designation);
  }, []);

  // Wrapper functions to update both Zustand and sessionStorage
  const handleHeadcountChange = (range) => {
    setTotalHeadcountRange(range);
    updateOnboardingDetails({ total_head_count_range: range });
  };
  
  const handleMarketCapChange = (range) => {
    setMarketCapRange(range);
    updateOnboardingDetails({ market_cap_range_in_usd: range });
  };
  
  const handleRevenueChange = (range) => {
    setAnnualRevenueRange(range);
    updateOnboardingDetails({ annual_revenue_range_in_usd: range });
  };

  // Update sessionStorage when additional fields change
  useEffect(() => {
    updateOnboardingDetails({ current_job_title: currentJobTitle });
  }, [currentJobTitle]);

  useEffect(() => {
    updateOnboardingDetails({ reporting_person_name: reportingPersonName });
  }, [reportingPersonName]);

  useEffect(() => {
    updateOnboardingDetails({ reporting_person_designation: reportingPersonDesignation });
  }, [reportingPersonDesignation]);
  
  // Local UI state
  const [isHeadcountOpen, setIsHeadcountOpen] = useState(false);
  const [isMarketCapOpen, setIsMarketCapOpen] = useState(false);
  const [isRevenueOpen, setIsRevenueOpen] = useState(false);
  const headcountRef = useRef(null);
  const marketCapRef = useRef(null);
  const revenueRef = useRef(null);

  // Predefined ranges
  const headcountRanges = [
    { value: '1-10', label: '1-10' },
    { value: '11-50', label: '11-50' },
    { value: '51-200', label: '51-200' },
    { value: '201-500', label: '201-500' },
    { value: '501-1000', label: '501-1,000' },
    { value: '1001-5000', label: '1,001-5,000' },
    { value: '5001-10000', label: '5,001-10,000' },
    { value: '10000+', label: '10,000+' },
  ];

  const marketCapRanges = [
    { value: '<10M', label: '< $10M' },
    { value: '10M-100M', label: '$10M - $100M' },
    { value: '100M-1B', label: '$100M - $1B' },
    { value: '>1B', label: '> $1B' },
  ];

  const annualRevenueRanges = [
    { value: '<1M', label: '< $1M' },
    { value: '1M-10M', label: '$1M - $10M' },
    { value: '10M-100M', label: '$10M - $100M' },
    { value: '>100M', label: '> $100M' },
  ];

  // Get data from stores (no longer from location.state)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headcountRef.current && !headcountRef.current.contains(event.target)) {
        setIsHeadcountOpen(false);
      }
      if (marketCapRef.current && !marketCapRef.current.contains(event.target)) {
        setIsMarketCapOpen(false);
      }
      if (revenueRef.current && !revenueRef.current.contains(event.target)) {
        setIsRevenueOpen(false);
      }
    };

    if (isHeadcountOpen || isMarketCapOpen || isRevenueOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isHeadcountOpen, isMarketCapOpen, isRevenueOpen]);


  const handleContinue = async () => {
    // Validate required fields
    if (!totalHeadcountRange) {
      setOnboardingError('Please select total headcount range');
      return;
    }

    setIsSubmittingOnboarding(true);
    setOnboardingError('');

    try {
      // Get all onboarding data from sessionStorage
      const onboardingData = getOnboardingDetails();

      // Submit onboarding data to API
      const result = await submitOnboarding(onboardingData);

      if (result.success) {
        // Navigate to offerings page on success
        navigate("/offerings");
      } else {
        setOnboardingError(result.error || 'Failed to submit onboarding data. Please try again.');
        setIsSubmittingOnboarding(false);
      }
    } catch (error) {
      console.error('Onboarding submission error:', error);
      setOnboardingError('An unexpected error occurred. Please try again.');
      setIsSubmittingOnboarding(false);
    }
  };


  // Redirect to offerings if onboarding is already complete
  useEffect(() => {
    if (currentUser?.is_onboarding_complete === true) {
      navigate("/offerings", { replace: true });
    }
  }, [currentUser?.is_onboarding_complete, navigate]);

  // Redirect if no previous data
  useEffect(() => {
    if (!selectedIndustry || !companyType) {
      navigate("/industry");
    }
  }, [selectedIndustry, companyType, navigate]);

  return (
    <div className="min-h-screen bg-[#f3f2ed] text-gray-900 relative overflow-hidden">
      {/* Header */}
      <PageHeader />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:py-12 md:py-16 min-h-screen pt-24 pb-24">
        <div className="text-center mx-auto w-full px-2 sm:px-4 md:px-6">
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] xl:text-[4rem] tracking-[-0.05rem] font-regular leading-[1] mb-8 mt-8 sm:mt-12 text-[#1a1a1a] mx-auto w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%]">
            Tell us about<br />
            your company
          </h1>

          {/* Company Information Fields */}
          <div className="w-[75%] sm:w-[65%] md:w-[55%] lg:w-[45%] xl:w-[35%] mx-auto space-y-6">
            {/* Total Headcount Range */}
            <div className="relative" ref={headcountRef}>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                Total Headcount <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsHeadcountOpen(!isHeadcountOpen)}
                className={`
                  w-full px-4 py-3
                  bg-white
                  text-left
                  rounded-lg
                  shadow-sm
                  border-2
                  flex justify-between items-center
                  transition-all duration-200
                  ${isHeadcountOpen ? 'border-[#46cdc6] ring-2 ring-[#46cdc6]' : 'border-gray-200 hover:border-[#46cdc6]'}
                `}
              >
                <span className={totalHeadcountRange ? 'text-[#1a1a1a]' : 'text-gray-400'}>
                  {totalHeadcountRange 
                    ? headcountRanges.find(r => r.value === totalHeadcountRange)?.label 
                    : 'Select headcount range'}
                </span>
                <div className="bg-[#46cdc6] px-1.5 py-1 rounded">
                  <ChevronDown 
                    className={`w-4 h-4 text-white transition-transform duration-200 ${isHeadcountOpen ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>
              {isHeadcountOpen && (
                <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border-2 border-gray-200 overflow-hidden z-50">
                  <div className="max-h-60 overflow-y-auto">
                    {headcountRanges.map((range) => (
                      <button
                        key={range.value}
                        type="button"
                          onClick={() => {
                            handleHeadcountChange(range.value);
                            setIsHeadcountOpen(false);
                          }}
                        className={`
                          w-full px-4 py-3
                          text-left
                          hover:bg-gray-50
                          transition-colors
                          ${totalHeadcountRange === range.value ? 'bg-[#46cdc6]/10 text-[#46cdc6] font-medium' : 'text-[#1a1a1a]'}
                        `}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Total number of employees
              </p>
            </div>

            {/* Market Cap Range - Only for Public Companies */}
            {companyType === 'public' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative"
                ref={marketCapRef}
              >
                <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                  Market Cap (USD)
                </label>
                <button
                  type="button"
                  onClick={() => setIsMarketCapOpen(!isMarketCapOpen)}
                  className={`
                    w-full px-4 py-3
                    bg-white
                    text-left
                    rounded-lg
                    shadow-sm
                    border-2
                    flex justify-between items-center
                    transition-all duration-200
                    ${isMarketCapOpen ? 'border-[#46cdc6] ring-2 ring-[#46cdc6]' : 'border-gray-200 hover:border-[#46cdc6]'}
                  `}
                >
                  <span className={marketCapRange ? 'text-[#1a1a1a]' : 'text-gray-400'}>
                    {marketCapRange 
                      ? marketCapRanges.find(r => r.value === marketCapRange)?.label 
                      : 'Select market cap range'}
                  </span>
                  <div className="bg-[#46cdc6] px-1.5 py-1 rounded">
                    <ChevronDown 
                      className={`w-4 h-4 text-white transition-transform duration-200 ${isMarketCapOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>
                {isMarketCapOpen && (
                  <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border-2 border-gray-200 overflow-hidden z-50">
                    <div className="max-h-60 overflow-y-auto">
                      {marketCapRanges.map((range) => (
                        <button
                          key={range.value}
                          type="button"
                          onClick={() => {
                            handleMarketCapChange(range.value);
                            setIsMarketCapOpen(false);
                          }}
                          className={`
                            w-full px-4 py-3
                            text-left
                            hover:bg-gray-50
                            transition-colors
                            ${marketCapRange === range.value ? 'bg-[#46cdc6]/10 text-[#46cdc6] font-medium' : 'text-[#1a1a1a]'}
                          `}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Market capitalization in USD
                </p>
              </motion.div>
            )}

            {/* Annual Revenue Range */}
            <div className="relative" ref={revenueRef}>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                Annual Revenues (USD)
              </label>
              <button
                type="button"
                onClick={() => setIsRevenueOpen(!isRevenueOpen)}
                className={`
                  w-full px-4 py-3
                  bg-white
                  text-left
                  rounded-lg
                  shadow-sm
                  border-2
                  flex justify-between items-center
                  transition-all duration-200
                  ${isRevenueOpen ? 'border-[#46cdc6] ring-2 ring-[#46cdc6]' : 'border-gray-200 hover:border-[#46cdc6]'}
                `}
              >
                <span className={annualRevenueRange ? 'text-[#1a1a1a]' : 'text-gray-400'}>
                  {annualRevenueRange 
                    ? annualRevenueRanges.find(r => r.value === annualRevenueRange)?.label 
                    : 'Select annual revenue range'}
                </span>
                <div className="bg-[#46cdc6] px-1.5 py-1 rounded">
                  <ChevronDown 
                    className={`w-4 h-4 text-white transition-transform duration-200 ${isRevenueOpen ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>
              {isRevenueOpen && (
                <div className="absolute w-full mb-1 bottom-full bg-white rounded-lg shadow-lg border-2 border-gray-200 overflow-hidden z-50">
                  <div className="max-h-60 overflow-y-auto">
                    {annualRevenueRanges.map((range) => (
                      <button
                        key={range.value}
                        type="button"
                        onClick={() => {
                          handleRevenueChange(range.value);
                          setIsRevenueOpen(false);
                        }}
                        className={`
                          w-full px-4 py-3
                          text-left
                          hover:bg-gray-50
                          transition-colors
                          ${annualRevenueRange === range.value ? 'bg-[#46cdc6]/10 text-[#46cdc6] font-medium' : 'text-[#1a1a1a]'}
                        `}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Annual revenue in USD
              </p>
            </div>

            {/* Additional Fields */}
            <div className="pt-6 border-t border-gray-200 space-y-6">
              {/* Current Job Title */}
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                  Current Job Title
                </label>
                <input
                  type="text"
                  value={currentJobTitle}
                  onChange={(e) => setCurrentJobTitle(e.target.value)}
                  placeholder="Enter your job title"
                  className="w-full px-4 py-3 bg-white rounded-lg shadow-sm border-2 border-gray-200 focus:border-[#46cdc6] focus:ring-2 focus:ring-[#46cdc6] outline-none transition-all duration-200 text-[#1a1a1a] placeholder-gray-400"
                />
              </div>

              {/* Reporting Person Name */}
              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                  Reporting Person Name
                </label>
                <input
                  type="text"
                  value={reportingPersonName}
                  onChange={(e) => setReportingPersonName(e.target.value)}
                  placeholder="Enter reporting person's name"
                  className="w-full px-4 py-3 bg-white rounded-lg shadow-sm border-2 border-gray-200 focus:border-[#46cdc6] focus:ring-2 focus:ring-[#46cdc6] outline-none transition-all duration-200 text-[#1a1a1a] placeholder-gray-400"
                />
              </div>

              {/* Reporting Person Designation */}
              <div className="mb-8 sm:mb-12">
                <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                  Reporting Person Designation
                </label>
                <input
                  type="text"
                  value={reportingPersonDesignation}
                  onChange={(e) => setReportingPersonDesignation(e.target.value)}
                  placeholder="Enter reporting person's designation"
                  className="w-full px-4 py-3 bg-white rounded-lg shadow-sm border-2 border-gray-200 focus:border-[#46cdc6] focus:ring-2 focus:ring-[#46cdc6] outline-none transition-all duration-200 text-[#1a1a1a] placeholder-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Error Message */}
      {onboardingError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50 max-w-md mx-auto px-4"
        >
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-600 flex-1">{onboardingError}</p>
            <button
              onClick={() => setOnboardingError('')}
              className="text-red-600 hover:text-red-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </motion.div>
      )}

      {/* Sticky Action Bar */}
      {canContinueFromInfoPage() && (
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
                <p className="text-gray-500 text-sm mb-0.5">Company Information</p>
                <p className="text-gray-900 font-medium text-sm">
                  {isSubmittingOnboarding ? 'Submitting...' : 'Ready to continue'}
                </p>
              </div>
              <motion.button
                onClick={handleContinue}
                disabled={isSubmittingOnboarding}
                whileHover={!isSubmittingOnboarding ? { scale: 1.05 } : {}}
                whileTap={!isSubmittingOnboarding ? { scale: 0.98 } : {}}
                className={`relative group px-6 py-2.5 rounded-xl overflow-hidden ${
                  isSubmittingOnboarding ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#46cdc6] to-[#46cdc6]/80" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-[#46cdc6]/80 to-[#46cdc6]"
                  animate={!isSubmittingOnboarding ? {
                    x: ['-100%', '100%'],
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <div className="absolute inset-0 bg-[#46cdc6] blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                <div className="relative flex items-center gap-2 text-[#101010] font-semibold">
                  {isSubmittingOnboarding ? (
                    <>
                      <div className="w-4 h-4 border-2 border-[#101010]/30 border-t-[#101010] rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.div>
                    </>
                  )}
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

