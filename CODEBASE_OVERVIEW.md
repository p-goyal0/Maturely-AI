# AI Maturity Platform - Codebase Overview

## 🏗️ Architecture Overview

This is a **React + Vite** single-page application (SPA) for an AI Maturity Assessment Platform. The app uses **state-based routing** (no React Router) and follows a component-based architecture.

---

## 📁 Project Structure

```
src/
├── App.jsx                    # Main app component with routing logic
├── main.jsx                   # React entry point
├── index.css                  # Global styles
├── components/
│   ├── pages/                 # Main page components
│   │   ├── HomePage.jsx       # Landing page (default export)
│   │   ├── AssessmentsDashboard.jsx
│   │   ├── AssessmentQuestionnaire.jsx
│   │   ├── ResultsDashboard.jsx
│   │   ├── RoadmapGenerator.jsx
│   │   ├── UseCaseLibrary.jsx
│   │   ├── LoginPage.jsx
│   │   ├── SignInPage.jsx
│   │   └── SignUpPage.jsx
│   ├── shared/
│   │   └── Navigation.jsx    # Shared navigation component
│   └── ui/                    # Reusable UI components (Radix UI based)
│       ├── button.jsx
│       ├── card.jsx
│       ├── badge.jsx
│       └── ... (40+ components)
```

---

## 🔄 Navigation & Routing System

### How It Works:
1. **App.jsx** maintains the current page state: `currentPage` and `selectedIndustry`
2. **No React Router** - uses conditional rendering based on state
3. All pages receive `onNavigate(page, industry?)` callback
4. Navigation component passes `onNavigate` to all child components

### Page Routes:
- `"home"` → HomePage
- `"assessments"` → AssessmentsDashboard
- `"questionnaire"` → AssessmentQuestionnaire
- `"results"` → ResultsDashboard
- `"roadmap"` → RoadmapGenerator
- `"usecases"` → UseCaseLibrary
- `"login"` → LoginPage
- `"signin"` → SignInPage
- `"signup"` → SignUpPage

### Navigation Flow:
```
HomePage → AssessmentsDashboard → AssessmentQuestionnaire → ResultsDashboard
                ↓
         RoadmapGenerator / UseCaseLibrary
```

---

## 🎨 Tech Stack

### Core:
- **React 18.3.1** - UI library
- **Vite 6.3.5** - Build tool & dev server
- **Tailwind CSS 4.1.17** - Styling
- **Framer Motion** - Animations

### UI Components:
- **Radix UI** - Headless UI primitives (40+ components)
- **Lucide React** - Icons
- **Recharts** - Data visualization (charts)

### Key Libraries:
- `motion/react` - Animation library (used instead of framer-motion in some places)
- `class-variance-authority` - Component variants
- `tailwind-merge` - Tailwind class merging

---

## 📊 Data Flow & State Management

### Current State:
- **No global state management** (Redux/Context/Zustand)
- Each component manages its own local state with `useState`
- App.jsx only manages:
  - `currentPage` - Current route
  - `selectedIndustry` - Selected industry filter

### Assessment Flow:
1. **AssessmentsDashboard** - Shows 7 assessment pillars
2. **AssessmentQuestionnaire** - Multi-step form with questions
3. **ResultsDashboard** - Displays results with charts (mock data)

### Data Structures:

#### Assessment Pillars (7 dimensions):
- Strategy & Vision
- Workforce & Culture
- Technology & Infrastructure
- Data & Analytics
- Performance & Value
- Governance & Ethics
- Security & Privacy

#### Maturity Levels (1-5):
1. Initial (Ad-hoc)
2. Developing (Basic awareness)
3. Defined (Documented)
4. Managed (Measured)
5. Optimized (Continuous improvement)

---

## 🎯 Key Components Breakdown

### 1. HomePage.jsx
- **Purpose**: Marketing landing page
- **Features**:
  - Hero section with animated gradient
  - Platform modules showcase (Assessments, Roadmaps, Use Cases)
  - AI capabilities carousel
  - Industries showcase (infinite scroll)
  - Pricing section
  - Trusted logos
- **State**: `currentCapability`, `currentCardIndex`, `isDragging`
- **Animations**: Auto-rotating carousels, slide-up animations

### 2. AssessmentsDashboard.jsx
- **Purpose**: Assessment overview and pillar selection
- **Props**: `onNavigate`, `selectedIndustry`, `onIndustrySelect`
- **Features**:
  - Industry selector dropdown
  - 7 assessment pillars with progress indicators
  - Status badges (Completed, In Progress, Not Started)
- **Navigation**: → `questionnaire` page

### 3. AssessmentQuestionnaire.jsx
- **Purpose**: Multi-step assessment form
- **State**: `currentQuestion`, `answers[]`, `showSuccess`
- **Features**:
  - Section progress tracking
  - 5 maturity level selection
  - Question navigation (prev/next)
  - Success screen before redirect
- **Navigation**: → `results` page on completion

### 4. ResultsDashboard.jsx
- **Purpose**: Display assessment results
- **Features**:
  - Radar chart (Recharts) - 7 pillars comparison
  - Bar chart - Score breakdown
  - Pillar score cards
  - Strengths & weaknesses sections
  - Recommendations
- **Data**: Mock data (hardcoded scores)

### 5. RoadmapGenerator.jsx
- **Purpose**: AI transformation roadmap
- **Features**:
  - 3-phase timeline (Foundation, Acceleration, Scale & Optimize)
  - Key milestones
  - Initiative cards with budgets/resources
  - Priority badges
- **Data**: Hardcoded roadmap structure

