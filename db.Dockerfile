FROM postgres:12-alpine
COPY ./backup /home/backup
COPY initdb.sh /docker-entrypoint-initdb.d/