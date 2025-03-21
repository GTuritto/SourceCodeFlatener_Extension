const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

// Import our compiled CodeFlattener class
const { CodeFlattener } = require('./out/codeFlattener');

// Promisify fs functions
const rmdir = promisify(fs.rm);

/**
 * Run a multi-language test to verify all language support
 */
async function runMultiLanguageTest() {
  console.log('Starting multi-language test...');
  
  // Clean output directory
  const outputDir = path.join(__dirname, 'CodeFlattened/multi_language');
  try {
    await rmdir(outputDir, { recursive: true, force: true });
    console.log(`Cleaned output directory: ${outputDir}`);
  } catch (err) {
    // Directory may not exist, which is fine
  }
  
  // Create flattener instance
  const flattener = new CodeFlattener({
    verbose: true,
    workspacePath: path.join(__dirname, 'test_project'),
    outputPath: outputDir,
    includePatterns: [
      '**/special/*.rs',      // Rust
      '**/special/*.go',      // Go
      '**/special/*.kt',      // Kotlin
      '**/special/*.swift',   // Swift
      '**/special/*.dart',    // Dart
      '**/special/*.ex',      // Elixir
      '**/special/*.sql',     // SQL
      '**/special/*.tf',      // Terraform
      '**/special/docker-compose.yml', // Docker Compose
      '**/special/Dockerfile' // Docker
    ],
    excludePatterns: ['**/node_modules/**', '**/CodeFlattened/**'],
    cleanOutput: true,
    verbose: true
  });
  
  try {
    // Run the flattener
    await flattener.flattenWorkspace();
    console.log('Successfully flattened files');
    
    // Verify the output files
    const outputFiles = fs.readdirSync(outputDir);
    console.log('Generated output files:', outputFiles);
    
    // Check if markdown file was created
    const mdFile = outputFiles.find(f => f.endsWith('.md'));
    if (mdFile) {
      const mdContent = fs.readFileSync(path.join(outputDir, mdFile), 'utf8');
      console.log('-------------------');
      console.log('Markdown file content:');
      console.log(mdContent);
      console.log('-------------------');
      
      // Check for language detection
      const detectionResults = {
        'rust': mdContent.includes('```rust'),
        'go': mdContent.includes('```go'),
        'kotlin': mdContent.includes('```kotlin'),
        'swift': mdContent.includes('```swift'),
        'dart': mdContent.includes('```dart'),
        'elixir': mdContent.includes('```elixir'),
        'sql': mdContent.includes('```sql'),
        'terraform': mdContent.includes('```terraform') || mdContent.includes('```hcl'),
        'docker': mdContent.includes('```dockerfile'),
        'yaml': mdContent.includes('```yaml')
      };
      
      console.log('Language detection results:');
      for (const [lang, detected] of Object.entries(detectionResults)) {
        console.log(`- ${lang}: ${detected ? '✅ Detected' : '❌ Not detected'}`);
      }
      
      // Check for dependencies
      if (mdContent.includes('Dependencies:')) {
        console.log('Dependencies were detected in the output file.');
      } else {
        console.log('No dependencies section found in the output file.');
      }
    } else {
      console.error('No markdown file was generated');
    }
  } catch (err) {
    console.error('Error while flattening workspace:', err);
  }
}

// Run the test
runMultiLanguageTest().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
