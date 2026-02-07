import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, Sparkles, AlertCircle, Loader2, FileText, Calendar, ChevronRight, GitCompare } from 'lucide-react';
import { PageHeader } from '../shared/PageHeader';
import { IoButton } from '../ui/IoButton';
import { getOrganizationAssessmentsCompleted, getAssessmentResults } from '../../services/assessmentService';
import { useAssessmentStore } from '../../stores/assessmentStore';
import { SignInLoader } from '../shared/SignInLoader';

function formatDate(isoString) {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return isoString;
  }
}

/**
 * Completed Assessments page – fetches and shows only completed assessments.
 * Route: /completed-assessments
 * API: GET /api/v1/organization/assessments?status=completed
 */
const assessmentHeaderLinks = [
  { label: 'Home', path: '/offerings' },
  { label: 'Assessments', path: '/my-assessments' },
  { label: 'Results', path: '/completed-assessments' },
  { label: 'Use Cases', path: '/usecases' },
];

export function CompletedAssessmentsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAssessmentResults, setError } = useAssessmentStore();

  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState(null);
  const [activeAction, setActiveAction] = useState(null); // { type: 'results', assessmentId }
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setListError(null);
    getOrganizationAssessmentsCompleted()
      .then((res) => {
        if (cancelled) return;
        const raw = res.data?.data ?? res.data;
        const list = Array.isArray(raw) ? raw : [];
        if (res.success) {
          setAssessments(list);
          setListError(null);
        } else {
          setListError(res.error || 'Failed to load completed assessments');
          setAssessments(list);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setListError(err?.message || 'Failed to load completed assessments');
        setAssessments([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const handleViewResults = async (assessment) => {
    setActionError(null);
    setError(null);
    setActiveAction({ type: 'results', assessmentId: assessment.id });
    try {
      const result = await getAssessmentResults(assessment.id);
      if (result.success) {
        setAssessmentResults(result.data);
        navigate('/results');
      } else {
        setActionError(result.error || 'Failed to load results.');
      }
    } catch (err) {
      setActionError(err?.message || 'An unexpected error occurred.');
    } finally {
      setActiveAction(null);
    }
  };

  const teal = '#46cdc6';
  const tealDark = '#2db8b0'; // darker teal for hover
  const tealLight = '#46cdc620';

  if (loading) {
    return <SignInLoader text="Loading results…" centerItems={assessmentHeaderLinks} />;
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
            <span className="text-sm font-semibold text-[#46CDCF]">RESULTS</span>
          </motion.div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <motion.h1
              className="text-5xl sm:text-6xl font-bold text-slate-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              View Results
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="shrink-0"
            >
              <IoButton
                variant="teal"
                icon={<GitCompare className="w-5 h-5" strokeWidth={2} />}
                onClick={() => navigate('/comparison-assessment-results')}
              >
                Compare assessment
              </IoButton>
            </motion.div>
          </div>
          <motion.p
            className="text-xl text-slate-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Click on any assessment card to view your detailed AI readiness results and insights.
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
          ) : assessments.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/60 p-8 shadow-xl min-h-[320px] flex flex-col items-center justify-center">
              <CheckCircle2 className="w-16 h-16 text-slate-300 mb-4" />
              <h2 className="text-xl font-semibold text-slate-700 mb-2">No results yet</h2>
              <p className="text-slate-500 text-center max-w-md">
                Complete an assessment from Assessments to see your results here.
              </p>
            </div>
          ) : (
            <>
              {actionError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assessments.map((assessment, index) => {
                  const isBusy =
                    activeAction?.type === 'results' && activeAction?.assessmentId === assessment.id;
                  const modelTitle = (assessment.model?.title || assessment.model?.name || 'Assessment').toUpperCase();
                  const completedAt = assessment.completed_at ? formatDate(assessment.completed_at) : null;

                  return (
                    <motion.div
                      key={assessment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group"
                    >
                      <div
                        className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-[#46cdc6]/30 cursor-pointer flex flex-col"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isBusy) handleViewResults(assessment);
                        }}
                      >
                        {/* Top teal strip with Completed badge */}
                        <div
                          className="px-5 py-3 flex items-center gap-2"
                          style={{ backgroundColor: tealLight }}
                        >
                          <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: teal }} />
                          <span className="text-sm font-semibold" style={{ color: teal }}>Completed</span>
                        </div>

                        {/* Card body */}
                        <div className="p-6 flex flex-col flex-1">
                          {/* Document icon - same teal as View Results when not hovering; darker on hover */}
                          <div className="flex justify-center mb-4">
                            <div
                              className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 bg-[#46cdc6] group-hover:bg-[#2db8b0]"
                            >
                              <FileText
                                className="w-7 h-7 text-white transition-colors duration-300"
                                strokeWidth={1.5}
                              />
                            </div>
                          </div>

                          {/* Assessment name */}
                          <h3
                            className="text-lg font-bold text-slate-900 mb-4 break-words"
                            style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                          >
                            {assessment.name || 'AI Readiness Results'}
                          </h3>

                          {/* Completed date */}
                          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                            <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                            <span>{completedAt ? `Completed ${completedAt}` : 'Completed'}</span>
                          </div>

                          {/* Model name */}
                          <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: teal }} />
                            <span className="uppercase font-medium">{modelTitle}</span>
                          </div>

                          {/* View Results button */}
                          <div className="mt-auto">
                            {isBusy ? (
                              <div className="w-full py-3 rounded-xl flex items-center justify-center gap-2 bg-slate-100 text-slate-600">
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span className="text-sm font-semibold">Loading…</span>
                              </div>
                            ) : (
                              <button
                                type="button"
                                className="w-full py-3 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all duration-300 group-hover:shadow-md bg-[#46cdc6] group-hover:bg-[#2db8b0]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewResults(assessment);
                                }}
                              >
                                View Results
                                <ChevronRight className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </motion.div>
      </section>
    </div>
  );
}
