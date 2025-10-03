# Quick Reference Card

## 🚀 One-Time Setup

```bash
# 1. Initialize Git
./setup-git-repos.sh

# 2. Create GitHub repos at: https://github.com/new
#    - mindsphere-frontend
#    - mindsphere-backend
#    - mindsphere-ai-agent
#    - mindsphere-mobile

# 3. Connect to GitHub
./add-git-remotes.sh YOUR_USERNAME

# 4. Configure .env files
cd mindsphere-frontend && cp env.example .env && cd ..
cd mindsphere-backend && cp env.example .env && cd ..
cd mindsphere-ai-agent && cp env.example .env && cd ..
```

---

## 💻 Daily Commands

### Start Services
```bash
./start-all.sh
```

### Start Individual Service
```bash
cd mindsphere-frontend && npm run dev
cd mindsphere-backend && npm start
cd mindsphere-ai-agent && npm start
```

### Create Feature
```bash
cd mindsphere-frontend
git checkout -b feature/my-feature
# Make changes
git add .
git commit -m "feat: add feature"
git push origin feature/my-feature
```

### Update from Main
```bash
git checkout main
git pull origin main
```

---

## 📍 Service URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Health: http://localhost:8000/health

---

## 🔧 Useful Commands

```bash
# Check Git status all repos
for repo in mindsphere-*; do echo "📁 $repo" && cd $repo && git status -s && cd ..; done

# Pull all repos
for repo in mindsphere-*; do cd $repo && git pull && cd ..; done

# Check running services
lsof -i :8000 -i :5173 | grep LISTEN

# Kill port
lsof -ti :8000 | xargs kill
```

---

## 📁 Repository Structure

```
mindsphere-frontend/    # React app (Port 5173)
mindsphere-backend/     # Express API (Port 8000)
mindsphere-ai-agent/    # LiveKit agent
mindsphere-mobile/      # React Native
```

---

## 📚 Full Documentation

- `SETUP_COMPLETE.md` - Complete setup guide
- `GIT_WORKFLOW_GUIDE.md` - Git workflow
- `README.md` - Project overview
- Each repo's `README.md` - Service docs

