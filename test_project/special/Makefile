.PHONY: setup build test clean run

# Variables
NPM := npm
NODE := node
DIST_DIR := dist
SRC_DIR := src
TEST_DIR := tests

# Default target
all: setup build test

# Setup project
setup:
	@echo "Setting up project..."
	$(NPM) install

# Build the project
build:
	@echo "Building project..."
	$(NPM) run build

# Run tests
test:
	@echo "Running tests..."
	$(NPM) test

# Clean build artifacts
clean:
	@echo "Cleaning project..."
	rm -rf $(DIST_DIR)
	rm -rf node_modules

# Run the application
run:
	@echo "Running application..."
	$(NODE) $(SRC_DIR)/main.js

# Development mode
dev:
	@echo "Starting development server..."
	$(NPM) run dev

# Help target
help:
	@echo "Available targets:"
	@echo "  setup  - Install dependencies"
	@echo "  build  - Build the project"
	@echo "  test   - Run tests"
	@echo "  clean  - Remove build artifacts"
	@echo "  run    - Run the application"
	@echo "  dev    - Start development server"
	@echo "  all    - Run setup, build, and test"
