// frontend/src/utils/helpers.js

export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export const formatCurrency = (amount) =>
  `PKR ${(amount || 0).toLocaleString()}`;

export const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getRoleGradient = (role) => {
  const map = {
    admin:   'from-violet-600 to-indigo-600',
    teacher: 'from-emerald-600 to-teal-600',
    student: 'from-blue-600 to-cyan-600',
    parent:  'from-orange-500 to-amber-500',
  };
  return map[role] || 'from-primary-600 to-primary-700';
};

export const getRoleBadgeColor = (role) => {
  const map = {
    admin:   'bg-violet-100  text-violet-700  dark:bg-violet-900/30  dark:text-violet-400',
    teacher: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    student: 'bg-blue-100    text-blue-700    dark:bg-blue-900/30    dark:text-blue-400',
    parent:  'bg-orange-100  text-orange-700  dark:bg-orange-900/30  dark:text-orange-400',
  };
  return map[role] || map.student;
};

export const getStatusColor = (status) => {
  const map = {
    paid:     'bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400',
    pending:  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    overdue:  'bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400',
    partial:  'bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-400',
    present:  'bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400',
    absent:   'bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400',
    late:     'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    excused:  'bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-400',
    urgent:   'bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400',
    high:     'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    medium:   'bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-400',
    low:      'bg-gray-100   text-gray-600   dark:bg-gray-700      dark:text-gray-400',
    approved: 'bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400',
    active:   'bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-400',
    inactive: 'bg-gray-100   text-gray-600   dark:bg-gray-700      dark:text-gray-400',
  };
  return map[status] || map.low;
};

export const truncateText = (text, length = 50) => {
  if (!text) return '';
  return text.length > length ? text.slice(0, length) + '...' : text;
};