import { useMemo, useState, useEffect } from 'react';
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
  Loader2,
  ChevronDown,
  Landmark,
  Users,
  Database,
  ShieldCheck,
  Shield,
  Settings,
} from 'lucide-react';
import { PageHeader } from '../shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { getOrganizationAssessmentsCompleted, compareAssessments } from '../../services/assessmentService';
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

const ASSESSMENT_A_COLOR = '#2563eb';
const ASSESSMENT_B_COLOR = '#6b7280';

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

/** Normalize compare API response: { assessments, comparison } → { assessmentA, assessmentB, comparison } */
function normalizeCompareResponse(data, idA, idB, completedList) {
  const raw = data?.data ?? data;
  if (!raw) return { assessmentA: null, assessmentB: null, comparison: null };
  const listA = completedList.find((a) => a.id === idA);
  const listB = completedList.find((a) => a.id === idB);
  const toShape = (r, listItem) => ({
    assessment_id: r?.assessment_id ?? r?.id ?? listItem?.id,
    assessment_name: r?.assessment_name ?? r?.name ?? listItem?.name ?? 'Assessment',
    completed_at: r?.completed_at ?? listItem?.completed_at,
    overall_score: Number(r?.overall_score) ?? 0,
    overall_maturity_level: r?.overall_maturity_level ?? 'Established',
    pillar_results: Array.isArray(r?.pillar_results) ? r.pillar_results : [],
  });
  const assessments = Array.isArray(raw.assessments) ? raw.assessments : [];
  const aById = assessments.find((a) => (a.assessment_id || a.id) === idA);
  const bById = assessments.find((a) => (a.assessment_id || a.id) === idB);
  const assessmentA = aById ? toShape(aById, listA) : (assessments[0] ? toShape(assessments[0], listA) : null);
  const assessmentB = bById ? toShape(bById, listB) : (assessments[1] ? toShape(assessments[1], listB) : null);
  return { assessmentA, assessmentB, comparison: raw.comparison ?? null };
}

// Score-based colors for radar (1 = red, 5 = teal) — matches Results page radar styling
const SCORE_COLORS = {
  low: '#ef4444',      // red
  midLow: '#f97316',   // orange
  mid: '#f59e0b',      // amber
  midHigh: '#10b981',  // emerald
  high: '#0d9488',     // teal
};
function hexToRgb(hex) {
  const m = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [0, 0, 0];
}
function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('');
}
function interpolateHex(hex1, hex2, t) {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  return rgbToHex(r1 + (r2 - r1) * t, g1 + (g2 - g1) * t, b1 + (b2 - b1) * t);
}
function scoreToColor(score) {
  const s = Math.max(0, Math.min(5, Number(score) || 0));
  if (s <= 1) return SCORE_COLORS.low;
  if (s <= 2) return interpolateHex(SCORE_COLORS.low, SCORE_COLORS.midLow, (s - 1) / 1);
  if (s <= 3) return interpolateHex(SCORE_COLORS.midLow, SCORE_COLORS.mid, (s - 2) / 1);
  if (s <= 4) return interpolateHex(SCORE_COLORS.mid, SCORE_COLORS.midHigh, (s - 3) / 1);
  return interpolateHex(SCORE_COLORS.midHigh, SCORE_COLORS.high, (s - 4) / 1);
}

// Custom tick for radar
const CustomPolarAngleAxisTick = ({ payload, x, y, cx, cy }) => {
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-payload.coordinate * RADIAN);
  const cos = Math.cos(-payload.coordinate * RADIAN);
  const radius = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
  const outerRadius = radius + 14;
  const textX = cx + outerRadius * cos;
  const textY = cy + outerRadius * sin;
  // Center text on axis when axis is nearly vertical (top/bottom pillars)
  const textAnchor = Math.abs(cos) < 0.4 ? 'middle' : (cos >= 0 ? 'start' : 'end');
  return (
    <g>
      <text x={textX} y={textY} textAnchor={textAnchor} fill="#374151" fontSize={11} fontWeight={500}>
        {payload.value}
      </text>
    </g>
  );
};

