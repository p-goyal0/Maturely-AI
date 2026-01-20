import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { CheckCircle2, Target, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import Lottie from 'lottie-react';
import { PageHeader } from '../shared/PageHeader';
import { useAssessmentStore } from '../../stores/assessmentStore';
import { getPillarQuestions, submitAnswer, getAssessmentResults } from '../../services/assessmentService';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ErrorDisplay } from '../shared/ErrorDisplay';

// Lottie animations will be loaded dynamically
// Questions and answers come only from API (GET /assessment/questions/:pillar_id); no fallback JSON.

const MATURITY_LEVELS = ['Initial', 'Adopting', 'Established', 'Advanced', 'Transformational'];

export function AssessmentsDashboard() {
  const navigate = useNavigate();
  const { assessmentId, pillarData, pillarQuestionsMap, isLoading, error, setPillarQuestions, setAssessmentResults } = useAssessmentStore();
  const [currentPillarIndex, setCurrentPillarIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [completedPillars, setCompletedPillars] = useState(new Set());
  const [skippedQuestions, setSkippedQuestions] = useState(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [resultsError, setResultsError] = useState(null);
  const [lottieAnimations, setLottieAnimations] = useState({
    layers: null
  });
  const [hoveredStepIcon, setHoveredStepIcon] = useState(null);
  const [hoveredMainIcon, setHoveredMainIcon] = useState(false);
  const [isFetchingPillarQuestions, setIsFetchingPillarQuestions] = useState(false);

  // Fetch questions for a pillar via GET /assessment/questions/:pillar_id?assessment_id=... and store in pillarQuestionsMap
  const fetchAndSetPillarQuestions = useCallback(
    async (pillarId) => {
      if (!pillarId || !assessmentId) return;
      setIsFetchingPillarQuestions(true);
      try {
        const res = await getPillarQuestions(pillarId, assessmentId);
        if (res?.success && res?.data) setPillarQuestions(pillarId, res.data);
      } finally {
        setIsFetchingPillarQuestions(false);
      }
    },
    [setPillarQuestions, assessmentId]
  );

  // Build assessmentPillars only from API: pillar_data (start assessment) + pillarQuestionsMap (GET /assessment/questions/:pillar_id)
  const assessmentPillars =
    pillarData && pillarData.length > 0
      ? [...pillarData]
          .sort((a, b) => (a.pillar_order || 0) - (b.pillar_order || 0))
          .map((p) => {
            const qData = pillarQuestionsMap?.[p.pillar_id];
            // API response: qData is an object with { pillar_id, pillar_name, pillar_description, total_count, question_data: [...] }
            if (qData?.question_data?.length) {
              const qList = [...qData.question_data].sort(
                (a, b) => (a.question_order || 0) - (b.question_order || 0)
              );
              const questionOptions = qList.reduce((acc, q, qi) => {
                acc[qi] = {};
                (q.answer_options || [])
                  .sort((a, b) => (a.option_order || 0) - (b.option_order || 0))
                  .forEach((opt, j) => {
                    // Map option_order 1-5 to maturity levels: 1=Initial, 2=Adopting, 3=Established, 4=Advanced, 5=Transformational
                    const level =
                      MATURITY_LEVELS[opt.option_order - 1] ||
                      MATURITY_LEVELS[j] ||
                      (opt.option_text && opt.option_text.split(' - ')[0]?.trim()) ||
                      'Initial';
                    // Extract description from option_text (may have "Level - " prefix or just description)
                    const desc =
                      opt.option_text && opt.option_text.indexOf(' - ') >= 0
                        ? opt.option_text.slice(opt.option_text.indexOf(' - ') + 3).trim()
                        : opt.option_text || '';
                    acc[qi][level] = desc;
                  });
                return acc;
              }, {});
              return {
                id: p.pillar_id,
                title: qData.pillar_name || p.pillar_name,
                description: qData.pillar_description || p.pillar_description,
                order: qData.pillar_order ?? p.pillar_order,
                questions: qList.map((q) => q.question_text || ''),
                questionOptions,
                totalCount: qData.total_count ?? qList.length,
                questionIsSubmitted: qList.map(
                  (q) =>
                    q.is_submitted === true ||
                    (q.answer_options || []).some((o) => o.is_selected === true)
                ),
              };
            }
            // No API question data yet (loading) or API returned empty; never use fallback JSON
            return {
              id: p.pillar_id,
              title: p.pillar_name,
              description: p.pillar_description,
              order: p.pillar_order,
              questions: [],
              questionOptions: {},
            };
          })
      : [];

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

  // Pre-fill answers from API when question_data has is_selected on an answer_option
  useEffect(() => {
    if (!pillarQuestionsMap || Object.keys(pillarQuestionsMap).length === 0) return;
    setAnswers((prev) => {
      const next = { ...prev };
      Object.entries(pillarQuestionsMap).forEach(([pillarId, data]) => {
        (data.question_data || []).forEach((q, qi) => {
          const sel = (q.answer_options || []).find((o) => o.is_selected);
          if (sel) {
            const level =
              MATURITY_LEVELS[sel.option_order - 1] || MATURITY_LEVELS[0];
            const key = `${pillarId}-${qi}`;
            if (!(key in next)) next[key] = level;
          }
        });
      });
      return next;
    });
  }, [pillarQuestionsMap]);

  // Fetch questions for the current pillar when we land on it (on mount, or when pillar changes via other means like timeline)
  // Note: handleNextStep and handlePreviousStep fetch questions directly, so this is mainly for initial load and timeline clicks
  useEffect(() => {
    if (!pillarData?.length || currentPillarIndex < 0 || currentPillarIndex >= pillarData.length) return;
    const sorted = [...pillarData].sort((a, b) => (a.pillar_order || 0) - (b.pillar_order || 0));
    const pillarId = sorted[currentPillarIndex]?.pillar_id;
    if (pillarId && !pillarQuestionsMap?.[pillarId]) {
      fetchAndSetPillarQuestions(pillarId);
    }
  }, [pillarData, currentPillarIndex, pillarQuestionsMap, fetchAndSetPillarQuestions]);

  // Reset question index when pillar changes
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSkippedQuestions(new Set());
  }, [currentPillarIndex]);

  // Auto-advance to next pillar when all questions in current pillar are answered
  // Note: For the last pillar (7th), we don't auto-advance - user must click "View Results" button
  useEffect(() => {
    if (!currentPillar || !currentPillar.questions?.length || assessmentPillars.length === 0) return;

    const allQuestionsAnswered = currentPillar.questions.every((_, qIndex) => {
      const questionKey = `${currentPillar.id}-${qIndex}`;
      return answers[questionKey];
    });
      
    // Only auto-advance if NOT the last pillar
    if (allQuestionsAnswered && currentPillar.questions.length > 0 && currentPillarIndex < assessmentPillars.length - 1) {
      // Wait a bit before auto-advancing to next pillar
      const timer = setTimeout(() => {
        setCompletedPillars(prev => new Set([...prev, currentPillarIndex]));
        setCurrentPillarIndex(prev => prev + 1);
      }, 800); // Slightly longer delay for pillar transition

      return () => clearTimeout(timer);
    }
    // For the last pillar, do nothing - wait for user to click "View Results" button
  }, [answers, currentPillar, currentPillarIndex, assessmentPillars.length]);

  const handleAnswerSelect = async (questionKey, level) => {
    console.log('Answer selected:', questionKey, level); // Debug log
    
    // Update local state immediately for responsive UI
    setAnswers(prev => ({
      ...prev,
      [questionKey]: level
    }));
    
    // Submit answer to API
    try {
      // Extract pillarId and questionIndex from questionKey (format: "pillarId-questionIndex")
      // pillarId is a UUID which may contain hyphens, so split on last hyphen
      const lastHyphenIndex = questionKey.lastIndexOf('-');
      const pillarId = questionKey.substring(0, lastHyphenIndex);
      const questionIndexStr = questionKey.substring(lastHyphenIndex + 1);
      const questionIndex = parseInt(questionIndexStr, 10);
      
      // Get question data from pillarQuestionsMap
      const qData = pillarQuestionsMap?.[pillarId];
      if (!qData?.question_data || !qData.question_data[questionIndex]) {
        console.error('Question data not found for:', questionKey);
        return;
      }
      
      const question = qData.question_data[questionIndex];
      const questionId = question.question_id;
      
      // Find the option with matching order (level maps to option_order 1-5)
      const levelIndex = MATURITY_LEVELS.indexOf(level);
      const optionOrder = levelIndex + 1; // 1-5
      const selectedOption = (question.answer_options || []).find(
        (opt) => opt.option_order === optionOrder
      );
      
      if (!selectedOption) {
        console.error('Option not found for level:', level, 'order:', optionOrder);
        return;
      }
      
      const selectedOptionId = selectedOption.option_id;
      
      // Call submit-answer API
      if (assessmentId && questionId && selectedOptionId) {
        const result = await submitAnswer(assessmentId, questionId, selectedOptionId);
        if (!result.success) {
          console.error('Failed to submit answer:', result.error);
          // Optionally show error toast/notification to user
        }
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      // Optionally show error toast/notification to user
    }
    
    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < currentPillar.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    }, 300);
  };

  const handleNextStep = async () => {
    if (currentPillarIndex < assessmentPillars.length - 1) {
      const nextPillarIndex = currentPillarIndex + 1;
      const nextPillar = assessmentPillars[nextPillarIndex];
      
      // Always fetch questions for the next pillar to update data
      if (nextPillar?.id) {
        await fetchAndSetPillarQuestions(nextPillar.id);
      }
      
      setCompletedPillars(prev => new Set([...prev, currentPillarIndex]));
      setCurrentPillarIndex(nextPillarIndex);
    } else {
      // Last pillar - fetch results BEFORE navigating
      if (assessmentId) {
        setIsLoadingResults(true);
        setResultsError(null);
        
        try {
          const result = await getAssessmentResults(assessmentId);
          if (result.success && result.data) {
            // Store results first
            setAssessmentResults(result.data);
            // Only navigate after successful API response
            navigate('/results');
          } else {
            setResultsError(result.error || 'Failed to fetch assessment results');
            console.error('Failed to fetch assessment results:', result.error);
          }
        } catch (error) {
          setResultsError(error.message || 'An error occurred while fetching results');
          console.error('Error fetching assessment results:', error);
        } finally {
          setIsLoadingResults(false);
        }
      } else {
        // No assessment ID - show error
        setResultsError('No assessment ID available');
      }
    }
  };

  const handlePreviousStep = async () => {
    if (currentPillarIndex > 0) {
      const prevPillarIndex = currentPillarIndex - 1;
      const prevPillar = assessmentPillars[prevPillarIndex];
      
      // Always fetch questions for the previous pillar to update data
      if (prevPillar?.id) {
        await fetchAndSetPillarQuestions(prevPillar.id);
      }
      
      setCurrentPillarIndex(prevPillarIndex);
    }
  };

  const markSkippedIfUnanswered = (pillarIndex, questionIndex) => {
    const key = `${assessmentPillars[pillarIndex].id}-${questionIndex}`;
    if (!answers[key]) {
      setSkippedQuestions(prev => {
        if (prev.has(key)) return prev;
        const updated = new Set(prev);
        updated.add(key);
        return updated;
      });
    }
  };

  const handleQuestionNav = (targetIndex) => {
    markSkippedIfUnanswered(currentPillarIndex, currentQuestionIndex);
    const maxIndex = Math.max(0, (currentPillar?.questions?.length ?? 1) - 1);
    setCurrentQuestionIndex(Math.min(Math.max(0, targetIndex), maxIndex));
  };

  const handleNextQuestion = () => {
    markSkippedIfUnanswered(currentPillarIndex, currentQuestionIndex);
    setCurrentQuestionIndex(prev => Math.min(currentPillar.questions.length - 1, prev + 1));
  };

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
  };

  // Calculate pillar status based on answered questions
  const getPillarStatus = (pillarIndex) => {
    const pillar = assessmentPillars[pillarIndex];
    if (!pillar || !pillar.questions?.length) return { status: 'waiting', answeredCount: 0, totalCount: 0, remainingCount: 0 };
    
    const totalCount = pillar.questions.length;
    const answeredCount = pillar.questions.filter((_, qIndex) => {
      const questionKey = `${pillar.id}-${qIndex}`;
      return !!answers[questionKey];
    }).length;
    const remainingCount = totalCount - answeredCount;
    
    if (answeredCount === 0) {
      return { status: 'waiting', answeredCount, totalCount, remainingCount };
    } else if (answeredCount === totalCount) {
      return { status: 'completed', answeredCount, totalCount, remainingCount };
    } else {
      return { status: 'in_progress', answeredCount, totalCount, remainingCount };
    }
  };

  const getStepStatus = (index) => {
    const pillarStatus = getPillarStatus(index);
    return pillarStatus.status;
  };

  const getStepClasses = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white border-green-500";
      case "in_progress":
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
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <ErrorDisplay message={error} />
            </div>
          ) : assessmentPillars.length === 0 ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <p className="text-gray-600">No assessment data available. Please start an assessment from the Offerings page.</p>
                <Button
                  onClick={() => navigate('/offerings')}
                  className="mt-4 bg-[#46cdc6] hover:bg-[#15ae99] text-white"
                >
                  Go to Offerings
                </Button>
              </div>
            </div>
          ) : (
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
                    const pillarStatus = getPillarStatus(index);
                    const isCurrent = index === currentPillarIndex;
                    const isCompleted = pillarStatus.status === 'completed';
                    const isInProgress = pillarStatus.status === 'in_progress';
                    const isWaiting = pillarStatus.status === 'waiting';
                    
                return (
                      <div key={pillar.id} className="relative flex items-start">
                        {/* Connecting Line */}
                        {index < assessmentPillars.length - 1 && (
                          <div 
                            className={`absolute left-4 top-8 w-px h-12 ${
                              isCompleted || isInProgress
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
                                  : isInProgress
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
                              isCompleted || isInProgress ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {pillar.title}
                            </div>
                            <div className={`text-xs mt-1 ${
                              isCompleted || isInProgress ? 'text-gray-600' : 'text-gray-400'
                            }`}>
                              {pillar.description}
                            </div>
                            {/* Status */}
                            <div className={`text-xs font-medium mt-2 ${
                              isCompleted 
                                ? 'text-green-600' 
                                : isInProgress
                                  ? 'text-[#46cdc6]' 
                                  : 'text-gray-400'
                            }`}>
                              {isCompleted 
                                ? 'Completed' 
                                : isInProgress 
                                  ? `In Progress (${pillarStatus.remainingCount} ${pillarStatus.remainingCount === 1 ? 'question' : 'questions'} remaining)`
                                  : 'Waiting'}
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
                      PILLAR {currentPillar.order || currentPillarIndex + 1}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{currentPillar.title}</h2>
                  </div>
                  <div className="ml-auto bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 border">
                    <div className="text-xs text-gray-600">Section {currentPillarIndex + 1}/{assessmentPillars.length}</div>
                    <div className="text-sm font-semibold text-[#46cdc6]">
                      {!pillarQuestionsMap?.[currentPillar?.id]
                        ? '—/—'
                        : `${currentPillar.questions.filter((_, qIndex) =>
                            answers[`${currentPillar.id}-${qIndex}`] || currentPillar.questionIsSubmitted?.[qIndex]
                          ).length}/${currentPillar.totalCount ?? currentPillar.questions.length} Complete`}
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

              {/* Question Carousel - One Question at a Time; questions only from API */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 overflow-visible">
                {!pillarQuestionsMap?.[currentPillar?.id] ? (
                  <div className="flex flex-col items-center justify-center py-16" aria-busy="true">
                    <LoadingSpinner />
                    <p className="mt-3 text-sm text-gray-500">Loading questions...</p>
                  </div>
                ) : !(currentPillar.questions?.length) ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <p className="text-sm">No questions available for this pillar.</p>
                  </div>
                ) : (
                  <>
                    {/* Progress Indicators */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {currentPillar.title} Questions
                        </h3>
                        <div className="flex items-center gap-3">
                          <div className="text-sm text-gray-500">
                            Question {currentQuestionIndex + 1} of {currentPillar.totalCount ?? currentPillar.questions.length}
                          </div>
                          {/* Progress bar: total from API total_count; teal=answered (answers or is_submitted/is_selected), red=skipped, gray=unanswered */}
                          <div className="flex items-center gap-1">
                            {Array.from({ length: currentPillar.totalCount ?? currentPillar.questions.length }, (_, qIndex) => {
                              const questionKey = `${currentPillar.id}-${qIndex}`;
                              const isAnswered =
                                !!answers[questionKey] || currentPillar.questionIsSubmitted?.[qIndex] === true;
                              const isSkipped = skippedQuestions.has(questionKey);
                              const isCurrent = qIndex === currentQuestionIndex;
                              return (
                                <button
                                  key={qIndex}
                                  onClick={() => handleQuestionNav(qIndex)}
                                  className={`transition-all duration-200 rounded-full cursor-pointer ${
                                    isCurrent
                                      ? 'w-8 h-1.5 bg-[#46cdc6] ring-1 ring-[#46cdc6]'
                                      : isAnswered
                                        ? 'w-6 h-1.5 bg-[#46cdc6] opacity-50'
                                        : isSkipped
                                          ? 'w-6 h-1.5 bg-red-500 opacity-80'
                                          : 'w-6 h-1.5 bg-gray-300'
                                  } hover:opacity-100`}
                                  title={`Question ${qIndex + 1}${isAnswered ? ' (Answered)' : isSkipped ? ' (Skipped)' : ''}`}
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
                              
                              // Option text from API (answer_options array)
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
                              onClick={handlePrevQuestion}
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
                              onClick={handleNextQuestion}
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
                  </>
                )}
              </div>
            </div>
          </div>
        )}
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
                  Progress: {Object.keys(answers).length} of {assessmentPillars.reduce((total, pillar) => total + (pillar.questions?.length || 0), 0)} questions
                  </div>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[#46cdc6] to-[#15ae99] h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(Object.keys(answers).length / (assessmentPillars.reduce((total, pillar) => total + (pillar.questions?.length || 0), 0) || 1)) * 100}%` 
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
                  disabled={isLoadingResults}
                  className="bg-gradient-to-r from-[#46cdc6] to-[#15ae99] hover:from-[#15ae99] hover:to-[#46cdc6] text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  whileHover={!isLoadingResults ? { scale: 1.02 } : {}}
                  whileTap={!isLoadingResults ? { scale: 0.98 } : {}}
                >
                  {isLoadingResults ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Loading Results...</span>
                    </>
                  ) : (
                    <>
                      {currentPillarIndex === assessmentPillars.length - 1 ? 'View Results' : 'Next Pillar'}
                      {currentPillarIndex < assessmentPillars.length - 1 && (
                        <span className="ml-2">
                          ({currentPillarIndex + 1}/{assessmentPillars.length})
                        </span>
                      )}
                    </>
                  )}
                </motion.button>
              </div>
            </div>
            
            {/* Error message for results loading */}
            {resultsError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{resultsError}</span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Bottom padding to prevent content overlap - only when sticky bar is visible */}
      {Object.keys(answers).length > 0 && <div className="h-20"></div>}
    </div>
  );
}