### 6. UseCaseLibrary.jsx
- **Purpose**: Browse AI use cases by industry
- **State**: `searchQuery`, `selectedIndustry`, `selectedUseCase`
- **Features**:
  - Search functionality
  - Industry filtering
  - Use case cards with details
  - Modal for detailed view
- **Data**: 6 hardcoded use cases

### 7. Navigation.jsx
- **Purpose**: Shared navigation bar
- **Props**: `onNavigate`, `currentPage`
- **Features**:
  - Responsive (mobile menu)
  - Active page highlighting
  - Sign In/Sign Up buttons
  - Logo click → home

---

## 🎨 Styling System

### Tailwind CSS Configuration:
- Custom color scheme: Blue/Cyan/Purple gradients
- Dark theme primary (slate-900/950 backgrounds)
- Glass morphism effects (`glass-light`, `glass-light-elevated`)
- Custom animations via CSS keyframes

### Design Patterns:
- **Dark backgrounds** with gradient overlays
- **Card-based layouts** with glass morphism
- **Gradient buttons** (blue → cyan)
- **Badge system** for status indicators
- **Responsive grid layouts**

### Animation Strategy:
- **Framer Motion** for component animations
- **CSS keyframes** for text animations
- **Auto-rotating carousels** with useEffect
- **Hover effects** with Tailwind transitions

---

## 🔧 Configuration Files

### vite.config.js
- React SWC plugin (fast compilation)
- Path alias: `@` → root directory
- Port: 5173
- Build: Terser minification

### tailwind.config.js
- Content paths: `src/**/*`, `app/**/*`, `components/**/*`
- Basic theme extension

### package.json
- Scripts: `dev`, `build`, `preview`
- 70+ dependencies (mostly Radix UI components)

---

## 📦 Key Dependencies

### UI Framework:
- `@radix-ui/*` - 20+ headless UI components
- `lucide-react` - Icon library
- `recharts` - Chart library

### Styling:
- `tailwindcss` - Utility-first CSS
- `tailwindcss-animate` - Animation utilities
- `class-variance-authority` - Component variants

### Development:
- `@vitejs/plugin-react-swc` - Fast React compiler
- `vite` - Build tool

---

## 🚀 Development Workflow

### Running the App:
```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Production build
npm run preview  # Preview production build
```

### File Naming:
- Components: PascalCase (e.g., `HomePage.jsx`)
- UI components: lowercase (e.g., `button.jsx`)
- Pages: PascalCase in `pages/` folder

---

## 🔍 Current Limitations & Notes

### State Management:
- No persistent state (localStorage/sessionStorage)
- No API integration (all data is hardcoded)
- No authentication system (UI only)

### Data:
- Assessment results are mock data
- Use cases are hardcoded (6 examples)
- Roadmap is static template
- No backend integration

### Routing:
- No URL-based routing (no browser history)
- Page refreshes reset to home
- No deep linking support

---

## 🎯 Component Communication Pattern

```
App.jsx (State Manager)
  ├── currentPage state
  ├── selectedIndustry state
  └── navigate(page, industry) function
       │
       ├── HomePage
       │    └── Navigation (shared)
       │
       ├── AssessmentsDashboard
       │    ├── Navigation (shared)
       │    └── onIndustrySelect → App state
       │
       └── Other Pages...
            └── Navigation (shared)
```

**Pattern**: Props drilling - `onNavigate` passed down through components

---

## 📝 Code Style

### Imports:
- React hooks: `useState`, `useEffect`
- Components: Named exports (except HomePage default)
- Icons: Destructured from `lucide-react`
- Motion: `motion` from `motion/react` or `framer-motion`

### Component Structure:
1. Imports
2. Component function
3. State declarations
4. Data arrays/objects
5. Handler functions
6. JSX return

### Styling:
- Tailwind utility classes
- Inline styles for dynamic values
- `<style>` tags for keyframe animations
- Conditional classes with template literals

---

## 🔮 Potential Improvements

1. **State Management**: Add Context API or Zustand for global state
2. **Routing**: Migrate to React Router for URL-based navigation
3. **Data Layer**: Add API integration for real data
4. **Persistence**: Add localStorage for assessment progress
5. **Type Safety**: Migrate to TypeScript
6. **Testing**: Add unit/integration tests
7. **Performance**: Code splitting, lazy loading
8. **Accessibility**: Improve ARIA labels, keyboard navigation

---

## 📚 Key Files to Understand

1. **src/App.jsx** - Routing logic (43 lines)
2. **src/components/pages/HomePage.jsx** - Main landing page (1190 lines)
3. **src/components/shared/Navigation.jsx** - Navigation component (148 lines)
4. **src/components/pages/AssessmentsDashboard.jsx** - Assessment overview
5. **src/components/pages/AssessmentQuestionnaire.jsx** - Assessment form
6. **src/components/pages/ResultsDashboard.jsx** - Results display

---

## 🎨 Design System

### Colors:
- **Primary**: Blue (`blue-600`, `blue-500`)
- **Secondary**: Cyan (`cyan-500`, `cyan-400`)
- **Accent**: Purple (`purple-500`, `purple-400`)
- **Background**: Slate (`slate-900`, `slate-950`)
- **Text**: White/Slate (`slate-100`, `slate-300`)

### Gradients:
- `from-blue-600 to-cyan-500` - Primary buttons
- `from-slate-900 via-blue-950 to-slate-900` - Hero backgrounds
- `from-blue-500 to-indigo-500` - Card accents

### Spacing:
- Container: `container mx-auto px-4 sm:px-6 lg:px-8`
- Section padding: `py-20` or `py-24`
- Card padding: `p-6` or `p-8`

---

This codebase is a **frontend-only prototype** with beautiful UI/UX, ready for backend integration and feature expansion.

