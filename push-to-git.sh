#!/bin/bash

# MindSphere Git Push Script
# This script helps push changes to the correct repositories

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if we're in the right directory
check_directory() {
    if [ ! -f ".cursorrules" ]; then
        print_error "Please run this script from the MindSphere root directory"
        exit 1
    fi
}

# Function to push changes to all repositories
push_all() {
    local message="$1"
    local branch="${2:-main}"
    
    if [ -z "$message" ]; then
        print_error "Commit message is required"
        echo "Usage: $0 \"commit message\" [branch]"
        exit 1
    fi
    
    print_status "Pushing changes to all repositories..."
    print_status "Message: $message"
    print_status "Branch: $branch"
    
    # Services to push
    services=("mindsphere-backend" "mindsphere-frontend" "mindsphere-ai-agent" "mindsphere-mobile")
    
    for service in "${services[@]}"; do
        if [ -d "$service" ]; then
            print_status "Processing $service..."
            cd "$service"
            
            # Check if there are changes
            if [ -n "$(git status --porcelain)" ]; then
                # Add all changes
                git add .
                
                # Commit changes
                git commit -m "$message"
                
                # Push to remote
                git push origin "$branch"
                
                print_success "Pushed $service successfully"
            else
                print_status "No changes in $service, skipping..."
            fi
            
            cd ..
        else
            print_error "Service $service not found, skipping..."
        fi
    done
    
    print_success "All repositories pushed successfully!"
}

# Function to show help
show_help() {
    echo "MindSphere Git Push Script"
    echo ""
    echo "Usage: $0 \"commit message\" [branch]"
    echo ""
    echo "Examples:"
    echo "  $0 \"feat: add user authentication\""
    echo "  $0 \"fix: resolve voice processing issue\" main"
    echo "  $0 \"docs: update API documentation\" develop"
    echo ""
    echo "This script will:"
    echo "1. Add all changes in each service"
    echo "2. Commit with the provided message"
    echo "3. Push to the specified branch (default: main)"
}

# Main script logic
main() {
    check_directory
    
    if [ "$1" = "help" ] || [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
        show_help
        exit 0
    fi
    
    if [ -z "$1" ]; then
        print_error "Commit message is required"
        show_help
        exit 1
    fi
    
    push_all "$1" "$2"
}

# Run main function with all arguments
main "$@"
