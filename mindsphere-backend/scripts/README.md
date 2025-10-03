# Scripts Directory

This directory contains utility scripts for database management, music track operations, and other maintenance tasks.

## 📁 Script Files

### Database Scripts
- **`add_music_tracks.js`** - Add music tracks to the database
- **`scan_and_add_tracks.js`** - Scan and add music tracks from directory
- **`remove_placeholder_tracks.js`** - Remove placeholder music tracks
- **`upload_ambient_tracks.js`** - Upload ambient music tracks

## 🚀 Usage

### Running Scripts
```bash
# Navigate to project root
cd /path/to/mindsphere

# Run a script
node scripts/script-name.js

# Or with specific environment
NODE_ENV=production node scripts/script-name.js
```

### Prerequisites
- Node.js 18+
- Backend environment variables configured
- Database connection established
- Required dependencies installed

## 📝 Script Descriptions

### Music Track Management
- **`add_music_tracks.js`**: Manually add specific music tracks to the database
- **`scan_and_add_tracks.js`**: Automatically scan a directory and add all music files
- **`remove_placeholder_tracks.js`**: Clean up placeholder or test tracks
- **`upload_ambient_tracks.js`**: Upload ambient music tracks for meditation sessions

## ⚠️ Important Notes

- Always backup your database before running scripts
- Test scripts in a development environment first
- Some scripts may require specific file permissions
- Check script documentation for specific requirements

## 🔧 Environment Variables

Scripts use the same environment variables as the backend:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- Database connection settings

## 📊 Monitoring

Scripts log their operations to the console and may create log files. Check the output for success/failure messages.

---

*Scripts organized during Phase 2 of the MindSphere code cleanup process*
