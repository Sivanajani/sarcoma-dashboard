export const isTruthy = (value: any): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value === 1;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return ['yes', 'true', '1', 'ja'].includes(normalized);
  }
  return false;
};