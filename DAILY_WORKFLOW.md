# 📖 Your Daily Workflow Guide

> Complete guide for working with your separated MindSphere repositories

---

## 🎯 **YOUR CURRENT SETUP**

You now have **4 separate Git repositories** on GitHub:

```
https://github.com/jainrahulchaplot/mindsphere-frontend
https://github.com/jainrahulchaplot/mindsphere-backend
https://github.com/jainrahulchaplot/mindsphere-ai-agent
https://github.com/jainrahulchaplot/mindsphere-mobile
```

Each repository:
- ✅ Has its own Git history
- ✅ Deploys independently
- ✅ Can be worked on separately
- ✅ Has its own issues/PRs on GitHub

---

## 💻 **DAILY WORKFLOW - MOST COMMON TASKS**

### **Scenario 1: Working on Frontend** (Most Common)

```bash
# Navigate to frontend
cd /Users/rahul/Documents/Mindsphere\ V1\ Separated/mindsphere-frontend

# ALWAYS pull latest changes first (important!)
git pull origin main

# Make your changes
# ... edit files in your editor ...

# Check what changed
git status

# Stage all changes
git add .

# Commit with a clear message
git commit -m "feat: add new feature description"

# Push to GitHub
git push origin main

# Done! ✅
```

### **Scenario 2: Working on Backend**

```bash
# Navigate to backend
cd /Users/rahul/Documents/Mindsphere\ V1\ Separated/mindsphere-backend

# Pull latest
git pull origin main

# Make changes
# ... edit files ...

# Stage, commit, push
git add .
git commit -m "feat: add new API endpoint"
git push origin main
```

### **Scenario 3: Feature Across Multiple Services**

When your feature needs BOTH frontend and backend changes:

```bash
# Step 1: Backend first (API changes)
cd mindsphere-backend
git pull origin main
# Make changes
git add .
git commit -m "feat(api): add user settings endpoint"
git push origin main

# Step 2: Then frontend (UI changes)
cd ../mindsphere-frontend
git pull origin main
# Make changes
git add .
git commit -m "feat(ui): add user settings page"
git push origin main
```

---

## 🌿 **BRANCHING WORKFLOW** (When working on bigger features)

### **Creating a Feature Branch**

```bash
cd mindsphere-frontend

# Pull latest
git pull origin main

# Create and switch to feature branch
git checkout -b feature/my-new-feature

# Make changes
# ... edit files ...

# Commit to feature branch
git add .
git commit -m "feat: implement new feature"

# Push feature branch to GitHub
git push origin feature/my-new-feature

# Go to GitHub and create a Pull Request
# After review, merge on GitHub
# Then delete the branch on GitHub

# Locally, switch back to main and update
git checkout main
git pull origin main
git branch -d feature/my-new-feature  # Delete local branch
```

---

## 📝 **COMMIT MESSAGE CONVENTIONS**

Follow this format for clear history:

```bash
# Features
git commit -m "feat: add user authentication"
git commit -m "feat(voice): add recording feature"

# Bug fixes
git commit -m "fix: resolve audio playback issue"
git commit -m "fix(api): handle empty response"

# Updates/Improvements
git commit -m "refactor: improve code structure"
git commit -m "style: format code"
git commit -m "docs: update README"

# Multiple changes
git commit -m "feat: add dashboard

- Add usage statistics
- Add habit tracker
- Update navigation"
```

---

## 🔄 **SYNCING YOUR CODE**

### **Before Starting Work (Every Time!)**

```bash
cd mindsphere-frontend  # or whichever repo
git pull origin main
```

**Why?** To get latest changes if you're working from multiple computers or with others.

### **After Making Changes**

```bash
git add .
git commit -m "your message"
git push origin main
```

---

## 🚀 **STARTING YOUR SERVICES**

### **Option 1: Start All Services at Once**

```bash
cd /Users/rahul/Documents/Mindsphere\ V1\ Separated
./start-all.sh
```

### **Option 2: Start Individually (Better for Development)**

```bash
# Terminal 1 - Backend
cd /Users/rahul/Documents/Mindsphere\ V1\ Separated/mindsphere-backend
npm start

# Terminal 2 - Frontend  
cd /Users/rahul/Documents/Mindsphere\ V1\ Separated/mindsphere-frontend
npm run dev

# Terminal 3 - AI Agent (when needed)
cd /Users/rahul/Documents/Mindsphere\ V1\ Separated/mindsphere-ai-agent
npm start
```

**Access:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

---

## 🛠️ **COMMON COMMANDS REFERENCE**

### **Git Status & Info**

```bash
# Check what changed
git status

# See commit history
git log --oneline

# See what you're about to commit
git diff
```

### **Undoing Changes**

```bash
# Undo changes to a file (before staging)
git checkout -- filename.ts

# Unstage a file
git reset HEAD filename.ts

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes) - USE CAREFULLY!
git reset --hard HEAD~1
```

