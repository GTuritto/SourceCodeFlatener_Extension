const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

// Import our compiled CodeFlattener class
const { CodeFlattener } = require('../out/codeFlattener');

// Promisify fs functions
const rmdir = promisify(fs.rm);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

/**
 * Test runner focused on LLM optimization features
 */
class LLMFeaturesTestRunner {
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
   * Prepare test environment
   * @param {string} workspacePath Path to the test workspace
   */
  async prepareTestEnvironment(workspacePath) {
    // Create test project directory if it doesn't exist
    if (!fs.existsSync(workspacePath)) {
      await mkdir(workspacePath, { recursive: true });
    }

    // Create test files directory structure
    const srcDir = path.join(workspacePath, 'src');
    const testDir = path.join(workspacePath, 'tests');
    const distDir = path.join(workspacePath, 'dist');
    const tempDir = path.join(workspacePath, '#temp#');
    
    // Create directory structure for edge cases
    for (const dir of [srcDir, testDir, distDir, tempDir]) {
      if (!fs.existsSync(dir)) {
        await mkdir(dir, { recursive: true });
      }
    }

    // Create a sample .env file to test exclusion
    const envFile = path.join(workspacePath, '.env');
    await writeFile(envFile, 'SECRET_API_KEY=abcdef123456\nDATABASE_PASSWORD=supersecret');
    
    // Create a nested .env file to test deep exclusion
    const nestedEnvDir = path.join(srcDir, 'config');
    if (!fs.existsSync(nestedEnvDir)) {
      await mkdir(nestedEnvDir, { recursive: true });
    }
    const nestedEnvFile = path.join(nestedEnvDir, '.env.local');
    await writeFile(nestedEnvFile, 'NESTED_SECRET=should-not-appear');

    // Create .gitignore file
    const gitignoreFile = path.join(workspacePath, '.gitignore');
    await writeFile(gitignoreFile, 'node_modules/\ndist/\n.env\n*.log\n*.tmp\n#temp#/');

    // Create standard sample source files
    const mainJs = path.join(srcDir, 'main.js');
    await writeFile(mainJs, 'console.log("Main entry point");\nrequire("./utils.js");\n');

    const utilsJs = path.join(srcDir, 'utils.js');
    await writeFile(utilsJs, 'function helper() { return "utility function"; }\nmodule.exports = { helper };\n');
    
    // Create files for complex pattern testing
    const helperJs = path.join(srcDir, 'helper.js'); // Should be excluded by negative pattern test
    await writeFile(helperJs, 'function anotherHelper() { return "should be excluded"; }');
    
    // Create file with space in name for special char testing
    const fileWithSpace = path.join(srcDir, 'file with spaces.js');
    await writeFile(fileWithSpace, 'console.log("This file has spaces in its name");');
    
    // Create large file for size exclusion testing
    const largeFile = path.join(srcDir, 'large-file.js');
    let largeContent = '// This is a large file that should be excluded based on size\n';
    for (let i = 0; i < 1000; i++) {
      largeContent += `// Line ${i}: This adds bulk to make the file large\n`;
    }
    await writeFile(largeFile, largeContent);
    
    // Create log file that should be excluded by gitignore
    const logFile = path.join(workspacePath, 'application.log');
    await writeFile(logFile, 'ERROR: This log file should be excluded\n');
    
    // Create temp file that should be excluded by complex pattern
    const tempFile = path.join(workspacePath, 'temp.tmp');
    await writeFile(tempFile, 'Temporary data that should be excluded');

    // Create config file
    const configJson = path.join(workspacePath, 'config.json');
    await writeFile(configJson, '{"name": "test-project", "version": "1.0.0"}');

    // Create secrets file that should be excluded by runtime pattern
    const secretsJson = path.join(workspacePath, 'secrets.json');
    await writeFile(secretsJson, '{"apiKey": "very-secret-key", "token": "do-not-share"}');
    
    // Create TypeScript file for include/exclude conflict testing
    const tsFile = path.join(srcDir, 'types.ts');
    await writeFile(tsFile, 'interface TestInterface { property: string; }\nclass TestClass implements TestInterface { property = "value"; }');

    console.log('Test environment prepared successfully');
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
    
    // Prepare test environment
    await this.prepareTestEnvironment(workspacePath);
    
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
    const maxFileSizeBytes = testCase.maxFileSizeBytes || (10 * 1024 * 1024);
    const maxOutputFileSizeBytes = testCase.maxOutputFileSizeBytes || (5 * 1024 * 1024);
    
    // Configure LLM optimization options
    const llmOptions = testCase.llmOptions || {
      respectGitignore: true,
      enableSemanticCompression: true,
      enhancedTableOfContents: true, 
      prioritizeImportantFiles: true,
      visualizationLevel: 'comprehensive'
    };
    
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
      console.log(`LLM options:`, llmOptions);
      
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
        progressCallback,
        llmOptions
      );
      
