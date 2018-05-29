FROM node:10.0.0-alpine

# Add non-root user
RUN addgroup -S nupp && adduser -S -g nupp gui

# Set HOME environment variable
ENV HOME=/home/gui

WORKDIR $HOME/code

# Set a non-root user as default
USER gui

# Expose server port
EXPOSE 3000
