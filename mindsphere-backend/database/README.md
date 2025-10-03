# Database Directory

This directory contains SQL scripts, migrations, and database-related files for the MindSphere application.

## 📁 File Structure

### Migration Scripts
- **`fix_database_schema.sql`** - Fixes database schema issues
- **`migrate_existing_data.sql`** - Migrates existing data to new schema
- **`SUPABASE_MIGRATION_USER_PROFILE.sql`** - User profile migration
- **`update_music_tracks.sql`** - Updates music tracks table

### Test Scripts
- **`test_database_fix.sql`** - Test database fixes
- **`test_migration.sql`** - Test migration scripts

## 🚀 Usage

### Running SQL Scripts
```bash
# Using Supabase CLI
supabase db reset
supabase db push

# Using psql directly
psql -h your-host -U your-user -d your-database -f database/script-name.sql

# Using Supabase Dashboard
# Copy and paste script content into SQL editor
```

### Migration Order
1. Run schema fixes first
2. Apply data migrations
3. Run updates
4. Test with test scripts

## 📝 Script Descriptions

### Schema Management
- **`fix_database_schema.sql`**: Fixes common database schema issues
- **`migrate_existing_data.sql`**: Migrates existing data to new schema structure

### User Management
- **`SUPABASE_MIGRATION_USER_PROFILE.sql`**: Sets up user profile tables and relationships

### Content Management
- **`update_music_tracks.sql`**: Updates music tracks table structure and data

### Testing
- **`test_database_fix.sql`**: Tests database fixes and validations
- **`test_migration.sql`**: Tests migration scripts and data integrity

## ⚠️ Important Notes

- **Always backup your database** before running any scripts
- **Test in development environment** first
- **Review scripts** before execution
- **Check dependencies** between scripts
- **Monitor execution** for errors

## 🔧 Environment Setup

Scripts require:
- Database connection (Supabase PostgreSQL)
- Appropriate permissions
- Required extensions (pgvector, etc.)

## 📊 Monitoring

- Check script output for success/failure
- Monitor database logs
- Verify data integrity after execution
- Test application functionality

## 🔄 Version Control

- Scripts are version controlled
- Changes should be documented
- Migration scripts should be immutable once deployed
- Use new scripts for modifications

---

*Database files organized during Phase 2 of the MindSphere code cleanup process*
