# HR Hub Zambia - Backup Instructions and Recovery Guide

Date: May 14, 2026
Version: 1.0.0
Complete Backup and Recovery Procedures

---

## Purpose of This Guide

This guide explains how to:
- Create backups of your HR Hub Zambia system
- Store backups safely
- Restore from backups if needed
- Plan a backup schedule

---

## What Needs to Be Backed Up

Critical File:
- data/hr_database.db

This single file contains all your HR data:
- All employee records
- All activity logs
- All department information
- All custom entries

Everything else can be regenerated or downloaded again.

---

## Backup Methods

### Method 1: Automated Script (Fastest - Windows)

Step 1: Locate the Project Folder
- Find the folder containing HR Hub Zambia

Step 2: Run the Backup Script
- Double-click: CREATE_BACKUP.bat
- Script automatically creates a ZIP file

Step 3: Verify
- Check Desktop for ZIP file
- File named: hr_hub_zambia_backup_[DATE].zip

Step 4: Move to Safe Location
- Copy ZIP file to external drive
- Or upload to cloud storage
- Or store on backup server

### Method 2: Manual Backup (Works on All Platforms)

Windows:
1. Open file explorer
2. Navigate to: New folder\data\
3. Right-click on: hr_database.db
4. Select: Copy
5. Navigate to backup location
6. Right-click and select: Paste
7. Date-stamp the file: hr_database.db_2026-05-14

Mac/Linux:
1. Open terminal
2. Navigate to project folder
3. Run: cp data/hr_database.db backup/hr_database.db_$(date +%Y-%m-%d)
4. Verify: ls -la backup/

### Method 3: Complete Project Backup

For Full Backup (includes all files):

Windows:
1. Right-click project folder
2. Select: Send to > Compressed folder
3. Name file with date: HR_Hub_2026-05-14.zip
4. Store in safe location

Mac/Linux:
1. Open terminal
2. Run: tar -czf hr_hub_backup_2026-05-14.tar.gz "New folder"
3. Store file in safe location

---

## Backup Storage Options

### Local Storage
Pros: Fast access, immediate availability
Cons: Lost in case of system failure
Recommendation: Use as temporary storage only

External Hard Drive:
- Cost: 50-200+ currency units
- Capacity: 1-4 TB (sufficient for many years of backups)
- Pros: Portable, reliable, removable
- Cons: Can be lost or damaged

USB Flash Drive:
- Cost: 20-100+ currency units
- Capacity: 32-256 GB
- Pros: Portable, convenient
- Cons: Easy to lose, limited capacity

### Cloud Storage
Pros: Remote access, automatic sync, secure
Cons: Requires internet connection, ongoing cost
Options:
- Google Drive (15 GB free)
- Microsoft OneDrive (5 GB free)
- Dropbox (2 GB free)
- NextCloud (self-hosted)

Setup for Cloud Backup:
1. Install cloud service
2. Create backup folder
3. Copy database file to folder
4. Automatic sync handles rest

### Network Backup
Pros: Automated, centralized, scalable
Cons: Requires network setup
Options:
- Network storage device (NAS)
- Server storage
- Backup service provider

---

## Backup Schedule Recommendations

Frequency by Organization Size:

Small Team (1-10 employees):
- Weekly backup sufficient
- Or whenever significant changes made

Medium Team (11-50 employees):
- Twice weekly recommended
- Or daily if critical operations

Large Team (50+ employees):
- Daily backup recommended
- Or continuous backup service

Critical Operations:
- Before major changes: Immediate backup
- Before year-end closing: Backup
- After payroll processing: Backup
- Before system updates: Backup

---

## Automated Backup Setup

### Windows Task Scheduler

Step 1: Open Task Scheduler
- Press: Windows + R
- Type: taskschd.msc
- Press: Enter

Step 2: Create New Task
- Click: Create Basic Task
- Name: HR Hub Daily Backup
- Trigger: Daily at specific time
- Action: Run batch file

Step 3: Configure Action
- Program: C:\path\to\CREATE_BACKUP.bat
- Start in: C:\path\to\project\

Step 4: Enable and Test
- Click: OK to save
- Right-click task and select: Run
- Verify backup created

