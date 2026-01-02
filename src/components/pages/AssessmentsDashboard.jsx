import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { CheckCircle2, Target, ArrowRight, ArrowLeft } from 'lucide-react';
import Lottie from 'lottie-react';
import { PageHeader } from '../shared/PageHeader';

// Lottie animations will be loaded dynamically

// Import assessment data
import { assessmentPillars } from '../../data/assessmentQuestions.json';

export function AssessmentsDashboard() {
  const navigate = useNavigate();
  const [currentPillarIndex, setCurrentPillarIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [completedPillars, setCompletedPillars] = useState(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [lottieAnimations, setLottieAnimations] = useState({
    layers: null
  });
  const [hoveredStepIcon, setHoveredStepIcon] = useState(null);
  const [hoveredMainIcon, setHoveredMainIcon] = useState(false);

  const currentPillar = assessmentPillars[currentPillarIndex];

  // Load Lottie animations dynamically
  useEffect(() => {
    const loadAnimations = async () => {
      try {
        const layersRes = await fetch('/lottieFiles/wired-lineal-12-layers-hover-squeeze.json');
        const layersData = await layersRes.json();

        setLottieAnimations({
          layers: layersData
        });
      } catch (error) {
        console.error('Error loading Lottie animations:', error);
      }
    };

    loadAnimations();
  }, []);

  // Reset question index when pillar changes
  useEffect(() => {
    setCurrentQuestionIndex(0);
  }, [currentPillarIndex]);

  // Auto-advance to next pillar when all questions in current pillar are answered
  useEffect(() => {
    const allQuestionsAnswered = currentPillar.questions.every((_, qIndex) => {
      const questionKey = `${currentPillar.id}-${qIndex}`;
      return answers[questionKey];
    });
      
    if (allQuestionsAnswered && currentPillar.questions.length > 0) {
      // Wait a bit before auto-advancing to next pillar
      const timer = setTimeout(() => {
        if (currentPillarIndex < assessmentPillars.length - 1) {
          setCompletedPillars(prev => new Set([...prev, currentPillarIndex]));
          setCurrentPillarIndex(prev => prev + 1);
        } else {
          // Last pillar completed, navigate to results
          navigate('/results');
        }
      }, 800); // Slightly longer delay for pillar transition

      return () => clearTimeout(timer);
    }
  }, [answers, currentPillar, currentPillarIndex, assessmentPillars.length, navigate]);

  const handleAnswerSelect = (questionKey, level) => {
    console.log('Answer selected:', questionKey, level); // Debug log
    setAnswers(prev => ({
      ...prev,
      [questionKey]: level
    }));
    
    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < currentPillar.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 300);
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

      {/* Header */}
      <PageHeader 
        centerItems={[
          { label: "Home", path: "/offerings" }
        ]}
        zIndex="z-50"
      />

      {/* SECTION 1: Assessment Interface */}
      <section className="bg-gray-50 py-16 pt-40">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Left Sidebar - Compact Pillars */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Assessment Pillars</h3>
                  <p className="text-sm text-gray-600">Track your progress</p>
            </div>

                {/* Custom Ant Design Style Pillars */}
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
                          {/* Pillar Icon */}
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
                          
                          {/* Pillar Content */}
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
              {/* Pillar Information - No Image */}
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
                      PILLAR {currentPillarIndex + 1}
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
                        Rate each statement using the maturity levels below based on your organization's current state.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question Carousel - One Question at a Time */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 overflow-visible">
                {/* Progress Indicators */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {currentPillar.title} Questions
                  </h3>
                    <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-500">
                        Question {currentQuestionIndex + 1} of {currentPillar.questions.length}
                      </div>
                      
                      {/* Premium Progress Bars - Right Side */}
                      <div className="flex items-center gap-1">
                        {currentPillar.questions.map((_, qIndex) => {
                          const questionKey = `${currentPillar.id}-${qIndex}`;
                          const isAnswered = answers[questionKey];
                          const isCurrent = qIndex === currentQuestionIndex;
                          
                          return (
                            <button
                              key={qIndex}
                              onClick={() => setCurrentQuestionIndex(qIndex)}
                              className={`transition-all duration-200 rounded-full ${
                                isCurrent 
                                  ? 'w-8 h-1.5 bg-[#46cdc6] ring-1 ring-[#46cdc6]' 
                                  : isAnswered 
                                    ? 'w-6 h-1.5 bg-[#46cdc6] opacity-50' 
                                    : 'w-6 h-1.5 bg-gray-300'
                              } hover:opacity-100`}
                              title={`Question ${qIndex + 1}${isAnswered ? ' (Answered)' : ''}`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Question Carousel Container */}
                <div className="relative overflow-visible min-h-[400px]">
                  <AnimatePresence mode="wait">
                  {currentPillar.questions.map((question, questionIndex) => {
                      if (questionIndex !== currentQuestionIndex) return null;
                      
                    const questionKey = `${currentPillar.id}-${questionIndex}`;
                    const selectedAnswer = answers[questionKey];
                    
                    return (
                        <motion.div
                        key={questionIndex}
                          initial={{ opacity: 0, x: 100 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="w-full"
                      >
                          {/* Question Header */}
                          <div className="flex items-start gap-3 mb-6">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                            selectedAnswer 
                              ? 'bg-[#46cdc6] text-white' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {questionIndex + 1}
                          </div>
                          <div className="flex-1">
                              <h4 className="text-base font-medium text-gray-900 mb-2">
                              {question}
                            </h4>
                          </div>
                          {selectedAnswer && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                                className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                            >
                                <CheckCircle2 className="w-4 h-4 text-white" />
          </motion.div>
                          )}
                        </div>
                        
                          {/* Options */}
                          <div className="space-y-3 overflow-visible">
                            {['Initial', 'Adopting', 'Established', 'Advanced', 'Transformational'].map((option, index) => {
                            const isSelected = selectedAnswer === option;
                              
                              // Get question-specific option text from JSON if available
                              const questionOptions = currentPillar.questionOptions;
                              const questionKeyStr = String(questionIndex);
                              const optionDescription = questionOptions && questionOptions[questionKeyStr] && questionOptions[questionKeyStr][option]
                                ? questionOptions[questionKeyStr][option]
                                : option;
                            
                            return (
                              <motion.button 
                                key={option}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  console.log('Button clicked:', questionKey, option);
                                  handleAnswerSelect(questionKey, option);
                                }}
                                  className={`flex items-start gap-3 p-4 rounded-lg text-sm font-normal border-2 cursor-pointer relative w-full text-left transition-all ${
                                  isSelected 
                                    ? 'bg-[#46cdc6]/10 text-[#15ae99] border-[#46cdc6] shadow-md' 
                                      : 'bg-white text-gray-700 hover:bg-gray-50 hover:border-[#46cdc6]/50 border-gray-200 shadow-sm'
                                }`}
                                type="button"
                                whileHover={{ 
                                    scale: 1.01
                                }}
                                whileTap={{ 
                                    scale: 0.99 
                                  }}
                                  transition={{ 
                                    duration: 0.15,
                                    ease: "easeOut"
                                  }}
                                >
                                  {/* Radio button indicator */}
                                  <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                                    isSelected 
                                      ? 'border-[#46cdc6] bg-[#46cdc6]' 
                                      : 'border-gray-300 bg-white'
                                  }`}>
                                    {isSelected && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-2.5 h-2.5 rounded-full bg-white"
                                      />
                                    )}
                                  </div>
                                  
                                  {/* Content */}
                                  <div className="flex-1 min-w-0">
                                    <div className={`text-sm leading-relaxed ${
                                      isSelected ? 'text-gray-800' : 'text-gray-700'
                                    }`}>
                                      <span className="font-bold">{option}</span>
                                      {optionDescription && optionDescription !== option && (
                                        <span> - {optionDescription}</span>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Selected indicator overlay */}
                                {isSelected && (
                                  <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ 
                                      duration: 0.2,
                                      ease: "easeOut"
                                    }}
                                      className="absolute inset-0 bg-[#46cdc6]/5 rounded-lg pointer-events-none"
                                  />
                                )}
                              </motion.button>
                            );
                          })}
                        </div>
                          
                          {/* Navigation Buttons */}
                          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                            <button
                              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                              disabled={currentQuestionIndex === 0}
                              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                currentQuestionIndex === 0
                                  ? 'text-gray-400 cursor-not-allowed'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              ← Previous
                            </button>
                            
                            <button
                              onClick={() => setCurrentQuestionIndex(prev => Math.min(currentPillar.questions.length - 1, prev + 1))}
                              disabled={currentQuestionIndex === currentPillar.questions.length - 1}
                              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                currentQuestionIndex === currentPillar.questions.length - 1
                                  ? 'text-gray-400 cursor-not-allowed'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              Next →
                            </button>
                      </div>
                        </motion.div>
                    );
                  })}
                  </AnimatePresence>
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
                    Previous Pillar
                  </motion.button>
                )}
                
                <motion.button
                  onClick={handleNextStep}
                  className="bg-gradient-to-r from-[#46cdc6] to-[#15ae99] hover:from-[#15ae99] hover:to-[#46cdc6] text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {currentPillarIndex === assessmentPillars.length - 1 ? 'View Results' : 'Next Pillar'}
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
