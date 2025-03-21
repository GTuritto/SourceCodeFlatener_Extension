const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

// Import our compiled CodeFlattener class
const { CodeFlattener } = require('./out/codeFlattener');

// Promisify fs functions
const rmdir = promisify(fs.rm);

/**
 * Test runner for the CodeFlattener extension
 */
class TestRunner {
  constructor() {
    this.testCases = [];
    this.results = [];
    this.baseWorkspacePath = path.join(__dirname, 'test_project');
  }

  /**
   * Add a test case for flattening
   * @param {string} name Test case name
   * @param {Object} options Test configuration options
   */
  addTest(name, options) {
    this.testCases.push({
      name,
      ...options,
    });
    return this;
  }

  /**
   * Run a single test case
   * @param {Object} testCase The test case configuration
   * @returns {Promise<Object>} Test result
   */
  async runTestCase(testCase) {
    console.log(`\n===== Running Test: ${testCase.name} =====`);
    const startTime = Date.now();
    
    const workspacePath = testCase.workspacePath || this.baseWorkspacePath;
    const outputFolderPath = path.join(workspacePath, testCase.outputFolder || 'CodeFlattened');
    
    // Clean previous output if needed
    if (testCase.cleanOutput && fs.existsSync(outputFolderPath)) {
      await rmdir(outputFolderPath, { recursive: true, force: true });
    }
    
    // Create the output directory if it doesn't exist
    if (!fs.existsSync(outputFolderPath)) {
      fs.mkdirSync(outputFolderPath, { recursive: true });
    }

    // Configure flattening options
    const includePatterns = testCase.includePatterns || [];
    const excludePatterns = testCase.excludePatterns || ['node_modules/**', '**/CodeFlattened/**'];
    const maxFileSizeBytes = testCase.maxFileSizeBytes || (10 * 1024 * 1024); // Default 10MB
    const maxOutputFileSizeBytes = testCase.maxOutputFileSizeBytes || (5 * 1024 * 1024); // Default 5MB
    
    // Prepare progress callback
    const progressCallback = (message, increment) => {
      if (testCase.verbose) {
        console.log(`Progress (${(increment * 100).toFixed(1)}%): ${message}`);
      }
    };
    
    try {
      console.log(`Working directory: ${workspacePath}`);
      console.log(`Output directory: ${outputFolderPath}`);
      console.log(`Include patterns: ${includePatterns.length ? includePatterns.join(', ') : 'All files'}`);
      console.log(`Exclude patterns: ${excludePatterns.join(', ')}`);
      
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
      
      // List the generated files
      const files = fs.readdirSync(outputFolderPath);
      const outputFileStats = files.map(file => {
        const filePath = path.join(outputFolderPath, file);
        const stats = fs.statSync(filePath);
        
        // Check for LLM-optimized output file
        const isLLMOptimized = file.includes('_code_analysis.md');
        let llmSections = {};
        
        if (isLLMOptimized) {
          // Read the file and validate sections
          const content = fs.readFileSync(filePath, 'utf8');
          llmSections = {
            hasTableOfContents: content.includes('## Table of Contents'),
            hasSourceCode: content.includes('## 1. Source Code'),
            hasFileIndex: content.includes('## 2. File Index'), 
            hasAIGuide: content.includes('## 3. AI Query Guide')
          };
          console.log('LLM-optimized output validation:', llmSections);
        }
        
        return {
          name: file,
          size: stats.size,
          sizeFormatted: `${(stats.size / 1024).toFixed(2)} KB`,
          isLLMOptimized,
          llmSections: isLLMOptimized ? llmSections : undefined
        };
      });
      
      const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`Test completed successfully in ${elapsedTime}s`);
      console.log('Generated files:');
      outputFileStats.forEach(file => {
        console.log(`- ${file.name} (${file.sizeFormatted})`);
      });
      
      return {
        name: testCase.name,
        success: true,
        elapsedTime,
        outputFiles: outputFileStats,
        testCase,
      };
    } catch (error) {
      console.error(`Test failed: ${error.message}`);
      if (testCase.verbose) {
        console.error(error.stack);
      }
      
      return {
        name: testCase.name,
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Run all test cases
   */
  async runAllTests() {
    console.log('===== Starting CodeFlattener Tests =====');
    console.log(`Total test cases: ${this.testCases.length}`);
    
    for (const testCase of this.testCases) {
      const result = await this.runTestCase(testCase);
      this.results.push(result);
    }
    
    this.printSummary();
  }

  /**
   * Print summary of test results
   */
  printSummary() {
    console.log('\n===== Test Results Summary =====');
    
    const successful = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    
    console.log(`Total tests: ${this.results.length}`);
    console.log(`Successful: ${successful}`);
    console.log(`Failed: ${failed}`);

    // Report on LLM-optimized output files
    const llmTests = this.results.filter(r => r.success && r.name === 'LLM Optimized Output');
    if (llmTests.length > 0) {
      console.log('\nLLM-Optimized Output Test Results:');
      llmTests.forEach(test => {
        const llmFiles = test.outputFiles?.filter(file => file.isLLMOptimized) || [];
        if (llmFiles.length > 0) {
          console.log(`- Found ${llmFiles.length} LLM-optimized output files`);
          llmFiles.forEach(file => {
            if (file.llmSections) {
              const sections = file.llmSections;
              console.log(`  - ${file.name} (${file.sizeFormatted})`);
              console.log(`    Table of Contents: ${sections.hasTableOfContents ? '✓' : '✗'}`);
              console.log(`    Source Code: ${sections.hasSourceCode ? '✓' : '✗'}`);
              console.log(`    File Index: ${sections.hasFileIndex ? '✓' : '✗'}`);
              console.log(`    AI Query Guide: ${sections.hasAIGuide ? '✓' : '✗'}`);
            }
          });
        } else {
          console.log(`- No LLM-optimized output files found in '${test.name}' test`);
        }
      });
    }
    
    if (failed > 0) {
      console.log('\nFailed tests:');
      this.results
        .filter(r => !r.success)
        .forEach(result => {
          console.log(`- ${result.name}: ${result.error}`);
        });
    }
  }
}

/**
 * Main function to run all tests
 */
async function runTests() {
  const tester = new TestRunner();
  
  // Default test case with all files
  tester.addTest('Default Settings', {
    cleanOutput: true,
    verbose: true,
    outputFolder: 'CodeFlattened/default'
  });
  
  // Test with only JavaScript files
  tester.addTest('JavaScript Files Only', {
    includePatterns: ['**/*.js'],
    cleanOutput: true,
    verbose: false,
    outputFolder: 'CodeFlattened/js_only'
  });
  
  // Test with only configuration files
  tester.addTest('Config Files', {
    includePatterns: ['**/*.json', '**/*.yaml', '**/*.yml', '**/*.xml'],
    cleanOutput: true,
    verbose: false,
    outputFolder: 'CodeFlattened/config_only'
  });
  
  // Test with specific include and exclude patterns
  tester.addTest('Mixed Patterns', {
    includePatterns: ['**/*.js', '**/src/**/*.java', '**/docs/**/*.md'],
    excludePatterns: ['**/node_modules/**', '**/CodeFlattened/**', '**/tests/**'],
    cleanOutput: true,
    verbose: false,
    outputFolder: 'CodeFlattened/mixed_patterns'
  });
  
  // Test with edge cases - large files, unicode content, minified files
  tester.addTest('Edge Cases', {
    includePatterns: ['**/special/large_file.txt', '**/special/unicode_example.txt', '**/src/minified.js'],
    cleanOutput: true,
    verbose: true,
    outputFolder: 'CodeFlattened/edge_cases'
  });
  
  // Test with special files (Dockerfile, Makefile, etc.)
  tester.addTest('Special Files', {
    includePatterns: ['**/special/Dockerfile', '**/special/Makefile', '**/special/.gitignore'],
    cleanOutput: true,
    verbose: false,
    outputFolder: 'CodeFlattened/special_files'
  });
  
  // Test with React/Web components
  tester.addTest('Web Components', {
    includePatterns: ['**/src/components/**/*.jsx', '**/src/components/**/*.css'],
    cleanOutput: true,
    verbose: false,
    outputFolder: 'CodeFlattened/web_components'
  });
  
  // Test with data files
  tester.addTest('Data Files', {
    includePatterns: ['**/data/**/*.csv', '**/data/**/*.xml', '**/data/**/*.yaml'],
    cleanOutput: true,
    verbose: false,
    outputFolder: 'CodeFlattened/data_files'
  });
  
  // Test with small output file size limit (to test splitting)
  tester.addTest('Small Output Size', {
    includePatterns: [],
    cleanOutput: true,
    verbose: true,
    maxOutputFileSizeBytes: 1024 * 10, // Very small: 10KB to force splitting
    outputFolder: 'CodeFlattened/small_output_size'
  });

  // Test the new LLM-optimized output feature
  tester.addTest('LLM Optimized Output', {
    includePatterns: ['**/*.js', '**/*.ts'],
    cleanOutput: true,
    verbose: true,
    outputFolder: 'CodeFlattened/llm_optimized'
  });

  // Test the new dependency diagram feature
  tester.addTest('Dependency Diagram Feature', {
    includePatterns: ['**/*.js'],
    cleanOutput: true,
    verbose: true,
    outputFolder: 'CodeFlattened/dependency_diagram_test'
  });

  // Run all tests
  await tester.runAllTests();
}

// Run the tests
runTests().catch(err => {
  console.error('Test runner failed:', err);
  process.exit(1);
});
