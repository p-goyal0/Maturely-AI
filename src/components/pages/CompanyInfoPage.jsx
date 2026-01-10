import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { PageHeader } from '../shared/PageHeader';
import { ChevronDown } from 'lucide-react';
import { useIndustryStore } from "../../stores/industryStore";
import { useCompanyStore } from "../../stores/companyStore";

export function CompanyInfoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
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


  const handleContinue = () => {
    // All data is in Zustand stores, no need to pass via navigation state
    navigate("/offerings");
  };


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
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] xl:text-[4rem] tracking-[-0.05rem] font-regular leading-[1] mb-8 text-[#1a1a1a] mx-auto w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%]">
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
                          setTotalHeadcountRange(range.value);
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
                            setMarketCapRange(range.value);
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
                          setAnnualRevenueRange(range.value);
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
          </div>
        </div>
      </main>

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

