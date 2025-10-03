# MindSphere - Comprehensive Test Cases

## Pre-Cleanup Test Baseline

### 🎯 **Critical User Flows**

#### 1. Authentication Flow
- [ ] User can sign in with valid credentials
- [ ] User can sign up with new account
- [ ] JWT token is properly generated and validated
- [ ] Session persists across page refreshes
- [ ] User can sign out successfully

#### 2. Backend API Health
- [ ] `/health` endpoint returns 200 OK
- [ ] `/cors-info` endpoint returns correct CORS configuration
- [ ] Authentication middleware attaches user correctly
- [ ] Logger middleware logs requests properly

#### 3. Session Management
- [ ] Create new meditation session
- [ ] Fetch session by ID
- [ ] Submit session feedback
- [ ] List user sessions
- [ ] Session state persists correctly

#### 4. Voice Agent Integration
- [ ] Voice token generation works
- [ ] LiveKit room creation succeeds
- [ ] User context fetching works
- [ ] Voice agent connects successfully
- [ ] Room cleanup on disconnect

#### 5. Music & Audio
- [ ] Music tracks load correctly
- [ ] Audio playback works
- [ ] Volume controls function
- [ ] Track switching works
- [ ] Audio stops on pause

#### 6. Journal & Notes
- [ ] Create journal entry
- [ ] Fetch journal entries
- [ ] STT (Speech-to-Text) works
- [ ] Notes CRUD operations
- [ ] Vector similarity search

#### 7. User Profile
- [ ] Fetch user profile
- [ ] Update profile preferences
- [ ] Sync user data
- [ ] Streaks calculation
- [ ] Usage analytics

#### 8. Frontend Components
- [ ] VoiceAgent component renders
- [ ] SessionSetup component works
- [ ] PlayerBar controls audio
- [ ] IntegratedHeader displays correctly
- [ ] MobileNavBar navigation works

#### 9. Error Handling
- [ ] API errors return proper status codes
- [ ] Frontend displays error messages
- [ ] Logger captures errors
- [ ] Network failures handled gracefully
- [ ] Invalid data rejected

#### 10. Performance
- [ ] API response time < 1000ms
- [ ] Frontend loads < 3s
- [ ] Audio latency < 500ms
- [ ] Database queries optimized
- [ ] No memory leaks

---

## 🔧 **Post-Cleanup Test Cases**

### **High Priority Fixes Validation**

#### HF-1: Structured Logging
- [ ] No console.* in backend code
- [ ] No console.* in frontend code
- [ ] No console.* in AI agent code
- [ ] Logger includes correlation IDs
- [ ] Log files created properly
- [ ] Error logs contain stack traces (dev only)

#### HF-2: Duplicate Route Removal
- [ ] Session routes work correctly
- [ ] No duplicate route registrations
- [ ] All endpoints accessible
- [ ] Route precedence correct

#### HF-3: Empty Catch Blocks Fixed
- [ ] Audio errors logged
- [ ] User sees error feedback
- [ ] No silent failures
- [ ] Proper error recovery

#### HF-4: React Version Consistency
- [ ] All services use same React version
- [ ] No peer dependency warnings
- [ ] Build process successful
- [ ] Mobile app runs correctly

### **Medium Priority Fixes Validation**

#### MF-1: Archived Code Removed
- [ ] No commented imports
- [ ] Unused files deleted
- [ ] Clean import statements
- [ ] Build size reduced

#### MF-2: Error Context Added
- [ ] Google credentials errors logged properly
- [ ] All errors have context
- [ ] Service name in logs
- [ ] Operation name in logs

#### MF-3: Environment Variables
- [ ] No hardcoded user IDs
- [ ] Demo mode configurable
- [ ] All secrets in .env
- [ ] Validation at runtime

---

## 🧪 **Automated Test Suite**

### **Backend Tests**
```bash
cd mindsphere-backend
npm test
```

Expected tests:
- [ ] Logger functionality
- [ ] Route authentication
- [ ] Database connections
- [ ] Error handling
- [ ] Voice token generation

### **Frontend Tests**
```bash
cd mindsphere-frontend
npm test
```

Expected tests:
- [ ] Component rendering
- [ ] API client functions
- [ ] Authentication context
- [ ] Audio context
- [ ] State management

---

## 🔍 **Manual Test Scenarios**

### **Scenario 1: Complete User Journey**
1. Open app in browser
2. Sign in with credentials
3. Start meditation session
4. Play background music
5. Use voice agent
6. End session
7. Submit feedback
8. View session history
9. Check profile stats
10. Sign out

**Expected Result:** All steps complete without errors, logs show structured entries

### **Scenario 2: Voice Agent Full Flow**
1. Request voice token
2. Create LiveKit room
3. Connect to voice agent
4. Verify user context loaded
5. Have conversation
6. Disconnect
7. Verify room cleanup

**Expected Result:** Voice works, context personalized, cleanup successful

### **Scenario 3: Error Recovery**
1. Try invalid API call
2. Check error logged properly
3. Verify user sees error message
4. Retry operation
5. Verify success

**Expected Result:** Graceful error handling, proper logging, user feedback

---

## 📊 **Performance Benchmarks**

### **Before Cleanup**
- Backend startup: ___ms
- Frontend load: ___ms
- Voice connection: ___ms
- API response (avg): ___ms
- Memory usage: ___MB

### **After Cleanup**
- Backend startup: ___ms (should be similar)
- Frontend load: ___ms (should be faster)
- Voice connection: ___ms (should be similar)
- API response (avg): ___ms (should be similar)
- Memory usage: ___MB (should be lower)

---

## 🎯 **Regression Test Checklist**

After each fix, verify:
- [ ] App starts without errors
- [ ] Authentication works
- [ ] Voice agent connects
- [ ] Music plays
- [ ] Sessions save
- [ ] Logs show structured output
- [ ] No console.* in production
- [ ] Error handling works
- [ ] Performance maintained
- [ ] Mobile app works

---

## 🚀 **Deployment Validation**

### **Pre-Deployment**
- [ ] All tests pass
- [ ] Linter passes
- [ ] Build succeeds
- [ ] No security vulnerabilities
- [ ] Documentation updated

### **Post-Deployment**
- [ ] Health checks pass
- [ ] Logs flowing properly
- [ ] Monitoring alerts clear
- [ ] User sessions working
- [ ] Voice agent operational

---

## 📝 **Test Execution Log**

Date: ___________
Tester: AI Assistant
Environment: Local Development

| Test Case | Status | Notes |
|-----------|--------|-------|
| Authentication | ⏳ | Pending |
| Backend API | ⏳ | Pending |
| Sessions | ⏳ | Pending |
| Voice Agent | ⏳ | Pending |
| Music/Audio | ⏳ | Pending |
| Journal/Notes | ⏳ | Pending |
| User Profile | ⏳ | Pending |
| Frontend UI | ⏳ | Pending |
| Error Handling | ⏳ | Pending |
| Performance | ⏳ | Pending |

Legend: ✅ Pass | ❌ Fail | ⏳ Pending | ⚠️ Warning

---

## 🔄 **Rollback Plan**

If critical issues found:
1. Revert to previous commit
2. Document failure reason
3. Create isolated fix
4. Re-test in isolation
5. Deploy incremental fix

**Rollback Command:**
```bash
git revert HEAD
git push origin main
```

