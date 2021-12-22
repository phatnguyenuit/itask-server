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