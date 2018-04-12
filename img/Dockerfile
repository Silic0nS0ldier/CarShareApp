FROM node:9.11.1-alpine

# Add non-root user
RUN addgroup -S nupp && adduser -S -g nupp img

# Set HOME environment variable
ENV HOME=/home/img

WORKDIR $HOME/code

# Set a non-root user as default
USER img

# Expose server port
EXPOSE 8888

# Start node server. Container will shut down if this terminates.
CMD [ "npm", "start" ]
