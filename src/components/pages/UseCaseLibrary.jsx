import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Sparkles, PenTool, Plus, Save, Building2, Zap, TrendingUp, Shield, CheckCircle2, X, Lock, Globe, Loader2, Search, ChevronDown } from 'lucide-react';
import { PageHeader } from '../shared/PageHeader';
import { Button } from '../ui/button';
import { getUseCaseList } from '../../services/useCaseService';

const industryUseCases = {
  healthcare: [
    { id: 1, name: "AI-Powered Diagnostics", description: "Automated medical image analysis for faster diagnosis", category: "Clinical Operations", impact: "High", feasibility: "Medium" },
    { id: 2, name: "Patient Flow Optimization", description: "Predictive analytics for hospital bed management", category: "Operations", impact: "Medium", feasibility: "High" },
    { id: 3, name: "Drug Interaction Checker", description: "AI system to identify potential medication conflicts", category: "Patient Safety", impact: "High", feasibility: "High" },
  ],
  finance: [
    { id: 1, name: "Fraud Detection System", description: "Real-time transaction monitoring using ML models", category: "Risk Management", impact: "High", feasibility: "Medium" },
    { id: 2, name: "Automated Underwriting", description: "AI-driven loan approval process", category: "Operations", impact: "High", feasibility: "High" },
    { id: 3, name: "Customer Churn Prediction", description: "Identify at-risk customers before they leave", category: "Customer Retention", impact: "Medium", feasibility: "High" },
  ],
  retail: [
    { id: 1, name: "Demand Forecasting", description: "ML-based inventory optimization", category: "Supply Chain", impact: "High", feasibility: "High" },
    { id: 2, name: "Personalized Recommendations", description: "AI-powered product suggestions", category: "Customer Experience", impact: "High", feasibility: "Medium" },
    { id: 3, name: "Dynamic Pricing Engine", description: "Real-time price optimization based on market conditions", category: "Revenue", impact: "Medium", feasibility: "Medium" },
  ],
  manufacturing: [
    { id: 1, name: "Predictive Maintenance", description: "AI-driven equipment failure prediction", category: "Operations", impact: "High", feasibility: "High" },
    { id: 2, name: "Quality Control Automation", description: "Computer vision for defect detection", category: "Quality", impact: "High", feasibility: "Medium" },
    { id: 3, name: "Supply Chain Optimization", description: "ML-based supplier and logistics management", category: "Supply Chain", impact: "Medium", feasibility: "High" },
  ],
};

  const industries = [
  { id: 'healthcare', name: 'Healthcare', icon: Shield },
  { id: 'finance', name: 'Finance', icon: TrendingUp },
  { id: 'retail', name: 'Retail', icon: Building2 },
  { id: 'manufacturing', name: 'Manufacturing', icon: Zap },
];

const emptyUseCase = {
  useCaseId: '', useCaseName: '', processOwner: '', lastUpdatedBy: '',
  dateCreated: new Date().toISOString().split('T')[0],
  dateLastUpdated: new Date().toISOString().split('T')[0],
  businessUse: '', description: '', preconditions: '', postconditions: '',
  performanceGoal: '', basicWorkflow: '', alternativeWorkflow: '',
  category: '', risks: '', possibilities: '',
  visibility: 'private', // 'private' or 'public'
};

const useCasesHeaderLinks = [
  { label: 'Home', path: '/offerings' },
  { label: 'Assessments', path: '/my-assessments' },
  { label: 'Results', path: '/completed-assessments' },
  { label: 'Use Cases', path: '/usecases' },
];

