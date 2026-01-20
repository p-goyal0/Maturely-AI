/**
 * Sign In Loader Component
 * Shows header and centered "Signing In" text with loader after successful sign-in
 */

import { motion } from 'framer-motion';
import { PageHeader } from './PageHeader';

export function SignInLoader() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background elements similar to other pages */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#46cdc6]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#46cdc6]/5 rounded-full blur-[100px]" />
      </div>

      {/* Tiles background pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'url("/background/tiles.png")',
          backgroundSize: '80px 80px',
          backgroundRepeat: 'repeat',
          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3)) brightness(1.2)',
        }}
      />

      {/* Header */}
      <PageHeader 
        centerItems={[
          { label: "Home", path: "/" }
        ]}
        zIndex="z-50"
      />

      {/* Main Content - Centered Loader */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] relative z-10 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center gap-4"
        >
          <motion.div
            className="w-12 h-12 border-4 border-[#46cdc6] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-gray-900 text-lg font-medium"
          >
            Signing In
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
