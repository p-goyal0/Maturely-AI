import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="max-w-2xl mx-auto mb-12"
    >
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#46cdc6]/20 to-[#46cdc6]/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative backdrop-blur-xl bg-white/90 rounded-2xl overflow-hidden shadow-lg">
          <div className="flex items-center px-6 py-4">
            <Search className="w-5 h-5 text-[#46cdc6] mr-3 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search industries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-500 outline-none border-none focus:outline-none focus:ring-0 focus:border-none"
              style={{ boxShadow: 'none !important', textDecoration: 'none', border: 'none !important', outline: 'none !important' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
