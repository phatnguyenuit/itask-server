FROM postgres:12-alpine
COPY initdb.sh /docker-entrypoint-initdb.d/