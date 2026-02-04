import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, ChevronDown, AlertCircle, X, Loader2, Share2, FileText, Zap, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../shared/PageHeader';
import { SignInLoader } from '../shared/SignInLoader';
import { getUseCaseList, getUseCaseDetail } from '../../services/useCaseService';

const PRIMARY = '#2DD4BF';
const ACCENT_PURPLE = '#8B5CF6';
const ACCENT_ORANGE = '#FF914D';

const useCasesBankHeaderLinks = [
  { label: 'Home', path: '/offerings' },
  { label: 'Assessments', path: '/my-assessments' },
  { label: 'Results', path: '/completed-assessments' },
  { label: 'Use Cases', path: '/usecases' },
  { label: 'Studio', path: '/studio' },
  { label: 'Use Case Explorer', path: '/use-case-explorer' },
];

/**
 * Use Case Explorer / Use Cases Bank
 * Fetches use cases from API, expandable cards, search, load more.
 * Route: /use-case-explorer — linked from Studio Inspire Me card.
 */
export function UseCasesBankPage() {
  const location = useLocation();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(6);
  const [expandedKey, setExpandedKey] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailUuid, setDetailUuid] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getUseCaseList()
      .then((res) => {
        if (cancelled) return;
        if (res.success) {
          const raw = res.data;
          const arr = Array.isArray(raw)
            ? raw
            : (raw?.use_cases ?? raw?.list ?? raw?.data ?? []);
          setList(Array.isArray(arr) ? arr : []);
        } else {
          setError(res.error || 'Failed to load use cases');
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Failed to load use cases');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const filteredList = list.filter((uc) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const name = (uc.name ?? uc.title ?? uc.use_case_name ?? '').toLowerCase();
    const desc = (uc.short_description ?? uc.description ?? uc.desc ?? '').toLowerCase();
    const industry = (uc.industry ?? '').toLowerCase();
    const fn = (uc.function ?? '').toLowerCase();
    const aiType = (uc.ai_type ?? '').toLowerCase();
    const category = (uc.category ?? uc.category_name ?? '').toLowerCase();
    return name.includes(q) || desc.includes(q) || industry.includes(q) || fn.includes(q) || aiType.includes(q) || category.includes(q);
  });

  const displayedList = filteredList.slice(0, displayCount);
  const totalCount = filteredList.length;
  const hasMore = displayCount < totalCount;

  const openDetailDrawer = (uuid) => {
    if (!uuid) return;
    setDetailUuid(uuid);
    setDrawerOpen(true);
    setDetailData(null);
    setDetailError(null);
    setDetailLoading(true);
    getUseCaseDetail(uuid)
      .then((res) => {
        if (res.success) setDetailData(res.data);
        else setDetailError(res.error || 'Failed to load details');
      })
      .catch((err) => setDetailError(err?.message || 'Failed to load details'))
      .finally(() => setDetailLoading(false));
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setDetailUuid(null);
    setDetailData(null);
    setDetailError(null);
  };

  if (loading) {
    return <SignInLoader text="Loading use cases…" centerItems={useCasesBankHeaderLinks} />;
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 relative overflow-hidden font-sans">
      {/* Background: grid + radial gradients (reference) */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `
            radial-gradient(circle at 0% 0%, rgba(45, 212, 191, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 100% 100%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
            linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px',
        }}
      />
      {/* Blur orbs – same as /my-assessments */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#46cdc6]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#46cdc6]/5 rounded-full blur-[100px]" />
      </div>

      <PageHeader centerItems={useCasesBankHeaderLinks} activePath={location.pathname} zIndex="z-20" />

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-28 md:pt-32 pb-32">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-[#2DD4BF]/20" style={{ backgroundColor: `${PRIMARY}18`, color: PRIMARY }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: PRIMARY }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: PRIMARY }} />
            </span>
            Live Repository {new Date().getFullYear()}
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.95] text-slate-900">
            USE CASE 
            <span style={{ color: PRIMARY, paddingLeft: '15px' }}>
               EXPLORER
            </span>
          </h1>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
            <p className="text-lg text-slate-500 max-w-xl font-medium leading-relaxed">
              A technical index of high-impact AI implementations. Built for developers and enterprise architects focused on measurable outcomes.
            </p>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span>{totalCount} Active Patterns</span>
            </div>
          </div>
        </header>

        {/* Search */}
        <section className="mb-10">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#2DD4BF] transition-colors" />
            <input
              type="text"
              placeholder="Filter by industry or AI architecture..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-24 py-5 bg-white border-2 border-slate-200 rounded-2xl focus:border-[#2DD4BF] focus:ring-0 transition-all text-lg font-medium outline-none shadow-xl shadow-slate-200/20"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
              <kbd className="hidden sm:inline-flex px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-400 border border-slate-200 tracking-tighter">
                CMD + K
              </kbd>
            </div>
          </div>
        </section>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3">
              {displayedList.map((uc, index) => {
                const key = uc.id ?? uc.use_case_id ?? index;
                const isExpanded = expandedKey === key;
                const name = uc.name ?? uc.title ?? uc.use_case_name ?? '';
                const description = uc.short_description ?? uc.description ?? uc.desc ?? '';
                const industry = uc.industry ?? uc.category ?? uc.category_name ?? '';
                const aiType = uc.ai_type ?? '';
                const tagVariant = index % 3;
                const accentClass = tagVariant === 0 ? PRIMARY : tagVariant === 1 ? ACCENT_PURPLE : ACCENT_ORANGE;
                const accentBg = `${accentClass}18`;

                return (
                  <motion.div
                    key={key}
                    layout
                    initial={false}
                    transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                    className={`group bg-white border-2 p-6 rounded-2xl transition-all cursor-pointer shadow-sm ${
                      isExpanded ? 'border-[#2DD4BF] shadow-lg' : 'border-slate-100 hover:border-slate-200 hover:-translate-y-1'
                    }`}
                    onMouseEnter={() => setExpandedKey(key)}
                    onMouseLeave={() => setExpandedKey(null)}
                    onClick={(e) => { e.stopPropagation(); openDetailDrawer(uc.id); }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 md:gap-6 min-w-0">
                        <span className="text-xs font-mono text-slate-400 tracking-tighter flex-shrink-0">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h3 className="font-bold text-xl md:text-2xl text-slate-900 truncate">
                          {name || 'Untitled'}
                        </h3>
                        <div className="hidden md:flex gap-2 flex-shrink-0">
                          {industry ? (
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold uppercase text-slate-500 tracking-wider max-w-[180px] truncate" title={industry}>
                              {industry}
                            </span>
                          ) : null}
                          {aiType ? (
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
                              style={{ backgroundColor: accentBg, color: accentClass }}
                            >
                              {aiType}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <span
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isExpanded ? 'rotate-45' : ''
                        }`}
                        style={{ color: isExpanded ? PRIMARY : '#cbd5e1' }}
                      >
                        <Plus className="w-6 h-6" strokeWidth={2.5} />
                      </span>
                    </div>

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
                            {description || '—'}
                          </p>
                        </div>
                        <div
                          className="p-6 rounded-xl border flex flex-col gap-3"
                          style={{ backgroundColor: `${PRIMARY}0D`, borderColor: `${PRIMARY}33` }}
                        >
                          <h4 className="text-xs font-bold uppercase mb-1 tracking-widest" style={{ color: PRIMARY }}>
                            Details
                          </h4>
                          <dl className="space-y-2 text-sm">
                            {uc.function ? (
                              <div>
                                <dt className="text-slate-500 font-medium">Function</dt>
                                <dd className="text-slate-800 font-medium">{uc.function}</dd>
                              </div>
                            ) : null}
                            {(uc.maturity_level || uc.priority) ? (
                              <div className="flex gap-6">
                                {uc.maturity_level ? (
                                  <div>
                                    <dt className="text-slate-500 font-medium">Maturity</dt>
                                    <dd className="text-slate-800 font-medium">{uc.maturity_level}</dd>
                                  </div>
                                ) : null}
                                {uc.priority ? (
                                  <div>
                                    <dt className="text-slate-500 font-medium">Priority</dt>
                                    <dd className="text-slate-800 font-medium">{uc.priority}</dd>
                                  </div>
                                ) : null}
                              </div>
                            ) : null}
                          </dl>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-20 border-t-2 border-slate-100 pt-12 flex flex-col items-center gap-8">
              <div className="flex flex-col items-center text-center">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
                  Reached the end of current view
                </p>
                {hasMore ? (
                  <motion.button
                    type="button"
                    onClick={() => setDisplayCount((c) => Math.min(c + 6, totalCount))}
                    className="group relative px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-xl overflow-hidden hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      FETCH MORE DATA
                      <ChevronDown className="w-5 h-5" />
                    </span>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: `${PRIMARY}1A` }} />
                  </motion.button>
                ) : (
                  <p className="text-sm text-slate-500">
                    Showing {displayedList.length} of {totalCount} use cases
                  </p>
                )}
              </div>
              <div className="flex gap-4 items-center">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: `${ACCENT_PURPLE}33`, color: ACCENT_PURPLE }}>JS</div>
                  <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: `${PRIMARY}33`, color: PRIMARY }}>PY</div>
                  <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: `${ACCENT_ORANGE}33`, color: ACCENT_ORANGE }}>RS</div>
                </div>
                <p className="text-xs font-medium text-slate-400 max-w-[160px] leading-tight">
                  Trusted by 2,400+ developers worldwide.
                </p>
              </div>
            </div>
      </main>

      {/* Detail drawer from right — 70% width, Spotify-style */}
      <AnimatePresence>
        {drawerOpen && (
          <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
            onClick={closeDrawer}
            aria-hidden
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 z-40 flex flex-col overflow-hidden shadow-2xl font-sans w-full lg:w-[65%] lg:max-w-[900px] lg:rounded-l-2xl"
            style={{ backgroundColor: '#F8F9FA' }}
          >
            {/* Close button when loading or error (header has its own when data loaded) */}
            {(!detailData || detailLoading || detailError) && (
              <div className="absolute top-6 right-6 z-50">
                <button type="button" onClick={closeDrawer} className="w-10 h-10 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-600 hover:text-slate-800 transition-colors" aria-label="Close">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
            {detailLoading && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-slate-500 bg-[#F8F9FA]">
                <Loader2 className="w-10 h-10 animate-spin" style={{ color: PRIMARY }} />
                <span>Loading details…</span>
              </div>
            )}
            {detailError && !detailLoading && (
              <div className="flex-1 flex items-center justify-center p-8 bg-[#F8F9FA]">
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 max-w-md">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{detailError}</span>
                </div>
              </div>
            )}
            {detailData && !detailLoading && (
              <>
                {/* Header — teal gradient */}
                <header
                  className="pt-12 pb-6 px-8 md:px-12 relative flex-shrink-0"
                  style={{ background: 'linear-gradient(180deg, #2DD4BF 0%, #159a8a 100%)' }}
                >
                  <div className="absolute top-6 right-6 flex gap-3">
                    <button type="button" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors" aria-label="Share">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button type="button" onClick={closeDrawer} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors" aria-label="Close">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-end gap-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-md rounded-xl shadow-xl flex items-center justify-center border border-white/30 flex-shrink-0">
                      <FileText className="w-8 h-8 md:w-9 md:h-9 text-white" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 text-white min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 block opacity-80">Use Case Archive</span>
                      <h1 className="text-xl md:text-2xl lg:text-3xl font-black tracking-normal leading-tight">
                        {detailData.name ?? detailData.title ?? 'Untitled'}
                      </h1>
                    </div>
                  </div>
                </header>

                {/* Content — scrollable canvas */}
                <div className="flex-1 overflow-y-auto px-8 md:px-12 py-8 bg-[#F8F9FA] scrollbar-thin">
                  <div className="space-y-8 pb-24">
                    {/* Metadata badges */}
                    {(detailData.function ?? detailData.industry ?? detailData.priority ?? detailData.maturity_level) && (
                      <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap items-center gap-2 text-sm">
                        {detailData.function ? (
                          <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-slate-100 font-bold text-slate-800">
                            <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center border border-slate-200" style={{ color: PRIMARY }}>
                              <Zap className="w-3 h-3" />
                            </span>
                            {detailData.function}
                          </span>
                        ) : null}
                        {detailData.industry ? (
                          <span className="inline-flex items-center rounded-full px-4 py-2 bg-slate-100 font-bold text-slate-800">
                            {detailData.industry}
                          </span>
                        ) : null}
                        {detailData.priority ? (
                          <span className="inline-flex items-center rounded-full px-4 py-2 bg-slate-100 font-bold text-slate-800">
                            Priority {detailData.priority}
                          </span>
                        ) : null}
                        {detailData.maturity_level && !detailData.priority ? (
                          <span className="inline-flex items-center rounded-full px-4 py-2 bg-slate-100 font-bold text-slate-800">
                            {detailData.maturity_level}
                          </span>
                        ) : null}
                      </div>
                    )}
                    {/* 01 The Vision */}
                    <section>
                      <div className="flex items-center gap-4 mb-6">
                        <span className="text-3xl font-black text-slate-200 tracking-tight">01</span>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 italic">The Vision</h2>
                        <div className="h-px flex-1 bg-slate-200" />
                      </div>
                      <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
                        <div>
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Short Description</h4>
                          <p className="text-base md:text-lg text-slate-600 leading-relaxed font-medium">
                            {detailData.short_description ?? detailData.description ?? '—'}
                          </p>
                        </div>
                        {(detailData.primary_problem_solved ?? detailData.primary_problem) && (
                          <div className="pt-6 border-t border-slate-100">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Primary problem solved</h4>
                            <p className="text-slate-500 leading-relaxed">{detailData.primary_problem_solved ?? detailData.primary_problem}</p>
                          </div>
                        )}
                        {(detailData.problem ?? detailData.the_problem) && (
                          <div className="pt-6 border-t border-slate-100">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">The Problem</h4>
                            <p className="text-slate-500 leading-relaxed">{detailData.problem ?? detailData.the_problem}</p>
                          </div>
                        )}
                      </div>
                    </section>

                    {/* 02 The Engine */}
                    <section>
                      <div className="flex items-center gap-4 mb-6">
                        <span className="text-3xl font-black text-slate-200 tracking-tight">02</span>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 italic">The Engine</h2>
                        <div className="h-px flex-1 bg-slate-200" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">AI Type</h4>
                          <div className="text-2xl md:text-3xl font-bold" style={{ color: PRIMARY }}>
                            {detailData.ai_type ?? '—'}
                          </div>
                        </div>
                        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Capabilities</h4>
                          {Array.isArray(detailData.capabilities) && detailData.capabilities.length > 0 ? (
                            <ul className="space-y-3">
                              {detailData.capabilities.map((cap, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: PRIMARY }} />
                                  {typeof cap === 'string' ? cap : cap?.label ?? cap?.name ?? '—'}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-slate-500 text-sm">—</p>
                          )}
                        </div>
                        {/* Time to Value */}
                        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <h4 className="text-sm font-bold text-slate-900">Time to Value</h4>
                            {(detailData.time_to_value ?? detailData.time_to_value_label) && (
                              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex-shrink-0">
                                {detailData.time_to_value ?? detailData.time_to_value_label}
                              </span>
                            )}
                          </div>
                          <div className="h-2 w-full rounded-full overflow-hidden bg-slate-100">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min(100, Math.max(0, Number(detailData.time_to_value_percent) || 85))}%`,
                                backgroundColor: PRIMARY,
                              }}
                            />
                          </div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">
                            {detailData.time_to_value_deployment ?? (detailData.time_to_value_weeks != null && detailData.time_to_value_weeks !== ''
                              ? (typeof detailData.time_to_value_weeks === 'number'
                                  ? `< ${detailData.time_to_value_weeks} WEEKS DEPLOYMENT`
                                  : String(detailData.time_to_value_weeks).toUpperCase())
                              : '< 4 WEEKS DEPLOYMENT')}
                          </p>
                        </div>
                        {/* Implementation Complexity */}
                        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <h4 className="text-sm font-bold text-slate-900">Implementation Complexity</h4>
                            {(detailData.implementation_complexity ?? detailData.implementation_complexity_level) && (
                              <span className="text-[10px] font-bold text-slate-500 flex-shrink-0">
                                {detailData.implementation_complexity ?? detailData.implementation_complexity_level}
                                {(detailData.implementation_complexity_score ?? detailData.complexity_score) != null &&
                                  detailData.implementation_complexity_score !== '' && (
                                    <span className="font-medium text-slate-400">
                                      {' '}({detailData.implementation_complexity_score ?? detailData.complexity_score})
                                    </span>
                                  )}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-0.5 w-full">
                            {(() => {
                              const scoreRaw = detailData.implementation_complexity_filled ?? detailData.implementation_complexity_score ?? detailData.complexity_score;
                              const filled = Number(scoreRaw) || (typeof scoreRaw === 'string' ? parseInt(scoreRaw.split('/')[0], 10) : 0) || 4;
                              const total = 6;
                              return [1, 2, 3, 4, 5, 6].map((i) => {
                                const isFilled = i <= Math.min(total, Math.max(0, filled));
                                return (
                                  <div
                                    key={i}
                                    className="h-2 flex-1 rounded-sm"
                                    style={{ backgroundColor: isFilled ? PRIMARY : '#e2e8f0' }}
                                  />
                                );
                              });
                            })()}
                          </div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">
                            {detailData.implementation_complexity_description ?? detailData.complexity_description ?? '—'}
                          </p>
                        </div>
                      </div>
                    </section>

                    {/* 03 The Governance */}
                    <section>
                      <div className="flex items-center gap-4 mb-6">
                        <span className="text-3xl font-black text-slate-200 tracking-tight">03</span>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 italic">The Governance</h2>
                        <div className="h-px flex-1 bg-slate-200" />
                      </div>
                      <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-slate-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                          {detailData.maturity_level && (
                            <div>
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Maturity</h4>
                              <div className="text-sm font-bold text-slate-900">{detailData.maturity_level}</div>
                            </div>
                          )}
                          {detailData.current_status && (
                            <div>
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Status</h4>
                              <div className="text-sm font-bold text-slate-900">{detailData.current_status}</div>
                            </div>
                          )}
                          {detailData.priority && (
                            <div>
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Priority</h4>
                              <div className="text-sm font-bold text-slate-900">{detailData.priority}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </section>
                  </div>
                </div>

                {/* Footer */}
                <footer className="h-16 bg-white border-t border-slate-100 px-8 md:px-12 flex items-center justify-between flex-shrink-0">
                  <button type="button" onClick={closeDrawer} className="px-5 py-2.5 text-slate-400 font-bold uppercase tracking-widest text-xs hover:text-slate-600 transition-colors">
                    Cancel
                  </button>
                  <div className="flex items-center gap-5">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Available to deploy</p>
                      <p className="text-xs font-bold text-slate-500">{detailData.maturity_level ?? '—'}</p>
                    </div>
                    <button
                      type="button"
                      className="rounded-full font-black text-xs uppercase tracking-widest px-8 py-3.5 text-white transition-transform hover:scale-105 active:scale-95"
                      style={{
                        backgroundColor: PRIMARY,
                        boxShadow: `0 8px 24px rgba(45, 212, 191, 0.35), 0 4px 12px rgba(45, 212, 191, 0.2)`,
                      }}
                    >
                      Use this template
                    </button>
                  </div>
                </footer>
              </>
            )}
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
