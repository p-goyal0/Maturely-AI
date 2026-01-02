import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Sparkles, PenTool, Plus, Save, Building2, Zap, TrendingUp, Shield, CheckCircle2, X, Lock, Globe } from 'lucide-react';
import { PageHeader } from '../shared/PageHeader';
import { Button } from '../ui/button';

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

export function UseCaseLibrary() {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState(null);
  const [selectedUseCase, setSelectedUseCase] = useState(null);
  const [customUseCases, setCustomUseCases] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState(emptyUseCase);
  const [showPersonalizeModal, setShowPersonalizeModal] = useState(false);
  const [personalizeQuery, setPersonalizeQuery] = useState('');
  const [showUseCases, setShowUseCases] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />

      {/* Header */}
      <PageHeader 
        centerItems={[
          { label: "Home", path: "/offerings" }
        ]}
        activePath="/usecases"
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
              <div>
                {/* Use Cases Grid - All Mixed */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">
                      All Use Cases
                      </h3>
                      <span className="text-sm text-gray-500">
                      {Object.values(industryUseCases).flat().length} available
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.values(industryUseCases).flat().map((uc, index) => (
                        <motion.div 
                          key={`${uc.id}-${index}`} 
                          onClick={() => setSelectedUseCase(uc)}
                          className="cursor-pointer bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-[#46cdc6] hover:shadow-md transition-all"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            uc.impact === 'High' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {uc.impact} Impact
                          </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              uc.feasibility === 'High' 
                                ? 'bg-blue-100 text-blue-700' 
                                : uc.feasibility === 'Medium'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {uc.feasibility} Feasibility
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mt-2 mb-1">{uc.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{uc.description}</p>
                          <span className="px-2 py-1 bg-white rounded text-xs text-gray-500">{uc.category}</span>
          </motion.div>
                      ))}
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
                        {/* Visibility Selection */}
                        <div>
                          <label className={`block text-sm font-semibold mb-3 ${formData.visibility === 'private' ? 'text-white' : 'text-gray-900'}`}>Visibility</label>
                          <div className="grid grid-cols-2 gap-4">
                            <button
                              type="button"
                              onClick={() => handleFormChange('visibility', 'private')}
                              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                                formData.visibility === 'private'
                                  ? 'bg-gray-700 border-gray-500 shadow-md'
                                  : 'bg-white border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <Lock className={`w-5 h-5 ${formData.visibility === 'private' ? 'text-gray-200' : 'text-gray-500'}`} />
                                <span className={`font-bold ${formData.visibility === 'private' ? 'text-white' : 'text-gray-700'}`}>Private</span>
                              </div>
                              <p className={`text-xs ${formData.visibility === 'private' ? 'text-gray-300' : 'text-gray-600'}`}>Keep this use case private to your company only</p>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleFormChange('visibility', 'public')}
                              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                                formData.visibility === 'public'
                                  ? 'bg-[#46cdc6]/20 border-[#46cdc6] shadow-md'
                                  : 'bg-white border-gray-200 hover:border-[#46cdc6]/30'
                              }`}
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <Globe className={`w-5 h-5 ${formData.visibility === 'public' ? 'text-[#46cdc6]' : 'text-gray-500'}`} />
                                <span className={`font-bold ${formData.visibility === 'public' ? 'text-[#46cdc6]' : 'text-gray-700'}`}>Public</span>
                              </div>
                              <p className="text-xs text-gray-600">Share in 'Inspire Me' pool for all companies to see</p>
                            </button>
                          </div>
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
                  onClick={() => {
                    setShowPersonalizeModal(false);
                    setActiveMode('inspire');
                    setShowUseCases(true);
                    setPersonalizeQuery('');
                  }}
                  className="px-6 py-2.5 rounded-xl border-2 text-slate-700 hover:bg-slate-50"
                >
                  Skip & Show All
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
