# CodeFlattener

## **Unlock the Full Potential of Your Codebase with One Click**

### **A Practical Solution for AI-Assisted Development, Code Reviews, and Project Sharing**

CodeFlattener transforms your multi-file project into a structured, dependency-aware markdown document. It aims to solve common challenges with limited context in AI assistants and disjointed code reviews by delivering your codebase as a single, organized document that preserves relationships between files.

Designed to provide AI assistants with more complete context, simplify code reviews, and enable project sharing without the overhead of setup requirements.

## Key Features

- Flattens source code from your workspace into a single markdown file (or multiple if size exceeds limits)

### Language Support

- **20+ Programming Languages**: JavaScript, TypeScript, Python, Java, C/C++, C#, Go, Ruby, PHP, Rust, Swift, Kotlin, Dart, Elixir, Erlang, and more
- **Infrastructure as Code**: Terraform, Docker, and Kubernetes YAML
- **Web Technologies**: HTML, CSS, SCSS, and SVG
- **Configuration Files**: JSON, XML, YAML, TOML, and INI

### Core Functionality

- Automatically creates a CodeFlattened folder in your project root
- Provides a directory structure overview and comprehensive file listing
- Includes full source code content of each file with proper formatting
- Intelligently processes and formats markdown files for better readability
- Ignores binary files, build directories, and other configurable patterns
- Tracks file sizes and estimated token counts with human-readable formatting
- Detailed progress indicators that provide status updates during processing
- Parallel file processing for improved performance on large codebases
- Robust error handling that continues processing despite individual file failures

## How to Use CodeFlattener

### Quick Start

1. Open your project folder in VSCode
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) to open the command palette
3. Type "Flatten Code" and select the command
4. Wait while the extension processes your files (a progress indicator will be shown)
5. Once complete, a notification will appear with the location of your flattened code
6. Open the `CodeFlattened` folder (or your custom output folder) to view the generated markdown files

### Viewing the Results

1. The extension generates a comprehensive file that combines all content:
   - `*_flattened.md`: Contains the flattened source code, analysis information, and dependency diagrams
2. Open this file in VS Code to view your codebase with syntax highlighting
3. Each file begins with a summary section showing file counts and statistics
4. The file includes a directory structure visualization to help navigate your project
5. Source files are presented with their dependencies and complete code
6. A Mermaid dependency diagram is included at the end to visualize file relationships

### Customizing the Output

1. Go to VS Code Settings (`Ctrl+,` or `Cmd+,`)
2. Search for "CodeFlattener"
3. Modify any of the following settings:
   - Change the output folder name
   - Exclude specific file patterns (e.g., test files, temporary files)
   - Include only specific file patterns
   - Adjust maximum file size limits
   - Set output file size for splitting large codebases

### Using the Flattened Output

1. For AI Tools: Copy the content of the markdown file(s) into your preferred AI assistant
2. For Code Reviews: Share the markdown file(s) with reviewers
3. For Documentation: Commit the flattened files to your repository or include them in documentation
4. For Learning: Use the dependency information to understand the project structure

## Extension Settings

This extension contributes the following settings:

