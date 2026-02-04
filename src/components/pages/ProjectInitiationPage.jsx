import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, HelpCircle, FilePen, Compass } from 'lucide-react';
import { PageHeader } from '../shared/PageHeader';

/**
 * Project Initiation / Studio Build Selection
 * Lets the user choose: Start from Scratch (open editor) or Guided Setup (wizard).
 * Route: /studio — standalone page.
 */
const STUDIO = {
  primary: '#46cdc6',
  text: '#1a1a1a',
  muted: '#71717a',
};

const studioHeaderLinks = [
  { label: 'Home', path: '/offerings' },
  { label: 'Assessments', path: '/my-assessments' },
  { label: 'Results', path: '/completed-assessments' },
  { label: 'Use Cases', path: '/usecases' },
  { label: 'Studio', path: '/studio' },
];

export function ProjectInitiationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="min-h-screen bg-white flex flex-col antialiased relative overflow-hidden">
      {/* Background orbs – same as /completed-assessments */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#46cdc6]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#46cdc6]/5 rounded-full blur-[100px]" />
      </div>

      <PageHeader centerItems={studioHeaderLinks} activePath={location.pathname} zIndex="z-20" />

      <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-6 md:px-8 pt-20 md:pt-28 pb-12 md:pb-20">
        <div className="max-w-4xl w-full text-center mb-16 md:mb-24">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-bold text-slate-900 tracking-tight leading-tight mb-4">
            Build your <span className="text-[#46cdc6]">business case bank</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
            Explore industry-specific AI implementations or create custom use cases for your organization.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-10 max-w-6xl w-full" style={{ perspective: '1000px' }}>
          {/* Card: Inspire Me (left) → /use-case-explorer */}
          <div
            className="relative group"
            onMouseEnter={() => setHoveredCard('guided')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <button
              type="button"
              onClick={() => navigate('/use-case-explorer')}
              className="w-full p-6 md:p-8 rounded-2xl text-left flex flex-col items-start h-full min-h-0 bg-white/80 backdrop-blur-[12px] border border-slate-200/80 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)]"
            >
              <div className="mb-4 md:mb-5 p-3 bg-slate-100 rounded-xl text-[#0d9488] inline-flex">
                <Compass className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl md:text-2xl font-sans font-bold mb-3 text-slate-900 group-hover:text-[#0d9488] transition-colors">
                Inspire Me
              </h2>
              <p className="text-slate-500 leading-relaxed mb-5 flex-grow text-sm">
                Our AI-driven wizard walks you through the essentials. Ideal for identifying
                high-impact use cases across operations, sales, and logistics.
              </p>
              <div
                className={`flex items-center gap-2 font-semibold transition-all duration-300 ${
                  hoveredCard === 'guided' ? 'gap-4 text-[#0d9488]' : 'gap-2 text-[#0d9488] opacity-90'
                }`}
              >
                <span className="relative overflow-hidden py-1 inline-block">
                  Explore
                  <span className="absolute bottom-0 left-0 w-full h-px bg-current origin-right scale-x-0 group-hover:origin-left group-hover:scale-x-100 transition-transform duration-500" />
                </span>
                <ArrowRight
                  className={`w-5 h-5 transition-transform duration-500 ${
                    hoveredCard === 'guided' ? 'translate-x-1' : ''
                  }`}
                />
              </div>
            </button>
          </div>

          {/* Card: Build your own (right) */}
          <div
            className="relative group"
            onMouseEnter={() => setHoveredCard('scratch')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <button
              type="button"
              className="w-full p-6 md:p-8 rounded-2xl text-left flex flex-col items-start h-full min-h-0 bg-white/80 backdrop-blur-[12px] border border-slate-200/80 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-slate-300 hover:bg-white hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)]"
            >
              <div className="mb-4 md:mb-5 p-3 bg-slate-100 rounded-xl text-[#0d9488] inline-flex">
                <FilePen className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
              </div>
              <h2 className="text-xl md:text-2xl font-sans font-bold mb-3 text-slate-900 group-hover:text-[#0d9488] transition-colors">
                Build your own
              </h2>
              <p className="text-slate-500 leading-relaxed mb-5 flex-grow text-sm">
                Have a clear vision? Jump straight into our advanced editor. Define custom parameters,
                workflows, and technical requirements with full flexibility.
              </p>
              <div
                className={`flex items-center gap-2 font-semibold transition-all duration-300 ${
                  hoveredCard === 'scratch' ? 'gap-4 text-[#0d9488]' : 'gap-2 text-[#0d9488] opacity-90'
                }`}
              >
                <span className="relative overflow-hidden py-1 inline-block">
                  Start Building
                  <span className="absolute bottom-0 left-0 w-full h-px bg-current origin-right scale-x-0 group-hover:origin-left group-hover:scale-x-100 transition-transform duration-500" />
                </span>
                <ArrowRight
                  className={`w-5 h-5 transition-transform duration-500 ${
                    hoveredCard === 'scratch' ? 'translate-x-1' : ''
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* Help button */}
      <div className="fixed bottom-8 right-8 z-20">
        <button
          type="button"
          className="w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 hover:bg-black hover:text-white hover:border-black"
          style={{ borderColor: 'rgba(0,0,0,0.08)' }}
          aria-label="Help"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