### Mac/Linux Cron Job

Step 1: Open Terminal
Step 2: Edit crontab
- Command: crontab -e

Step 3: Add Daily Backup
```
0 2 * * * cp ~/projects/New\ folder/data/hr_database.db ~/backups/hr_database.db_$(date +\%Y-\%m-\%d)
```

Step 4: Save and Exit
- Press: Ctrl + X (or :wq in vi)
- Backup runs daily at 2:00 AM

---

## Restore from Backup

### When You Need to Restore

Situations requiring restore:
- Database corrupted
- Accidental data deletion
- System failure
- Data loss incident
- Returning to previous state

### Restore Procedure

Step 1: Stop the Server
- If running, press: Ctrl + C in terminal
- Wait for server to fully stop

Step 2: Backup Current Database
- Copy current: data/hr_database.db
- Rename to: hr_database.db_corrupted
- Purpose: Preserve current state for investigation

Step 3: Get Backup File
- Locate your backup copy
- Could be on:
  - External drive
  - Cloud storage
  - Network drive
  - Backup folder

Step 4: Copy Backup to Project
- Copy backup file: hr_database.db
- Paste into: New folder\data\
- Replace the corrupted version

Step 5: Verify File
- Check file size (should be reasonable)
- Check file date (should match backup date)
- Confirm filename: hr_database.db

Step 6: Restart Server
- Run: npm start
- Server should start normally
- Data should be restored to backup point

Step 7: Verify Data
- Open: http://localhost:3000
- Check employee list
- Verify data matches backup date
- Check for any missing entries

### Verify Restore Success

Verification Steps:
1. All employees present
2. All activities recorded
3. All departments intact
4. Statistics calculate correctly
5. No console errors
6. No browser errors (F12 console)

---

## Disaster Recovery Plan

### Complete System Loss

If you lose everything:

Step 1: Reinstall Node.js
- Download from: nodejs.org
- Install on your system
- Verify: node --version

Step 2: Get Project Files
- Download from original source
- Or get from version control (if available)
- Or restore from project backup

Step 3: Install Dependencies
- Navigate to project folder
- Run: npm install
- Wait for installation complete

Step 4: Restore Database
- Get backup file: hr_database.db
- Place in: New folder\data\
- Create data folder if needed

Step 5: Start Server
- Run: npm start
- Server should start with your data
- Verify data is present

Step 6: Backup Restored System
- Immediately create new backup
- Store in multiple safe locations
- Document recovery date/time

---

## Testing Your Backup

Verify Backups Are Usable

Monthly Test Procedure:
1. Make copy of backup file
2. Stop production server
3. Restore from backup copy to test system
4. Verify all data present and correct
5. Check for any data loss
6. Document test results
7. Restart production server

Why Test Backups:
- Confirm backups are actually usable
- Discover restore problems before disaster
- Practice restore procedure
- Verify no data corruption in backups
- Build confidence in backup system

---

## Data Retention Policy

How Long to Keep Backups

Recommended Retention:
- Current year: Keep all backups
- Previous year: Keep monthly backups
- Older: Keep quarterly backups
- Archives: Keep yearly copies

Minimum Retention:
- Keep at least 2 recent full backups
- Keep 1 backup older than 30 days
- Keep 1 yearly archive copy

---

## Backup Security

Protecting Your Backups

Risk: Unauthorized Access
- Store backups securely
- Use encryption if available
- Limit access to authorized personnel
- Document who has backup access

Risk: Physical Loss
- Keep multiple copies
- Store in different locations
- Use waterproof/fireproof storage
- Consider off-site storage

Risk: Data Corruption
- Test backups regularly
- Use reliable storage media
- Monitor storage device health
- Replace old external drives

Risk: Accidental Deletion
- Prevent overwriting
- Use read-only storage
- Implement version control
- Create write-once backups

---

## Backup Storage Location Ideas

Recommended Locations:
1. Primary: External hard drive in safe location
2. Secondary: Cloud storage with daily sync
3. Tertiary: USB drive in fireproof box
4. Archive: Yearly copies stored elsewhere

