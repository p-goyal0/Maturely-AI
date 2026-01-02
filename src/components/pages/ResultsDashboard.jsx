import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { TrendingUp, Target, Users, Cpu, Database, Shield, Lock, ArrowRight, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { motion, useInView } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { PageHeader } from '../shared/PageHeader';
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
} from "recharts";

export function ResultsDashboard() {
  const navigate = useNavigate();
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [animatedSections, setAnimatedSections] = useState(new Set());
  
  // Refs for scroll detection - defined at component level to prevent re-creation
  const pillarScoresRef = useRef(null);
  const strengthsRef = useRef(null);
  const gapsRef = useRef(null);
  const recommendationsRef = useRef(null);
  
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

  const pieChartData = [
    { name: 'Strategy & Governance', value: 35, color: '#46cdc6' },
    { name: 'Organization & Workforce', value: 12, color: '#15ae99' },
    { name: 'Data & Technology', value: 28, color: '#2a868c' },
    { name: 'Performance & Impact', value: 8, color: '#1a1a1a' },
    { name: 'Trust, Ethics & Responsible AI', value: 10, color: '#4ade80' },
    { name: 'Security & Risk', value: 7, color: '#10b981' },
  ];

  const totalScore = pieChartData.reduce((acc, curr) => acc + curr.value, 0);
  const overallScore = 68;
  const maxScore = 100;

  useEffect(() => {
    if (pieChartData.length > 0 && !selectedSegment) {
      setSelectedSegment(pieChartData[0].name);
    }
  }, []);

  const radarData = [
    { pillar: "Strategy & Governance", score: 3.9, industry: 3.45 },
    { pillar: "Organization & Workforce", score: 3.1, industry: 3.2 },
    { pillar: "Data & Technology", score: 4.15, industry: 3.7 },
    { pillar: "Performance & Impact", score: 2.9, industry: 3.0 },
    { pillar: "Trust, Ethics & Responsible AI", score: 3.6, industry: 3.4 },
    { pillar: "Security & Risk", score: 4.7, industry: 3.9 },
  ];

  const pillarScores = [
    { icon: Target, title: "Strategy & Governance", score: 3.9, maxScore: 5, status: "strong", change: "+0.55" },
    { icon: Users, title: "Organization & Workforce", score: 3.1, maxScore: 5, status: "moderate", change: "+0.2" },
    { icon: Database, title: "Data & Technology", score: 4.15, maxScore: 5, status: "strong", change: "+0.85" },
    { icon: TrendingUp, title: "Performance & Impact", score: 2.9, maxScore: 5, status: "needs-improvement", change: "-0.1" },
    { icon: Shield, title: "Trust, Ethics & Responsible AI", score: 3.6, maxScore: 5, status: "moderate", change: "+0.3" },
    { icon: Lock, title: "Security & Risk", score: 4.7, maxScore: 5, status: "strong", change: "+0.9" },
  ];

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
      case "strong": return "text-green-600";
      case "moderate": return "text-yellow-600";
      case "needs-improvement": return "text-orange-600";
      default: return "text-gray-600";
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "strong": return "bg-green-50 text-green-700 border-green-200";
      case "moderate": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "needs-improvement": return "bg-orange-50 text-orange-700 border-orange-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
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
          { label: "Industry", path: "/industry" }
        ]}
        zIndex="z-50"
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative z-10">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <motion.div 
              initial={{ opacity: 0, x: -60 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
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
                    Intermediate
                  </div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    Your organization shows intermediate readiness for AI transformation. Continue reading for detailed insights.
                  </div>
                </div>
              </motion.div>
          </motion.div>

            {/* Right Column - Pie Chart */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className="relative"
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-br from-[#46cdc6]/20 to-[#15ae99]/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-100">
                <div className="relative w-full flex items-center justify-center">
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
                        const percentage = selectedData ? ((selectedData.value / totalScore) * 100).toFixed(0) : 0;
                        return (
                          <>
                            <div className="text-6xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">
                              {selectedData?.value || 0}
                            </div>
                            <div className="text-lg text-gray-600 mb-2">points</div>
                            <div className="text-4xl font-bold bg-gradient-to-r from-[#46cdc6] to-[#15ae99] bg-clip-text text-transparent">
                              {percentage}%
                            </div>
                          </>
                        );
                      })()
                    ) : (
                      <>
                        <div className="text-7xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
                          {overallScore}
                        </div>
                        <div className="text-2xl text-gray-600">/ {maxScore}</div>
                      </>
                    )}
                  </motion.div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Score Breakdown</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {pieChartData.map((segment, index) => {
                      const percentage = ((segment.value / totalScore) * 100).toFixed(0);
                      return (
                        <motion.button
                          key={index}
                          onClick={() => setSelectedSegment(selectedSegment === segment.name ? null : segment.name)}
                          className={`flex items-center gap-2 text-left p-3 rounded-xl transition-all border ${
                            selectedSegment === segment.name 
                              ? 'bg-gray-50 border-gray-300 shadow-md' 
                              : 'border-gray-200 hover:bg-gray-50 hover:shadow-sm'
                          }`}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <motion.div 
                            className="w-4 h-4 rounded-full flex-shrink-0"
                            style={{ backgroundColor: segment.color }}
                            animate={selectedSegment === segment.name ? { scale: [1, 1.2, 1] } : {}}
                            transition={{ duration: 0.5 }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">{segment.name}</div>
                            <div className="text-xs text-gray-600">{segment.value} pts • {percentage}%</div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Radar Chart Section */}
      <section className="py-20 relative">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 ">
          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
              <CardTitle className="text-3xl text-gray-900 font-bold">Maturity Profile</CardTitle>
              <CardDescription className="text-gray-600 text-base">Your scores compared to industry benchmarks</CardDescription>
              </CardHeader>
            <CardContent className="pt-8">
              <ResponsiveContainer width="100%" height={450}>
                  <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(107, 114, 128, 0.2)" strokeWidth={1.5} />
                  <PolarAngleAxis dataKey="pillar" tick={{ fill: "#374151", fontSize: 13, fontWeight: 500 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: "#6b7280" }} />
                  <Radar name="Your Score" dataKey="score" stroke="#46cdc6" fill="#46cdc6" fillOpacity={0.6} strokeWidth={2} />
                  <Radar name="Industry Average" dataKey="industry" stroke="#2a868c" fill="#2a868c" fillOpacity={0.3} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
        </div>
      </section>

      {/* Pillar Scores Section */}
      <section className="py-20 bg-gradient-to-b from-transparent via-gray-50 to-transparent">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 ">
          <h2 className="text-4xl mb-12 font-black text-gray-900 text-center">
            Pillar-wise <span className="bg-gradient-to-r from-[#46cdc6] to-[#15ae99] bg-clip-text text-transparent">Performance</span>
          </h2>
          
          <motion.div 
            ref={pillarScoresRef}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate={animatedSections.has('pillars') ? "visible" : "hidden"}
          >
              {pillarScores.map((pillar, index) => {
                const Icon = pillar.icon;
                const percentage = (pillar.score / pillar.maxScore) * 100;
                return (
                    <motion.div key={index} variants={scaleIn}>
                      <Card className="bg-white border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group h-full">
                        <CardHeader className="relative pb-4">
                          <motion.div
                            className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#46cdc6]/10 to-transparent rounded-full blur-2xl"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                            transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                          />
                          <div className="flex items-start justify-between mb-3 relative z-10">
                            <motion.div
                              whileHover={{ rotate: 360, scale: 1.1 }}
                              transition={{ duration: 0.6 }}
                            >
                              <Icon className={`w-7 h-7 ${getStatusColor(pillar.status)}`} />
                            </motion.div>
                            <div className="flex items-center gap-2">
                              <motion.span 
                                className="text-3xl text-gray-900 font-bold"
                                initial={{ scale: 0 }}
                                animate={animatedSections.has('pillars') ? { scale: 1 } : { scale: 0 }}
                                transition={{ type: "spring", stiffness: 200, delay: index * 0.1 }}
                              >
                                {pillar.score}
                              </motion.span>
                              <span className="text-sm text-gray-500">/ {pillar.maxScore}</span>
                            </div>
                      </div>
                          <CardTitle className="text-lg text-gray-900 font-bold">{pillar.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }} 
                                animate={animatedSections.has('pillars') ? { width: `${percentage}%` } : { width: 0 }} 
                                transition={{ duration: 1.2, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }} 
                                className={`h-full rounded-full ${
                                  pillar.status === "strong" ? "bg-gradient-to-r from-green-400 to-green-600" : 
                                  pillar.status === "moderate" ? "bg-gradient-to-r from-yellow-400 to-yellow-600" : 
                                  "bg-gradient-to-r from-orange-400 to-orange-600"
                                }`} 
                              />
                        </div>
                        <div className="flex justify-between items-center">
                              <Badge className={`${getStatusBadge(pillar.status)} font-medium`}>
                                {pillar.status === "strong" ? "Strong" : 
                                 pillar.status === "moderate" ? "Moderate" : "Needs Improvement"}
                              </Badge>
                              <motion.span 
                                className={`text-sm font-bold ${
                                  pillar.change.startsWith("+") ? "text-green-600" : "text-orange-600"
                                }`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={animatedSections.has('pillars') ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                              >
                                {pillar.change}
                              </motion.span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                    </motion.div>
                );
              })}
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
