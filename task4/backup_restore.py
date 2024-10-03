import os
import subprocess
from datetime import datetime
import shutil

# Configuration
DB_NAME = "task4"
BACKUP_DIR = "C:/mongo_backups/task4_backup"
ARCHIVE_DIR = "C:/mongo_backups/task4_archive"
RESTORE_DIR = "C:/mongo_backups/task4_restore"

# Ensure directories exist
os.makedirs(BACKUP_DIR, exist_ok=True)
os.makedirs(ARCHIVE_DIR, exist_ok=True)
os.makedirs(RESTORE_DIR, exist_ok=True)


def backup_db():
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    backup_path = os.path.join(BACKUP_DIR, f"backup_{timestamp}")
    try:
        print(f"Starting backup for database: {DB_NAME}...")
        
        subprocess.run(["mongodump", "--db", DB_NAME, "--out", backup_path], check=True)
        print(f"Backup successful! Backup saved at {backup_path}")

        # Archiving the backup to reduce size
        archive_name = os.path.join(ARCHIVE_DIR, f"backup_{timestamp}.zip")
        shutil.make_archive(archive_name.replace(".zip", ""), 'zip', backup_path)
        print(f"Backup archived at {archive_name}")

    except subprocess.CalledProcessError as e:
        print(f"Error during backup: {e}")

# Function to restore from backup
def restore_db(backup_folder_name):
    # Construct the backup path to the specific backup directory
    backup_path = os.path.join(BACKUP_DIR, backup_folder_name, DB_NAME)
    try:
        print(f"Restoring backup from: {backup_path}...")
        # Running mongorestore command
        subprocess.run(["mongorestore", "--db", DB_NAME, "--dir", backup_path], check=True)
        print(f"Restore successful!")
    except subprocess.CalledProcessError as e:
        print(f"Error during restore: {e}")

if __name__ == "__main__":
    choice = input("Do you want to (1) Backup or (2) Restore? Enter 1 or 2: ")

    if choice == "1":
        backup_db()
    elif choice == "2":
        
        existing_backups = os.listdir(BACKUP_DIR)
        print("Available backup folders:")
        for folder in existing_backups:
            print(f"- {folder}")
        backup_name = input("Enter the name of the backup folder to restore: ")
        restore_db(backup_name)
    else:
        print("Invalid choice. Exiting.")