      // List the generated files
      const files = fs.readdirSync(outputFolderPath);
      const outputFileStats = files.map(file => {
        const filePath = path.join(outputFolderPath, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          path: filePath,
          size: stats.size,
          sizeFormatted: `${(stats.size / 1024).toFixed(2)} KB`,
        };
      });
      
      // Analyze output files for test validations
      const testResults = await this.validateTestCase(testCase, outputFolderPath, outputFileStats);
      
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
        testResults,
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
        stack: testCase.verbose ? error.stack : undefined,
      };
    }
  }

  /**
   * Validate test case by checking the output against expected results
   */
  async validateTestCase(testCase, outputFolderPath, outputFiles) {
    const result = {
      validations: [],
      pass: true
    };
    
    // Get the main output file (usually the first markdown file)
    const mdFiles = outputFiles.filter(f => f.name.endsWith('.md'));
    if (mdFiles.length === 0) {
      result.validations.push({
        name: 'Output Files',
        pass: false,
        message: 'No markdown output files found'
      });
      result.pass = false;
      return result;
    }
    
    console.log(`Analyzing output file: ${mdFiles[0].path}`);
    const mainFile = mdFiles[0];
    const content = await readFile(mainFile.path, 'utf8');
    
    // For debugging, dump the list of excluded patterns
    console.log('Test excluded patterns:', testCase.excludePatterns);
    
    // Test for .env exclusion
    if (testCase.validateEnvExclusion) {
      // Check specifically for content that should be in the .env file
      const hasEnvApiKeyContent = content.includes('SECRET_API_KEY');
      const hasEnvDbPasswordContent = content.includes('DATABASE_PASSWORD');
      // Check for mention of the .env file itself (might be in directory listing)
      const hasEnvFileListing = content.includes('.env');
      
      // Provide detailed diagnostics
      const detectedIssues = [];
      if (hasEnvApiKeyContent) detectedIssues.push('Found API key content from .env file');
      if (hasEnvDbPasswordContent) detectedIssues.push('Found DB password content from .env file');
      if (hasEnvFileListing) detectedIssues.push('Found .env file listed in content');
      
      const hasEnvContent = hasEnvApiKeyContent || hasEnvDbPasswordContent || hasEnvFileListing;
      
      result.validations.push({
        name: 'Env File Exclusion',
        pass: !hasEnvContent,
        message: hasEnvContent ? `Env file issues: ${detectedIssues.join(', ')}` : '.env successfully excluded',
        details: { hasEnvApiKeyContent, hasEnvDbPasswordContent, hasEnvFileListing }
      });
      
      if (hasEnvContent) {
        result.pass = false;
      }
    }
    
    // Test for .gitignore respect
    if (testCase.validateGitignore && testCase.llmOptions?.respectGitignore) {
      // Check for specific patterns that should be excluded via .gitignore
      const hasDistFolder = content.includes('dist/');
      const hasLogFiles = content.includes('*.log');
      const hasNodeModules = content.includes('node_modules/');
      
      // Provide detailed diagnostics  
      const detectedIssues = [];
      if (hasDistFolder) detectedIssues.push('Found dist/ folder (should be excluded by .gitignore)');
      if (hasLogFiles) detectedIssues.push('Found *.log files (should be excluded by .gitignore)');
      if (hasNodeModules) detectedIssues.push('Found node_modules/ folder (should be excluded by .gitignore)');
      
      const hasGitignoreExcluded = hasDistFolder || hasLogFiles || hasNodeModules;
      
      result.validations.push({
        name: 'Gitignore Respect',
        pass: !hasGitignoreExcluded,
        message: hasGitignoreExcluded ? 
          `Gitignore exclusion issues: ${detectedIssues.join(', ')}` : 
          '.gitignore patterns successfully respected',
        details: { hasDistFolder, hasLogFiles, hasNodeModules }
      });
      
      if (hasGitignoreExcluded) {
        result.pass = false;
      }
    }
    
    // Test for enhanced table of contents
    if (testCase.validateEnhancedTOC && testCase.llmOptions?.enhancedTableOfContents) {
      const hasEnhancedTOC = content.includes('Files By Category');
      
      result.validations.push({
        name: 'Enhanced Table of Contents',
        pass: hasEnhancedTOC,
        message: hasEnhancedTOC ? 'Enhanced TOC found' : 'Enhanced TOC not found'
      });
      
      if (!hasEnhancedTOC) {
        result.pass = false;
      }
    }
    
    // Test for code relationship visualization
    if (testCase.validateVisualization) {
      const hasVisualization = content.includes('mermaid') && content.includes('graph LR');
      const visualizationLevel = testCase.llmOptions?.visualizationLevel || 'comprehensive';
      
      // For comprehensive level, check for all diagram types
      if (visualizationLevel === 'comprehensive') {
        const hasClassDiagram = content.includes('classDiagram');
        const hasComponentDiagram = content.includes('flowchart TB');
        
        result.validations.push({
          name: 'Comprehensive Visualization',
          pass: hasVisualization && hasClassDiagram && hasComponentDiagram,
          message: hasVisualization ? 'Visualization diagrams found' : 'Visualization diagrams not found'
        });
        
        if (!(hasVisualization && hasClassDiagram && hasComponentDiagram)) {
          result.pass = false;
        }
      } else {
        result.validations.push({
          name: 'Basic Visualization',
          pass: hasVisualization,
          message: hasVisualization ? 'Visualization diagram found' : 'Visualization diagram not found'
        });
        
        if (!hasVisualization) {
          result.pass = false;
        }
      }
    }
    
    // Test for runtime exclusions
    if (testCase.validateRuntimeExclusions) {
      const hasSecretsFile = content.includes('secrets.json') || 
                           content.includes('very-secret-key');
      
      result.validations.push({
        name: 'Runtime Exclusions',
        pass: !hasSecretsFile,
        message: hasSecretsFile ? 'Found content that should be excluded by runtime patterns' : 'Runtime exclusions successfully applied'
      });
      
      if (hasSecretsFile) {
        result.pass = false;
      }
    }
    
    // Test for empty exclusions
    if (testCase.validateEmptyExclusions) {
      // With empty exclude patterns, default exclusions should still apply
      // Check if sensitive files are still excluded
      const hasEnvContent = content.includes('SECRET_API_KEY') || content.includes('DATABASE_PASSWORD');
      const hasNodeModules = content.includes('node_modules/');
      
      const defaultExclusionsApplied = !hasEnvContent && !hasNodeModules;
      
      result.validations.push({
        name: 'Default Exclusions',
        pass: defaultExclusionsApplied,
        message: defaultExclusionsApplied ? 
          'Default exclusions properly applied with empty exclude patterns' : 
          'Default exclusions not applied with empty exclude patterns'
      });
      
      if (!defaultExclusionsApplied) {
        result.pass = false;
      }
    }
    
    // Test for complex glob pattern exclusions
    if (testCase.validateComplexPatterns) {
      // Check that files matching complex patterns are excluded
      const hasLogOrTmpFiles = content.includes('.log') || content.includes('.tmp');
      const hasExcludedJsFiles = content.includes('helper.js') || content.includes('utility.js');
      const hasTestFiles = content.includes('test/') || content.includes('tests/');
      
      const complexPatternsRespected = !hasLogOrTmpFiles && !hasExcludedJsFiles && !hasTestFiles;
      
      result.validations.push({
        name: 'Complex Glob Patterns',
        pass: complexPatternsRespected,
        message: complexPatternsRespected ? 
          'Complex glob patterns correctly applied' : 
          'Files matching complex glob patterns were not properly excluded'
      });
      
      if (!complexPatternsRespected) {
        result.pass = false;
      }
    }
    
    // Test for large file exclusions based on size
    if (testCase.validateLargeFileExclusion) {
      // With a tiny file size limit, most files should be excluded
      // Check if output shows skipped files due to size
      const hasSkippedLargeFiles = content.includes('Skipping large file');
      const hasMinimalContent = content.length < 1000; // Output should be small if most files are skipped
      
      const sizeExclusionWorked = hasSkippedLargeFiles || hasMinimalContent;
      
      result.validations.push({
        name: 'Large File Exclusion',
        pass: sizeExclusionWorked,
        message: sizeExclusionWorked ? 
          'Large files were properly excluded based on size' : 
          'Size-based file exclusion not working correctly'
      });
      
      if (!sizeExclusionWorked) {
        result.pass = false;
      }
    }
    
    // Test for pattern conflict resolution (include vs exclude)
    if (testCase.validatePatternConflict) {
      // Check that JS files are excluded even though they're in includePatterns
      // This tests that exclude patterns take precedence over include patterns
      const hasJsFiles = content.includes('function ') || content.includes('console.log');
      const hasTsOrOtherFiles = content.match(/\.(ts|json|md)/) !== null;
      
      // Should exclude JS files even though they are in include patterns
      const patternConflictResolved = !hasJsFiles && hasTsOrOtherFiles;
      
      result.validations.push({
        name: 'Include/Exclude Pattern Conflict',
        pass: patternConflictResolved,
        message: patternConflictResolved ? 
          'Pattern conflicts correctly resolved (exclude takes precedence)' : 
          'Pattern conflict resolution failed'
      });
      
      if (!patternConflictResolved) {
        result.pass = false;
      }
    }
    
    // Test for nested directory patterns
    if (testCase.validateNestedPatterns) {
      // Check that both node_modules patterns worked (normal and with **/ prefix)
      const hasNodeModules = content.includes('node_modules/');
      
      result.validations.push({
        name: 'Nested Directory Patterns',
        pass: !hasNodeModules,
        message: !hasNodeModules ? 
          'Nested directory patterns properly applied' : 
          'Nested directory exclusion patterns not working correctly'
      });
      
      if (hasNodeModules) {
        result.pass = false;
      }
    }
    
    // Test for special characters in paths
    if (testCase.validateSpecialChars) {
      // Check that files with spaces and special characters are properly handled
      const hasFileWithSpaces = content.includes('file with spaces.js');
      const hasTempFiles = content.includes('#temp#/');
      
      const specialCharsHandled = !hasFileWithSpaces && !hasTempFiles;
      
      result.validations.push({
        name: 'Special Characters in Paths',
        pass: specialCharsHandled,
        message: specialCharsHandled ? 
          'Files with special characters in paths properly excluded' : 
          'Special character handling in exclusion patterns failed'
      });
      
      if (!specialCharsHandled) {
        result.pass = false;
      }
    }
    
    return result;
  }

  /**
   * Run all test cases
   */
  async runAllTests() {
    console.log('===== Starting CodeFlattener LLM Features Tests =====');
    console.log(`Total test cases: ${this.testCases.length}`);
    
    for (const testCase of this.testCases) {
      const result = await this.runTestCase(testCase);
      this.results.push(result);
    }
    
    this.printSummary();
    return this.results;
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

    // Print validation results
    console.log('\n----- Validation Results -----');
    this.results.forEach(result => {
      if (result.success) {
        console.log(`\n${result.name}:`);
        
        if (result.testResults && result.testResults.validations) {
          result.testResults.validations.forEach(validation => {
            const status = validation.pass ? '✓' : '✗';
            console.log(`  ${status} ${validation.name}: ${validation.message}`);
          });
          
          console.log(`  Overall result: ${result.testResults.pass ? '✓ PASS' : '✗ FAIL'}`);
        } else {
          console.log('  No validations performed');
        }
      } else {
        console.log(`\n${result.name}: ✗ FAILED`);
        console.log(`  Error: ${result.error}`);
      }
    });
  }
}

