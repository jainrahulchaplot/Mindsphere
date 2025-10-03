# Git Workflow Guide

> Complete guide for working with separated repositories

---

## 🚀 Quick Start

### 1. Initialize All Repositories

```bash
chmod +x setup-git-repos.sh
./setup-git-repos.sh
```

### 2. Create GitHub Repositories

Go to https://github.com/new and create:
- `mindsphere-frontend`
- `mindsphere-backend`
- `mindsphere-ai-agent`
- `mindsphere-mobile`

### 3. Connect to GitHub

```bash
chmod +x add-git-remotes.sh
./add-git-remotes.sh YOUR_GITHUB_USERNAME
```

---

## 🌳 Branching Strategy

### Main Branches

- **`main`** - Production-ready code
- **`develop`** - Integration branch for features

### Feature Branches

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes
git add .
git commit -m "feat: add new feature"

# Push to GitHub
git push origin feature/feature-name

# Create Pull Request on GitHub
# After approval, merge to main
```

### Branch Naming Convention

- `feature/` - New features
  - `feature/user-authentication`
  - `feature/voice-agent-integration`
  
- `fix/` - Bug fixes
  - `fix/audio-playback-issue`
  - `fix/login-redirect`
  
- `hotfix/` - Critical production fixes
  - `hotfix/security-patch`
  - `hotfix/crash-on-startup`
  
- `refactor/` - Code improvements
  - `refactor/api-client`
  - `refactor/state-management`
  
- `docs/` - Documentation only
  - `docs/api-reference`
  - `docs/setup-guide`

---

## 💻 Daily Workflow

### Working on Frontend

```bash
cd mindsphere-frontend

# Pull latest changes
git pull origin main

# Create feature branch
git checkout -b feature/new-ui-component

# Make changes
# ... edit files ...

# Check status
git status

# Stage changes
git add .

# Commit
git commit -m "feat: add new UI component

- Add Button component
- Add Card component
- Update styling"

# Push to GitHub
git push origin feature/new-ui-component

# Create PR on GitHub
# After review and approval, merge to main
```

### Working on Backend

```bash
cd mindsphere-backend

# Pull latest
git pull origin main

# Create feature branch
git checkout -b feature/new-api-endpoint

# Make changes
# ... edit files ...

# Commit
git commit -am "feat: add user preferences endpoint"

# Push
git push origin feature/new-api-endpoint

# Create PR
```

### Cross-Service Features

When a feature spans multiple services:

```bash
# Frontend
cd mindsphere-frontend
git checkout -b feature/user-settings
# Make changes
git commit -am "feat(frontend): user settings UI"
git push origin feature/user-settings

# Backend
cd ../mindsphere-backend
git checkout -b feature/user-settings
# Make changes
git commit -am "feat(backend): user settings API"
git push origin feature/user-settings

# Create separate PRs for each
# Include links between PRs in description
```

---

## 📝 Commit Message Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, no logic change)
- `refactor`: Code change (no feat/fix)
- `perf`: Performance improvement
- `test`: Add/update tests
- `chore`: Build/config changes

### Examples

```bash
# Simple feature
git commit -m "feat: add voice recording feature"

# Bug fix with scope
git commit -m "fix(audio): resolve playback stuttering"

# Breaking change
git commit -m "feat!: change API response format

BREAKING CHANGE: API now returns data in new format"

# Multiple changes
git commit -m "feat: add user dashboard

- Add dashboard layout
- Add usage statistics
- Add streak display
- Update navigation"
```

---

## 🔄 Pull Request Workflow

### 1. Create Feature Branch

```bash
git checkout -b feature/my-feature
```

### 2. Make Changes & Commit

```bash
git add .
git commit -m "feat: implement my feature"
```

### 3. Push to GitHub

```bash
git push origin feature/my-feature
```

### 4. Create Pull Request

On GitHub:
1. Go to repository
2. Click "Pull Requests" → "New Pull Request"
3. Select your branch
4. Fill in description:

```markdown
## Description
Brief description of changes

## Changes
- Change 1
- Change 2

## Testing
- [ ] Tested locally
- [ ] All tests pass
- [ ] No console errors

## Screenshots
(if UI changes)

## Related Issues
Closes #123
```

### 5. Code Review

- Address review comments
- Push new commits to same branch
- PR updates automatically

### 6. Merge

After approval:
- Squash and merge (preferred)
- Or merge commit
- Delete feature branch after merge

---

## 🛠️ Useful Commands

### Status & Info

```bash
# Check status
git status

# View commit history
git log --oneline --graph

# View remote
git remote -v

# Check current branch
git branch
```

### Branching

```bash
# List all branches
git branch -a

# Create branch
git checkout -b feature/new-feature

# Switch branch
git checkout main

# Delete branch
git branch -d feature/old-feature

# Delete remote branch
git push origin --delete feature/old-feature
```

### Syncing

```bash
# Pull latest from main
git pull origin main

# Fetch all branches
git fetch --all

# Update current branch from main
git checkout feature/my-feature
git merge main

# Or rebase
git rebase main
```

### Undoing Changes

```bash
# Undo unstaged changes
git checkout -- <file>

# Undo staged changes
git reset HEAD <file>

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

### Stashing

```bash
# Save work temporarily
git stash

# List stashes
git stash list

# Apply latest stash
git stash pop

# Apply specific stash
git stash apply stash@{0}
```

---

## 🚨 Common Issues & Solutions

### Issue: Merge Conflicts

```bash
# Pull latest changes
git pull origin main

# If conflicts:
# 1. Open conflicted files
# 2. Resolve conflicts (look for <<<<<<, ======, >>>>>>)
# 3. Stage resolved files
git add <resolved-file>

# 4. Complete merge
git commit -m "merge: resolve conflicts"
```

### Issue: Pushed Wrong Code

```bash
# If not pushed yet
git reset --soft HEAD~1

# If already pushed (creates new commit)
git revert HEAD
git push origin main
```

### Issue: Need to Update Feature Branch

```bash
# Option 1: Merge
git checkout feature/my-feature
git merge main

# Option 2: Rebase (cleaner history)
git checkout feature/my-feature
git rebase main
```

---

## 📊 Repository Status

Check status across all repos:

```bash
# Create a helper script
cat > check-all-repos.sh << 'EOF'
#!/bin/bash
for repo in mindsphere-*; do
  echo "📁 $repo"
  cd "$repo"
  git status -s
  cd ..
  echo ""
done
EOF

chmod +x check-all-repos.sh
./check-all-repos.sh
```

---

## 🎯 Best Practices

1. **Commit Often** - Small, focused commits
2. **Write Clear Messages** - Follow conventional commits
3. **Pull Before Push** - Avoid conflicts
4. **Test Before PR** - Ensure code works
5. **Review Your Code** - Check diff before committing
6. **Keep PRs Small** - Easier to review
7. **Update Documentation** - Keep README current
8. **Delete Old Branches** - Keep repo clean

---

## 📚 Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)

---

## ✅ Checklist for New Features

- [ ] Create feature branch from `main`
- [ ] Implement feature with tests
- [ ] Update documentation
- [ ] Write clear commit messages
- [ ] Push branch to GitHub
- [ ] Create Pull Request
- [ ] Address review comments
- [ ] Merge after approval
- [ ] Delete feature branch
- [ ] Pull latest main locally

