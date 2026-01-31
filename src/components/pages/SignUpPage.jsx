import { Navigation } from "../shared/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Eye, EyeOff, ArrowRight, CheckCircle2, Zap, Users, TrendingUp, AlertCircle, Lock, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signUp as signUpAPI, getTermsOfService } from "../../services/authService";

export function SignUpPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    companyName: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showTOSModal, setShowTOSModal] = useState(false);
  const [tosContent, setTosContent] = useState(null);
  const [isLoadingTOS, setIsLoadingTOS] = useState(false);
  const [tosError, setTosError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  /**
   * Parse HTML content and extract sections
   */
  const parseTOSContent = (htmlContent) => {
    if (!htmlContent) return [];
    
    // Remove the duplicate "Terms and Conditions" heading from the beginning of content
    // Pattern matches: <p><strong>Terms and Conditions</strong> or <p>Terms and Conditions
    let cleanedContent = htmlContent.replace(
      /<p>(?:<strong>)?\s*Terms\s+and\s+Conditions\s*(?:<\/strong>)?\s*<br>/i,
      ''
    );
    
    // Also remove "Last Updated" line if it follows immediately
    cleanedContent = cleanedContent.replace(
      /<p><em>Last\s+Updated[^<]*<\/em><\/p>\s*/i,
      ''
    );
    
    // Pattern to match numbered sections: <p>1. Title<br> or <p>1. Title<br> (handles \r\n)
    // Also handles cases with <strong> tags: <p><strong>1. Title</strong><br>
    const sectionPattern = /<p>(?:<strong>)?(\d+)\.\s+([^<]+)(?:<\/strong>)?<br>/gi;
    const sections = [];
    const matches = [];
    
    // Find all section matches
    let match;
    while ((match = sectionPattern.exec(cleanedContent)) !== null) {
      matches.push({
        number: match[1],
        title: match[2].trim(),
        startIndex: match.index,
        headerLength: match[0].length,
      });
    }

    if (matches.length === 0) {
      // No sections found, return as single content block
      return [{
        type: 'content',
        content: cleanedContent,
      }];
    }

    // Process each section
    for (let i = 0; i < matches.length; i++) {
      const currentMatch = matches[i];
      const nextMatch = matches[i + 1];
      
      // Get content before first section
      if (i === 0 && currentMatch.startIndex > 0) {
        const beforeContent = cleanedContent.substring(0, currentMatch.startIndex);
        if (beforeContent.trim()) {
          sections.push({
            type: 'content',
            content: beforeContent,
          });
        }
      }

      // Get section content (from after header to next section or end)
      const contentStart = currentMatch.startIndex + currentMatch.headerLength;
      const contentEnd = nextMatch ? nextMatch.startIndex : cleanedContent.length;
      let sectionContent = cleanedContent.substring(contentStart, contentEnd);
      
      // Clean up the content (remove leading/trailing whitespace, \r\n)
      sectionContent = sectionContent.trim();

      sections.push({
        type: 'section',
        number: currentMatch.number,
        title: currentMatch.title,
        content: sectionContent,
        id: `section-${currentMatch.number}`,
      });
    }

    return sections;
  };

  /**
   * Toggle section expansion
   */
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const authImages = [
    {
      src: "/auth/authimg1.png",
      title: "Easy to Find Client",
      subtitle: "Find client from all around the world"
    },
    {
      src: "/auth/authimg2.png",
      title: "Start Your Journey",
      subtitle: "Begin your AI transformation today"
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setError("");
    
    if (currentStep === 1) {
      // Validate step 1
      if (!formData.fullName || !formData.email) {
        setError("Please fill in all fields");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Validate step 2
      if (!formData.companyName) {
        setError("Please enter a company name");
        return;
      }
      setCurrentStep(3);
    }
  };

  const handleTermsClick = async (e) => {
    e.preventDefault();
    setShowTOSModal(true);
    setIsLoadingTOS(true);
    setTosError(null);
    setExpandedSections({}); // Reset expanded sections
    
    const result = await getTermsOfService();
    
    if (result.success) {
      setTosContent(result.data);
      // Parse sections and set first section to collapsed (not in expandedSections)
      const sections = parseTOSContent(result.data.content);
      const firstSection = sections.find(s => s.type === 'section');
      if (firstSection) {
        // First section starts collapsed, so don't add it to expandedSections
        setExpandedSections({});
      }
    } else {
      setTosError(result.error || 'Failed to load Terms and Conditions');
    }
    
    setIsLoadingTOS(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }

    setIsLoading(true);
    
    try {
      // Get device info
      const deviceInfo = `${navigator.userAgent || 'Browser'}`;
      
      // Map form data to API format
      const signUpData = {
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        organization_name: formData.companyName,
        tos_accepted: formData.agreeToTerms ? "true" : "false",
        device_info: deviceInfo,
      };

      const result = await signUpAPI(signUpData);
    
    if (result.success) {
        // Token is automatically stored by the service
        // Navigate to industry selection page
      navigate("/industry");
    } else {
        setError(result.error || "Registration failed. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
      console.error('Sign up error:', error);
    }
  };

  const benefits = [
    {
      icon: Zap,
      title: "Get Started in Minutes",
      description: "Complete your first assessment instantly"
    },
    {
      icon: Users,
      title: "Invite Your Team",
      description: "Collaborate with colleagues on assessments"
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your AI maturity growth over time"
    }
  ];

  const steps = ["Personal Info", "Company Details", "Password & Terms"];

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
          {/* Logo */}
          {/* <div className="flex justify-center mb-8">
            <img 
              src="/logo/wings.png" 
              alt="Logo" 
              className="h-50 w-50"
            />
          </div> */}

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-slate-900 mb-1">Create your account</h1>
            <p className="text-slate-600 text-sm">start for free</p>
          </div>

                  {/* Progress Steps */}
          <div className="mb-4">
            <div className="flex gap-2 mb-2">
              {steps.map((_, index) => (
                <div
                          key={index}
                  className={`flex-1 h-1 rounded-full ${
                            index < currentStep
                      ? 'bg-slate-900'
                      : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
            <p className="text-xs text-slate-500 text-center">
              Step {currentStep} of {steps.length}
                    </p>
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

            <form onSubmit={currentStep === 3 ? handleSignUp : handleNextStep} className="space-y-3">
              {/* Step 1: Personal Info */}
                        {currentStep === 1 && (
                          <>
                  <div className="space-y-1">
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 z-10" style={{ color: '#15ae99' }} />
                              <Input
                                name="fullName"
                                type="text"
                        placeholder="Full name"
                                value={formData.fullName}
                                onChange={handleInputChange}
                        className="pl-12 h-11 bg-gray-50 !border !border-gray-300 text-slate-900 placeholder-slate-500 rounded-lg focus:outline-none focus:!ring-0 focus:!ring-offset-0 focus:bg-gray-50 focus:!border-[#15ae99] focus:!border-2"
                        style={{ 
                          transition: 'all 0.2s ease-in-out',
                          borderWidth: '1px'
                        }}
                                required
                              />
                    </div>
                  </div>

                  <div className="space-y-1">
                              <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                        <span className="text-sm font-medium" style={{ color: '#15ae99' }}>✉</span>
                      </div>
                                <Input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                                  onChange={handleInputChange}
                        className="pl-12 h-11 bg-gray-50 !border !border-gray-300 text-slate-900 placeholder-slate-500 rounded-lg focus:outline-none focus:!ring-0 focus:!ring-offset-0 focus:bg-gray-50 focus:!border-[#15ae99] focus:!border-2"
                        style={{ 
                          transition: 'all 0.2s ease-in-out',
                          borderWidth: '1px'
                        }}
                                  required
                                />
                    </div>
                              </div>
                          </>
                        )}

                        {/* Step 2: Company Details */}
                        {currentStep === 2 && (
                <div className="space-y-1">
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                      <span className="text-sm font-medium" style={{ color: '#15ae99' }}>🏢</span>
                    </div>
                              <Input
                      name="companyName"
                                type="text"
                      placeholder="Company name"
                      value={formData.companyName}
                                onChange={handleInputChange}
                      className="pl-12 h-11 bg-gray-50 !border !border-gray-300 text-slate-900 placeholder-slate-500 rounded-lg focus:outline-none focus:!ring-0 focus:!ring-offset-0 focus:bg-gray-50 focus:!border-[#15ae99] focus:!border-2"
                      style={{ 
                        transition: 'all 0.2s ease-in-out',
                        borderWidth: '1px'
                      }}
                                required
                              />
                  </div>
                </div>
              )}

              {/* Step 3: Password & Terms */}
              {currentStep === 3 && (
                <>
                  <div className="space-y-1">
                              <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 z-10" style={{ color: '#15ae99' }} />
                                <Input
                        name="password"
                                  type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={formData.password}
                                  onChange={handleInputChange}
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

                  <div className="space-y-1">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 z-10" style={{ color: '#15ae99' }} />
                      <Input
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="pl-12 pr-12 h-11 bg-gray-50 !border !border-gray-300 text-slate-900 placeholder-slate-500 rounded-lg focus:outline-none focus:!ring-0 focus:!ring-offset-0 focus:bg-gray-50 focus:!border-[#15ae99] focus:!border-2"
                        style={{ 
                          transition: 'all 0.2s ease-in-out',
                          borderWidth: '1px'
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-2">
                                <input
                                  type="checkbox"
                                  name="agreeToTerms"
                                  checked={formData.agreeToTerms}
                                  onChange={handleInputChange}
                      className="mt-1 rounded border-slate-300 bg-white text-slate-900"
                      style={{ accentColor: '#15ae99' }}
                                  required
                                />
                    <span className="text-sm text-slate-600">
                      I agree with the{" "}
                      <button 
                        type="button" 
                        onClick={handleTermsClick}
                        className="underline hover:no-underline" 
                        style={{ color: '#15ae99' }}
                      >
                        Terms & Condition
                                  </button>
                                </span>
                  </div>
                          </>
                        )}

                          <Button
                            type="submit"
                            disabled={isLoading}
                className="w-full h-11 rounded-lg text-white font-semibold transition-all hover:opacity-90"
                style={{ backgroundColor: '#15ae99' }}
                          >
                            {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {currentStep === 3 ? 'Creating...' : 'Continue...'}
                              </span>
                            ) : (
                  <span className="flex items-center justify-center gap-2">
                    {currentStep === 3 ? 'Continue' : 'Continue'}
                                <ArrowRight size={18} />
                              </span>
                            )}
                          </Button>

              {currentStep > 1 && (
                          <Button
                            type="button"
                  variant="ghost"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="w-full h-11 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                          >
                            Back
                          </Button>
                        )}
                      </form>

              {/* Google Sign Up - Commented out for now */}
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
                Sign Up with Google
              </Button>
                        </motion.div> */}

                  <motion.div
              className="text-center mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
                  >
              <p className="text-sm text-slate-500">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/signin")}
                  className="font-semibold hover:underline transition-colors"
                  style={{ color: '#15ae99' }}
                >
                  Login
                </button>
                    </p>
                  </motion.div>
          </motion.div>
              </motion.div>
      </div>

      {/* Terms and Conditions Modal */}
      <AnimatePresence>
        {showTOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowTOSModal(false)}
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col z-50"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-slate-900">
                  Terms and Conditions
                </h2>
                <button
                  onClick={() => setShowTOSModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {isLoadingTOS && (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-[#15ae99] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                
                {tosError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {tosError}
                  </div>
                )}
                
                {!isLoadingTOS && !tosError && tosContent && (() => {
                  const sections = parseTOSContent(tosContent.content);
                  return (
                    <div className="space-y-4">
                      {sections.map((section, index) => {
                        if (section.type === 'content') {
                          return (
                            <div
                              key={`content-${index}`}
                              className="prose prose-slate max-w-none text-slate-700"
                              dangerouslySetInnerHTML={{ __html: section.content }}
                            />
                          );
                        }

                        const isExpanded = expandedSections[section.id];
                        
                        return (
                          <div
                            key={section.id}
                            className="border border-gray-200 rounded-lg overflow-hidden"
                          >
                            {/* Section Header */}
                            <button
                              onClick={() => toggleSection(section.id)}
                              className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                            >
                              <span className="text-lg font-bold text-slate-900">
                                {section.number}. {section.title}
                              </span>
                              <motion.div
                                animate={{ rotate: isExpanded ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronDown className="w-5 h-5 text-slate-700" />
                              </motion.div>
                            </button>

                            {/* Section Content */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div
                                    className="p-4 prose prose-slate max-w-none text-slate-700"
                                    dangerouslySetInnerHTML={{ __html: section.content }}
                                  />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
