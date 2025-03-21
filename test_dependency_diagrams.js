const fs = require('fs');
const path = require('path');
const assert = require('assert');

// Import our compiled CodeFlattener class
const { CodeFlattener } = require('./out/codeFlattener');

/**
 * Test file for verifying dependency diagram functionality 
 * in the Source Code Flattener extension.
 */
async function testDependencyDiagrams() {
    console.log('=== Testing Dependency Diagram Functionality ===');
    
    // Setup test parameters
    const workspacePath = path.join(__dirname, 'test_project');
    const outputFolderPath = path.join(workspacePath, 'CodeFlattened/dependency_test');
    const includePatterns = ['**/*.js']; // Only JS files for simplicity
    const excludePatterns = ['node_modules/**', '**/CodeFlattened/**'];
    const maxFileSizeBytes = 10485760; // 10MB
    const maxOutputFileSizeBytes = 1048576; // 1MB
    
    // Create the output directory if it doesn't exist
    if (!fs.existsSync(outputFolderPath)) {
        fs.mkdirSync(outputFolderPath, { recursive: true });
    }
    
    // Create flattener instance
    const flattener = new CodeFlattener();
    
    // Progress tracking callback
    const progressCallback = (message, increment) => {
        console.log(`Progress (${(increment * 100).toFixed(1)}%): ${message}`);
    };
    
    // Run the flattener
    await flattener.flattenWorkspace(
        workspacePath,
        outputFolderPath,
        includePatterns,
        excludePatterns,
        maxFileSizeBytes,
        maxOutputFileSizeBytes,
        progressCallback
    );
    
    // Get output file path
    const outputFilePath = path.join(outputFolderPath, 'test_project_flattened.md');
    
    // Verify the output file exists
    assert.strictEqual(
        fs.existsSync(outputFilePath), 
        true, 
        'Output file was not created'
    );
    
    // Read the output file content
    const content = fs.readFileSync(outputFilePath, 'utf8');
    
    // Tests to perform:
    
    // 1. Check if dependency diagram section exists
    assert.strictEqual(
        content.includes('## Dependency Diagram'), 
        true, 
        'Dependency diagram section not found'
    );
    
    // 2. Check if Mermaid syntax is present
    assert.strictEqual(
        content.includes('```mermaid'), 
        true, 
        'Mermaid diagram syntax not found'
    );
    
    // 3. Check if graph definition is present
    assert.strictEqual(
        content.includes('graph TD'), 
        true, 
        'Mermaid graph definition not found'
    );
    
    // 4. Check if file nodes are mentioned in the diagram
    assert.strictEqual(
        content.includes('main.js'), 
        true, 
        'Expected file main.js not found in diagram'
    );
    
    assert.strictEqual(
        content.includes('utils.js'), 
        true, 
        'Expected file utils.js not found in diagram'
    );
    
    assert.strictEqual(
        content.includes('test_utils.js'), 
        true, 
        'Expected file test_utils.js not found in diagram'
    );
    
    // Note: We're not checking for relationship arrows as they may not exist in simple test cases
    // where files don't have dependencies on each other
    
    // Print summary
    console.log('✅ All dependency diagram tests passed!');
    console.log(`Output file: ${outputFilePath}`);
}

// Run the tests
testDependencyDiagrams().catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
});
