import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
} from 'lucide-react';
import { PageHeader } from '../shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

// Assessment A (Latest) - user-provided
const ASSESSMENT_A = {
  assessment_id: 'af27a94e-2f6f-47e5-9745-a1836f083af2',
  assessment_name: '20260131_VECTORS_AIMaturityAssessment',
  organization_name: 'novatech',
  model_name: 'VECTORS',
  status: 'completed',
  started_at: '2026-01-31T08:19:34.087068Z',
  completed_at: '2026-01-31T08:39:19.847399Z',
  overall_score: 2.66,
  overall_maturity_level: 'Established',
  total_questions: 72,
  answered_questions: 72,
  completion_percentage: 100.0,
  pillar_results: [
    { pillar_id: '21f29b88-f461-4661-ad55-39edc7b6acdf', pillar_name: 'Strategic Value & Governance', pillar_order: 1, pillar_weight: 20, total_questions: 14, answered_questions: 14, average_score: 1.0, weighted_score: 0.2, maturity_level: 'Initial', completion_percentage: 100.0 },
    { pillar_id: '1e45fb10-9a2b-4f6e-84fc-234aade9e37a', pillar_name: 'Workforce Skillset & Organization Structure', pillar_order: 2, pillar_weight: 20, total_questions: 11, answered_questions: 11, average_score: 2.0, weighted_score: 0.4, maturity_level: 'Adopting', completion_percentage: 100.0 },
    { pillar_id: 'f027d4f9-f04f-4943-983d-c5b493e60d50', pillar_name: 'Technology & Data', pillar_order: 3, pillar_weight: 20, total_questions: 11, answered_questions: 11, average_score: 3.09, weighted_score: 0.62, maturity_level: 'Established', completion_percentage: 100.0 },
    { pillar_id: '017da9fe-1eed-4e26-95a6-7cd7f28fdc72', pillar_name: 'Resilience, Performance & Impact', pillar_order: 4, pillar_weight: 10, total_questions: 12, answered_questions: 12, average_score: 4.0, weighted_score: 0.4, maturity_level: 'Advanced', completion_percentage: 100.0 },
    { pillar_id: '547e11ae-5872-4d94-804f-9752bebc6f6a', pillar_name: 'Ethics, Trust & Responsible AI', pillar_order: 5, pillar_weight: 10, total_questions: 6, answered_questions: 6, average_score: 4.83, weighted_score: 0.48, maturity_level: 'Transformational', completion_percentage: 100.0 },
    { pillar_id: 'e5afc46e-6649-4dd3-8d7d-875adafe7143', pillar_name: 'Compliance, Security & Risk', pillar_order: 6, pillar_weight: 10, total_questions: 10, answered_questions: 10, average_score: 2.6, weighted_score: 0.26, maturity_level: 'Established', completion_percentage: 100.0 },
    { pillar_id: 'e54067be-d1f8-4a3b-a260-d51346da76d5', pillar_name: 'Operations & Implementation', pillar_order: 7, pillar_weight: 10, total_questions: 8, answered_questions: 8, average_score: 3.0, weighted_score: 0.3, maturity_level: 'Established', completion_percentage: 100.0 },
  ],
};

