FROM node:10.0.0-alpine

# Add non-root user
RUN addgroup -S nupp && adduser -S -g nupp migrator

# Set HOME environment variable
ENV HOME=/home/migrator

WORKDIR $HOME/code

# Set a non-root user as default
USER migrator
