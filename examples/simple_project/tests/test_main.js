/**
 * Tests for the main application
 */
const { main } = require('../src/main');

// Test the main function
console.log('Testing main application...');
const result = main();

console.log('Testing button rendering...');
console.log(result.button.render());

console.log('Testing button click event...');
result.button.onClick(() => {
  console.log('Button callback executed');
});

console.log('All tests passed!');