// Assessment B (Previous) - sample for comparison
const ASSESSMENT_B = {
  assessment_id: 'b038b05f-3g7g-58f6-a856-b2947g094bg3',
  assessment_name: 'Q4 2024 Assessment',
  organization_name: 'novatech',
  model_name: 'VECTORS',
  status: 'completed',
  started_at: '2024-10-15T10:00:00.000000Z',
  completed_at: '2024-10-20T14:30:00.000000Z',
  overall_score: 2.8,
  overall_maturity_level: 'Established',
  total_questions: 72,
  answered_questions: 72,
  completion_percentage: 100.0,
  pillar_results: [
    { pillar_id: '21f29b88-f461-4661-ad55-39edc7b6acdf', pillar_name: 'Strategic Value & Governance', pillar_order: 1, pillar_weight: 20, total_questions: 14, answered_questions: 14, average_score: 1.5, weighted_score: 0.3, maturity_level: 'Initial', completion_percentage: 100.0 },
    { pillar_id: '1e45fb10-9a2b-4f6e-84fc-234aade9e37a', pillar_name: 'Workforce Skillset & Organization Structure', pillar_order: 2, pillar_weight: 20, total_questions: 11, answered_questions: 11, average_score: 2.5, weighted_score: 0.5, maturity_level: 'Adopting', completion_percentage: 100.0 },
    { pillar_id: 'f027d4f9-f04f-4943-983d-c5b493e60d50', pillar_name: 'Technology & Data', pillar_order: 3, pillar_weight: 20, total_questions: 11, answered_questions: 11, average_score: 2.8, weighted_score: 0.56, maturity_level: 'Established', completion_percentage: 100.0 },
    { pillar_id: '017da9fe-1eed-4e26-95a6-7cd7f28fdc72', pillar_name: 'Resilience, Performance & Impact', pillar_order: 4, pillar_weight: 10, total_questions: 12, answered_questions: 12, average_score: 3.2, weighted_score: 0.32, maturity_level: 'Established', completion_percentage: 100.0 },
    { pillar_id: '547e11ae-5872-4d94-804f-9752bebc6f6a', pillar_name: 'Ethics, Trust & Responsible AI', pillar_order: 5, pillar_weight: 10, total_questions: 6, answered_questions: 6, average_score: 4.5, weighted_score: 0.45, maturity_level: 'Advanced', completion_percentage: 100.0 },
    { pillar_id: 'e5afc46e-6649-4dd3-8d7d-875adafe7143', pillar_name: 'Compliance, Security & Risk', pillar_order: 6, pillar_weight: 10, total_questions: 10, answered_questions: 10, average_score: 2.2, weighted_score: 0.22, maturity_level: 'Established', completion_percentage: 100.0 },
    { pillar_id: 'e54067be-d1f8-4a3b-a260-d51346da76d5', pillar_name: 'Operations & Implementation', pillar_order: 7, pillar_weight: 10, total_questions: 8, answered_questions: 8, average_score: 2.7, weighted_score: 0.27, maturity_level: 'Established', completion_percentage: 100.0 },
  ],
};

const PILLAR_SHORT_NAMES = {
  'Strategic Value & Governance': 'Strategy & Governance',
  'Workforce Skillset & Organization Structure': 'Organization & Workforce',
  'Technology & Data': 'Data & Technology',
  'Resilience, Performance & Impact': 'Performance & Impact',
  'Ethics, Trust & Responsible AI': 'Trust, Ethics & Responsible AI',
  'Compliance, Security & Risk': 'Security & Risk',
  'Operations & Implementation': 'Operations & Implementation',
};

const MATURITY_LEVELS_ORDER = ['Initial', 'Adopting', 'Established', 'Advanced', 'Transformational'];
const MATURITY_COLORS = {
  Initial: '#ef4444',
  Adopting: '#f97316',
  Established: '#f59e0b',
  Advanced: '#10b981',
  Transformational: '#059669',
};

const assessmentHeaderLinks = [
  { label: 'Home', path: '/offerings' },
  { label: 'Assessments', path: '/my-assessments' },
  { label: 'Results', path: '/completed-assessments' },
  { label: 'Use Cases', path: '/usecases' },
];

function formatDate(isoString) {
  if (!isoString) return '';
  try {
    return new Date(isoString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  } catch {
    return isoString;
  }
}

// Custom tick for radar
const CustomPolarAngleAxisTick = ({ payload, x, y, cx, cy }) => {
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
      <text x={textX} y={textY} textAnchor={textAnchor} fill="#374151" fontSize={11} fontWeight={500}>
        {payload.value}
      </text>
    </g>
  );
};

