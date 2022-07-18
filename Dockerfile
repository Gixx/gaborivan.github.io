# syntax=docker/dockerfile:1
FROM alpine:latest
WORKDIR /app

RUN apk add --no-cache --update bash gcc g++ make nodejs npm ruby ruby-dev
RUN npm install -g webpack webpack-cli && \
    gem install bundle jekyll

CMD tail -f /dev/null

EXPOSE 4000/tcp
