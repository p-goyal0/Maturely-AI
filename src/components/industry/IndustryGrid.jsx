import { motion } from 'framer-motion';

export function IndustryGrid({ industries, selectedIndustry, setSelectedIndustry }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 pb-32"
    >
      {industries.map((industry, index) => {
        const Icon = industry.icon;
        const isSelected = selectedIndustry === industry.id;

        return (
          <motion.div
            key={industry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            onClick={() => setSelectedIndustry(industry.id)}
            className="relative group cursor-pointer"
          >
            {/* Glow effect on selection - contained within card */}
            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className={`
                relative backdrop-blur-xl rounded-2xl overflow-hidden h-32
                border-2 transition-all duration-500
                ${isSelected 
                  ? 'bg-gradient-to-br from-[#46cdc6]/20 to-[#46cdc6]/5 border-[#46cdc6] shadow-[0_0_30px_rgba(70,205,198,0.3)]' 
                  : 'bg-white/80 border-gray-200 hover:border-[#46cdc6]/50 hover:bg-white/90'
                }
              `}
            >
              <div className="p-4 h-full flex flex-col justify-between">
                {/* Icon container */}
                <motion.div
                  animate={{
                    scale: isSelected ? 1.1 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`
                    w-10 h-10 rounded-lg mb-2 flex items-center justify-center mx-auto
                    transition-all duration-500
                    ${isSelected 
                      ? 'bg-gradient-to-br from-[#46cdc6] to-[#46cdc6]/70 shadow-[0_0_20px_rgba(70,205,198,0.5)]' 
                      : 'bg-gray-100 group-hover:bg-[#46cdc6]/20'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-[#101010]' : 'text-[#46cdc6]'} transition-colors duration-500`} strokeWidth={1.5} />
                </motion.div>

                {/* Text content */}
                <div className="text-center flex-1 flex flex-col justify-center">
                  <h3 className={`mb-1 text-xs font-semibold transition-colors duration-500 leading-tight ${isSelected ? 'text-[#46cdc6]' : 'text-gray-900'}`}>
                    {industry.name}
                  </h3>

                  <p className="text-gray-600 text-xs leading-tight overflow-hidden" style={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {industry.description}
                  </p>
                </div>

                {/* Selection indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 0.5 }}
                    className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#46cdc6] flex items-center justify-center shadow-[0_0_15px_rgba(70,205,198,0.6)]"
                  >
                    <svg className="w-2.5 h-2.5 text-[#101010]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </div>

              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
