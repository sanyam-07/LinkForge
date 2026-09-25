/**
 * Formats a date into a clean readable string
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return 'Never';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'Never';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

/**
 * Formats numbers with thousand separators
 */
export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  return new Intl.NumberFormat('en-US').format(num);
};

/**
 * Truncates long URLs for display in tables or cards
 */
export const truncateUrl = (url, maxLength = 35) => {
  if (!url) return '';
  if (url.length <= maxLength) return url;
  return `${url.substring(0, maxLength)}...`;
};
