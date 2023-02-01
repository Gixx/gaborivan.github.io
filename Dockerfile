# syntax=docker/dockerfile:1
FROM gixx/gaborivan:latest
WORKDIR /app

CMD tail -f /dev/null

EXPOSE 4000/tcp