export function ComparisonAssessmentResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const assessmentA = ASSESSMENT_A;
  const assessmentB = ASSESSMENT_B;

  const scoreChange = useMemo(() => {
    const a = assessmentA.overall_score ?? 0;
    const b = assessmentB.overall_score ?? 0;
    const diff = Math.round((a - b) * 100) / 100;
    const pct = b !== 0 ? Math.round(((a - b) / b) * 1000) / 10 : 0;
    return { diff, pct };
  }, [assessmentA.overall_score, assessmentB.overall_score]);

  const pillarComparison = useMemo(() => {
    const aPillars = (assessmentA.pillar_results || []).sort((x, y) => x.pillar_order - y.pillar_order);
    const bPillars = (assessmentB.pillar_results || []).sort((x, y) => x.pillar_order - y.pillar_order);
    return aPillars.map((pa, i) => {
      const pb = bPillars.find((p) => p.pillar_id === pa.pillar_id) || bPillars[i];
      const scoreA = Number(pa.average_score) || 0;
      const scoreB = Number(pb?.average_score) || 0;
      const diff = Math.round((scoreA - scoreB) * 100) / 100;
      return {
        pillar_name: pa.pillar_name,
        short_name: PILLAR_SHORT_NAMES[pa.pillar_name] || pa.pillar_name,
        pillar_order: pa.pillar_order,
        scoreA,
        scoreB,
        maturityA: pa.maturity_level || 'Established',
        maturityB: pb?.maturity_level || 'Established',
        diff,
      };
    });
  }, [assessmentA.pillar_results, assessmentB.pillar_results]);

  const radarData = useMemo(
    () =>
      pillarComparison.map((p) => ({
        pillar: p.short_name,
        'Assessment A': p.scoreA,
        'Assessment B': p.scoreB,
        fullMark: 5,
      })),
    [pillarComparison]
  );

  const topImprovements = useMemo(
    () =>
      pillarComparison
        .filter((p) => p.diff > 0)
        .sort((a, b) => b.diff - a.diff)
        .slice(0, 5)
        .map((p) => ({ name: p.short_name, change: p.diff })),
    [pillarComparison]
  );
  const areasNeedingAttention = useMemo(
    () =>
      pillarComparison
        .filter((p) => p.diff < 0)
        .sort((a, b) => a.diff - b.diff)
        .slice(0, 5)
        .map((p) => ({ name: p.short_name, change: p.diff })),
    [pillarComparison]
  );

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#46cdc6]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#46cdc6]/5 rounded-full blur-[100px]" />
      </div>
      <PageHeader centerItems={assessmentHeaderLinks} activePath={location.pathname} />

      {/* Hero */}
      <section className="px-8 pt-12 pb-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#46CDCF]/10 to-amber-500/10 rounded-full mb-6 border border-[#46CDCF]/20">
            <Sparkles className="w-4 h-4 text-[#46CDCF]" />
            <span className="text-sm font-semibold text-[#46CDCF]">COMPARISON</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-4">Compare Assessment Results</h1>
          <p className="text-xl text-slate-600">Side-by-side view of two assessments to track progress and changes.</p>
        </motion.div>
      </section>

      {/* Assessment identification cards */}
      <section className="px-8 pb-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card className="border-2 border-[#46cdc6]/30 bg-[#46cdc6]/5">
            <CardHeader className="pb-2">
              <CardDescription className="text-[#2563eb] font-semibold">Assessment A (Latest)</CardDescription>
              <CardTitle className="text-xl">{assessmentA.assessment_name}</CardTitle>
              <p className="text-sm text-slate-500">{formatDate(assessmentA.completed_at)}</p>
            </CardHeader>
          </Card>
          <Card className="border-2 border-slate-200 bg-white">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-600 font-semibold">Assessment B (Previous)</CardDescription>
              <CardTitle className="text-xl">{assessmentB.assessment_name}</CardTitle>
              <p className="text-sm text-slate-500">{formatDate(assessmentB.completed_at)}</p>
            </CardHeader>
          </Card>
        </motion.div>
      </section>

      {/* Overall Score Comparison */}
      <section className="px-8 pb-10 relative z-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Overall Score Comparison</h2>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="border-2 border-[#46cdc6]/20">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-800 font-semibold">Assessment A</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-[#2563eb]">
                {assessmentA.overall_score?.toFixed(1)} <span className="text-lg font-normal text-slate-500">/ 5</span>
              </div>
              <div className="mt-2 h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#2563eb]"
                  style={{ width: `${Math.min(100, (assessmentA.overall_score / 5) * 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>
          <Card className="border-2 border-slate-200">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-800 font-semibold">Change</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold flex items-center gap-1 ${scoreChange.diff >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {scoreChange.diff >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                {scoreChange.diff >= 0 ? '↑' : '↓'} {Math.abs(scoreChange.diff).toFixed(2)}
              </div>
              <p className={`text-sm mt-1 ${scoreChange.pct >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {scoreChange.pct >= 0 ? '+' : ''}{scoreChange.pct}% change
              </p>
            </CardContent>
          </Card>
          <Card className="border-2 border-slate-200">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-800 font-semibold">Assessment B</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-700">
                {assessmentB.overall_score?.toFixed(1)} <span className="text-lg font-normal text-slate-500">/ 5</span>
              </div>
              <div className="mt-2 h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-slate-500"
                  style={{ width: `${Math.min(100, (assessmentB.overall_score / 5) * 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Pillar-by-Pillar Performance */}
      <section className="px-8 pb-10 relative z-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Pillar-by-Pillar Performance</h2>
        <div className="space-y-4">
          {pillarComparison.map((p, idx) => (
            <motion.div
              key={p.pillar_name || idx}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx }}
            >
              <Card className="border border-slate-200 overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-slate-900">{p.short_name}</h3>
                    <span
                      className={`text-sm font-semibold flex items-center gap-0.5 ${
                        p.diff >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {p.diff >= 0 ? '↑' : '↓'} {Math.abs(p.diff).toFixed(2)}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-700 font-medium w-24 shrink-0">Assessment A</span>
                      <div className="flex-1 h-6 bg-slate-100 rounded overflow-hidden">
                        <div
                          className="h-full rounded bg-[#2563eb]"
                          style={{ width: `${Math.min(100, (p.scoreA / 5) * 100)}%` }}
                        />
                      </div>
                      <span
                        className="text-xs font-medium text-white px-2 py-1 rounded shrink-0"
                        style={{ backgroundColor: MATURITY_COLORS[p.maturityA] || '#6b7280' }}
                      >
                        {p.maturityA}
                      </span>
                      <span className="text-sm font-medium text-slate-700 w-16">{p.scoreA.toFixed(2)} / 5</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-slate-700 font-medium w-24 shrink-0">Assessment B</span>
                      <div className="flex-1 h-6 bg-slate-100 rounded overflow-hidden">
                        <div
                          className="h-full rounded bg-slate-500"
                          style={{ width: `${Math.min(100, (p.scoreB / 5) * 100)}%` }}
                        />
                      </div>
                      <span
                        className="text-xs font-medium text-white px-2 py-1 rounded shrink-0"
                        style={{ backgroundColor: MATURITY_COLORS[p.maturityB] || '#6b7280' }}
                      >
                        {p.maturityB}
                      </span>
                      <span className="text-sm font-medium text-slate-700 w-16">{p.scoreB.toFixed(2)} / 5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Maturity Profile Comparison - Radar */}
      <section className="px-8 pb-10 relative z-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Maturity Profile Comparison</h2>
        <Card className="border border-slate-200 overflow-visible">
          <CardContent className="pt-6 pb-8 px-4" style={{ height: '480px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="70%">
                <PolarGrid stroke="rgba(107,114,128,0.2)" strokeWidth={1.5} />
                <PolarAngleAxis dataKey="pillar" tick={CustomPolarAngleAxisTick} />
                <PolarRadiusAxis angle={90} domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fill: '#6b7280', fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload?.length) {
                      return (
                        <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 min-w-[180px]">
                          <p className="font-semibold text-slate-900 mb-2">{label}</p>
                          {payload.map((entry) => (
                            <div key={entry.name} className="flex justify-between gap-4 text-sm">
                              <span className="text-slate-600">{entry.name}:</span>
                              <span className="font-semibold">{Number(entry.value).toFixed(2)} / 5</span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Radar name="Assessment A" dataKey="Assessment A" stroke="#2563eb" fill="#2563eb" fillOpacity={0.3} strokeWidth={2} dot={{ fill: '#2563eb', r: 4 }} />
                <Radar name="Assessment B" dataKey="Assessment B" stroke="#6b7280" fill="#6b7280" fillOpacity={0.15} strokeWidth={2} dot={{ fill: '#6b7280', r: 4 }} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#2563eb]" />
                <span className="text-sm font-medium">Assessment A</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-500" />
                <span className="text-sm font-medium">Assessment B</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Maturity Level Progression */}
      <section className="px-8 pb-10 relative z-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Maturity Level Progression</h2>
        <Card className="border border-slate-200 overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left py-3 px-4 font-semibold text-slate-900">Pillar</th>
                    {MATURITY_LEVELS_ORDER.map((l) => (
                      <th key={l} className="py-3 px-2 text-center font-medium text-slate-700 min-w-[100px]">
                        {l}
                      </th>
                    ))}
                    <th className="py-3 px-4 text-right font-semibold text-slate-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pillarComparison.map((p) => {
                    const idxA = MATURITY_LEVELS_ORDER.indexOf(p.maturityA);
                    const idxB = MATURITY_LEVELS_ORDER.indexOf(p.maturityB);
                    const improved = idxA > idxB;
                    return (
                      <tr key={p.pillar_name} className="border-b border-slate-100 hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-medium text-slate-900">{p.short_name}</td>
                        {MATURITY_LEVELS_ORDER.map((level, i) => {
                          const isCurrent = level === p.maturityA;
                          const isPrevious = level === p.maturityB && p.maturityB !== p.maturityA;
                          return (
                            <td key={level} className="py-2 px-2 text-center">
                              {isCurrent ? (
                                <span
                                  className="inline-block px-2 py-1 rounded font-medium text-white text-xs"
                                  style={{ backgroundColor: MATURITY_COLORS[level] || '#6b7280' }}
                                >
                                  Current
                                </span>
                              ) : isPrevious ? (
                                <span
                                  className="inline-block px-2 py-1 rounded font-medium text-white/90 text-xs"
                                  style={{ backgroundColor: `${MATURITY_COLORS[level] || '#6b7280'}99` }}
                                >
                                  Previous
                                </span>
                              ) : (
                                <span className="text-slate-300">—</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="py-3 px-4 text-right">
                          {improved ? (
                            <span className="text-emerald-600 font-medium flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Improved
                            </span>
                          ) : (
                            <span className="text-slate-500">No Change</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Key Changes & Insights */}
      <section className="px-8 pb-16 relative z-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Key Changes & Insights</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-emerald-200 bg-emerald-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-emerald-800">
                <Plus className="w-5 h-5" /> New Strengths Achieved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-emerald-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Advanced Security Infrastructure
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Robust Technology Stack
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Clear Strategic Vision
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-2 border-amber-200 bg-amber-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
                <Minus className="w-5 h-5" /> Strengths Lost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-amber-800">
                <li className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" /> Strong Technology Foundation
                </li>
                <li className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" /> Good Security Practices
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                <CheckCircle2 className="w-5 h-5" /> Improvements Addressed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Strategic Planning
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" /> Workforce Development
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-2 border-red-200 bg-red-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-red-800">
                <AlertCircle className="w-5 h-5" /> New Improvement Areas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-red-800">
                <li className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" /> Workforce Skills Gap
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-2 border-emerald-200 bg-emerald-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-emerald-800">
                <TrendingUp className="w-5 h-5" /> Top Improvements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-emerald-800">
                {topImprovements.length > 0 ? (
                  topImprovements.map((item) => (
                    <li key={item.name} className="flex justify-between">
                      <span>{item.name}</span>
                      <span className="font-semibold">+{item.change.toFixed(2)}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500">No improvements in this period</li>
                )}
              </ul>
            </CardContent>
          </Card>
          <Card className="border-2 border-amber-200 bg-amber-50/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-amber-800">
                <TrendingDown className="w-5 h-5" /> Areas Needing Attention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-amber-800">
                {areasNeedingAttention.length > 0 ? (
                  areasNeedingAttention.map((item) => (
                    <li key={item.name} className="flex justify-between">
                      <span>{item.name}</span>
                      <span className="font-semibold">{item.change.toFixed(2)}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500">No areas needing attention</li>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
