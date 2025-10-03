# Changelog

All notable changes to MindSphere will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.1.0] - 2025-01-21

### Fixed
- **Session Type Filtering** - Fixed metrics, list, and chips not properly filtering by selected session type (Meditation/Sleep Story)
- **Stats Calculation** - Corrected analytics to use API-filtered data instead of frontend-filtered data
- **Mood Filtering** - Mood chips now show only moods available for the selected session type
- **Query Management** - React Query now properly invalidates and refetches when session type changes
- **Mood Filter Reset** - Mood filter automatically resets when switching between session types

### Added
- **Debug Logging** - Added comprehensive logging for troubleshooting session type filtering
- **Query Optimization** - Enhanced React Query configuration for better caching and refetching

### Technical Details
- **API Integration** - Fixed query key structure to properly trigger refetches
- **Data Flow** - Corrected data flow from API → stats calculation → UI display
- **State Management** - Improved state management for session type switching
- **Error Handling** - Enhanced error handling for session type filtering

## [3.0.0] - 2025-01-21

### Added
- **Google Cloud TTS Studio-O Voice** - Upgraded to premium `en-US-Studio-O` voice for superior audio quality
- **Aimee Narrator** - Consistent female narrator across all content types
- **Duration-Based Prompts** - Dynamic word count calculation based on session duration (100 words/minute for sleep stories, 120 words/minute for meditations)
- **Percentage-Based Structure** - All content sections now use percentages of total words instead of fixed numbers
- **Session Type Filtering** - Separate analytics for Meditation and Sleep Story sessions in habit tracker
- **Enhanced Personalization** - Direct user name integration without safe variables for more natural content
- **Complete SSML Generation** - AI now generates complete, valid SSML without truncation
- **Bypassed Sanitization** - Direct AI output to TTS for maximum content fidelity
- **Global Header** - Integrated header with logo, streak, and ambient player on all pages including session pages

### Changed
- **Voice Configuration** - Switched from `en-US-Studio-Q` to `en-US-Studio-O` for better audio quality
- **Prompt System** - Updated prompts to be Studio-O compatible (removed `volume` attributes)
- **Content Structure** - Meditation: 40% intro, 50% main practice, 5% integration, 5% closing
- **Content Structure** - Sleep Stories: 20% opening, 60% main story, 20% fade out
- **Analytics Display** - Month-specific metrics (Total Sessions, Total Time, Completion Rate) filtered by session type
- **Streak Analytics** - Overall streaks (Current Streak, Best Streak) remain global
- **Default User Name** - Changed from "friend" to "Rahul" for better personalization

### Fixed
- **Incomplete SSML** - AI now generates complete SSML with proper closing tags
- **Template Variables** - Fixed AI not properly substituting user names and notes
- **Audio Generation** - Resolved "Invalid SSML" errors with Studio-O voice
- **Session Page Header** - Removed redundant header, now uses global IntegratedHeader
- **Habit Tracker Date Issues** - Fixed "today" indicator and streak calculations
- **Longest Break Calculation** - Corrected logic to only count consecutive missed days after first session

### Removed
- **Sanitization Step** - Bypassed SSML sanitization to send raw AI output directly to TTS
- **Safe Variables** - Removed `safeUserName` and `safeUserNotes` in favor of direct variable usage
- **Volume Attributes** - Removed `volume` attributes from SSML as Studio-O doesn't support them
- **Sanitization API** - Removed `/api/v1/session/:id/sanitize-script` endpoint

### Technical Details
- **OpenAI Prompts** - Enhanced with explicit instructions for complete SSML generation
- **Token Limits** - Increased `max_tokens` to `Math.min(targetWords * 3, 6000)` for longer content
- **Database Schema** - Added `kind` column to sessions table for session type filtering
- **API Endpoints** - Updated `/api/v1/usage/daily` to support `kind` parameter filtering
- **Frontend Components** - Added session type tabs to HabitTrackerCard
- **TTS Configuration** - Updated voice settings for Studio-O compatibility

## [2.0.0] - 2025-01-20

### Added
- **Complete Dashboard Redesign** - Replaced complex dashboard with 2 focused cards
- **Habit Tracker Calendar** - Visual calendar with green/red dots and analytics
- **Sessions Library** - Complete session history with filters and inline playback
- **View-Only Sessions** - Read-only session viewer for historical sessions
- **Vector Search** - AI-powered similarity search for notes and sessions
- **Post-Session Feedback** - 3-point rating system with text feedback
- **Session Analytics** - Word count, duration tracking, and usage patterns
- **Advanced Filtering** - Search and filter sessions by multiple criteria
- **Streak Analytics** - Current and best streak tracking with detailed stats
- **Content Discovery** - Find similar sessions and meditation styles

### Changed
- **Google Cloud TTS** - Exclusive use of Google Cloud TTS with Neural2 voices and SSML support
- **SSML Implementation** - ASCII-only Google-safe SSML generation with sanitization and validation
- **Enhanced Prompts** - TTS-optimized content generation for meditation and sleep stories
- **Database Schema** - Enhanced sessions table with feedback and analytics
- **API Optimization** - New endpoints for usage analytics and library management
- **Mobile-First Design** - Improved responsive design and touch interactions

### Removed
- **Legacy TTS Services** - Removed all ElevenLabs, Gemini TTS, and OpenAI TTS integrations
- **Complex Dashboard** - Simplified to focus on core functionality

## [1.0.0] - 2025-01-19

### Added
- **Core Meditation Platform** - Basic meditation session creation and management
- **AI Content Generation** - OpenAI-powered meditation scripts and sleep stories
- **Text-to-Speech** - Multiple TTS provider support
- **Database Integration** - Supabase for data persistence
- **Basic Analytics** - Session tracking and user metrics
- **Monochrome Design** - Premium, distraction-free UI
- **React Query** - Server state management
- **Vector Search** - pgvector-powered similarity search
- **Journaling** - AI-powered emotion analysis

### Technical Foundation
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, OpenAI API, Supabase
- **Database**: PostgreSQL with pgvector extension
- **Deployment**: Docker support with environment configuration

---

## Migration Guide

### Upgrading to v3.0.0

1. **Update Environment Variables**:
   ```env
   CLOUD_TTS_VOICE=en-US-Studio-O
   ```

2. **Run Database Migration**:
   ```sql
   ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS kind text;
   CREATE INDEX IF NOT EXISTS idx_sessions_kind ON public.sessions(kind);
   ```

3. **Update Frontend**:
   - Session type filtering is now available in habit tracker
   - Global header is now shown on all pages
   - Analytics display has been updated

4. **Test Audio Generation**:
   - Verify Studio-O voice is working
   - Check SSML generation is complete
   - Test different session types and durations

### Breaking Changes

- **Voice Change**: `en-US-Studio-Q` → `en-US-Studio-O`
- **API Changes**: Added `kind` parameter to usage analytics
- **UI Changes**: Global header now appears on session pages
- **Database**: Added `kind` column to sessions table

---

## Support

For questions about specific versions or migration issues:
- Check the troubleshooting section in README.md
- Review the API documentation
- Test with the provided curl commands

---

**Built with ❤️ for mental wellness and mindfulness**
