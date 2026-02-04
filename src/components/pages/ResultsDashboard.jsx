import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { TrendingUp, Target, Users, Cpu, Database, Shield, Lock, ArrowRight, CheckCircle2, AlertCircle, Sparkles, Download, Loader2 } from 'lucide-react';
import { motion, useInView } from "motion/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, useMemo, useId } from "react";
import { PageHeader } from '../shared/PageHeader';
import { useAssessmentStore } from '../../stores/assessmentStore';
import { useAuthStore } from '../../stores/authStore';
import { generatePDFReport } from '../../services/reportService';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

// Pillar name mapping and icon mapping
const PILLAR_ICON_MAP = {
  "Strategic Value & Governance": Target,
  "Workforce Skillset & Organization Structure": Users,
  "Technology & Data": Database,
  "Resilience, Performance & Impact": TrendingUp,
  "Ethics, Trust & Responsible AI": Shield,
  "Compliance, Security & Risk": Lock,
  "Operations & Implementation": Cpu,
};

const PILLAR_SHORT_NAMES = {
  "Strategic Value & Governance": "Strategy & Governance",
  "Workforce Skillset & Organization Structure": "Organization & Workforce",
  "Technology & Data": "Data & Technology",
  "Resilience, Performance & Impact": "Performance & Impact",
  "Ethics, Trust & Responsible AI": "Trust, Ethics & Responsible AI",
  "Compliance, Security & Risk": "Security & Risk",
  "Operations & Implementation": "Operations & Implementation",
};

// Maturity-level colors for pie chart, status indicators, and breakdown bars
const MATURITY_COLORS = {
  Initial: '#ef4444',
  Adopting: '#f97316',
  Established: '#f59e0b',
  Advanced: '#10b981',
  Transformational: '#059669',
};
const DEFAULT_MATURITY_COLOR = MATURITY_COLORS.Established;
const MATURITY_GRADIENT = `linear-gradient(to right, ${MATURITY_COLORS.Initial}, ${MATURITY_COLORS.Adopting}, ${MATURITY_COLORS.Established}, ${MATURITY_COLORS.Advanced}, ${MATURITY_COLORS.Transformational})`;

// Fallback pillar colors (e.g. for radar) when not using maturity
const PILLAR_COLORS = [
  '#46cdc6',
  '#15ae99',
  '#2a868c',
  '#1a1a1a',
  '#4ade80',
  '#10b981',
  '#f59e0b',
];

// Custom tick component for radar chart to show full pillar names without truncation
const CustomPolarAngleAxisTick = ({ payload, x, y, cx, cy, ...props }) => {
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-payload.coordinate * RADIAN);
  const cos = Math.cos(-payload.coordinate * RADIAN);
  const radius = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
  const outerRadius = radius + 50;
  const textX = cx + outerRadius * cos;
  const textY = cy + outerRadius * sin;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text
        x={textX}
        y={textY}
        textAnchor={textAnchor}
        fill="#374151"
        fontSize={12}
        fontWeight={500}
        style={{ 
          textOverflow: 'clip',
          overflow: 'visible',
          whiteSpace: 'nowrap'
        }}
      >
        {payload.value}
      </text>
    </g>
  );
};

