// frontend/src/styles/designSystem.js
// ═══════════════════════════════════════════════════════════
// CENTRALIZED DESIGN SYSTEM - Single source of truth
// ═══════════════════════════════════════════════════════════

export const colors = {
  primary: {
    50:  '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
    950: '#1E1B4B',
  },
  secondary: {
    400: '#38BDF8',
    500: '#0EA5E9',
    600: '#0284C7',
  },
  success: {
    50:  '#F0FDF4',
    500: '#10B981',
    600: '#059669',
  },
  warning: {
    50:  '#FFFBEB',
    500: '#F59E0B',
    600: '#D97706',
  },
  danger: {
    50:  '#FEF2F2',
    500: '#EF4444',
    600: '#DC2626',
  },
  neutral: {
    50:  '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },
};

export const shadows = {
  xs:   '0 1px 2px rgba(0,0,0,0.05)',
  sm:   '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
  md:   '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)',
  lg:   '0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.05)',
  xl:   '0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)',
  card: '0 0 0 1px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.04)',
  glow: '0 0 0 3px rgba(79,70,229,0.15)',
};

export const borderRadius = {
  sm:   '8px',
  md:   '12px',
  lg:   '16px',
  xl:   '20px',
  '2xl':'24px',
  full: '9999px',
};

export const transitions = {
  fast:   'all 0.15s ease',
  normal: 'all 0.25s ease',
  slow:   'all 0.4s ease',
  spring: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
};

export const roleConfig = {
  admin: {
    gradient: 'from-violet-600 via-indigo-600 to-blue-600',
    color:    '#4F46E5',
    light:    '#EEF2FF',
    label:    'Super Admin',
    icon:     'Shield',
  },
  teacher: {
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    color:    '#059669',
    light:    '#F0FDF4',
    label:    'Teacher',
    icon:     'BookOpen',
  },
  student: {
    gradient: 'from-blue-600 via-indigo-500 to-violet-600',
    color:    '#0EA5E9',
    light:    '#F0F9FF',
    label:    'Student',
    icon:     'GraduationCap',
  },
  parent: {
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    color:    '#F59E0B',
    light:    '#FFFBEB',
    label:    'Parent',
    icon:     'Users',
  },
};