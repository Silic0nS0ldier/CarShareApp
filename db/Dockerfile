FROM node:9.11.1-alpine

# Add non-root user
RUN addgroup -S nupp && adduser -S -g nupp migrator

# Set HOME environment variable
ENV HOME=/home/migrator

WORKDIR $HOME/code

# Set a non-root user as default
USER migrator

# Start node server. Container will shut down if this terminates.
CMD [ "npm", "run", "migrate" ]
