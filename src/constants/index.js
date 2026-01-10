/**
 * Application Constants
 * Centralized constants for the application
 */

// API Configuration
export const API_TIMEOUT = 30000;

// Theme Colors
export const COLORS = {
  PRIMARY: '#46CDCF',
  PRIMARY_DARK: '#15ae99',
  AMBER: '#f59e0b',
  SLATE: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
};

// User Status
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
};

// Role Names
export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  REGULAR_MEMBER: 'Regular member',
  VIEW_ONLY: 'View Only',
};

// Module Names
export const MODULES = {
  USECASE: 'Usecase Module',
  ROADMAP: 'Roadmap Module',
};

// Module Permissions
export const MODULE_PERMISSIONS = {
  READ_ONLY: 'Read only',
  CREATE_EDIT: 'Create/Edit',
};

// Assessment Pillars
export const PILLARS = [
  'Strategic Value & Governance',
  'Workforce Skillset & Organization Structure',
  'Technology & Data',
  'Resilience, Performance & Impact',
  'Ethics, Trust & Responsible AI',
  'Compliance, Security & Risk',
  'Operations & Implementation',
];

// Local Storage Keys
export const STORAGE_KEYS = {
  CURRENT_USER: 'currentUser',
  IS_AUTHENTICATED: 'isAuthenticated',
  REGISTERED_USERS: 'registeredUsers',
};

// Routes
export const ROUTES = {
  HOME: '/',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  LOGIN: '/login',
  SETTINGS: '/settings',
  ROLE_MANAGEMENT: '/role-management',
  TEAM_MANAGEMENT: '/team-management',
};


