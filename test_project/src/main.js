/**
 * Main application file
 * @author Test User
 */

const VERSION = '1.0.0';

function main() {
  console.log('Hello, World!');
  console.log(`Version: ${VERSION}`);
  return 0;
}

// Export the main function
module.exports = { main, VERSION };

if (require.main === module) {
  main();
}
