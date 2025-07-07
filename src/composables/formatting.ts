export const validateNameField = (value: string): boolean => {
  // Allow letters, spaces, and hyphens for compound names
  const nameRegex = /^[A-Za-z\s-]+$/;
  return nameRegex.test(value);
};

export const validateAddressField = (value: string): boolean => {
  // Allow letters, numbers, spaces, periods, commas, hyphens, and hash symbols (ex. apt. numbers)
  const addressRegex = /^[A-Za-z0-9\s.,#-]+$/;
  return addressRegex.test(value);
};


// Proper capitalization of names
export const formatName = (name: string): string => {
  if (!name) return '';
  
  // Split the name by spaces and hyphens without deleting them
  return name
    .toLowerCase()
    .split(/([\s-])/)
    .map((part, index, array) => {
      // If it's a separator (space or hyphen), keep it as is
      if (part === ' ' || part === '-') return part;
      // Otherwise capitalize the first letter
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join('');
};
