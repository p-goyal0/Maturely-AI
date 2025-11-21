import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { motion } from "motion/react";
import { ChevronRight, Sparkles, PenTool, Plus, Save, Building2, Zap, TrendingUp, Shield, CheckCircle2, X, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';

const industryUseCases = {
  healthcare: [
    { id: 1, name: "AI-Powered Diagnostics", description: "Automated medical image analysis for faster diagnosis", category: "Clinical Operations", impact: "High" },
    { id: 2, name: "Patient Flow Optimization", description: "Predictive analytics for hospital bed management", category: "Operations", impact: "Medium" },
    { id: 3, name: "Drug Interaction Checker", description: "AI system to identify potential medication conflicts", category: "Patient Safety", impact: "High" },
  ],
  finance: [
    { id: 1, name: "Fraud Detection System", description: "Real-time transaction monitoring using ML models", category: "Risk Management", impact: "High" },
    { id: 2, name: "Automated Underwriting", description: "AI-driven loan approval process", category: "Operations", impact: "High" },
    { id: 3, name: "Customer Churn Prediction", description: "Identify at-risk customers before they leave", category: "Customer Retention", impact: "Medium" },
  ],
  retail: [
    { id: 1, name: "Demand Forecasting", description: "ML-based inventory optimization", category: "Supply Chain", impact: "High" },
    { id: 2, name: "Personalized Recommendations", description: "AI-powered product suggestions", category: "Customer Experience", impact: "High" },
    { id: 3, name: "Dynamic Pricing Engine", description: "Real-time price optimization based on market conditions", category: "Revenue", impact: "Medium" },
  ],
  manufacturing: [
    { id: 1, name: "Predictive Maintenance", description: "AI-driven equipment failure prediction", category: "Operations", impact: "High" },
    { id: 2, name: "Quality Control Automation", description: "Computer vision for defect detection", category: "Quality", impact: "High" },
    { id: 3, name: "Supply Chain Optimization", description: "ML-based supplier and logistics management", category: "Supply Chain", impact: "Medium" },
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
};

export function UseCaseLibrary() {
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeMode, setActiveMode] = useState(null);
  const [selectedIndustry, setSelectedIndustry] = useState('healthcare');
  const [selectedUseCase, setSelectedUseCase] = useState(null);
  const [customUseCases, setCustomUseCases] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState(emptyUseCase);

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

  const handleFormChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const handleSaveUseCase = () => {
    if (formData.useCaseName && formData.description) {
      setCustomUseCases(prev => [...prev, { ...formData, id: Date.now() }]);
      setFormData(emptyUseCase);
      setIsFormOpen(false);
    }
  };

  const useAsTemplate = (uc) => {
    setActiveMode('build');
    setFormData({ ...emptyUseCase, useCaseName: uc.name, description: uc.description, category: uc.category });
    setIsFormOpen(true);
    setSelectedUseCase(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />

      {/* Header */}
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

              {/* Center - Navigation */}
              <div className="flex items-center gap-6">
                <button
                  onClick={() => navigate("/industry")}
                  className="text-sm text-slate-700 hover:text-cyan-600 transition-colors font-medium"
                >
                  Industry
                </button>
                <button
                  onClick={() => navigate("/assessments")}
                  className="text-sm text-slate-700 hover:text-cyan-600 transition-colors font-medium"
                >
                  Assessment
                </button>
                <span className="text-sm text-cyan-600 font-semibold">Use Cases</span>
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

      {/* Hero */}
      <section className="pt-32 pb-12 relative z-10">
        <div className="mx-auto text-center px-4">
          <div className="inline-block bg-[#46cdc6]/10 text-[#46cdc6] px-4 py-2 rounded-full text-xs font-medium border border-[#46cdc6]/20 shadow-sm mb-4">
            ✨ AI USE CASES LIBRARY
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Discover & Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#46cdc6] to-[#15ae99]">AI Use Cases</span>
          </h1>
          <p className="text-lg text-gray-600">Explore industry-specific AI implementations or create custom use cases for your organization.</p>
        </div>
      </section>

      {/* Mode Selection */}
      <section className="pb-8 relative z-10">
        <div className="mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div 
              onClick={() => setActiveMode('inspire')}
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
                  <p className="text-gray-600 text-sm mb-2">Browse curated AI use cases by industry</p>
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
            {activeMode === 'inspire' ? (
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Industry Sidebar */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sticky top-20">
                    <h3 className="text-base font-semibold text-gray-900 mb-3">Select Industry</h3>
                    <div className="space-y-2">
                      {industries.map((ind) => {
                        const Icon = ind.icon;
                        return (
                          <button 
                            key={ind.id} 
                            onClick={() => setSelectedIndustry(ind.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                              selectedIndustry === ind.id 
                                ? 'bg-gradient-to-r from-[#46cdc6] to-[#15ae99] text-white shadow' 
                                : 'bg-gray-50 text-gray-700 hover:bg-[#46cdc6]/10'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium text-sm">{ind.name}</span>
                          </button>
                );
              })}
                    </div>
                  </div>
            </div>

                {/* Use Cases Grid */}
                <div className="lg:col-span-3">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                        {industries.find(i => i.id === selectedIndustry)?.name} Use Cases
                      </h3>
                      <span className="text-sm text-gray-500">
                        {industryUseCases[selectedIndustry]?.length} available
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {industryUseCases[selectedIndustry]?.map((uc) => (
                        <motion.div 
                          key={uc.id} 
                          onClick={() => setSelectedUseCase(uc)}
                          className="cursor-pointer bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-[#46cdc6] hover:shadow-md transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            uc.impact === 'High' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {uc.impact} Impact
                          </span>
                          <h4 className="font-semibold text-gray-900 mt-2 mb-1">{uc.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{uc.description}</p>
                          <span className="px-2 py-1 bg-white rounded text-xs text-gray-500">{uc.category}</span>
          </motion.div>
                      ))}
                    </div>
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
                      onClick={() => setIsFormOpen(true)}
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
                      ) : customUseCases.map((uc) => (
                        <div 
                          key={uc.id} 
                          className="p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-[#46cdc6]/10"
                        >
                          <h4 className="font-medium text-gray-900 text-sm truncate">{uc.useCaseName}</h4>
                          <p className="text-xs text-gray-500">{uc.category || 'Uncategorized'}</p>
                        </div>
                      ))}
                    </div>
        </div>
      </div>

                {/* Form / Empty State */}
                <div className="lg:col-span-3">
                  {isFormOpen ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 use-case-form">
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="text-lg font-bold text-gray-900">Business Use Case Description</h3>
                        <button 
                          onClick={() => setIsFormOpen(false)} 
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          <X className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Use Case ID</label>
                            <input 
                              type="text" 
                              value={formData.useCaseId} 
                              onChange={(e) => handleFormChange('useCaseId', e.target.value)}
                              className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm" 
                              placeholder="UC-001"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Use Case Name *</label>
                            <input 
                              type="text" 
                              value={formData.useCaseName} 
                              onChange={(e) => handleFormChange('useCaseName', e.target.value)}
                              className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm" 
                              placeholder="Enter name" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Process Owner</label>
                            <input 
                              type="text" 
                              value={formData.processOwner} 
                              onChange={(e) => handleFormChange('processOwner', e.target.value)}
                              className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm" 
                              placeholder="John Doe" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated By</label>
                            <input 
                              type="text" 
                              value={formData.lastUpdatedBy} 
                              onChange={(e) => handleFormChange('lastUpdatedBy', e.target.value)}
                              className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date Created</label>
                            <input 
                              type="date" 
                              value={formData.dateCreated} 
                              onChange={(e) => handleFormChange('dateCreated', e.target.value)}
                              className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date Last Updated</label>
                            <input 
                              type="date" 
                              value={formData.dateLastUpdated} 
                              onChange={(e) => handleFormChange('dateLastUpdated', e.target.value)}
                              className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Business Use</label>
                          <input 
                            type="text" 
                            value={formData.businessUse} 
                            onChange={(e) => handleFormChange('businessUse', e.target.value)}
                            className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm" 
                            placeholder="Primary business use" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                          <textarea 
                            value={formData.description} 
                            onChange={(e) => handleFormChange('description', e.target.value)} 
                            rows={2}
                            className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm" 
                            placeholder="Detailed description" 
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Preconditions</label>
                            <textarea 
                              value={formData.preconditions} 
                              onChange={(e) => handleFormChange('preconditions', e.target.value)} 
                              rows={2}
                              className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm" 
                              placeholder="Required conditions" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Postconditions</label>
                            <textarea 
                              value={formData.postconditions} 
                              onChange={(e) => handleFormChange('postconditions', e.target.value)} 
                              rows={2}
                              className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm" 
                              placeholder="Expected state after" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Performance Goal</label>
                          <input 
                            type="text" 
                            value={formData.performanceGoal} 
                            onChange={(e) => handleFormChange('performanceGoal', e.target.value)}
                            className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm" 
                            placeholder="e.g., Reduce time by 50%" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Basic Workflow</label>
                          <textarea 
                            value={formData.basicWorkflow} 
                            onChange={(e) => handleFormChange('basicWorkflow', e.target.value)} 
                            rows={2}
                            className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm" 
                            placeholder="Step-by-step workflow" 
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Alternative Workflow</label>
                          <textarea 
                            value={formData.alternativeWorkflow} 
                            onChange={(e) => handleFormChange('alternativeWorkflow', e.target.value)} 
                            rows={2}
                            className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm" 
                            placeholder="Alternative approach" 
                          />
                        </div>
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <input 
                              type="text" 
                              value={formData.category} 
                              onChange={(e) => handleFormChange('category', e.target.value)}
                              className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm" 
                              placeholder="Operations" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Risks</label>
                            <input 
                              type="text" 
                              value={formData.risks} 
                              onChange={(e) => handleFormChange('risks', e.target.value)}
                              className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm" 
                              placeholder="Potential risks" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Possibilities</label>
                            <input 
                              type="text" 
                              value={formData.possibilities} 
                              onChange={(e) => handleFormChange('possibilities', e.target.value)}
                              className="w-full px-3 py-2 bg-white text-gray-900 placeholder:text-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#46cdc6] focus:outline-none text-sm" 
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
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedUseCase.impact === 'High' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedUseCase.impact} Impact
                  </span>
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
    </div>
  );
}
