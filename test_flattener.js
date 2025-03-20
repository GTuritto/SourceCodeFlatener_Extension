const path = require('path');
const fs = require('fs');

// Import our compiled CodeFlattener class
const { CodeFlattener } = require('./out/codeFlattener');

async function runTest() {
  const workspacePath = path.join(__dirname, 'test_project');
  const outputFolderPath = path.join(workspacePath, 'CodeFlattened');
  
  // Create the output directory if it doesn't exist
  if (!fs.existsSync(outputFolderPath)) {
    fs.mkdirSync(outputFolderPath, { recursive: true });
  }
  
  // Configure flattening options
  const includePatterns = [];
  const excludePatterns = ['node_modules/**', '**/CodeFlattened/**'];
  const maxFileSizeBytes = 10 * 1024 * 1024; // 10MB
  const maxOutputFileSizeBytes = 5 * 1024 * 1024; // 5MB
  
  // Create progress callback
  const progressCallback = (message, increment) => {
    console.log(`Progress (${(increment * 100).toFixed(1)}%): ${message}`);
  };
  
  console.log('Starting flattening process...');
  
  try {
    // Create an instance of CodeFlattener
    const flattener = new CodeFlattener();
    
    // Run the flattening process
    await flattener.flattenWorkspace(
      workspacePath,
      outputFolderPath,
      includePatterns,
      excludePatterns,
      maxFileSizeBytes,
      maxOutputFileSizeBytes,
      progressCallback
    );
    
    console.log('Flattening completed successfully!');
    console.log(`Output files are in: ${outputFolderPath}`);
    
    // List the files generated
    const files = fs.readdirSync(outputFolderPath);
    console.log('Generated files:');
    files.forEach(file => {
      const filePath = path.join(outputFolderPath, file);
      const stats = fs.statSync(filePath);
      console.log(`- ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
    });
  } catch (error) {
    console.error('Error during flattening:', error);
  }
}

// Run the test
runTest();
