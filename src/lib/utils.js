/**
 * Utility function to merge class names
 * Similar to clsx but simpler for our use case
 */
export function cn(...inputs) {
  const classes = [];
  
  inputs.forEach((input) => {
    if (!input) return;
    
    if (typeof input === 'string') {
      classes.push(input);
    } else if (Array.isArray(input)) {
      classes.push(...input.filter(Boolean));
    } else if (typeof input === 'object') {
      Object.keys(input).forEach((key) => {
        if (input[key]) {
          classes.push(key);
        }
      });
    }
  });
  
  return classes.filter(Boolean).join(' ');
}
