import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FileText, Globe, Users, BarChart3, ClipboardList, Lightbulb, ArrowUpRight, AlertCircle } from 'lucide-react';
import Lottie from 'lottie-react';
import { PageHeader } from '../shared/PageHeader';
import { startAssessment } from '../../services/assessmentService';
import { useAssessmentStore } from '../../stores/assessmentStore';
import { useAuthStore } from '../../stores/authStore';

// Premium cards data for section 2
const premiumCards = [
  {
    icon: ClipboardList,
    title: 'AI readiness assessments',
    description: 'Take our comprehensive AI readiness assessment to understand your organization\'s capabilities across 7 critical pillars.',
    bgColor: '#ffffff',
    borderColor: '#e2e8f0',
    accentColor: '#46cdc6',
  },
  {
    icon: Lightbulb,
    title: 'Business Use Cases',
    description: 'Explore industry-specific AI implementations and proven solutions for immediate value in your organization.',
    bgColor: '#ffffff',
    borderColor: '#e2e8f0',
    accentColor: '#a855f7',
  }
];

export function OfferingsPage() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.currentUser);
  const updateOngoingAssessmentId = useAuthStore((state) => state.updateOngoingAssessmentId);
  const { setAssessmentData, setLoading, setError } = useAssessmentStore();
  const [isStartingAssessment, setIsStartingAssessment] = useState(false);
  const [assessmentError, setAssessmentError] = useState(null);
  const [lottieAnimations, setLottieAnimations] = useState({
    document: null,
    globe: null,
    wings: null,
    chart: null,
  });

  // Load Lottie animations dynamically
  useEffect(() => {
    const loadAnimations = async () => {
      try {
        const [documentRes, globeRes, wingsRes, chartRes] = await Promise.all([
          fetch('/lottieFiles/wired-outline-56-document-hover-swipe.json'),
          fetch('/lottieFiles/wired-outline-27-globe-hover-rotate.json'),
          fetch('/lottieFiles/wired-outline-1145-wings-hover-pinch.json'),
          fetch('/lottieFiles/wired-outline-153-bar-chart-hover-pinch.json')
        ]);

        const [documentData, globeData, wingsData, chartData] = await Promise.all([
          documentRes.json(),
          globeRes.json(),
          wingsRes.json(),
          chartRes.json()
        ]);

        setLottieAnimations({
          document: documentData,
          globe: globeData,
          wings: wingsData,
          chart: chartData
        });
      } catch (error) {
        console.error('Error loading Lottie animations:', error);
      }
    };

    loadAnimations();
  }, []);

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

      {/* Header */}
      <PageHeader zIndex="z-50" />

      {/* SECTION 1: Hero Section */}
      <section className="pt-36 pb-20 relative z-10">
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
          <div className="relative flex justify-center items-start">

            {/* Left Column - Content */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.6 }}
              className="space-y-3 lg:space-y-4 relative z-20 text-center w-full max-w-4xl mx-auto"
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
                  Discover Your AI Readiness
                </h1>
              </div>

              {/* Description */}
              <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto font-medium">
                Take our comprehensive assessment to understand your organization's AI readiness across 7 critical dimensions. Get personalized insights and actionable recommendations.
              </p>
            </motion.div>

            {/* Right Column - Stats Grid - Hidden for now */}
            {false && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative flex justify-center lg:justify-end mt-8 mr-10 lg:mt-0"
            >
              <div className="grid grid-cols-2 gap-0 w-full max-w-[480px] h-[416px] sm:w-[480px] sm:h-[480px] overflow-hidden shadow-lg">
                {/* Top Left */}
                <div className="bg-[#d8dfdf] p-4 sm:p-6 flex flex-col justify-center items-center">
                  <div className="w-12 h-12 sm:w-18 sm:h-18 mb-2 sm:mb-3 flex items-center justify-center">
                    {lottieAnimations.document ? (
                      <div className="w-12 h-12 sm:w-16 sm:h-16">
                        <Lottie 
                          animationData={lottieAnimations.document}
                          loop={false}
                          autoplay={false}
                          initialSegment={[0, 1]}
                          style={{ width: '100%', height: '100%' }}
                        />
                      </div>
                    ) : (
                      <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-700" strokeWidth={1.5} />
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
                    <div className="w-20 h-20 ml-15 mx-auto transform -rotate-20 flex items-center justify-center">
                      {lottieAnimations.globe ? (
                        <div className="w-16 h-16">
                          <Lottie 
                            animationData={lottieAnimations.globe}
                            loop={false}
                            autoplay={false}
                            initialSegment={[0, 1]}
                            style={{ width: '100%', height: '100%' }}
                          />
                        </div>
                      ) : (
                        <Globe className="w-16 h-16 text-gray-700" strokeWidth={1.5} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Left - Light Teal with curve */}
                <div className="relative bg-[#46cdc6]/10 p-6 flex flex-col justify-center items-center overflow-hidden">
                  {/* Big background curve */}
                  <div className="absolute -bottom-30 -left-30 w-80 h-80 bg-[#e1eae8] rounded-full"></div>

                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 mb-3 mx-auto flex items-center justify-center">
                      {lottieAnimations.wings ? (
                        <div className="w-12 h-12">
                          <Lottie 
                            animationData={lottieAnimations.wings}
                            loop={false}
                            autoplay={false}
                            initialSegment={[0, 1]}
                            style={{ width: '100%', height: '100%' }}
                          />
                        </div>
                      ) : (
                        <Users className="w-12 h-12 text-[#15ae99]" strokeWidth={1.5} />
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
                    <div className="w-12 h-12 sm:w-18 sm:h-18 mx-auto flex items-center justify-center">
                      {lottieAnimations.chart ? (
                        <div className="w-12 h-12 sm:w-16 sm:h-16">
                          <Lottie 
                            animationData={lottieAnimations.chart}
                            loop={false}
                            autoplay={false}
                            initialSegment={[0, 1]}
                            style={{ width: '100%', height: '100%' }}
                          />
                        </div>
                      ) : (
                        <BarChart3 className="w-12 h-12 sm:w-16 sm:h-16 text-white" strokeWidth={1.5} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2: Premium Cards - Assessment and Use Cases */}
      <section className="py-20 relative bg-white">
        <div className="container mx-auto px-6 sm:px-8 lg:px-20 relative z-10">
          {/* Cards Grid */}
          <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto">
            {premiumCards.map((card, index) => {
              const Icon = card.icon;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-1"
                >
                  <div 
                    className="relative h-[400px] p-8 rounded-lg border-2 flex flex-col transition-all duration-300 hover:shadow-xl hover:border-opacity-80 group cursor-pointer"
                    style={{ 
                      backgroundColor: card.bgColor,
                      borderColor: card.borderColor,
                    }}
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (index === 0) {
                        // Start or continue assessment API call
                        const ongoingAssessmentId = currentUser?.ongoing_assessment_id;
                        const isContinuing = !!ongoingAssessmentId;
                        
                        setIsStartingAssessment(true);
                        setAssessmentError(null);
                        setLoading(true);
                        
                        try {
                          // Pass assessment_id if continuing existing assessment
                          const result = await startAssessment(
                            currentUser?.maturity_model_id,
                            ongoingAssessmentId
                          );
                          
                          if (result.success) {
                            // Store assessment data in Zustand store (pillar questions fetched on-demand when navigating)
                            setAssessmentData(result.data);
                            
                            // If starting a new assessment (not continuing), update ongoing_assessment_id
                            if (!isContinuing && result.data?.assessment_id) {
                              updateOngoingAssessmentId(result.data.assessment_id);
                            }
                            
                            navigate("/assessments");
                          } else {
                            setAssessmentError(result.error || `Failed to ${isContinuing ? 'continue' : 'start'} assessment. Please try again.`);
                            setError(result.error);
                          }
                        } catch (error) {
                          console.error(`Error ${isContinuing ? 'continuing' : 'starting'} assessment:`, error);
                          const errorMsg = 'An unexpected error occurred. Please try again.';
                          setAssessmentError(errorMsg);
                          setError(errorMsg);
                        } finally {
                          setIsStartingAssessment(false);
                          setLoading(false);
                        }
                      }
                      if (index === 1) navigate("/usecases");
                    }}
                  >
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"
                      style={{ background: `linear-gradient(135deg, ${card.accentColor} 0%, transparent 100%)` }}
                    />
                    
                    {/* Icon with premium styling */}
                    <div className="h-20 mb-6 flex justify-start items-start relative z-10">
                      <div className="relative">
                        <div 
                          className="absolute inset-0 rounded-xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                          style={{ backgroundColor: card.accentColor }}
                        />
                        <div 
                          className="relative w-16 h-16 rounded-xl flex items-center justify-center border-2 transition-all duration-300 group-hover:scale-110"
                          style={{ 
                            backgroundColor: 'white',
                            borderColor: card.borderColor,
                          }}
                        >
                          <Icon 
                            className="w-8 h-8 transition-colors duration-300" 
                            strokeWidth={1.5}
                            style={{ color: '#1e293b' }}
                          />
                        </div>
                      </div>
                    </div>
              
                    {/* Text Content */}
                    <div className="text-left flex-1 flex flex-col relative z-10">
                      <h3 
                        className="text-2xl mb-4 min-h-[72px] flex items-start transition-colors duration-300"
                        style={{ color: '#1e293b' }}
                      >
                        {index === 0 && currentUser?.ongoing_assessment_id 
                          ? 'Continue Assessment' 
                          : card.title}
                      </h3>
                      <p 
                        className="leading-relaxed text-base"
                        style={{ color: '#64748b' }}
                      >
                        {card.description}
                      </p>
                    </div>

                    {/* Premium Circular Button at Bottom */}
                    <div className="flex justify-start mt-auto pt-6 relative z-10">
                      {index === 0 && isStartingAssessment ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-[#46cdc6]/30 border-t-[#46cdc6] rounded-full animate-spin" />
                          <span className="text-sm text-gray-600">
                            {currentUser?.ongoing_assessment_id ? 'Continuing...' : 'Starting...'}
                          </span>
                        </div>
                      ) : (
                        <button 
                          className="relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 bg-white group-hover:scale-110"
                          style={{ borderColor: card.borderColor }}
                        >
                          <div 
                            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            style={{ backgroundColor: card.accentColor }}
                          />
                          <ArrowUpRight 
                            className="w-5 h-5 relative z-10 transition-colors duration-300" 
                            style={{ color: '#1e293b' }}
                          />
                        </button>
                      )}
                    </div>
                    
                    {/* Error message */}
                    {index === 0 && assessmentError && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>{assessmentError}</span>
                        </div>
                      </div>
                    )}

                    {/* Decorative corner accent */}
                    <div 
                      className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                      style={{ backgroundColor: card.accentColor }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}


