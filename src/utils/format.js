/**
 * Formatting Utilities
 */

export const formatName = (name) => {
  if (!name) return '';
  const trimmed = name.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};
