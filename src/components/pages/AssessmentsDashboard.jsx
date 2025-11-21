import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { CheckCircle2, Target, ArrowRight, ArrowLeft, LogOut } from 'lucide-react';
import Lottie from 'lottie-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';

// Lottie animations will be loaded dynamically

// Import assessment data
import { assessmentPillars } from '../../data/assessmentQuestions.json';

export function AssessmentsDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, signOut } = useAuth();
  const [currentPillarIndex, setCurrentPillarIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [completedPillars, setCompletedPillars] = useState(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [lottieAnimations, setLottieAnimations] = useState({
    document: null,
    globe: null,
    wings: null,
    chart: null,
    layers: null
  });
  const [hoveredStepIcon, setHoveredStepIcon] = useState(null);
  const [hoveredMainIcon, setHoveredMainIcon] = useState(false);

  const currentPillar = assessmentPillars[currentPillarIndex];

  // Load Lottie animations dynamically
  useEffect(() => {
    const loadAnimations = async () => {
      try {
        const [documentRes, globeRes, wingsRes, chartRes, layersRes] = await Promise.all([
          fetch('/lottieFiles/wired-outline-56-document-hover-swipe.json'),
          fetch('/lottieFiles/wired-outline-27-globe-hover-rotate.json'),
          fetch('/lottieFiles/wired-outline-1145-wings-hover-pinch.json'),
          fetch('/lottieFiles/wired-outline-153-bar-chart-hover-pinch.json'),
          fetch('/lottieFiles/wired-lineal-12-layers-hover-squeeze.json')
        ]);

        const [documentData, globeData, wingsData, chartData, layersData] = await Promise.all([
          documentRes.json(),
          globeRes.json(),
          wingsRes.json(),
          chartRes.json(),
          layersRes.json()
        ]);

        setLottieAnimations({
          document: documentData,
          globe: globeData,
          wings: wingsData,
          chart: chartData,
          layers: layersData
        });
      } catch (error) {
        console.error('Error loading Lottie animations:', error);
      }
    };

    loadAnimations();
  }, []);

  // Scroll detection for header animation
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      } else {
        setIsScrolled(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleAnswerSelect = (questionKey, level) => {
    console.log('Answer selected:', questionKey, level); // Debug log
    setAnswers(prev => ({
      ...prev,
      [questionKey]: level
    }));
  };

  const handleNextStep = () => {
    if (currentPillarIndex < assessmentPillars.length - 1) {
      setCompletedPillars(prev => new Set([...prev, currentPillarIndex]));
      setCurrentPillarIndex(prev => prev + 1);
    } else {
      navigate('/results');
    }
  };

  const handlePreviousStep = () => {
    if (currentPillarIndex > 0) {
      setCurrentPillarIndex(prev => prev - 1);
    }
  };

  const getStepStatus = (index) => {
    if (completedPillars.has(index)) return "completed";
    if (index === currentPillarIndex) return "current";
    return "waiting";
  };

  const getStepClasses = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white border-green-500";
      case "current":
        return "bg-[#46cdc6] text-white border-[#46cdc6] shadow-lg";
      case "waiting":
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background elements similar to homepage */}
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

      {/* Header with white background strip - matching landing page */}
      <motion.div 
        className="fixed top-0 left-0 right-0 z-50 bg-transparent pt-4"
        initial={{ y: 0 }}
        animate={{ y: isScrolled ? -100 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Logo - Left */}
              <div className="flex items-center gap-3">
                <img src="/logo/wings.png" alt="Logo" className="h-10 w-10 lg:h-8 lg:w-12 transition-all duration-300 group-hover:scale-110" />
                <img src="/logo/maturely_logo.png" alt="MATURITY.AI" className="h-4 lg:h-5 transition-all duration-300 group-hover:scale-110" />
              </div>

              {/* Center - Industry Link */}
              <div className="flex items-center">
                <button
                  onClick={() => navigate("/industry")}
                  className="text-sm text-slate-700 hover:text-[#46cdc6] transition-colors font-medium"
                >
                  Industry
                </button>
              </div>

              {/* Right - User Avatar with Dropdown */}
              <div className="flex items-center gap-3">
                <span className="text-gray-900 font-semibold text-sm">
                  {currentUser?.username || 'User'}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="cursor-pointer flex items-center gap-2 hover:opacity-80 transition-opacity outline-none">
                      <Avatar className="h-10 w-10 bg-[#46cdc6]">
                        <AvatarFallback className="bg-[#46cdc6] text-white font-semibold">
                          {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={() => {
                        signOut();
                        // Use setTimeout to ensure state updates before navigation
                        setTimeout(() => {
                          navigate("/");
                        }, 0);
                      }}
                      className="cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
              </div>
            </div>
          </motion.div>

      {/* SECTION 1: Hero Section */}
      <section className="pt-40 pb-20 relative z-10">
        {/* Non-uniform Gradient Overlay System - More Varied */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
          {/* Irregular teal/cyan gradient overlay with varied opacity */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-full lg:w-[65%]"
            style={{
              background: `
                linear-gradient(135deg, transparent 0%, rgba(175, 232, 221, 0.08) 15%, rgba(223, 246, 248, 0.25) 35%, rgba(194, 252, 232, 0.18) 48%, rgba(253, 255, 255, 0.12) 65%, transparent 85%, transparent 100%),
                radial-gradient(ellipse 1200px 400px at 25% 60%, rgba(223, 239, 241, 0.3) 0%, rgba(184, 245, 232, 0.15) 40%, transparent 70%),
                radial-gradient(ellipse 800px 600px at 5% 30%, rgba(227, 237, 246, 0.2) 0%, rgba(165, 243, 252, 0.1) 35%, transparent 65%),
                linear-gradient(45deg, rgba(162, 197, 201, 0.15) 0%, transparent 25%, rgba(171, 244, 229, 0.12) 50%, transparent 75%)
              `,
            }}
          />
          {/* Scattered gradient spots on top right */}
          <div 
            className="absolute right-0 top-0 w-full lg:w-[45%] h-[60%]"
            style={{
              background: `
                radial-gradient(ellipse 300px 200px at 75% 20%, rgba(165, 243, 252, 0.2) 0%, transparent 60%),
                radial-gradient(ellipse 600px 300px at 90% 10%, rgba(153, 246, 228, 0.15) 0%, rgba(236, 254, 255, 0.08) 40%, transparent 65%),
                radial-gradient(ellipse 200px 400px at 85% 45%, rgba(194, 252, 232, 0.1) 0%, transparent 50%)
              `,
            }}
          />
          {/* Additional organic spots */}
          <div 
            className="absolute left-[20%] bottom-[20%] w-[40%] h-[30%]"
            style={{
              background: `
                radial-gradient(ellipse 400px 200px at 50% 50%, rgba(223, 246, 248, 0.12) 0%, transparent 70%)
              `,
            }}
          />
        </div>
        
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Content */}
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">

            {/* Left Column - Content */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.6 }}
              className="space-y-3 lg:space-y-4 relative z-20 text-center ml-10 lg:text-left"
            >
              {/* Small Badge */}
              <div className="inline-block">
                <div className="bg-white/90 text-slate-900 px-4 py-2 rounded-full text-xs font-medium border border-gray-200 shadow-sm">
                  ✨ AI READINESS ASSESSMENT
                </div>
              </div>
              
              {/* Large Title */}
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
                  Discover Your AI Potential
                </h1>
              </div>

              {/* Description */}
              <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-lg font-medium">
                Take our comprehensive assessment to understand your organization's AI readiness across 6 critical dimensions. Get personalized insights and actionable recommendations.
              </p>

              {/* Button and Rating */}
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <button 
                  className="bg-gradient-to-r from-[#46cdc6] to-[#15ae99] hover:from-[#15ae99] hover:to-[#46cdc6] text-slate-900 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 w-full sm:w-auto"
                >
                  How Its Work
                  </button>

                {/* Rating */}
                <div className="flex items-center gap-3">
                  <div className="flex text-yellow-400 text-base sm:text-lg">
                    {'★'.repeat(5)}
                  </div>
                  <span className="text-slate-600 text-sm font-medium">
                    <span className="font-bold text-slate-900">5.0</span> from 100+ reviews
                  </span>
                </div>
              </div>
                    </motion.div>

            {/* Right Column - Stats Grid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative flex justify-center lg:justify-end mt-8 mr-10 lg:mt-0"
            >
              <div className="grid grid-cols-2 gap-0 w-full max-w-[480px] h-[416px] sm:w-[480px] sm:h-[480px] overflow-hidden shadow-lg">
                {/* Top Left */}
                <div className="bg-[#d8dfdf] p-4 sm:p-6 flex flex-col justify-center items-center">
                  <div className="w-12 h-12 sm:w-18 sm:h-18 mb-2 sm:mb-3">
                    {lottieAnimations.document && (
                      <Lottie 
                        animationData={lottieAnimations.document}
                        loop={true}
                      />
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-base sm:text-lg font-bold text-gray-800 mb-1">25+</div>
                    <div className="text-xs sm:text-md text-gray-600">Questions</div>
                  </div>
                </div>

                {/* Top Right - Beige with curve */}
                <div className="relative bg-amber-50 p-6 flex flex-col justify-center items-center overflow-hidden">
                  {/* Big background curve */}
                  <div className="absolute -top-17 -right-32 w-80 h-80 bg-[#ebe8d9] rounded-full"></div>

                  {/* Circular design elements */}
                  <div className="absolute top-4 right-4 w-16 h-16 border border-gray-300 rounded-full opacity-30"></div>
                  <div className="absolute bottom-4 left-4 w-12 h-12 border border-gray-300 rounded-full opacity-20"></div>

                  <div className="relative z-10 text-center">
                    <div className="text-2xl font-bold text-gray-800 mb-1">12+</div>
                    <div className="text-sm text-gray-600 mb-4">Sectors</div>
                    <div className="w-20 h-20 ml-15 mx-auto transform -rotate-20">
                      {lottieAnimations.globe && (
                        <Lottie 
                          animationData={lottieAnimations.globe}
                          loop={true}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Left - Light Teal with curve */}
                <div className="relative bg-[#46cdc6]/10 p-6 flex flex-col justify-center items-center overflow-hidden">
                  {/* Big background curve */}
                  <div className="absolute -bottom-30 -left-30 w-80 h-80 bg-[#e1eae8] rounded-full"></div>

                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 mb-3 mx-auto">
                      {lottieAnimations.wings && (
                        <Lottie 
                          animationData={lottieAnimations.wings}
                          loop={true}
                        />
                      )}
                    </div>
                    <div className="text-sm text-[#15ae99] font-medium mb-2">Users Active</div>
                    <div className="flex items-center justify-center">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 bg-[#46cdc6] rounded-full border-2 border-white"></div>
                        <div className="w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                        <div className="w-6 h-6 bg-purple-400 rounded-full border-2 border-white"></div>
                        <div className="w-6 h-6 bg-teal-400 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white">
                          +
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Right - Dark Teal */}
                <div className="bg-teal-800 p-4 sm:p-6 flex flex-col justify-center items-center text-white relative overflow-hidden">
                  <div className="relative z-10 text-center">
                    <div className="text-base sm:text-lg opacity-80 mb-5">Deep Analytics</div>
                    <div className="w-12 h-12 sm:w-18 sm:h-18 mx-auto">
                      {lottieAnimations.chart && (
                        <Lottie 
                          animationData={lottieAnimations.chart}
                          loop={true}
                        />
                  )}
                </div>
                  </div>
                </div>
              </div>
          </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Assessment Interface */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Left Sidebar - Compact Steps */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Assessment Steps</h3>
                  <p className="text-sm text-gray-600">Track your progress</p>
            </div>

                {/* Custom Ant Design Style Steps */}
                <div className="space-y-0">
                  {assessmentPillars.map((pillar, index) => {
                    const isCompleted = completedPillars.has(index);
                    const isCurrent = index === currentPillarIndex;
                    const isWaiting = index > currentPillarIndex;
                    
                return (
                      <div key={pillar.id} className="relative flex items-start">
                        {/* Connecting Line */}
                        {index < assessmentPillars.length - 1 && (
                          <div 
                            className={`absolute left-4 top-8 w-px h-12 ${
                              isCompleted || (isCurrent && Object.keys(answers).length > 0)
                                ? 'bg-[#46cdc6]' 
                                : 'bg-gray-300'
                            }`}
                          />
                        )}
                        
                        <div className="flex items-start w-full">
                          {/* Step Icon */}
                          <div className="relative z-10 flex items-center justify-center">
                            <div 
                              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold group ${
                                isCompleted
                                  ? 'bg-green-500 border-green-500 text-white'
                                  : isCurrent
                                    ? 'bg-[#46cdc6] border-[#46cdc6] text-white'
                                    : 'bg-white border-gray-300 text-gray-400'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : lottieAnimations.layers ? (
                                <div 
                                  className="w-6 h-6"
                                  onMouseEnter={() => setHoveredStepIcon(index)}
                                  onMouseLeave={() => setHoveredStepIcon(null)}
                                >
                                  <Lottie 
                                    key={hoveredStepIcon === index ? `hover-${index}` : `idle-${index}`}
                                    animationData={lottieAnimations.layers}
                                    loop={false}
                                    autoplay={hoveredStepIcon === index}
                                    style={{ 
                                      width: '100%', 
                                      height: '100%',
                                      cursor: 'pointer'
                                    }}
                                  />
                                </div>
                              ) : (
                                <span>{index + 1}</span>
                              )}
                            </div>
                          </div>
                          
                          {/* Step Content */}
                          <div className="ml-4 pb-8">
                            <div className={`text-sm font-semibold ${
                              isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {pillar.title}
                            </div>
                            <div className={`text-xs mt-1 ${
                              isCompleted || isCurrent ? 'text-gray-600' : 'text-gray-400'
                            }`}>
                              {pillar.description}
                            </div>
                            {/* Status */}
                            <div className={`text-xs font-medium mt-2 ${
                              isCompleted 
                                ? 'text-green-600' 
                                : isCurrent 
                                  ? 'text-[#46cdc6]' 
                                  : 'text-gray-400'
                            }`}>
                              {isCompleted ? 'Finished' : isCurrent ? 'In Progress' : 'Waiting'}
                            </div>
                          </div>
                        </div>
                        </div>
                );
              })}
            </div>
              </div>
            </div>

            {/* Assessment Content */}
            <div className="lg:col-span-3 space-y-4">
              {/* Step Information - No Image */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-12 h-12 bg-gradient-to-br from-[#46cdc6] to-[#15ae99] rounded-2xl flex items-center justify-center group"
                    onMouseEnter={() => setHoveredMainIcon(true)}
                    onMouseLeave={() => setHoveredMainIcon(false)}
                  >
                    {lottieAnimations.layers ? (
                      <div className="w-8 h-8">
                        <Lottie 
                          key={hoveredMainIcon ? 'hover-main' : 'idle-main'}
                          animationData={lottieAnimations.layers}
                          loop={false}
                          autoplay={hoveredMainIcon}
                          style={{ 
                            width: '100%', 
                            height: '100%',
                            cursor: 'pointer'
                          }}
                        />
                      </div>
                    ) : (
                      <Target className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#46cdc6] mb-1">
                      STEP {currentPillarIndex + 1}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{currentPillar.title}</h2>
                  </div>
                  <div className="ml-auto bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 border">
                    <div className="text-xs text-gray-600">Section {currentPillarIndex + 1}/{assessmentPillars.length}</div>
                    <div className="text-sm font-semibold text-[#46cdc6]">
                      {currentPillar.questions.filter((_, qIndex) => 
                        answers[`${currentPillar.id}-${qIndex}`]
                      ).length}/{currentPillar.questions.length} Complete
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{currentPillar.description}</p>

                <div className="bg-[#46cdc6]/10 border border-[#46cdc6]/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#46cdc6] rounded-full flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm text-[#15ae99]">
                        Rate each statement using options A through E based on your organization's current state.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* All Questions for Current Pillar - Single Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {currentPillar.title} Questions
                  </h3>
                  <div className="text-sm text-gray-500">
                    {currentPillar.questions.length} questions
                  </div>
                </div>
                
                <div className="space-y-6">
                  {currentPillar.questions.map((question, questionIndex) => {
                    const questionKey = `${currentPillar.id}-${questionIndex}`;
                    const selectedAnswer = answers[questionKey];
                    
                    return (
                      <div 
                        key={questionIndex}
                        className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                            selectedAnswer 
                              ? 'bg-[#46cdc6] text-white' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {questionIndex + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900 mb-1">
                              {question}
                            </h4>
                          </div>
                          {selectedAnswer && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                            >
                              <CheckCircle2 className="w-3 h-3 text-white" />
          </motion.div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-5 gap-2 ml-9">
                          {['A', 'B', 'C', 'D', 'E'].map((option, index) => {
                            const isSelected = selectedAnswer === option;
                            
                            return (
                              <motion.button 
                                key={option}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  console.log('Button clicked:', questionKey, option);
                                  handleAnswerSelect(questionKey, option);
                                }}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg text-sm font-medium border cursor-pointer relative z-10 overflow-hidden ${
                                  isSelected 
                                    ? 'bg-[#46cdc6]/10 text-[#15ae99] border-[#46cdc6] shadow-md' 
                                    : 'bg-white text-gray-700 hover:bg-[#46cdc6]/10 hover:text-[#46cdc6] border-gray-300 hover:border-[#46cdc6] shadow-sm'
                                }`}
                                type="button"
                                whileHover={{ 
                                  scale: 1.05
                                }}
                                whileTap={{ 
                                  scale: 0.95 
                                }}
                                animate={isSelected ? {
                                  scale: 1,
                                  backgroundColor: 'rgb(207, 250, 254)'
                                } : {
                                  scale: 1,
                                  backgroundColor: 'rgb(255, 255, 255)'
                                }}
                                transition={{ 
                                  duration: 0.1,
                                  ease: "easeOut"
                                }}
                              >
                                <motion.div 
                                  className="font-bold text-lg pointer-events-none"
                                  animate={isSelected ? { 
                                    scale: 1.15,
                                    color: 'rgb(14, 116, 144)'
                                  } : {
                                    scale: 1,
                                    color: 'rgb(55, 65, 81)'
                                  }}
                                  transition={{ 
                                    duration: 0.15,
                                    ease: "easeOut"
                                  }}
                                >
                                  {option}
          </motion.div>
                                {isSelected && (
                                  <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ 
                                      duration: 0.2,
                                      ease: "easeOut"
                                    }}
                                    className="absolute inset-0 bg-[#46cdc6]/30 rounded-lg"
                                  />
                                )}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Action Bar - Only show when assessment has started */}
      {Object.keys(answers).length > 0 && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Progress: {Object.keys(answers).length} of {assessmentPillars.reduce((total, pillar) => total + pillar.questions.length, 0)} questions
                  </div>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[#46cdc6] to-[#15ae99] h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(Object.keys(answers).length / assessmentPillars.reduce((total, pillar) => total + pillar.questions.length, 0)) * 100}%` 
                    }}
                  ></div>
                  </div>
                </div>
              
              <div className="flex items-center gap-3">
                {currentPillarIndex > 0 && (
                  <motion.button
                    onClick={handlePreviousStep}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Previous
                  </motion.button>
                )}
                
                <motion.button
                  onClick={handleNextStep}
                  className="bg-gradient-to-r from-[#46cdc6] to-[#15ae99] hover:from-[#15ae99] hover:to-[#46cdc6] text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {currentPillarIndex === assessmentPillars.length - 1 ? 'View Results' : 'Continue'}
                  {currentPillarIndex < assessmentPillars.length - 1 && (
                    <span className="ml-2">
                      ({currentPillarIndex + 1}/{assessmentPillars.length})
                    </span>
                  )}
                </motion.button>  
        </div>
      </div>
          </div>
        </motion.div>
      )}

      {/* Bottom padding to prevent content overlap - only when sticky bar is visible */}
      {Object.keys(answers).length > 0 && <div className="h-20"></div>}
    </div>
  );
}