Multi-Location Strategy:
- Location 1: Office desk (daily access)
- Location 2: Office safe/vault (critical backup)
- Location 3: Remote location (disaster backup)
- Location 4: Cloud (instant access anywhere)

---

## Maintenance Tasks

Daily (Automated):
- System continues to operate normally
- Backup runs automatically if configured

Weekly (Manual):
- Verify recent backup file exists
- Check backup file size is reasonable
- Spot-check one backup by viewing contents

Monthly (Manual):
- Test restore from one backup
- Document verification success
- Review backup storage locations
- Check external drive health

Quarterly (Manual):
- Review backup strategy
- Update retention policy if needed
- Archive old backups
- Plan for future storage needs

---

## Troubleshooting Backup Issues

Problem: Backup script does not work
Solution: 
- Run CREATE_BACKUP.bat from administrator account
- Ensure 7-Zip is installed (for compression)
- Check disk space available
- Try manual backup method instead

Problem: Cannot find backup file
Solution:
- Check Desktop folder
- Search computer for recent ZIP files
- Check all backup locations
- Verify backup script ran successfully

Problem: Restore does not work
Solution:
- Verify backup file is valid
- Check file size (should be significant, not 0 bytes)
- Stop server before restore
- Copy backup file exactly to correct location
- Restart server

Problem: Data missing after restore
Solution:
- Verify you used correct backup file
- Confirm backup date matches expected data
- Check restore procedure was followed correctly
- Try different backup file if available
- Contact support if data still missing

---

## Backup Checklist

Before Using System for Production:
- Initial backup created: Yes/No
- Backup stored in safe location: Yes/No
- Backup tested and verified: Yes/No
- Backup location documented: Yes/No

During Operation:
- Regular backups being created: Yes/No
- Backup locations multiple: Yes/No
- Backups tested monthly: Yes/No
- Restore procedure documented: Yes/No
- Team trained on restore: Yes/No

In Case of Data Loss:
- Shutdown system immediately: Yes/No
- Locate backup file: Yes/No
- Restore procedure initiated: Yes/No
- Verify all data present: Yes/No
- Document incident: Yes/No

---

## Emergency Contact Information

Save This Information:

Primary Backup Location:
- Address: ____________________________
- Contact: ____________________________
- Phone: ____________________________

Secondary Backup Location:
- Address: ____________________________
- Contact: ____________________________
- Phone: ____________________________

System Administrator:
- Name: ____________________________
- Phone: ____________________________
- Email: ____________________________

Database Manager:
- Name: ____________________________
- Phone: ____________________________
- Email: ____________________________

---

## Recovery Time Objective (RTO)

How Long Restore Takes

Expected Restore Time:
- Stop server: 1 minute
- Locate backup: 5-15 minutes
- Copy backup to system: 2-5 minutes
- Restart server: 1-2 minutes
- Verify restoration: 5-10 minutes

Total Time: Approximately 20-35 minutes

Planning Assumption:
- Have 1 hour downtime planned for complete recovery
- Test restore to confirm timing in your environment

---

## Business Continuity Planning

Minimize Downtime

Steps:
1. Have recent backup verified and ready
2. Document restore procedure clearly
3. Train multiple people on restore
4. Have all contact information available
5. Have spare server/computer available
6. Keep restore utilities accessible
7. Practice restore procedure annually
8. Maintain emergency response plan

---

## Summary and Quick Start

Quick Backup Creation:
1. Windows: Double-click CREATE_BACKUP.bat
2. Mac/Linux: Manual copy of data/hr_database.db
3. Store in safe location with date label
4. Test restore monthly

Quick Restore:
1. Stop server (Ctrl + C)
2. Backup current database
3. Copy backup to data/hr_database.db
4. Restart server (npm start)
5. Verify data present

---

## Conclusion

Reliable backups are essential for protecting your organization's HR data. By following this guide, you can ensure your data is safe and recoverable in any situation.

Key Takeaways:
- Back up the database file only
- Store in multiple secure locations
- Test backups regularly
- Keep automated backup schedule
- Document restore procedures
- Train staff on recovery

For questions or assistance, refer to SETUP_INSTRUCTIONS.md or contact your system administrator.

Document Date: May 14, 2026
Status: Complete
Version: 1.0.0
