#!/usr/bin/env bash
set -e

echo "Starting PostgreSQL service..."
service postgresql start || /etc/init.d/postgresql start

echo "Configuring PostgreSQL user and database..."
# Run under user postgres
su - postgres -c "psql -tc \"SELECT 1 FROM pg_roles WHERE rolname = 'textile_user'\"" | grep -q 1 || \
su - postgres -c "psql -c \"CREATE USER textile_user WITH PASSWORD '1234' SUPERUSER;\""

su - postgres -c "psql -tc \"SELECT 1 FROM pg_database WHERE datname = 'textile_db'\"" | grep -q 1 || \
su - postgres -c "psql -c \"CREATE DATABASE textile_db OWNER textile_user;\""

echo "PostgreSQL setup complete and running!"
