/**
 * Utility functions for the application
 */

/**
 * Process an array of data
 * @param {Array} data - The input data array
 * @return {Array} - The processed data
 */
function processData(data) {
  return data.map(item => item * 2);
}

/**
 * Format a string with a specific prefix
 * @param {string} str - Input string
 * @return {string} - Formatted string
 */
function formatString(str) {
  return `formatted: ${str}`;
}

module.exports = {
  processData,
  formatString
};
