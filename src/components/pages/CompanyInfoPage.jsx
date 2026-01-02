import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { PageHeader } from '../shared/PageHeader';

export function CompanyInfoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [totalHeadcount, setTotalHeadcount] = useState('');
  const [marketCap, setMarketCap] = useState('');
  const [revenues, setRevenues] = useState('');

  // Get data from previous pages
  const { industry, subIndustry, companyType, isListed, stockTicker } = location.state || {};

  // Format number with commas (handles decimals)
  const formatNumber = (value, allowDecimals = false) => {
    if (!value) return '';
    // Remove all commas first
    let numericValue = value.replace(/,/g, '');
    
    if (allowDecimals) {
      // Allow only one decimal point
      const parts = numericValue.split('.');
      if (parts.length > 2) {
        numericValue = parts[0] + '.' + parts.slice(1).join('');
      }
    } else {
      // Remove decimal points for integers
      numericValue = numericValue.replace(/\./g, '');
    }
    
    // Split by decimal point if it exists
    const parts = numericValue.split('.');
    // Format the integer part with commas
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  };

  const handleHeadcountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setTotalHeadcount(formatNumber(value, false));
  };

  const handleMarketCapChange = (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    setMarketCap(formatNumber(value, true));
  };

  const handleRevenuesChange = (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    setRevenues(formatNumber(value, true));
  };

  const handleContinue = () => {
    const companyData = {
      industry,
      subIndustry,
      companyType,
      isListed,
      stockTicker,
      totalHeadcount: totalHeadcount ? parseInt(totalHeadcount.replace(/,/g, ''), 10) : null,
      marketCap: marketCap ? marketCap.replace(/,/g, '') : '',
      revenues: revenues ? revenues.replace(/,/g, '') : ''
    };
    navigate("/offerings", { state: companyData });
  };


  // Redirect if no previous data
  useEffect(() => {
    if (!industry || !companyType) {
      navigate("/industry");
    }
  }, [industry, companyType, navigate]);

  const canContinue = totalHeadcount.trim() !== '';

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
            {/* Total Headcount */}
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                Total Headcount <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={totalHeadcount}
                onChange={handleHeadcountChange}
                placeholder="e.g., 1,000"
                className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-200 focus:border-[#46cdc6] focus:ring-2 focus:ring-[#46cdc6] outline-none transition-all duration-200"
              />
              <p className="mt-1 text-xs text-gray-500">
                Total number of employees
              </p>
            </div>

            {/* Market Cap - Only for Public Companies */}
            {companyType === 'public' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                  Market Cap (USD)
                </label>
                <input
                  type="text"
                  value={marketCap}
                  onChange={handleMarketCapChange}
                  placeholder="e.g., 1,000,000,000"
                  className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-200 focus:border-[#46cdc6] focus:ring-2 focus:ring-[#46cdc6] outline-none transition-all duration-200"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Market capitalization in USD
                </p>
              </motion.div>
            )}

            {/* Revenues */}
            <div>
              <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                Annual Revenues (USD)
              </label>
              <input
                type="text"
                value={revenues}
                onChange={handleRevenuesChange}
                placeholder="e.g., 500,000,000"
                className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-200 focus:border-[#46cdc6] focus:ring-2 focus:ring-[#46cdc6] outline-none transition-all duration-200"
              />
              <p className="mt-1 text-xs text-gray-500">
                Annual revenue in USD
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Action Bar */}
      {canContinue && (
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

