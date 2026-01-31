import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Eye, EyeOff, ArrowRight, AlertCircle, Lock } from 'lucide-react';
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { SignInLoader } from "../shared/SignInLoader";
import { flushSync } from "react-dom";

export function SignInPage() {
  const navigate = useNavigate();
  const signIn = useAuthStore((state) => state.signIn);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const authImages = [
    {
      src: "/auth/authimg1.png",
      title: "Welcome Back",
      subtitle: "Continue your AI transformation journey"
    },
    {
      src: "/auth/authimg2.png",
      title: "AI-Powered Insights",
      subtitle: "Unlock the potential of artificial intelligence"
    }
  ];

  // Auto-slide carousel every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % authImages.length
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [authImages.length]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    
    // Force immediate render of loader using flushSync
    flushSync(() => {
      setShowLoader(true);
      setIsLoading(true);
    });
    
    const result = await signIn(email, password);
    
    if (result.success) {
      // Wait a moment for the loader to be visible, then navigate
      setTimeout(() => {
        // Check if onboarding is complete - if yes, go to offerings; otherwise go to industry selection
        const userData = result.data || {};
        if (userData.is_onboarding_complete === true) {
          navigate("/offerings");
        } else {
          navigate("/industry");
        }
      }, 1500); // 1.5 second delay to show the loader
    } else {
      setError(result.error || "Invalid credentials");
      setIsLoading(false);
      setShowLoader(false); // Hide loader on error
    }
  };

  // Show loader screen when signing in (isLoading or showLoader)
  if (isLoading || showLoader) {
    return <SignInLoader />;
  }

  return (
    <div className="h-screen flex overflow-hidden" style={{ backgroundColor: '#003941' }}>
      {/* Left Side - Image Carousel */}
      <div className="hidden lg:flex relative" style={{ width: '55%' }}>
        <div className="w-full h-full relative overflow-hidden">
          {/* Image Carousel */}
          {authImages.map((image, index) => (
              <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: index === currentImageIndex ? 1 : 0,
                scale: index === currentImageIndex ? 1 : 1.05
              }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
                    <img
                src={image.src}
                alt={image.title}
                      className="w-full h-full object-cover"
                    />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40" />
            </motion.div>
          ))}
          
          {/* Content Overlay */}
          <div className="absolute bottom-8 left-8 text-white z-10">
            <motion.h2 
              key={`title-${currentImageIndex}`}
              className="text-3xl font-bold mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {authImages[currentImageIndex].title}
            </motion.h2>
            <motion.p 
              key={`subtitle-${currentImageIndex}`}
              className="text-lg opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {authImages[currentImageIndex].subtitle}
            </motion.p>
                        </div>

          {/* Carousel Indicators */}
          <div className="absolute bottom-8 right-8 flex gap-2 z-10">
            {authImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? 'bg-white' 
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
                      </div>
                    </div>
                  </div>

      {/* Right Side - Form */}
      <div className="w-full flex items-center justify-center p-4 bg-white overflow-y-auto" style={{ width: '45%' }}>
        <motion.div 
          className="w-full max-w-md py-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome back</h1>
            <p className="text-slate-600">Sign in to your account</p>
          </div>

          {/* Form Container */}
                        <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {error && (
              <motion.div 
                className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-red-600 text-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSignIn} className="space-y-3">
              {/* Email Field */}
              <div className="space-y-1">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                    <span className="text-sm font-medium" style={{ color: '#15ae99' }}>@</span>
                  </div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-11 bg-gray-50 !border !border-gray-300 text-slate-900 placeholder-slate-500 rounded-lg focus:outline-none focus:!ring-0 focus:!ring-offset-0 focus:bg-gray-50 focus:!border-[#15ae99] focus:!border-2"
                    style={{ 
                      transition: 'all 0.2s ease-in-out',
                      borderWidth: '1px'
                    }}
                    required
                  />
                </div>
                          </div>

              {/* Password Field */}
              <div className="space-y-1">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 z-10" style={{ color: '#15ae99' }} />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 h-11 bg-gray-50 !border !border-gray-300 text-slate-900 placeholder-slate-500 rounded-lg focus:outline-none focus:!ring-0 focus:!ring-offset-0 focus:bg-gray-50 focus:!border-[#15ae99] focus:!border-2"
                    style={{ 
                      transition: 'all 0.2s ease-in-out',
                      borderWidth: '1px'
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
                    style={{ color: '#15ae99' }}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                          </div>
                  </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-lg text-white font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: '#15ae99' }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In
                    <ArrowRight size={18} />
                  </span>
                )}
              </Button>
            </form>

            {/* Google Sign In - Commented out for now */}
            {/* <motion.div 
              className="text-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <p className="text-sm text-slate-500">or</p>
              <Button
                variant="outline"
                className="w-full mt-2 h-10 bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign In with Google
              </Button>
            </motion.div> */}

                  <motion.div
              className="text-center mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
                  >
              <p className="text-sm text-slate-500">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="font-semibold hover:underline transition-colors"
                  style={{ color: '#15ae99' }}
                >
                  Sign up
                </button>
                    </p>
                  </motion.div>
          </motion.div>
              </motion.div>
      </div>
    </div>
  );
}
