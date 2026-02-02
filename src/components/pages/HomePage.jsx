import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowRight, ArrowUpRight, Rocket, ChevronLeft, ChevronRight, Brain, Lightbulb, Map, Shield, BarChart3, Users, CheckCircle2, Sparkles, Target, Zap } from 'lucide-react';
import Lottie from 'lottie-react';
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

export default function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [currentCapability, setCurrentCapability] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAnnual, setIsAnnual] = useState(true);
  const [currentHeadlineIndex, setCurrentHeadlineIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');

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
    { icon: Brain, lottieFile: '/lottieFiles/wired-outline-966-privacy-policy-hover-swipe.json', title: 'AI Readiness Assessments', description: 'Evaluate strategy, data, technology and governance to identify strengths and opportunities', bgColor: 'bg-blue-600', bgGradient: 'from-blue-600 to-blue-600' },
    { icon: Lightbulb, lottieFile: '/lottieFiles/wired-outline-12-layers-hover-slide.json', title: 'Use Case Library', description: 'Curated industry-specific applications and proven solutions for immediate value', bgColor: '', bgGradient: 'from-purple-500 to-pink-500' },
    { icon: Shield, lottieFile: '/lottieFiles/wired-outline-1383-sphere-hover-pinch.json', title: 'Responsible AI', description: 'Governance, compliance and privacy determination to build trust and mitigate risks', bgColor: 'bg-green-500', bgGradient: 'from-green-500 to-green-500' },
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


  // Rotating headlines data
  const headlines = [
    {
      headline: "Most AI Roadmaps Fail. Ensure Yours Won't.",
      subheadline: "Don't build your strategy on intuition. Audit your true AI readiness and unlock a data-backed plan to bridge the gap between hype and reality."
    },
    {
      headline: "Stop Guessing. Start Scaling.",
      subheadline: "Benchmark your AI adoption with precision. Get an unbiased readiness score and a battle-tested roadmap for execution—in under 10 minutes."
    },
    {
      headline: "Your AI Strategy, Validated in 10 Minutes.",
      subheadline: "Move from \"exploring\" to \"executing.\" Instantly generate your organization's AI Maturity Score and a personalized blueprint of high-impact use cases"
    }
  ];

  // Rotate headlines every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeadlineIndex((prev) => (prev + 1) % headlines.length);
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, []);

  // Scroll spy to detect active section
  useEffect(() => {
    const sections = ['hero', 'features', 'pricing'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Offset for header

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on mount

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const headerOffset = 100;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen relative bg-white overflow-x-hidden">
      {/* Landing Page Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-transparent"
        initial={{ y: 0 }}
        animate={{ y: isScrolled ? -100 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 pt-4">
          {/* White rounded header strip */}
          <div className="bg-white rounded-2xl shadow-lg px-6 lg:px-8 2xl:px-10 py-2 w-full">
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

            {/* Navigation Items - Center - Scroll Spy Navigation */}
            <div className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
              <button
                onClick={() => scrollToSection('hero')}
                className={`group relative text-sm font-medium transition-all duration-300 pb-1 ${
                  activeSection === 'hero'
                    ? 'text-cyan-600 font-semibold'
                    : 'text-slate-700 hover:text-cyan-600'
                }`}
                style={{ fontFamily: 'Segoe UI, sans-serif' }}
              >
                Home
                {/* Animated underline - expands from center */}
                <span 
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-cyan-600 transition-all duration-300 ease-out ${
                    activeSection === 'hero'
                      ? 'w-[120%]'
                      : 'w-0 group-hover:w-[120%]'
                  }`}
                />
                {/* Subtle glow effect when active */}
                {activeSection === 'hero' && (
                  <motion.span
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-cyan-400 blur-sm opacity-50"
                    initial={{ width: 0 }}
                    animate={{ width: '120%' }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className={`group relative text-sm font-medium transition-all duration-300 pb-1 ${
                  activeSection === 'features'
                    ? 'text-cyan-600 font-semibold'
                    : 'text-slate-700 hover:text-cyan-600'
                }`}
                style={{ fontFamily: 'Segoe UI, sans-serif' }}
              >
                Features
                {/* Animated underline - expands from center */}
                <span 
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-cyan-600 transition-all duration-300 ease-out ${
                    activeSection === 'features'
                      ? 'w-[120%]'
                      : 'w-0 group-hover:w-[120%]'
                  }`}
                />
                {/* Subtle glow effect when active */}
                {activeSection === 'features' && (
                  <motion.span
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-cyan-400 blur-sm opacity-50"
                    initial={{ width: 0 }}
                    animate={{ width: '120%' }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className={`group relative text-sm font-medium transition-all duration-300 pb-1 ${
                  activeSection === 'pricing'
                    ? 'text-cyan-600 font-semibold'
                    : 'text-slate-700 hover:text-cyan-600'
                }`}
                style={{ fontFamily: 'Segoe UI, sans-serif' }}
              >
                Pricing
                {/* Animated underline - expands from center */}
                <span 
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-cyan-600 transition-all duration-300 ease-out ${
                    activeSection === 'pricing'
                      ? 'w-[120%]'
                      : 'w-0 group-hover:w-[120%]'
                  }`}
                />
                {/* Subtle glow effect when active */}
                {activeSection === 'pricing' && (
                  <motion.span
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-cyan-400 blur-sm opacity-50"
                    initial={{ width: 0 }}
                    animate={{ width: '120%' }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
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
        /* Individual hover tooltip styles - each popup shows only on its own item hover */
        .hover-item:hover .popup-tooltip {
          opacity: 1 !important;
          visibility: visible !important;
        }

        /* Pricing section: Uiverse-style tooltips (by mihocsaszilard) */
        .pricing-tooltip-container {
          --tooltip-bg: #185D54;
          position: relative;
          cursor: pointer;
          display: inline-flex;
          padding: 0 0.2em;
          border: 1px solid transparent;
        }
        .pricing-tooltip-container:hover .pricing-tooltip-text {
          color: #134a43;
        }
        .pricing-tooltip-popup {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-bottom: 0.35rem;
          padding: 0.35em 0.65em;
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s ease;
          color: #fff;
          background: var(--tooltip-bg);
          border-radius: 0.25em;
          font-size: 0.875rem;
          line-height: 1.4;
          max-width: 16rem;
          text-align: center;
          box-shadow: 0 4px 14px rgba(0,0,0,0.15);
          z-index: 50;
        }
        .pricing-tooltip-popup::before {
          position: absolute;
          content: "";
          height: 0.5em;
          width: 0.5em;
          top: 100%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
          background: var(--tooltip-bg);
        }
        .pricing-tooltip-container:hover .pricing-tooltip-popup {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        }
        .pricing-tooltip-text {
          transition: color 0.2s ease, font-weight 0.2s ease;
        }
        
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
      <section id="hero" className="relative pt-20 pb-8 lg:pt-24 lg:pb-12 overflow-visible bg-gradient-to-r from-cyan-50/50 via-white to-white">
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

        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 relative flex items-center" style={{ zIndex: 10 }}>
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full py-12 lg:py-16 xl:py-20">
            {/* Left Column - Text Content */}
            <div className="space-y-5 lg:space-y-6 relative" style={{ zIndex: 20 }}>
              {/* Headline - Rotating */}
              <AnimatePresence mode="wait">
                <motion.h1 
                  key={currentHeadlineIndex}
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-black text-slate-900 leading-tight relative tracking-tight"
                  style={{ fontFamily: 'Segoe UI, sans-serif', zIndex: 21, fontWeight: 600, letterSpacing: '-0.02em' }}
                >
                  {headlines[currentHeadlineIndex].headline}
                </motion.h1>
              </AnimatePresence>

              {/* Description - Rotating */}
              <AnimatePresence mode="wait">
                <motion.p 
                  key={`subheadline-${currentHeadlineIndex}`}
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-sm md:text-base lg:text-lg 2xl:text-xl text-slate-600 leading-relaxed max-w-xl 2xl:max-w-2xl relative font-normal"
                  style={{ fontFamily: 'Segoe UI, sans-serif', zIndex: 21, fontWeight: 400 }}
                >
                  {headlines[currentHeadlineIndex].subheadline}
                </motion.p>
              </AnimatePresence>

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
                  <span>Lets demo how this works</span>
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
                  className="w-full h-auto object-cover max-h-[450px] 2xl:max-h-[520px]"
                />
                {/* Optional overlay with data visualizations effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-600/20 to-transparent pointer-events-none rounded-2xl" />
                              </div>
                                </motion.div>
                      </div>
                    </div>
                  </section>

                  {/* Capabilities Section - WHITE */}
                  <section id="features" className="py-12 lg:py-16 xl:py-20 relative bg-white">
                    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 relative z-10">
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="mb-16"
                      >
                        <div className="grid lg:grid-cols-2 gap-8 items-end">
                          {/* Left Side - Heading */}
                          <div>
                            <Badge className="mb-4 bg-green-100 text-green-700 border-green-200 uppercase tracking-wider text-xs font-medium px-3 py-1" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                              CAPABILITIES
                            </Badge>
                            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 leading-tight" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                              <span className="block">Enterprise-Grade</span>
                              <span className="block">AI readiness assessment Platform</span>
                            </h2>
                          </div>
                          
                          {/* Right Side - Description */}
                          <div className="lg:pl-8">
                            <p className="text-base lg:text-lg text-slate-600 leading-relaxed" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                              Comprehensive suite of tools for end-to-end AI transformation
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Cards Grid */}
                      <div className="flex flex-col md:flex-row gap-6 w-full">
                        {capabilities.map((capability, index) => {
                          const isFirstTwo = index < 2;
                          const isThirdCard = index === 2;
                          const [lottieData, setLottieData] = useState(null);
                          
                          useEffect(() => {
                            fetch(capability.lottieFile)
                              .then(response => {
                                if (!response.ok) {
                                  throw new Error(`HTTP error! status: ${response.status}`);
                                }
                                return response.json();
                              })
                              .then(data => setLottieData(data))
                              .catch(error => {
                                console.error('Error loading Lottie animation:', error);
                                console.error('Failed to load:', capability.lottieFile);
                              });
                          }, [capability.lottieFile]);
                          
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: index * 0.1 }}
                              className={isFirstTwo ? "flex-1 md:max-w-[350px]" : "flex-1"}
                            >
                              <div 
                                className={`relative h-[380px] p-8 border flex flex-col ${
                                  isThirdCard ? 'rounded-tr-[100px]' : 'rounded-lg bg-white border-gray-300'
                                }`}
                                style={isThirdCard ? { backgroundColor: '#ebe8d9', borderColor: '#606a61' } : {}}
                              >
                                {/* Lottie Animation - Static (first frame only) */}
                                <div className="h-20 mb-6 flex justify-start items-start">
                                  {lottieData ? (
                                    <div className="w-16 h-16">
                                      <Lottie 
                                        animationData={lottieData}
                                        loop={false}
                                        autoplay={false}
                                        initialSegment={[0, 1]}
                                        style={{ width: '100%', height: '100%' }}
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-16 h-16 flex items-center justify-center">
                                      {(() => {
                                        const Icon = capability.icon;
                                        return (
                                          <Icon 
                                            className="w-12 h-12" 
                                            strokeWidth={1.5}
                                            style={{ color: isThirdCard ? '#323e32' : '#1e293b' }}
                                          />
                                        );
                                      })()}
                                    </div>
                                  )}
                                </div>
                      
                                {/* Text Content */}
                                <div className="text-left flex-1 flex flex-col">
                                  <h3 
                                    className="text-2xl font-bold mb-4 min-h-[72px] flex items-start"
                                    style={{ color: isThirdCard ? '#323e32' : '#1e293b' }}
                                  >
                                    {capability.title}
                                  </h3>
                                  <p 
                                    className="leading-relaxed text-base"
                                    style={{ color: isThirdCard ? '#606a61' : '#64748b' }}
                                  >
                                    {capability.description}
                                  </p>
                                </div>

                                {/* Circular Button at Bottom */}
                                <div className="flex justify-start mt-auto pt-4">
                                  <button 
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                      isThirdCard 
                                        ? 'bg-[#323e32] hover:bg-[#2a352a]' 
                                        : 'border border-gray-300 bg-white hover:bg-gray-50'
                                    }`}
                                  >
                                    <ArrowUpRight 
                                      className="w-4 h-4" 
                                      style={{ color: isThirdCard ? '#ffffff' : '#1e293b' }}
                                    />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </section>

                  {/* Industries Section - Trusted Across All Sectors - LIGHT */}
                  <section className="py-20 relative bg-white overflow-hidden hidden">
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
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-full transition-all duration-300 hover:shadow-lg cursor-pointer group">
                                  {/* Image Section */}
                                  <div className="relative w-full h-64 overflow-hidden">
                                    <img 
                                      src={`/${industry.image}`}
                                      alt={industry.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                  </div>

                                  {/* Content Section */}
                                  <div className="p-6">
                                    {/* Icon/Brand indicator */}
                                    <div className="flex items-center gap-2 mb-3">
                                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${industry.color} flex items-center justify-center`}>
                                        <Icon className="w-4 h-4 text-white" />
                                      </div>
                                      <span className="text-xs text-gray-500 font-medium">{industry.name}</span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                      {industry.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                                      {industry.description}
                                    </p>

                                    {/* Learn More Link */}
                                    <a 
                                      href="#" 
                                      onClick={(e) => {
                                        e.preventDefault();
                                        navigate("/assessments", { state: { industry: industry.name } });
                                      }}
                                      className="inline-flex items-center gap-2 text-sm font-medium text-[#15ae99] hover:text-[#0d8a7a] transition-colors group/link"
                                    >
                                      {industry.link}
                                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                                    </a>
                                  </div>
                                </div>
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
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-full transition-all duration-300 hover:shadow-lg cursor-pointer group">
                                  {/* Image Section */}
                                  <div className="relative w-full h-64 overflow-hidden">
                                    <img 
                                      src={`/${industry.image}`}
                                      alt={industry.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                  </div>

                                  {/* Content Section */}
                                  <div className="p-6">
                                    {/* Icon/Brand indicator */}
                                    <div className="flex items-center gap-2 mb-3">
                                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${industry.color} flex items-center justify-center`}>
                                        <Icon className="w-4 h-4 text-white" />
                                      </div>
                                      <span className="text-xs text-gray-500 font-medium">{industry.name}</span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                      {industry.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">
                                      {industry.description}
                                    </p>

                                    {/* Learn More Link */}
                                    <a 
                                      href="#" 
                                      onClick={(e) => {
                                        e.preventDefault();
                                        navigate("/assessments", { state: { industry: industry.name } });
                                      }}
                                      className="inline-flex items-center gap-2 text-sm font-medium text-[#15ae99] hover:text-[#0d8a7a] transition-colors group/link"
                                    >
                                      {industry.link}
                                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                                    </a>
                                  </div>
                                </div>
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
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full">
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

                  {/* Pricing Section - WHITE background with #185D54 green theme */}
                  <section id="pricing" className="py-20 relative overflow-hidden bg-white border-t border-gray-100 shadow-[0_0_1px_0_rgba(0,0,0,0.05)]">

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                      >
                        <Badge className="mb-4 bg-[#185D54]/10 text-[#185D54] border-[#185D54]/20">
                          Pricing
                        </Badge>
                        <h2 className="text-3xl lg:text-4xl mb-4 font-bold text-gray-900">
                          Flexible Pricing Plans<br />for Every Need
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                          Choose the plan that best fits your requirements and<br />to optimize your AI journey today
                        </p>

                        {/* Monthly/Annually Toggle - badge space reserved to prevent layout shift */}
                        <div className="flex items-center justify-center gap-4 mb-12">
                          <span className="text-gray-700 font-medium">Monthly</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={isAnnual}
                              onChange={(e) => setIsAnnual(e.target.checked)}
                            />
                            <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#185D54]"></div>
                          </label>
                          <span className="text-gray-700 font-medium">Annually</span>
                          <span className="inline-block min-w-[5.5rem] text-center">
                            {isAnnual ? (
                              <span className="text-[#185D54] text-sm bg-[#185D54]/10 px-2 py-1 rounded">Save 15%</span>
                            ) : (
                              <span className="invisible text-sm px-2 py-1 rounded">Save 15%</span>
                            )}
                          </span>
                        </div>
                      </motion.div>

                      <div className="grid md:grid-cols-3 gap-8 w-full">
                        {/* Starter Plan */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.1 }}
                          whileHover={{ y: -8 }}
                        >
                          <Card className="bg-white border-2 border-gray-200 hover:border-[#185D54] hover:shadow-xl h-full transition-all duration-300 relative overflow-hidden flex flex-col">
                            <CardHeader className="flex-shrink-0 min-h-[180px]">
                              <CardTitle className="text-2xl text-gray-900">Starter</CardTitle>
                              <div className="mt-4">
                                <span className="text-4xl font-bold" style={{ color: '#185D54' }}>Free</span>
                              </div>
                              <CardDescription className="text-gray-600 mt-4">
                                For individuals and small launches validating their first releases.
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col flex-1">
                              <ul className="space-y-3 flex-1">
                                <li className="flex items-start gap-2 text-gray-900">
                                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#185D54' }} />
                                  <div className="pricing-tooltip-container">
                                    <span className="pricing-tooltip-popup">Access to 50+ common AI use cases.</span>
                                    <span className="pricing-tooltip-text">Static Use-Case Bank</span>
                                  </div>
                                </li>
                                <li className="flex items-start gap-2 text-gray-900">
                                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#185D54' }} />
                                  <div className="pricing-tooltip-container">
                                    <span className="pricing-tooltip-popup">One-time assessment of your AI maturity.</span>
                                    <span className="pricing-tooltip-text">Single Assessment</span>
                                  </div>
                                </li>
                                <li className="flex items-start gap-2 text-gray-900">
                                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#185D54' }} />
                                  <div className="pricing-tooltip-container">
                                    <span className="pricing-tooltip-popup">Summary of key strengths and weaknesses.</span>
                                    <span className="pricing-tooltip-text">Basic Report</span>
                                  </div>
                                </li>
                                <li className="flex items-start gap-2 text-gray-900">
                                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#185D54' }} />
                                  <div className="pricing-tooltip-container">
                                    <span className="pricing-tooltip-popup">Standard email support for your questions.</span>
                                    <span className="pricing-tooltip-text">Email Support</span>
                                  </div>
                                </li>
                              </ul>
                              <Button 
                                className="w-full mt-6 text-white"
                                style={{ backgroundColor: '#185D54' }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#134a43'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#185D54'}
                                onClick={() => navigate("/signup")}
                              >
                                Get Started
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>

                        {/* Plus Plan */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2 }}
                          whileHover={{ y: -8 }}
                        >
                          <Card className="bg-white border-2 border-[#185D54] hover:shadow-xl h-full relative overflow-hidden transition-all duration-300 flex flex-col">
                            <div className="absolute top-0 right-0 bg-[#185D54] text-white px-4 py-1.5 text-sm font-bold shadow-lg z-10 rounded-bl-lg flex items-center gap-1">
                              <span>★</span>
                              <span>Recommended</span>
                            </div>
                            <CardHeader className="flex-shrink-0 min-h-[180px]">
                              <CardTitle className="text-2xl text-gray-900">Plus</CardTitle>
                              <div className="mt-4">
                                {isAnnual ? (
                                  <>
                                    <span className="text-4xl font-bold" style={{ color: '#185D54' }}>$2,030</span>
                                    <span className="text-gray-500">/ year</span>
                                    <div className="text-sm text-gray-400 mt-1 line-through">$2,388/year</div>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-4xl font-bold" style={{ color: '#185D54' }}>$199</span>
                                    <span className="text-gray-500">/month</span>
                                  </>
                                )}
                              </div>
                              <CardDescription className="text-gray-600 mt-4">
                                For growing teams that need actionable insights and continuous improvement.
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col flex-1">
                              <ul className="space-y-3 flex-1">
                                <li className="flex items-start gap-2 text-gray-900">
                                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#185D54' }} />
                                  <div className="pricing-tooltip-container">
                                    <span className="pricing-tooltip-popup">Access to 50+ common AI use cases.</span>
                                    <span className="pricing-tooltip-text">Static Use-Case Bank</span>
                                  </div>
                                </li>
                                <li className="flex items-start gap-2 text-gray-900">
                                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#185D54' }} />
                                  <div className="pricing-tooltip-container">
                                    <span className="pricing-tooltip-popup">Retake the assessments monthly to track progress.</span>
                                    <span className="pricing-tooltip-text">Continuous Assessments</span>
                                  </div>
                                </li>
                                <li className="flex items-start gap-2 text-gray-900">
                                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#185D54' }} />
                                  <div className="pricing-tooltip-container">
                                    <span className="pricing-tooltip-popup">Deep dive into AI, Data, Security and Governance readiness.</span>
                                    <span className="pricing-tooltip-text">Detailed Strategic Report</span>
                                  </div>
                                </li>
                                <li className="flex items-start gap-2 text-gray-900">
                                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#185D54' }} />
                                  <div className="pricing-tooltip-container">
                                    <span className="pricing-tooltip-popup">Standard email support for your questions.</span>
                                    <span className="pricing-tooltip-text">Email Support</span>
                                  </div>
                                </li>
                                <li className="flex items-start gap-2 text-gray-900">
                                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#185D54' }} />
                                  <div className="pricing-tooltip-container">
                                    <span className="pricing-tooltip-popup">Step-by-step execution plan based on your score.</span>
                                    <span className="pricing-tooltip-text">Custom Roadmap</span>
                                  </div>
                                </li>
                                <li className="flex items-start gap-2 text-gray-900">
                                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#185D54' }} />
                                  <div className="pricing-tooltip-container">
                                    <span className="pricing-tooltip-popup">Compare your score with similar sized peers within the same industry.</span>
                                    <span className="pricing-tooltip-text">Industry Benchmarking</span>
                                  </div>
                                </li>
                                <li className="flex items-start gap-2 text-gray-900">
                                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#185D54' }} />
                                  <div className="pricing-tooltip-container">
                                    <span className="pricing-tooltip-popup">Visualize your improvement over time.</span>
                                    <span className="pricing-tooltip-text">Trend Analysis</span>
                                  </div>
                                </li>
                                <li className="flex items-start gap-2 text-gray-900">
                                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#185D54' }} />
                                  <div className="pricing-tooltip-container">
                                    <span className="pricing-tooltip-popup">Presentation-ready reports.</span>
                                    <span className="pricing-tooltip-text">Export to PDF</span>
                                  </div>
                                </li>
                                <li className="flex items-start gap-2 text-gray-900">
                                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#185D54' }} />
                                  <div className="pricing-tooltip-container">
                                    <span className="pricing-tooltip-popup">72 hrs turn around on emails.</span>
                                    <span className="pricing-tooltip-text">Priority Support</span>
                                  </div>
                                </li>
                              </ul>
                              <Button 
                                className="w-full mt-6 text-white"
                                style={{ backgroundColor: '#185D54' }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#134a43'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = '#185D54'}
                                onClick={() => navigate("/signup")}
                              >
                                Get Started
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>

                        {/* Pro Plan */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 }}
                          whileHover={{ y: -8 }}
                        >
                          <Card className="bg-white border-2 border-gray-200 hover:border-[#185D54] hover:shadow-xl h-full transition-all duration-300 relative overflow-hidden flex flex-col">
                            <CardHeader className="flex-shrink-0 min-h-[180px]">
                              <CardTitle className="text-2xl text-gray-900">Pro</CardTitle>
                              <div className="mt-4">
                                {isAnnual ? (
                                  <>
                                    <span className="text-4xl font-bold" style={{ color: '#185D54' }}>$3,050</span>
                                    <span className="text-gray-500">/ year</span>
                                    <div className="text-sm text-gray-400 mt-1 line-through">$3,588/year</div>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-4xl font-bold" style={{ color: '#185D54' }}>$299</span>
                                    <span className="text-gray-500">/month</span>
                                  </>
                                )}
                              </div>
                              <CardDescription className="text-gray-600 mt-4">
                                For large organizations and agencies requiring customization and control.
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col flex-1">
                              <ul className="space-y-3 flex-1">
                                <li className="flex items-start gap-2 text-gray-900">
                                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#185D54' }} />
                                  <div className="pricing-tooltip-container">
                                    <span className="pricing-tooltip-popup">Access to 50+ common AI use cases.</span>
                                    <span className="pricing-tooltip-text">Static Use-Case Bank</span>
                                  </div>
                                </li>
                                <li className="flex items-start gap-2 text-gray-900">
                                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#185D54' }} />
                                  <div className="pricing-tooltip-container">
                                    <span className="pricing-tooltip-popup">Retake the assessments monthly to track progress.</span>
                                    <span className="pricing-tooltip-text">Continuous Assessments</span>
                                  </div>
                                </li>
                                <li className="flex items-start gap-2 text-gray-900">
                                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#185D54' }} />
                                  <div className="pricing-tooltip-container">
                                    <span className="pricing-tooltip-popup">Deep dive into AI, Data, Security and Governance readiness.</span>
                                    <span className="pricing-tooltip-text">Detailed Strategic Report</span>
                                  </div>
                                </li>
                                <li className="flex items-start gap-2 text-gray-900">
                                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#185D54' }} />
                                  <div className="pricing-tooltip-container">
                                    <span className="pricing-tooltip-popup">Standard email support for your questions.</span>
                                    <span className="pricing-tooltip-text">Email Support</span>
                                  </div>
                                </li>
                                <li className="flex items-start gap-2 text-gray-900">
                                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#185D54' }} />
                                  <div className="pricing-tooltip-container">
                                    <span className="pricing-tooltip-popup">Step-by-step execution plan based on your score.</span>
                                    <span className="pricing-tooltip-text">Custom Roadmap</span>
                                  </div>
                                </li>
                                <li className="flex items-start gap-2 text-gray-900">
                                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#185D54' }} />
                                  <div className="pricing-tooltip-container">
                                    <span className="pricing-tooltip-popup">Compare your score with similar sized peers within the same industry.</span>
                                    <span className="pricing-tooltip-text">Industry Benchmarking</span>
                                  </div>
                                </li>
                                <li className="flex items-start gap-2 text-gray-900">
                                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#185D54' }} />
                                  <div className="pricing-tooltip-container">
                                    <span className="pricing-tooltip-popup">Visualize your improvement over time.</span>
                                    <span className="pricing-tooltip-text">Trend Analysis</span>
                                  </div>
                                </li>
                                <li className="flex items-start gap-2 text-gray-900">
                                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#185D54' }} />
                                  <div className="pricing-tooltip-container">
                                    <span className="pricing-tooltip-popup">Presentation-ready reports.</span>
                                    <span className="pricing-tooltip-text">Export to PDF</span>
                                  </div>
                                </li>
                                <li className="flex items-start gap-2 text-gray-900">
                                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#185D54' }} />
                                  <div className="pricing-tooltip-container">
                                    <span className="pricing-tooltip-popup">Use your branding and colors.</span>
                                    <span className="pricing-tooltip-text">White-Label Reports</span>
                                  </div>
                                </li>
                                <li className="flex items-start gap-2 text-gray-900">
                                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#185D54' }} />
                                  <div className="pricing-tooltip-container">
                                    <span className="pricing-tooltip-popup">Build your own internal AI Use case library.</span>
                                    <span className="pricing-tooltip-text">Custom Use-Case Creation</span>
                                  </div>
                                </li>
                                <li className="flex items-start gap-2 text-gray-900">
                                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#185D54' }} />
                                  <div className="pricing-tooltip-container">
                                    <span className="pricing-tooltip-popup">Enterprise-grade security.</span>
                                    <span className="pricing-tooltip-text">Single Sign-On (SSO)</span>
                                  </div>
                                </li>
                                <li className="flex items-start gap-2 text-gray-900">
                                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#185D54' }} />
                                  <div className="pricing-tooltip-container">
                                    <span className="pricing-tooltip-popup">24 hrs turn around on emails.</span>
                                    <span className="pricing-tooltip-text">Priority Support</span>
                                  </div>
                                </li>
                              </ul>
                              <Button 
                                variant="outline"
                                className="w-full mt-6 border-[#185D54] text-[#185D54] hover:bg-[#185D54] hover:text-white"
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
                        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-slate-900 mb-8 leading-tight" style={{ fontFamily: 'Segoe UI, sans-serif' }}>
                          Trusted by Industry Leaders
                        </h2>
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

                  {/* Footer - Teal/Cyan Gradient */}
                  <footer className="border-t border-[#15ae99]/30 py-12 relative" style={{ background: 'linear-gradient(to bottom, #003941, #033C47)' }}>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="grid md:grid-cols-3 gap-8 mb-8">
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
                    className="h-[35px] w-auto"
                  />
                  <img 
                    src="/logo/maturely_logo.png" 
                    alt="MATURITY.AI" 
                    className="h-[20px] w-auto brightness-0 invert"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                </div>
                            <p className="text-sm text-white/80">
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
                          <h4 className="mb-4 text-sm font-semibold text-white">Platform</h4>
                          <ul className="space-y-2 text-sm text-white/70">
                            <li>
                              <button 
                                onClick={() => navigate("/assessments")} 
                                className="group relative hover:text-[#46cdc6] transition-colors inline-block"
                              >
                                Assessments
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#46cdc6] transition-all duration-300 ease-out group-hover:w-full"></span>
                              </button>
                            </li>
                            <li>
                              <button 
                                onClick={() => navigate("/roadmap")} 
                                className="group relative hover:text-[#46cdc6] transition-colors inline-block"
                              >
                                Roadmaps
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#46cdc6] transition-all duration-300 ease-out group-hover:w-full"></span>
                              </button>
                            </li>
                            <li>
                              <button 
                                onClick={() => navigate("/usecases")} 
                                className="group relative hover:text-[#46cdc6] transition-colors inline-block"
                              >
                                Use Cases
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#46cdc6] transition-all duration-300 ease-out group-hover:w-full"></span>
                              </button>
                            </li>
                          </ul>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.15 }}
                        >
                          <h4 className="mb-4 text-sm font-semibold text-white">Company</h4>
                          <ul className="space-y-2 text-sm text-white/70">
                            <li>
                              <a 
                                href="#" 
                                className="group relative hover:text-[#46cdc6] transition-colors inline-block"
                              >
                                About
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#46cdc6] transition-all duration-300 ease-out group-hover:w-full"></span>
                              </a>
                            </li>
                            <li>
                              <a 
                                href="#" 
                                className="group relative hover:text-[#46cdc6] transition-colors inline-block"
                              >
                                Contact
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#46cdc6] transition-all duration-300 ease-out group-hover:w-full"></span>
                              </a>
                            </li>
                            <li>
                              <a 
                                href="#" 
                                className="group relative hover:text-[#46cdc6] transition-colors inline-block"
                              >
                                Privacy
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#46cdc6] transition-all duration-300 ease-out group-hover:w-full"></span>
                              </a>
                            </li>
                          </ul>
                        </motion.div>
                      </div>
                      <div className="pt-8 border-t border-[#46cdc6]/30 text-center text-sm text-white/70">
                        <p>© {new Date().getFullYear()} AI Maturity Platform. All rights reserved.</p>
                      </div>
                    </div>
                  </footer>
                </div>
              );
            }
