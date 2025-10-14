// Simple date utilities to replace date-fns if not available
export const format = (date, formatString) => {
  const d = new Date(date);
  
  switch (formatString) {
    case 'yyyy-MM-dd':
      return d.toISOString().split('T')[0];
    case 'MM/dd/yyyy':
      return d.toLocaleDateString('en-US');
    case 'MMM dd':
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    case 'MMMM dd, yyyy':
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    default:
      return d.toLocaleDateString();
  }
};

export const isToday = (date) => {
  const today = new Date();
  const compareDate = new Date(date);
  
  return today.toDateString() === compareDate.toDateString();
};

export const isThisWeek = (date) => {
  const today = new Date();
  const compareDate = new Date(date);
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
  
  return compareDate >= weekStart;
};

export const isThisMonth = (date) => {
  const today = new Date();
  const compareDate = new Date(date);
  
  return today.getMonth() === compareDate.getMonth() && today.getFullYear() === compareDate.getFullYear();
};