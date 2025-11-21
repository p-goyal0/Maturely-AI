import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowRight, Rocket, ChevronLeft, ChevronRight, Brain, Lightbulb, Map, Shield, BarChart3, Users, CheckCircle2, Sparkles, Target, Zap } from 'lucide-react';
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentCapability, setCurrentCapability] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        setIsScrolled(false);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsScrolled(true);
      } else if (currentScrollY < lastScrollY) {
        setIsScrolled(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/industry");
    } else {
      navigate("/signin");
    }
  };

  useEffect(() => {
    const t = setInterval(() => setCurrentCapability((c) => (c === 0 ? 1 : 0)), 10000);
    return () => clearInterval(t);
  }, []);

  const capabilities = [
    { icon: Brain, title: 'AI Maturity Assessments', description: 'Evaluate strategy, data, technology and governance', bgGradient: 'from-blue-600 to-indigo-600', borderColor: 'border-blue-500', shadowColor: '#3b82f6', gradient: 'from-blue-500 to-indigo-500' },
    { icon: Lightbulb, title: 'Use Case Library', description: 'Curated industry-specific applications', bgGradient: 'from-purple-600 to-pink-600', borderColor: 'border-purple-500', shadowColor: '#a855f7', gradient: 'from-purple-500 to-pink-500' },
    { icon: Map, title: 'Roadmap Generator', description: 'Automated transformation plans', bgGradient: 'from-cyan-600 to-blue-600', borderColor: 'border-cyan-500', shadowColor: '#06b6d4', gradient: 'from-cyan-500 to-blue-500' },
    { icon: Shield, title: 'Responsible AI', description: 'Governance, compliance and privacy', bgGradient: 'from-green-600 to-emerald-600', borderColor: 'border-green-500', shadowColor: '#10b981', gradient: 'from-green-500 to-emerald-500' },
    { icon: BarChart3, title: 'Benchmarking', description: 'Compare against industry standards', bgGradient: 'from-orange-600 to-red-600', borderColor: 'border-orange-500', shadowColor: '#f97316', gradient: 'from-orange-500 to-red-500' },
    { icon: Users, title: 'Role-based Access', description: 'Enterprise permissions and controls', bgGradient: 'from-slate-600 to-gray-600', borderColor: 'border-slate-500', shadowColor: '#64748b', gradient: 'from-slate-500 to-gray-500' },
  ];

  const industries = [
    { name: 'Finance', image: 'Finance.png', icon: Brain, color: 'from-blue-500 to-indigo-500', description: 'Transform financial services with AI-powered insights and automation', link: 'Explore Finance AI' },
    { name: 'Healthcare', image: 'Healthcare.png', icon: Shield, color: 'from-green-500 to-emerald-500', description: 'Enhance patient care with intelligent healthcare solutions', link: 'Explore Healthcare AI' },
    { name: 'Automotive', image: 'Automotive.png', icon: Map, color: 'from-purple-500 to-pink-500', description: 'Drive innovation in automotive manufacturing and services', link: 'Explore Automotive AI' },
    { name: 'Energy & Utilities', image: 'Energy and Utilities.png', icon: Sparkles, color: 'from-yellow-500 to-orange-500', description: 'Balance grid loads, predict equipment failures, and integrate renewables efficiently with AI that analyzes consumption, generation, and asset data at scale.', link: 'Explore Energy AI' },
  ];

  const steps = [
    { number: "01", title: "Assess", description: "Evaluate current AI maturity across all dimensions with intelligent questionnaires", icon: Target },
    { number: "02", title: "Analyze", description: "Generate insights, identify gaps, and benchmark against industry leaders", icon: BarChart3 },
    { number: "03", title: "Transform", description: "Execute strategic roadmap with prioritized initiatives and measurable outcomes", icon: Zap },
  ];

  const stats = [
    { label: "Enterprise Clients", value: 500, suffix: "+" },
    { label: "Industries Covered", value: 15, suffix: "+" },
    { label: "Assessments Completed", value: 5000, suffix: "+" },
    { label: "Success Rate", value: 94, suffix: "%" },
  ];

  const logos = [
    "Fortune 500 Leaders",
    "Global Enterprises",
    "Industry Innovators",
    "Trusted by 2000+",
  ];

  const nextCard = () => {
    if (isDragging) return;
    setIsDragging(true);
    setCurrentCardIndex((i) => (i + 1) % capabilities.length);
    setTimeout(() => setIsDragging(false), 500);
  };

  const prevCard = () => {
    if (isDragging) return;
    setIsDragging(true);
    setCurrentCardIndex((i) => (i === 0 ? capabilities.length - 1 : i - 1));
    setTimeout(() => setIsDragging(false), 500);
  };

  const goToCard = (index) => setCurrentCardIndex(index);

  // Typing animation for description text
  const fullDescriptionText = "Assess. Strategize. Execute AI with confidence across any industry. Enterprise-grade platform trusted by global leaders.";
  
  useEffect(() => {
    setTypedText("");
    setShowCursor(true);
    
    // First, show cursor and let it blink 2 times before starting
    const startDelay = setTimeout(() => {
      let currentIndex = 0;
      
      const typeNextChar = () => {
        if (currentIndex < fullDescriptionText.length) {
          const char = fullDescriptionText[currentIndex];
          setTypedText(fullDescriptionText.slice(0, currentIndex + 1));
          currentIndex++;
          
          // Determine delay based on character
          let delay = 50; // Default typing speed (faster)
          
          // Longer pause after periods
          if (char === '.') {
            delay = 300;
          }
          // Medium pause after spaces (end of words)
          else if (char === ' ') {
            delay = 100;
          }
          // Slightly longer pause for capital letters
          else if (char === char.toUpperCase() && char !== char.toLowerCase()) {
            delay = 80;
          }
          
          setTimeout(typeNextChar, delay);
        } else {
          // Hide cursor after typing is complete
          setTimeout(() => setShowCursor(false), 800);
        }
      };
      
      // Start typing after initial cursor blink
      typeNextChar();
    }, 1000); // Wait 1 second (2 cursor blinks) before starting

    return () => clearTimeout(startDelay);
  }, []);

  // Blinking cursor effect
  useEffect(() => {
    if (!showCursor) return;
    
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500); // Blink every 500ms

    return () => clearInterval(cursorInterval);
  }, [showCursor]);

  // Helper function to render typed text with styling
  const renderTypedText = () => {
    if (!typedText) return null;
    
    const parts = [];
    const text = typedText;
    
    // Define styled words with their exact positions in the text
    const styledWords = [
      { word: "Assess", color: "text-cyan-600", start: 0, end: 6 },
      { word: "Strategize", color: "text-teal-600", start: 8, end: 18 },
      { word: "Execute", color: "text-cyan-600", start: 20, end: 27 },
      { word: "grade", color: "text-teal-600", start: 79, end: 84 },
      { word: "platform", color: "text-teal-600", start: 85, end: 93 },
      { word: "trusted", color: "text-teal-600", start: 94, end: 101 },
    ];

    let i = 0;
    while (i < text.length) {
      const styledWord = styledWords.find(sw => i >= sw.start && i < sw.end);
      
      if (styledWord) {
        // We're in a styled word
        const endPos = Math.min(styledWord.end, text.length);
        const wordText = text.slice(i, endPos);
        parts.push(
          <span key={i} className={`font-semibold ${styledWord.color}`}>
            {wordText}
          </span>
        );
        i = endPos;
      } else {
        // Regular text - find next styled word or end
        const nextStyledWord = styledWords.find(sw => sw.start > i);
        const endPos = nextStyledWord ? nextStyledWord.start : text.length;
        const regularText = text.slice(i, endPos);
        if (regularText) {
          parts.push(regularText);
        }
        i = endPos;
      }
    }

    return parts;
  };

  return (
    <div className="min-h-screen relative bg-white">
      {/* Landing Page Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-transparent"
        initial={{ y: 0 }}
        animate={{ y: isScrolled ? -100 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          {/* White rounded header strip */}
          <div className="bg-white rounded-2xl shadow-lg px-6 lg:px-8 py-2">
            <div className="flex items-center justify-between h-12 lg:h-14 relative">
            {/* Logo - Left */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-3 group relative z-10"
            >
                <img 
                  src="/logo/wings.png" 
                  alt="AI Maturity Platform Logo" 
                  className="h-10 w-10 lg:h-8 lg:w-12 transition-all duration-300 group-hover:scale-110"
                />
                <img 
                  src="/logo/maturely_logo.png" 
                  alt="MATURITY.AI" 
                  className="h-4 lg:h-5 transition-all duration-300 group-hover:scale-110"
                />
            </motion.button>

            {/* Navigation Items - Center */}
            <div className="hidden lg:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
              <Button
                variant="ghost"
                className="text-sm text-slate-700 hover:text-cyan-600 transition-colors font-medium"
                style={{ fontFamily: 'Segoe UI, sans-serif' }}
              >
                Services
              </Button>
              <Button
                variant="ghost"
                className="text-sm text-slate-700 hover:text-cyan-600 transition-colors font-medium"
                style={{ fontFamily: 'Segoe UI, sans-serif' }}
              >
                About
              </Button>
              <Button
                variant="ghost"
                className="text-sm text-slate-700 hover:text-cyan-600 transition-colors font-medium"
                style={{ fontFamily: 'Segoe UI, sans-serif' }}
              >
                Let's Talk
              </Button>
            </div>

            {/* Get Started Button - Right */}
            <div className="z-10">
              <Button
                onClick={handleGetStarted}
                className="text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:opacity-90 px-6 py-2 text-sm"
                style={{ fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#1e9e8c' }}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
        </div>
      </motion.header>

      {/* Global Animation Styles */}
      <style>{`
        @keyframes text-slide-up-1 { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes text-slide-up-2 { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes typewriter { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes liquid-morph { 0% { opacity: 0; transform: scale(0.95); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes badge-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.9; transform: scale(1.02); } }
        @keyframes rocket-launch { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
        .animate-text-slide-up-1 { animation: text-slide-up-1 0.8s ease-out forwards; }
        .animate-text-slide-up-2 { animation: text-slide-up-2 0.8s ease-out forwards; }
        .animate-typewriter { animation: typewriter 0.8s ease-out forwards; }
        .animate-liquid-morph { animation: liquid-morph 0.6s ease-out forwards; }
        .animate-badge-pulse { animation: badge-pulse 2s ease-in-out infinite; }
        .animate-rocket-launch { animation: rocket-launch 1s ease-in-out infinite; }
      `}</style>

      {/* Hero Section - Light with gradient and grid pattern */}
      <section className="relative pt-20 pb-12 lg:pt-24 lg:pb-16 overflow-visible bg-gradient-to-r from-cyan-50/50 via-white to-white" style={{ minHeight: 'calc(100vh - 80px)' }}>
        {/* Grid Pattern Background with rounded rectangles - Embossed Tiles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
          {/* Base tiles pattern */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(/background/tiles.png)',
              backgroundSize: '400px 400px',
              backgroundRepeat: 'repeat',
              opacity: 0.6,
            }}
          />
          {/* Embossed shadow effect - bottom and right edges */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(/background/tiles.png)',
              backgroundSize: '400px 400px',
              backgroundRepeat: 'repeat',
              opacity: 0.3,
              filter: 'drop-shadow(0 1.5px 2px rgba(0, 0, 0, 0.1)) drop-shadow(1.5px 0 2px rgba(0, 0, 0, 0.1))',
              transform: 'translate(0.5px, 0.5px)',
            }}
          />
          {/* Embossed highlight effect - top and left edges */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'url(/background/tiles.png)',
              backgroundSize: '400px 400px',
              backgroundRepeat: 'repeat',
              opacity: 0.4,
              filter: 'drop-shadow(0 -0.5px 1px rgba(255, 255, 255, 0.8)) drop-shadow(-0.5px 0 1px rgba(255, 255, 255, 0.8)) brightness(1.1)',
              transform: 'translate(-0.5px, -0.5px)',
            }}
          />
        </div>
        
        {/* Non-uniform background color overlay for depth variation - Teal/Cyan behind text - Above tiles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
          {/* Non-uniform teal/cyan gradient overlay behind text content area */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-full lg:w-[55%]"
            style={{
              background: `
                linear-gradient(to bottom, transparent 0%, transparent 10%, rgba(175, 232, 221, 0.15) 25%, rgba(223, 246, 248, 0.4) 45%, rgba(194, 252, 232, 0.35) 55%, rgba(253, 255, 255, 0.15) 75%, transparent 90%, transparent 100%),
                radial-gradient(ellipse 900px 600px at 30% 50%, rgba(223, 239, 241, 0.4) 0%, rgba(184, 245, 232, 0.32) 30%, rgba(239, 247, 248, 0.2) 60%, transparent 80%),
                radial-gradient(ellipse 600px 400px at 10% 50%, rgba(227, 237, 246, 0.35) 0%, transparent 50%),
                linear-gradient(to right, rgba(162, 197, 201, 0.28) 0%, rgba(171, 244, 229, 0.24) 40%, rgba(181, 183, 183, 0.12) 70%, transparent 100%)
              `,
            }}
          />
          {/* Subtle gradient overlay on top right */}
          <div 
            className="absolute right-0 top-0 w-full lg:w-[30%] h-[40%]"
            style={{
              background: `
                radial-gradient(ellipse 500px 400px at 85% 15%, rgba(165, 243, 252, 0.32) 0%, rgba(153, 246, 228, 0.24) 30%, rgba(236, 254, 255, 0.14) 50%, transparent 70%)
              `,
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative h-full flex items-center" style={{ zIndex: 10 }}>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full py-8">
            {/* Left Column - Text Content */}
            <div className="space-y-5 lg:space-y-6 relative" style={{ zIndex: 20 }}>
              {/* Badge */}
                      <motion.div
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                        transition={{ delay: 0.1 }}
                className="relative"
                style={{ zIndex: 21 }}
                      >
                <Badge className="bg-white text-black border-gray-200 px-4 py-2 rounded-full text-xs font-medium tracking-wider relative" style={{ zIndex: 22, fontFamily: 'Segoe UI, sans-serif', fontWeight: 500 }}>
                          ✨ Enterprise AI Transformation Platform
                        </Badge>
                      </motion.div>
          
              {/* Headline */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight relative tracking-tight"
                style={{ fontFamily: 'Segoe UI, sans-serif', zIndex: 21, fontWeight: 600, letterSpacing: '-0.02em' }}
              >
                <span className="block">Accelerate Your</span>
                <span className="block text-slate-900">
                          AI Transformation
                        </span>
              </motion.h1>

              {/* Description */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3 }}
                className="text-sm md:text-base text-slate-600 leading-relaxed max-w-xl relative font-normal"
                style={{ fontFamily: 'Segoe UI, sans-serif', zIndex: 21, fontWeight: 400 }}
              >
                {renderTypedText()}
                {showCursor && cursorVisible && (
                  <span className="inline-block w-[2px] h-5 bg-slate-600 ml-1 align-middle"></span>
                )}
              </motion.p>

              {/* Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.4 }}
                className="relative"
                style={{ zIndex: 21 }}
              >
                        <Button
                          size="lg"
                  onClick={() => navigate("/industry")} 
                  className="text-base px-8 py-6 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:opacity-90"
                  style={{ fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#1e9e8c', fontWeight: 600 }}
                >
                  <span>How Its Work</span>
                  <Rocket className="ml-2 w-5 h-5" />
                        </Button>
              </motion.div>
                      </div>

            {/* Right Column - Image */}
                      <motion.div
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.5 }}
              className="relative hidden lg:block w-full flex items-center justify-center"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl w-full">
                <img
                  src="/team-collaboration-working-together-technology-inn.jpg"
                  alt="AI Technology Team Collaboration"
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: '450px', objectFit: 'cover' }}
                />
                {/* Optional overlay with data visualizations effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-600/20 to-transparent pointer-events-none rounded-2xl" />
                              </div>
                                </motion.div>
                      </div>
                    </div>
                  </section>

                  {/* Our Core AI Capabilities Section - WHITE with Auto-Rotating Carousel */}
                  <section className="py-24 relative bg-white overflow-hidden">
                    <div className="container mx-auto px-6 sm:px-12 lg:px-20 relative z-10 max-w-7xl">
                      {/* Section Header */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                      >
                        <h2 className="text-3xl lg:text-4xl mb-4 font-bold text-slate-900">
                          See how we solve problems, <span className="text-slate-400">right on target</span>
                        </h2>
                      </motion.div>

                      {/* Auto-Rotating Capability Box */}
                      <div className="relative h-[600px]">
                        <AnimatePresence mode="wait">
                          {currentCapability === 0 ? (
                            <motion.div
                              key="predictive"
                              initial={{ opacity: 0, x: 100 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -100 }}
                              transition={{ duration: 1.5, ease: "easeInOut" }}
                              className="absolute inset-0"
                            >
                              {/* Blue Box - Predictive Analytics */}
                              <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl shadow-2xl h-full overflow-hidden">
                                <div className="grid md:grid-cols-2 gap-0 h-full">
                                  {/* Text Content - Left */}
                                  <div className="p-8 flex flex-col justify-center">
                                    <div className="mb-3">
                                      <span className="text-purple-400 text-sm font-semibold uppercase tracking-wider">
                                        Predictive Analytics
                                      </span>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-4">
                                      Anticipate Market Trends
                                    </h3>
                                    <p className="text-slate-300 mb-6 leading-relaxed text-base">
                                      Our predictive models analyze historical and real-time data to forecast future outcomes with remarkable accuracy, giving you a critical competitive advantage.
                                    </p>
                        
                                    <ul className="space-y-3">
                                      <li className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                          <CheckCircle2 className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-slate-200 text-sm">Reduce risk with data-driven foresight.</span>
                                      </li>
                                      <li className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                          <CheckCircle2 className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-slate-200 text-sm">Optimize inventory and resource allocation.</span>
                                      </li>
                                      <li className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                          <CheckCircle2 className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-slate-200 text-sm">Identify new growth opportunities.</span>
                                      </li>
                                    </ul>
                                  </div>

                                  {/* Image - Right */}
                                  <div className="relative p-8 pl-0 flex items-center justify-center">
                                    <div className="relative rounded-2xl overflow-hidden shadow-2xl w-full h-5/6">
                                      <img
                                        src="/modules/coreAI1.png"
                                        alt="Predictive Analytics Dashboard"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="automation"
                              initial={{ opacity: 0, x: 100 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -100 }}
                              transition={{ duration: 1.2, ease: "easeInOut" }}
                              className="absolute inset-0"
                            >
                              {/* Blue Box - Intelligent Automation */}
                              <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl shadow-2xl h-full overflow-hidden">
                                <div className="grid md:grid-cols-2 gap-0 h-full">
                                  {/* Text Content - Left */}
                                  <div className="p-8 flex flex-col justify-center">
                                    <div className="mb-3">
                                      <span className="text-purple-400 text-sm font-semibold uppercase tracking-wider">
                                        Intelligent Automation
                                      </span>
                                    </div>
                                    <h3 className="text-3xl font-bold text-white mb-4">
                                      Streamline Complex Processes
                                    </h3>
                                    <p className="text-slate-300 mb-6 leading-relaxed text-base">
                                      Implement AI-powered automation to handle repetitive tasks, streamline workflows, and free up your human capital for strategic initiatives.
                                    </p>
                        
                                    <ul className="space-y-3">
                                      <li className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                          <CheckCircle2 className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-slate-200 text-sm">Increase operational efficiency and reduce costs.</span>
                                      </li>
                                      <li className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                          <CheckCircle2 className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-slate-200 text-sm">Minimize human error and improve consistency.</span>
                                      </li>
                                      <li className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                          <CheckCircle2 className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-slate-200 text-sm">Scale your operations seamlessly.</span>
                                      </li>
                                    </ul>
                                  </div>

                                  {/* Image - Right */}
                                  <div className="relative p-8 pl-0 flex items-center justify-center">
                                    <div className="relative rounded-2xl overflow-hidden shadow-2xl w-full h-5/6">
                                      <img
                                        src="/modules/coreAI2.png"
                                        alt="Intelligent Automation"
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Tab Indicators */}
                      <div className="flex justify-center gap-4 mt-8">
                        <button
                          onClick={() => setCurrentCapability(0)}
                          className={`transition-all duration-300 ${
                            currentCapability === 0 
                              ? 'w-12 h-3 bg-blue-600 rounded-full' 
                              : 'w-3 h-3 bg-slate-300 rounded-full hover:bg-slate-400'
                          }`}
                        />
                        <button
                          onClick={() => setCurrentCapability(1)}
                          className={`transition-all duration-300 ${
                            currentCapability === 1 
                              ? 'w-12 h-3 bg-blue-600 rounded-full' 
                              : 'w-3 h-3 bg-slate-300 rounded-full hover:bg-slate-400'
                          }`}
                        />
                      </div>
                    </div>
                  </section>

                  {/* Capabilities Section - DARK */}
                  <section className="py-20 relative bg-gradient-to-b from-slate-900 to-slate-800">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                      >
                        <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/20 backdrop-blur-sm">
                          Capabilities
                        </Badge>
                        <h2 className="text-3xl lg:text-4xl mb-4 font-bold text-white">Enterprise-Grade AI Platform</h2>
                        <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                          Comprehensive suite of tools for end-to-end AI transformation
                        </p>
                      </motion.div>

                      {/* Premium Horizontal Scrolling Carousel */}
                      <div className="relative">
                        {/* Navigation Buttons */}
                        <button 
                          onClick={prevCard}
                          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-full flex items-center justify-center hover:bg-slate-700/80 hover:scale-110 transition-all duration-300 group"
                        >
                          <ChevronLeft className="w-6 h-6 text-slate-300 group-hover:text-white transition-colors" />
                        </button>
                        <button 
                          onClick={nextCard}
                          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-slate-800/80 backdrop-blur-xl border border-slate-700 rounded-full flex items-center justify-center hover:bg-slate-700/80 hover:scale-110 transition-all duration-300 group"
                        >
                          <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-white transition-colors" />
                        </button>

                        {/* Carousel Container */}
                        <div className="relative h-[400px] flex items-center justify-center">
                          {/* Cards Container */}
                          <div className="relative w-full h-[320px] flex items-center justify-center">
                            {capabilities.map((capability, index) => {
                              const diff = index - currentCardIndex;
                              const totalCards = 6;
                  
                              // Calculate proper diff considering wrap-around
                              let normalizedDiff = diff;
                              if (Math.abs(diff) > totalCards / 2) {
                                normalizedDiff = diff > 0 ? diff - totalCards : diff + totalCards;
                              }
                  
                              // Determine card style based on position
                              let transformValue = '';
                              let opacityValue = 0;
                              let zIndexValue = 10;
                              let pointerEventsValue = 'none';
                              let visibilityValue = 'hidden';
                  
                              if (normalizedDiff === 0) {
                                // Center card
                                transformValue = 'translateX(0) scale(1)';
                                opacityValue = 1;
                                zIndexValue = 30;
                                pointerEventsValue = 'auto';
                                visibilityValue = 'visible';
                              } else if (normalizedDiff === -1) {
                                // Left card
                                transformValue = 'translateX(-85%) scale(0.85)';
                                opacityValue = 0.6;
                                zIndexValue = 20;
                                pointerEventsValue = 'auto';
                                visibilityValue = 'visible';
                              } else if (normalizedDiff === 1) {
                                // Right card
                                transformValue = 'translateX(85%) scale(0.85)';
                                opacityValue = 0.6;
                                zIndexValue = 20;
                                pointerEventsValue = 'auto';
                                visibilityValue = 'visible';
                              } else {
                                // Hidden cards
                                transformValue = normalizedDiff < 0 ? 'translateX(-150%) scale(0.7)' : 'translateX(150%) scale(0.7)';
                                opacityValue = 0;
                                zIndexValue = 1;
                                pointerEventsValue = 'none';
                                visibilityValue = 'hidden';
                              }
                  
                              const isCenter = normalizedDiff === 0;
                              const Icon = capability.icon;
                  
                              return (
                                <div 
                                  key={index}
                                  className={`absolute w-[400px] ${normalizedDiff >= -1 && normalizedDiff <= 1 ? 'cursor-pointer' : ''}`}
                                  style={{
                                    transform: transformValue,
                                    opacity: opacityValue,
                                    zIndex: zIndexValue,
                                    pointerEvents: pointerEventsValue,
                                    visibility: visibilityValue,
                                    transition: normalizedDiff >= -1 && normalizedDiff <= 1 ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.1s ease, z-index 0s' : 'none'
                                  }}
                                  onClick={() => !isCenter && normalizedDiff >= -1 && normalizedDiff <= 1 && goToCard(index)}
                                >
                                  <div 
                                    className={`relative h-[320px] bg-gradient-to-br ${capability.bgGradient} backdrop-blur-xl border-2 ${capability.borderColor} rounded-3xl p-8 transition-all duration-300 hover:scale-[1.02] group shadow-2xl`}
                                    style={{ 
                                      boxShadow: isCenter 
                                        ? `0 0 0 2px ${capability.shadowColor}, 0 8px 32px ${capability.shadowColor}40, 0 0 60px ${capability.shadowColor}20` 
                                        : `0 0 0 1px rgba(255,255,255,0.1), 0 4px 20px rgba(0,0,0,0.3)`
                                    }}
                                  >
                                    {/* Animated Background Pattern */}
                                    <div className="absolute inset-0 rounded-3xl overflow-hidden">
                                      <div className={`absolute inset-0 bg-gradient-to-r ${capability.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-700`}></div>
                                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.15)_0%,transparent_60%)]"></div>
                                      <div className={`absolute inset-0 bg-gradient-to-tr ${capability.gradient} opacity-10`}></div>
                                    </div>
                        
                                    {/* Content */}
                                    <div className="relative z-10">
                                      {/* Icon Container */}
                                      <div className="mb-6 relative">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${capability.gradient} rounded-2xl blur-2xl opacity-60 group-hover:opacity-80 transition-all duration-500`}></div>
                                        <div className={`relative w-16 h-16 bg-gradient-to-br ${capability.gradient} rounded-2xl flex items-center justify-center transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 shadow-xl`}>
                                          <Icon className="w-8 h-8 text-white drop-shadow-lg" />
                                        </div>
                                      </div>
                          
                                      {/* Text Content */}
                                      <h3 className="text-2xl font-bold text-white mb-4 transition-all duration-300 drop-shadow-md">
                                        {capability.title}
                                      </h3>
                                      <p className="text-slate-200 leading-relaxed text-base">
                                        {capability.description}
                                      </p>
                                    </div>
                        
                                    {/* Decorative Elements */}
                                    <div className="absolute top-8 right-8 w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl"></div>
                                    <div className="absolute bottom-8 left-8 w-20 h-20 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-2xl"></div>
                                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br ${capability.gradient} rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-700`}></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
            
                        {/* Progress Indicators */}
                        <div className="flex justify-center gap-3 mt-12">
                          {[0, 1, 2, 3, 4, 5].map((dot) => (
                            <button
                              key={dot}
                              onClick={() => goToCard(dot)}
                              className={`transition-all duration-500 rounded-full ${
                                currentCardIndex === dot 
                                  ? 'w-10 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 shadow-lg shadow-cyan-500/50' 
                                  : 'w-3 h-3 bg-slate-600 hover:bg-slate-500'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Industries Section - Trusted Across All Sectors - LIGHT */}
                  <section className="py-20 relative bg-white overflow-hidden">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                      >
                        <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200"> 
                          Industries
                        </Badge>
                        <h2 className="text-3xl lg:text-4xl mb-4 font-bold text-slate-900">Trusted Across All Sectors</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                          Industry-specific AI solutions tailored to your vertical
                        </p>
                      </motion.div>

                      {/* Infinite Scrolling Container */}
                      <style>{`
                        @keyframes scroll-left {
                          0% {
                            transform: translateX(0);
                          }
                          100% {
                            transform: translateX(-50%);
                          }
                        }
            
                        .animate-scroll {
                          animation: scroll-left 30s linear infinite;
                        }
            
                        .animate-scroll:hover {
                          animation-play-state: paused;
                        }
                      `}</style>

                      <div className="relative">
                        {/* Gradient overlays for fade effect - stronger and wider */}
                        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
            
                        <div className="flex animate-scroll">
                          {/* First set of cards */}
                          {industries.map((industry, index) => {
                            const Icon = industry.icon;
                            return (
                              <div
                                key={`first-${index}`}
                                className="flex-shrink-0 w-[350px] mx-3"
                              >
                                <Card className="bg-white border-slate-200 hover:border-blue-400 hover:shadow-xl cursor-pointer group overflow-hidden h-full transition-all duration-300">
                                  {/* Image Section */}
                                  <div className="p-3">
                                    <div className="relative h-72 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200">
                                      <img 
                                        src={`/${industry.image}`}
                                        alt={industry.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                      />
                                      {/* Light overlay on image */}
                                      <div className="absolute inset-0 bg-slate-900/10"></div>
                                    </div>
                                  </div>

                                  <CardHeader className="pt-1 px-3 pb-2">
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${industry.color} flex items-center justify-center shadow-lg`}>
                                        <Icon className="w-5 h-5 text-white" />
                                      </div>
                                      <CardTitle className="text-xl text-slate-900">{industry.name}</CardTitle>
                                    </div>
                                    <CardDescription className="text-slate-600 leading-relaxed text-sm line-clamp-3">
                                      {industry.description}
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent className="pt-0">
                                    <Button 
                                      variant="ghost" 
                                      className={`text-transparent bg-clip-text bg-gradient-to-r ${industry.color} hover:opacity-80 p-0 group/btn`}
                          onClick={() => navigate("/assessments", { state: { industry: industry.name } })}
                                    >
                                      {industry.link} 
                                      <ArrowRight className="ml-2 w-4 h-4 text-blue-600 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                  </CardContent>
                                </Card>
                              </div>
                            );
                          })}
              
                          {/* Duplicate set for seamless loop */}
                          {industries.map((industry, index) => {
                            const Icon = industry.icon;
                            return (
                              <div
                                key={`second-${index}`}
                                className="flex-shrink-0 w-[350px] mx-3"
                              >
                                <Card className="bg-white border-slate-200 hover:border-blue-400 hover:shadow-xl cursor-pointer group overflow-hidden h-full transition-all duration-300">
                                  {/* Image Section */}
                                  <div className="p-3">
                                    <div className="relative h-72 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200">
                                      <img 
                                        src={`/${industry.image}`}
                                        alt={industry.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                      />
                                      {/* Light overlay on image */}
                                      <div className="absolute inset-0 bg-slate-900/10"></div>
                                    </div>
                                  </div>

                                  <CardHeader className="pt-1 px-3 pb-2">
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${industry.color} flex items-center justify-center shadow-lg`}>
                                        <Icon className="w-5 h-5 text-white" />
                                      </div>
                                      <CardTitle className="text-xl text-slate-900">{industry.name}</CardTitle>
                                    </div>
                                    <CardDescription className="text-slate-600 leading-relaxed text-sm line-clamp-3">
                                      {industry.description}
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent className="pt-0">
                                    <Button 
                                      variant="ghost" 
                                      className={`text-transparent bg-clip-text bg-gradient-to-r ${industry.color} hover:opacity-80 p-0 group/btn`}
                          onClick={() => navigate("/assessments", { state: { industry: industry.name } })}
                                    >
                                      {industry.link} 
                                      <ArrowRight className="ml-2 w-4 h-4 text-blue-600 group-hover/btn:translate-x-1 transition-transform" />
                                    </Button>
                                  </CardContent>
                                </Card>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Stats Section - LIGHT
                  <section className="py-20 relative bg-white border-y border-slate-200">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {stats.map((stat, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="text-center"
                          >
                            <AnimatedCounter
                              from={0}
                              to={stat.value}
                              suffix={stat.suffix}
                              duration={2}
                            />
                            <p className="text-sm text-slate-600 mt-2">{stat.label}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </section> */}

                  {/* Pricing Section - DARK with blue theme */}
                  <section className="py-20 relative bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
                    {/* Grid pattern background - positioned on top right */}
                    <div 
                      className="absolute top-0 right-0 w-1/2 h-2/3 opacity-70 pointer-events-none"
                      style={{
                        backgroundImage: `
                          linear-gradient(rgba(59, 130, 246, 0.4) 1.5px, transparent 1.5px),
                          linear-gradient(90deg, rgba(59, 130, 246, 0.4) 1.5px, transparent 1.5px)
                        `,
                        backgroundSize: '60px 60px',
                        maskImage: 'radial-gradient(ellipse 800px 400px at top right, black, transparent)',
                        WebkitMaskImage: 'radial-gradient(ellipse 800px 400px at top right, black, transparent)'
                      }}
                    />

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                      >
                        <Badge className="mb-4 bg-blue-500/10 text-blue-300 border-blue-500/20 backdrop-blur-sm">
                          Pricing
                        </Badge>
                        <h2 className="text-3xl lg:text-4xl mb-4 font-bold text-white">
                          Flexible Pricing Plans<br />for Every Need
                        </h2>
                        <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
                          Choose the plan that best fits your requirements and<br />start optimizing your time today!
                        </p>

                        {/* Monthly/Annually Toggle */}
                        <div className="flex items-center justify-center gap-4 mb-12">
                          <span className="text-white font-medium">Monthly</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-cyan-600"></div>
                          </label>
                          <span className="text-white font-medium">Anually</span>
                          <span className="text-blue-300 text-sm bg-blue-500/20 px-2 py-1 rounded">Save up to 20%</span>
                        </div>
                      </motion.div>

                      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Small Plan */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 }}
                          whileHover={{ y: -8 }}
                        >
                          <Card className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 border-slate-700 backdrop-blur-sm hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 h-full transition-all duration-300 relative overflow-hidden">
                            {/* Grid pattern on top right */}
                            <div 
                              className="absolute top-0 right-0 w-48 h-48 opacity-40 pointer-events-none"
                              style={{
                                backgroundImage: `
                                  linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
                                `,
                                backgroundSize: '40px 40px',
                                maskImage: 'radial-gradient(ellipse at top right, black 0%, transparent 70%)',
                                WebkitMaskImage: 'radial-gradient(ellipse at top right, black 0%, transparent 70%)'
                              }}
                            />
                
                            <CardHeader>
                              <CardTitle className="text-2xl text-white">Small</CardTitle>
                              <div className="mt-4">
                                <span className="text-4xl font-bold text-blue-400">$600</span>
                                <span className="text-slate-400">/year</span>
                              </div>
                              <CardDescription className="text-slate-300 mt-4">
                                Perfect for small teams getting started
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-3">
                                <li className="flex items-start gap-2 text-slate-300">
                                  <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                  <span>Up to 3 assessments per year</span>
                                </li>
                                <li className="flex items-start gap-2 text-slate-300">
                                  <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                  <span>Basic roadmap generation</span>
                                </li>
                                <li className="flex items-start gap-2 text-slate-300">
                                  <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                  <span>Access to use case library</span>
                                </li>
                                <li className="flex items-start gap-2 text-slate-300">
                                  <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                  <span>Email support</span>
                                </li>
                              </ul>
                              <Button 
                                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => navigate("/signup")}
                              >
                                Get Started
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>

                        {/* Medium Plan */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 }}
                          whileHover={{ y: -8 }}
                        >
                          <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/40 border-cyan-500 backdrop-blur-sm hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-400/30 h-full relative overflow-hidden transition-all duration-300">
                            {/* Grid pattern on top right - more visible on featured card */}
                            <div 
                              className="absolute top-0 right-0 w-48 h-48 opacity-50 pointer-events-none"
                              style={{
                                backgroundImage: `
                                  linear-gradient(rgba(6, 182, 212, 0.6) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(6, 182, 212, 0.6) 1px, transparent 1px)
                                `,
                                backgroundSize: '40px 40px',
                                maskImage: 'radial-gradient(ellipse at top right, black 0%, transparent 70%)',
                                WebkitMaskImage: 'radial-gradient(ellipse at top right, black 0%, transparent 70%)'
                              }}
                            />
                
                            <div className="absolute top-0 right-0 bg-gradient-to-br from-cyan-500 to-blue-600 text-white px-4 py-1 text-sm font-semibold">
                              Popular
                            </div>
                            <CardHeader>
                              <CardTitle className="text-2xl text-white">Medium</CardTitle>
                              <div className="mt-4">
                                <span className="text-4xl font-bold text-cyan-400">$999</span>
                                <span className="text-slate-300">/year</span>
                              </div>
                              <CardDescription className="text-slate-200 mt-4">
                                Ideal for growing organizations
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-3">
                                <li className="flex items-start gap-2 text-slate-200">
                                  <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                                  <span>Unlimited assessments</span>
                                </li>
                                <li className="flex items-start gap-2 text-slate-200">
                                  <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                                  <span>Advanced roadmap generation</span>
                                </li>
                                <li className="flex items-start gap-2 text-slate-200">
                                  <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                                  <span>Full use case library access</span>
                                </li>
                                <li className="flex items-start gap-2 text-slate-200">
                                  <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                                  <span>Benchmarking & analytics</span>
                                </li>
                                <li className="flex items-start gap-2 text-slate-200">
                                  <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                                  <span>Priority support</span>
                                </li>
                              </ul>
                              <Button 
                                className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                    onClick={() => navigate("/signup")}
                              >
                                Get Started
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>

                        {/* Enterprise Plan */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 }}
                          whileHover={{ y: -8 }}
                        >
                          <Card className="bg-gradient-to-b from-slate-800/50 to-slate-900/50 border-slate-700 backdrop-blur-sm hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/20 h-full transition-all duration-300 relative overflow-hidden">
                            {/* Grid pattern on top right */}
                            <div 
                              className="absolute top-0 right-0 w-48 h-48 opacity-40 pointer-events-none"
                              style={{
                                backgroundImage: `
                                  linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)
                                `,
                                backgroundSize: '40px 40px',
                                maskImage: 'radial-gradient(ellipse at top right, black 0%, transparent 70%)',
                                WebkitMaskImage: 'radial-gradient(ellipse at top right, black 0%, transparent 70%)'
                              }}
                            />
                
                            <CardHeader>
                              <CardTitle className="text-2xl text-white">Enterprise</CardTitle>
                              <div className="mt-4">
                                <span className="text-3xl font-bold text-blue-400">Contact Us</span>
                              </div>
                              <CardDescription className="text-slate-300 mt-4">
                                Custom solutions for large enterprises
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-3">
                                <li className="flex items-start gap-2 text-slate-300">
                                  <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                  <span>Everything in Medium</span>
                                </li>
                                <li className="flex items-start gap-2 text-slate-300">
                                  <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                  <span>Custom AI maturity frameworks</span>
                                </li>
                                <li className="flex items-start gap-2 text-slate-300">
                                  <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                  <span>Dedicated account manager</span>
                                </li>
                                <li className="flex items-start gap-2 text-slate-300">
                                  <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                  <span>Role-based access controls</span>
                                </li>
                                <li className="flex items-start gap-2 text-slate-300">
                                  <CheckCircle2 className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                                  <span>24/7 premium support</span>
                                </li>
                              </ul>
                              <Button 
                                variant="outline"
                                className="w-full mt-6 border-blue-400 text-blue-300 hover:bg-blue-500/20 hover:text-white"
                    onClick={() => navigate("/signup")}
                              >
                                Contact Sales
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </div>
                    </div>
                  </section>

                  {/* Trusted Logos Section - LIGHT */}
                  <section className="py-20 border-t border-slate-200 relative bg-gradient-to-b from-white to-slate-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center"
                      >
                        <p className="text-slate-600 mb-8 text-sm uppercase tracking-wider font-medium">
                          Trusted by Industry Leaders
                        </p>
                        <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
                          {logos.map((logo, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0 }}
                              whileInView={{ opacity: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.1 }}
                              className="text-lg text-slate-600 hover:text-slate-900 transition-colors font-semibold"
                            >
                              {logo}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  </section>

                  {/* Footer - DARK */}
                  <footer className="border-t border-slate-700 py-12 relative bg-slate-900">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                        >
                          <div>
                <div className="flex items-center gap-4 mb-2">
                            <img 
                    src="/logo/wings.png" 
                              alt="AI Maturity Platform Logo" 
                    className="h-[140px] w-auto"
                  />
                  <img 
                    src="/logo/maturely_logo.png" 
                    alt="MATURITY.AI" 
                    className="h-[40px] w-auto"
                  />
                </div>
                            <p className="text-sm text-slate-400">
                            Enterprise AI transformation made simple
                          </p>

                          </div>
              
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.05 }}
                        >
                          <h4 className="mb-4 text-sm font-semibold text-slate-100">Platform</h4>
                          <ul className="space-y-2 text-sm text-slate-400">
                            <li>
                  <button onClick={() => navigate("/assessments")} className="hover:text-slate-100 transition-colors">
                                Assessments
                              </button>
                            </li>
                            <li>
                  <button onClick={() => navigate("/roadmap")} className="hover:text-slate-100 transition-colors">
                                Roadmaps
                              </button>
                            </li>
                            <li>
                  <button onClick={() => navigate("/usecases")} className="hover:text-slate-100 transition-colors">
                                Use Cases
                              </button>
                            </li>
                          </ul>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 }}
                        >
                          <h4 className="mb-4 text-sm font-semibold text-slate-100">Resources</h4>
                          <ul className="space-y-2 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-slate-100 transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-slate-100 transition-colors">API Reference</a></li>
                            <li><a href="#" className="hover:text-slate-100 transition-colors">Support</a></li>
                          </ul>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.15 }}
                        >
                          <h4 className="mb-4 text-sm font-semibold text-slate-100">Company</h4>
                          <ul className="space-y-2 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-slate-100 transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-slate-100 transition-colors">Contact</a></li>
                            <li><a href="#" className="hover:text-slate-100 transition-colors">Privacy</a></li>
                          </ul>
                        </motion.div>
                      </div>
                      <div className="pt-8 border-t border-slate-700/50 text-center text-sm text-slate-500">
                        <p>© 2025 AI Maturity Platform. All rights reserved.</p>
                      </div>
                    </div>
                  </footer>
                </div>
              );
            }
