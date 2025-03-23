// Main application file
const utils = require('./utils');
const components = require('./components/button');

/**
 * Main application entry point
 */
function main() {
  console.log('Starting application...');
  
  // Initialize components
  const button = components.createButton('Submit');
  
  // Use utility functions
  const data = utils.processData([1, 2, 3, 4, 5]);
  
  console.log(`Button ${button.id} created`);
  console.log(`Processed data: ${data}`);
  
  return { button, data };
}

module.exports = { main };
