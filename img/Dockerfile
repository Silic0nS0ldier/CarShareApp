FROM node:10.0.0-alpine

# Add non-root user
RUN addgroup -S nupp && adduser -S -g nupp img

# Set HOME environment variable
ENV HOME=/home/img

WORKDIR $HOME/code/img

# Set a non-root user as default
USER img

# Expose server port
EXPOSE 8888