### **Branch Management**

```bash
# List branches
git branch

# Switch branch
git checkout main
git checkout feature/my-feature

# Create new branch
git checkout -b feature/new-feature

# Delete branch
git branch -d feature/old-feature
```

---

## 📊 **CHECKING ALL REPOSITORIES AT ONCE**

Create this helper command:

```bash
# Navigate to parent directory
cd /Users/rahul/Documents/Mindsphere\ V1\ Separated

# Check status of all repos
for repo in mindsphere-*; do
  echo "📁 $repo:"
  cd "$repo"
  git status -s
  cd ..
  echo ""
done
```

---

## 🎯 **YOUR TYPICAL DAY**

### **Morning: Start Fresh**

```bash
# 1. Navigate to project
cd /Users/rahul/Documents/Mindsphere\ V1\ Separated

# 2. Pull latest changes in all repos
cd mindsphere-frontend && git pull origin main && cd ..
cd mindsphere-backend && git pull origin main && cd ..

# 3. Start services
./start-all.sh

# 4. Open browser to http://localhost:5173
```

### **During Day: Making Changes**

```bash
# Work on feature in your editor (VSCode/Cursor)

# When ready to save progress:
cd mindsphere-frontend  # or whichever repo

git add .
git commit -m "feat: description of what you did"
git push origin main
```

### **Evening: Wrap Up**

```bash
# Make sure everything is pushed
cd mindsphere-frontend && git status
cd ../mindsphere-backend && git status

# Commit and push any unsaved work
git add .
git commit -m "chore: end of day save"
git push origin main

# Stop services (Ctrl+C in terminals)
```

---

## 🚨 **COMMON ISSUES & SOLUTIONS**

### **Issue: "Your branch is behind origin/main"**

```bash
git pull origin main
# Resolve any conflicts if they appear
# Then continue working
```

### **Issue: "Merge conflict"**

```bash
# Git will show conflicted files
# Open the files in your editor
# Look for <<<<<<< HEAD markers
# Manually resolve conflicts
# Then:
git add .
git commit -m "merge: resolve conflicts"
git push origin main
```

### **Issue: "I need to work on two computers"**

**On Computer 1:**
```bash
git add .
git commit -m "work in progress"
git push origin main
```

**On Computer 2:**
```bash
git pull origin main
# Continue working
```

### **Issue: "I accidentally pushed wrong code"**

```bash
# Create a new commit that undoes the change
git revert HEAD
git push origin main

# OR if you haven't pushed yet
git reset --soft HEAD~1
# Fix the code
git add .
git commit -m "correct commit message"
git push origin main
```

---

## 📱 **WORKING WITH DIFFERENT SERVICES**

### **Frontend Only Changes** (Most Common)
```bash
cd mindsphere-frontend
# Make changes
git add . && git commit -m "feat: ui update" && git push
```

### **Backend Only Changes**
```bash
cd mindsphere-backend
# Make changes
git add . && git commit -m "feat: api update" && git push
```

### **Both Frontend + Backend** (Feature spanning services)
```bash
# Do backend first (so API is ready)
cd mindsphere-backend
git add . && git commit -m "feat(api): add endpoint" && git push

# Then frontend
cd ../mindsphere-frontend
git add . && git commit -m "feat(ui): use new endpoint" && git push
```

---

## 🎓 **BEST PRACTICES**

1. **✅ Commit Often** - Small, focused commits
2. **✅ Pull Before Push** - Always `git pull` before starting work
3. **✅ Clear Messages** - Describe what you changed and why
4. **✅ Test Before Pushing** - Make sure it works locally
5. **✅ One Feature Per Commit** - Don't mix unrelated changes
6. **✅ Push Daily** - Don't let code sit uncommitted

---

## 🔗 **QUICK COMMAND CHEAT SHEET**

```bash
# Most used commands (90% of your work)
git status              # Check what changed
git add .               # Stage all changes
git commit -m "msg"     # Commit changes
git push origin main    # Push to GitHub
git pull origin main    # Pull from GitHub

# Branch work
git checkout -b feature/name  # New branch
git checkout main             # Switch to main
git push origin feature/name  # Push branch

# Undo stuff
git checkout -- file    # Undo file changes
git reset HEAD~1        # Undo last commit (keep changes)
```

---

## 🎯 **YOUR WORKFLOW SUMMARY**

**Every time you code:**

1. `git pull origin main` ← Get latest
2. Make your changes
3. `git add .` ← Stage changes
4. `git commit -m "what you did"` ← Save locally
5. `git push origin main` ← Push to GitHub

**That's it! These 5 steps are your daily workflow. 🚀**

---

## 📞 **GETTING HELP**

- Git confused? Run: `git status`
- Need history? Run: `git log --oneline`
- Forgot command? Check this file
- Major issue? `git stash` to save work, then ask for help

---

**Save this file! This is your daily reference guide. 📖**

