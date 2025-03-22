# Change Log

All notable changes to the "Source Code Flattener" extension will be documented in this file.

## [1.5.2] - 2025-03-22

### Fixed

- Resolved compatibility issue with cursor version 0.47.8 and VSCode version 1.96.2
- Significantly expanded compatibility by reducing minimum VSCode version requirement to 1.74.0
- Downgraded dependency requirements for maximum compatibility with older environments:
  - TypeScript from 5.8.2 to 4.9.5
  - Node types from 22.13.10 to 16.11.7
  - Glob from 8.1.0 to 7.2.0
  - VSCode types from 1.98.0 to 1.74.0

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
