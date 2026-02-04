import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ClipboardList, Sparkles, ArrowUpRight, AlertCircle, Loader2, Plus, Clock, CheckCircle2, Calendar, FileText } from 'lucide-react';
import { PageHeader } from '../shared/PageHeader';
import { SignInLoader } from '../shared/SignInLoader';
import { DeleteButton } from '../ui/DeleteButton';
import { getOrganizationAssessmentsOngoing, startAssessment } from '../../services/assessmentService';
import { useAssessmentStore } from '../../stores/assessmentStore';
import { useAuthStore } from '../../stores/authStore';

/**
 * Format ISO date string for display
 */
function formatStartedAt(isoString) {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return isoString;
  }
}

/**
 * Assessment List page – shows ongoing assessments from API.
 * Route: /my-assessments
 */
const assessmentHeaderLinks = [
  { label: 'Home', path: '/offerings' },
  { label: 'Assessments', path: '/my-assessments' },
  { label: 'Results', path: '/completed-assessments' },
  { label: 'Use Cases', path: '/usecases' },
];

export function AssessmentListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAuthStore((state) => state.currentUser);
  const updateOngoingAssessmentId = useAuthStore((state) => state.updateOngoingAssessmentId);
  const { setAssessmentData, setError } = useAssessmentStore();

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState(null);
  const [activeAction, setActiveAction] = useState(null); // { type: 'start' } | { type: 'continue', assessmentId } | { type: 'edit', assessmentId }
  const [actionError, setActionError] = useState(null);
  const [hoveredDeleteCardId, setHoveredDeleteCardId] = useState(null); // when hovering Delete, don't show Continue active

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setListError(null);
    getOrganizationAssessmentsOngoing()
      .then((res) => {
        if (cancelled) return;
        if (res.success && Array.isArray(res.data)) {
          setAssessments(res.data);
        } else {
          setListError(res.error || 'Failed to load assessments');
          setAssessments([]);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setListError(err?.message || 'Failed to load assessments');
        setAssessments([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  /** Start new assessment (no assessment ID) */
  const handleStartNew = async () => {
    const maturityModelId = currentUser?.maturity_model_id;
    if (!maturityModelId) {
      setActionError('Maturity model not found. Please try again.');
      return;
    }
    setActionError(null);
    setError(null);
    setActiveAction({ type: 'start' });
    try {
      const result = await startAssessment(maturityModelId, null);
      if (result.success) {
        setAssessmentData(result.data);
        if (result.data?.assessment_id) {
          updateOngoingAssessmentId(result.data.assessment_id);
        }
        navigate('/assessments');
      } else {
        setActionError(result.error || 'Failed to start assessment. Please try again.');
      }
    } catch (err) {
      setActionError(err?.message || 'An unexpected error occurred.');
    } finally {
      setActiveAction(null);
    }
  };

  /** Continue in-progress assessment (with assessment ID) */
  const handleContinue = async (assessment) => {
    const maturityModelId = currentUser?.maturity_model_id || assessment?.model?.id;
    if (!maturityModelId) {
      setActionError('Maturity model not found. Please try again.');
      return;
    }
    setActionError(null);
    setError(null);
    setActiveAction({ type: 'continue', assessmentId: assessment.id });
    try {
      const result = await startAssessment(maturityModelId, assessment.id, { editMode: false });
      if (result.success) {
        setAssessmentData(result.data);
        navigate('/assessments');
      } else {
        setActionError(result.error || 'Failed to continue assessment.');
      }
    } catch (err) {
      setActionError(err?.message || 'An unexpected error occurred.');
    } finally {
      setActiveAction(null);
    }
  };

  /** Edit completed assessment – calls start API with edit=true */
  const handleEditAssessment = async (assessment) => {
    const maturityModelId = currentUser?.maturity_model_id || assessment?.model?.id;
    if (!maturityModelId) {
      setActionError('Maturity model not found. Please try again.');
      return;
    }
    setActionError(null);
    setError(null);
    setActiveAction({ type: 'edit', assessmentId: assessment.id });
    try {
      const result = await startAssessment(maturityModelId, assessment.id, { editMode: true });
      if (result.success) {
        setAssessmentData(result.data);
        navigate('/assessments');
      } else {
        setActionError(result.error || 'Failed to open assessment for editing.');
      }
    } catch (err) {
      setActionError(err?.message || 'An unexpected error occurred.');
    } finally {
      setActiveAction(null);
    }
  };

  const borderColor = '#e2e8f0';
  const accentColorOngoing = '#F4B740'; // light amber/yellow for in-progress
  const accentColorCompleted = '#4CAF50'; // light green for completed
  const accentColorStart = '#46cdc6'; // teal (website primary)
  const bgColor = '#ffffff';

  const ongoingAssessments = assessments.filter((a) => a.status !== 'completed');
  const completedAssessments = assessments.filter((a) => a.status === 'completed');

  if (loading) {
    return <SignInLoader text="Loading assessments…" centerItems={assessmentHeaderLinks} />;
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#46cdc6]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#46cdc6]/5 rounded-full blur-[100px]" />
      </div>

      <PageHeader centerItems={assessmentHeaderLinks} activePath={location.pathname} />

      <section className="px-8 pt-12 pb-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full relative"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#46CDCF]/10 to-amber-500/10 rounded-full mb-6 border border-[#46CDCF]/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Sparkles className="w-4 h-4 text-[#46CDCF]" />
            <span className="text-sm font-semibold text-[#46CDCF]">ASSESSMENTS</span>
          </motion.div>
          <motion.h1
            className="text-5xl sm:text-6xl font-bold text-slate-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            My Assessments
          </motion.h1>
          <motion.p
            className="text-xl text-slate-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            View and manage your AI readiness assessments.
          </motion.p>
        </motion.div>
      </section>

      <section className="px-8 pb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full"
        >
          {listError ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
              <p className="text-red-700 font-medium">{listError}</p>
            </div>
          ) : (
            <>
              {actionError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              {/* Section 1: Start New Assessment (dashed box, + icon, Create Assessment button) */}
              <div className="mb-12">
                <div
                  className="relative rounded-2xl border-2 border-dashed p-8 flex flex-col items-center text-center cursor-pointer hover:border-[#46cdc6] hover:bg-[#46cdc6]/5 transition-all duration-300"
                  style={{ borderColor: accentColorStart }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (activeAction?.type !== 'start') handleStartNew();
                  }}
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${accentColorStart}20` }}
                  >
                    <Plus className="w-10 h-10" style={{ color: accentColorStart }} strokeWidth={2.5} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">Start New Assessment</h2>
                  <p className="text-slate-600 max-w-md">
                    Begin a fresh AI readiness assessment for your organization.
                  </p>
                  {activeAction?.type === 'start' && (
                    <div className="flex items-center gap-2 mt-2">
                      <Loader2 className="w-5 h-5 animate-spin" style={{ color: accentColorStart }} />
                      <span className="text-sm text-slate-600">Starting…</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 2: Ongoing – Offerings-style cards with progress, date, model name */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold text-slate-900">Ongoing</h2>
                  {ongoingAssessments.length > 0 && (
                    <span
                      className="px-2.5 py-0.5 rounded-full text-sm font-semibold"
                      style={{ backgroundColor: `${accentColorOngoing}20`, color: accentColorOngoing }}
                    >
                      {ongoingAssessments.length}
                    </span>
                  )}
                </div>
                {ongoingAssessments.length === 0 ? (
                  <p className="text-slate-500 py-4">No assessments in progress.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ongoingAssessments.map((assessment, index) => {
                      const isBusy = activeAction?.type === 'continue' && activeAction?.assessmentId === assessment.id;
                      const pct = Math.round(Number(assessment.completion_percentage) ?? 0);
                      const modelTitle = assessment.model?.title || assessment.model?.name || 'Assessment';
                      const startedAt = formatStartedAt(assessment.started_at);
                      return (
                        <motion.div
                          key={assessment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div
                            className={`relative h-[360px] p-8 rounded-lg border-2 flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-opacity-80 group cursor-pointer ${hoveredDeleteCardId === assessment.id ? 'delete-hovered' : ''}`}
                            style={{
                              backgroundColor: '#ffffff',
                              borderColor: '#e2e8f0',
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isBusy) handleContinue(assessment);
                            }}
                          >
                            <div className="absolute top-4 right-4">
                              <span
                                className="px-3 py-1 rounded-full text-xs font-bold border"
                                style={{
                                  color: '#0f172a',
                                  borderColor: `${accentColorOngoing}33`,
                                  backgroundColor: `${accentColorOngoing}14`,
                                }}
                              >
                                In Progress
                              </span>
                            </div>
                            <div
                              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"
                              style={{ background: `linear-gradient(135deg, ${accentColorOngoing} 0%, transparent 100%)` }}
                            />
                            <div className="h-14 mb-4 flex justify-start items-start relative z-10">
                              <div className="relative">
                                <div
                                  className="absolute inset-0 rounded-lg blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                                  style={{ backgroundColor: accentColorOngoing }}
                                />
                                <div
                                  className="relative w-12 h-12 rounded-lg flex items-center justify-center border-2 transition-all duration-300"
                                  style={{
                                    backgroundColor: 'white',
                                    borderColor: '#e2e8f0',
                                  }}
                                >
                                  <ClipboardList className="w-6 h-6" strokeWidth={1.5} style={{ color: '#1e293b' }} />
                                </div>
                              </div>
                            </div>
                            <div className="text-left flex-1 flex flex-col relative z-10 min-w-0 min-h-0">
                              <h3 className="text-base font-semibold mb-3 line-clamp-3 text-slate-900 break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                                {assessment.name || 'Ongoing Assessment'}
                              </h3>
                              <div className="flex flex-col gap-1 mb-3">
                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                  <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                  <span>Started {startedAt}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accentColorStart }} />
                                  <span className="uppercase font-medium">{modelTitle}</span>
                                </div>
                              </div>
                              <div className="mb-3">
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-slate-600 font-medium">Progress</span>
                                  <span className="font-semibold" style={{ color: accentColorOngoing }}>{pct}%</span>
                                </div>
                                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all"
                                    style={{ width: `${Math.min(100, Math.max(0, pct))}%`, backgroundColor: accentColorOngoing }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center gap-3 mt-auto pt-4 relative z-10 flex-shrink-0 min-h-12">
                              {isBusy ? (
                                <div className="flex items-center gap-2">
                                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: accentColorOngoing }} />
                                  <span className="text-sm text-slate-600">Continuing…</span>
                                </div>
                              ) : (
                                <>
                                  <div className="relative flex items-center flex-shrink-0">
                                    <button
                                      type="button"
                                      className="relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 bg-white flex-shrink-0 overflow-visible"
                                      style={{ borderColor: '#e2e8f0' }}
                                      onClick={(e) => { e.stopPropagation(); handleContinue(assessment); }}
                                    >
                                      <div
                                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 group-[.delete-hovered]:opacity-0 transition-opacity duration-300"
                                        style={{ backgroundColor: accentColorOngoing }}
                                      />
                                      <ArrowUpRight className="w-5 h-5 relative z-10" style={{ color: '#1e293b' }} />
                                    </button>
                                    <span
                                      className="absolute left-6 top-1/2 -translate-y-1/2 -translate-x-1/2 text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:translate-x-[2.5rem] group-[.delete-hovered]:opacity-0 group-[.delete-hovered]:translate-x-0 transition-all duration-300 ease-out pointer-events-none"
                                      style={{ color: accentColorOngoing }}
                                    >
                                      Continue assessment
                                    </span>
                                  </div>
                                  <div
                                    onMouseEnter={() => setHoveredDeleteCardId(assessment.id)}
                                    onMouseLeave={() => setHoveredDeleteCardId(null)}
                                    className="flex-shrink-0"
                                  >
                                    <DeleteButton
                                      label="Delete"
                                      onClick={() => alert('button is clicked')}
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                            <div
                              className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                              style={{ backgroundColor: accentColorOngoing }}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Section 3: Completed – Offerings-style cards with date, model name, Edit assessment */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-7 h-7" style={{ color: accentColorCompleted }} />
                    Completed
                  </h2>
                  {completedAssessments.length > 0 && (
                    <span
                      className="px-2.5 py-0.5 rounded-full text-sm font-semibold"
                      style={{ backgroundColor: `${accentColorCompleted}20`, color: accentColorCompleted }}
                    >
                      {completedAssessments.length}
                    </span>
                  )}
                </div>
                {completedAssessments.length === 0 ? (
                  <p className="text-slate-500 py-4">No completed assessments yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {completedAssessments.map((assessment, index) => {
                      const isBusy = (activeAction?.type === 'continue' || activeAction?.type === 'edit') && activeAction?.assessmentId === assessment.id;
                      const modelTitle = assessment.model?.title || assessment.model?.name || 'Assessment';
                      const completedAt = assessment.completed_at ? formatStartedAt(assessment.completed_at) : null;
                      return (
                        <motion.div
                          key={assessment.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div
                            className={`relative h-[360px] p-8 rounded-lg border-2 flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-opacity-80 group cursor-pointer ${hoveredDeleteCardId === assessment.id ? 'delete-hovered' : ''}`}
                            style={{
                              backgroundColor: '#ffffff',
                              borderColor: '#e2e8f0',
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isBusy) handleEditAssessment(assessment);
                            }}
                          >
                            <div className="absolute top-4 right-4">
                              <span
                                className="px-3 py-1 rounded-full text-xs font-bold border"
                                style={{
                                  color: '#0f172a',
                                  borderColor: `${accentColorCompleted}33`,
                                  backgroundColor: `${accentColorCompleted}14`,
                                }}
                              >
                                Completed
                              </span>
                            </div>
                            <div
                              className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"
                              style={{ background: `linear-gradient(135deg, ${accentColorCompleted} 0%, transparent 100%)` }}
                            />
                            <div className="h-14 mb-4 flex justify-start items-start relative z-10">
                              <div className="relative">
                                <div
                                  className="absolute inset-0 rounded-lg blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                                  style={{ backgroundColor: accentColorCompleted }}
                                />
                                <div
                                  className="relative w-12 h-12 rounded-lg flex items-center justify-center border-2 transition-all duration-300"
                                  style={{
                                    backgroundColor: 'white',
                                    borderColor: '#e2e8f0',
                                  }}
                                >
                                  <FileText className="w-6 h-6" strokeWidth={1.5} style={{ color: '#1e293b' }} />
                                </div>
                              </div>
                            </div>
                            <div className="text-left flex-1 flex flex-col relative z-10 min-w-0 min-h-0">
                              <h3 className="text-base font-semibold mb-3 line-clamp-3 text-slate-900 break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                                {assessment.name || 'Completed Assessment'}
                              </h3>
                              <div className="flex flex-col gap-1 mb-3">
                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                  <Calendar className="w-4 h-4 text-slate-500 flex-shrink-0" />
                                  <span>{completedAt ? `Completed ${completedAt}` : 'Completed'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accentColorStart }} />
                                  <span className="uppercase font-medium">{modelTitle}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between items-center gap-3 mt-auto pt-4 relative z-10 flex-shrink-0 min-h-12">
                              {isBusy ? (
                                <div className="flex items-center gap-2">
                                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: accentColorCompleted }} />
                                  <span className="text-sm text-slate-600">Opening…</span>
                                </div>
                              ) : (
                                <>
                                  <div className="relative flex items-center flex-shrink-0">
                                    <button
                                      type="button"
                                      className="relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 bg-white flex-shrink-0 overflow-visible"
                                      style={{ borderColor: '#e2e8f0' }}
                                      onClick={(e) => { e.stopPropagation(); handleEditAssessment(assessment); }}
                                    >
                                      <div
                                        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 group-[.delete-hovered]:opacity-0 transition-opacity duration-300"
                                        style={{ backgroundColor: accentColorCompleted }}
                                      />
                                      <ArrowUpRight className="w-5 h-5 relative z-10" style={{ color: '#1e293b' }} />
                                    </button>
                                    <span
                                      className="absolute left-6 top-1/2 -translate-y-1/2 -translate-x-1/2 text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:translate-x-[2.5rem] group-[.delete-hovered]:opacity-0 group-[.delete-hovered]:translate-x-0 transition-all duration-300 ease-out pointer-events-none"
                                      style={{ color: accentColorCompleted }}
                                    >
                                      Edit assessment
                                    </span>
                                  </div>
                                  <div
                                    onMouseEnter={() => setHoveredDeleteCardId(assessment.id)}
                                    onMouseLeave={() => setHoveredDeleteCardId(null)}
                                    className="flex-shrink-0"
                                  >
                                    <DeleteButton
                                      label="Delete"
                                      onClick={() => alert('button is clicked')}
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                            <div
                              className="absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                              style={{ backgroundColor: accentColorCompleted }}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </motion.div>
      </section>
    </div>
  );
}