export function UseCaseLibrary() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMode, setActiveMode] = useState(null);
  const [selectedUseCase, setSelectedUseCase] = useState(null);
  const [customUseCases, setCustomUseCases] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState(emptyUseCase);
  const [showPersonalizeModal, setShowPersonalizeModal] = useState(false);
  const [personalizeQuery, setPersonalizeQuery] = useState('');
  const [showUseCases, setShowUseCases] = useState(false);
  const [inspireUseCasesList, setInspireUseCasesList] = useState(null);
  const [inspireUseCasesLoading, setInspireUseCasesLoading] = useState(false);
  const [inspireUseCasesError, setInspireUseCasesError] = useState(null);
  const [inspireSearchQuery, setInspireSearchQuery] = useState('');
  const [inspireDisplayCount, setInspireDisplayCount] = useState(6);
  const [expandedInspireCardKey, setExpandedInspireCardKey] = useState(null);

  const handleFormChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSaveUseCase = () => {
    if (formData.useCaseName && formData.description) {
      if (formData.id) {
        // Update existing use case
        setCustomUseCases(prev => prev.map(uc => uc.id === formData.id ? formData : uc));
      } else {
        // Create new use case
      setCustomUseCases(prev => [...prev, { ...formData, id: Date.now() }]);
      }
      setFormData(emptyUseCase);
      setIsFormOpen(false);
    }
  };

  const useAsTemplate = (uc) => {
    setActiveMode('build');
    setFormData({ ...emptyUseCase, useCaseName: uc.name, description: uc.description, category: uc.category, visibility: uc.visibility || 'private' });
    setIsFormOpen(true);
    setSelectedUseCase(null);
  };

  const handleEditUseCase = (useCase) => {
    setActiveMode('build');
    setFormData({ ...useCase });
    setIsFormOpen(true);
    setSelectedUseCase(null);
  };

  const handleSkipAndShowAll = async () => {
    setInspireUseCasesError(null);
    setInspireUseCasesLoading(true);
    try {
      const result = await getUseCaseList();
      if (result.success) {
        const raw = result.data;
        const list = Array.isArray(raw)
          ? raw
          : (raw?.use_cases ?? raw?.list ?? raw?.data ?? []);
        setInspireUseCasesList(Array.isArray(list) ? list : []);
        setInspireDisplayCount(6);
        setShowPersonalizeModal(false);
        setActiveMode('inspire');
        setShowUseCases(true);
        setPersonalizeQuery('');
      } else {
        setInspireUseCasesError(result.error || 'Failed to load use cases');
      }
    } catch (err) {
      setInspireUseCasesError(err?.message || 'Failed to load use cases');
    } finally {
      setInspireUseCasesLoading(false);
    }
  };

  const inspireListToShow =
    inspireUseCasesList !== null
      ? inspireUseCasesList
      : Object.values(industryUseCases).flat();

  const inspireFilteredList = inspireListToShow.filter((uc) => {
    const name = (uc.name ?? uc.title ?? uc.use_case_name ?? '').toLowerCase();
    const desc = (uc.description ?? uc.desc ?? '').toLowerCase();
    const cat = (uc.category ?? uc.category_name ?? '').toLowerCase();
    const q = inspireSearchQuery.trim().toLowerCase();
    if (!q) return true;
    return name.includes(q) || desc.includes(q) || cat.includes(q);
  });

  const inspireDisplayedList = inspireFilteredList.slice(0, inspireDisplayCount);
  const totalCount = inspireFilteredList.length;
  const hasMore = inspireDisplayCount < totalCount;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />

      {/* Header */}
      <PageHeader 
        centerItems={useCasesHeaderLinks}
        activePath={location.pathname}
        zIndex="z-50"
      />

      {/* Hero */}
      <section className="pt-32 pb-12 relative z-10">
        <div className="mx-auto text-center px-4">
          {/* <div className="inline-block bg-[#46cdc6]/10 text-[#46cdc6] px-4 py-2 rounded-full text-xs font-medium border border-[#46cdc6]/20 shadow-sm mb-4">
            ✨ AI USE CASES LIBRARY
          </div> */}
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
          Build your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#46cdc6] to-[#15ae99]">business case bank</span>
          </h1>
          <p className="text-lg text-gray-600">Explore industry-specific AI implementations or create custom use cases for your organization.</p>
        </div>
      </section>

      {/* Mode Selection */}
      <section className="pb-8 relative z-10">
        <div className="mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div 
              onClick={() => {
                setShowPersonalizeModal(true);
              }}
              className={`cursor-pointer rounded-2xl p-5 border-2 transition-all ${
                activeMode === 'inspire' 
                  ? 'bg-[#46cdc6]/10 border-[#46cdc6] shadow-lg' 
                  : 'bg-white border-gray-200 hover:border-[#46cdc6]/50 hover:shadow'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  activeMode === 'inspire' 
                    ? 'bg-gradient-to-br from-[#46cdc6] to-[#15ae99]' 
                    : 'bg-[#46cdc6]/10'
                }`}>
                  <Sparkles className={`w-6 h-6 ${activeMode === 'inspire' ? 'text-white' : 'text-[#46cdc6]'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Inspire Me</h3>
                  <p className="text-gray-600 text-sm mb-2">Browse curated AI use cases</p>
                  <div className="flex items-center gap-1 text-[#46cdc6] font-medium text-sm">
                    <span>Explore</span><ChevronRight className="w-4 h-4" />
                  </div>
                </div>
            </div>
          </motion.div>

            <motion.div 
              onClick={() => setActiveMode('build')}
              className={`cursor-pointer rounded-2xl p-5 border-2 transition-all ${
                activeMode === 'build' 
                  ? 'bg-[#46cdc6]/10 border-[#46cdc6] shadow-lg' 
                  : 'bg-white border-gray-200 hover:border-[#46cdc6]/50 hover:shadow'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  activeMode === 'build' 
                    ? 'bg-gradient-to-br from-[#46cdc6] to-[#15ae99]' 
                    : 'bg-[#46cdc6]/10'
                }`}>
                  <PenTool className={`w-6 h-6 ${activeMode === 'build' ? 'text-white' : 'text-[#46cdc6]'}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">Build My Own</h3>
                  <p className="text-gray-600 text-sm mb-2">Create custom use cases for your needs</p>
                  <div className="flex items-center gap-1 text-[#46cdc6] font-medium text-sm">
                    <span>Start building</span><ChevronRight className="w-4 h-4" />
                  </div>
                </div>
                        </div>
                  </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      {activeMode && (
        <section className="pb-16 relative z-10">
          <div className="mx-auto px-4">
            {activeMode === 'inspire' && showUseCases ? (
              <div className="max-w-5xl mx-auto">
                {inspireUseCasesError && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    {inspireUseCasesError}
                  </div>
                )}

                {/* Search bar - reference style */}
                <section className="mb-12">
                  <div className="relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#2DD4BF] transition-colors pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Filter by industry or AI architecture..."
                      value={inspireSearchQuery}
                      onChange={(e) => setInspireSearchQuery(e.target.value)}
                      className="w-full pl-14 pr-24 py-5 bg-white border-2 border-slate-200 rounded-2xl focus:border-[#2DD4BF] focus:ring-0 transition-all text-lg font-medium outline-none shadow-xl shadow-slate-200/20"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                      <kbd className="hidden sm:inline-flex px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-400 border border-slate-200 tracking-tighter">
                        CMD + K
                      </kbd>
                    </div>
                  </div>
                </section>

                {/* Expandable use case list */}
                <div className="space-y-3">
                  {inspireDisplayedList.map((uc, index) => {
                    const cardKey = uc.id ?? uc.use_case_id ?? index;
                    const isExpanded = expandedInspireCardKey === cardKey;
                    const name = uc.name ?? uc.title ?? uc.use_case_name ?? 'Untitled';
                    const description = uc.description ?? uc.desc ?? '';
                    const category = uc.category ?? uc.category_name ?? '';
                    const impact = uc.impact ?? 'Medium';
                    const feasibility = uc.feasibility ?? 'Medium';
                    const impactPct = impact === 'High' ? 84 : impact === 'Medium' ? 55 : 31;
                    const tagVariant = index % 3;
                    const accentTagClass = tagVariant === 0 ? 'bg-[#2DD4BF]/10 text-[#2DD4BF]' : tagVariant === 1 ? 'bg-[#8B5CF6]/10 text-[#8B5CF6]' : 'bg-[#FF914D]/10 text-[#FF914D]';
                    const accentTagLabel = tagVariant === 0 ? 'NLP' : tagVariant === 1 ? 'Agentic AI' : 'Predictive';
                    return (
                      <motion.div
                        key={cardKey}
                        layout
                        initial={false}
                        transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                        className={`use-case-item group bg-white border-2 p-6 rounded-2xl transition-all cursor-pointer shadow-sm ${
                          isExpanded ? 'border-[#2DD4BF] shadow-lg' : 'border-slate-100 hover:border-slate-200 hover:translate-y-[-4px]'
                        }`}
                        onClick={() => setExpandedInspireCardKey(isExpanded ? null : cardKey)}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 md:gap-6 min-w-0">
                            <span className="text-xs font-mono text-slate-400 tracking-tighter flex-shrink-0">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <h3 className="font-bold text-xl md:text-2xl text-slate-900 truncate">
                              {name}
                            </h3>
                            <div className="hidden md:flex gap-2 flex-shrink-0">
                              <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                                {(category || 'Use Case').toUpperCase().slice(0, 12)}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${accentTagClass}`}>
                                {accentTagLabel}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isExpanded ? 'text-[#2DD4BF] rotate-45' : 'text-slate-300 group-hover:text-[#2DD4BF]'
                            }`}
                          >
                            <Plus className="w-6 h-6" strokeWidth={2.5} />
                          </span>
                        </div>

                        {/* Bento content - expand/collapse animation */}
                        <motion.div
                          initial={false}
                          animate={{
                            height: isExpanded ? 'auto' : 0,
                            opacity: isExpanded ? 1 : 0,
                            marginTop: isExpanded ? 24 : 0,
                          }}
                          transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                              <h4 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-widest">Description</h4>
                              <p className="text-slate-600 leading-relaxed text-sm">
                                {description || 'No description available for this use case.'}
                              </p>
                            </div>
                            <div
                              className="p-6 rounded-xl border flex flex-col justify-between"
                              style={{ backgroundColor: 'rgba(45, 212, 191, 0.05)', borderColor: 'rgba(45, 212, 191, 0.2)' }}
                            >
                              <h4 className="text-xs font-bold uppercase mb-3 tracking-widest" style={{ color: '#2DD4BF' }}>
                                Impact / Efficiency
                              </h4>
                              <div className="text-4xl font-bold" style={{ color: '#2DD4BF' }}>
                                +{impactPct}%
                              </div>
                              <div className="h-1.5 w-full rounded-full mt-4 overflow-hidden bg-[#2DD4BF]/20">
                                <motion.div
                                  className="h-full rounded-full bg-[#2DD4BF]"
                                  initial={{ width: 0 }}
                                  animate={{ width: isExpanded ? `${impactPct}%` : 0 }}
                                  transition={{ duration: 0.6, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Footer: Reached end + Fetch More + Trust line */}
                <div className="mt-20 border-t-2 border-slate-100 pt-12 flex flex-col items-center gap-8">
                  <div className="flex flex-col items-center text-center">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
                      Reached the end of current view
                    </p>
                    {hasMore ? (
                      <motion.button
                        type="button"
                        onClick={() => setInspireDisplayCount((c) => Math.min(c + 6, totalCount))}
                        className="group relative px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-xl overflow-hidden hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          Fetch more data
                          <ChevronDown className="w-5 h-5" />
                        </span>
                        <div className="absolute inset-0 bg-[#2DD4BF] opacity-0 group-hover:opacity-10 transition-opacity" />
                      </motion.button>
                    ) : (
                      <p className="text-sm text-slate-500">
                        Showing {inspireDisplayedList.length} of {totalCount} total use cases
                      </p>
                    )}
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="flex -space-x-3">
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-[#8B5CF6]/20 flex items-center justify-center text-[10px] font-bold text-[#8B5CF6]">JS</div>
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-[#2DD4BF]/20 flex items-center justify-center text-[10px] font-bold text-[#2DD4BF]">PY</div>
                      <div className="w-10 h-10 rounded-full border-2 border-white bg-[#FF914D]/20 flex items-center justify-center text-[10px] font-bold text-[#FF914D]">RS</div>
                    </div>
                    <p className="text-xs font-medium text-slate-400 max-w-[180px] leading-tight">
                      Trusted by 2,400+ developers worldwide.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sticky top-20">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-semibold text-gray-900">My Use Cases</h3>
                      <span className="bg-[#46cdc6]/10 text-[#15ae99] px-2 py-0.5 rounded-full text-xs font-medium">
                        {customUseCases.length}
                      </span>
                    </div>
                    <button 
                      onClick={() => {
                        setFormData(emptyUseCase);
                        setIsFormOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-[#46cdc6] to-[#15ae99] text-white font-medium hover:shadow-lg transition-all mb-3"
                    >
                      <Plus className="w-5 h-5" /> New Use Case
                    </button>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {customUseCases.length === 0 ? (
                        <div className="text-center py-6 text-gray-400">
                          <PenTool className="w-6 h-6 mx-auto mb-1 opacity-50" />
                          <p className="text-xs">No use cases yet</p>
                        </div>
                      ) : customUseCases.map((uc) => {
                        const isPrivate = (uc.visibility || 'private') === 'private';
                        return (
                        <div 
                          key={uc.id} 
                            onClick={() => handleEditUseCase(uc)}
                            className={`p-3 rounded-xl cursor-pointer transition-all ${
                              isPrivate 
                                ? 'bg-gray-200 hover:bg-gray-300' 
                                : 'bg-[#46cdc6]/10 hover:bg-[#46cdc6]/20'
                            }`}
                        >
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-medium text-gray-900 text-sm truncate flex-1">{uc.useCaseName || 'Untitled'}</h4>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${
                                isPrivate
                                  ? 'bg-gray-700 text-white'
                                  : 'bg-[#46cdc6] text-white'
                              }`}>
                                {isPrivate ? 'Private' : 'Public'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {isPrivate ? (
                                <Lock className="w-3 h-3 text-gray-600" />
                              ) : (
                                <Globe className="w-3 h-3 text-[#46cdc6]" />
                              )}
                          <p className="text-xs text-gray-500">{uc.category || 'Uncategorized'}</p>
                        </div>
                          </div>
                        );
                      })}
                    </div>
        </div>
      </div>

                {/* Form / Empty State */}
                <div className="lg:col-span-3">
                  {isFormOpen ? (
                    <div className={`rounded-2xl shadow-sm border-2 p-6 use-case-form transition-all duration-300 ${
                      formData.visibility === 'public' 
                        ? 'bg-gradient-to-br from-[#46cdc6]/5 to-[#15ae99]/5 border-[#46cdc6]' 
                        : 'bg-gray-800 border-gray-600'
                    }`}>
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                          {formData.visibility === 'public' ? (
                            <Globe className="w-5 h-5 text-[#46cdc6]" />
                          ) : (
                            <Lock className="w-5 h-5 text-gray-300" />
                          )}
                          <div>
                            <h3 className={`text-lg font-bold ${formData.visibility === 'private' ? 'text-white' : 'text-gray-900'}`}>
                              {formData.useCaseName ? formData.useCaseName : 'Create New Use Case'}
                            </h3>
                            <p className={`text-xs mt-0.5 ${formData.visibility === 'private' ? 'text-gray-300' : 'text-gray-600'}`}>
                              {formData.visibility === 'public' ? 'Public - Share in "Inspire Me" pool for all companies to see' : 'Private - Only your company'}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setIsFormOpen(false)} 
                          className={`p-2 rounded-lg ${formData.visibility === 'private' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                        >
                          <X className={`w-5 h-5 ${formData.visibility === 'private' ? 'text-gray-300' : 'text-gray-500'}`} />
                        </button>
                      </div>
                      <div className="space-y-4">
                        {/* Visibility Selection - Toggle */}
                        <div>
                          <label className={`block text-sm font-semibold mb-3 ${formData.visibility === 'private' ? 'text-white' : 'text-gray-900'}`}>Visibility</label>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Lock className={`w-4 h-4 ${formData.visibility === 'private' ? 'text-gray-300' : 'text-gray-500'}`} />
                              <span className={`text-sm font-medium ${formData.visibility === 'private' ? 'text-white' : 'text-gray-600'}`}>Private</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={formData.visibility === 'public'}
                                onChange={(e) => handleFormChange('visibility', e.target.checked ? 'public' : 'private')}
                              />
                              <div className={`w-14 h-7 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#46cdc6] transition-all duration-300 ${
                                formData.visibility === 'public'
                                  ? 'bg-gradient-to-r from-[#15ae99] to-[#46cdc6]'
                                  : formData.visibility === 'private'
                                    ? 'bg-gray-600'
                                    : 'bg-gray-300'
                              }`}>
                                <div className={`absolute top-[2px] left-[2px] bg-white rounded-full h-6 w-6 transition-all duration-300 ${
                                  formData.visibility === 'public' ? 'translate-x-7' : 'translate-x-0'
                                }`}></div>
                              </div>
                            </label>
                            <div className="flex items-center gap-2">
                              <Globe className={`w-4 h-4 ${formData.visibility === 'public' ? 'text-[#46cdc6]' : 'text-gray-500'}`} />
                              <span className={`text-sm font-medium ${formData.visibility === 'public' ? 'text-[#46cdc6]' : 'text-gray-600'}`}>Public</span>
                            </div>
                          </div>
                          <p className={`text-xs mt-2 ${formData.visibility === 'private' ? 'text-gray-300' : 'text-gray-600'}`}>
                            {formData.visibility === 'private' 
                              ? 'Keep this use case private to your company only' 
                              : 'Share in "Inspire Me" pool for all companies to see'}
                          </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className={`block text-sm font-medium mb-1 ${formData.visibility === 'private' ? 'text-gray-200' : 'text-gray-700'}`}>Use Case ID</label>
                            <input 
                              type="text" 
                              value={formData.useCaseId} 
                              onChange={(e) => handleFormChange('useCaseId', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm ${
                                formData.visibility === 'private' 
                                  ? 'bg-gray-700 text-white placeholder:text-gray-400 border border-gray-600' 
                                  : 'bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300'
                              }`}
                              placeholder="UC-001"
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-medium mb-1 ${formData.visibility === 'private' ? 'text-gray-200' : 'text-gray-700'}`}>Use Case Name *</label>
                            <input 
                              type="text" 
                              value={formData.useCaseName} 
                              onChange={(e) => handleFormChange('useCaseName', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm ${
                                formData.visibility === 'private' 
                                  ? 'bg-gray-700 text-white placeholder:text-gray-400 border border-gray-600' 
                                  : 'bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300'
                              }`}
                              placeholder="Enter name" 
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-medium mb-1 ${formData.visibility === 'private' ? 'text-gray-200' : 'text-gray-700'}`}>Process Owner</label>
                            <input 
                              type="text" 
                              value={formData.processOwner} 
                              onChange={(e) => handleFormChange('processOwner', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm ${
                                formData.visibility === 'private' 
                                  ? 'bg-gray-700 text-white placeholder:text-gray-400 border border-gray-600' 
                                  : 'bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300'
                              }`}
                              placeholder="John Doe" 
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-medium mb-1 ${formData.visibility === 'private' ? 'text-gray-200' : 'text-gray-700'}`}>Last Updated By</label>
                            <input 
                              type="text" 
                              value={formData.lastUpdatedBy} 
                              onChange={(e) => handleFormChange('lastUpdatedBy', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm ${
                                formData.visibility === 'private' 
                                  ? 'bg-gray-700 text-white placeholder:text-gray-400 border border-gray-600' 
                                  : 'bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300'
                              }`}
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-medium mb-1 ${formData.visibility === 'private' ? 'text-gray-200' : 'text-gray-700'}`}>Date Created</label>
                            <input 
                              type="date" 
                              value={formData.dateCreated} 
                              onChange={(e) => handleFormChange('dateCreated', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm ${
                                formData.visibility === 'private' 
                                  ? 'bg-gray-700 text-white placeholder:text-gray-400 border border-gray-600' 
                                  : 'bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300'
                              }`}
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-medium mb-1 ${formData.visibility === 'private' ? 'text-gray-200' : 'text-gray-700'}`}>Date Last Updated</label>
                            <input 
                              type="date" 
                              value={formData.dateLastUpdated} 
                              onChange={(e) => handleFormChange('dateLastUpdated', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm ${
                                formData.visibility === 'private' 
                                  ? 'bg-gray-700 text-white placeholder:text-gray-400 border border-gray-600' 
                                  : 'bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300'
                              }`}
                            />
                          </div>
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${formData.visibility === 'private' ? 'text-gray-200' : 'text-gray-700'}`}>Business Use</label>
                          <input 
                            type="text" 
                            value={formData.businessUse} 
                            onChange={(e) => handleFormChange('businessUse', e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm ${
                              formData.visibility === 'private' 
                                ? 'bg-gray-700 text-white placeholder:text-gray-400 border border-gray-600' 
                                : 'bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300'
                            }`}
                            placeholder="Primary business use" 
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${formData.visibility === 'private' ? 'text-gray-200' : 'text-gray-700'}`}>Description *</label>
                          <textarea 
                            value={formData.description} 
                            onChange={(e) => handleFormChange('description', e.target.value)} 
                            rows={2}
                            className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm ${
                              formData.visibility === 'private' 
                                ? 'bg-gray-700 text-white placeholder:text-gray-400 border border-gray-600' 
                                : 'bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300'
                            }`}
                            placeholder="Detailed description" 
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className={`block text-sm font-medium mb-1 ${formData.visibility === 'private' ? 'text-gray-200' : 'text-gray-700'}`}>Preconditions</label>
                            <textarea 
                              value={formData.preconditions} 
                              onChange={(e) => handleFormChange('preconditions', e.target.value)} 
                              rows={2}
                              className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm ${
                                formData.visibility === 'private' 
                                  ? 'bg-gray-700 text-white placeholder:text-gray-400 border border-gray-600' 
                                  : 'bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300'
                              }`}
                              placeholder="Required conditions" 
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-medium mb-1 ${formData.visibility === 'private' ? 'text-gray-200' : 'text-gray-700'}`}>Postconditions</label>
                            <textarea 
                              value={formData.postconditions} 
                              onChange={(e) => handleFormChange('postconditions', e.target.value)} 
                              rows={2}
                              className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm ${
                                formData.visibility === 'private' 
                                  ? 'bg-gray-700 text-white placeholder:text-gray-400 border border-gray-600' 
                                  : 'bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300'
                              }`}
                              placeholder="Expected state after" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${formData.visibility === 'private' ? 'text-gray-200' : 'text-gray-700'}`}>Performance Goal</label>
                          <input 
                            type="text" 
                            value={formData.performanceGoal} 
                            onChange={(e) => handleFormChange('performanceGoal', e.target.value)}
                            className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm ${
                              formData.visibility === 'private' 
                                ? 'bg-gray-700 text-white placeholder:text-gray-400 border border-gray-600' 
                                : 'bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300'
                            }`}
                            placeholder="e.g., Reduce time by 50%" 
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${formData.visibility === 'private' ? 'text-gray-200' : 'text-gray-700'}`}>Basic Workflow</label>
                          <textarea 
                            value={formData.basicWorkflow} 
                            onChange={(e) => handleFormChange('basicWorkflow', e.target.value)} 
                            rows={2}
                            className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm ${
                              formData.visibility === 'private' 
                                ? 'bg-gray-700 text-white placeholder:text-gray-400 border border-gray-600' 
                                : 'bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300'
                            }`}
                            placeholder="Step-by-step workflow" 
                          />
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${formData.visibility === 'private' ? 'text-gray-200' : 'text-gray-700'}`}>Alternative Workflow</label>
                          <textarea 
                            value={formData.alternativeWorkflow} 
                            onChange={(e) => handleFormChange('alternativeWorkflow', e.target.value)} 
                            rows={2}
                            className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm ${
                              formData.visibility === 'private' 
                                ? 'bg-gray-700 text-white placeholder:text-gray-400 border border-gray-600' 
                                : 'bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300'
                            }`}
                            placeholder="Alternative approach" 
                          />
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className={`block text-sm font-medium mb-1 ${formData.visibility === 'private' ? 'text-gray-200' : 'text-gray-700'}`}>Category</label>
                            <input 
                              type="text" 
                              value={formData.category} 
                              onChange={(e) => handleFormChange('category', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm ${
                                formData.visibility === 'private' 
                                  ? 'bg-gray-700 text-white placeholder:text-gray-400 border border-gray-600' 
                                  : 'bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300'
                              }`}
                              placeholder="Operations" 
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-medium mb-1 ${formData.visibility === 'private' ? 'text-gray-200' : 'text-gray-700'}`}>Risks</label>
                            <input 
                              type="text" 
                              value={formData.risks} 
                              onChange={(e) => handleFormChange('risks', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm ${
                                formData.visibility === 'private' 
                                  ? 'bg-gray-700 text-white placeholder:text-gray-400 border border-gray-600' 
                                  : 'bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300'
                              }`}
                              placeholder="Potential risks" 
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-medium mb-1 ${formData.visibility === 'private' ? 'text-gray-200' : 'text-gray-700'}`}>Possibilities</label>
                            <input 
                              type="text" 
                              value={formData.possibilities} 
                              onChange={(e) => handleFormChange('possibilities', e.target.value)}
                              className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm ${
                                formData.visibility === 'private' 
                                  ? 'bg-gray-700 text-white placeholder:text-gray-400 border border-gray-600' 
                                  : 'bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300'
                              }`}
                              placeholder="Opportunities" 
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-4 border-t">
                          <button 
                            onClick={() => setIsFormOpen(false)} 
                            className="px-5 py-2 text-gray-600 hover:text-gray-800 font-medium"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={handleSaveUseCase} 
                            className="px-5 py-2 bg-gradient-to-r from-[#46cdc6] to-[#15ae99] text-white rounded-lg font-semibold hover:shadow-lg flex items-center gap-2"
                          >
                            <Save className="w-4 h-4" /> Save
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                      <div className="w-16 h-16 bg-[#46cdc6]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <PenTool className="w-8 h-8 text-[#46cdc6]" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Create Your First Use Case</h3>
                      <p className="text-gray-600 max-w-md mx-auto mb-6">
                        Document AI initiatives with our structured template. Track progress and identify opportunities.
                      </p>
                      <button 
                        onClick={() => setIsFormOpen(true)}
                        className="px-6 py-3 bg-gradient-to-r from-[#46cdc6] to-[#15ae99] text-white rounded-xl font-semibold hover:shadow-lg inline-flex items-center gap-2"
                      >
                        <Plus className="w-5 h-5" /> Create Use Case
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Modal for Inspire Me Use Case Details */}
      {selectedUseCase && selectedUseCase.name && (
        <motion.div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedUseCase(null)}
        >
          <motion.div 
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedUseCase.impact === 'High' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedUseCase.impact} Impact
                  </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedUseCase.feasibility === 'High' 
                        ? 'bg-blue-100 text-blue-700' 
                        : selectedUseCase.feasibility === 'Medium'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {selectedUseCase.feasibility} Feasibility
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mt-2">{selectedUseCase.name}</h3>
                </div>
                <button 
                  onClick={() => setSelectedUseCase(null)} 
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <p className="text-gray-600 mb-4">{selectedUseCase.description}</p>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-600">
                  {selectedUseCase.category}
                </span>
              </div>
              <div className="bg-[#46cdc6]/10 rounded-xl p-4 mb-4 border border-[#46cdc6]/20">
                <h4 className="text-sm font-semibold text-[#46cdc6] mb-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Key Benefits
                </h4>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-[#46cdc6]" /> Improved efficiency
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-[#46cdc6]" /> Data-driven decisions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-[#46cdc6]" /> Scalable implementation
                  </li>
                </ul>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedUseCase(null)} 
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50"
                >
                  Close
                </button>
                <button 
                  onClick={() => useAsTemplate(selectedUseCase)} 
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#46cdc6] to-[#15ae99] text-white rounded-xl font-semibold hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Use Template
                </button>
                  </div>
                  </div>
            </motion.div>
          </motion.div>
        )}

      {/* Personalize Use Cases Modal */}
      <AnimatePresence>
        {showPersonalizeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowPersonalizeModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">Personalize Your Use Cases</h3>
                  <p className="text-slate-600">Tell us what you're looking for and we'll show you the most relevant AI use cases.</p>
                </div>
                <button
                  onClick={() => setShowPersonalizeModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-6">
                <div>
                  <label className="block font-semibold text-slate-900 mb-3">What are you looking for?</label>
                  <textarea
                    placeholder="e.g., improving patient diagnosis, reducing operational costs, automating customer support..."
                    value={personalizeQuery}
                    onChange={(e) => setPersonalizeQuery(e.target.value)}
                    className="w-full px-5 py-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#46CDCF] focus:border-transparent text-slate-900 placeholder:text-slate-400 min-h-[120px] resize-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={handleSkipAndShowAll}
                  disabled={inspireUseCasesLoading}
                  className="px-6 py-2.5 rounded-xl border-2 text-slate-700 hover:bg-slate-50"
                >
                  {inspireUseCasesLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Loading…
                    </>
                  ) : (
                    'Skip & Show All'
                  )}
                </Button>
                <Button
                  onClick={() => {
                    // For now, just show all use cases (backend logic will be implemented later)
                    setShowPersonalizeModal(false);
                    setActiveMode('inspire');
                    setShowUseCases(true);
                    // In future: filter use cases based on personalizeQuery
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#46CDCF] hover:bg-[#15ae99] text-white shadow-lg shadow-[#46CDCF]/20"
                >
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
