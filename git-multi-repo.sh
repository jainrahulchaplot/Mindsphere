#!/bin/bash

# MindSphere Multi-Repository Git Management Script
# This script helps manage Git operations across all MindSphere services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Service directories
SERVICES=("mindsphere-backend" "mindsphere-frontend" "mindsphere-ai-agent" "mindsphere-mobile")

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
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

# Function to execute command in each service directory
execute_in_services() {
    local command="$1"
    local description="$2"
    
    print_status "Executing: $description"
    
    for service in "${SERVICES[@]}"; do
        if [ -d "$service" ]; then
            print_status "Processing $service..."
            cd "$service"
            eval "$command"
            cd ..
            print_success "Completed $service"
        else
            print_warning "Service $service not found, skipping..."
        fi
    done
}

# Function to check Git status
check_status() {
    print_status "Checking Git status across all services..."
    execute_in_services "git status --porcelain" "Git status check"
}

# Function to add files to Git
add_files() {
    local files="$1"
    if [ -z "$files" ]; then
        files="."
    fi
    
    print_status "Adding files: $files"
    execute_in_services "git add $files" "Adding files to Git"
}

# Function to commit changes
commit_changes() {
    local message="$1"
    if [ -z "$message" ]; then
        print_error "Commit message is required"
        echo "Usage: $0 commit \"your commit message\""
        exit 1
    fi
    
    print_status "Committing changes with message: $message"
    execute_in_services "git commit -m \"$message\"" "Committing changes"
}

# Function to push changes
push_changes() {
    local branch="$1"
    if [ -z "$branch" ]; then
        branch="main"
    fi
    
    print_status "Pushing changes to branch: $branch"
    execute_in_services "git push origin $branch" "Pushing changes"
}

# Function to create feature branch
create_feature_branch() {
    local feature_name="$1"
    if [ -z "$feature_name" ]; then
        print_error "Feature name is required"
        echo "Usage: $0 feature \"feature-name\""
        exit 1
    fi
    
    local branch_name="feature/$feature_name"
    print_status "Creating feature branch: $branch_name"
    execute_in_services "git checkout -b $branch_name" "Creating feature branch"
}

# Function to switch to main branch
switch_to_main() {
    print_status "Switching to main branch"
    execute_in_services "git checkout main" "Switching to main branch"
}

# Function to pull latest changes
pull_latest() {
    local branch="$1"
    if [ -z "$branch" ]; then
        branch="main"
    fi
    
    print_status "Pulling latest changes from branch: $branch"
    execute_in_services "git pull origin $branch" "Pulling latest changes"
}

# Function to show help
show_help() {
    echo "MindSphere Multi-Repository Git Management Script"
    echo ""
    echo "Usage: $0 <command> [arguments]"
    echo ""
    echo "Commands:"
    echo "  status                    - Check Git status across all services"
    echo "  add [files]              - Add files to Git (default: all files)"
    echo "  commit \"message\"         - Commit changes with message"
    echo "  push [branch]            - Push changes to branch (default: main)"
    echo "  feature \"name\"           - Create feature branch"
    echo "  main                     - Switch to main branch"
    echo "  pull [branch]            - Pull latest changes (default: main)"
    echo "  sync                     - Pull latest and push changes"
    echo "  help                     - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 status"
    echo "  $0 add src/"
    echo "  $0 commit \"feat: add user authentication\""
    echo "  $0 push feature/user-auth"
    echo "  $0 feature \"voice-interface\""
    echo "  $0 sync"
}

# Function to sync (pull + push)
sync_changes() {
    local branch="$1"
    if [ -z "$branch" ]; then
        branch="main"
    fi
    
    print_status "Syncing changes for branch: $branch"
    pull_latest "$branch"
    push_changes "$branch"
}

# Main script logic
main() {
    check_directory
    
    case "$1" in
        "status")
            check_status
            ;;
        "add")
            add_files "$2"
            ;;
        "commit")
            commit_changes "$2"
            ;;
        "push")
            push_changes "$2"
            ;;
        "feature")
            create_feature_branch "$2"
            ;;
        "main")
            switch_to_main
            ;;
        "pull")
            pull_latest "$2"
            ;;
        "sync")
            sync_changes "$2"
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