// Same radar polygon rendering used on Results page: light wedge fill + gradient stroke along edges
function RadarPolygonGradientStroke({
  points = [],
  colors = [],
  fillColors = [],
  gradientIdBase,
  fillOpacity = 0.18,
  strokeWidth = 2.5,
  strokeDasharray,
  outlineColor,
  outlineWidth,
  outlineDasharray,
  ...rest
}) {
  if (!points.length) return null;
  const cx = points[0]?.cx ?? points.reduce((s, p) => s + p.x, 0) / points.length;
  const cy = points[0]?.cy ?? points.reduce((s, p) => s + p.y, 0) / points.length;
  const base = gradientIdBase || 'radar-stroke';
  return (
    <g {...rest}>
      <defs>
        {points.map((_, i) => {
          const next = (i + 1) % points.length;
          const strokeStart = (colors && colors.length === points.length) ? colors[i] : '#e6e6e6';
          const strokeEnd = (colors && colors.length === points.length) ? colors[next] : '#e6e6e6';
          return (
            <linearGradient
              key={`stroke-${i}`}
              id={`${base}-stroke-${i}`}
              x1={points[i].x}
              y1={points[i].y}
              x2={points[next].x}
              y2={points[next].y}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={strokeStart} />
              <stop offset="100%" stopColor={strokeEnd} />
            </linearGradient>
          );
        })}
        {points.map((_, i) => {
          const next = (i + 1) % points.length;
          const fillStart = (fillColors && fillColors.length === points.length) ? fillColors[i] : ((colors && colors.length === points.length) ? colors[i] : '#f3f4f6');
          const fillEnd = (fillColors && fillColors.length === points.length) ? fillColors[next] : ((colors && colors.length === points.length) ? colors[next] : '#f3f4f6');
          return (
            <linearGradient
              key={`fill-${i}`}
              id={`${base}-fill-${i}`}
              x1={points[i].x}
              y1={points[i].y}
              x2={points[next].x}
              y2={points[next].y}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={fillStart} />
              <stop offset="100%" stopColor={fillEnd} />
            </linearGradient>
          );
        })}
      </defs>
      {/* Light fill (wedge triangles) */}
      {points.map((_, i) => {
        const next = (i + 1) % points.length;
        const d = `M ${cx} ${cy} L ${points[i].x} ${points[i].y} L ${points[next].x} ${points[next].y} Z`;
        return (
          <path
            key={`fill-${i}`}
            d={d}
            fill={`url(#${base}-fill-${i})`}
            fillOpacity={fillOpacity}
          />
        );
      })}
      {/* Outline (thicker) drawn per-edge using the same per-edge gradients so the outline transitions colors between adjacent points */}
      {typeof outlineWidth === 'number' && outlineWidth > 0 && points.map((_, i) => {
        const next = (i + 1) % points.length;
        const d = `M ${points[i].x} ${points[i].y} L ${points[next].x} ${points[next].y}`;
        return (
          <path
            key={`outline-${i}`}
            d={d}
            fill="none"
            stroke={`url(#${base}-stroke-${i})`}
            strokeWidth={outlineWidth}
            strokeLinecap="round"
            strokeDasharray={outlineDasharray || strokeDasharray}
            opacity={0.95}
          />
        );
      })}
      {/* Gradient stroke along each edge (narrower, drawn on top of the outline) */}
      {points.map((_, i) => {
        const next = (i + 1) % points.length;
        const d = `M ${points[i].x} ${points[i].y} L ${points[next].x} ${points[next].y}`;
        return (
          <path
            key={`stroke-${i}`}
            d={d}
            fill="none"
            stroke={`url(#${base}-stroke-${i})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
          />
        );
      })}
    </g>
  );
}

export function ComparisonAssessmentResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [completedList, setCompletedList] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState(null);
  const [selectedIdA, setSelectedIdA] = useState('');
  const [selectedIdB, setSelectedIdB] = useState('');
  const [compareResult, setCompareResult] = useState(null);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [compareError, setCompareError] = useState(null);
  const [dropdownAOpen, setDropdownAOpen] = useState(false);
  const [dropdownBOpen, setDropdownBOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoadingList(true);
    setListError(null);
    getOrganizationAssessmentsCompleted()
      .then((res) => {
        if (cancelled) return;
        const raw = res.data;
        const list = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
            ? raw.data
            : Array.isArray(raw?.assessments)
              ? raw.assessments
              : [];
        if (res.success) {
          setCompletedList(list);
          setListError(null);
        } else {
          setListError(res.error || 'Failed to load assessments');
          setCompletedList(list);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setListError(err?.message || 'Failed to load assessments');
          setCompletedList([]);
        }
      })
      .finally(() => { if (!cancelled) setLoadingList(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!selectedIdA || !selectedIdB || selectedIdA === selectedIdB) {
      setCompareResult(null);
      setCompareError(null);
      return;
    }
    let cancelled = false;
    setLoadingCompare(true);
    setCompareError(null);
    compareAssessments([selectedIdA, selectedIdB])
      .then((res) => {
        if (cancelled) return;
        if (res.success && res.data != null) {
          const payload = res.data?.data ?? res.data;
          const normalized = normalizeCompareResponse(payload, selectedIdA, selectedIdB, completedList);
          setCompareResult(normalized.assessmentA && normalized.assessmentB ? normalized : null);
          if (!normalized.assessmentA || !normalized.assessmentB) setCompareError('Could not parse comparison result.');
        } else {
          setCompareResult(null);
          setCompareError(res.error || 'Failed to load comparison.');
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setCompareResult(null);
          setCompareError(err?.message || 'Failed to load comparison.');
        }
      })
      .finally(() => { if (!cancelled) setLoadingCompare(false); });
    return () => { cancelled = true; };
  }, [selectedIdA, selectedIdB, completedList]);

  const { assessmentA: assessmentADataRaw, assessmentB: assessmentBDataRaw, comparison: comparisonData } = compareResult ?? {};
  const assessmentAData = assessmentADataRaw ?? ASSESSMENT_A;
  const assessmentBData = assessmentBDataRaw ?? ASSESSMENT_B;
  const hasCompareData = compareResult != null && assessmentADataRaw && assessmentBDataRaw;
  const shouldSwapAssessments = useMemo(() => {
    if (!selectedIdA || !selectedIdB) return false;
    const aId = assessmentADataRaw?.assessment_id ?? assessmentADataRaw?.id ?? assessmentAData?.assessment_id ?? assessmentAData?.id;
    const bId = assessmentBDataRaw?.assessment_id ?? assessmentBDataRaw?.id ?? assessmentBData?.assessment_id ?? assessmentBData?.id;
    if (!aId || !bId) return false;
    return aId !== selectedIdA && bId === selectedIdA;
  }, [assessmentADataRaw, assessmentBDataRaw, assessmentAData, assessmentBData, selectedIdA, selectedIdB]);
  const displayAssessmentA = shouldSwapAssessments ? assessmentBData : assessmentAData;
  const displayAssessmentB = shouldSwapAssessments ? assessmentAData : assessmentBData;

  const optionsForA = completedList.filter((a) => a.id !== selectedIdB);
  const optionsForB = completedList.filter((a) => a.id !== selectedIdA);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownAOpen && !e.target.closest('.comparison-dropdown-a')) setDropdownAOpen(false);
      if (dropdownBOpen && !e.target.closest('.comparison-dropdown-b')) setDropdownBOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownAOpen, dropdownBOpen]);

  const scoreChange = useMemo(() => {
    const a = displayAssessmentA.overall_score ?? 0;
    const b = displayAssessmentB.overall_score ?? 0;
    const diff = Math.round((a - b) * 100) / 100;
    const pct = b !== 0 ? Math.round(((a - b) / b) * 1000) / 10 : 0;
    return { diff, pct };
  }, [displayAssessmentA.overall_score, displayAssessmentB.overall_score]);

  const pillarComparison = useMemo(() => {
    if (Array.isArray(comparisonData?.pillar_comparison) && comparisonData.pillar_comparison.length > 0) {
      return comparisonData.pillar_comparison
        .filter((p) => p?.pillar_name)
        .sort((x, y) => (x.pillar_order ?? 0) - (y.pillar_order ?? 0))
        .map((p) => ({
          pillar_name: p.pillar_name,
          short_name: PILLAR_SHORT_NAMES[p.pillar_name] || p.pillar_name,
          pillar_order: p.pillar_order ?? 0,
          scoreA: Number(shouldSwapAssessments ? p.assessment_2_score : p.assessment_1_score) ?? 0,
          scoreB: Number(shouldSwapAssessments ? p.assessment_1_score : p.assessment_2_score) ?? 0,
          maturityA: (shouldSwapAssessments ? p.assessment_2_maturity : p.assessment_1_maturity) || 'Established',
          maturityB: (shouldSwapAssessments ? p.assessment_1_maturity : p.assessment_2_maturity) || 'Established',
          diff: Math.round(Number(p.score_difference) * 100) / 100,
          improved: p.improved,
          declined: p.declined,
        }))
        .filter((p) => p?.pillar_name);
    }
    const aPillars = (displayAssessmentA.pillar_results || []).sort((x, y) => x.pillar_order - y.pillar_order);
    const bPillars = (displayAssessmentB.pillar_results || []).sort((x, y) => x.pillar_order - y.pillar_order);
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
    }).filter((p) => p?.pillar_name);
  }, [comparisonData?.pillar_comparison, displayAssessmentA.pillar_results, displayAssessmentB.pillar_results, shouldSwapAssessments]);

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
  // Maturity colors per pillar for Assessment A / B (used for fill gradients)
  const maturityFillA = useMemo(() => pillarComparison.map((p) => MATURITY_COLORS[p.maturityA] || DEFAULT_MATURITY_COLOR), [pillarComparison]);
  const maturityFillB = useMemo(() => pillarComparison.map((p) => MATURITY_COLORS[p.maturityB] || DEFAULT_MATURITY_COLOR), [pillarComparison]);

  const topImprovements = useMemo(() => {
    const list = pillarComparison.filter((p) => p.improved === true || (p.improved !== false && p.diff > 0));
    return list
      .sort((a, b) => b.diff - a.diff)
      .slice(0, 5)
      .map((p) => ({ name: p.short_name, change: p.diff }));
  }, [pillarComparison]);
  const areasNeedingAttention = useMemo(() => {
    const list = pillarComparison.filter((p) => p.declined === true || (p.declined !== false && p.diff < 0));
    return list
      .sort((a, b) => a.diff - b.diff)
      .slice(0, 5)
      .map((p) => ({ name: p.short_name, change: p.diff }));
  }, [pillarComparison]);

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

      {/* Assessment selection and identification */}
      <section className="px-8 pb-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card className="glass bg-[#eff6ff]/80 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50 min-w-0 overflow-visible">
            <CardHeader className="pb-2 min-w-0 overflow-visible">
              <CardDescription className="font-semibold mb-2" style={{ color: ASSESSMENT_A_COLOR }}>Assessment A (Latest)</CardDescription>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select assessment</label>
              <div className="relative comparison-dropdown-a min-w-0">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setDropdownBOpen(false); setDropdownAOpen((v) => !v); }}
                  disabled={loadingList || completedList.length === 0}
                  className={`
                    w-full min-w-0 overflow-hidden px-4 py-3 bg-white text-left rounded shadow-sm tracking-[0.05rem]
                    border border-blue-200 flex justify-between items-center gap-2
                    transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                    ${dropdownAOpen ? 'ring-2 ring-[#3b82f6]' : 'hover:border-[#3b82f6]'}
                  `}
                >
                  <span className={`min-w-0 flex-1 truncate block overflow-hidden text-ellipsis ${selectedIdA ? 'text-[#1a1a1a]' : 'text-gray-400'}`}>
                    {selectedIdA
                      ? (() => {
                        const a = completedList.find((x) => x.id === selectedIdA);
                        return a ? `${a.name || 'Assessment'} — ${formatDate(a.completed_at)}` : 'Select assessment';
                      })()
                      : 'Select assessment'}
                  </span>
                  <div className="bg-[#3b82f6] px-1.5 py-1 rounded shrink-0">
                    <ChevronDown className={`w-4 h-4 text-white transition-transform duration-200 ${dropdownAOpen ? 'rotate-180' : ''}`} strokeWidth={2} />
                  </div>
                </button>
                {dropdownAOpen && !loadingList && (
                    <div className="absolute w-full mt-1 rounded shadow-sm border border-blue-200 overflow-hidden z-[60] bg-white">
                    <div className="max-h-48 overflow-y-auto">
                      <button
                        type="button"
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors text-slate-700"
                        onClick={(e) => { e.stopPropagation(); setSelectedIdA(''); setDropdownAOpen(false); }}
                      >
                        Select assessment
                      </button>
                      {optionsForA.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500">No assessments available</div>
                      ) : (
                        optionsForA.map((a) => (
                          <button
                            key={a.id}
                            type="button"
                            className={`
                              w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors
                              ${selectedIdA === a.id ? 'text-[#3b82f6] bg-blue-50' : 'text-[#1a1a1a]'}
                            `}
                            onClick={(e) => { e.stopPropagation(); setSelectedIdA(a.id); setDropdownAOpen(false); }}
                          >
                            {a.name || 'Assessment'} — {formatDate(a.completed_at)}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              {hasCompareData && (
                <>
                  <p className="text-lg font-semibold text-slate-900 mt-3 break-words">
                    {displayAssessmentA.assessment_name || '—'}
                  </p>
                  <p className="text-sm text-slate-600">{formatDate(displayAssessmentA.completed_at)}</p>
                </>
              )}
            </CardHeader>
          </Card>
          <Card className="glass bg-[#f1f5f9]/80 dark:bg-slate-900/40 border border-slate-300 dark:border-slate-700 min-w-0 overflow-visible">
            <CardHeader className="pb-2 min-w-0 overflow-visible">
              <CardDescription className="text-slate-600 font-semibold mb-2">Assessment B (Previous)</CardDescription>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select assessment</label>
              <div className="relative comparison-dropdown-b min-w-0">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setDropdownAOpen(false); setDropdownBOpen((v) => !v); }}
                  disabled={loadingList || completedList.length === 0}
                  className={`
                    w-full min-w-0 overflow-hidden px-4 py-3 bg-white text-left rounded shadow-sm tracking-[0.05rem]
                    border border-slate-300 flex justify-between items-center gap-2
                    transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed
                    ${dropdownBOpen ? 'ring-2 ring-[#334155]' : 'hover:border-[#334155]'}
                  `}
                >
                  <span className={`min-w-0 flex-1 truncate block overflow-hidden text-ellipsis ${selectedIdB ? 'text-[#1a1a1a]' : 'text-gray-400'}`}>
                    {selectedIdB
                      ? (() => {
                        const a = completedList.find((x) => x.id === selectedIdB);
                        return a ? `${a.name || 'Assessment'} — ${formatDate(a.completed_at)}` : 'Select assessment';
                      })()
                      : 'Select assessment'}
                  </span>
                  <div className="bg-[#334155] px-1.5 py-1 rounded shrink-0">
                    <ChevronDown className={`w-4 h-4 text-white transition-transform duration-200 ${dropdownBOpen ? 'rotate-180' : ''}`} strokeWidth={2} />
                  </div>
                </button>
                {dropdownBOpen && !loadingList && (
                    <div className="absolute w-full mt-1 rounded shadow-sm border border-slate-300 overflow-hidden z-[60] bg-white">
                    <div className="max-h-48 overflow-y-auto">
                      <button
                        type="button"
                        className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors text-slate-700"
                        onClick={(e) => { e.stopPropagation(); setSelectedIdB(''); setDropdownBOpen(false); }}
                      >
                        Select assessment
                      </button>
                      {optionsForB.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500">No assessments available</div>
                      ) : (
                        optionsForB.map((a) => (
                          <button
                            key={a.id}
                            type="button"
                            className={`
                              w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors
                              ${selectedIdB === a.id ? 'text-[#334155] bg-slate-100' : 'text-[#1a1a1a]'}
                            `}
                            onClick={(e) => { e.stopPropagation(); setSelectedIdB(a.id); setDropdownBOpen(false); }}
                          >
                            {a.name || 'Assessment'} — {formatDate(a.completed_at)}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              {hasCompareData && (
                <>
                  <p className="text-lg font-semibold text-slate-900 mt-3 break-words">
                    {displayAssessmentB.assessment_name || '—'}
                  </p>
                  <p className="text-sm text-slate-600">{formatDate(displayAssessmentB.completed_at)}</p>
                </>
              )}
            </CardHeader>
          </Card>
        </motion.div>
        {listError && (
          <p className="mt-4 text-sm text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {listError}
          </p>
        )}
        {loadingCompare && selectedIdA && selectedIdB && selectedIdA !== selectedIdB && (
          <p className="mt-4 flex items-center gap-2 text-slate-600">
            <Loader2 className="w-5 h-5 animate-spin shrink-0" /> Loading comparison…
          </p>
        )}
        {compareError && (
          <p className="mt-4 text-sm text-red-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {compareError}
          </p>
        )}
        {!hasCompareData && !loadingCompare && (
          <p className="mt-6 text-center text-slate-500 font-medium">
            Select two assessments above to view the comparison.
          </p>
        )}
      </section>

      {/* Comparison content — only when we have compare API result */}
      {hasCompareData && (
        <>
          {/* Overall Score Comparison */}
          <section className="px-8 pb-12 relative z-10 w-full">
            <header className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Overall Score Comparison
              </h2>
            </header>

            <div className="bg-white dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 rounded-2xl shadow-sm p-8">
              <div className="hidden md:block absolute left-0 top-1/2 w-full h-px bg-slate-100 dark:bg-slate-800 -translate-y-1/2"></div>
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-10 md:gap-4">
                <div className="flex items-center gap-6 bg-white dark:bg-slate-900/60 pr-6">
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full text-slate-100 dark:text-slate-800">
                      <circle cx="48" cy="48" r="44" fill="transparent" stroke="currentColor" strokeWidth="4"></circle>
                      <circle
                        cx="48"
                        cy="48"
                        r="44"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        className="text-[#3b82f6]"
                        style={{
                          strokeDasharray: 276,
                          strokeDashoffset: 276 - (276 * (displayAssessmentA.overall_score ?? 0)) / 5,
                          transform: 'rotate(-90deg)',
                          transformOrigin: '50% 50%',
                        }}
                      ></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-[#3b82f6]">
                        {displayAssessmentA.overall_score?.toFixed(1) || '0.0'}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-tighter">out of 5</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Assessment A</p>
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                      {displayAssessmentA.assessment_name || 'Assessment A'}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col items-center px-8 py-2 bg-white dark:bg-slate-900/60">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Performance Gap</p>
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-end gap-2">
                      <span className="text-5xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight leading-none">
                        {Math.abs(scoreChange.diff).toFixed(2)}
                      </span>
                      <div className="flex flex-col">
                        {scoreChange.diff >= 0 ? (
                          <TrendingUp className="w-5 h-5 text-emerald-500 -mb-1" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-rose-500 -mb-1" />
                        )}
                        <span className={`text-sm font-bold ${scoreChange.diff >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {scoreChange.pct >= 0 ? '+' : ''}{scoreChange.pct}%
                        </span>
                      </div>
                    </div>
                    <div className={`mt-4 px-3 py-1 text-xs font-semibold rounded-full border ${scoreChange.diff >= 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                      {scoreChange.diff >= 0 ? 'Variance Improvement' : 'Variance Decline'}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row-reverse items-center gap-6 bg-white dark:bg-slate-900/60 pl-6 text-center md:text-right">
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full text-slate-100 dark:text-slate-800">
                      <circle cx="48" cy="48" r="44" fill="transparent" stroke="currentColor" strokeWidth="4"></circle>
                      <circle
                        cx="48"
                        cy="48"
                        r="44"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        className="text-slate-600 dark:text-slate-400"
                        style={{
                          strokeDasharray: 276,
                          strokeDashoffset: 276 - (276 * (displayAssessmentB.overall_score ?? 0)) / 5,
                          transform: 'rotate(-90deg)',
                          transformOrigin: '50% 50%',
                        }}
                      ></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-slate-700 dark:text-slate-200">
                        {displayAssessmentB.overall_score?.toFixed(1) || '0.0'}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-tighter">out of 5</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Assessment B</p>
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                      {displayAssessmentB.assessment_name || 'Assessment B'}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </section>


          {/* Pillar-by-Pillar Performance */}
          <section className="px-8 pb-12 relative z-10 w-full">
            <header className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Pillar-by-Pillar Performance
              </h2>
            </header>

            <div className="space-y-6">
              {pillarComparison.map((p, idx) => {
                const PILLAR_ICONS = {
                  'Strategic Value & Governance': Landmark,
                  'Workforce Skillset & Organization Structure': Users,
                  'Technology & Data': Database,
                  'Resilience, Performance & Impact': TrendingUp,
                  'Ethics, Trust & Responsible AI': ShieldCheck,
                  'Compliance, Security & Risk': Shield,
                  'Operations & Implementation': Settings,
                };

                const MATURITY_STYLE_MAP = {
                  'Initial': 'badge-glow-initial',
                  'Adopting': 'badge-glow-adopting',
                  'Established': 'badge-glow-established',
                  'Advanced': 'badge-glow-advanced',
                  'Transformational': 'badge-glow-transformational',
                  'Developing': 'badge-glow-developing',
                };

                const Icon = PILLAR_ICONS[p.pillar_name] || AlertCircle;
                const maturityAClass = MATURITY_STYLE_MAP[p.maturityA] || 'badge-glow-established';
                const maturityBClass = MATURITY_STYLE_MAP[p.maturityB] || 'badge-glow-established';

                return (
                  <div
                    key={p.pillar_name || idx}
                    className="relative bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{p.pillar_name}</h2>
                        </div>

                        <div className="space-y-8">
                          {/* Assessment A */}
                          <div className="group">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-[#3b82f6]">Assessment A</span>
                              <div className="flex items-center gap-3">
                                <div className={`maturity-badge ${maturityAClass}`}>{p.maturityA}</div>
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{p.scoreA?.toFixed(2)} / 5.0</span>
                              </div>
                            </div>
                            <div className="capsule-bar">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(p.scoreA / 5) * 100}%` }}
                                transition={{ duration: 1, delay: 0.2 + idx * 0.1 }}
                                className="capsule-fill bg-[#3b82f6]"
                              ></motion.div>
                            </div>
                          </div>

                          {/* Assessment B */}
                          <div className="group">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-[#64748b]">Assessment B</span>
                              <div className="flex items-center gap-3">
                                <div className={`maturity-badge ${maturityBClass}`}>{p.maturityB}</div>
                                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{p.scoreB?.toFixed(2)} / 5.0</span>
                              </div>
                            </div>
                            <div className="capsule-bar">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(p.scoreB / 5) * 100}%` }}
                                transition={{ duration: 1, delay: 0.3 + idx * 0.1 }}
                                className="capsule-fill bg-[#64748b]"
                              ></motion.div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Variance */}
                      <div className="flex flex-col items-center justify-center px-8 border-l border-slate-200 dark:border-slate-800 ml-0 md:ml-4">
                        <div className="flex flex-col items-center group">
                          {p.diff >= 0 ? (
                            <TrendingUp className="w-7 h-7 text-emerald-500 mb-1" />
                          ) : (
                            <TrendingDown className="w-7 h-7 text-rose-500 mb-1" />
                          )}
                          <div className="text-2xl font-black text-slate-800 dark:text-slate-100">{Math.abs(p.diff).toFixed(2)}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Variance</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                                  <span className="font-semibold">
                                    <span style={{ color: scoreToColor(entry.value) }}>{Number(entry.value).toFixed(2)}</span>
                                    <span style={{ color: '#374151' }}> / 5</span>
                                  </span>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Radar
                      name="Assessment A"
                      dataKey="Assessment A"
                      stroke="transparent"
                      fill="transparent"
                      strokeWidth={0}
                      shape={
                        <RadarPolygonGradientStroke
                          colors={radarData.map((d) => scoreToColor(d['Assessment A']))}
                          fillColors={maturityFillA}
                          gradientIdBase="cmp-radar-a"
                          fillOpacity={0.30}
                          strokeWidth={2.5}
                          outlineColor={ASSESSMENT_A_COLOR}
                          outlineWidth={3}
                        />
                      }
                      dot={({ cx, cy, value }) => {
                        const color = scoreToColor(value);
                        return (
                          <g>
                            <circle cx={cx} cy={cy} r={12} fill={color} fillOpacity={0.35} />
                            <circle cx={cx} cy={cy} r={7} fill={color} stroke="#fff" strokeWidth={2} />
                          </g>
                        );
                      }}
                      activeDot={({ cx, cy, value }) => {
                        const color = scoreToColor(value);
                        return (
                          <g>
                            <circle cx={cx} cy={cy} r={14} fill={color} fillOpacity={0.35} />
                            <circle cx={cx} cy={cy} r={8} fill={color} stroke="#fff" strokeWidth={2} />
                          </g>
                        );
                      }}
                      connectNulls
                      isAnimationActive={false}
                    />
                    <Radar
                      name="Assessment B"
                      dataKey="Assessment B"
                      stroke="transparent"
                      fill="transparent"
                      strokeWidth={0}
                      shape={
                        <RadarPolygonGradientStroke
                          colors={radarData.map((d) => scoreToColor(d['Assessment B']))}
                          fillColors={maturityFillB}
                          gradientIdBase="cmp-radar-b"
                          fillOpacity={0.10}
                          strokeWidth={2.5}
                          outlineColor={ASSESSMENT_B_COLOR}
                          outlineWidth={3}
                          outlineDasharray="1 6"
                        />
                      }
                      dot={({ cx, cy, value }) => {
                        const color = scoreToColor(value);
                        return (
                          <g opacity={0.9}>
                            <circle cx={cx} cy={cy} r={11} fill={color} fillOpacity={0.3} />
                            <circle cx={cx} cy={cy} r={6.5} fill={color} stroke="#fff" strokeWidth={2} />
                          </g>
                        );
                      }}
                      activeDot={({ cx, cy, value }) => {
                        const color = scoreToColor(value);
                        return (
                          <g opacity={0.95}>
                            <circle cx={cx} cy={cy} r={13} fill={color} fillOpacity={0.3} />
                            <circle cx={cx} cy={cy} r={7.5} fill={color} stroke="#fff" strokeWidth={2} />
                          </g>
                        );
                      }}
                      connectNulls
                      isAnimationActive={false}
                    />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-4 items-center">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12"
                      style={{
                        height: 8,
                        display: 'inline-block',
                        borderRadius: 6,
                        background: `linear-gradient(90deg, ${MATURITY_COLORS.Initial}, ${MATURITY_COLORS.Adopting}, ${MATURITY_COLORS.Established}, ${MATURITY_COLORS.Advanced}, ${MATURITY_COLORS.Transformational})`,
                        boxShadow: `0 2px 6px rgba(0,0,0,0.06)`,
                      }}
                    />
                    <span className="text-sm font-medium text-slate-700">Assessment A</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12"
                      style={{
                        height: 8,
                        display: 'inline-block',
                        borderRadius: 6,
                        background: `linear-gradient(90deg, ${MATURITY_COLORS.Initial}, ${MATURITY_COLORS.Adopting}, ${MATURITY_COLORS.Established}, ${MATURITY_COLORS.Advanced}, ${MATURITY_COLORS.Transformational})`,
                        WebkitMaskImage: `repeating-linear-gradient(90deg, black 0 4px, transparent 4px 9px)`,
                        maskImage: `repeating-linear-gradient(90deg, black 0 4px, transparent 4px 9px)`,
                        transform: 'translateY(1px)',
                      }}
                    />
                    <span className="text-sm font-medium text-slate-700">Assessment B</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Maturity Level Progression */}
          <section className="px-8 pb-10 relative z-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Maturity Level Progression</h2>
            <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 lg:p-10 shadow-xl">
              <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr] gap-4 mb-6 pb-6 border-b border-slate-200/70">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400 px-2">Pillar</div>
                {MATURITY_LEVELS_ORDER.map((l) => (
                  <div key={l} className="text-xs font-bold uppercase tracking-widest text-slate-400 text-center">
                    {l}
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                {pillarComparison.map((p) => {
                  const PILLAR_ICONS = {
                    'Strategic Value & Governance': Landmark,
                    'Workforce Skillset & Organization Structure': Users,
                    'Technology & Data': Database,
                    'Resilience, Performance & Impact': TrendingUp,
                    'Ethics, Trust & Responsible AI': ShieldCheck,
                    'Compliance, Security & Risk': Shield,
                    'Operations & Implementation': Settings,
                  };
                  const Icon = PILLAR_ICONS[p.pillar_name] || AlertCircle;
                  const idxA = Math.max(0, MATURITY_LEVELS_ORDER.indexOf(p.maturityA));
                  const idxB = Math.max(0, MATURITY_LEVELS_ORDER.indexOf(p.maturityB));
                  const improved = p.improved === true || (p.improved !== false && idxA > idxB);
                  const declined = p.declined === true || (p.declined !== false && idxA < idxB);
                  const noChange = !improved && !declined;
                  const maxIndex = MATURITY_LEVELS_ORDER.length - 1;
                  const posA = maxIndex ? (idxA / maxIndex) * 100 : 0;
                  const posB = maxIndex ? (idxB / maxIndex) * 100 : 0;
                  const left = Math.min(posA, posB);
                  const width = Math.abs(posA - posB);
                  const mid = (posA + posB) / 2;
                  const diffValue = Number.isFinite(p.diff) ? p.diff : 0;
                  const diffLabel = `${diffValue >= 0 ? '+' : ''}${diffValue.toFixed(2)}`;

                  return (
                    <div key={p.pillar_name} className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr] gap-4 items-center">
                      <div className="flex items-center gap-4 px-2">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 dark:text-slate-100">{p.short_name}</h3>
                          <div className={`flex items-center gap-1 text-[10px] font-bold uppercase ${improved ? 'text-emerald-500' : declined ? 'text-rose-500' : 'text-slate-400'}`}>
                            {improved ? <TrendingUp className="w-3 h-3" /> : declined ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                            {improved ? 'Improved' : declined ? 'Declined' : 'No Change'}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-5 relative h-20">
                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 bg-slate-100 dark:bg-slate-700/50 rounded-full z-0"></div>

                        {noChange ? (
                          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center" style={{ left: `${posA}%` }}>
                            <div className="text-[10px] font-bold text-slate-500 bg-slate-200/70 rounded-full px-2 py-0.5 mb-2 shadow-sm">
                              {diffLabel}
                            </div>
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-800"
                              style={{ backgroundColor: ASSESSMENT_A_COLOR }}
                            >
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ASSESSMENT_B_COLOR }} />
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20" style={{ left: `${posB}%` }}>
                              <div
                                className="w-6 h-6 rounded-full border-4 border-white dark:border-slate-800 shadow-lg"
                                style={{ backgroundColor: ASSESSMENT_B_COLOR }}
                              />
                            </div>
                            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20" style={{ left: `${posA}%` }}>
                              <div
                                className="w-6 h-6 rounded-full border-4 border-white dark:border-slate-800 shadow-lg"
                                style={{ backgroundColor: ASSESSMENT_A_COLOR }}
                              />
                            </div>
                            <div
                              className={`absolute top-1/2 -translate-y-1/2 h-2 rounded-full z-10 ${improved ? 'bg-emerald-500' : 'bg-rose-500'}`}
                              style={{ left: `${left}%`, width: `${width}%` }}
                            />
                            <div
                              className={`absolute -top-2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm border border-white/70 ${improved ? 'bg-emerald-500' : 'bg-rose-500'}`}
                              style={{ left: `${mid}%` }}
                            >
                              {diffLabel}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 border-t border-slate-200/70 pt-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ASSESSMENT_A_COLOR }} />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Assessment A (Blue)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ASSESSMENT_B_COLOR }} />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Assessment B (Grey)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Improved</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1.5 rounded-full bg-rose-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Declined</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: ASSESSMENT_A_COLOR }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ASSESSMENT_B_COLOR }} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">No Change</span>
                </div>
              </div>
            </div>
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

          {/* Background Blobs */}
          <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-20 dark:opacity-10 overflow-hidden">
            <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#3b82f6] blur-[160px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#64748b] blur-[160px] rounded-full"></div>
          </div>
          {/* Action Footer */}
          <footer className="mt-12 mb-20 flex justify-center relative z-10">
            <button className="px-10 py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-full font-bold shadow-xl hover:-translate-y-1 transition-all active:translate-y-0 flex items-center gap-3">
              <span className="material-symbols-outlined">analytics</span>
              Export Detailed Assessment
            </button>
          </footer>
        </>
      )}
    </div>
  );
}
