# Change Log

All notable changes to the "CodeFlattener" extension will be documented in this file.

## [1.6.1] - 2025-04-19

### Added

#### Ultra-Compact Mode for Maximum Token Efficiency

- New `codeFlattener.ultraCompactMode` setting to enable extreme minification for LLMs (disabled by default)
- Added `codeFlattener.compactModeLevel` to control compression intensity:
  - `minimal` - Light compression focusing only on comments
  - `moderate` - Balanced compression (default)
  - `aggressive` - Maximum compression for lowest token usage
- Advanced compression techniques including:
  - Intelligent comment summarization
  - Repetitive pattern detection and collapsing
  - Import statement condensing
  - Commented code removal (aggressive mode)

#### Git Change Detection for LLM Optimization

- New feature to highlight recently modified files in git repositories
- Added `codeFlattener.highlightGitChanges` setting to enable/disable the feature (enabled by default)
- Added `codeFlattener.gitChangeHighlightStyle` setting for customizable highlighting styles:
  - `emoji` - Uses 🔄 icon with bold text (default)
  - `text` - Simple text marker [RECENTLY MODIFIED]
  - `markdown` - Bold styling **RECENTLY MODIFIED**
- Added `codeFlattener.gitChangeHistoryDepth` setting to control how many days back to look for changes
- Added `codeFlattener.prioritizeGitChanges` setting to boost recently changed files to the top of output

#### File Filtering Improvements

- Support for `.flattenignore` file to exclude specific files and folders from flattening
- New setting `codeFlattener.respectFlattenignore` to enable/disable .flattenignore support (enabled by default)

### Fixed

- Improved error handling with user-friendly messages
- Removed console.error calls for better VS Code integration
- Enhanced logging with dedicated output channel

## [1.6.0] - 2025-03-23

### Added

- New boolean setting `minifyOutput` to optimize flattened code size for LLMs (enabled by default)
- New boolean setting `addCodeRelationshipDiagrams` to control code visualization
- Added support for 'medium' level diagrams when visualization is enabled

### Changed

- Simplified extension settings to focus on essential options only
- Streamlined code flattening process for better performance
- All code files are now treated as plaintext without special delimiters
- Updated file filtering to better handle sensitive information
- Enhanced cross-platform compatibility
- Default output folder changed to "CodeFlattened_Output"
- Optimized for better performance with large language models (LLMs)
- Implemented smart minification for output files that reduces token usage while preserving code structure and important comments

### Removed

- Simplified configuration by removing less-used settings while maintaining functionality
- Removed code fence formatting from processed file contents

## [1.5.5] - 2025-03-23

### Improvements

- Updated extension name to consistently use "CodeFlattener" across all files
- Removed redundant VERSION file to maintain single source of truth in package.json
- Various documentation improvements
- Lowered minimum VS Code version requirement to 1.86.0 for broader compatibility

## [1.5.1] - 2025-03-21

### Improvements

- Consolidated output files into a single comprehensive file instead of separate files for flattened code and analysis
- Added dependency visualization using Mermaid diagrams at the end of the output file
- Improved table of contents with navigation links to specific files
- Enhanced code organization with anchor links for better navigation

## [1.5.0] - 2025-03-21

### Added

- Extensive support for multiple programming languages:
  - Rust - Detects `use` and `extern crate` statements
  - Swift - Detects `import` statements
  - Kotlin - Detects `import` statements with optional alias
  - Dart - Detects `import` and `part` statements
  - Elixir - Detects `alias`, `import`, and `require` statements
  - Erlang - Detects `-include` and `-include_lib` directives
  - Terraform - Detects `module`, `provider`, and `resource` declarations
  - Docker - Detects `FROM` statements in Dockerfiles
  - Kubernetes/Docker Compose - Detects `image:` references
  - SQL - Detects table references from `FROM` and `JOIN` clauses
- Enhanced syntax highlighting mapping for newly supported languages

### Changed

- Updated existing language support with additional file extensions
- Improved dependency detection patterns for more accurate results
- Extended the code flattener with better language detection capabilities

## [1.1.0] - 2025-03-20

### Publisher Change

- Updated VS Code marketplace publisher ID from 'GTuritto' to 'GiuseppeTuritto'
- Maintained GitHub repository URLs as 'GTuritto'

### Feature Additions

- Automatic dependency detection and documentation for code files
- Support for detecting imports in multiple programming languages including JavaScript, TypeScript, Python, Java, C#, C/C++, Go, PHP, Ruby, Rust, HTML, and CSS

### Other Improvements

- Enhanced installation documentation and direct download options
- Added one-click installation from GitHub repository
- Included compiled VSIX file for easier installation
- Improved repository discoverability with better metadata
- Code formatting improvements with syntax highlighting in output

## [1.0.0] - 2025-03-20

### Initial Release

- Flatten source code from workspace into markdown files
- Create a dedicated output folder (default: `CodeFlattened`)
- Process various file types and formats
- Configure include/exclude patterns using glob format
- Automatic file splitting for large output files
- Detailed progress indicators and summary information
- Comprehensive error handling and parallel processing
- Support for both small and large codebases
- Optimized performance for file I/O operations
- Intelligent directory structure visualization
- Configurable file size limits for both input and output