/**
 * Main function to run all LLM feature tests
 */
async function runLLMFeatureTests() {
  const tester = new LLMFeaturesTestRunner();
  
  // Test .env exclusion
  tester.addTest('Env File Exclusion', {
    cleanOutput: true,
    verbose: true,
    validateEnvExclusion: true,
    outputFolder: 'CodeFlattened_Tests/env_exclusion',
    llmOptions: {
      respectGitignore: false,
      enableSemanticCompression: true,
      enhancedTableOfContents: false,
      prioritizeImportantFiles: false,
      visualizationLevel: 'basic'
    }
  });
  
  // Test .gitignore support
  tester.addTest('Gitignore Support', {
    cleanOutput: true,
    verbose: true,
    validateGitignore: true,
    outputFolder: 'CodeFlattened_Tests/gitignore_support',
    llmOptions: {
      respectGitignore: true,
      enableSemanticCompression: true,
      enhancedTableOfContents: false,
      prioritizeImportantFiles: false,
      visualizationLevel: 'basic'
    }
  });
  
  // Test enhanced table of contents
  tester.addTest('Enhanced TOC', {
    cleanOutput: true,
    verbose: true,
    validateEnhancedTOC: true,
    outputFolder: 'CodeFlattened_Tests/enhanced_toc',
    llmOptions: {
      respectGitignore: false,
      enableSemanticCompression: true,
      enhancedTableOfContents: true,
      prioritizeImportantFiles: false,
      visualizationLevel: 'basic'
    }
  });
  
  // Test visualization levels
  tester.addTest('Comprehensive Visualization', {
    cleanOutput: true,
    verbose: true,
    validateVisualization: true,
    outputFolder: 'CodeFlattened_Tests/comprehensive_viz',
    llmOptions: {
      respectGitignore: false,
      enableSemanticCompression: true,
      enhancedTableOfContents: false,
      prioritizeImportantFiles: false,
      visualizationLevel: 'comprehensive'
    }
  });
  
  // Test runtime exclusions
  tester.addTest('Runtime Exclusions', {
    cleanOutput: true,
    verbose: true,
    validateRuntimeExclusions: true,
    outputFolder: 'CodeFlattened_Tests/runtime_exclusions',
    excludePatterns: ['node_modules/**', '**/CodeFlattened/**', 'secrets.json'],
    llmOptions: {
      respectGitignore: false,
      enableSemanticCompression: true,
      enhancedTableOfContents: false,
      prioritizeImportantFiles: false,
      visualizationLevel: 'basic'
    }
  });
  
  // Test all features together
  tester.addTest('All Features Combined', {
    cleanOutput: true,
    verbose: true,
    validateEnvExclusion: true,
    validateGitignore: true,
    validateEnhancedTOC: true,
    validateVisualization: true,
    validateRuntimeExclusions: true,
    outputFolder: 'CodeFlattened_Tests/all_features',
    excludePatterns: ['node_modules/**', '**/CodeFlattened/**', 'secrets.json'],
    llmOptions: {
      respectGitignore: true,
      enableSemanticCompression: true,
      enhancedTableOfContents: true,
      prioritizeImportantFiles: true,
      visualizationLevel: 'comprehensive'
    }
  });
  
  // Edge case: Empty exclude patterns to test default behavior
  tester.addTest('Empty Exclude Patterns', {
    cleanOutput: true,
    verbose: true,
    validateEmptyExclusions: true,
    outputFolder: 'CodeFlattened_Tests/empty_excludes',
    excludePatterns: [],  // Explicitly empty to test default exclusions
    llmOptions: {
      respectGitignore: false,
      enableSemanticCompression: true,
      enhancedTableOfContents: false,
      prioritizeImportantFiles: false,
      visualizationLevel: 'basic'
    }
  });
  
  // Edge case: Complex glob patterns
  tester.addTest('Complex Glob Patterns', {
    cleanOutput: true,
    verbose: true,
    validateComplexPatterns: true,
    outputFolder: 'CodeFlattened_Tests/complex_globs',
    excludePatterns: [
      'node_modules/**', 
      '**/CodeFlattened/**', 
      '**/*.{log,tmp}',  // Multiple extensions
      '**/!(main|index).js',  // Negative patterns
      '**/test?(s)/**'   // Optional character
    ],
    llmOptions: {
      respectGitignore: false,
      enableSemanticCompression: true,
      enhancedTableOfContents: false,
      prioritizeImportantFiles: false,
      visualizationLevel: 'basic'
    }
  });
  
  // Edge case: Very small file size limit
  tester.addTest('Large Files Exclusion', {
    cleanOutput: true,
    verbose: true,
    validateLargeFileExclusion: true,
    outputFolder: 'CodeFlattened_Tests/large_files',
    excludePatterns: ['node_modules/**', '**/CodeFlattened/**'],
    maxFileSizeBytes: 100,  // Very small limit to test size-based exclusion
    llmOptions: {
      respectGitignore: false,
      enableSemanticCompression: true,
      enhancedTableOfContents: false,
      prioritizeImportantFiles: false,
      visualizationLevel: 'basic'
    }
  });
  
  // Edge case: Include/exclude pattern conflicts
  tester.addTest('Include-Exclude Conflict', {
    cleanOutput: true,
    verbose: true,
    validatePatternConflict: true,
    outputFolder: 'CodeFlattened_Tests/include_exclude_conflict',
    includePatterns: ['**/*.js', '**/*.ts'],
    excludePatterns: ['**/*.js'],  // This conflicts with the include pattern
    llmOptions: {
      respectGitignore: false,
      enableSemanticCompression: true,
      enhancedTableOfContents: false,
      prioritizeImportantFiles: false,
      visualizationLevel: 'basic'
    }
  });
  
  // Edge case: Nested directory patterns
  tester.addTest('Nested Directory Patterns', {
    cleanOutput: true,
    verbose: true,
    validateNestedPatterns: true,
    outputFolder: 'CodeFlattened_Tests/nested_dirs',
    excludePatterns: ['node_modules/**', '**/node_modules/**', '**/CodeFlattened/**'],
    llmOptions: {
      respectGitignore: false,
      enableSemanticCompression: true,
      enhancedTableOfContents: false,
      prioritizeImportantFiles: false,
      visualizationLevel: 'basic'
    }
  });
  
  // Edge case: Special characters in paths
  tester.addTest('Special Characters', {
    cleanOutput: true,
    verbose: true,
    validateSpecialChars: true,
    outputFolder: 'CodeFlattened_Tests/special_chars',
    excludePatterns: ['node_modules/**', '**/CodeFlattened/**', '**/file with spaces.js', '**/#temp#/**'],
    llmOptions: {
      respectGitignore: false,
      enableSemanticCompression: true,
      enhancedTableOfContents: false,
      prioritizeImportantFiles: false,
      visualizationLevel: 'basic'
    }
  });
  
  // Run all tests
  return await tester.runAllTests();
}

// Run the tests if this file is executed directly
if (require.main === module) {
  runLLMFeatureTests().catch(err => {
    console.error('Test runner failed:', err);
    process.exit(1);
  });
}

module.exports = { runLLMFeatureTests, LLMFeaturesTestRunner };
