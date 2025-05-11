/** @format */

export default {
  // Run ESLint on JS/TS files
  "*.{js,jsx,ts,tsx}": ["eslint --fix"],
  // Prettier formatting for various file types
  "*.{js,jsx,ts,tsx,json,css,scss,md}": ["prettier --write"],
};
