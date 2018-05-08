FROM node:10.0.0-alpine

# Add non-root user
RUN addgroup -S nupp && adduser -S -g nupp api

# Set HOME environment variable
ENV HOME=/home/api

WORKDIR $HOME/code

# Set a non-root user as default
USER api

# Expose server port
EXPOSE 8088

# Start node server. Container will shut down if this terminates.
CMD [ "npm", "start" ]
