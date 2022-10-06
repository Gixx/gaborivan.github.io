# syntax=docker/dockerfile:1
FROM alpine:latest
WORKDIR /app

RUN apk add --no-cache --update sudo bash gcc g++ make nodejs npm ruby ruby-dev
RUN npm install -g webpack webpack-cli
RUN gem install bundle jekyll

ARG UNAME=dev
ARG UID=1000
ARG GID=1000
RUN addgroup -g $GID $UNAME 
RUN adduser -u $UID -G $UNAME -h /home/dev -s /bin/sh -g "" -D $UNAME 
RUN echo "$UNAME ALL=(ALL) NOPASSWD: ALL" > /etc/sudoers.d/$UNAME 
RUN chmod 0440 /etc/sudoers.d/$UNAME

USER $UNAME
CMD tail -f /dev/null

EXPOSE 4000/tcp
