FROM node:10.0.0-alpine

# Install build dependencies (argon2, sharp)
RUN apk add --update build-base python

# Install build dependencies (sharp)
RUN apk add vips-dev fftw-dev --update-cache --repository https://dl-3.alpinelinux.org/alpine/edge/testing/

# Needed to resolve issue with node-gyp. Uncomment, 
# delete node_modules and use --build if API won't start properly.
# RUN apk add python make gcc g++

# Add non-root user
RUN addgroup -S nupp && adduser -S -g nupp api

# Set HOME environment variable
ENV HOME=/home/api

WORKDIR $HOME/code

# Set a non-root user as default
USER api

# Expose server port
EXPOSE 8088
