#!/bin/bash
set -e

# Create new login role
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
-c \
"CREATE ROLE $POSTGRES_ITASK_USER \
WITH \
SUPERUSER \
LOGIN \
ENCRYPTED PASSWORD '${POSTGRES_ITASK_PASSWORD}' \
VALID UNTIL 'infinity';"

# Create project database
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
-c "CREATE DATABASE $POSTGRES_ITASK_DB;"

# Restore database if exits
backup_file=/home/backup/${POSTGRES_ITASK_DB}.sql
if [[ -f "$backup_file" ]]
then
    echo "Restoring database '${POSTGRES_ITASK_DB}' with '${backup_file}'..."
    psql -v ON_ERROR_STOP=1 --username "$POSTGRES_ITASK_USER" --dbname "$POSTGRES_ITASK_DB" < $backup_file
fi