// Custom radar polygon with gradient fill between adjacent pillar (maturity) colors.
// Recharts passes each point with { x, y, cx, cy } — cx/cy are the polar chart center, so we use those.
function RadarPolygonWithGradients({ points = [], colors = [], gradientIdBase, ...rest }) {
  if (!points.length || colors.length !== points.length) return null;
  // Recharts provides cx, cy on every point (the polar grid center) — use it instead of manual math
  const cx = points[0]?.cx ?? points.reduce((s, p) => s + p.x, 0) / points.length;
  const cy = points[0]?.cy ?? points.reduce((s, p) => s + p.y, 0) / points.length;
  const base = gradientIdBase || 'radar-g';
  return (
    <g {...rest}>
      <defs>
        {points.map((_, i) => {
          const next = (i + 1) % points.length;
          return (
            <linearGradient
              key={i}
              id={`${base}-${i}`}
              x1={points[i].x}
              y1={points[i].y}
              x2={points[next].x}
              y2={points[next].y}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={colors[i]} />
              <stop offset="100%" stopColor={colors[next]} />
            </linearGradient>
          );
        })}
      </defs>
      {points.map((_, i) => {
        const next = (i + 1) % points.length;
        const d = `M ${cx} ${cy} L ${points[i].x} ${points[i].y} L ${points[next].x} ${points[next].y} Z`;
        return (
          <path
            key={i}
            d={d}
            fill={`url(#${base}-${i})`}
            fillOpacity={0.88}
          />
        );
      })}
      <path
        d={points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'}
        fill="none"
        stroke="rgba(55,65,81,0.35)"
        strokeWidth={2}
      />
    </g>
  );
}

// Helper function to get status from maturity level - 5 distinct levels
const getStatusFromMaturity = (maturityLevel) => {
  switch (maturityLevel) {
    case "Initial":
      return "initial";
    case "Adopting":
      return "adopting";
    case "Established":
      return "established";
    case "Advanced":
      return "advanced";
    case "Transformational":
      return "transformational";
    default:
      return "established";
  }
};

export function ResultsDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { assessmentResults } = useAssessmentStore();
  const { currentUser } = useAuthStore();
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [animatedSections, setAnimatedSections] = useState(new Set());
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  // Refs for scroll detection - defined at component level to prevent re-creation
  const pillarScoresRef = useRef(null);
  const strengthsRef = useRef(null);
  const gapsRef = useRef(null);
  const recommendationsRef = useRef(null);
  const chartContainerRef = useRef(null);
  const radarGradientId = useId();
  
  // useInView hooks - defined at component level
  const pillarScoresInView = useInView(pillarScoresRef, { once: true, margin: "-100px", amount: 0.1 });
  const strengthsInView = useInView(strengthsRef, { once: true, margin: "-100px", amount: 0.1 });
  const gapsInView = useInView(gapsRef, { once: true, margin: "-100px", amount: 0.1 });
  const recommendationsInView = useInView(recommendationsRef, { once: true, margin: "-100px", amount: 0.1 });
  
  // Set animated sections when they come into view - using functional updates to avoid dependency issues
  useEffect(() => {
    if (pillarScoresInView) {
      setAnimatedSections(prev => {
        if (!prev.has('pillars')) {
          return new Set(prev).add('pillars');
        }
        return prev;
      });
    }
  }, [pillarScoresInView]);
  
  useEffect(() => {
    if (strengthsInView) {
      setAnimatedSections(prev => {
        if (!prev.has('strengths')) {
          return new Set(prev).add('strengths');
        }
        return prev;
      });
    }
  }, [strengthsInView]);
  
  useEffect(() => {
    if (gapsInView) {
      setAnimatedSections(prev => {
        if (!prev.has('gaps')) {
          return new Set(prev).add('gaps');
        }
        return prev;
      });
    }
  }, [gapsInView]);
  
  useEffect(() => {
    if (recommendationsInView) {
      setAnimatedSections(prev => {
        if (!prev.has('recommendations')) {
          return new Set(prev).add('recommendations');
        }
        return prev;
      });
    }
  }, [recommendationsInView]);

  // Transform API data to component format
  const pieChartData = useMemo(() => {
    if (!assessmentResults?.pillar_results) return [];
    
    const sortedPillars = assessmentResults.pillar_results
      .sort((a, b) => a.pillar_order - b.pillar_order);
    
    // Calculate total weighted score for normalization
    const totalWeightedScore = sortedPillars.reduce((sum, p) => sum + p.weighted_score, 0);
    
    return sortedPillars.map((pillar) => {
      // Use weighted_score normalized to 100 for pie chart (shows relative contribution)
      const normalizedValue = totalWeightedScore > 0 
        ? Math.round((pillar.weighted_score / totalWeightedScore) * 100) 
        : 0;
      const maturityLevel = pillar.maturity_level || 'Established';
      const color = MATURITY_COLORS[maturityLevel] ?? DEFAULT_MATURITY_COLOR;

      return {
        name: PILLAR_SHORT_NAMES[pillar.pillar_name] || pillar.pillar_name,
        value: normalizedValue,
        color,
        originalName: pillar.pillar_name,
        averageScore: pillar.average_score,
        weightedScore: pillar.weighted_score,
      };
    });
  }, [assessmentResults]);

  const totalScore = useMemo(() => {
    return pieChartData.reduce((acc, curr) => acc + curr.value, 0);
  }, [pieChartData]);

  const overallScore = useMemo(() => {
    if (!assessmentResults?.overall_score) return 0;
    // Convert from 0-5 scale to 0-100 scale
    return Math.round((assessmentResults.overall_score / 5) * 100);
  }, [assessmentResults]);

  const overallMaturityLevel = assessmentResults?.overall_maturity_level || "Adopting";
  const maxScore = 100;

  useEffect(() => {
    if (pieChartData.length > 0 && !selectedSegment) {
      setSelectedSegment(pieChartData[0].name);
    }
  }, [pieChartData]);

  // Radar chart data - using average_score and maturity color per pillar
  const radarData = useMemo(() => {
    if (!assessmentResults?.pillar_results) return [];
    
    return assessmentResults.pillar_results
      .sort((a, b) => a.pillar_order - b.pillar_order)
      .map((pillar) => {
        const maturityLevel = pillar.maturity_level || 'Established';
        const color = MATURITY_COLORS[maturityLevel] ?? DEFAULT_MATURITY_COLOR;
        const score = typeof pillar.average_score === 'number' ? pillar.average_score : parseFloat(pillar.average_score) || 0;
        return {
          pillar: PILLAR_SHORT_NAMES[pillar.pillar_name] || pillar.pillar_name,
          score,
          fullMark: 5,
          color,
        };
      })
      .filter(item => item.score !== null && item.score !== undefined && !isNaN(item.score));
  }, [assessmentResults]);

  // Pillar scores for the cards section
  const pillarScores = useMemo(() => {
    if (!assessmentResults?.pillar_results) return [];
    
    return assessmentResults.pillar_results
      .sort((a, b) => a.pillar_order - b.pillar_order)
      .map((pillar) => {
        const Icon = PILLAR_ICON_MAP[pillar.pillar_name] || Target;
        const shortName = PILLAR_SHORT_NAMES[pillar.pillar_name] || pillar.pillar_name;
        const status = getStatusFromMaturity(pillar.maturity_level);
        
        return {
          icon: Icon,
          title: shortName,
          score: parseFloat(pillar.average_score.toFixed(2)),
          maxScore: 5,
          status: status,
          change: "", // Can be calculated if we have previous assessment data
        };
      });
  }, [assessmentResults]);

  // Show loading or fallback if no results
  if (!assessmentResults || !assessmentResults.pillar_results || assessmentResults.pillar_results.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
        <PageHeader 
          centerItems={[
            { label: "Home", path: "/offerings" },
            { label: "Assessments", path: "/my-assessments" },
            { label: "Results", path: "/completed-assessments" },
            { label: "Use Cases", path: "/usecases" },
          ]}
          activePath={location.pathname}
          zIndex="z-50"
        />
        <div className="pt-32 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg text-gray-600 mb-4">No assessment results available</div>
            <Button onClick={() => navigate("/assessments")}>Go to Assessments</Button>
          </div>
        </div>
      </div>
    );
  }

  const strengths = [
    { title: "Advanced Security Infrastructure", description: "Industry-leading data protection and compliance frameworks", icon: Lock },
    { title: "Robust Technology Stack", description: "Modern AI platforms with strong MLOps capabilities", icon: Cpu },
    { title: "Clear Strategic Vision", description: "Well-defined AI roadmap with executive buy-in", icon: Target },
  ];

  const gaps = [
    { title: "Performance Measurement", description: "Limited ROI tracking and business impact quantification", icon: TrendingUp, priority: "High" },
    { title: "Workforce Skills Gap", description: "Need for upskilling programs and talent acquisition", icon: Users, priority: "Medium" },
  ];

  const recommendations = [
    { title: "Implement AI ROI Framework", description: "Establish metrics and KPIs to measure AI initiative outcomes", timeline: "1-3 months", impact: "High" },
    { title: "Launch AI Upskilling Program", description: "Develop comprehensive training for technical and business teams", timeline: "3-6 months", impact: "High" },
    { title: "Enhance Data Governance", description: "Strengthen data quality controls and accessibility", timeline: "6-12 months", impact: "Medium" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "initial": return "text-[#ef4444]";
      case "adopting": return "text-[#f97316]";
      case "established": return "text-[#f59e0b]";
      case "advanced": return "text-[#10b981]";
      case "transformational": return "text-[#059669]";
      default: return "text-gray-600";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "initial": return "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/30";
      case "adopting": return "bg-[#f97316]/10 text-[#f97316] border-[#f97316]/30";
      case "established": return "bg-[#f59e0b]/15 text-[#b45309] border-[#f59e0b]/40";
      case "advanced": return "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30";
      case "transformational": return "bg-[#059669]/10 text-[#059669] border-[#059669]/30";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "initial": return "Initial";
      case "adopting": return "Adopting";
      case "established": return "Established";
      case "advanced": return "Advanced";
      case "transformational": return "Transformational";
      default: return "Established";
    }
  };

  const getProgressBarGradient = (status) => {
    switch (status) {
      case "initial": return "bg-[#ef4444]";
      case "adopting": return "bg-[#f97316]";
      case "established": return "bg-[#f59e0b]";
      case "advanced": return "bg-[#10b981]";
      case "transformational": return "bg-[#059669]";
      default: return "bg-gradient-to-r from-gray-400 to-gray-600";
    }
  };

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-[#46cdc6]/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Header */}
      <PageHeader 
        centerItems={[
          { label: "Home", path: "/offerings" },
          { label: "Assessments", path: "/my-assessments" },
          { label: "Results", path: "/completed-assessments" },
          { label: "Use Cases", path: "/usecases" },
        ]}
        activePath={location.pathname}
        zIndex="z-50"
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative z-10">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 ">
          <motion.div 
            initial={{ opacity: 0, x: -60 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6 max-w-4xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#46cdc6]/10 to-[#15ae99]/10 text-[#46cdc6] px-4 py-2 rounded-full text-sm font-medium border border-[#46cdc6]/20 shadow-sm">
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  ✨
                </motion.span>
                <span>Assessment Complete</span>
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Your AI Readiness
              <span className="block bg-gradient-to-r from-[#46cdc6] to-[#15ae99] bg-clip-text text-transparent">
                Results
              </span>
            </motion.h1>

            <motion.p 
              className="text-lg text-gray-600 leading-relaxed max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Based on your assessment, here's a comprehensive analysis of your organization's AI readiness and strategic recommendations.
            </motion.p>

            <motion.div 
              className="flex items-start gap-4 p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <motion.div 
                className="w-14 h-14 bg-gradient-to-br from-[#46cdc6] to-[#15ae99] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <TrendingUp className="w-7 h-7 text-white" />
              </motion.div>
              <div className="flex-1">
                <div className="text-sm text-gray-600 mb-1 font-medium">Readiness Level</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                  {overallMaturityLevel}
                </div>
                <div className="text-sm text-gray-600 leading-relaxed">
                  Your organization shows {overallMaturityLevel.toLowerCase()} readiness for AI transformation. Continue reading for detailed insights.
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Button
                onClick={async () => {
                  if (!assessmentResults) {
                    alert('No assessment results available to download');
                    return;
                  }

                  setIsGeneratingReport(true);

                  try {
                    const companyName = currentUser?.company_name || currentUser?.name || 'Your Organization';
                    const chartElement = chartContainerRef?.current || document.querySelector('[data-chart-container]');

                    const result = await generatePDFReport(
                      assessmentResults,
                      chartElement,
                      {
                        companyName,
                        date: new Date().toLocaleDateString(),
                        includeCharts: !!chartElement,
                      }
                    );

                    if (result.success) {
                      console.log('Report downloaded successfully:', result.filename);
                    } else {
                      alert(`Failed to generate report: ${result.error}`);
                    }
                  } catch (error) {
                    console.error('Error downloading report:', error);
                    alert('An error occurred while generating the report. Please try again.');
                  } finally {
                    setIsGeneratingReport(false);
                  }
                }}
                disabled={isGeneratingReport || !assessmentResults}
                className="bg-gradient-to-r from-[#46cdc6] to-[#15ae99] hover:from-[#15ae99] hover:to-[#46cdc6] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isGeneratingReport ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Report...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Report</span>
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Score Breakdown Section */}
      <section className="py-20 relative" ref={chartContainerRef} data-chart-container>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 ">
          <Card className="bg-white/30 backdrop-blur-sm rounded-3xl p-8 shadow-sm border border-gray-200/50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Score Breakdown Cards (2 columns) */}
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <CardHeader className="pb-6 px-0">
                  <CardTitle className="text-2xl font-bold text-gray-900">Score Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                  <div className="grid grid-cols-2 gap-3">
                    {pieChartData.map((segment, index) => {
                      const score = segment.averageScore ? parseFloat(segment.averageScore.toFixed(2)) : 0;
                      const percentage = segment.value;
                      return (
                        <motion.button
                          key={index}
                          onClick={() => setSelectedSegment(selectedSegment === segment.name ? null : segment.name)}
                          className={`flex items-center gap-3 text-left p-4 rounded-xl transition-all border ${
                            selectedSegment === segment.name 
                              ? 'bg-gray-50 border-gray-300 shadow-md' 
                              : 'bg-white border-gray-200 hover:bg-gray-50 hover:shadow-sm'
                          }`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Circle on left */}
                          <motion.div 
                            className="w-5 h-5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: segment.color }}
                            animate={selectedSegment === segment.name ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ duration: 0.5 }}
                          />
                          {/* Score breakdown on right */}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 mb-1 truncate">{segment.name}</div>
                            <div className="text-xs text-gray-600">{score} / 5.0</div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </CardContent>
              </motion.div>

              {/* Right Column - Pie Chart (Circular Diagram) */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="relative"
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-[#46cdc6]/20 to-[#15ae99]/20 rounded-full blur-3xl"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                
                <div className="relative w-full flex items-center justify-center" data-pie-chart>
                  <PieChart width={400} height={400}>
                    <Pie
                      data={pieChartData}
                      cx={200}
                      cy={200}
                      innerRadius={140}
                      outerRadius={170}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      onClick={(data) => setSelectedSegment(data?.name)}
                      style={{ cursor: 'pointer' }}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          opacity={selectedSegment === entry.name ? 1 : selectedSegment ? 0.3 : 1}
                          style={{ transition: 'opacity 0.3s' }}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                  
                  <motion.div 
                    className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                    key={selectedSegment}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {selectedSegment ? (
                      (() => {
                        const selectedData = pieChartData.find(seg => seg.name === selectedSegment);
                        if (!selectedData) return null;
                        const score = selectedData.averageScore ? parseFloat(selectedData.averageScore.toFixed(2)) : 0;
                        const percentage = selectedData.value;
                        return (
                          <>
                            <div className="text-6xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">
                              {score}
                            </div>
                            <div className="text-lg text-gray-600">/ 5.0</div>
                          </>
                        );
                      })()
                    ) : (
                      <>
                        <div className="text-7xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
                          {overallScore}
                        </div>
                        <div className="text-2xl text-gray-600">/ {maxScore}</div>
                        <div className="text-lg text-gray-500 mt-2">{overallMaturityLevel}</div>
                      </>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </Card>
        </div>
      </section>

      {/* Radar Chart Section */}
      <section className="py-20 relative" data-radar-section>
        <style>{`
          [data-radar-chart] .recharts-polar-angle-axis-tick text,
          [data-radar-chart] .recharts-text {
            text-overflow: clip !important;
            overflow: visible !important;
            white-space: nowrap !important;
            max-width: none !important;
          }
          [data-radar-chart] svg {
            overflow: visible !important;
          }
        `}</style>
        <div className="mx-auto px-4 sm:px-6 lg:px-8 ">
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-2xl overflow-visible">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
              <CardTitle className="text-3xl text-gray-900 font-bold">Maturity Profile</CardTitle>
              <CardDescription className="text-gray-600 text-base">Your scores across all assessment pillars</CardDescription>
              </CardHeader>
            <CardContent className="pt-8 pb-16 px-4" data-radar-chart style={{ overflow: 'visible' }}>
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-stretch">
                {/* Left: Radar chart — half width */}
                <div className="flex-1 min-w-0 lg:w-[65%] lg:max-w-[65%]" style={{ height: '550px', padding: '20px', overflow: 'visible' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData} outerRadius="75%">
                    <PolarGrid stroke="rgba(107, 114, 128, 0.2)" strokeWidth={1.5} />
                    <PolarAngleAxis 
                      dataKey="pillar" 
                      tick={CustomPolarAngleAxisTick}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 5]} 
                      ticks={[1, 2, 3, 4, 5]}
                      tick={{ fill: "#6b7280", fontSize: 12 }} 
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-4 min-w-[200px]">
                              <p className="font-semibold text-gray-900 mb-3 text-base">{label}</p>
                              <div className="space-y-2">
                                {payload.map((entry, index) => (
                                  <div key={index} className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: entry.color }}
                                      />
                                      <span className="text-sm text-gray-600 font-medium">
                                        {entry.name}
                                      </span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">
                                      {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value} / 5.0
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                      cursor={{ stroke: '#14b8a6', strokeWidth: 1, strokeDasharray: '3 3' }}
                    />
                    <Radar 
                      name="Your Score" 
                      dataKey="score" 
                      stroke="transparent"
                      fill="transparent"
                      strokeWidth={0}
                      shape={
                        <RadarPolygonWithGradients
                          colors={radarData.map((d) => d.color)}
                          gradientIdBase={radarGradientId.replace(/:/g, '')}
                        />
                      }
                      dot={({ cx, cy, payload, index }) => {
                        const color = radarData[index]?.color ?? payload?.color ?? DEFAULT_MATURITY_COLOR;
                        return (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={6}
                            fill={color}
                            stroke="#ffffff"
                            strokeWidth={2}
                          />
                        );
                      }}
                      connectNulls={true}
                      isAnimationActive={false}
                      activeDot={({ cx, cy, payload, index }) => {
                        const color = radarData[index]?.color ?? payload?.color ?? DEFAULT_MATURITY_COLOR;
                        return (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={8}
                            fill={color}
                            stroke="#ffffff"
                            strokeWidth={2}
                          />
                        );
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

                {/* Right: Score by pillar — half width, segmented bars (no gradient) */}
                <Card className="flex-1 min-w-0 lg:w-[35%] lg:max-w-[35%] border border-gray-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold text-gray-900">Score by pillar</CardTitle>
                    <CardDescription className="text-sm text-gray-600">Maturity level per dimension</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {radarData.map((item, index) => {
                      const score = typeof item.score === 'number' ? item.score : parseFloat(item.score) || 0;
                      const percent = Math.min(100, Math.max(0, (score / 5) * 100));
                      const color = item.color ?? DEFAULT_MATURITY_COLOR;
                      const segmentColors = [
                        MATURITY_COLORS.Initial,
                        MATURITY_COLORS.Adopting,
                        MATURITY_COLORS.Established,
                        MATURITY_COLORS.Advanced,
                        MATURITY_COLORS.Transformational,
                      ];
                      return (
                        <div key={index} className="space-y-2">
                          <span className="block text-sm font-semibold text-gray-900 truncate">{item.pillar}</span>
                          {/* Bar row: centered, tooltip positioned on bar at score */}
                          <div className="flex justify-center">
                            <div className="relative flex items-center w-[65%] max-w-[320px] min-h-[2rem]">
                              {/* Bar: 5 distinct segments */}
                              <div className="flex w-full h-4 rounded-full overflow-hidden flex-shrink-0">
                                {segmentColors.map((segColor, i) => (
                                  <div
                                    key={i}
                                    className="flex-1 min-w-0 shrink-0"
                                    style={{ backgroundColor: segColor }}
                                  />
                                ))}
                              </div>
                              {/* Score tooltip: above the bar, triangle tip at top of bar (not overlapping bar) */}
                              <div
                                className="absolute flex flex-col items-center pointer-events-none z-10"
                                style={{
                                  left: `${percent}%`,
                                  top: 'calc(50% - 0.5rem)',
                                  transform: 'translate(-50%, -100%)',
                                }}
                              >
                                <span
                                  className="rounded-t px-2.5 py-1 text-xs font-bold text-white shadow-sm whitespace-nowrap"
                                  style={{ backgroundColor: color }}
                                >
                                  {score.toFixed(1)}
                                </span>
                                <span
                                  className="w-0 h-0 border-[5px] border-transparent"
                                  style={{ borderTopColor: color }}
                                  aria-hidden
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pillar-wise Performance — matrix table (cards shown in report PDF) */}
      <section className="py-20 bg-gradient-to-b from-transparent via-gray-50 to-transparent">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl mb-12 font-black text-gray-900 text-center">
            Pillar-wise <span className="bg-gradient-to-r from-[#46cdc6] to-[#15ae99] bg-clip-text text-transparent">Performance</span>
          </h2>

          <motion.div
            ref={pillarScoresRef}
            initial={{ opacity: 0, y: 16 }}
            animate={animatedSections.has('pillars') ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/80">
                    <th className="py-4 px-5 text-sm font-bold text-gray-900">Pillar</th>
                    <th className="py-4 px-4 text-sm font-bold text-gray-700 text-center">Initial</th>
                    <th className="py-4 px-4 text-sm font-bold text-gray-700 text-center">Adopting</th>
                    <th className="py-4 px-4 text-sm font-bold text-gray-700 text-center">Established</th>
                    <th className="py-4 px-4 text-sm font-bold text-gray-700 text-center">Advanced</th>
                    <th className="py-4 px-4 text-sm font-bold text-gray-700 text-center">Transformational</th>
                  </tr>
                </thead>
                <tbody>
                  {pillarScores.map((pillar, rowIndex) => {
                    const currentLevel = pillar.status ? getStatusLabel(pillar.status) : null;
                    const stages = ['Initial', 'Adopting', 'Established', 'Advanced', 'Transformational'];
                    return (
                      <tr key={rowIndex} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50">
                        <td className="py-4 px-5 font-medium text-gray-900">{pillar.title}</td>
                        {stages.map((stage) => {
                          const isCurrent = currentLevel === stage;
                          const stageColor = MATURITY_COLORS[stage] ?? '#94a3b8';
                          return (
                            <td key={stage} className="py-4 px-4 text-center">
                              {isCurrent ? (
                                <span
                                  className="inline-block rounded px-3 py-1.5 text-xs font-bold text-white"
                                  style={{ backgroundColor: stageColor }}
                                >
                                  Current
                                </span>
                              ) : (
                                <span className="text-gray-300">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Strengths and Gaps Section */}
      <section className="py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="grid lg:grid-cols-2 gap-8">
            <div ref={strengthsRef}>
              <Card className="bg-gradient-to-br from-green-50 to-white border-green-200 shadow-xl h-full overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-green-100/50 to-transparent border-b border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CheckCircle2 className="w-7 h-7 text-green-600" />
          </motion.div>
                    <CardTitle className="text-2xl text-gray-900 font-bold">Key Strengths</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">Areas where you excel compared to industry peers</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {strengths.map((strength, index) => {
                      const Icon = strength.icon;
                      return (
                        <motion.div 
                          key={index} 
                          className="p-4 rounded-xl bg-white border border-green-200 shadow-sm hover:shadow-md transition-all"
                          initial={{ opacity: 0, x: -20 }}
                          animate={animatedSections.has('strengths') ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, x: 5 }}
                        >
                          <div className="flex gap-3">
                            <motion.div 
                              className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center flex-shrink-0 shadow-sm"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                              <Icon className="w-6 h-6 text-green-600" />
                            </motion.div>
                            <div>
                              <h4 className="mb-1 text-gray-900 font-bold">{strength.title}</h4>
                              <p className="text-sm text-gray-600 leading-relaxed">{strength.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div ref={gapsRef}>
              <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200 shadow-xl h-full overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-orange-100/50 to-transparent border-b border-orange-200">
                  <div className="flex items-center gap-3 mb-2">
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <AlertCircle className="w-7 h-7 text-orange-600" />
            </motion.div>
                    <CardTitle className="text-2xl text-gray-900 font-bold">Improvement Areas</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">Opportunities to enhance your AI maturity</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {gaps.map((gap, index) => {
                      const Icon = gap.icon;
                      return (
                        <motion.div 
                          key={index} 
                          className="p-4 rounded-xl bg-white border border-orange-200 shadow-sm hover:shadow-md transition-all"
                          initial={{ opacity: 0, x: 20 }}
                          animate={animatedSections.has('gaps') ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, x: -5 }}
                        >
                          <div className="flex gap-3">
                            <motion.div 
                              className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center flex-shrink-0 shadow-sm"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                              <Icon className="w-6 h-6 text-orange-600" />
                            </motion.div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-1">
                                <h4 className="text-gray-900 font-bold">{gap.title}</h4>
                                <Badge className="bg-orange-100 text-orange-700 border-orange-200 font-medium">{gap.priority}</Badge>
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed">{gap.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          </div>
      </section>

      {/* Recommendations Section */}
      <section className="py-20 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 ">
          <div ref={recommendationsRef}>
            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
                <CardTitle className="text-3xl text-gray-900 font-bold flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Target className="w-8 h-8 text-blue-600" />
                  </motion.div>
                  Strategic Recommendations
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">Prioritized action items to accelerate your AI transformation</CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <motion.div 
                      key={index} 
                      className="p-5 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group"
                      initial={{ opacity: 0, y: 20 }}
                      animate={animatedSections.has('recommendations') ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ delay: index * 0.15 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <motion.div
                              className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              {index + 1}
                            </motion.div>
                            <h4 className="text-gray-900 font-bold text-lg">{rec.title}</h4>
                          </div>
                          <p className="text-sm text-gray-600 leading-relaxed ml-10">{rec.description}</p>
                        </div>
                        <div className="flex gap-3 md:flex-col md:items-end ml-10 md:ml-0">
                          <Badge className="bg-cyan-50 text-cyan-700 border-cyan-200 font-medium whitespace-nowrap">
                            {rec.timeline}
                          </Badge>
                          <Badge className="bg-purple-50 text-purple-700 border-purple-200 font-medium whitespace-nowrap">
                            {rec.impact} Impact
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#46cdc6]/10 via-purple-500/10 to-[#15ae99]/10"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: '200% 200%' }}
        />
        
        <div className="mx-auto px-4 sm:px-6 lg:px-8  relative z-10">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-12 shadow-2xl border border-gray-700 relative overflow-hidden">
              <motion.div
                className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#46cdc6]/20 to-purple-500/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              
              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <motion.h2 
                  className="text-4xl md:text-5xl font-black text-white mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  Ready to Transform Your
                  <span className="block bg-gradient-to-r from-[#46cdc6] to-[#15ae99] bg-clip-text text-transparent">
                    AI Strategy?
                  </span>
                </motion.h2>
                
                <motion.p 
                  className="text-lg text-gray-300 mb-10 leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: 0.1 }}
                >
                  Explore tailored use cases and actionable insights designed specifically for your organization's AI maturity level.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.button
                    onClick={() => navigate("/usecases")}
                    className="bg-gradient-to-r from-[#46cdc6] to-[#15ae99] hover:from-[#15ae99] hover:to-[#46cdc6] text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-2xl inline-flex items-center gap-3 group"
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(70, 205, 198, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>Explore Use Cases</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-6 h-6" />
                    </motion.div>
                  </motion.button>
                </motion.div>

                <motion.div 
                  className="mt-8 flex items-center justify-center gap-8 text-gray-400 text-sm"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#46cdc6]" />
                    <span>Personalized Insights</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#46cdc6]" />
                    <span>Industry Benchmarks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#46cdc6]" />
                    <span>Actionable Roadmap</span>
                  </div>
          </motion.div>
        </div>
      </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 ">
          <motion.div 
            className="flex flex-col md:flex-row items-center justify-between gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="flex items-center gap-3">
              <img src="/logo/wings.png" alt="Logo" className="h-10 w-10 transition-all duration-300" />
              <img src="/logo/maturely_logo.png" alt="MATURITY.AI" className="h-5 transition-all duration-300" />
            </div>
            
            <div className="text-sm text-gray-600 text-center md:text-right">
              <p>© 2024 Maturity.AI. All rights reserved.</p>
              <p className="mt-1">Empowering AI transformation with data-driven insights.</p>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
