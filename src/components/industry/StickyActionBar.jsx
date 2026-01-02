import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function StickyActionBar({ selectedIndustry, selectedSubIndustry, onContinue }) {
  // Show bar if industry is selected and (it's "Other" or sub-industry is selected)
  const shouldShow = selectedIndustry && (selectedIndustry.id === 'other' || selectedSubIndustry);
  
  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50"
        >
          {/* Backdrop blur */}
          <div className="absolute inset-0 backdrop-blur-2xl bg-gradient-to-t from-gray-50/95 via-gray-50/90 to-transparent border-t border-gray-200" />
          
          {/* Content */}
          <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-0.5">
                  {selectedSubIndustry ? 'Selected Sub-Industry' : 'Selected Industry'}
                </p>
                <p className="text-gray-900 font-medium text-sm">
                  {selectedSubIndustry ? selectedSubIndustry : selectedIndustry?.name}
                </p>
              </div>
              <motion.button
                onClick={onContinue}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="relative group px-6 py-2.5 rounded-xl overflow-hidden"
              >
                {/* Animated gradient background */}
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
                {/* Glow effect */}
                <div className="absolute inset-0 bg-[#46cdc6] blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                {/* Button content */}
                <div className="relative flex items-center gap-2 text-[#101010] font-semibold">
                  <span>Continue</span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
                  </motion.div>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
