#!/bin/bash

# MindSphere Git Repository Setup Script
# This script sets up Git repositories for all MindSphere services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Service configuration
declare -A SERVICES=(
    ["mindsphere-backend"]="https://github.com/yourusername/mindsphere-backend.git"
    ["mindsphere-frontend"]="https://github.com/yourusername/mindsphere-frontend.git"
    ["mindsphere-ai-agent"]="https://github.com/yourusername/mindsphere-ai-agent.git"
    ["mindsphere-mobile"]="https://github.com/yourusername/mindsphere-mobile.git"
)

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

# Function to setup Git repository for a service
setup_service_git() {
    local service="$1"
    local remote_url="$2"
    
    print_status "Setting up Git for $service..."
    
    if [ ! -d "$service" ]; then
        print_warning "Service directory $service not found, skipping..."
        return
    fi
    
    cd "$service"
    
    # Initialize Git if not already initialized
    if [ ! -d ".git" ]; then
        print_status "Initializing Git repository for $service..."
        git init
    fi
    
    # Add remote origin if not exists
    if ! git remote get-url origin >/dev/null 2>&1; then
        print_status "Adding remote origin for $service..."
        git remote add origin "$remote_url"
    else
        print_status "Remote origin already exists for $service"
    fi
    
    # Create .gitignore if not exists
    if [ ! -f ".gitignore" ]; then
        print_status "Creating .gitignore for $service..."
        cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Environment files
.env
.env.*
!env.example

# Logs
logs/
*.log

# OS files
.DS_Store

# IDE
.vscode/
.idea/
.cursor/

# Temporary files
temp-credentials.json
google-credentials.json

# Build outputs
dist/
build/
out/

# Testing
coverage/

# Platform specific
.vercel
.railway
.expo/
EOF
    fi
    
    # Add all files
    git add .
    
    # Create initial commit if no commits exist
    if ! git rev-parse HEAD >/dev/null 2>&1; then
        print_status "Creating initial commit for $service..."
        git commit -m "feat: initial commit for $service"
    fi
    
    # Create main branch if not exists
    if ! git show-ref --verify --quiet refs/heads/main; then
        print_status "Creating main branch for $service..."
        git checkout -b main
    fi
    
    # Create develop branch if not exists
    if ! git show-ref --verify --quiet refs/heads/develop; then
        print_status "Creating develop branch for $service..."
        git checkout -b develop
    fi
    
    cd ..
    print_success "Git setup completed for $service"
}

# Function to push all repositories
push_all_repos() {
    print_status "Pushing all repositories to remote..."
    
    for service in "${!SERVICES[@]}"; do
        if [ -d "$service" ]; then
            print_status "Pushing $service..."
            cd "$service"
            
            # Push main branch
            git push -u origin main
            
            # Push develop branch
            git push -u origin develop
            
            cd ..
            print_success "Pushed $service"
        fi
    done
}

# Function to show repository status
show_status() {
    print_status "Repository Status:"
    echo ""
    
    for service in "${!SERVICES[@]}"; do
        if [ -d "$service" ]; then
            echo -e "${BLUE}=== $service ===${NC}"
            cd "$service"
            
            # Show current branch
            current_branch=$(git branch --show-current)
            echo "Current branch: $current_branch"
            
            # Show remote URL
            remote_url=$(git remote get-url origin 2>/dev/null || echo "No remote")
            echo "Remote URL: $remote_url"
            
            # Show status
            git status --porcelain
            
            echo ""
            cd ..
        fi
    done
}

# Function to update remote URLs
update_remotes() {
    local github_username="$1"
    
    if [ -z "$github_username" ]; then
        print_error "GitHub username is required"
        echo "Usage: $0 update-remotes <github-username>"
        exit 1
    fi
    
    print_status "Updating remote URLs for GitHub username: $github_username"
    
    for service in "${!SERVICES[@]}"; do
        if [ -d "$service" ]; then
            print_status "Updating remote for $service..."
            cd "$service"
            
            local new_url="https://github.com/$github_username/$service.git"
            git remote set-url origin "$new_url"
            
            print_success "Updated remote URL for $service: $new_url"
            cd ..
        fi
    done
}

# Function to show help
show_help() {
    echo "MindSphere Git Repository Setup Script"
    echo ""
    echo "Usage: $0 <command> [arguments]"
    echo ""
    echo "Commands:"
    echo "  setup                    - Setup Git repositories for all services"
    echo "  push                     - Push all repositories to remote"
    echo "  status                   - Show repository status"
    echo "  update-remotes <username> - Update remote URLs with GitHub username"
    echo "  help                     - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 setup"
    echo "  $0 push"
    echo "  $0 status"
    echo "  $0 update-remotes yourusername"
}

# Main script logic
main() {
    check_directory
    
    case "$1" in
        "setup")
            print_status "Setting up Git repositories for all MindSphere services..."
            for service in "${!SERVICES[@]}"; do
                setup_service_git "$service" "${SERVICES[$service]}"
            done
            print_success "Git setup completed for all services!"
            ;;
        "push")
            push_all_repos
            ;;
        "status")
            show_status
            ;;
        "update-remotes")
            update_remotes "$2"
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
