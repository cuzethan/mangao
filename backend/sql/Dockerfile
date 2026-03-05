FROM postgres:18

ENV POSTGRES_DB=""
ENV POSTGRES_USER=""
ENV POSTGRES_PASSWORD=""

COPY ./init-db.sql /docker-entrypoint-initdb.d/

EXPOSE 5432