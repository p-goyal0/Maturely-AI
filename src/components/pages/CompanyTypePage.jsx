import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { PageHeader } from '../shared/PageHeader';

export function CompanyTypePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [companyType, setCompanyType] = useState(null); // 'public' or 'private'
  const [isListed, setIsListed] = useState(false);
  const [stockTicker, setStockTicker] = useState('');

  // Get industry and subIndustry from previous page
  const industry = location.state?.industry;
  const subIndustry = location.state?.subIndustry;

  const handleContinue = () => {
    if (companyType) {
      const companyData = {
        industry,
        subIndustry,
        companyType,
        isListed: companyType === 'public' ? isListed : false,
        stockTicker: companyType === 'public' && isListed ? stockTicker : ''
      };
      navigate("/company-info", { state: companyData });
    }
  };


  // Reset stock ticker when company type changes
  useEffect(() => {
    if (companyType !== 'public') {
      setIsListed(false);
      setStockTicker('');
    }
  }, [companyType]);

  // Redirect if no industry selected
  useEffect(() => {
    if (!industry) {
      navigate("/industry");
    }
  }, [industry, navigate]);

  const canContinue = companyType && (companyType === 'private' || (companyType === 'public' && (!isListed || stockTicker.trim())));

  return (
    <div className="min-h-screen bg-[#f3f2ed] text-gray-900 relative overflow-hidden">
      {/* Header */}
      <PageHeader />

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 sm:py-12 md:py-16 min-h-screen pt-24 pb-24">
        <div className="text-center mx-auto w-full px-2 sm:px-4 md:px-6">
          <h1 className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.5rem] xl:text-[4rem] tracking-[-0.05rem] font-regular leading-[1] mb-8 text-[#1a1a1a] mx-auto w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%]">
            Are you a public or private company?
          </h1>

          {/* Company Type Selection */}
          <div className="w-[75%] sm:w-[65%] md:w-[55%] lg:w-[45%] xl:w-[35%] mx-auto space-y-4">
            {/* Public Option */}
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

            {/* Private Option */}
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

            {/* Conditional Fields for Public Company */}
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
                  >
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                      Stock Ticker Symbol
                    </label>
                    <input
                      type="text"
                      value={stockTicker}
                      onChange={(e) => setStockTicker(e.target.value.toUpperCase())}
                      placeholder="e.g., AAPL"
                      className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-200 focus:border-[#46cdc6] focus:ring-2 focus:ring-[#46cdc6] outline-none transition-all duration-200"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      You can overwrite this later if needed
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Conditional Fields for Private Company */}
            {companyType === 'private' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <p className="text-sm text-gray-600">
                  Private companies are not publicly traded on stock exchanges.
                </p>
              </motion.div>
            )}
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