- **codeFlattener.outputFolder**: Name of the folder where flattened source code will be saved (default: "CodeFlattened")
- **codeFlattener.excludePatterns**: Patterns to exclude from processing in glob format (default: bin/*, obj/*, node_modules/**, etc.)
- **codeFlattener.includePatterns**: Patterns to include in processing in glob format (if empty, all files are processed except excluded ones)
- **codeFlattener.maxFileSizeBytes**: Maximum file size in bytes for analysis (default: 10MB)
- **codeFlattener.maxOutputFileSizeBytes**: Maximum output file size in bytes before rotation (default: 5MB)

## Troubleshooting

### Common Issues and Solutions

- **Processing takes too long**: For large codebases, try excluding non-essential directories and files using the exclude patterns setting
- **Output file is too large**: Adjust the `maxOutputFileSizeBytes` setting to create smaller, more manageable files
- **Missing important files**: Check your include/exclude patterns to ensure necessary files aren't being filtered out
- **Memory usage concerns**: If processing a very large codebase, increase the `maxFileSizeBytes` setting to skip extremely large files
- **Output file not created**: Ensure your project has writable permissions for the output folder
- **Advanced features**: The extension now generates a single consolidated file that includes both flattened code and dependency analysis
- **Dependency visualization**: Mermaid diagrams are included at the end of the output file for clear visualization of file dependencies

### Getting Help

If you encounter issues not covered here:

1. Submit your feature requests and bug reports through our [Canny feedback board](https://codeflattener.canny.io/)
2. For other inquiries, you may contact [giuseppe@turitto.net](mailto:giuseppe@turitto.net) with questions, but please note that support availability is limited

## How It Works

The extension scans your project directory, ignoring paths that match exclude patterns and including files that match appropriate code file extensions. It creates a markdown file that includes:

1. A summary section with file counts, size information, and processing time
2. A directory structure visualization with folders and files
3. For each file, a list of its dependencies (imports, includes, etc.)
4. The complete content of each source file with proper formatting

Large output files are automatically split into multiple parts to avoid token limits when used with AI tools.

## 🔗 Intelligent Dependency Detection

The extension automatically detects and documents dependencies between files. For each file, it:

1. Analyzes the file content to identify import statements, require calls, or includes
2. Adds a "Dependencies" section at the beginning of each file's documentation
3. Lists all detected dependencies with their paths or module names

Supported languages and import types:

- JavaScript/TypeScript: ES6 imports, CommonJS requires, dynamic imports (.js, .jsx, .ts, .tsx, .mjs, .cjs, .mts, .cts)
- Python: import statements and from-import statements (.py, .pyi, .pyw)
- Java: package imports (.java)
- C#: using directives (.cs)
- C/C++: #include statements (.cpp, .hpp, .c, .h, .cxx, .cc, .hxx)
- Go: import statements (both single and block imports) (.go)
- PHP: require/include statements and use declarations (.php, .phtml, .php3, .php4)
- Ruby: require and load statements (.rb, .rbw)
- Rust: use and extern crate statements (.rs)
- Swift: import statements (.swift)
- Kotlin: import statements with optional alias (.kt, .kts)
- Dart: import and part statements (.dart)
- Elixir: alias, import, and require statements (.ex, .exs)
- Erlang: -include and -include_lib directives (.erl, .hrl)
- Terraform: module, provider, and resource declarations (.tf, .tfvars, .hcl)
- Docker: FROM statements in Dockerfiles
- Kubernetes/Docker Compose: image references in YAML files
- SQL: table references from FROM and JOIN clauses (.sql, .mysql, .pgsql, .sqlite)
- HTML: script, link, and img references (.html, .htm)
- CSS/SCSS/LESS: @import and url() references (.css, .scss, .less)

This feature makes it easier for AI models to understand the relationships between files in your codebase, improving context-aware code generation and comprehension.

## 🎨 Rich Syntax Highlighting

The extension provides comprehensive syntax highlighting support for all supported languages, making your flattened code more readable:

- Each code block in the generated markdown file is tagged with the appropriate language identifier
- Syntax highlighting works automatically in VS Code and other markdown viewers that support code blocks
- All file types are mapped to their correct language for highlighting purposes
- Enhanced readability helps both human readers and AI models understand the code structure

## ⚡ Performance Optimizations

This extension is optimized for performance and reliability:

- Parallel Processing: Files are processed in parallel batches for faster execution
- Efficient File I/O: Minimizes disk operations by batching writes and optimizing content handling
- Smart File Filtering: Uses efficient glob pattern matching with fast-path optimizations
- Memory Management: Handles large files gracefully to avoid memory issues
- Robust Error Handling: Continues processing even if individual files have issues
- Progress Reporting: Provides detailed progress updates during processing

## Supported File Types

The extension supports a wide range of file types including:

- Code Files: .js, .ts, .py, .java, .c, .cpp, .cs, .go, .rb, .php, .rs, .swift, .kt, .dart, .ex, .erl, .tf, etc.
- Web Files: .html, .css, .scss, .less, .svg, etc.
- Config Files: .json, .xml, .yaml, .yml, .toml, .ini, etc.
- Documentation: .md, .txt, .rst, etc.
- Project Files: .csproj, .vbproj, .gradle, etc.
- Special Files: Dockerfile, Makefile, .gitignore, etc.

Binary files and media files are automatically excluded from processing.

## How CodeFlattener Can Help You

- **Enhance AI Coding Assistants**: Feed your codebase to AI tools like ChatGPT, Claude, or GitHub Copilot with better context preservation. This can help them generate more relevant suggestions and solutions based on understanding your project structure.

- **Streamline Code Reviews**: Share navigable code snapshots that include dependencies and relationships. Reviewers can get a clearer understanding of your project without needing to jump between files or set up the environment.

- **Simplify Documentation**: Generate dependency-aware documentation of your source code with minimal effort. Useful for onboarding, knowledge transfer, and project handovers.

- **Explore New Codebases**: Flatten unfamiliar projects into a readable format that shows the architecture and dependencies more clearly. Helpful for developers joining projects or learning new frameworks.

---

## Try Source Code Flattener for Your Projects

Install Source Code Flattener and see how complete codebase context can improve your AI-assisted development, code reviews, and project documentation.

### Upcoming Improvements

Based on user testing and feedback, we're working on:

1. **Consolidated Output**: Creating a single, comprehensive file (split only if necessary for size)
2. **Mermaid Dependency Diagrams**: Adding visual dependency graphs using Mermaid at the end of the file
3. **Optimized File Size**: Improving compression and formatting for smaller, more readable output
4. **Enhanced Readability**: Refining the output format for better navigation and comprehension

**⭐ If you find this extension helpful, please consider [leaving a review](https://marketplace.visualstudio.com/items?itemName=GiuseppeTuritto.code-flattener&ssr=false#review-details)! ⭐**

**[Submit Feedback](https://codeflattener.canny.io/) | [Rate & Review](https://marketplace.visualstudio.com/items?itemName=GiuseppeTuritto.code-flattener&ssr=false#review-details) | Contact: [giuseppe@turitto.net](mailto:giuseppe@turitto.net) (limited support)**
